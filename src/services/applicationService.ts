import { supabase } from '../lib/supabase';
import { JobApplication, JobApplicationInput } from '../types';

export const applicationService = {
  async getAll(): Promise<JobApplication[]> {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .order('application_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<JobApplication | null> {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(application: JobApplicationInput): Promise<JobApplication> {
    const { data, error } = await supabase
      .from('job_applications')
      .insert([application])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, application: Partial<JobApplicationInput>): Promise<JobApplication> {
    const { data, error } = await supabase
      .from('job_applications')
      .update(application)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('job_applications')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getByStatus(status: string): Promise<JobApplication[]> {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('status', status)
      .order('application_date', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};
