/**
 * Tooltip Module
 * Responsible for creating, positioning, and managing the tooltip UI
 */
const Tooltip = (() => {
  const TOOLTIP_ID = 'font-detector-tooltip';
  const OFFSET_X = 15;
  const OFFSET_Y = 15;

  let tooltipElement = null;
  let contentElement = null;
  let hintElement = null;
  let currentFontName = '';

  /**
   * Creates the tooltip element if it doesn't exist
   * @returns {HTMLElement} The tooltip element
   */
  function create() {
    if (tooltipElement) {
      return tooltipElement;
    }

    tooltipElement = document.createElement('div');
    tooltipElement.id = TOOLTIP_ID;
    tooltipElement.setAttribute('role', 'tooltip');
    tooltipElement.setAttribute('aria-hidden', 'true');

    contentElement = document.createElement('div');
    contentElement.className = 'font-detector-content';

    hintElement = document.createElement('div');
    hintElement.className = 'fd-hint';
    hintElement.innerHTML = 'Press <kbd>C</kbd> to copy';

    tooltipElement.appendChild(contentElement);
    tooltipElement.appendChild(hintElement);

    document.body.appendChild(tooltipElement);

    return tooltipElement;
  }

  /**
   * Shows visual feedback when text is copied
   */
  function showCopyFeedback() {
    if (!hintElement) return;

    hintElement.innerHTML = '<span class="fd-copied-text">Copied!</span>';
    tooltipElement.classList.add('copied');

    setTimeout(() => {
      hintElement.innerHTML = 'Press <kbd>C</kbd> to copy';
      tooltipElement.classList.remove('copied');
    }, 1500);
  }

  /**
   * Gets the current font name
   * @returns {string} Current font name
   */
  function getCurrentFontName() {
    return currentFontName;
  }

  /**
   * Checks if tooltip is currently visible
   * @returns {boolean}
   */
  function isVisible() {
    return tooltipElement && tooltipElement.classList.contains('visible');
  }

  /**
   * Shows the tooltip with the given content
   * @param {string} content - Text content to display
   * @param {string} fontName - The font name for copying
   * @param {number} x - X coordinate for positioning
   * @param {number} y - Y coordinate for positioning
   */
  function show(content, fontName, x, y) {
    if (!tooltipElement) {
      create();
    }

    contentElement.innerHTML = content;
    currentFontName = fontName;
    tooltipElement.classList.add('visible');
    tooltipElement.setAttribute('aria-hidden', 'false');

    position(x, y);
  }

  /**
   * Hides the tooltip
   */
  function hide() {
    if (tooltipElement) {
      tooltipElement.classList.remove('visible');
      tooltipElement.setAttribute('aria-hidden', 'true');
    }
  }

  /**
   * Positions the tooltip, keeping it within viewport bounds
   * @param {number} x - Mouse X coordinate
   * @param {number} y - Mouse Y coordinate
   */
  function position(x, y) {
    if (!tooltipElement) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const tooltipRect = tooltipElement.getBoundingClientRect();

    let left = x + OFFSET_X;
    let top = y + OFFSET_Y;

    // Prevent tooltip from going off the right edge
    if (left + tooltipRect.width > viewportWidth) {
      left = x - tooltipRect.width - OFFSET_X;
    }

    // Prevent tooltip from going off the bottom edge
    if (top + tooltipRect.height > viewportHeight) {
      top = y - tooltipRect.height - OFFSET_Y;
    }

    // Ensure tooltip doesn't go off left or top edges
    left = Math.max(5, left);
    top = Math.max(5, top);

    tooltipElement.style.left = `${left}px`;
    tooltipElement.style.top = `${top}px`;
  }

  /**
   * Updates tooltip position during mouse movement
   * @param {number} x - New X coordinate
   * @param {number} y - New Y coordinate
   */
  function updatePosition(x, y) {
    if (tooltipElement && tooltipElement.classList.contains('visible')) {
      position(x, y);
    }
  }

  /**
   * Removes the tooltip from the DOM
   */
  function destroy() {
    if (tooltipElement) {
      tooltipElement.remove();
      tooltipElement = null;
    }
  }

  // Public API
  return {
    create,
    show,
    hide,
    updatePosition,
    destroy,
    showCopyFeedback,
    getCurrentFontName,
    isVisible
  };
})();
