import express from 'express';
import { createClient } from '@supabase/supabase-js';
import bodyParser from 'body-parser';
import cors from 'cors';
import { categorizeTransaction } from './utils/categorize.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Backend uses service role for elevated access if needed
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Authentication Middleware
 * Extracts the Bearer token and verifies the user session with Supabase
 */
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }

  req.user = user;
  next();
}

/* ---------- TRANSACTIONS ---------- */

// GET /api/transactions - Fetch all transactions for the logged-in user
app.get('/api/transactions', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', req.user.id)
    .order('date', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/transactions - Create a new transaction with auto-tagging
app.post('/api/transactions', authenticate, async (req, res) => {
  const { name, amount, category, date } = req.body;

  if (!name || !amount || !date) {
    return res.status(400).json({ error: 'Missing required fields: name, amount, date' });
  }

  // Auto-tagging logic
  const tag = categorizeTransaction(name);

  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      user_id: req.user.id,
      name,
      amount,
      category,
      date,
      tag
    }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// DELETE /api/transactions/:id - Remove a transaction
app.delete('/api/transactions/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id);

  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

/* ---------- SAVINGS GOALS ---------- */

// GET /api/savings-goals - Fetch all goals for the logged-in user
app.get('/api/savings-goals', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('savings_goals')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/savings-goals - Create a new goal
app.post('/api/savings-goals', authenticate, async (req, res) => {
  const { name, target_amount, saved_amount, deadline } = req.body;

  if (!name || !target_amount) {
    return res.status(400).json({ error: 'Missing required fields: name, target_amount' });
  }

  const { data, error } = await supabase
    .from('savings_goals')
    .insert([{
      user_id: req.user.id,
      name,
      target_amount,
      saved_amount: saved_amount || 0,
      deadline
    }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// PATCH /api/savings-goals/:id - Update saved amount
app.patch('/api/savings-goals/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { saved_amount } = req.body;

  if (saved_amount === undefined) {
    return res.status(400).json({ error: 'Missing saved_amount' });
  }

  const { data, error } = await supabase
    .from('savings_goals')
    .update({ saved_amount })
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// Export for Vercel Serverless
export default app;
