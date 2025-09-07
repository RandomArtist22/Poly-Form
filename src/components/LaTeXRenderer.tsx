import React from 'react';

interface LaTeXRendererProps {
  content: string | undefined | null; // Allow undefined/null at prop level
}

const LaTeXRenderer: React.FC<LaTeXRendererProps> = ({ content }) => {
  // Ensure content is a string before processing
  const safeContent = typeof content === 'string' ? content : '';
  console.log('LaTeXRenderer received content:', safeContent);

  // Comprehensive LaTeX to HTML conversion for advanced math expressions
  const renderLaTeX = (text: string): string => { // Now text is guaranteed to be a string
    return text
      // Display math: \[...\] (block math)
      .replace(/\\\[(.*?)\\\]/gs, '<div class="math-display">$1</div>')
      // Inline math: \(...\)
      .replace(/\\\((.*?)\\\)/gs, '<span class="math-inline">$1</span>')
      // Display math: $$...$$
      .replace(/\$\$([^$]+)\$\$/g, '<div class="math-display">$1</div>')
      // Inline math: $...$
      .replace(/\$([^$]+)\$/g, '<span class="math-inline">$1</span>')

      // Advanced mathematical constructs
      // Overline and accents
      .replace(/\\overline\{([^}]+)\}/g, '<span class="math-overline">$1</span>')
      .replace(/\\underline\{([^}]+)\}/g, '<span class="math-underline">$1</span>')
      .replace(/\\hat\{([^}]+)\}/g, '<span class="math-hat">$1</span>')
      .replace(/\\tilde\{([^}]+)\}/g, '<span class="math-tilde">$1</span>')
      .replace(/\\vec\{([^}]+)\}/g, '<span class="math-vec">$1</span>')
      .replace(/\\dot\{([^}]+)\}/g, '<span class="math-dot">$1</span>')
      .replace(/\\ddot\{([^}]+)\}/g, '<span class="math-ddot">$1</span>')

      // Matrices and arrays with enhanced support
      .replace(/\\begin\{pmatrix\}(.*?)\\end\{pmatrix\}/gs, function(match: string, content: string) {
        const rows: string[] = content.trim().split('\\\\').map((row: string) => row.trim());
        const tableRows: string = rows.map((row: string) => {
          const cells: string[] = row.split('&').map((cell: string) => cell.trim());
          return `<tr>${cells.map((cell: string) => `<td>${cell}</td>`).join('')}</tr>`;
        }).join('');
        return `<table class="math-matrix math-pmatrix"><tbody>${tableRows}</tbody></table>`;
      })
      .replace(/\\begin\{bmatrix\}(.*?)\\end\{bmatrix\}/gs, function(match: string, content: string) {
        const rows: string[] = content.trim().split('\\\\').map((row: string) => row.trim());
        const tableRows: string = rows.map((row: string) => {
          const cells: string[] = row.split('&').map((cell: string) => cell.trim());
          return `<tr>${cells.map((cell: string) => `<td>${cell}</td>`).join('')}</tr>`;
        }).join('');
        return `<table class="math-matrix math-bmatrix"><tbody>${tableRows}</tbody></table>`;
      })
      .replace(/\\begin\{matrix\}(.*?)\\end\{matrix\}/gs, function(match: string, content: string) {
        const rows: string[] = content.trim().split('\\\\').map((row: string) => row.trim());
        const tableRows: string = rows.map((row: string) => {
          const cells: string[] = row.split('&').map((cell: string) => cell.trim());
          return `<tr>${cells.map((cell: string) => `<td>${cell}</td>`).join('')}</tr>`;
        }).join('');
        return `<table class="math-matrix"><tbody>${tableRows}</tbody></table>`;
      })
      .replace(/\\begin\{vmatrix\}(.*?)\\end\{vmatrix\}/gs, function(match: string, content: string) {
        const rows: string[] = content.trim().split('\\\\').map((row: string) => row.trim());
        const tableRows: string = rows.map((row: string) => {
          const cells: string[] = row.split('&').map((cell: string) => cell.trim());
          return `<tr>${cells.map((cell: string) => `<td>${cell}</td>`).join('')}</tr>`;
        }).join('');
        return `<table class="math-matrix math-vmatrix"><tbody>${tableRows}</tbody></table>`;
      })
      .replace(/\\begin\{Vmatrix\}(.*?)\\end\{Vmatrix\}/gs, function(match: string, content: string) {
        const rows: string[] = content.trim().split('\\\\').map((row: string) => row.trim());
        const tableRows: string = rows.map((row: string) => {
          const cells: string[] = row.split('&').map((cell: string) => cell.trim());
          return `<tr>${cells.map((cell: string) => `<td>${cell}</td>`).join('')}</tr>`;
        }).join('');
        return `<table class="math-matrix math-Vmatrix"><tbody>${tableRows}</tbody></table>`;
      })

      // Integration and differentiation
      .replace(/\\int/g, '∫')
      .replace(/\\iint/g, '∬')
      .replace(/\\iiint/g, '∭')
      .replace(/\\oint/g, '∮')
      .replace(/\\partial/g, '∂')
      .replace(/\\nabla/g, '∇')
      .replace(/\\Delta/g, 'Δ')
      .replace(/\\delta/g, 'δ')

      // Enhanced fraction support with comprehensive regex patterns
      .replace(/\\dfrac\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, function(match, num, den) {
        return `<span class="math-frac"><span class="math-num">${num}</span><span class="math-den">${den}</span></span>`;
      })
      .replace(/\\frac\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, function(match, num, den) {
        return `<span class="math-frac"><span class="math-num">${num}</span><span class="math-den">${den}</span></span>`;
      })
      // Simple fractions for basic cases
      .replace(/\\dfrac\{([^}]+)\}\{([^}]+)\}/g, '<span class="math-frac"><span class="math-num">$1</span><span class="math-den">$2</span></span>')
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="math-frac"><span class="math-num">$1</span><span class="math-den">$2</span></span>')
      // Handle fractions with complex expressions inside
      .replace(/\\dfrac\{((?:[^{}]|\{[^{}]*\})*)\}\{((?:[^{}]|\{[^{}]*\})*)\}/g, '<span class="math-frac"><span class="math-num">$1</span><span class="math-den">$2</span></span>')
      .replace(/\\frac\{((?:[^{}]|\{[^{}]*\})*)\}\{((?:[^{}]|\{[^{}]*\})*)\}/g, '<span class="math-frac"><span class="math-num">$1</span><span class="math-den">$2</span></span>')

      // Blackboard bold (mathbb)
      .replace(/\\mathbb\{R\}/g, '<span class="math-bb">ℝ</span>')
      .replace(/\\mathbb\{N\}/g, '<span class="math-bb">ℕ</span>')
      .replace(/\\mathbb\{Z\}/g, '<span class="math-bb">ℤ</span>')
      .replace(/\\mathbb\{Q\}/g, '<span class="math-bb">ℚ</span>')
      .replace(/\\mathbb\{C\}/g, '<span class="math-bb">ℂ</span>')
      .replace(/\\mathbb\{H\}/g, '<span class="math-bb">ℍ</span>')
      .replace(/\\mathbb\{P\}/g, '<span class="math-bb">ℙ</span>')

      // Advanced operators
      .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
      .replace(/\\sqrt\[([^}]+)\]\{([^}]+)\}/g, '<span class="math-root"><sup>$1</sup>√($2)</span>')
      .replace(/\\sum/g, '∑')
      .replace(/\\prod/g, '∏')
      .replace(/\\bigcup/g, '⋃')
      .replace(/\\bigcap/g, '⋂')
      .replace(/\\bigoplus/g, '⨁')
      .replace(/\\bigotimes/g, '⨂')

      // Greek letters (extended)
      .replace(/\\alpha/g, 'α')
      .replace(/\\beta/g, 'β')
      .replace(/\\gamma/g, 'γ')
      .replace(/\\delta/g, 'δ')
      .replace(/\\epsilon/g, 'ε')
      .replace(/\\zeta/g, 'ζ')
      .replace(/\\eta/g, 'η')
      .replace(/\\theta/g, 'θ')
      .replace(/\\iota/g, 'ι')
      .replace(/\\kappa/g, 'κ')
      .replace(/\\lambda/g, 'λ')
      .replace(/\\mu/g, 'μ')
      .replace(/\\nu/g, 'ν')
      .replace(/\\xi/g, 'ξ')
      .replace(/\\pi/g, 'π')
      .replace(/\\rho/g, 'ρ')
      .replace(/\\sigma/g, 'σ')
      .replace(/\\tau/g, 'τ')
      .replace(/\\upsilon/g, 'υ')
      .replace(/\\phi/g, 'φ')
      .replace(/\\chi/g, 'χ')
      .replace(/\\psi/g, 'ψ')
      .replace(/\\omega/g, 'ω')
      .replace(/\\Gamma/g, 'Γ')
      .replace(/\\Delta/g, 'Δ')
      .replace(/\\Theta/g, 'Θ')
      .replace(/\\Lambda/g, 'Λ')
      .replace(/\\Xi/g, 'Ξ')
      .replace(/\\Pi/g, 'Π')
      .replace(/\\Sigma/g, 'Σ')
      .replace(/\\Upsilon/g, 'Υ')
      .replace(/\\Phi/g, 'Φ')
      .replace(/\\Psi/g, 'Ψ')
      .replace(/\\Omega/g, 'Ω')

      // Relations and operators
      .replace(/\\pm/g, '±')
      .replace(/\\times/g, '×')
      .replace(/\\div/g, '÷')
      .replace(/\\cdot/g, '·')
      .replace(/\\cap/g, '∩')
      .replace(/\\cup/g, '∪')
      .replace(/\\leq/g, '≤')
      .replace(/\\geq/g, '≥')
      .replace(/\\neq/g, '≠')
      .replace(/\\approx/g, '≈')
      .replace(/\\equiv/g, '≡')
      .replace(/\\sim/g, '∼')
      .replace(/\\cong/g, '≅')
      .replace(/\\propto/g, '∝')
      .replace(/\\subset/g, '⊂')
      .replace(/\\subseteq/g, '⊆')
      .replace(/\\supset/g, '⊃')
      .replace(/\\supseteq/g, '⊇')
      .replace(/\\in/g, '∈')
      .replace(/\\notin/g, '∉')
      .replace(/\\forall/g, '∀')
      .replace(/\\exists/g, '∃')
      .replace(/\\neg/g, '¬')
      .replace(/\\land/g, '∧')
      .replace(/\\lor/g, '∨')
      .replace(/\\implies/g, '⇒')
      .replace(/\\iff/g, '⇔')

      // Braces and delimiters
      .replace(/\\\{/g, '{')
      .replace(/\\\}/g, '}')
      .replace(/\\lbrace/g, '{')
      .replace(/\\rbrace/g, '}')
      .replace(/\\lfloor/g, '⌊')
      .replace(/\\rfloor/g, '⌋')
      .replace(/\\lceil/g, '⌈')
      .replace(/\\rceil/g, '⌉')

      // Mathematical functions
      .replace(/\\det/g, '<span class="math-func">det</span>')
      .replace(/\\dim/g, '<span class="math-func">dim</span>')
      .replace(/\\ker/g, '<span class="math-func">ker</span>')
      .replace(/\\deg/g, '<span class="math-func">deg</span>')
      .replace(/\\arg/g, '<span class="math-func">arg</span>')
      .replace(/\\exp/g, '<span class="math-func">exp</span>')

      // Arrows (extended)
      .replace(/\\to/g, '→')
      .replace(/\\rightarrow/g, '→')
      .replace(/\\leftarrow/g, '←')
      .replace(/\\uparrow/g, '↑')
      .replace(/\\downarrow/g, '↓')
      .replace(/\\leftrightarrow/g, '↔')
      .replace(/\\Rightarrow/g, '⇒')
      .replace(/\\Leftarrow/g, '⇐')
      .replace(/\\Leftrightarrow/g, '⇔')
      .replace(/\\mapsto/g, '↦')
      .replace(/\\hookrightarrow/g, '↪')
      .replace(/\\hookleftarrow/g, '↩')
      .replace(/\\rightrightarrows/g, '⇉')
      .replace(/\\leftleftarrows/g, '⇇')

      // Advanced operators and symbols
      .replace(/\\emptyset/g, '∅')
      .replace(/\\infty/g, '∞')
      .replace(/\\aleph/g, 'ℵ')
      .replace(/\\hbar/g, 'ℏ')
      .replace(/\\ell/g, 'ℓ')
      .replace(/\\wp/g, '℘')
      .replace(/\\Re/g, 'ℜ')
      .replace(/\\Im/g, 'ℑ')
      .replace(/\\angle/g, '∠')
      .replace(/\\measuredangle/g, '∡')
      .replace(/\\sphericalangle/g, '∢')
      .replace(/\\top/g, '⊤')
      .replace(/\\bot/g, '⊥')
      .replace(/\\vdash/g, '⊢')
      .replace(/\\dashv/g, '⊣')
      .replace(/\\models/g, '⊨')
      .replace(/\\therefore/g, '∴')
      .replace(/\\because/g, '∵')
      .replace(/\\QED/g, '∎')
      .replace(/\\blacksquare/g, '∎')

      // Set theory and logic (extended)
      .replace(/\\complement/g, '∁')
      .replace(/\\symmetricdifference/g, '△')
      .replace(/\\triangle/g, '△')
      .replace(/\\ominus/g, '⊖')
      .replace(/\\oslash/g, '⊘')
      .replace(/\\odot/g, '⊙')
      .replace(/\\oplus/g, '⊕')
      .replace(/\\otimes/g, '⊗')
      .replace(/\\ocirc/g, '⊚')
      .replace(/\\obar/g, '⌽')

      // Comparison operators (extended)
      .replace(/\\doteq/g, '≐')
      .replace(/\\doteqdot/g, '≑')
      .replace(/\\fallingdotseq/g, '≒')
      .replace(/\\risingdotseq/g, '≓')
      .replace(/\\coloneq/g, '≔')
      .replace(/\\eqcolon/g, '≕')
      .replace(/\\eqcirc/g, '≖')
      .replace(/\\circeq/g, '≗')
      .replace(/\\arceq/g, '≘')
      .replace(/\\wedgeq/g, '≙')
      .replace(/\\veeeq/g, '≚')
      .replace(/\\stareq/g, '≛')
      .replace(/\\triangleq/g, '≜')
      .replace(/\\measeq/g, '≞')
      .replace(/\\questeq/g, '≟')
      .replace(/\\nearrow/g, '↗')
      .replace(/\\searrow/g, '↘')
      .replace(/\\swarrow/g, '↙')
      .replace(/\\nwarrow/g, '↖')

      // Superscripts and subscripts
      .replace(/\^(\d+)/g, '<sup>$1</sup>')
      .replace(/\^{([^}]+)}/g, '<sup>$1</sup>')
      .replace(/_(\d+)/g, '<sub>$1</sub>')
      .replace(/_{([^}]+)}/g, '<sub>$1</sub>')

      // Limits and operators
      .replace(/\\lim/g, '<span class="math-lim">lim</span>')
      .replace(/\\log/g, '<span class="math-func">log</span>')
      .replace(/\\ln/g, '<span class="math-func">ln</span>')
      .replace(/\\sin/g, '<span class="math-func">sin</span>')
      .replace(/\\cos/g, '<span class="math-func">cos</span>')
      .replace(/\\tan/g, '<span class="math-func">tan</span>')
      .replace(/\\infty/g, '∞')

      // Bold and italic
      .replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
      .replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>')

      // Enhanced paragraph and spacing handling
      .replace(/\n\s*\n/g, '</p><p class="mb-4">') // Double line breaks to paragraphs
      .replace(/\\\\/g, '<br class="mb-2">') // Single line breaks with spacing
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')

      // Enhanced heading formatting with better spacing
      .replace(/^### (.+)$/gm, '</p><h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">$1</h3><p class="mb-4">')
      .replace(/^## (.+)$/gm, '</p><h2 class="text-xl font-semibold text-gray-900 mt-8 mb-4">$1</h2><p class="mb-4">')
      .replace(/^# (.+)$/gm, '</p><h1 class="text-2xl font-bold text-gray-900 mt-10 mb-5">$1</h1><p class="mb-4">')

      // Enhanced list formatting
      .replace(/^- (.+)$/gm, '<li class="ml-6 mb-2">• $1</li>')
      .replace(/^\d+\. (.+)$/gm, '<li class="ml-6 mb-2 list-decimal">$1</li>')

      // Add spacing around mathematical expressions
      .replace(/(<div class="math-display">[^<]+<\/div>)/g, '<div class="my-4">$1</div>')
      .replace(/(<span class="math-inline">[^<]+<\/span>)/g, '<span class="mx-1">$1</span>');
  };

  let processedContent = safeContent;

  // Pre-process content for better paragraph handling
  if (!processedContent.startsWith('#') && !processedContent.startsWith('##') && !processedContent.startsWith('###')) {
    processedContent = processedContent.trim();
  }

  const renderedContent = renderLaTeX(processedContent);

  // Ensure content starts and ends with proper paragraph tags
  let finalContent = renderedContent;
  if (!finalContent.startsWith('<p') && !finalContent.startsWith('<h') && !finalContent.startsWith('<div') && !finalContent.startsWith('<table')) {
    finalContent = `<p class="mb-4">${finalContent}`;
  }
  if (!finalContent.endsWith('</p>') && !finalContent.endsWith('</div>') && !finalContent.endsWith('</table>') && !finalContent.includes('<br')) {
    finalContent = `${finalContent}</p>`;
  }

  console.log('LaTeXRenderer rendering:', {
    original: safeContent.substring(0, 100),
    processed: processedContent.substring(0, 100),
    rendered: finalContent.substring(0, 100),
    hasContent: !!safeContent,
    hasFractions: safeContent.includes('\\frac') || safeContent.includes('\\dfrac')
  });

  // If no content, show a fallback
  if (!safeContent || safeContent.trim() === '') {
    return <div style={{ color: 'red', padding: '10px', border: '1px solid red' }}>No content to render</div>;
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
