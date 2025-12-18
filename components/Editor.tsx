
import React, { useState, useEffect } from 'react';

interface EditorProps {
  value: string;
  onChange: (val: string) => void;
  language?: string;
}

const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    const lines = value.split('\n').length;
    setLineCount(lines > 0 ? lines : 1);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      onChange(newValue);
      
      setTimeout(() => {
        const target = e.target as HTMLTextAreaElement;
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className="flex w-full h-[500px] border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-slate-900/5">
      {/* Line Numbers */}
      <div className="w-12 bg-slate-50 text-slate-400 text-right pr-3 pt-4 select-none mono text-sm leading-6 border-r border-slate-100">
        {Array.from({ length: Math.max(lineCount, 20) }).map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      
      {/* Textarea */}
      <textarea
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        className="flex-1 bg-transparent text-slate-700 p-4 mono text-sm leading-6 outline-none resize-none caret-blue-600 overflow-y-auto"
        placeholder="// 在这里编写你的代码..."
      />
    </div>
  );
};

export default Editor;
