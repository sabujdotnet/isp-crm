import express from 'express';
import { db } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// Generate invoice number
const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}-${random}`;
};

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const { status, clientId, startDate, endDate } = req.query;
    
    let query = `
      SELECT i.*, c.name as client_name, c.phone, c.email
      FROM invoices i
      JOIN clients c ON i.client_id = c.id
      WHERE c.user_id = ${req.user.id}
    `;
    
    const conditions = [];
    if (status) conditions.push(`i.status = '${status}'`);
    if (clientId) conditions.push(`i.client_id = ${clientId}`);
    if (startDate) conditions.push(`i.issue_date >= '${startDate}'`);
    if (endDate) conditions.push(`i.issue_date <= '${endDate}'`);
    
    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY i.created_at DESC';

    const invoices = await db.unsafe(query);
    res.json(invoices);
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Get single invoice
router.get('/:id', async (req, res) => {
  try {
    const [invoice] = await db`
      SELECT i.*, c.name as client_name, c.phone, c.email, c.address
      FROM invoices i
      JOIN clients c ON i.client_id = c.id
      WHERE i.id = ${req.params.id} AND c.user_id = ${req.user.id}
    `;

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

// Create invoice
router.post('/', async (req, res) => {
  try {
    const { clientId, amount, dueDate, items } = req.body;
    
    const invoiceNumber = generateInvoiceNumber();
    
    const [invoice] = await db`
      INSERT INTO invoices (
        client_id, invoice_number, amount, due_date, status
      )
      VALUES (
        ${clientId}, ${invoiceNumber}, ${amount}, ${dueDate}, 'pending'
      )
      RETURNING *
    `;

    res.status(201).json(invoice);
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// Update invoice status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, paidDate } = req.body;
    
    const [invoice] = await db`
      UPDATE invoices
      SET status = ${status}, paid_date = ${paidDate || null}
      WHERE id = ${req.params.id}
      RETURNING *
    `;

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    console.error('Update invoice status error:', error);
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

export default router;