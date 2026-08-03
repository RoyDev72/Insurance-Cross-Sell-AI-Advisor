-- Insurance Cross-Sell AI Advisor - Database Seed Data (20 Initial Profiles)
-- Run this in the Supabase SQL Editor after running schema.sql

INSERT INTO customers (name, age, city, existing_policies, policy_purchase_date, created_at) VALUES
  ('Rajesh Sharma',      34, 'Mumbai',               ARRAY['motor'],                             '2024-01-15', '2024-01-15T10:00:00Z'),
  ('Priya Verma',        29, 'Bengaluru',             ARRAY['health'],                            '2023-11-20', '2023-11-20T11:30:00Z'),
  ('Amitabh Patel',      42, 'Ahmedabad',             ARRAY['motor', 'health'],                   '2022-05-10', '2022-05-10T09:15:00Z'),
  ('Sneha Kulkarni',     38, 'Pune',                  ARRAY['health', 'life'],                    '2023-08-01', '2023-08-01T14:20:00Z'),
  ('Vikram Sengupta',    47, 'Kolkata',               ARRAY['motor', 'life'],                     '2021-03-18', '2021-03-18T16:45:00Z'),
  ('Ananya Rao',         26, 'Hyderabad',             ARRAY['motor'],                             '2024-03-02', '2024-03-02T12:10:00Z'),
  ('Rohan Mehta',        31, 'Delhi NCR',             ARRAY['motor', 'health', 'PA'],             '2023-04-12', '2023-04-12T10:00:00Z'),
  ('Kavita Nair',        51, 'Kochi',                 ARRAY['health', 'life', 'PA'],              '2020-09-25', '2020-09-25T11:00:00Z'),
  ('Suresh Menon',       56, 'Chennai',               ARRAY['health'],                            '2022-12-14', '2022-12-14T08:30:00Z'),
  ('Deepak Joshi',       33, 'Jaipur',                ARRAY['motor'],                             '2024-02-11', '2024-02-11T13:40:00Z'),
  ('Meera Deshmukh',     40, 'Nagpur',                ARRAY['health', 'motor'],                   '2023-06-30', '2023-06-30T15:00:00Z'),
  ('Arjun Bansal',       28, 'Chandigarh',            ARRAY['motor'],                             '2024-04-05', '2024-04-05T09:50:00Z'),
  ('Pooja Agarwal',      36, 'Indore',                ARRAY['health', 'life'],                    '2022-10-10', '2022-10-10T14:10:00Z'),
  ('Tarun Saxena',       45, 'Lucknow',               ARRAY['motor', 'life'],                     '2021-07-22', '2021-07-22T17:30:00Z'),
  ('Nisha Gupta',        30, 'Surat',                 ARRAY['health'],                            '2023-09-19', '2023-09-19T10:20:00Z'),
  ('Gaurav Bhatia',      48, 'Gurugram',              ARRAY['motor', 'health', 'life', 'PA'],     '2020-02-14', '2020-02-14T12:00:00Z'),
  ('Shalini Sundaram',   37, 'Coimbatore',            ARRAY['health', 'PA'],                      '2023-01-29', '2023-01-29T16:00:00Z'),
  ('Manish Tiwari',      53, 'Varanasi',              ARRAY['life', 'motor'],                     '2019-11-11', '2019-11-11T11:45:00Z'),
  ('Divya Pillai',       32, 'Thiruvananthapuram',    ARRAY['motor'],                             '2024-05-18', '2024-05-18T10:15:00Z'),
  ('Sanjay Dutt',        49, 'Bhopal',                ARRAY['health', 'life', 'critical_illness'],'2021-08-08', '2021-08-08T13:25:00Z');
