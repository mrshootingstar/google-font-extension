/**
 * Content Script - Main Entry Point
 * Coordinates between FontDetector and Tooltip modules
 * Handles DOM events and orchestrates the font detection flow
 */
(() => {
  let currentElement = null;
  let isEnabled = true;

  /**
   * Initializes the extension
   */
  function init() {
    // Load saved state from storage (non-blocking)
    loadSavedState();

    Tooltip.create();
    attachEventListeners();
    attachMessageListener();
  }

  /**
   * Loads the saved enabled state from chrome storage
   */
  function loadSavedState() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['isEnabled']).then((result) => {
        isEnabled = result.isEnabled !== false; // Default to true
      }).catch(() => {
        // Storage not available, keep default (enabled)
      });
    }
  }

  /**
   * Listens for messages from the popup
   */
  function attachMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'TOGGLE_FONT_DETECTOR') {
        if (message.isEnabled) {
          enable();
        } else {
          disable();
        }
        sendResponse({ success: true });
      }
      return true;
    });
  }

  /**
   * Attaches mouse and keyboard event listeners to the document
   */
  function attachEventListeners() {
    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('mouseout', handleMouseOut, true);
    document.addEventListener('mousemove', handleMouseMove, true);
    document.addEventListener('keydown', handleKeyDown, true);
  }

  /**
   * Handles keydown events for copy functionality
   * @param {KeyboardEvent} event
   */
  async function handleKeyDown(event) {
    // Only respond to 'C' key (without modifiers) when tooltip is visible
    if (event.key.toLowerCase() !== 'c') return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (!Tooltip.isVisible()) return;

    const fontName = Tooltip.getCurrentFontName();
    if (!fontName) return;

    // Prevent 'c' from being typed in input fields
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable) {
      return;
    }

    event.preventDefault();

    const success = await Clipboard.copy(fontName);
    if (success) {
      Tooltip.showCopyFeedback();
    }
  }

  /**
   * Handles mouseover events on elements
   * @param {MouseEvent} event
   */
  function handleMouseOver(event) {
    if (!isEnabled) return;

    const target = event.target;

    // Skip if it's our tooltip or same element
    if (target.id === 'font-detector-tooltip' || target === currentElement) {
      return;
    }

    // Only process elements that have text content
    if (!FontDetector.hasTextContent(target)) {
      return;
    }

    currentElement = target;

    const fontProperties = FontDetector.getFontProperties(target);
    const fontInfo = FontDetector.formatFontInfo(fontProperties);
    const fontName = FontDetector.cleanFontFamily(fontProperties.fontFamily);

    Tooltip.show(fontInfo, fontName, event.clientX, event.clientY);
  }

  /**
   * Handles mouseout events
   * @param {MouseEvent} event
   */
  function handleMouseOut(event) {
    const relatedTarget = event.relatedTarget;

    // Don't hide if moving to tooltip itself
    if (relatedTarget && relatedTarget.id === 'font-detector-tooltip') {
      return;
    }

    // Don't hide if moving to a child element
    if (currentElement && currentElement.contains(relatedTarget)) {
      return;
    }

    currentElement = null;
    Tooltip.hide();
  }

  /**
   * Handles mouse movement for tooltip positioning
   * @param {MouseEvent} event
   */
  function handleMouseMove(event) {
    if (!isEnabled || !currentElement) return;

    Tooltip.updatePosition(event.clientX, event.clientY);
  }

  /**
   * Enables font detection
   */
  function enable() {
    isEnabled = true;
  }

  /**
   * Disables font detection
   */
  function disable() {
    isEnabled = false;
    Tooltip.hide();
    currentElement = null;
  }

  /**
   * Toggles font detection on/off
   * @returns {boolean} New enabled state
   */
  function toggle() {
    if (isEnabled) {
      disable();
    } else {
      enable();
    }
    return isEnabled;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose toggle function globally for potential popup control
  window.FontDetectorExtension = {
    enable,
    disable,
    toggle,
    isEnabled: () => isEnabled
  };
})();
