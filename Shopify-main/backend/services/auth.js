const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// ------------------------
// Register a new store
// ------------------------
router.post("/register", async (req, res) => {
  try {
    const { shopDomain, password } = req.body;

    if (!shopDomain || !password) {
      return res.status(400).json({ error: "shopDomain and password are required" });
    }

    // Validate shop domain format
    if (!shopDomain.includes('.myshopify.com')) {
      return res.status(400).json({ error: 'Please provide a valid Shopify domain (e.g., yourstore.myshopify.com)' });
    }

    // Check if auth already exists
    const existingAuth = await prisma.auth.findUnique({ 
      where: { shopDomain } 
    });
    
    if (existingAuth) {
      return res.status(409).json({ error: "Store already registered. Please login." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Auto-generate webhook secret
    const webhookSecret = crypto.randomBytes(32).toString("hex");

    // Check if tenant already exists (from webhooks)
    let tenant = await prisma.tenant.findUnique({ 
      where: { shopDomain } 
    });

    if (!tenant) {
      // Create new tenant if doesn't exist
      tenant = await prisma.tenant.create({
        data: {
          shopDomain,
          webhookSecret,
        },
      });
      console.log(`✅ Created new tenant for ${shopDomain}`);
    } else {
      // Update webhook secret for existing tenant
      tenant = await prisma.tenant.update({
        where: { id: tenant.id },
        data: { webhookSecret }
      });
      console.log(`✅ Updated webhook secret for existing tenant ${shopDomain}`);
    }

    // Create auth record
    const auth = await prisma.auth.create({
      data: {
        shopDomain,
        password: hashedPassword,
        tenantId: tenant.id,
      },
    });

    // Generate JWT
    const token = jwt.sign(
      { 
        authId: auth.id,
        tenantId: tenant.id,
        shopDomain: tenant.shopDomain 
      }, 
      JWT_SECRET, 
      { expiresIn: "7d" }
    );

    res.json({
      message: "Store registered successfully",
      token,
      tenantId: tenant.id,
      shopDomain: tenant.shopDomain,
      hasExistingData: tenant.createdAt < auth.createdAt // Check if tenant existed before auth
    });

  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ------------------------
// Login existing store
// ------------------------
router.post("/login", async (req, res) => {
  try {
    const { shopDomain, password } = req.body;

    if (!shopDomain || !password) {
      return res.status(400).json({ error: "shopDomain and password are required" });
    }

    // Find auth record
    const auth = await prisma.auth.findUnique({ 
      where: { shopDomain },
      include: {
        tenant: true
      }
    });

    if (!auth) {
      return res.status(401).json({ error: "Store not registered. Please register first." });
    }

    if (!auth.isActive) {
      return res.status(401).json({ error: "Account is deactivated. Please contact support." });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, auth.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Update last login
    await prisma.auth.update({
      where: { id: auth.id },
      data: { updatedAt: new Date() }
    });

    // Generate JWT
    const token = jwt.sign(
      { 
        authId: auth.id,
        tenantId: auth.tenantId,
        shopDomain: auth.shopDomain 
      }, 
      JWT_SECRET, 
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      tenantId: auth.tenantId,
      shopDomain: auth.shopDomain,
    });

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ------------------------
// Middleware to verify JWT token
// ------------------------
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ------------------------
// Get current user info and stats
// ------------------------
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const auth = await prisma.auth.findUnique({
      where: { id: req.user.authId },
      include: {
        tenant: {
          include: {
            _count: {
              select: {
                products: true,
                customers: true,
                orders: true,
                fulfillments: true
              }
            }
          }
        }
      }
    });

    if (!auth) {
      return res.status(404).json({ error: 'Auth record not found' });
    }

    res.json({
      shopDomain: auth.shopDomain,
      tenantId: auth.tenantId,
      registeredAt: auth.createdAt,
      lastLogin: auth.updatedAt,
      tenant: {
        id: auth.tenant.id,
        shopDomain: auth.tenant.shopDomain,
        webhookSecret: auth.tenant.webhookSecret,
        createdAt: auth.tenant.createdAt,
        stats: auth.tenant._count
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

// ------------------------
// Update webhook secret
// ------------------------
router.post('/webhook-secret', authenticateToken, async (req, res) => {
  const { webhookSecret } = req.body;

  if (!webhookSecret) {
    return res.status(400).json({ error: 'Webhook secret is required' });
  }

  try {
    const tenant = await prisma.tenant.update({
      where: { id: req.user.tenantId },
      data: { webhookSecret }
    });

    res.json({ 
      message: 'Webhook secret updated successfully',
      tenantId: tenant.id 
    });
  } catch (error) {
    console.error('Update webhook secret error:', error);
    res.status(500).json({ error: 'Failed to update webhook secret' });
  }
});

// ------------------------
// Get dashboard data
// ------------------------
router.get('/dashboard-data', authenticateToken, async (req, res) => {
  try {
    // Get recent products
    const recentProducts = await prisma.product.findMany({
      where: { tenantId: req.user.tenantId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        shopifyProductId: true,
        title: true,
        vendor: true,
        createdAt: true
      }
    });

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      where: { tenantId: req.user.tenantId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        shopifyOrderId: true,
        totalPrice: true,
        financialStatus: true,
        createdAt: true,
        customer: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Get recent customers
    const recentCustomers = await prisma.customer.findMany({
      where: { tenantId: req.user.tenantId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        shopifyCustomerId: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        _count: {
          select: {
            orders: true
          }
        }
      }
    });

    res.json({
      recentProducts,
      recentOrders,
      recentCustomers
    });

  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
});

// ------------------------
// Logout
// ------------------------
router.post('/logout', authenticateToken, (req, res) => {
  // With JWT, logout is mainly handled client-side by removing the token
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;