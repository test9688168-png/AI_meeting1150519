/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clipboard, 
  Check, 
  FileText, 
  Send, 
  Loader2, 
  Languages, 
  History,
  Sparkles,
  Copy
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function App() {
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!transcript.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '生成失敗，請稍後再試');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <FileText className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight">AI 會議記錄助理</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-500" /> Professional Assistant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1.5">
              <History className="w-4 h-4" /> 歷史紀錄
            </button>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <Languages className="w-4 h-4" />繁體中文 / EN
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Section */}
          <section className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> 會議逐字稿或筆記
              </h2>
              <p className="text-sm text-gray-500">
                請貼上您的會議逐字稿，AI 將為您整理總結、列出待辦事項並翻譯成英文。
              </p>
            </div>

            <div className="relative group">
              <textarea
                id="transcript-input"
                className="w-full h-80 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all resize-none outline-none text-sm leading-relaxed"
                placeholder="在此貼上會議逐字稿內容..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
              />
              <div className="absolute bottom-4 right-4 text-[10px] text-gray-400 font-mono">
                {transcript.length} 字
              </div>
            </div>

            <button
              id="generate-button"
              onClick={handleGenerate}
              disabled={isLoading || !transcript.trim()}
              className={`w-full py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg active:scale-[0.98]
                ${isLoading || !transcript.trim() 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 hover:shadow-blue-300'}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  正在整理中...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  生成總結與翻譯
                </>
              )}
            </button>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-start gap-2"
              >
                <div className="mt-0.5 min-w-4 w-4 h-4 rounded-full bg-red-100 flex items-center justify-center font-bold text-[10px] text-red-600">!</div>
                {error}
              </motion.div>
            )}
          </section>

          {/* Output Section */}
          <section className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> AI 整理結果
              </h2>
              {result && (
                <button
                  id="copy-button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      已複製
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      一鍵複製
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="min-h-[464px] bg-white border border-gray-200 rounded-3xl shadow-sm p-8 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {!result && !isLoading ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20"
                  >
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                      <Clipboard className="w-8 h-8 text-gray-300" />
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium italic">尚未生成結果</p>
                      <p className="text-xs text-gray-300 mt-1 italic">點擊左側按鈕開始處理</p>
                    </div>
                  </motion.div>
                ) : isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center space-y-8 py-20"
                  >
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-blue-50 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                    <div className="space-y-4 w-full px-12">
                      <div className="h-4 bg-gray-50 rounded-full animate-pulse" />
                      <div className="h-4 bg-gray-50 rounded-full animate-pulse w-5/6" />
                      <div className="h-4 bg-gray-50 rounded-full animate-pulse w-4/6" />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="prose prose-sm max-w-none prose-blue"
                  >
                    <div className="markdown-body">
                      <ReactMarkdown>{result}</ReactMarkdown>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Design accents */}
            <div className="flex items-center justify-center gap-8 py-4 opacity-20 grayscale pointer-events-none select-none">
              <span className="text-[10px] font-mono tracking-widest uppercase">Structured Data</span>
              <div className="w-1 h-1 rounded-full bg-gray-400" />
              <span className="text-[10px] font-mono tracking-widest uppercase">Smart Translation</span>
              <div className="w-1 h-1 rounded-full bg-gray-400" />
              <span className="text-[10px] font-mono tracking-widest uppercase">Markdown Ready</span>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-center gap-4 text-[10px] font-mono text-gray-400 uppercase tracking-widest">
          <span>&copy; 2024 AI Meeting Assistant</span>
          <span>•</span>
          <span>Powered by Gemini 3</span>
        </div>
      </footer>

    </div>
  );
}
