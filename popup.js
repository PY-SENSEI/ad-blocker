// Get DOM elements
const enableToggle = document.getElementById('enableToggle');
const blockedCountElement = document.getElementById('blockedCount');
const categoryList = document.getElementById('categoryList');
const recentList = document.getElementById('recentList');
const exportBtn = document.getElementById('exportBtn');
const clearBtn = document.getElementById('clearBtn');

// Load initial state
chrome.storage.local.get(['enabled', 'blockedTrackers', 'settings'], (data) => {
  enableToggle.checked = data.enabled;
  updateStats(data.blockedTrackers || []);
  updateSettings(data.settings);
});

// Toggle blocking
enableToggle.addEventListener('change', (e) => {
  chrome.storage.local.set({ enabled: e.target.checked });
  updateBadgeStatus(e.target.checked);
});

// Update stats display
function updateStats(trackers) {
  // Update total count
  blockedCountElement.textContent = trackers.length;

  // Update categories
  const categories = {};
  trackers.forEach(tracker => {
    categories[tracker.category] = (categories[tracker.category] || 0) + 1;
  });

  categoryList.innerHTML = Object.entries(categories)
    .map(([category, count]) => `
      <li>
        <strong>${category.charAt(0).toUpperCase() + category.slice(1)}:</strong>
        ${count} trackers
      </li>
    `).join('');

  // Update recent blocks
  const recent = trackers.slice(-5).reverse();
  recentList.innerHTML = recent
    .map(tracker => `
      <li>
        <strong>${tracker.tracker}</strong>
        <br>
        <small>${tracker.company} - ${new Date(tracker.timestamp).toLocaleString()}</small>
      </li>
    `).join('');
}

// Export data
exportBtn.addEventListener('click', () => {
  chrome.storage.local.get(['blockedTrackers'], (data) => {
    const trackers = data.blockedTrackers || [];
    const report = {
      generatedAt: new Date().toISOString(),
      totalBlocked: trackers.length,
      trackers: trackers
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tracker-report-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });
});

// Clear data
clearBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all tracking data?')) {
    chrome.storage.local.set({ blockedTrackers: [] }, () => {
      updateStats([]);
      chrome.action.setBadgeText({ text: '0' });
    });
  }
});

// Listen for updates
chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockedTrackers) {
    updateStats(changes.blockedTrackers.newValue || []);
  }
});