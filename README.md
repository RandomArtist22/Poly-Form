# Polyform

AI-Powered Content Processing Suite

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC.svg)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-black.svg)](https://expressjs.com/)

Polyform is a comprehensive AI-powered content processing application that transforms how you work with documents. Upload content, translate it to multiple languages, generate intelligent summaries, create interactive quizzes, and chat with your documents using advanced AI.

## ✨ Features

### 📝 Content Input
- **File Upload**: Support for text files (.txt, .md), PDFs, and other document formats
- **Direct Input**: Paste content directly with LaTeX support
- **Drag & Drop**: Intuitive file upload interface
- **Multi-format Support**: Handles various text encodings and formats

### 🌍 Translation
- **Multi-language Support**: Translate to 14+ languages including Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Malayalam, Punjabi, Odia, Spanish, French, German, Chinese, and Arabic
- **LaTeX Preservation**: Maintains mathematical formatting during translation
- **Real-time Processing**: Fast translation using Google Gemini AI

### 📋 Summarization
- **Customizable Length**: Short (2-3 points), Medium (5-7 concepts), or Detailed summaries
- **Intelligent Analysis**: AI-powered content understanding
- **LaTeX Support**: Preserves mathematical expressions in summaries

### 🎯 Quiz Generation
- **Adaptive Difficulty**: Easy, Medium, and Hard difficulty levels
- **Customizable Count**: Generate 3-20 questions per quiz
- **Interactive Interface**: Real-time answer feedback and scoring
- **LaTeX Integration**: Mathematical expressions in questions and answers

### 💬 Chat with Documents
- **Contextual Conversations**: AI understands your document content
- **LaTeX Support**: Mathematical discussions with proper rendering
- **Real-time Responses**: Instant answers to your questions
- **Document Memory**: Maintains context throughout the conversation

### 🎨LaTeX Support
- **Symbols**: Support for mathematical symbols, operators, and notation
- **Matrix Rendering**: Proper display of matrices and arrays
- **Blackboard Bold**: Mathematical sets (ℝ, ℕ, ℤ, ℚ, ℂ)
- **Accents & Decorations**: Overline, underline, hats, tildes, vectors
- **Advanced Operators**: Integrals, sums, products, limits, and more

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Google Gemini API Key** (for AI features)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd polyform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

   Create a `backend/.env` file:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   This will start both the frontend (port 5173) and backend (port 3001) servers concurrently.

### Alternative: Manual Setup

If you prefer to run frontend and backend separately:

1. **Start the backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Start the frontend (in a new terminal):**
   ```bash
   npm run build  # or npm run dev for development
   ```

## 📖 Usage

### 1. Content Input
- **Upload Files**: Drag and drop or click to select files
- **Direct Input**: Paste content in the text area
- **LaTeX Support**: Use mathematical expressions like `$E = mc^2$` or `\[ \int_{0}^{\infty} e^{-x^2} dx \]`

### 2. Translation
- Select a document from the dropdown
- Choose target language from the language grid
- Click "Translate Content" to process
- View results in the "Results" tab

### 3. Summarization
- Choose document and summary length
- Select from Short, Medium, or Detailed options
- Generate and view summary with preserved LaTeX formatting

### 4. Quiz Generation
- Select document and quiz parameters
- Choose question count (3-20) and difficulty level
- Take the interactive quiz with real-time feedback
- View final score and explanations

### 5. Chat with Documents
- Select a document to chat about
- Ask questions in natural language
- Get AI-powered responses based on document content
- Continue conversation with full context

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Vite** - Fast build tool and development server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Google Gemini AI** - Advanced AI for content processing
- **CORS** - Cross-origin resource sharing
- **PDF.js** - PDF parsing and text extraction

### Key Dependencies
- `@google/generative-ai` - Google Gemini AI integration
- `pdfjs-dist` - PDF document processing
- `lucide-react` - Icon components
- `tailwindcss` - CSS framework
- `concurrently` - Run multiple commands simultaneously



---

**Polyform** - Transform your content with the power of AI! 🚀
