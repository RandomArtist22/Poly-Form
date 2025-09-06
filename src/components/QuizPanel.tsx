import React, { useState } from 'react';
import { FileText, Loader, CheckCircle, Settings, Play } from 'lucide-react';
import LaTeXRenderer from './LaTeXRenderer';

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

  const generateQuiz = async (content: string, count: number, difficulty: string): Promise<Quiz> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockQuestions = [
      {
        id: '1',
        question: 'What is the fundamental equation relating energy and mass according to Einstein\'s theory of relativity?',
        options: ['$E = mc$', '$E = mc^2$', '$E = m^2c$', '$E = \\frac{mc^2}{2}$'],
        correctAnswer: 1,
        explanation: 'Einstein\'s famous equation $E = mc^2$ demonstrates the equivalence of mass and energy, where $c$ is the speed of light.'
      },
      {
        id: '2',
        question: 'Which mathematical concept is used to find the area under a curve?',
        options: ['Differentiation', 'Integration', 'Multiplication', 'Substitution'],
        correctAnswer: 1,
        explanation: 'Integration is the mathematical process used to find areas under curves, among other applications.'
      },
      {
        id: '3',
        question: 'What is the quadratic formula used to solve equations of the form $ax^2 + bx + c = 0$?',
        options: [
          '$x = \\frac{-b}{2a}$',
          '$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$',
          '$x = \\frac{b \\pm \\sqrt{b^2+4ac}}{2a}$',
          '$x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{a}$'
        ],
        correctAnswer: 1,
        explanation: 'The quadratic formula $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$ provides the solution(s) to any quadratic equation.'
      },
      {
        id: '4',
        question: 'In physics, what does Newton\'s second law state?',
        options: ['$F = ma$', '$F = m/a$', '$F = a/m$', '$F = m + a$'],
        correctAnswer: 0,
        explanation: 'Newton\'s second law states that force equals mass times acceleration: $F = ma$.'
      },
      {
        id: '5',
        question: 'Which of the following represents the derivative of $x^n$ with respect to $x$?',
        options: ['$nx^{n-1}$', '$nx^{n+1}$', '$x^{n-1}$', '$\\frac{x^{n+1}}{n+1}$'],
        correctAnswer: 0,
        explanation: 'The power rule states that the derivative of $x^n$ is $nx^{n-1}$.'
      }
    ];

    return {
      questions: mockQuestions.slice(0, count)
    };
  };

  const handleGenerateQuiz = async () => {
    if (!selectedDoc) return;

    const document = documents.find(doc => doc.id === selectedDoc);
    if (!document) return;

    setIsGenerating(true);
    setCurrentQuiz(null);
    setUserAnswers({});
    setShowResults(false);
    
    try {
      const quiz = await generateQuiz(document.content, questionCount, difficulty);
      setCurrentQuiz(quiz);

      onResult('quiz', `${document.name} - Quiz (${questionCount} questions)`, {
        documentName: document.name,
        quiz,
        questionCount,
        difficulty
      });
    } catch (error) {
      console.error('Quiz generation failed:', error);
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
      <div className="p-8 text-center">
        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Available</h3>
        <p className="text-gray-500">Upload documents in the Content Input tab to generate quizzes.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Interactive Quiz Generator</h2>
        <p className="text-gray-600">Generate customized quizzes from your content with adjustable difficulty and question count.</p>
      </div>

      {!currentQuiz ? (
        <div className="max-w-2xl mx-auto space-y-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={3}>3 Questions</option>
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Quiz: {documents.find(doc => doc.id === selectedDoc)?.name}
            </h3>
            <div className="flex items-center space-x-4">
              {showResults && (
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium">
                  Score: {calculateScore()}%
                </div>
              )}
              <button
                onClick={() => {
                  setCurrentQuiz(null);
                  setUserAnswers({});
                  setShowResults(false);
                }}
                className="text-gray-600 hover:text-gray-900"
              >
                Generate New Quiz
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {currentQuiz.questions.map((question, index) => (
              <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="mb-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    Question {index + 1}
                  </h4>
                  <div className="text-gray-700">
                    <LaTeXRenderer content={question.question} />
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
                        buttonClass += 'border-green-500 bg-green-50 text-green-700';
                      } else if (isSelected && !isCorrect) {
                        buttonClass += 'border-red-500 bg-red-50 text-red-700';
                      } else {
                        buttonClass += 'border-gray-200 bg-gray-50';
                      }
                    } else {
                      buttonClass += isSelected 
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300';
                    }

                    return (
                      <button
                        key={optionIndex}
                        onClick={() => handleAnswerSelect(question.id, optionIndex)}
                        disabled={showResults}
                        className={buttonClass}
                      >
                        <LaTeXRenderer content={option} />
                      </button>
                    );
                  })}
                </div>

                {showResults && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm font-medium text-blue-900 mb-1">Explanation:</div>
                    <div className="text-blue-700">
                      <LaTeXRenderer content={question.explanation} />
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