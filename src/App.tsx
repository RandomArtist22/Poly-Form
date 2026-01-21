/**
 * Polyform Application
 *
 * Main application component that orchestrates the AI-powered content processing suite.
 * Manages document state, processing results, and theme preferences.
 */

import React, { useState, useEffect } from 'react';
import {
  Upload,
  FileText,
  Languages,
  BookOpen,
  MessageCircle,
  Download,
  Sun,
  Moon,
} from 'lucide-react';

import ContentInput from './components/ContentInput';
import TranslationPanel from './components/TranslationPanel';
import SummaryPanel from './components/SummaryPanel';
import QuizPanel from './components/QuizPanel';
import ChatPanel from './components/ChatPanel';
import ResultsManager from './components/ResultsManager';

/** Available navigation tabs */
type Tab = 'input' | 'translate' | 'summarize' | 'quiz' | 'chat' | 'results';

/** Document data structure */
interface Document {
  id: string;
  name: string;
  content: string;
  type: string;
}

/** Processing result data structure */
interface Result {
  id: string;
  type: string;
  title: string;
  content: unknown;
  timestamp: Date;
}

/** Tab configuration */
interface TabConfig {
  id: Tab;
  label: string;
  icon: React.ElementType;
}

/** Navigation tab definitions */
const TABS: TabConfig[] = [
  { id: 'input', label: 'Content Input', icon: Upload },
  { id: 'translate', label: 'Translate', icon: Languages },
  { id: 'summarize', label: 'Summarize', icon: BookOpen },
  { id: 'quiz', label: 'Quiz Generator', icon: FileText },
  { id: 'chat', label: 'Chat with Docs', icon: MessageCircle },
  { id: 'results', label: 'Results', icon: Download },
];

/**
 * Main Application Component
 */
function App(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<Tab>('input');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Apply theme changes to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  /**
   * Adds a new processing result to the results list
   */
  const addResult = (type: string, title: string, content: unknown): void => {
    const newResult: Result = {
      id: Date.now().toString(),
      type,
      title,
      content,
      timestamp: new Date(),
    };
    setResults((prev) => [newResult, ...prev]);
  };

  /**
   * Renders the content panel based on active tab
   */
  const renderActivePanel = (): React.ReactNode => {
    switch (activeTab) {
      case 'input':
        return <ContentInput documents={documents} setDocuments={setDocuments} />;
      case 'translate':
        return <TranslationPanel documents={documents} onResult={addResult} />;
      case 'summarize':
        return <SummaryPanel documents={documents} onResult={addResult} />;
      case 'quiz':
        return <QuizPanel documents={documents} onResult={addResult} />;
      case 'chat':
        return <ChatPanel documents={documents} />;
      case 'results':
        return <ResultsManager results={results} setResults={setResults} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-background text-gray-900 dark:text-dark-text">
      {/* Header */}
      <header className="bg-white dark:bg-dark-surface shadow-sm border-b dark:border-dark-input-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Brand */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Polyform</h1>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
                  AI-Powered Content Processing Suite
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDarkMode((prev) => !prev)}
                className="p-2 rounded-full text-gray-500 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-surface transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                {documents.length} Documents
              </div>

              <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                {results.length} Results
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <nav className="mb-8">
          <div className="border-b border-gray-200 dark:border-dark-input-border">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm 
                      flex items-center space-x-2 transition-colors
                      ${isActive
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-dark-text-secondary dark:hover:text-dark-text dark:hover:border-dark-input-border'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </nav>

        {/* Content Panel */}
        <div className="bg-white dark:bg-black rounded-xl shadow-sm border-2 border-gray-200 dark:border-white dark:shadow-2xl dark:shadow-white/10 p-1">
          {renderActivePanel()}
        </div>
      </div>
    </div>
  );
}

export default App;
