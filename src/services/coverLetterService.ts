import { supabase } from '../lib/supabase';
import { CoverLetter, CoverLetterInput } from '../types';

export const coverLetterService = {
  async getByApplicationId(applicationId: string): Promise<CoverLetter[]> {
    const { data, error } = await supabase
      .from('cover_letters')
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(coverLetter: CoverLetterInput): Promise<CoverLetter> {
    const { data, error } = await supabase
      .from('cover_letters')
      .insert([coverLetter])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<CoverLetterInput>): Promise<CoverLetter> {
    const { data, error } = await supabase
      .from('cover_letters')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('cover_letters')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async setFavorite(id: string, isFavorite: boolean): Promise<void> {
    const { error} = await supabase
      .from('cover_letters')
      .update({ is_favorite: isFavorite })
      .eq('id', id);

    if (error) throw error;
  },
};
