import express from 'express';
import RouterOSAPI from 'routeros';
import { db } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// Connect to MikroTik
const connectMikroTik = async (config) => {
  const conn = new RouterOSAPI({
    host: config.host || process.env.MIKROTIK_HOST,
    user: config.username || process.env.MIKROTIK_USER,
    password: config.password || process.env.MIKROTIK_PASSWORD,
    port: config.port || 8728
  });

  try {
    await conn.connect();
    return conn;
  } catch (error) {
    throw new Error('Failed to connect to MikroTik: ' + error.message);
  }
};

// Get PPPoE users
router.get('/users', async (req, res) => {
  try {
    const conn = await connectMikroTik({});
    const users = await conn.write('/ppp/secret/print');
    await conn.close();
    res.json(users);
  } catch (error) {
    console.error('Get MikroTik users error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create PPPoE user
router.post('/users', async (req, res) => {
  try {
    const { username, password, profile, service } = req.body;
    
    const conn = await connectMikroTik({});
    await conn.write('/ppp/secret/add', [
      `=name=${username}`,
      `=password=${password}`,
      `=profile=${profile || 'default'}`,
      `=service=${service || 'pppoe'}`
    ]);
    await conn.close();

    res.json({ message: 'User created successfully', username });
  } catch (error) {
    console.error('Create MikroTik user error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update PPPoE user
router.put('/users/:username', async (req, res) => {
  try {
    const { password, profile, disabled } = req.body;
    
    const conn = await connectMikroTik({});
    
    // Find user ID
    const users = await conn.write('/ppp/secret/print', [`?name=${req.params.username}`]);
    if (users.length === 0) {
      await conn.close();
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user
    const updateParams = [`=.id=${users[0]['.id']}`];
    if (password) updateParams.push(`=password=${password}`);
    if (profile) updateParams.push(`=profile=${profile}`);
    if (disabled !== undefined) updateParams.push(`=disabled=${disabled ? 'yes' : 'no'}`);

    await conn.write('/ppp/secret/set', updateParams);
    await conn.close();

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update MikroTik user error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete PPPoE user
router.delete('/users/:username', async (req, res) => {
  try {
    const conn = await connectMikroTik({});
    
    // Find user ID
    const users = await conn.write('/ppp/secret/print', [`?name=${req.params.username}`]);
    if (users.length === 0) {
      await conn.close();
      return res.status(404).json({ error: 'User not found' });
    }

    await conn.write('/ppp/secret/remove', [`=.id=${users[0]['.id']}`]);
    await conn.close();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete MikroTik user error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
