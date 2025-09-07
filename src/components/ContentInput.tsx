import React, { useState, useCallback } from 'react';
import { Upload, FileText, X, Plus, File } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.min.mjs';

interface Document {
  id: string;
  name: string;
  content: string;
  type: string;
}

interface ContentInputProps {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
}

const ContentInput: React.FC<ContentInputProps> = ({ documents, setDocuments }) => {
  const [dragOver, setDragOver] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [fileName, setFileName] = useState('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
          }
          const newDoc: Document = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            content: fullText,
            type: file.type
          };
          setDocuments(prev => [...prev, newDoc]);
        };
        reader.readAsArrayBuffer(file);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          const newDoc: Document = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            content,
            type: file.type || 'text/plain'
          };
          setDocuments(prev => [...prev, newDoc]);
        };
        reader.readAsText(file);
      }
    });
  }, [setDocuments]);

  const addTextDocument = () => {
    if (!textInput.trim()) return;
    
    const newDoc: Document = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: fileName.trim() || `Document ${documents.length + 1}`,
      content: textInput,
      type: 'text/plain'
    };
    
    setDocuments(prev => [...prev, newDoc]);
    setTextInput('');
    setFileName('');
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  return (
    <div className="p-10 dark:bg-dark-background dark:text-dark-text space-y-8">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-3">Content Input</h2>
        <p className="text-gray-600 dark:text-dark-text-secondary text-lg">Upload multiple documents or paste content directly. Supports LaTeX for STEM content.</p>
      </div>

      {/* File Upload Area */}
      <div className="mb-10">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            dragOver
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400'
              : 'border-gray-300 hover:border-gray-400 dark:border-dark-input-border dark:hover:border-dark-scroll-thumb dark:bg-dark-surface'
          }`}
        >
          <Upload className="h-12 w-12 text-gray-400 dark:text-dark-text-secondary mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 dark:text-dark-text mb-2">
            Drop files here or click to upload
          </p>
          <p className="text-gray-500 dark:text-dark-text-secondary mb-4">
            Supports .txt, .md, .pdf, and other text formats
          </p>
          <input
            type="file"
            multiple
            accept=".txt,.md,.pdf,.doc,.docx"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              files.forEach(file => {
                if (file.type === 'application/pdf') {
                  const reader = new FileReader();
                  reader.onload = async (event) => {
                    const arrayBuffer = event.target?.result as ArrayBuffer;
                    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                    let fullText = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                      const page = await pdf.getPage(i);
                      const textContent = await page.getTextContent();
                      fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
                    }
                    const newDoc: Document = {
                      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                      name: file.name,
                      content: fullText,
                      type: file.type
                    };
                    setDocuments(prev => [...prev, newDoc]);
                  };
                  reader.readAsArrayBuffer(file);
                } else {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const content = event.target?.result as string;
                    const newDoc: Document = {
                      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                      name: file.name,
                      content,
                      type: file.type || 'text/plain'
                    };
                    setDocuments(prev => [...prev, newDoc]);
                  };
                  reader.readAsText(file);
                }
              });
            }}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
          >
            Choose Files
          </label>
        </div>
      </div>

      {/* Text Input */}
      <div className="mb-10 space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Or paste content directly:</h3>
        <input
          type="text"
          placeholder="Document name (optional)"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="w-full px-6 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-dark-input-bg dark:border-dark-input-border dark:text-dark-text dark:placeholder-dark-text-secondary text-lg"
        />
        <textarea
          placeholder={`Paste your content here... LaTeX equations are fully supported:

Basic: $E = mc^2$ or \\( E = mc^2 \\)
Advanced: \\[ \\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2} \\]
Blackboard: \\mathbb{R}, \\mathbb{N}, \\mathbb{Z}, \\mathbb{C}
Matrices: \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}
Sets: \\{ x \\in \\mathbb{R} \\mid x > 0 \\}, A \\cap B, A \\cup B
Accents: \\overline{x}, \\underline{y}, \\hat{a}, \\tilde{b}, \\vec{v}
Functions: \\det(A), \\dim(V), \\ker(T), \\arg(z)
Greek: \\alpha, \\beta, \\gamma, \\Delta, \\pi, \\sigma, \\theta
Operators: \\sum, \\prod, \\int, \\partial, \\nabla, \\emptyset
Arrows: \\to, \\rightarrow, \\leftarrow, \\Rightarrow, \\Leftrightarrow
Logic: \\forall, \\exists, \\neg, \\land, \\lor, \\implies, \\iff`}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          rows={12}
          className="w-full px-6 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none dark:bg-dark-input-bg dark:border-dark-input-border dark:text-dark-text dark:placeholder-dark-text-secondary text-lg leading-relaxed font-mono"
        />
        <button
          onClick={addTextDocument}
          disabled={!textInput.trim()}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-dark-button-inactive-bg disabled:text-dark-button-inactive-text disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Document</span>
        </button>
      </div>

      {/* Document List */}
      {documents.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-text mb-6">
            Loaded Documents ({documents.length})
          </h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {documents.map(doc => (
              <div key={doc.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50 dark:border-dark-input-border dark:bg-dark-surface">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <File className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span className="font-medium text-gray-900 dark:text-dark-text truncate">{doc.name}</span>
                  </div>
                  <button
                    onClick={() => removeDocument(doc.id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary mb-2">
                  {doc.content.length > 100 
                    ? `${doc.content.substring(0, 100)}...`
                    : doc.content
                  }
                </p>
                <div className="text-xs text-gray-500 dark:text-dark-text-secondary">
                  {doc.content.length} characters
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {documents.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-dark-text-secondary">
          <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No documents loaded yet</p>
          <p className="text-sm">Upload files or paste content to get started</p>
        </div>
      )}
    </div>
  );
};

export default ContentInput;
