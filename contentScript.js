import { applyFingerprintingProtection } from './src/utils/fingerprinting';

// Apply anti-fingerprinting measures
applyFingerprintingProtection();

// Set DNT header
navigator.doNotTrack = "1";

// Clear third-party cookies
function clearThirdPartyCookies() {
  const currentDomain = window.location.hostname;
  document.cookie.split(';').forEach(cookie => {
    const [name] = cookie.split('=').map(c => c.trim());
    if (!cookie.includes(currentDomain)) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
    }
  });
}

// Clear cookies periodically
clearThirdPartyCookies();
setInterval(clearThirdPartyCookies, 300000); // Every 5 minutes

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getPageTrackers') {
    // Scan page for potential trackers
    const scripts = Array.from(document.scripts);
    const trackers = scripts
      .map(script => script.src)
      .filter(src => src.includes('analytics') || src.includes('tracking') || src.includes('pixel'));
    
    sendResponse({ trackers });
  }
});