import React, { useState } from 'react';
import { MessageCircle, Send, Bot, User, FileText } from 'lucide-react';
import LaTeXRenderer from './LaTeXRenderer';

interface Document {
  id: string;
  name: string;
  content: string;
  type: string;
}

interface ChatPanelProps {
  documents: Document[];
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ documents }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);

  const simulateBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock responses based on common questions
    const mockResponses = [
      `Based on the document content, I can provide you with detailed information. The key concepts include fundamental principles and practical applications.

**Key Mathematical Relations:**
- Energy-mass equivalence: $E = mc^2$
- Quadratic solutions: $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$

Would you like me to elaborate on any specific aspect?`,
      
      `That's an excellent question! The document discusses several important points:

1. **Theoretical Framework**: The foundational concepts
2. **Methodology**: Systematic approaches used
3. **Applications**: Real-world implementations

**Mathematical Example:**
For integration by parts: $\\int u dv = uv - \\int v du$

Is there a particular section you'd like me to focus on?`,
      
      `I understand your inquiry. The content covers multiple dimensions of this topic:

**Core Concepts:**
- Primary definitions and terminology
- Relationships between different elements
- Practical implications and use cases

**Formula Reference:**
Newton's second law: $F = ma$

Would you like me to provide more specific examples or explanations?`
    ];

    return mockResponses[Math.floor(Math.random() * mockResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedDoc) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const botResponse = await simulateBotResponse(inputMessage);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to get bot response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (documents.length === 0) {
    return (
      <div className="p-8 text-center">
        <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Available</h3>
        <p className="text-gray-500">Upload documents in the Content Input tab to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="h-[600px] flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Chat with Documents</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Document to Chat About
          </label>
          <select
            value={selectedDoc}
            onChange={(e) => setSelectedDoc(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a document...</option>
            {documents.map(doc => (
              <option key={doc.id} value={doc.id}>
                {doc.name} ({doc.content.length} chars)
              </option>
            ))}
          </select>
        </div>
      </div>

      {!selectedDoc ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Select a document to start chatting</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Start a conversation about your document!</p>
                <p className="text-sm">Ask questions, request summaries, or explore concepts.</p>
              </div>
            )}
            
            {messages.map(message => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-3xl flex space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 ${message.type === 'user' ? 'bg-blue-600' : 'bg-gray-600'} rounded-full p-2`}>
                    {message.type === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className={`rounded-lg px-4 py-3 ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <LaTeXRenderer content={message.content} />
                    <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-3xl flex space-x-3">
                  <div className="flex-shrink-0 bg-gray-600 rounded-full p-2">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 p-6">
            <div className="flex space-x-4">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about the document..."
                rows={2}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatPanel;