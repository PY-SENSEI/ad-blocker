import { trackerPatterns } from './src/utils/trackerPatterns';
import { StorageManager } from './src/utils/storage';

// Counter for blocked trackers
let blockedCount = 0;
let blockedTrackers = [];

// Initialize storage with default settings
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    enabled: true,
    whitelist: [],
    blockedTrackers: [],
    settings: {
      blockAnalytics: true,
      blockAdvertising: true,
      blockSocial: true,
      clearCookies: true,
      sendDNT: true
    }
  });
});

// Listen for web requests
chrome.webRequest.onBeforeRequest.addListener(
  async (details) => {
    // Check if blocking is enabled
    const data = await StorageManager.get(['enabled', 'whitelist', 'settings']);
    if (!data.enabled) return { cancel: false };
    
    // Check if domain is whitelisted
    const url = new URL(details.url);
    if (data.whitelist.includes(url.hostname)) return { cancel: false };

    // Check if URL matches any tracker patterns
    for (const category in trackerPatterns) {
      if (!data.settings[`block${category.charAt(0).toUpperCase() + category.slice(1)}`]) {
        continue;
      }

      for (const tracker of trackerPatterns[category]) {
        if (details.url.includes(tracker.pattern)) {
          blockedCount++;
          blockedTrackers.push({
            url: details.url,
            tracker: tracker.name,
            category,
            company: tracker.company,
            timestamp: new Date().toISOString()
          });
          
          // Update badge
          chrome.action.setBadgeText({ text: blockedCount.toString() });
          chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
          
          // Store blocked tracker
          await StorageManager.set({ blockedTrackers });
          
          return { cancel: true };
        }
      }
    }
    return { cancel: false };
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);