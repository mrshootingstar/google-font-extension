/**
 * Clipboard Module
 * Responsible for copying text to clipboard and showing feedback
 */
const Clipboard = (() => {
  /**
   * Copies text to clipboard
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>} Success status
   */
  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback for older browsers or restricted contexts
      return fallbackCopy(text);
    }
  }

  /**
   * Fallback copy method using execCommand
   * @param {string} text - Text to copy
   * @returns {boolean} Success status
   */
  function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }

  // Public API
  return {
    copy
  };
})();
