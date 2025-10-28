import express from 'express';
import { db } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// Get billing records
router.get('/', async (req, res) => {
  try {
    const { month, year, status, clientId } = req.query;
    
    let query = `
      SELECT b.*, c.name as client_name, c.package
      FROM billing b
      JOIN clients c ON b.client_id = c.id
      WHERE c.user_id = ${req.user.id}
    `;
    
    const conditions = [];
    if (month) conditions.push(`b.month = ${month}`);
    if (year) conditions.push(`b.year = ${year}`);
    if (status) conditions.push(`b.status = '${status}'`);
    if (clientId) conditions.push(`b.client_id = ${clientId}`);
    
    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ');
    }

    const billing = await db.unsafe(query);
    res.json(billing);
  } catch (error) {
    console.error('Get billing error:', error);
    res.status(500).json({ error: 'Failed to fetch billing records' });
  }
});

// Create/Update billing record
router.post('/', async (req, res) => {
  try {
    const { 
      clientId, month, year, amount, amountPaid, 
      bkashPayment, paymentMethod, paymentDate 
    } = req.body;

    const amountDue = amount - (amountPaid + bkashPayment);
    const status = amountDue <= 0 ? 'paid' : (amountPaid > 0 ? 'partial' : 'due');

    // Check if record exists
    const existing = await db`
      SELECT * FROM billing 
      WHERE client_id = ${clientId} AND month = ${month} AND year = ${year}
    `;

    let billing;
    if (existing.length > 0) {
      // Update
      [billing] = await db`
        UPDATE billing
        SET amount = ${amount}, amount_paid = ${amountPaid}, 
            amount_due = ${amountDue}, bkash_payment = ${bkashPayment},
            payment_method = ${paymentMethod}, payment_date = ${paymentDate},
            status = ${status}
        WHERE client_id = ${clientId} AND month = ${month} AND year = ${year}
        RETURNING *
      `;
    } else {
      // Create
      [billing] = await db`
        INSERT INTO billing (
          client_id, month, year, amount, amount_paid, amount_due,
          bkash_payment, payment_method, payment_date, status
        )
        VALUES (
          ${clientId}, ${month}, ${year}, ${amount}, ${amountPaid}, ${amountDue},
          ${bkashPayment}, ${paymentMethod}, ${paymentDate}, ${status}
        )
        RETURNING *
      `;
    }

    res.json(billing);
  } catch (error) {
    console.error('Save billing error:', error);
    res.status(500).json({ error: 'Failed to save billing record' });
  }
});

// Get dashboard stats
router.get('/stats/dashboard', async (req, res) => {
  try {
    const [stats] = await db`
      SELECT 
        COUNT(DISTINCT c.id) as total_clients,
        COUNT(DISTINCT CASE WHEN c.status = 'active' THEN c.id END) as active_clients,
        COALESCE(SUM(b.amount_paid + b.bkash_payment), 0) as total_revenue,
        COUNT(CASE WHEN b.status = 'due' THEN 1 END) as pending_payments
      FROM clients c
      LEFT JOIN billing b ON c.id = b.client_id
      WHERE c.user_id = ${req.user.id}
    `;

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;