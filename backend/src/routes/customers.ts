import { Router, Request, Response } from 'express';
import { fetchAllCustomers, fetchCustomerById, createCustomer, softDeleteCustomer } from '../lib/supabase.js';
import { PolicyType } from '../types/index.js';

const router = Router();
const VALID_POLICIES: PolicyType[] = ['motor', 'health', 'life', 'PA', 'critical_illness'];

// GET /api/customers
router.get('/', async (_req: Request, res: Response) => {
  try {
    const customers = await fetchAllCustomers();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET /api/customers/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const customer = await fetchCustomerById(req.params.id);
    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer by id:', error);
    res.status(500).json({ error: 'Failed to fetch customer detail' });
  }
});

// POST /api/customers
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, age, city, phone, existing_policies } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      res.status(400).json({ error: 'Name is required and must be a non-empty string.' });
      return;
    }
    if (age === undefined || age === null || typeof age !== 'number' || !Number.isInteger(age) || age < 18 || age > 100) {
      res.status(400).json({ error: 'Age must be a whole number between 18 and 100.' });
      return;
    }
    if (!city || typeof city !== 'string' || city.trim().length === 0) {
      res.status(400).json({ error: 'City is required and must be a non-empty string.' });
      return;
    }
    if (!Array.isArray(existing_policies)) {
      res.status(400).json({ error: 'existing_policies must be an array.' });
      return;
    }
    const invalidPolicies = existing_policies.filter((p: string) => !VALID_POLICIES.includes(p as PolicyType));
    if (invalidPolicies.length > 0) {
      res.status(400).json({
        error: `Invalid policy types: ${invalidPolicies.join(', ')}. Valid values: ${VALID_POLICIES.join(', ')}.`,
      });
      return;
    }

    const newCustomer = await createCustomer({
      name: name.trim(),
      age,
      city: city.trim(),
      phone: typeof phone === 'string' && phone.trim() ? phone.trim() : '+91 98765 43210',
      existing_policies,
    });

    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer.' });
  }
});

// DELETE /api/customers/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await softDeleteCustomer(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Customer not found or already archived.' });
      return;
    }
    res.json({ message: 'Customer archived successfully.' });
  } catch (error) {
    console.error('Error archiving customer:', error);
    res.status(500).json({ error: 'Failed to archive customer.' });
  }
});

export default router;
