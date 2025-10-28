import express from 'express';
import { db } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// Get all clients
router.get('/', async (req, res) => {
  try {
    const { search, status, package: pkg } = req.query;
    let query = db`SELECT * FROM clients WHERE user_id = ${req.user.id}`;

    if (search) {
      query = db`
        SELECT * FROM clients 
        WHERE user_id = ${req.user.id}
        AND (name ILIKE ${'%' + search + '%'} OR phone ILIKE ${'%' + search + '%'})
      `;
    }

    if (status) {
      query = db`
        SELECT * FROM clients 
        WHERE user_id = ${req.user.id} AND status = ${status}
      `;
    }

    const clients = await query;
    res.json(clients);
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// Get single client
router.get('/:id', async (req, res) => {
  try {
    const [client] = await db`
      SELECT * FROM clients 
      WHERE id = ${req.params.id} AND user_id = ${req.user.id}
    `;

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

// Create client
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, address, package: pkg, monthlyFee, mikrotikUsername } = req.body;

    const [client] = await db`
      INSERT INTO clients (
        user_id, name, phone, email, address, package, 
        monthly_fee, mikrotik_username
      )
      VALUES (
        ${req.user.id}, ${name}, ${phone}, ${email}, ${address}, 
        ${pkg}, ${monthlyFee}, ${mikrotikUsername}
      )
      RETURNING *
    `;

    res.status(201).json(client);
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// Update client
router.put('/:id', async (req, res) => {
  try {
    const { name, phone, email, address, package: pkg, monthlyFee, status, mikrotikUsername } = req.body;

    const [client] = await db`
      UPDATE clients
      SET name = ${name}, phone = ${phone}, email = ${email}, 
          address = ${address}, package = ${pkg}, monthly_fee = ${monthlyFee},
          status = ${status}, mikrotik_username = ${mikrotikUsername}
      WHERE id = ${req.params.id} AND user_id = ${req.user.id}
      RETURNING *
    `;

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// Delete client
router.delete('/:id', async (req, res) => {
  try {
    await db`
      DELETE FROM clients 
      WHERE id = ${req.params.id} AND user_id = ${req.user.id}
    `;

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Delete client error:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

export default router;