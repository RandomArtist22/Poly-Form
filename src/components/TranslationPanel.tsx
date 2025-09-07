import React, { useState } from 'react';
import { Languages, ArrowRight, Loader, CheckCircle, Globe } from 'lucide-react';
import LaTeXRenderer from './LaTeXRenderer';
import { translateContent } from '../api'; // Import the API function

interface Document {
  id: string;
  name: string;
  content: string;
  type: string;
}

interface TranslationPanelProps {
  documents: Document[];
  onResult: (type: string, title: string, content: any) => void;
}

const languages = [
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
];

const TranslationPanel: React.FC<TranslationPanelProps> = ({ documents, onResult }) => {
  const [selectedDoc, setSelectedDoc] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translations, setTranslations] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (!selectedDoc || !selectedLanguage) return;

    const document = documents.find(doc => doc.id === selectedDoc);
    if (!document) return;

    console.log('Starting translation with:', { selectedDoc, selectedLanguage });
    setIsTranslating(true);
    
    try {
      console.log('About to call translateContent API');
      const response = await translateContent(document.id, document.content, selectedLanguage);
      console.log('API call completed, response:', response);

      if (!response.success || !response.data) {
        console.log('API call failed:', response.error);
        throw new Error(response.error || 'Translation failed');
      }

      const translatedContent = response.data.translatedContent;
      console.log('Extracted translatedContent:', translatedContent);
      const languageName = languages.find(lang => lang.code === selectedLanguage)?.name || selectedLanguage;

      console.log('Full response object:', response);
      console.log('Response data:', response.data);
      console.log('Translated Content received:', translatedContent);
      console.log('Response data keys:', Object.keys(response.data || {}));
      console.log('Setting translation for key:', `${selectedDoc}-${selectedLanguage}`);
      setTranslations(prev => {
        const newTranslations = {
          ...prev,
          [`${selectedDoc}-${selectedLanguage}`]: translatedContent
        };
        console.log('Updated translations state:', newTranslations);
        return newTranslations;
      });

      console.log('Calling onResult with translation data');
      onResult('translation', `${document.name} - ${languageName}`, {
        originalContent: document.content,
        translatedContent,
        targetLanguage: selectedLanguage,
        languageName,
        documentName: document.name
      });
      setError(null); // Clear any previous errors
    } catch (error: any) {
      console.error('Translation failed:', error);
      console.error('Error details:', error.message, error.stack);
      setError(error.message || 'Failed to translate content. Please try again.');
    } finally {
      console.log('Translation process finished');
      setIsTranslating(false);
    }
  };

  if (documents.length === 0) {
    return (
      <div className="p-8 text-center dark:bg-dark-background dark:text-dark-text-secondary">
        <Globe className="h-16 w-16 text-gray-300 dark:text-dark-text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-2">No Documents Available</h3>
        <p className="text-gray-500 dark:text-dark-text-secondary">Upload documents in the Content Input tab to start translating.</p>
      </div>
    );
  }

  return (
    <div className="p-10 dark:bg-dark-background dark:text-dark-text rounded-lg space-y-8">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-3">Content Translation</h2>
        <p className="text-gray-600 dark:text-dark-text-secondary text-lg">Translate your content into regional languages while preserving LaTeX formatting.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Translation Controls */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-2">
              Select Document
            </label>
            <select
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-dark-input-bg dark:border-dark-input-border dark:text-dark-text"
            >
              <option value="">Choose a document...</option>
              {documents.map(doc => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} ({doc.content.length} chars)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-2">
              Target Language
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`p-3 text-left rounded-lg border transition-colors ${
                    selectedLanguage === lang.code
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-200'
                      : 'border-gray-200 hover:border-gray-300 dark:border-dark-input-border dark:hover:border-dark-scroll-thumb dark:bg-dark-surface dark:text-dark-text'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleTranslate}
            disabled={!selectedDoc || !selectedLanguage || isTranslating}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-dark-button-inactive-bg disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isTranslating ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Translating...</span>
              </>
            ) : (
              <>
                <Languages className="h-4 w-4" />
                <span>Translate Content</span>
              </>
            )}
          </button>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900 dark:border-red-700 dark:text-red-300" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="space-y-8">
          {selectedDoc && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-text mb-4">Original Content</h3>
              <div className="bg-gray-50 rounded-lg p-6 max-h-80 overflow-y-auto dark:bg-dark-surface dark:text-dark-text">
                <LaTeXRenderer content={documents.find(doc => doc.id === selectedDoc)?.content || ''} />
              </div>
            </div>
          )}

          {(() => {
            const key = `${selectedDoc}-${selectedLanguage}`;
            const translation = translations[key];
            console.log('Translation display check:', { key, hasTranslation: !!translation, selectedDoc, selectedLanguage, translation: translation?.substring(0, 100) + '...' });
            return translation && (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-text">
                    Translated Content ({languages.find(lang => lang.code === selectedLanguage)?.name})
                  </h3>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-h-80 overflow-y-auto dark:bg-dark-surface dark:border-dark-input-border dark:text-dark-text">
                  <LaTeXRenderer content={translation} />
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default TranslationPanel;
