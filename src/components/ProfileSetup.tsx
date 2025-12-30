import React, { useState, useEffect } from 'react';
import { UserProfile, UserProfileInput } from '../types';
import { profileService } from '../services/profileService';
import { Input } from './ui/Input';
import { TextArea } from './ui/TextArea';
import { Button } from './ui/Button';
import { User, Save } from 'lucide-react';

interface ProfileSetupProps {
  onSave?: () => void;
}

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ onSave }) => {
  const [profile, setProfile] = useState<UserProfileInput>({
    full_name: '',
    email: '',
    phone: '',
    linkedin_url: '',
    portfolio_url: '',
    summary: '',
    skills: [],
    experience: '',
    education: '',
  });

  const [skillsInput, setSkillsInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile();
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          linkedin_url: data.linkedin_url || '',
          portfolio_url: data.portfolio_url || '',
          summary: data.summary || '',
          skills: data.skills || [],
          experience: data.experience || '',
          education: data.education || '',
        });
        setSkillsInput((data.skills || []).join(', '));
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const skillsArray = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      await profileService.createOrUpdateProfile({
        ...profile,
        skills: skillsArray,
      });

      setSuccess(true);
      if (onSave) onSave();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="text-blue-600" size={28} />
        <h2 className="text-2xl font-bold text-gray-900">Your Profile</h2>
      </div>

      <p className="text-gray-600 mb-6">
        This information will be used to generate personalized cover letters.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            Profile saved successfully!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={profile.full_name}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            placeholder="John Doe"
          />

          <Input
            label="Email"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            placeholder="john@example.com"
          />

          <Input
            label="Phone"
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            placeholder="(555) 123-4567"
          />

          <Input
            label="LinkedIn URL"
            value={profile.linkedin_url}
            onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
            placeholder="https://linkedin.com/in/johndoe"
          />
        </div>

        <Input
          label="Portfolio URL"
          value={profile.portfolio_url}
          onChange={(e) => setProfile({ ...profile, portfolio_url: e.target.value })}
          placeholder="https://johndoe.com"
        />

        <TextArea
          label="Professional Summary"
          value={profile.summary}
          onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
          placeholder="A brief summary of your professional background and career goals..."
          rows={4}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skills (comma-separated)
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="React, TypeScript, Node.js, Python, etc."
          />
        </div>

        <TextArea
          label="Experience"
          value={profile.experience}
          onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
          placeholder="Brief overview of your relevant work experience..."
          rows={4}
        />

        <TextArea
          label="Education"
          value={profile.education}
          onChange={(e) => setProfile({ ...profile, education: e.target.value })}
          placeholder="Your educational background..."
          rows={3}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={saving} className="inline-flex items-center">
            <Save size={20} className="mr-2" />
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
};
