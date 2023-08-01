USE company_db;
-- Seed data for departments table
INSERT INTO departments (name) VALUES
  ('Engineering'),
  ('Sales'),
  ('Marketing'),
  ('Finance');

-- Seed data for roles table
INSERT INTO roles (title, salary, department_id) VALUES
  ('Mechanical Engineer', 80000, 1),
  ('Reconciliation Manager', 90000, 2),
  ('Marketing Specialist', 60000, 3),
  ('Financial Analyst', 75000, 4);

-- Seed data for employees table
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
  ('Adib', 'Khan', 1, NULL),
  ('Mehrin', 'Islam', 2, NULL),
  ('Ahona', 'Khan', 3, NULL),
  ('Colton', 'Scholl', 4, NULL),
  ('Akram', 'Khan', 1, 2),
  ('Prism', 'Khan', 3, 2);