import { supabase } from '../lib/supabase';
import { UserProfile, UserProfileInput } from '../types';

export const profileService = {
  async getProfile(): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profile')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows returned"
      throw error;
    }

    return data;
  },

  async createOrUpdateProfile(profile: UserProfileInput): Promise<UserProfile> {
    const existing = await this.getProfile();

    if (existing) {
      const { data, error } = await supabase
        .from('user_profile')
        .update(profile)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('user_profile')
        .insert([profile])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },
};
