# Multi-Language Resume Feature

## Overview

The interactive terminal resume now supports both English and French languages with automatic detection and easy switching.

## Features

### 1. **Automatic Language Detection**

- Detects browser language on first visit
- French speakers automatically see the French version
- Others see the English version by default

### 2. **URL Parameter Support**

Access the resume in a specific language using URL parameters:

- English: `https://messaddek.github.io/?lang=en`
- French: `https://messaddek.github.io/?lang=fr`

### 3. **Visual Language Selector**

- Two buttons (🇬🇧 EN / 🇫🇷 FR) in the top-right corner
- Active language is highlighted in green
- Smooth transitions when switching

### 4. **Terminal Command**

Switch languages directly in the terminal:

```bash
lang en    # Switch to English
lang fr    # Switch to French
lang       # Show current language
```

## File Structure

```
assets/
  └── json/
      ├── resume.json      # Original (kept for compatibility)
      ├── resume-en.json   # English version
      └── resume-fr.json   # French version
```

## Language Persistence

The selected language is saved in browser's localStorage and persists across sessions.

**Priority Order:**

1. URL parameter (`?lang=en` or `?lang=fr`)
2. localStorage (previously selected language)
3. Browser language detection
4. Default to English

## Implementation Details

### Language Detection Logic

```javascript
// Priority: URL → localStorage → Browser → Default
1. Check URL parameter (?lang=en or ?lang=fr)
2. Check localStorage ('resumeLanguage')
3. Detect browser language (navigator.language)
4. Default to 'en'
```

### Switching Methods

- **GUI Buttons**: Click EN/FR buttons in top-right
- **Terminal Command**: Type `lang en` or `lang fr`
- **Direct URL**: Add `?lang=en` or `?lang=fr` to URL

## Customization

### Adding More Languages

1. **Create new JSON file**:

   ```
   assets/json/resume-[lang-code].json
   ```

2. **Update script.js**:

   ```javascript
   // Add new language to messages object
   messages.es = {
     welcome: "...",
     langChanged: "...",
     // etc.
   };
   ```

3. **Update validation**:

   ```javascript
   if (lang === "en" || lang === "fr" || lang === "es") {
     // ...
   }
   ```

4. **Add button to HTML**:
   ```html
   <button onclick="switchLanguage('es')" id="lang-es" class="lang-btn">
     🇪🇸 ES
   </button>
   ```

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- localStorage support required for language persistence

## Testing

Test all access methods:

```bash
# Direct URL
https://messaddek.github.io/?lang=en
https://messaddek.github.io/?lang=fr

# Terminal commands
lang en
lang fr
lang

# GUI buttons
Click 🇬🇧 EN or 🇫🇷 FR
```

## Notes

- The original `resume.json` file is kept for backward compatibility
- Language preference persists across page reloads
- Switching language triggers a page reload to load the new JSON file
- All terminal commands work in both languages
