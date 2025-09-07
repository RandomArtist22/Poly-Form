import React, { useState } from 'react';
import { FileText, Loader, CheckCircle, Settings, Play } from 'lucide-react';
import LaTeXRenderer from './LaTeXRenderer';
import { generateQuiz } from '../api'; // Import the API function

interface Document {
  id: string;
  name: string;
  content: string;
  type: string;
}

interface QuizPanelProps {
  documents: Document[];
  onResult: (type: string, title: string, content: any) => void;
}

interface Quiz {
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
}

const QuizPanel: React.FC<QuizPanelProps> = ({ documents, onResult }) => {
  const [selectedDoc, setSelectedDoc] = useState<string>('');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQuiz = async () => {
    if (!selectedDoc) return;

    const document = documents.find(doc => doc.id === selectedDoc);
    if (!document) return;

    setIsGenerating(true);
    setCurrentQuiz(null);
    setUserAnswers({});
    setShowResults(false);
    
    try {
      const response = await generateQuiz(document.id, document.content, questionCount, difficulty);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Quiz generation failed');
      }

      const quiz = response.data.quiz;
      setCurrentQuiz(quiz);

      onResult('quiz', `${document.name} - Quiz (${questionCount} questions)`, {
        documentName: document.name,
        quiz,
        questionCount,
        difficulty
      });
      setError(null); // Clear any previous errors
    } catch (error: any) {
      console.error('Quiz generation failed:', error);
      setError(error.message || 'Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const calculateScore = () => {
    if (!currentQuiz) return 0;
    
    let correct = 0;
    currentQuiz.questions.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    
    return Math.round((correct / currentQuiz.questions.length) * 100);
  };

  if (documents.length === 0) {
    return (
      <div className="p-8 text-center dark:bg-dark-background dark:text-dark-text-secondary">
        <FileText className="h-16 w-16 text-gray-300 dark:text-dark-text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-2">No Documents Available</h3>
        <p className="text-gray-500 dark:text-dark-text-secondary">Upload documents in the Content Input tab to generate quizzes.</p>
      </div>
    );
  }

  return (
    <div className="p-10 dark:bg-dark-background dark:text-dark-text rounded-lg space-y-8">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-3">Interactive Quiz Generator</h2>
        <p className="text-gray-600 dark:text-dark-text-secondary text-lg">Generate customized quizzes from your content with adjustable difficulty and question count.</p>
      </div>

      {!currentQuiz ? (
        <div className="max-w-2xl mx-auto space-y-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-2">
                Number of Questions
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-dark-input-bg dark:border-dark-input-border dark:text-dark-text"
              >
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-2">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-dark-input-bg dark:border-dark-input-border dark:text-dark-text"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateQuiz}
            disabled={!selectedDoc || isGenerating}
            className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-dark-button-inactive-bg disabled:text-dark-button-inactive-text flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Generating Quiz...</span>
              </>
            ) : (
              <>
                <Settings className="h-4 w-4" />
                <span>Generate Quiz</span>
              </>
            )}
          </button>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 dark:bg-red-900 dark:border-red-700 dark:text-red-300" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-text">
              Quiz: {documents.find(doc => doc.id === selectedDoc)?.name}
            </h3>
            <div className="flex items-center space-x-4">
              {showResults && (
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium dark:bg-blue-900 dark:text-blue-200">
                  Score: {calculateScore()}%
                </div>
              )}
              <button
                onClick={() => {
                  setCurrentQuiz(null);
                  setUserAnswers({});
                  setShowResults(false);
                }}
                className="text-gray-600 hover:text-gray-900 dark:text-dark-text-secondary dark:hover:text-dark-text"
              >
                Generate New Quiz
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {currentQuiz.questions.map((question, index) => (
              <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-dark-surface dark:border-dark-input-border">
                <div className="mb-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-2">
                    Question {index + 1}
                  </h4>
                  <div className="text-gray-700 dark:text-dark-text-secondary">
                    <LaTeXRenderer content={question.question ?? ''} />
                  </div>
                </div>

                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = userAnswers[question.id] === optionIndex;
                    const isCorrect = optionIndex === question.correctAnswer;
                    const showCorrectness = showResults;

                    let buttonClass = 'w-full p-3 text-left rounded-lg border transition-colors ';
                    
                    if (showCorrectness) {
                      if (isCorrect) {
                        buttonClass += 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-200';
                      } else if (isSelected && !isCorrect) {
                        buttonClass += 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200';
                      } else {
                        buttonClass += 'border-gray-200 bg-gray-50 dark:border-dark-input-border dark:bg-dark-input-bg dark:text-dark-text';
                      }
                    } else {
                      buttonClass += isSelected 
                        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-200'
                        : 'border-gray-200 hover:border-gray-300 dark:border-dark-input-border dark:hover:border-dark-scroll-thumb dark:bg-dark-input-bg dark:text-dark-text';
                    }

                    return (
                      <button
                        key={optionIndex}
                        onClick={() => handleAnswerSelect(question.id, optionIndex)}
                        disabled={showResults}
                        className={buttonClass}
                      >
                        <LaTeXRenderer content={option ?? ''} />
                      </button>
                    );
                  })}
                </div>

                {showResults && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900 dark:border-blue-700">
                    <div className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">Explanation:</div>
                    <div className="text-blue-700 dark:text-blue-300">
                      <LaTeXRenderer content={question.explanation ?? ''} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!showResults && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setShowResults(true)}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Submit Quiz</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizPanel;
