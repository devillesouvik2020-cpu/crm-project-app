const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const cors = require('cors');
const path = require('path');
const http = require('http');
const https = require('https');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Import routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const crmRoutes = require('./routes/crm');
const inviteRoutes = require('./routes/invites');
const resourceRoutes = require('./routes/resources');

const app = express();
const PORT = process.env.PORT || 5000;
const SERVER_URL = process.env.RENDER_EXTERNAL_URL || process.env.SERVER_URL || `http://localhost:${PORT}`;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/invites', inviteRoutes);
app.use('/api/resources', resourceRoutes);

// Keep-Alive & Health Check Metrics
let pingStats = {
  lastPingTime: null,
  totalPings: 0,
  successfulPings: 0,
  failedPings: 0
};

// Health check with database connection & pool metrics
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];

  res.json({
    status: 'OK',
    serverTime: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: states[dbState] || 'Unknown',
      readyState: dbState,
      name: mongoose.connection.name || 'crm-db'
    },
    keepAlive: {
      configuredUrl: SERVER_URL,
      stats: pingStats
    },
    memoryUsageMB: Math.round(process.memoryUsage().rss / 1024 / 1024)
  });
});

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

// Keep-Alive / Anti-Cold-Start Ping Mechanism for Render.com
function setupRenderKeepAlive(targetUrl) {
  // Free tier on Render spins down after 15 mins of inactivity. Ping every 12 mins (720,000 ms).
  const PING_INTERVAL_MS = 12 * 60 * 1000;

  console.log(`[Keep-Alive] Initializing self-ping worker targeting: ${targetUrl}/api/health`);
  console.log(`[Keep-Alive] Ping interval set to ${PING_INTERVAL_MS / 60000} minutes`);

  setInterval(() => {
    const healthUrl = `${targetUrl}/api/health`;
    const client = healthUrl.startsWith('https') ? https : http;

    pingStats.totalPings++;
    pingStats.lastPingTime = new Date().toISOString();

    const req = client.get(healthUrl, (res) => {
      if (res.statusCode === 200) {
        pingStats.successfulPings++;
        console.log(`[Keep-Alive Ping OK] Server kept warm at ${pingStats.lastPingTime}`);
      } else {
        pingStats.failedPings++;
        console.warn(`[Keep-Alive Ping Warning] Status code ${res.statusCode} at ${pingStats.lastPingTime}`);
      }
    });

    req.on('error', (err) => {
      pingStats.failedPings++;
      console.warn(`[Keep-Alive Ping Error] ${err.message}`);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      console.warn('[Keep-Alive Ping Timeout] Ping request timed out');
    });
  }, PING_INTERVAL_MS);
}

// Seed default Admin / Project Manager user for rapid testing
async function seedDefaultAdmin() {
  try {
    const existingAdmin = await User.findOne({ mobileNumber: '9876543210' });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      const defaultAdmin = new User({
        name: 'Subhashis Bera (Admin)',
        email: 'subhashis@projectcrm.com',
        mobileNumber: '9876543210',
        passwordHash,
        userType: 'Admin',
        designation: 'Managing Director / PM',
        languagePref: 'en'
      });
      await defaultAdmin.save();
      console.log('✅ Default Admin account created: Mobile: 9876543210 | Password: admin123');
    }
  } catch (err) {
    console.error('Admin seeding notice:', err.message);
  }
}

// Start server with Connection Pooling & resilient MongoDB connection
async function startServer() {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.log('No MONGODB_URI found in environment. Starting MongoDB Memory Server for local dev...');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log(`MongoDB Memory Server started at: ${mongoUri}`);
    } else {
      console.log('Connecting to production MongoDB instance via MONGODB_URI...');
    }

    // High performance connection pooling options to prevent cold-start delays
    const mongooseOptions = {
      maxPoolSize: 20,          // Maintain up to 20 socket connections for concurrency
      minPoolSize: 5,           // Maintain minimum 5 warm connections to prevent cold-starts
      socketTimeoutMS: 45000,   // Close sockets after 45s inactivity
      serverSelectionTimeoutMS: 8000, // Timeout after 8s if server unreachable
      heartbeatFrequencyMS: 10000,    // Ping server every 10s for keep-alive
      family: 4                 // Skip IPv6 dns lookup latency
    };

    await mongoose.connect(mongoUri, mongooseOptions);
    console.log('✅ Connected to MongoDB with Connection Pooling (min: 5, max: 20)');

    // Seed default admin
    await seedDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 Health & Keep-Alive endpoint available at ${SERVER_URL}/api/health`);

      // If running on Render or production URL is supplied, start self-ping keep-alive
      if (process.env.RENDER_EXTERNAL_URL || process.env.ENABLE_KEEP_ALIVE === 'true') {
        setupRenderKeepAlive(SERVER_URL);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
