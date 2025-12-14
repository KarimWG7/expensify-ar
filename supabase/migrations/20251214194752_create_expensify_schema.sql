/*
  # Create Expensify Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique, not null)
      - `role` (text, 'admin' or 'user', default 'user')
      - `approved` (boolean, default false)
      - `created_at` (timestamptz, default now())
    
    - `categories`
      - `id` (serial, primary key)
      - `name` (text, not null)
      - `icon` (text, not null)
      - `color` (text, nullable)
      - `expenses_count` (integer, default 0)
      - `total_expenses_amount` (numeric, default 0)
      - `user_id` (uuid, references users)
      - `created_at` (timestamptz, default now())
    
    - `paymentMethods`
      - `id` (serial, primary key)
      - `name` (text, not null)
      - `type` (text, 'user_defined' or 'admin_defined')
      - `user_id` (uuid, nullable, references users)
      - `created_at` (timestamptz, default now())
    
    - `expenses`
      - `id` (serial, primary key)
      - `amount` (numeric, not null)
      - `date` (text, not null)
      - `notes` (text, nullable)
      - `category_id` (integer, nullable, references categories)
      - `payment_method_id` (integer, nullable, references paymentMethods)
      - `user_id` (uuid, references users)
      - `created_at` (timestamptz, default now())
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Admin policies for user management
    - Users can only access their own data unless admin
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update users"
  ON users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete users"
  ON users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id serial PRIMARY KEY,
  name text NOT NULL,
  icon text NOT NULL,
  color text,
  expenses_count integer DEFAULT 0,
  total_expenses_amount numeric DEFAULT 0,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Users can view own categories"
  ON categories FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
  ON categories FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create paymentMethods table
CREATE TABLE IF NOT EXISTS "paymentMethods" (
  id serial PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('user_defined', 'admin_defined')),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE "paymentMethods" ENABLE ROW LEVEL SECURITY;

-- Payment methods policies
CREATE POLICY "Users can view own and admin payment methods"
  ON "paymentMethods" FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR type = 'admin_defined'
  );

CREATE POLICY "Users can insert own payment methods"
  ON "paymentMethods" FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND type = 'user_defined');

CREATE POLICY "Admins can insert admin payment methods"
  ON "paymentMethods" FOR INSERT
  TO authenticated
  WITH CHECK (
    type = 'admin_defined' AND
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can update own payment methods"
  ON "paymentMethods" FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id AND type = 'user_defined')
  WITH CHECK (auth.uid() = user_id AND type = 'user_defined');

CREATE POLICY "Admins can update admin payment methods"
  ON "paymentMethods" FOR UPDATE
  TO authenticated
  USING (
    type = 'admin_defined' AND
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    type = 'admin_defined' AND
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can delete own payment methods"
  ON "paymentMethods" FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id AND type = 'user_defined');

CREATE POLICY "Admins can delete admin payment methods"
  ON "paymentMethods" FOR DELETE
  TO authenticated
  USING (
    type = 'admin_defined' AND
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id serial PRIMARY KEY,
  amount numeric NOT NULL,
  date text NOT NULL,
  notes text,
  category_id integer REFERENCES categories(id) ON DELETE SET NULL,
  payment_method_id integer REFERENCES "paymentMethods"(id) ON DELETE SET NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Expenses policies
CREATE POLICY "Users can view own expenses"
  ON expenses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
  ON expenses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses"
  ON expenses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
  ON expenses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_payment_method_id ON expenses(payment_method_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON "paymentMethods"(user_id);