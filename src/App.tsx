/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Download, Loader2, RefreshCw, Grid, Play, Sun, Moon } from 'lucide-react';
import { createSquareCollage } from './utils/collage';
import { useTranslation } from './i18n';

export default function App() {
  const { lang, setLang, t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Generate thumbnails for preview
  useEffect(() => {
    const urls = files.map(file => URL.createObjectURL(file));
    setThumbnails(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [files]);

  const handleFilesAdded = (newFiles: FileList | File[]) => {
    const imageFiles = Array.from(newFiles).filter(file => file.type.startsWith('image/'));
    if (imageFiles.length > 0) {
      setFiles(prev => [...prev, ...imageFiles]);
      setResultImage(null); // Reset result when new files are added
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFilesAdded(e.dataTransfer.files);
  }, []);

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setResultImage(null);
  };

  const handleGenerate = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      // Allow UI to update loading state
      await new Promise(r => setTimeout(r, 50)); 
      const dataUrl = await createSquareCollage(files);
      setResultImage(dataUrl);
    } catch (error) {
      console.error('Failed to generate collage', error);
      alert(t('errorGenerating'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setResultImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadImage = () => {
    if (!resultImage) return;
    const a = document.createElement('a');
    a.href = resultImage;
    a.download = `collage-${new Date().getTime()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden font-sans transition-colors duration-200">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shrink-0 transition-colors duration-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center">
            <Grid className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            {t('appName')} <span className="px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-[10px] uppercase font-black tracking-widest relative -top-0.5">{t('pro')}</span>
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {t('imagesSelected', { count: files.length, plural: files.length !== 1 ? 's' : '' })}
          </span>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700 transition-colors duration-200">
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${
                lang === 'en'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('fr')}
              className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${
                lang === 'fr'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              FR
            </button>
          </div>
          
          {/* Theme Switcher Toggle */}
          <button
            onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200 transition-all cursor-pointer"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          <button 
            onClick={downloadImage}
            disabled={!resultImage}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {t('exportResult')}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Control Panel */}
        <aside className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 transition-colors duration-200">
          <div className="p-6 space-y-8 flex-1 overflow-y-auto">
            {/* Upload Section */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {t('sourceImages', { count: files.length })}
                </label>
                {files.length > 0 && (
                  <button 
                    onClick={handleReset}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                  >
                    {t('clearAll')}
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center p-2 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 rounded-md group relative transition-colors duration-200">
                    <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded shrink-0 mr-3 overflow-hidden">
                      <img src={thumbnails[i]} alt="thumb" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{file.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                    <button 
                      onClick={() => handleRemoveFile(i)}
                      className="absolute right-2 p-1 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="w-full mt-4 py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 dark:text-slate-500 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-950/40 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                   <Upload className="w-3.5 h-3.5" />
                </div>
                {t('addMorePhotos')}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                multiple 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files) handleFilesAdded(e.target.files);
                  e.target.value = '';
                }}
              />
            </section>

            {/* Grid Settings */}
            <section>
              <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">{t('layoutConfig')}</label>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-2 text-slate-600 dark:text-slate-400">
                    <span>{t('gridShape')}</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{t('perfectSquare')}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="py-2 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded pointer-events-none">
                      {t('squareShape')}
                    </button>
                    <button className="py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 text-xs font-semibold rounded cursor-not-allowed" title={t('linearTooltip')}>
                      {t('linearShape')}
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={handleGenerate}
                  disabled={isProcessing || files.length === 0}
                  className="w-full py-2.5 mt-4 bg-indigo-600 text-white rounded text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> {t('processing')}</>
                  ) : (
                    <><Play className="w-4 h-4" /> {t('generateGrid')}</>
                  )}
                </button>
              </div>
            </section>
          </div>
          
          <div className="p-6 bg-slate-50 dark:bg-slate-950/30 border-t border-slate-200 dark:border-slate-800/80 shrink-0 transition-colors duration-200">
            <div className={`flex items-center text-xs font-semibold mb-2 ${resultImage ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${resultImage ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-700'}`}></span>
              {resultImage ? t('processingComplete') : t('waitingForInput')}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              {resultImage ? t('resDynamic') : t('resPending')}
            </div>
          </div>
        </aside>

        {/* Preview Canvas Area */}
        <section className="flex-1 flex flex-col bg-slate-100/50 dark:bg-slate-950/20 relative transition-colors duration-200">
          <div className="flex-1 flex items-center justify-center p-8 lg:p-16 overflow-hidden">
            {/* Resulting Concatenated Image Mockup (Square 2x2) */}
            {!resultImage ? (
              <div className="flex flex-col items-center text-center opacity-40 dark:opacity-30">
                <Grid className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-4" strokeWidth={1} />
                <p className="text-slate-500 dark:text-slate-400 font-medium">{t('selectImages')}</p>
              </div>
            ) : (
              <div className="relative bg-white dark:bg-slate-900 shadow-2xl p-4 border border-slate-200 dark:border-slate-800 max-h-full max-w-full flex items-center justify-center shrink-0 transition-colors duration-200">
                <img 
                   src={resultImage} 
                   alt={t('generatedCollageAlt')} 
                   className="max-h-[70vh] max-w-full object-contain bg-slate-100 dark:bg-slate-950"
                />
              </div>
            )}
          </div>
          
          {/* Viewport Controls */}
          {resultImage && (
            <div className="h-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center space-x-6 shrink-0 z-10 bottom-0 left-0 right-0 w-full absolute transition-colors duration-200">
              <button 
                onClick={handleGenerate}
                disabled={isProcessing}
                className="text-xs text-slate-500 dark:text-slate-400 flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                {t('regenerate')}
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Status Bar */}
      <footer className="h-8 bg-slate-800 dark:bg-slate-950 text-white dark:text-slate-300 flex items-center justify-between px-6 text-[10px] shrink-0 transition-colors duration-200">
        <div className="flex space-x-4">
          <span>{isProcessing ? t('statusProcessing') : resultImage ? t('statusReady') : t('statusIdle')}</span>
          <span className="opacity-50">|</span>
          <span>{t('imagesProcessed', { count: files.length })}</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">{t('autoStitch')}</span>
          <div className="w-3 h-3 bg-indigo-400 rounded-full animate-pulse"></div>
        </div>
      </footer>
    </div>
  );
}

