'use client';
import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const lastDismissed = localStorage.getItem('pwa-dismissed-time');
      if (!lastDismissed || (Date.now() - parseInt(lastDismissed, 10)) >= 2 * 60 * 1000) {
        setShow(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShow(false);
        setDeferredPrompt(null);
      }
    }
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('pwa-dismissed-time', Date.now().toString());
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 animate-slide-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Install ANP MART</p>
              <p className="text-sm text-gray-500">Fast, native app experience</p>
            </div>
          </div>
          <button onClick={handleDismiss} className="p-2 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleDismiss}
            className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm"
          >
            Not Now
          </button>
          <button
            onClick={handleInstall}
            className="flex-1 py-2 px-4 bg-emerald-500 text-white rounded-xl font-semibold text-sm"
          >
            <Download className="w-4 h-4 mr-1 inline" /> Install
          </button>
        </div>
      </div>
    </div>
  );
}