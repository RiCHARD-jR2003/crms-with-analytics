# Accessibility and Multilingual Support Documentation

## Overview

This PWD (Persons with Disabilities) application has been enhanced with comprehensive accessibility features and multilingual support to ensure inclusivity for all users, regardless of their abilities or language preferences.

## Accessibility Features

### 1. Screen Reader Compatibility

- **ARIA Labels**: All interactive elements have proper ARIA labels
- **Semantic HTML**: Uses proper HTML5 semantic elements (header, main, nav, etc.)
- **Role Attributes**: Elements have appropriate ARIA roles
- **Live Regions**: Dynamic content updates are announced to screen readers
- **Skip Links**: Allow keyboard users to skip to main content or navigation

### 2. Text-to-Speech (TTS) Support

- **Speech Synthesis**: Built-in browser speech synthesis API
- **Customizable Settings**:
  - Speech rate (0.1x to 3x)
  - Volume (0% to 100%)
  - Pitch (0 to 2)
- **Language Detection**: Automatically uses appropriate voice for selected language
- **Control Options**: Play, pause, stop, and test speech functionality

### 3. Visual Accessibility

- **High Contrast Mode**: Enhanced contrast for better visibility
- **Large Text Mode**: Increased font sizes for better readability
- **Focus Indicators**: Clear visual focus indicators for keyboard navigation
- **Color Independence**: Interface doesn't rely solely on color for information

### 4. Keyboard Navigation

- **Tab Order**: Logical tab order throughout the application
- **Keyboard Shortcuts**: Standard keyboard shortcuts supported
- **Focus Management**: Proper focus management for dynamic content
- **Skip Links**: Quick navigation to main content areas

## Multilingual Support

### Supported Languages

1. **English (en)** - Default language
2. **Tagalog (tl)** - Filipino national language
3. **Bisaya (bis)** - Visayan language
4. **Ilocano (ilo)** - Northern Luzon language
5. **Cebuano (ceb)** - Central Visayan language
6. **Ilonggo (hil)** - Western Visayan language

### Language Features

- **Dynamic Language Switching**: Change language without page reload
- **Persistent Preferences**: Language choice saved in localStorage
- **Backend Integration**: Server-side language support for API responses
- **Browser Detection**: Automatic language detection based on browser settings
- **Fallback Support**: Falls back to English if translation is missing

## Implementation Details

### Frontend Components

#### AccessibilityContext
- Manages accessibility settings and state
- Provides text-to-speech functionality
- Handles visual accessibility options
- Persists settings in localStorage

#### AccessibilityToolbar
- Floating accessibility button
- Drawer with accessibility controls
- Speech synthesis controls
- Visual accessibility toggles

#### LanguageSwitcher
- Language selection dropdown
- Flag icons for visual identification
- Integration with backend language API
- Screen reader announcements

### Backend Services

#### TranslationService
- Centralized translation management
- Support for multiple languages
- Fallback to English for missing translations
- Language validation

#### LanguageController
- API endpoints for language switching
- Current language retrieval
- Supported languages listing
- Translation data provision

#### SetLocale Middleware
- Automatic language detection from headers
- Session-based language persistence
- Supported language validation

## Usage Guidelines

### For Developers

1. **Adding New Translations**:
   ```javascript
   // Frontend: Add to locale files
   {
     "newKey": "New Translation"
   }
   
   // Backend: Add to language files
   return [
       'new_key' => 'New Translation',
   ];
   ```

2. **Using Accessibility Features**:
   ```javascript
   import { useAccessibility } from '../contexts/AccessibilityContext';
   
   const { speak, announceToScreenReader } = useAccessibility();
   
   // Speak text
   speak("Hello world");
   
   // Announce to screen reader
   announceToScreenReader("Form submitted successfully");
   ```

3. **Adding ARIA Labels**:
   ```jsx
   <Button
     aria-label="Submit form"
     aria-describedby="form-help"
     onClick={handleSubmit}
   >
     Submit
   </Button>
   ```

### For Users

1. **Accessing Accessibility Features**:
   - Click the accessibility button (♿) in the top-right corner
   - Enable text-to-speech for audio feedback
   - Adjust speech settings (rate, volume, pitch)
   - Toggle high contrast and large text modes

2. **Changing Language**:
   - Click the language button (🌐) in the header
   - Select your preferred language from the dropdown
   - Language preference is automatically saved

3. **Keyboard Navigation**:
   - Use Tab to navigate between elements
   - Use Enter or Space to activate buttons
   - Use arrow keys to navigate menus
   - Use Escape to close modals/dropdowns

## Testing Accessibility

### Manual Testing Checklist

- [ ] Screen reader compatibility (NVDA, JAWS, VoiceOver)
- [ ] Keyboard-only navigation
- [ ] High contrast mode functionality
- [ ] Large text mode functionality
- [ ] Text-to-speech functionality
- [ ] Language switching
- [ ] Focus indicators visibility
- [ ] Skip links functionality

### Automated Testing

- Use axe-core for automated accessibility testing
- Lighthouse accessibility audit
- WAVE (Web Accessibility Evaluation Tool)

## Browser Support

- **Chrome**: Full support for all features
- **Firefox**: Full support for all features
- **Safari**: Full support for all features
- **Edge**: Full support for all features

## Performance Considerations

- Translation files are loaded on demand
- Speech synthesis doesn't block UI
- Accessibility settings are cached in localStorage
- Language switching is optimized for minimal re-renders

## Future Enhancements

1. **Additional Languages**: Support for more Philippine languages
2. **Voice Commands**: Voice control for navigation
3. **Braille Support**: Integration with braille displays
4. **Sign Language**: Video support for sign language
5. **Cognitive Accessibility**: Simplified interfaces for cognitive disabilities

## Compliance

This implementation follows:
- **WCAG 2.1 AA**: Web Content Accessibility Guidelines
- **Section 508**: US federal accessibility standards
- **ADA**: Americans with Disabilities Act requirements
- **RA 7277**: Philippine Magna Carta for Disabled Persons

## Support

For accessibility issues or language support requests, please contact the development team or submit an issue through the support system.
