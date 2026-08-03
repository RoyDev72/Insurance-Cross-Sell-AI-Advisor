import 'dotenv/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Customer } from '../types/index.js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    '';

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in backend/.env'
    );
  }

  supabaseClient = createClient(supabaseUrl, supabaseKey);
  return supabaseClient;
}

export async function fetchAllCustomers(): Promise<Customer[]> {
  const db = getSupabase();
  const { data, error } = await db
    .from('customers')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`fetchAllCustomers: ${error.message}`);
  return (data ?? []).map((c: any) => ({
    ...c,
    phone: c.phone || '+91 98765 43210',
  })) as Customer[];
}

export async function fetchCustomerById(id: string): Promise<Customer | null> {
  const db = getSupabase();
  const { data, error } = await db
    .from('customers')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(`fetchCustomerById: ${error.message}`);
  }
  return {
    ...data,
    phone: data.phone || '+91 98765 43210',
  } as Customer;
}

export interface CreateCustomerInput {
  name: string;
  age: number;
  city: string;
  phone?: string;
  existing_policies: string[];
}

export async function createCustomer(input: CreateCustomerInput): Promise<Customer> {
  const db = getSupabase();
  const phone = input.phone?.trim() || '+91 98765 43210';
  
  // First try inserting with phone column
  const { data, error } = await db
    .from('customers')
    .insert([{ ...input, phone, policy_purchase_date: new Date().toISOString().split('T')[0] }])
    .select()
    .single();

  if (!error && data) {
    return { ...data, phone: data.phone || phone } as Customer;
  }

  // Fallback if phone column doesn't exist in Supabase schema yet
  const { phone: _, ...inputWithoutPhone } = input;
  const { data: fallbackData, error: fallbackError } = await db
    .from('customers')
    .insert([{ ...inputWithoutPhone, policy_purchase_date: new Date().toISOString().split('T')[0] }])
    .select()
    .single();

  if (fallbackError) throw new Error(`createCustomer: ${fallbackError.message}`);
  return { ...fallbackData, phone } as Customer;
}

export async function softDeleteCustomer(id: string): Promise<boolean> {
  const db = getSupabase();

  const { data: existing, error: findError } = await db
    .from('customers')
    .select('id')
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (findError || !existing) return false;

  const { error } = await db
    .from('customers')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error(`softDeleteCustomer: ${error.message}`);
  return true;
}
