import React from 'react';

interface FormattedMessageProps {
  text: string;
  isUser: boolean;
}

// Helper component to format message text with proper line breaks and bullets
export const FormattedMessage: React.FC<FormattedMessageProps> = ({ text, isUser }) => {
  // Split by lines and process each line
  const lines = text.split('\n').filter(line => line.trim());
  
  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        const trimmedLine = line.trim();
        
        // Check if line is a bullet point
        if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
          return (
            <div key={idx} className="flex gap-2 items-start">
              <span className={`inline-block w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${isUser ? 'bg-white/70' : 'bg-indigo-600'}`}></span>
              <span className="flex-1">{trimmedLine.substring(2).trim()}</span>
            </div>
          );
        }
        
        // Check if line is a numbered list
        if (/^\d+\./.test(trimmedLine)) {
          const match = trimmedLine.match(/^(\d+)\.\s*(.*)$/);
          if (match) {
            return (
              <div key={idx} className="flex gap-2 items-start">
                <span className={`inline-block font-bold flex-shrink-0 ${isUser ? 'text-white/90' : 'text-indigo-600'}`}>{match[1]}.</span>
                <span className="flex-1">{match[2]}</span>
              </div>
            );
          }
        }
        
        // Check if line is a heading (starts with ###, ##, or #)
        if (trimmedLine.startsWith('### ')) {
          return <h4 key={idx} className="font-bold text-base mt-3 mb-1">{trimmedLine.substring(4)}</h4>;
        }
        if (trimmedLine.startsWith('## ')) {
          return <h3 key={idx} className="font-bold text-lg mt-4 mb-2">{trimmedLine.substring(3)}</h3>;
        }
        if (trimmedLine.startsWith('# ')) {
          return <h2 key={idx} className="font-bold text-xl mt-4 mb-2">{trimmedLine.substring(2)}</h2>;
        }
        
        // Check if line is bold (**text**)
        const boldPattern = /\*\*(.*?)\*\*/g;
        if (boldPattern.test(trimmedLine)) {
          const parts = trimmedLine.split(boldPattern);
          return (
            <p key={idx} className="leading-relaxed">
              {parts.map((part, i) => 
                i % 2 === 1 ? <strong key={i} className="font-bold">{part}</strong> : part
              )}
            </p>
          );
        }
        
        // Regular paragraph
        if (trimmedLine) {
          return <p key={idx} className="leading-relaxed">{trimmedLine}</p>;
        }
        
        return null;
      })}
    </div>
  );
};
