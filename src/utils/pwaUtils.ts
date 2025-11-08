// PWA utility functions

export const registerServiceWorker = async (): Promise<void> => {
  if (import.meta.env.DEV) {
    console.info('Service worker registration skipped in development mode.');
    return;
  }

  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered: ', registration);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, show update notification
              showUpdateNotification();
            }
          });
        }
      });
    } catch (error) {
      console.log('SW registration failed: ', error);
    }
  }
};

export const showUpdateNotification = (): void => {
  // Create a custom notification for app updates
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50';
  notification.innerHTML = `
    <div class="flex items-center space-x-3">
      <div>
        <p class="font-medium">Update Available</p>
        <p class="text-sm opacity-90">A new version of PennyWise is ready!</p>
      </div>
      <button onclick="window.location.reload()" class="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium">
        Update
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 10000);
};

export const checkOnlineStatus = (): boolean => {
  return navigator.onLine;
};

export const addToHomeScreen = (): void => {
  // For iOS Safari
  if (isIOS() && !isInStandaloneMode()) {
    showIOSInstallInstructions();
  }
};

export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isInStandaloneMode = (): boolean => {
  return (window.navigator as any).standalone === true || 
         window.matchMedia('(display-mode: standalone)').matches;
};

export const showIOSInstallInstructions = (): void => {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
  modal.innerHTML = `
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
      <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Install PennyWise</h3>
      <div class="space-y-3 text-sm text-gray-600 dark:text-gray-300">
        <p>To install this app on your iPhone:</p>
        <ol class="list-decimal list-inside space-y-2">
          <li>Tap the Share button in Safari</li>
          <li>Scroll down and tap "Add to Home Screen"</li>
          <li>Tap "Add" to confirm</li>
        </ol>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" 
              class="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg">
        Got it
      </button>
    </div>
  `;
  
  document.body.appendChild(modal);
};

// Offline data management
export const saveOfflineData = (key: string, data: any): void => {
  try {
    localStorage.setItem(`offline_${key}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Failed to save offline data:', error);
  }
};

export const getOfflineData = (key: string): any => {
  try {
    const stored = localStorage.getItem(`offline_${key}`);
    if (stored) {
      const { data, timestamp } = JSON.parse(stored);
      // Return data if it's less than 24 hours old
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
        return data;
      }
    }
  } catch (error) {
    console.error('Failed to get offline data:', error);
  }
  return null;
};