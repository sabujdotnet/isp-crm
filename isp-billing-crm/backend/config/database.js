import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export const initializeNeonDB = async () => {
  try {
    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        reseller_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        email VARCHAR(255),
        address TEXT,
        package VARCHAR(100),
        monthly_fee DECIMAL(10,2),
        status VARCHAR(50) DEFAULT 'active',
        mikrotik_username VARCHAR(100),
        joining_date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS billing (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
        month INTEGER NOT NULL,
        year INTEGER NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        amount_paid DECIMAL(10,2) DEFAULT 0,
        amount_due DECIMAL(10,2) DEFAULT 0,
        bkash_payment DECIMAL(10,2) DEFAULT 0,
        payment_method VARCHAR(50),
        status VARCHAR(50) DEFAULT 'due',
        payment_date DATE,
        due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(client_id, month, year)
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id),
        invoice_number VARCHAR(100) UNIQUE NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        issue_date DATE DEFAULT CURRENT_DATE,
        due_date DATE,
        paid_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS mikrotik_config (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        host VARCHAR(255) NOT NULL,
        username VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        port INTEGER DEFAULT 8728,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('✅ NeonDB tables created successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

export const db = sql;