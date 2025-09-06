import React, { useState } from 'react';
import { Languages, ArrowRight, Loader, CheckCircle, Globe } from 'lucide-react';
import LaTeXRenderer from './LaTeXRenderer';

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

  const simulateTranslation = async (content: string, targetLang: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock translation - in reality, this would call a translation API
    const mockTranslations: { [key: string]: string } = {
      'hi': 'यह एक अनुवादित पाठ है। मूल सामग्री को हिंदी में परिवर्तित किया गया है।',
      'bn': 'এটি একটি অনুবাদিত পাঠ্য। মূল বিষয়বস্তু বাংলায় রূপান্তরিত হয়েছে।',
      'te': 'ఇది అనువదించబడిన వచనం. మూల కంటెంట్ తెలుగులోకి మార్చబడింది.',
      'es': 'Este es un texto traducido. El contenido original ha sido convertido al español.',
      'fr': 'Ceci est un texte traduit. Le contenu original a été converti en français.'
    };

    return mockTranslations[targetLang] || `[Translated to ${targetLang}] ${content.substring(0, 200)}...`;
  };

  const handleTranslate = async () => {
    if (!selectedDoc || !selectedLanguage) return;

    const document = documents.find(doc => doc.id === selectedDoc);
    if (!document) return;

    setIsTranslating(true);
    
    try {
      const translatedContent = await simulateTranslation(document.content, selectedLanguage);
      const languageName = languages.find(lang => lang.code === selectedLanguage)?.name || selectedLanguage;
      
      setTranslations(prev => ({
        ...prev,
        [`${selectedDoc}-${selectedLanguage}`]: translatedContent
      }));

      onResult('translation', `${document.name} - ${languageName}`, {
        originalContent: document.content,
        translatedContent,
        targetLanguage: selectedLanguage,
        languageName,
        documentName: document.name
      });
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  if (documents.length === 0) {
    return (
      <div className="p-8 text-center">
        <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Available</h3>
        <p className="text-gray-500">Upload documents in the Content Input tab to start translating.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Content Translation</h2>
        <p className="text-gray-600">Translate your content into regional languages while preserving LaTeX formatting.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Translation Controls */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Document
            </label>
            <select
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Language
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`p-3 text-left rounded-lg border transition-colors ${
                    selectedLanguage === lang.code
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
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
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
        </div>

        {/* Preview */}
        <div className="space-y-6">
          {selectedDoc && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Original Content</h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <LaTeXRenderer content={documents.find(doc => doc.id === selectedDoc)?.content || ''} />
              </div>
            </div>
          )}

          {translations[`${selectedDoc}-${selectedLanguage}`] && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Translated Content ({languages.find(lang => lang.code === selectedLanguage)?.name})
                </h3>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                <LaTeXRenderer content={translations[`${selectedDoc}-${selectedLanguage}`]} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranslationPanel;