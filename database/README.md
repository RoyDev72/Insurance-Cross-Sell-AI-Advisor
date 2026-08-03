# Database Architecture — Supabase (Postgres)

This directory contains the database SQL scripts for the Insurance Cross-Sell AI Advisor application.

## Database Setup Instructions

1. Open your Supabase Dashboard at [https://supabase.com](https://supabase.com).
2. Go to **SQL Editor** -> **New query**.
3. Copy and run `schema.sql` to create the `customers` table.
4. Copy and run `seed.sql` to populate initial portfolio data.

## Table Schema: `customers`

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary key (default: `gen_random_uuid()`) |
| `name` | `text` | Customer full name |
| `age` | `int` | Customer age |
| `city` | `text` | Customer location city |
| `existing_policies` | `text[]` | Array of active policy types (`motor`, `health`, `life`, `PA`, `critical_illness`) |
| `policy_purchase_date` | `date` | Date of first policy purchase |
| `created_at` | `timestamp` | Record creation timestamp |
| `deleted_at` | `timestamp` | Soft-delete timestamp (`NULL` if active) |
