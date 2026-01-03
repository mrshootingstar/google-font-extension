/**
 * Font Detector Module
 * Responsible for extracting computed font styles from DOM elements
 */
const FontDetector = (() => {
  /**
   * Gets the computed font properties for an element
   * @param {Element} element - The DOM element to inspect
   * @returns {Object} Font properties extracted from computed styles
   */
  function getFontProperties(element) {
    const computedStyle = window.getComputedStyle(element);

    return {
      fontFamily: computedStyle.fontFamily,
      fontSize: computedStyle.fontSize,
      fontWeight: computedStyle.fontWeight,
      fontStyle: computedStyle.fontStyle,
      lineHeight: computedStyle.lineHeight,
      letterSpacing: computedStyle.letterSpacing,
      color: computedStyle.color
    };
  }

  /**
   * Formats font properties into structured HTML
   * @param {Object} properties - Font properties object
   * @returns {string} HTML formatted font information
   */
  function formatFontInfo(properties) {
    const fontName = cleanFontFamily(properties.fontFamily);
    const rows = [
      { label: 'Size', value: properties.fontSize },
      { label: 'Weight', value: formatWeight(properties.fontWeight) },
      { label: 'Style', value: properties.fontStyle },
      { label: 'Line Height', value: properties.lineHeight },
      { label: 'Spacing', value: properties.letterSpacing },
      { label: 'Color', value: formatColor(properties.color) }
    ];

    const rowsHtml = rows
      .map(row => `<div class="fd-row"><span class="fd-label">${row.label}</span><span class="fd-value">${row.value}</span></div>`)
      .join('');

    return `
      <div class="fd-header">${escapeHtml(fontName)}</div>
      <div class="fd-properties">${rowsHtml}</div>
    `;
  }

  /**
   * Formats font properties into plain text for copying
   * @param {Object} properties - Font properties object
   * @returns {string} Plain text font information
   */
  function formatFontInfoPlain(properties) {
    const fontName = cleanFontFamily(properties.fontFamily);
    const lines = [
      `Font: ${fontName}`,
      `Size: ${properties.fontSize}`,
      `Weight: ${formatWeight(properties.fontWeight)}`,
      `Style: ${properties.fontStyle}`,
      `Line Height: ${properties.lineHeight}`,
      `Letter Spacing: ${properties.letterSpacing}`,
      `Color: ${properties.color}`
    ];

    return lines.join('\n');
  }

  /**
   * Formats color value with a visual swatch
   * @param {string} color - RGB color string
   * @returns {string} HTML with color swatch and value
   */
  function formatColor(color) {
    return `<span class="fd-color-swatch" style="background-color: ${color}"></span>${color}`;
  }

  /**
   * Escapes HTML special characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Cleans up font family string for display
   * @param {string} fontFamily - Raw font family from computed style
   * @returns {string} Cleaned font family name
   */
  function cleanFontFamily(fontFamily) {
    // Get the first (primary) font in the stack
    const primaryFont = fontFamily.split(',')[0].trim();
    // Remove quotes if present
    return primaryFont.replace(/["']/g, '');
  }

  /**
   * Converts numeric font weight to descriptive name
   * @param {string} weight - Font weight value
   * @returns {string} Descriptive weight name
   */
  function formatWeight(weight) {
    const weightNames = {
      '100': '100 (Thin)',
      '200': '200 (Extra Light)',
      '300': '300 (Light)',
      '400': '400 (Regular)',
      '500': '500 (Medium)',
      '600': '600 (Semi Bold)',
      '700': '700 (Bold)',
      '800': '800 (Extra Bold)',
      '900': '900 (Black)'
    };

    return weightNames[weight] || weight;
  }

  /**
   * Checks if an element contains visible text
   * @param {Element} element - The DOM element to check
   * @returns {boolean} True if element has text content
   */
  function hasTextContent(element) {
    // Check if element has direct text nodes
    for (const node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
        return true;
      }
    }
    return false;
  }

  // Public API
  return {
    getFontProperties,
    formatFontInfo,
    formatFontInfoPlain,
    hasTextContent,
    cleanFontFamily
  };
})();
