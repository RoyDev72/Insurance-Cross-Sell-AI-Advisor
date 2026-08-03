-- Insurance Cross-Sell AI Advisor - Supabase Database Schema
-- Run this script in the Supabase SQL Editor (https://supabase.com)

-- 1. Create customers table with phone column
CREATE TABLE IF NOT EXISTS customers (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 text NOT NULL,
  age                  int NOT NULL,
  city                 text NOT NULL,
  phone                text DEFAULT '+91 98765 43210',
  existing_policies    text[] NOT NULL DEFAULT '{}',
  policy_purchase_date date,
  created_at           timestamp DEFAULT now(),
  deleted_at           timestamp DEFAULT NULL
);

-- 2. Add phone column to existing table if missing
ALTER TABLE customers ADD COLUMN IF NOT EXISTS phone text DEFAULT '+91 98765 43210';

-- 3. Disable Row Level Security (RLS) for API access
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
