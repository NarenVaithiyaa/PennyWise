import React from 'react';
import { Download, X } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

const InstallPrompt: React.FC = () => {
  const { isInstallable, installApp } = usePWA();
  const [showPrompt, setShowPrompt] = React.useState(false);

  React.useEffect(() => {
    if (isInstallable) {
      // Show prompt after 30 seconds or on user interaction
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [isInstallable]);

  if (!isInstallable || !showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Install PennyWise</h3>
          </div>
          <button
            onClick={() => setShowPrompt(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Install PennyWise on your device for quick access to your finances, even offline!
        </p>
        
        <div className="flex space-x-3">
          <button
            onClick={installApp}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
          >
            Install App
          </button>
          <button
            onClick={() => setShowPrompt(false)}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200 text-sm"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;