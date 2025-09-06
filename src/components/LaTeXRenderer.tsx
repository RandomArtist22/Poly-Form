import React from 'react';

interface LaTeXRendererProps {
  content: string;
}

const LaTeXRenderer: React.FC<LaTeXRendererProps> = ({ content }) => {
  // Simple LaTeX to HTML conversion for basic math expressions
  const renderLaTeX = (text: string): string => {
    return text
      // Inline math: $...$
      .replace(/\$([^$]+)\$/g, '<span class="math-inline">$1</span>')
      // Display math: $$...$$
      .replace(/\$\$([^$]+)\$\$/g, '<div class="math-display">$1</div>')
      // Common LaTeX commands
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="math-frac"><span class="math-num">$1</span>/<span class="math-den">$2</span></span>')
      .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
      .replace(/\\pm/g, '±')
      .replace(/\\times/g, '×')
      .replace(/\\div/g, '÷')
      .replace(/\\cdot/g, '·')
      .replace(/\\alpha/g, 'α')
      .replace(/\\beta/g, 'β')
      .replace(/\\gamma/g, 'γ')
      .replace(/\\delta/g, 'δ')
      .replace(/\\epsilon/g, 'ε')
      .replace(/\\pi/g, 'π')
      .replace(/\\sigma/g, 'σ')
      .replace(/\\theta/g, 'θ')
      .replace(/\\lambda/g, 'λ')
      .replace(/\\mu/g, 'μ')
      .replace(/\\nabla/g, '∇')
      .replace(/\\partial/g, '∂')
      .replace(/\\int/g, '∫')
      .replace(/\\sum/g, '∑')
      .replace(/\\prod/g, '∏')
      .replace(/\\infty/g, '∞')
      .replace(/\\leq/g, '≤')
      .replace(/\\geq/g, '≥')
      .replace(/\\neq/g, '≠')
      .replace(/\\approx/g, '≈')
      .replace(/\\equiv/g, '≡')
      // Superscripts and subscripts
      .replace(/\^(\d+)/g, '<sup>$1</sup>')
      .replace(/\^{([^}]+)}/g, '<sup>$1</sup>')
      .replace(/_(\d+)/g, '<sub>$1</sub>')
      .replace(/_{([^}]+)}/g, '<sub>$1</sub>')
      // Bold and italic
      .replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
      .replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>')
      // Line breaks
      .replace(/\\\\/g, '<br>')
      // Convert markdown-style formatting
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-gray-900 mt-4 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold text-gray-900 mt-6 mb-3">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
      // Lists
      .replace(/^- (.+)$/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');
  };

  return (
    <div 
      className="latex-content prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: renderLaTeX(content) }}
      style={{
        lineHeight: '1.6',
      }}
    />
  );
};

export default LaTeXRenderer;