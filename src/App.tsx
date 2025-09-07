import React, { useState, useEffect } from 'react';
import { Upload, FileText, Languages, BookOpen, MessageCircle, Download, Settings, Sun, Moon } from 'lucide-react';
import ContentInput from './components/ContentInput';
import TranslationPanel from './components/TranslationPanel';
import SummaryPanel from './components/SummaryPanel';
import QuizPanel from './components/QuizPanel';
import ChatPanel from './components/ChatPanel';
import ResultsManager from './components/ResultsManager';

type Tab = 'input' | 'translate' | 'summarize' | 'quiz' | 'chat' | 'results';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('input');
  const [documents, setDocuments] = useState<Array<{ id: string; name: string; content: string; type: string }>>([]);
  const [results, setResults] = useState<Array<{ id: string; type: string; title: string; content: any; timestamp: Date }>>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const tabs = [
    { id: 'input' as Tab, label: 'Content Input', icon: Upload },
    { id: 'translate' as Tab, label: 'Translate', icon: Languages },
    { id: 'summarize' as Tab, label: 'Summarize', icon: BookOpen },
    { id: 'quiz' as Tab, label: 'Quiz Generator', icon: FileText },
    { id: 'chat' as Tab, label: 'Chat with Docs', icon: MessageCircle },
    { id: 'results' as Tab, label: 'Results', icon: Download },
  ];

  const addResult = (type: string, title: string, content: any) => {
    console.log('addResult called with:', { type, title, content });
    const newResult = {
      id: Date.now().toString(),
      type,
      title,
      content,
      timestamp: new Date(),
    };
    setResults(prev => {
      const newResults = [newResult, ...prev];
      console.log('Updated results state:', newResults);
      return newResults;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-background text-gray-900 dark:text-dark-text">
      <header className="bg-white dark:bg-dark-surface shadow-sm border-b dark:border-dark-input-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Polyform</h1>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">AI-Powered Content Processing Suite</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8">
          <div className="border-b border-gray-200 dark:border-dark-input-border">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-dark-text-secondary dark:hover:text-dark-text dark:hover:border-dark-input-border'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </nav>

        <div className="bg-white dark:bg-black rounded-xl shadow-sm border-2 border-gray-200 dark:border-white dark:shadow-2xl dark:shadow-white/10 p-1">
          {activeTab === 'input' && (
            <ContentInput documents={documents} setDocuments={setDocuments} />
          )}
          {activeTab === 'translate' && (
            <TranslationPanel documents={documents} onResult={addResult} />
          )}
          {activeTab === 'summarize' && (
            <SummaryPanel documents={documents} onResult={addResult} />
          )}
          {activeTab === 'quiz' && (
            <QuizPanel documents={documents} onResult={addResult} />
          )}
          {activeTab === 'chat' && (
            <ChatPanel documents={documents} />
          )}
          {activeTab === 'results' && (
            <ResultsManager results={results} setResults={setResults} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
