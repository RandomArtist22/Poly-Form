import React, { useState } from 'react';
import { BookOpen, Loader, CheckCircle, FileText, Sliders } from 'lucide-react';
import LaTeXRenderer from './LaTeXRenderer';
import { summarizeContent } from '../api'; // Import the API function

interface Document {
  id: string;
  name: string;
  content: string;
  type: string;
}

interface SummaryPanelProps {
  documents: Document[];
  onResult: (type: string, title: string, content: any) => void;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ documents, onResult }) => {
  const [selectedDoc, setSelectedDoc] = useState<string>('');
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'detailed'>('medium');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaries, setSummaries] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);

  const summaryOptions = [
    { value: 'short', label: 'Short Summary', description: '2-3 key points' },
    { value: 'medium', label: 'Medium Summary', description: '5-7 main concepts' },
    { value: 'detailed', label: 'Detailed Summary', description: 'Comprehensive overview' }
  ];

  const handleSummarize = async () => {
    if (!selectedDoc) return;

    const document = documents.find(doc => doc.id === selectedDoc);
    if (!document) return;

    setIsSummarizing(true);
    
    try {
      const response = await summarizeContent(document.id, document.content, summaryLength);
      console.log('API Response in SummaryPanel:', response);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Summarization failed');
      }

      const summary = response.data.summary;
      
      setSummaries(prev => ({
        ...prev,
        [`${selectedDoc}-${summaryLength}`]: summary
      }));

      onResult('summary', `${document.name} - ${summaryLength.charAt(0).toUpperCase() + summaryLength.slice(1)} Summary`, {
        originalContent: document.content,
        summary,
        summaryLength,
        documentName: document.name
      });
      setError(null); // Clear any previous errors
    } catch (error: any) {
      console.error('Summarization failed:', error);
      setError(error.message || 'Failed to generate summary. Please try again.');
    } finally {
      setIsSummarizing(false);
    }
  };

  if (documents.length === 0) {
    return (
      <div className="p-8 text-center dark:bg-dark-background dark:text-dark-text-secondary">
        <BookOpen className="h-16 w-16 text-gray-300 dark:text-dark-text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-2">No Documents Available</h3>
        <p className="text-gray-500 dark:text-dark-text-secondary">Upload documents in the Content Input tab to start summarizing.</p>
      </div>
    );
  }

  return (
    <div className="p-10 dark:bg-dark-background dark:text-dark-text rounded-lg space-y-8">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-3">Content Summarization</h2>
        <p className="text-gray-600 dark:text-dark-text-secondary text-lg">Generate intelligent summaries with customizable detail levels, preserving LaTeX formatting.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Summarization Controls */}
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
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-3">
              Summary Length
            </label>
            <div className="space-y-3">
              {summaryOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setSummaryLength(option.value as 'short' | 'medium' | 'detailed')}
                  className={`w-full p-4 text-left rounded-lg border transition-colors ${
                    summaryLength === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-200'
                      : 'border-gray-200 hover:border-gray-300 dark:border-dark-input-border dark:hover:border-dark-scroll-thumb dark:bg-dark-surface dark:text-dark-text'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Sliders className="h-5 w-5" />
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm opacity-75">{option.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSummarize}
            disabled={!selectedDoc || isSummarizing}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-dark-button-inactive-bg disabled:text-dark-button-inactive-text disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSummarizing ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Generating Summary...</span>
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4" />
                <span>Generate Summary</span>
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

          {summaries[`${selectedDoc}-${summaryLength}`] && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-text">
                  {summaryLength.charAt(0).toUpperCase() + summaryLength.slice(1)} Summary
                </h3>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-h-96 overflow-y-auto dark:bg-green-900 dark:border-green-700 dark:text-green-100">
                <LaTeXRenderer content={summaries[`${selectedDoc}-${summaryLength}`]} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryPanel;
