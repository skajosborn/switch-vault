'use client';

import { useState } from 'react';
import { 
  PenTool, 
  Palette, 
  Download, 
  Eye, 
  EyeOff,
  Type,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo
} from 'lucide-react';

interface StationaryTheme {
  id: string;
  name: string;
  preview: string;
  background: string;
  textColor: string;
  fontFamily: string;
  paperTexture?: string;
  borderStyle?: string;
}

const STATIONARY_THEMES: StationaryTheme[] = [
  {
    id: 'classic',
    name: 'Classic White',
    preview: '📄',
    background: 'bg-white',
    textColor: 'text-gray-900',
    fontFamily: 'font-serif',
    borderStyle: 'border-2 border-gray-300'
  },
  {
    id: 'parchment',
    name: 'Antique Parchment',
    preview: '📜',
    background: 'bg-amber-50',
    textColor: 'text-amber-900',
    fontFamily: 'font-serif',
    paperTexture: 'bg-[url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="parchment" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"%3E%3Ccircle cx="10" cy="10" r="1" fill="%23d97706" opacity="0.1"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100" height="100" fill="url(%23parchment)"/%3E%3C/svg%3E")]'
  },
  {
    id: 'elegant',
    name: 'Elegant Cream',
    preview: '💌',
    background: 'bg-rose-50',
    textColor: 'text-rose-900',
    fontFamily: 'font-serif',
    borderStyle: 'border-2 border-rose-200'
  },
  {
    id: 'business',
    name: 'Professional Blue',
    preview: '📋',
    background: 'bg-blue-50',
    textColor: 'text-blue-900',
    fontFamily: 'font-sans',
    borderStyle: 'border-2 border-blue-200'
  },
  {
    id: 'vintage',
    name: 'Vintage Sepia',
    preview: '📖',
    background: 'bg-stone-100',
    textColor: 'text-stone-800',
    fontFamily: 'font-serif',
    paperTexture: 'bg-[url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="vintage" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse"%3E%3Cpath d="M0 0h30v30H0z" fill="%23a8a29e" opacity="0.05"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100" height="100" fill="url(%23vintage)"/%3E%3C/svg%3E")]'
  },
  {
    id: 'minimal',
    name: 'Minimal Gray',
    preview: '📝',
    background: 'bg-gray-50',
    textColor: 'text-gray-800',
    fontFamily: 'font-sans',
    borderStyle: 'border border-gray-200'
  }
];

interface LetterEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export default function LetterEditor({ value, onChange, className = '', placeholder = 'Write your message...' }: LetterEditorProps) {
  const [selectedTheme, setSelectedTheme] = useState<StationaryTheme>(STATIONARY_THEMES[0]);
  const [showPreview, setShowPreview] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');

  const handleThemeChange = (theme: StationaryTheme) => {
    setSelectedTheme(theme);
  };

  const handleFontSizeChange = (size: number) => {
    setFontSize(Math.max(12, Math.min(24, size)));
  };

  const handleLineHeightChange = (height: number) => {
    setLineHeight(Math.max(1.2, Math.min(2.5, height)));
  };

  const getTextAlignClass = (align: string) => {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  const getFontFamilyClass = (font: string) => {
    switch (font) {
      case 'serif': return 'font-serif';
      case 'sans': return 'font-sans';
      case 'mono': return 'font-mono';
      default: return 'font-serif';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PenTool className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-semibold text-white">Letter Editor</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Stationary Theme Selector */}
      <div>
        <h4 className="text-lg font-medium text-slate-300 mb-3">Choose Your Stationary</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {STATIONARY_THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeChange(theme)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedTheme.id === theme.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600 hover:border-slate-500 bg-slate-800/50'
              }`}
            >
              <div className="text-2xl mb-2">{theme.preview}</div>
              <div className="text-xs text-slate-300 text-center">{theme.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Typography Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Font Size</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleFontSizeChange(fontSize - 1)}
              className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded"
            >
              <Type className="w-4 h-4" />
            </button>
            <span className="text-white min-w-[3rem] text-center">{fontSize}px</span>
            <button
              onClick={() => handleFontSizeChange(fontSize + 1)}
              className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded"
            >
              <Type className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Line Height</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLineHeightChange(lineHeight - 0.1)}
              className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <span className="text-white min-w-[3rem] text-center">{lineHeight.toFixed(1)}</span>
            <button
              onClick={() => handleLineHeightChange(lineHeight + 0.1)}
              className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Text Alignment</label>
          <div className="flex gap-1">
            {(['left', 'center', 'right'] as const).map((align) => (
              <button
                key={align}
                onClick={() => setTextAlign(align)}
                className={`p-2 rounded ${
                  textAlign === align
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
              >
                {align === 'left' && <AlignLeft className="w-4 h-4" />}
                {align === 'center' && <AlignCenter className="w-4 h-4" />}
                {align === 'right' && <AlignRight className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Letter Editor/Preview */}
      <div className="relative">
        {showPreview ? (
          /* Preview Mode */
          <div className="min-h-[500px] p-8 rounded-lg shadow-lg">
            <div
              className={`w-full h-full min-h-[500px] p-8 rounded-lg shadow-lg ${
                selectedTheme.background
              } ${selectedTheme.paperTexture || ''} ${selectedTheme.borderStyle || ''}`}
              style={{
                fontFamily: selectedTheme.fontFamily === 'font-serif' ? 'Georgia, serif' : 
                           selectedTheme.fontFamily === 'font-mono' ? 'Courier New, monospace' : 
                           'Arial, sans-serif',
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight,
                textAlign: textAlign
              }}
            >
              <div className={`${selectedTheme.textColor} whitespace-pre-wrap`}>
                {value || 'Your letter will appear here...'}
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <div className="min-h-[500px] p-8 rounded-lg shadow-lg">
            <div
              className={`w-full h-full min-h-[500px] p-8 rounded-lg shadow-lg ${
                selectedTheme.background
              } ${selectedTheme.paperTexture || ''} ${selectedTheme.borderStyle || ''}`}
              style={{
                fontFamily: selectedTheme.fontFamily === 'font-serif' ? 'Georgia, serif' : 
                           selectedTheme.fontFamily === 'font-mono' ? 'Courier New, monospace' : 
                           'Arial, sans-serif',
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight,
                textAlign: textAlign
              }}
            >
              <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full h-full min-h-[400px] resize-none bg-transparent border-none outline-none ${
                  selectedTheme.textColor
                } placeholder-gray-400`}
                style={{
                  fontFamily: selectedTheme.fontFamily === 'font-serif' ? 'Georgia, serif' : 
                             selectedTheme.fontFamily === 'font-mono' ? 'Courier New, monospace' : 
                             'Arial, sans-serif',
                  fontSize: `${fontSize}px`,
                  lineHeight: lineHeight,
                  textAlign: textAlign
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Letter Templates */}
      <div>
        <h4 className="text-lg font-medium text-slate-300 mb-3">Letter Templates</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => onChange(`Dear loved ones,

I want you to know how much you mean to me. Life is precious and unpredictable, and I want to ensure that my wishes are carried out if I'm unable to communicate them directly.

Please know that I love you all deeply, and I've made these arrangements with your best interests in mind.

With love and gratitude,
[Your Name]`)}
            className="p-3 text-left bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 rounded-lg transition-colors"
          >
            <div className="font-medium text-white mb-1">Personal Letter</div>
            <div className="text-sm text-slate-400">A heartfelt message to loved ones</div>
          </button>

          <button
            onClick={() => onChange(`To Whom It May Concern:

This letter serves as my final instructions regarding my digital assets and online presence. I have made arrangements for the secure transfer and management of these assets according to my wishes.

Please ensure that these instructions are followed precisely as outlined in my digital estate plan.

Sincerely,
[Your Name]`)}
            className="p-3 text-left bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 rounded-lg transition-colors"
          >
            <div className="font-medium text-white mb-1">Legal Instructions</div>
            <div className="text-sm text-slate-400">Formal instructions for asset management</div>
          </button>
        </div>
      </div>
    </div>
  );
}

