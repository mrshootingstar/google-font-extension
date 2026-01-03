# Font Detector

A Chrome extension that displays font information for any text you hover over on a webpage.

## Features

- **Real-time font detection** - Hover over any text to see its computed CSS font properties
- **Comprehensive info** - Shows font family, size, weight, style, line height, letter spacing, and color
- **Copy to clipboard** - Press `C` while hovering to copy the font name
- **Toggle on/off** - Click the extension icon to enable or disable detection
- **Persisted state** - Your on/off preference is saved across sessions

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked**
5. Select the `font-detector-extension` folder

## Usage

1. Click the extension icon in Chrome toolbar to toggle on/off
2. Hover over any text on a webpage to see font details
3. Press `C` to copy the font name to clipboard

## Project Structure

```
font-detector-extension/
├── manifest.json       # Extension configuration
├── content.js          # Main coordinator script
├── fontDetector.js     # Extracts computed CSS font properties
├── tooltip.js          # Manages tooltip UI
├── clipboard.js        # Handles copy to clipboard
├── styles.css          # Tooltip styling
└── popup/
    ├── popup.html      # Toggle UI
    ├── popup.js        # Toggle logic
    └── popup.css       # Popup styling
```

## How It Works

The extension uses `window.getComputedStyle()` to read the actual CSS properties applied to elements, ensuring accurate font detection regardless of how styles are defined (inline, stylesheet, inherited, etc.).

## License

MIT
