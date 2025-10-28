import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/database.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password, name, email, role = 'user' } = req.body;

    // Check if user exists
    const existing = await db`
      SELECT * FROM users WHERE username = ${username}
    `;
    
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [user] = await db`
      INSERT INTO users (username, password, name, email, role)
      VALUES (${username}, ${hashedPassword}, ${name}, ${email}, ${role})
      RETURNING id, username, name, email, role
    `;

    res.status(201).json({ user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const [user] = await db`
      SELECT * FROM users WHERE username = ${username}
    `;

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;