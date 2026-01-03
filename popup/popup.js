/**
 * Popup Script
 * Handles toggle UI and communicates with content script
 */
(() => {
  const toggleCheckbox = document.getElementById('toggle');
  const statusText = document.getElementById('status');

  /**
   * Updates the status text display
   * @param {boolean} isEnabled
   */
  function updateStatusDisplay(isEnabled) {
    statusText.textContent = isEnabled ? 'Active' : 'Inactive';
    statusText.className = `status ${isEnabled ? 'active' : 'inactive'}`;
  }

  /**
   * Loads the saved state from storage
   */
  async function loadState() {
    const result = await chrome.storage.local.get(['isEnabled']);
    const isEnabled = result.isEnabled !== false; // Default to true
    toggleCheckbox.checked = isEnabled;
    updateStatusDisplay(isEnabled);
  }

  /**
   * Saves state and sends message to content script
   * @param {boolean} isEnabled
   */
  async function setState(isEnabled) {
    // Save to storage
    await chrome.storage.local.set({ isEnabled });

    // Update display
    updateStatusDisplay(isEnabled);

    // Send message to active tab's content script
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, {
        type: 'TOGGLE_FONT_DETECTOR',
        isEnabled
      }).catch(() => {
        // Content script might not be loaded on this page
      });
    }
  }

  // Event listener for toggle
  toggleCheckbox.addEventListener('change', (event) => {
    setState(event.target.checked);
  });

  // Initialize
  loadState();
})();
