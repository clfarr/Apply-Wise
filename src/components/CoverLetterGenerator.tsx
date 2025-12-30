import React, { useState, useEffect } from 'react';
import { JobApplication, CoverLetterTone, AIProvider, UserProfile } from '../types';
import { profileService } from '../services/profileService';
import { coverLetterService } from '../services/coverLetterService';
import { aiService } from '../services/aiService';
import { Button } from './ui/Button';
import { Select } from './ui/Select';
import { Modal } from './ui/Modal';
import { Sparkles, Copy, Save, FileText } from 'lucide-react';
import { ProfileSetup } from './ProfileSetup';

interface CoverLetterGeneratorProps {
  application: JobApplication;
  isOpen: boolean;
  onClose: () => void;
}

export const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({
  application,
  isOpen,
  onClose,
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [tone, setTone] = useState<CoverLetterTone>('professional');
  const [aiProvider, setAiProvider] = useState<AIProvider>('openai');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadProfile();
    }
  }, [isOpen]);

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
      if (!data) {
        setShowProfileSetup(true);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const handleGenerate = async () => {
    if (!profile) {
      setShowProfileSetup(true);
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const letter = await aiService.generateCoverLetter({
        jobDescription: application.job_description || 'No description available',
        companyName: application.company,
        roleName: application.role,
        userProfile: profile,
        tone,
        aiProvider,
      });

      setGeneratedLetter(letter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate cover letter');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedLetter) return;

    setSaving(true);
    try {
      await coverLetterService.create({
        application_id: application.id,
        content: generatedLetter,
        tone,
        ai_provider: aiProvider,
      });

      alert('Cover letter saved successfully!');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save cover letter');
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    alert('Cover letter copied to clipboard!');
  };

  if (showProfileSetup && !profile) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Set Up Your Profile">
        <ProfileSetup
          onSave={() => {
            setShowProfileSetup(false);
            loadProfile();
          }}
        />
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate Cover Letter">
      <div className="space-y-6">
        {/* Job Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">{application.role}</h3>
          <p className="text-gray-600">{application.company}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Settings */}
        {!generatedLetter && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Tone"
              value={tone}
              onChange={(e) => setTone(e.target.value as CoverLetterTone)}
              options={[
                { value: 'professional', label: 'Professional' },
                { value: 'enthusiastic', label: 'Enthusiastic' },
                { value: 'technical', label: 'Technical' },
              ]}
            />

            <Select
              label="AI Provider"
              value={aiProvider}
              onChange={(e) => setAiProvider(e.target.value as AIProvider)}
              options={[
                { value: 'openai', label: 'OpenAI (GPT-4)' },
                { value: 'claude', label: 'Claude (Anthropic)' },
              ]}
            />
          </div>
        )}

        {/* Generated Letter */}
        {generatedLetter && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Generated Cover Letter
            </label>
            <textarea
              value={generatedLetter}
              onChange={(e) => setGeneratedLetter(e.target.value)}
              className="w-full h-96 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          {!generatedLetter ? (
            <>
              <Button
                onClick={() => setShowProfileSetup(true)}
                variant="secondary"
                className="flex-1"
              >
                <FileText size={20} className="mr-2" />
                Edit Profile
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={generating || !profile}
                className="flex-1 inline-flex items-center justify-center"
              >
                <Sparkles size={20} className="mr-2" />
                {generating ? 'Generating...' : 'Generate'}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => setGeneratedLetter('')}
                variant="secondary"
                className="flex-1"
              >
                Start Over
              </Button>
              <Button
                onClick={handleCopy}
                variant="secondary"
                className="flex-1 inline-flex items-center justify-center"
              >
                <Copy size={20} className="mr-2" />
                Copy
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center"
              >
                <Save size={20} className="mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
