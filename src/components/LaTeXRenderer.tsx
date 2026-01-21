/**
 * LaTeX Renderer Component
 *
 * Converts LaTeX mathematical notation to rendered HTML.
 * Supports a comprehensive set of mathematical symbols, matrices, and formatting.
 */

import React from 'react';

/** Component props */
interface LaTeXRendererProps {
  content: string | undefined | null;
}

/**
 * Symbol replacement mappings organized by category
 */
const SYMBOL_REPLACEMENTS: Array<[RegExp, string]> = [
  // Integration and differentiation
  [/\\int/g, '∫'],
  [/\\iint/g, '∬'],
  [/\\iiint/g, '∭'],
  [/\\oint/g, '∮'],
  [/\\partial/g, '∂'],
  [/\\nabla/g, '∇'],
  [/\\Delta/g, 'Δ'],

  // Greek letters (lowercase)
  [/\\alpha/g, 'α'],
  [/\\beta/g, 'β'],
  [/\\gamma/g, 'γ'],
  [/\\delta/g, 'δ'],
  [/\\epsilon/g, 'ε'],
  [/\\zeta/g, 'ζ'],
  [/\\eta/g, 'η'],
  [/\\theta/g, 'θ'],
  [/\\iota/g, 'ι'],
  [/\\kappa/g, 'κ'],
  [/\\lambda/g, 'λ'],
  [/\\mu/g, 'μ'],
  [/\\nu/g, 'ν'],
  [/\\xi/g, 'ξ'],
  [/\\pi/g, 'π'],
  [/\\rho/g, 'ρ'],
  [/\\sigma/g, 'σ'],
  [/\\tau/g, 'τ'],
  [/\\upsilon/g, 'υ'],
  [/\\phi/g, 'φ'],
  [/\\chi/g, 'χ'],
  [/\\psi/g, 'ψ'],
  [/\\omega/g, 'ω'],

  // Greek letters (uppercase)
  [/\\Gamma/g, 'Γ'],
  [/\\Theta/g, 'Θ'],
  [/\\Lambda/g, 'Λ'],
  [/\\Xi/g, 'Ξ'],
  [/\\Pi/g, 'Π'],
  [/\\Sigma/g, 'Σ'],
  [/\\Upsilon/g, 'Υ'],
  [/\\Phi/g, 'Φ'],
  [/\\Psi/g, 'Ψ'],
  [/\\Omega/g, 'Ω'],

  // Operators
  [/\\pm/g, '±'],
  [/\\times/g, '×'],
  [/\\div/g, '÷'],
  [/\\cdot/g, '·'],
  [/\\sum/g, '∑'],
  [/\\prod/g, '∏'],
  [/\\bigcup/g, '⋃'],
  [/\\bigcap/g, '⋂'],
  [/\\bigoplus/g, '⨁'],
  [/\\bigotimes/g, '⨂'],

  // Relations
  [/\\cap/g, '∩'],
  [/\\cup/g, '∪'],
  [/\\leq/g, '≤'],
  [/\\geq/g, '≥'],
  [/\\neq/g, '≠'],
  [/\\approx/g, '≈'],
  [/\\equiv/g, '≡'],
  [/\\sim/g, '∼'],
  [/\\cong/g, '≅'],
  [/\\propto/g, '∝'],
  [/\\subset/g, '⊂'],
  [/\\subseteq/g, '⊆'],
  [/\\supset/g, '⊃'],
  [/\\supseteq/g, '⊇'],
  [/\\in/g, '∈'],
  [/\\notin/g, '∉'],

  // Logic
  [/\\forall/g, '∀'],
  [/\\exists/g, '∃'],
  [/\\neg/g, '¬'],
  [/\\land/g, '∧'],
  [/\\lor/g, '∨'],
  [/\\implies/g, '⇒'],
  [/\\iff/g, '⇔'],

  // Arrows
  [/\\to/g, '→'],
  [/\\rightarrow/g, '→'],
  [/\\leftarrow/g, '←'],
  [/\\uparrow/g, '↑'],
  [/\\downarrow/g, '↓'],
  [/\\leftrightarrow/g, '↔'],
  [/\\Rightarrow/g, '⇒'],
  [/\\Leftarrow/g, '⇐'],
  [/\\Leftrightarrow/g, '⇔'],
  [/\\mapsto/g, '↦'],
  [/\\hookrightarrow/g, '↪'],
  [/\\hookleftarrow/g, '↩'],
  [/\\nearrow/g, '↗'],
  [/\\searrow/g, '↘'],
  [/\\swarrow/g, '↙'],
  [/\\nwarrow/g, '↖'],

  // Delimiters
  [/\\\{/g, '{'],
  [/\\\}/g, '}'],
  [/\\lbrace/g, '{'],
  [/\\rbrace/g, '}'],
  [/\\lfloor/g, '⌊'],
  [/\\rfloor/g, '⌋'],
  [/\\lceil/g, '⌈'],
  [/\\rceil/g, '⌉'],

  // Special symbols
  [/\\emptyset/g, '∅'],
  [/\\infty/g, '∞'],
  [/\\aleph/g, 'ℵ'],
  [/\\hbar/g, 'ℏ'],
  [/\\ell/g, 'ℓ'],
  [/\\wp/g, '℘'],
  [/\\Re/g, 'ℜ'],
  [/\\Im/g, 'ℑ'],
  [/\\angle/g, '∠'],
  [/\\top/g, '⊤'],
  [/\\bot/g, '⊥'],
  [/\\vdash/g, '⊢'],
  [/\\dashv/g, '⊣'],
  [/\\models/g, '⊨'],
  [/\\therefore/g, '∴'],
  [/\\because/g, '∵'],
  [/\\QED/g, '∎'],
  [/\\blacksquare/g, '∎'],
  [/\\triangle/g, '△'],
  [/\\oplus/g, '⊕'],
  [/\\otimes/g, '⊗'],
  [/\\odot/g, '⊙'],
];

/**
 * Blackboard bold character mappings
 */
const BLACKBOARD_BOLD: Record<string, string> = {
  R: 'ℝ',
  N: 'ℕ',
  Z: 'ℤ',
  Q: 'ℚ',
  C: 'ℂ',
  H: 'ℍ',
  P: 'ℙ',
};

/**
 * Converts a matrix environment to an HTML table
 */
function renderMatrix(content: string, className: string): string {
  const rows = content
    .trim()
    .split('\\\\')
    .map((row) => row.trim());

  const tableRows = rows
    .map((row) => {
      const cells = row.split('&').map((cell) => cell.trim());
      return `<tr>${cells.map((cell) => `<td>${cell}</td>`).join('')}</tr>`;
    })
    .join('');

  return `<table class="math-matrix ${className}"><tbody>${tableRows}</tbody></table>`;
}

/**
 * Converts LaTeX content to HTML with proper rendering
 */
function renderLaTeX(text: string): string {
  let result = text;

  // Math display modes
  result = result.replace(/\\\[(.*?)\\\]/gs, '<div class="math-display">$1</div>');
  result = result.replace(/\\\((.*?)\\\)/gs, '<span class="math-inline">$1</span>');
  result = result.replace(/\$\$([^$]+)\$\$/g, '<div class="math-display">$1</div>');
  result = result.replace(/\$([^$]+)\$/g, '<span class="math-inline">$1</span>');

  // Accents and decorations
  result = result.replace(/\\overline\{([^}]+)\}/g, '<span class="math-overline">$1</span>');
  result = result.replace(/\\underline\{([^}]+)\}/g, '<span class="math-underline">$1</span>');
  result = result.replace(/\\hat\{([^}]+)\}/g, '<span class="math-hat">$1</span>');
  result = result.replace(/\\tilde\{([^}]+)\}/g, '<span class="math-tilde">$1</span>');
  result = result.replace(/\\vec\{([^}]+)\}/g, '<span class="math-vec">$1</span>');
  result = result.replace(/\\dot\{([^}]+)\}/g, '<span class="math-dot">$1</span>');
  result = result.replace(/\\ddot\{([^}]+)\}/g, '<span class="math-ddot">$1</span>');

  // Matrix environments
  result = result.replace(
    /\\begin\{pmatrix\}(.*?)\\end\{pmatrix\}/gs,
    (_, content) => renderMatrix(content, 'math-pmatrix')
  );
  result = result.replace(
    /\\begin\{bmatrix\}(.*?)\\end\{bmatrix\}/gs,
    (_, content) => renderMatrix(content, 'math-bmatrix')
  );
  result = result.replace(
    /\\begin\{matrix\}(.*?)\\end\{matrix\}/gs,
    (_, content) => renderMatrix(content, '')
  );
  result = result.replace(
    /\\begin\{vmatrix\}(.*?)\\end\{vmatrix\}/gs,
    (_, content) => renderMatrix(content, 'math-vmatrix')
  );
  result = result.replace(
    /\\begin\{Vmatrix\}(.*?)\\end\{Vmatrix\}/gs,
    (_, content) => renderMatrix(content, 'math-Vmatrix')
  );

  // Fractions
  const fractionReplacement = '<span class="math-frac"><span class="math-num">$1</span><span class="math-den">$2</span></span>';
  result = result.replace(/\\dfrac\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, fractionReplacement);
  result = result.replace(/\\frac\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, fractionReplacement);
  result = result.replace(/\\dfrac\{([^}]+)\}\{([^}]+)\}/g, fractionReplacement);
  result = result.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, fractionReplacement);

  // Blackboard bold
  for (const [letter, symbol] of Object.entries(BLACKBOARD_BOLD)) {
    result = result.replace(new RegExp(`\\\\mathbb\\{${letter}\\}`, 'g'), `<span class="math-bb">${symbol}</span>`);
  }

  // Square roots
  result = result.replace(/\\sqrt\{([^}]+)\}/g, '√($1)');
  result = result.replace(/\\sqrt\[([^}]+)\]\{([^}]+)\}/g, '<span class="math-root"><sup>$1</sup>√($2)</span>');

  // Apply symbol replacements
  for (const [pattern, replacement] of SYMBOL_REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }

  // Mathematical functions
  const functions = ['det', 'dim', 'ker', 'deg', 'arg', 'exp', 'log', 'ln', 'sin', 'cos', 'tan', 'lim'];
  for (const func of functions) {
    result = result.replace(new RegExp(`\\\\${func}`, 'g'), `<span class="math-func">${func}</span>`);
  }

  // Superscripts and subscripts
  result = result.replace(/\^(\d+)/g, '<sup>$1</sup>');
  result = result.replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>');
  result = result.replace(/_(\d+)/g, '<sub>$1</sub>');
  result = result.replace(/_\{([^}]+)\}/g, '<sub>$1</sub>');

  // Text formatting
  result = result.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>');
  result = result.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>');
  result = result.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Paragraphs and line breaks
  result = result.replace(/\n\s*\n/g, '</p><p class="mb-4">');
  result = result.replace(/\\\\/g, '<br class="mb-2">');

  // Headings
  result = result.replace(/^### (.+)$/gm, '</p><h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">$1</h3><p class="mb-4">');
  result = result.replace(/^## (.+)$/gm, '</p><h2 class="text-xl font-semibold text-gray-900 mt-8 mb-4">$1</h2><p class="mb-4">');
  result = result.replace(/^# (.+)$/gm, '</p><h1 class="text-2xl font-bold text-gray-900 mt-10 mb-5">$1</h1><p class="mb-4">');

  // Lists
  result = result.replace(/^- (.+)$/gm, '<li class="ml-6 mb-2">• $1</li>');
  result = result.replace(/^\d+\. (.+)$/gm, '<li class="ml-6 mb-2 list-decimal">$1</li>');

  return result;
}

/**
 * LaTeX Renderer Component
 */
const LaTeXRenderer: React.FC<LaTeXRendererProps> = ({ content }) => {
  const safeContent = typeof content === 'string' ? content : '';

  if (!safeContent.trim()) {
    return (
      <div style={{ color: 'red', padding: '10px', border: '1px solid red' }}>
        No content to render
      </div>
    );
  }

  const processedContent = safeContent.trim();
  let finalContent = renderLaTeX(processedContent);

  // Ensure proper paragraph wrapping
  if (!finalContent.startsWith('<p') && !finalContent.startsWith('<h') && !finalContent.startsWith('<div') && !finalContent.startsWith('<table')) {
    finalContent = `<p class="mb-4">${finalContent}`;
  }
  if (!finalContent.endsWith('</p>') && !finalContent.endsWith('</div>') && !finalContent.endsWith('</table>') && !finalContent.includes('<br')) {
    finalContent = `${finalContent}</p>`;
  }

  return (
    <div
      className="latex-content prose prose-sm max-w-none p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-600 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: finalContent }}
      style={{
        lineHeight: '2',
        fontSize: '16px',
        wordSpacing: '0.1em',
      }}
    />
  );
};

export default LaTeXRenderer;
