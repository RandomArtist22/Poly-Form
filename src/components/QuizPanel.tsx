/**
 * Quiz Panel Component
 *
 * Generates interactive quizzes from document content.
 * Supports customizable question count and difficulty levels.
 */

import React, { useState } from 'react';
import { FileText, Loader, CheckCircle, Settings } from 'lucide-react';
import LaTeXRenderer from './LaTeXRenderer';
import { generateQuiz } from '../api';

/** Document data structure */
interface Document {
  id: string;
  name: string;
  content: string;
  type: string;
}

/** Component props */
interface QuizPanelProps {
  documents: Document[];
  onResult: (type: string, title: string, content: unknown) => void;
}

/** Quiz question structure */
interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

/** Quiz data structure */
interface Quiz {
  questions: QuizQuestion[];
}

/** Difficulty level type */
type Difficulty = 'easy' | 'medium' | 'hard';

/** Available question count options */
const QUESTION_COUNTS = [3, 5, 10, 15, 20];

/** Available difficulty levels */
const DIFFICULTY_OPTIONS: Difficulty[] = ['easy', 'medium', 'hard'];

/**
 * Quiz Panel Component
 */
const QuizPanel: React.FC<QuizPanelProps> = ({ documents, onResult }) => {
  const [selectedDoc, setSelectedDoc] = useState<string>('');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Generates a quiz from the selected document
   */
  const handleGenerateQuiz = async (): Promise<void> => {
    if (!selectedDoc) return;

    const document = documents.find((doc) => doc.id === selectedDoc);
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
        difficulty,
      });

      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate quiz';
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Records user's answer selection
   */
  const handleAnswerSelect = (questionId: string, answerIndex: number): void => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
  };

  /**
   * Calculates the quiz score as a percentage
   */
  const calculateScore = (): number => {
    if (!currentQuiz) return 0;

    let correct = 0;
    currentQuiz.questions.forEach((question) => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });

    return Math.round((correct / currentQuiz.questions.length) * 100);
  };

  /**
   * Resets the quiz state
   */
  const resetQuiz = (): void => {
    setCurrentQuiz(null);
    setUserAnswers({});
    setShowResults(false);
  };

  /**
   * Returns button styling based on answer state
   */
  const getAnswerButtonClass = (
    questionId: string,
    optionIndex: number,
    correctAnswer: number
  ): string => {
    const isSelected = userAnswers[questionId] === optionIndex;
    const isCorrect = optionIndex === correctAnswer;
    const baseClass = 'w-full p-3 text-left rounded-lg border transition-colors ';

    if (showResults) {
      if (isCorrect) {
        return baseClass + 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-200';
      }
      if (isSelected && !isCorrect) {
        return baseClass + 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200';
      }
      return baseClass + 'border-gray-200 bg-gray-50 dark:border-dark-input-border dark:bg-dark-input-bg dark:text-dark-text';
    }

    return baseClass + (isSelected
      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-200'
      : 'border-gray-200 hover:border-gray-300 dark:border-dark-input-border dark:hover:border-dark-scroll-thumb dark:bg-dark-input-bg dark:text-dark-text');
  };

  // Empty state
  if (documents.length === 0) {
    return (
      <div className="p-8 text-center dark:bg-dark-background dark:text-dark-text-secondary">
        <FileText className="h-16 w-16 text-gray-300 dark:text-dark-text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-2">
          No Documents Available
        </h3>
        <p className="text-gray-500 dark:text-dark-text-secondary">
          Upload documents in the Content Input tab to generate quizzes.
        </p>
      </div>
    );
  }

  return (
    <div className="p-10 dark:bg-dark-background dark:text-dark-text rounded-lg space-y-8">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-3">
          Interactive Quiz Generator
        </h2>
        <p className="text-gray-600 dark:text-dark-text-secondary text-lg">
          Generate customized quizzes from your content with adjustable difficulty and question count.
        </p>
      </div>

      {!currentQuiz ? (
        /* Configuration Panel */
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Document Selection */}
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
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} ({doc.content.length} chars)
                </option>
              ))}
            </select>
          </div>

          {/* Quiz Options */}
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
                {QUESTION_COUNTS.map((count) => (
                  <option key={count} value={count}>
                    {count} Questions
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-2">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-dark-input-bg dark:border-dark-input-border dark:text-dark-text"
              >
                {DIFFICULTY_OPTIONS.map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Generate Button */}
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

          {/* Error Message */}
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900 dark:border-red-700 dark:text-red-300"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span>{error}</span>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Display */
        <div className="max-w-4xl mx-auto">
          {/* Quiz Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-text">
              Quiz: {documents.find((doc) => doc.id === selectedDoc)?.name}
            </h3>
            <div className="flex items-center space-x-4">
              {showResults && (
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium dark:bg-blue-900 dark:text-blue-200">
                  Score: {calculateScore()}%
                </div>
              )}
              <button
                onClick={resetQuiz}
                className="text-gray-600 hover:text-gray-900 dark:text-dark-text-secondary dark:hover:text-dark-text"
              >
                Generate New Quiz
              </button>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {currentQuiz.questions.map((question, index) => (
              <div
                key={question.id}
                className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-dark-surface dark:border-dark-input-border"
              >
                <div className="mb-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-2">
                    Question {index + 1}
                  </h4>
                  <div className="text-gray-700 dark:text-dark-text-secondary">
                    <LaTeXRenderer content={question.question ?? ''} />
                  </div>
                </div>

                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => (
                    <button
                      key={optionIndex}
                      onClick={() => handleAnswerSelect(question.id, optionIndex)}
                      disabled={showResults}
                      className={getAnswerButtonClass(question.id, optionIndex, question.correctAnswer)}
                    >
                      <LaTeXRenderer content={option ?? ''} />
                    </button>
                  ))}
                </div>

                {showResults && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900 dark:border-blue-700">
                    <div className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">
                      Explanation:
                    </div>
                    <div className="text-blue-700 dark:text-blue-300">
                      <LaTeXRenderer content={question.explanation ?? ''} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
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
