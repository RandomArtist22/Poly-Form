import React, { useState } from 'react';
import { Download, Trash2, Eye, Calendar, FileText, Languages, BookOpen, MessageCircle, Volume2, Search, Filter } from 'lucide-react';
import LaTeXRenderer from './LaTeXRenderer';

interface Result {
  id: string;
  type: string;
  title: string;
  content: any;
  timestamp: Date;
}

interface ResultsManagerProps {
  results: Result[];
  setResults: React.Dispatch<React.SetStateAction<Result[]>>;
}

const ResultsManager: React.FC<ResultsManagerProps> = ({ results, setResults }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);

  const typeIcons = {
    translation: Languages,
    summary: BookOpen,
    quiz: FileText,
    chat: MessageCircle,
  };

  const typeColors = {
    translation: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    summary: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    quiz: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    chat: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  };

  const filteredResults = results.filter(result => {
    const matchesSearch = result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || result.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const deleteResult = (id: string) => {
    setResults(prev => prev.filter(result => result.id !== id));
    if (selectedResult?.id === id) {
      setSelectedResult(null);
    }
  };

  const exportResult = (result: Result) => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${result.type}-${result.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const renderResultContent = (result: Result) => {
    switch (result.type) {
      case 'translation':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Original Content</h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded p-3 max-h-32 overflow-y-auto">
                <LaTeXRenderer content={typeof result.content.originalContent === 'string' ? result.content.originalContent.substring(0, 200) + '...' : ''} />
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                Translated to {result.content.languageName}
              </h4>
              <div className="bg-blue-50 dark:bg-blue-900 rounded p-3 max-h-32 overflow-y-auto">
                <LaTeXRenderer content={result.content.translatedContent ?? ''} />
              </div>
            </div>
          </div>
        );
      
      case 'summary':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                {result.content.summaryLength.charAt(0).toUpperCase() + result.content.summaryLength.slice(1)} Summary
              </h4>
              <div className="bg-green-50 dark:bg-green-900 rounded p-3 max-h-64 overflow-y-auto">
                <LaTeXRenderer content={result.content.summary ?? ''} />
              </div>
            </div>
          </div>
        );
      
      case 'quiz':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Quiz ({result.content.questionCount} questions)
              </h4>
              <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {result.content.difficulty} difficulty
              </span>
            </div>
            <div className="space-y-3">
              {result.content.quiz.questions.slice(0, 2).map((question: any, index: number) => (
                <div key={question.id} className="bg-purple-50 dark:bg-purple-900 rounded p-3">
                  <div className="font-medium text-sm text-purple-900 dark:text-purple-200 mb-1">
                    Question {index + 1}
                  </div>
                  <LaTeXRenderer content={question.question ?? ''} />
                </div>
              ))}
              {result.content.quiz.questions.length > 2 && (
                <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  ... and {result.content.quiz.questions.length - 2} more questions
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-gray-50 rounded p-3 dark:bg-gray-800">
            <pre className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {JSON.stringify(result.content, null, 2)}
            </pre>
          </div>
        );
    }
  };

  if (results.length === 0) {
    return (
      <div className="p-8 text-center dark:bg-dark-background dark:text-dark-text-secondary">
        <FileText className="h-16 w-16 text-gray-300 dark:text-dark-text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-2">No Results Yet</h3>
        <p className="text-gray-500 dark:text-dark-text-secondary">Process some content to see your results here.</p>
      </div>
    );
  }

  return (
    <div className="p-8 dark:bg-dark-background dark:text-dark-text">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-2">Results Manager</h2>
        <p className="text-gray-600 dark:text-dark-text-secondary">View, manage, and export all your processed content results.</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search results..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-dark-input-bg dark:border-dark-input-border dark:text-dark-text dark:placeholder-dark-text-secondary"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-dark-text-secondary" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-dark-input-bg dark:border-dark-input-border dark:text-dark-text"
          >
            <option value="all">All Types</option>
            <option value="translation">Translations</option>
            <option value="summary">Summaries</option>
            <option value="quiz">Quizzes</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Results List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
            Results ({filteredResults.length})
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredResults.map(result => {
              const Icon = typeIcons[result.type as keyof typeof typeIcons] || FileText;
              const colorClass = typeColors[result.type as keyof typeof typeColors] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
              
              return (
                <div
                  key={result.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedResult?.id === result.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400'
                      : 'border-gray-200 hover:border-gray-300 dark:border-dark-input-border dark:hover:border-dark-scroll-thumb dark:bg-dark-surface'
                  }`}
                  onClick={() => setSelectedResult(result)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4 text-gray-600 dark:text-dark-text-secondary" />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                        {result.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          exportResult(result);
                        }}
                        className="text-gray-400 hover:text-blue-600 p-1 dark:hover:text-blue-400"
                        title="Export"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteResult(result.id);
                        }}
                        className="text-gray-400 hover:text-red-600 p-1 dark:hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 dark:text-dark-text mb-1 truncate">
                    {result.title}
                  </h4>
                  
                  <div className="flex items-center text-xs text-gray-500 dark:text-dark-text-secondary">
                    <Calendar className="h-3 w-3 mr-1" />
                    {result.timestamp.toLocaleDateString()} at {result.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Result Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">Preview</h3>
          
          {selectedResult ? (
            <div className="border border-gray-200 rounded-lg p-6 dark:border-dark-input-border dark:bg-dark-surface">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 dark:text-dark-text">{selectedResult.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      typeColors[selectedResult.type as keyof typeof typeColors] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {selectedResult.type}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-dark-text-secondary">
                      {selectedResult.timestamp.toLocaleDateString()} at {selectedResult.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => exportResult(selectedResult)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
                  >
                    <Download className="h-3 w-3" />
                    <span>Export</span>
                  </button>
                  <button
                    onClick={() => deleteResult(selectedResult.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors flex items-center space-x-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
              
              <div className="border-t pt-4 dark:border-dark-input-border">
                {renderResultContent(selectedResult)}
              </div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg p-8 text-center text-gray-500 dark:border-dark-input-border dark:bg-dark-surface dark:text-dark-text-secondary">
              <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Select a result to preview its content</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsManager;
