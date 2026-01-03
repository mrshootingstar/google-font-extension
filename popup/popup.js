/**
 * Popup Script
 * Handles toggle UI and communicates with content script
 */
(() => {
  const toggleCheckbox = document.getElementById('toggle');
  const statusText = document.getElementById('status');

  /**
   * Updates the UI to reflect the enabled state
   * @param {boolean} isEnabled
   */
  function updateUI(isEnabled) {
    toggleCheckbox.checked = isEnabled;
    statusText.textContent = isEnabled ? 'Active' : 'Inactive';
    statusText.className = `status ${isEnabled ? 'active' : 'inactive'}`;
  }

  /**
   * Loads the saved state from storage
   */
  async function loadState() {
    const result = await chrome.storage.local.get(['isEnabled']);
    const isEnabled = result.isEnabled !== false; // Default to true
    updateUI(isEnabled);
  }

  /**
   * Saves state and sends message to content script
   * @param {boolean} isEnabled
   */
  async function setState(isEnabled) {
    // Save to storage
    await chrome.storage.local.set({ isEnabled });

    // Update display
    updateUI(isEnabled);

    // Send message to all tabs with the content script
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'TOGGLE_FONT_DETECTOR',
          isEnabled
        }).catch(() => {
          // Content script might not be loaded on this page
        });
      }
    }
  }

  /**
   * Listen for storage changes (e.g., from Esc key in content script)
   */
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.isEnabled) {
      updateUI(changes.isEnabled.newValue);
    }
  });

  // Event listener for toggle
  toggleCheckbox.addEventListener('change', (event) => {
    setState(event.target.checked);
  });

  // Initialize
  loadState();
})();
