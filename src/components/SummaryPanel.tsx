import React, { useState } from 'react';
import { BookOpen, Loader, CheckCircle, FileText, Sliders } from 'lucide-react';
import LaTeXRenderer from './LaTeXRenderer';

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

  const summaryOptions = [
    { value: 'short', label: 'Short Summary', description: '2-3 key points' },
    { value: 'medium', label: 'Medium Summary', description: '5-7 main concepts' },
    { value: 'detailed', label: 'Detailed Summary', description: 'Comprehensive overview' }
  ];

  const simulateSummarization = async (content: string, length: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Mock summaries based on length
    const mockSummaries: { [key: string]: string } = {
      'short': `**Key Points:**

• This document covers the fundamental concepts and principles
• Important methodologies and approaches are discussed
• Practical applications and examples are provided

**Mathematical Concepts:**
$E = mc^2$ demonstrates the relationship between energy and mass.`,
      
      'medium': `**Overview:**
This comprehensive document explores various theoretical and practical aspects of the subject matter, providing detailed analysis and insights.

**Main Topics Covered:**
1. **Fundamental Principles**: Basic concepts and theoretical foundations
2. **Methodology**: Systematic approaches and techniques
3. **Applications**: Real-world implementations and use cases
4. **Analysis**: Critical evaluation and interpretation
5. **Future Directions**: Emerging trends and developments

**Key Mathematical Relations:**
- Energy-mass equivalence: $E = mc^2$
- Quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$
- Integration by parts: $\\int u dv = uv - \\int v du$`,
      
      'detailed': `**Comprehensive Summary:**

This document presents an in-depth exploration of complex topics, combining theoretical foundations with practical applications. The content is structured to provide both conceptual understanding and actionable insights.

**Detailed Analysis:**

**Section 1: Theoretical Framework**
- Establishes fundamental principles and core concepts
- Provides historical context and development
- Discusses various theoretical models and their applications

**Section 2: Methodological Approaches**
- Systematic analysis of different techniques
- Comparative evaluation of approaches
- Best practices and implementation guidelines

**Section 3: Practical Applications**
- Real-world case studies and examples
- Industry applications and use cases
- Performance metrics and evaluation criteria

**Section 4: Advanced Concepts**
- Complex relationships and interdependencies
- Mathematical modeling and analysis
- Computational approaches and algorithms

**Key Mathematical Formulations:**
- Einstein's mass-energy equivalence: $E = mc^2$
- Newton's second law: $F = ma$
- Maxwell's equations in differential form:
  - $\\nabla \\cdot E = \\frac{\\rho}{\\epsilon_0}$
  - $\\nabla \\times E = -\\frac{\\partial B}{\\partial t}$

**Conclusions and Future Work:**
The document concludes with recommendations for future research and practical implementation strategies.`
    };

    return mockSummaries[length] || mockSummaries['medium'];
  };

  const handleSummarize = async () => {
    if (!selectedDoc) return;

    const document = documents.find(doc => doc.id === selectedDoc);
    if (!document) return;

    setIsSummarizing(true);
    
    try {
      const summary = await simulateSummarization(document.content, summaryLength);
      
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
    } catch (error) {
      console.error('Summarization failed:', error);
    } finally {
      setIsSummarizing(false);
    }
  };

  if (documents.length === 0) {
    return (
      <div className="p-8 text-center">
        <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Available</h3>
        <p className="text-gray-500">Upload documents in the Content Input tab to start summarizing.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Content Summarization</h2>
        <p className="text-gray-600">Generate intelligent summaries with customizable detail levels, preserving LaTeX formatting.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Summarization Controls */}
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
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Summary Length
            </label>
            <div className="space-y-3">
              {summaryOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setSummaryLength(option.value as 'short' | 'medium' | 'detailed')}
                  className={`w-full p-4 text-left rounded-lg border transition-colors ${
                    summaryLength === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
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
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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

          {summaries[`${selectedDoc}-${summaryLength}`] && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {summaryLength.charAt(0).toUpperCase() + summaryLength.slice(1)} Summary
                </h3>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-h-96 overflow-y-auto">
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