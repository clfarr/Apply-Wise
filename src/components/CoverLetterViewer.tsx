import React, { useState, useEffect } from 'react';
import { CoverLetter } from '../types';
import { coverLetterService } from '../services/coverLetterService';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { FileText, Star, Trash2, Copy, Calendar } from 'lucide-react';

interface CoverLetterViewerProps {
  applicationId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CoverLetterViewer: React.FC<CoverLetterViewerProps> = ({
  applicationId,
  isOpen,
  onClose,
}) => {
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<CoverLetter | null>(null);
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadCoverLetters();
    }
  }, [isOpen, applicationId]);

  const loadCoverLetters = async () => {
    try {
      setLoading(true);
      const letters = await coverLetterService.getByApplicationId(applicationId);
      setCoverLetters(letters);
    } catch (err) {
      console.error('Failed to load cover letters:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cover letter?')) return;

    try {
      await coverLetterService.delete(id);
      await loadCoverLetters();
      if (selectedLetter?.id === id) {
        setSelectedLetter(null);
      }
    } catch (err) {
      alert('Failed to delete cover letter');
    }
  };

  const handleToggleFavorite = async (letter: CoverLetter) => {
    try {
      await coverLetterService.setFavorite(letter.id, !letter.is_favorite);
      await loadCoverLetters();
    } catch (err) {
      alert('Failed to update favorite status');
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedLetter) return;

    try {
      await coverLetterService.update(selectedLetter.id, { content: editedContent });
      setEditing(false);
      await loadCoverLetters();
      const updated = coverLetters.find((l) => l.id === selectedLetter.id);
      if (updated) {
        setSelectedLetter({ ...updated, content: editedContent });
      }
    } catch (err) {
      alert('Failed to save changes');
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    alert('Cover letter copied to clipboard!');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Cover Letters">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cover Letters">
      <div className="space-y-4">
        {coverLetters.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto text-gray-400 mb-3" size={48} />
            <p className="text-gray-600">No cover letters yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Generate one using the "Generate Cover Letter" button
            </p>
          </div>
        ) : (
          <>
            {/* List View */}
            {!selectedLetter && (
              <div className="space-y-3">
                {coverLetters.map((letter) => (
                  <Card
                    key={letter.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedLetter(letter)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded capitalize">
                            {letter.tone}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded capitalize">
                            {letter.ai_provider}
                          </span>
                          {letter.is_favorite && (
                            <Star size={16} className="text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {letter.content.substring(0, 150)}...
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mt-2">
                          <Calendar size={12} className="mr-1" />
                          {formatDate(letter.created_at)}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Detail View */}
            {selectedLetter && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button variant="secondary" size="sm" onClick={() => setSelectedLetter(null)}>
                    ← Back to List
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleToggleFavorite(selectedLetter)}
                    >
                      <Star
                        size={16}
                        className={selectedLetter.is_favorite ? 'fill-yellow-500 text-yellow-500' : ''}
                      />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleCopy(selectedLetter.content)}
                    >
                      <Copy size={16} />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(selectedLetter.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                {editing ? (
                  <>
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full h-96 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    />
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => setEditing(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={handleSaveEdit} className="flex-1">
                        Save Changes
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800">
                        {selectedLetter.content}
                      </pre>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setEditing(true);
                        setEditedContent(selectedLetter.content);
                      }}
                      className="w-full"
                    >
                      Edit Cover Letter
                    </Button>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};
