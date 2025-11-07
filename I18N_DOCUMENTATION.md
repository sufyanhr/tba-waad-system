# Internationalization (i18n) Documentation

## Overview

The TBA-WAAD Health Insurance Platform supports bilingual operation with English and Arabic languages, including automatic RTL (Right-to-Left) layout switching for Arabic text.

## Installed Dependencies

The following packages have been installed to enable i18n functionality:

```json
{
  "i18next": "^25.6.1",
  "react-i18next": "^16.2.4",
  "i18next-browser-languagedetector": "^8.2.0"
}
```

### Package Descriptions

- **i18next**: Core internationalization framework providing translation management
- **react-i18next**: React-specific bindings for i18next with hooks and components
- **i18next-browser-languagedetector**: Automatically detects user language from browser settings and localStorage

## Configuration

### i18n Configuration File

Location: `src/i18n.ts`

```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import enTranslation from './locales/en/translation.json'
import arTranslation from './locales/ar/translation.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      ar: { translation: arTranslation }
    },
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  })

i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = lng
})

const currentLang = i18n.language || 'en'
document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr'
document.documentElement.lang = currentLang

export default i18n
```

### TypeScript Type Safety

Location: `src/i18next.d.ts`

This file provides TypeScript autocomplete and type checking for translation keys:

```typescript
import 'i18next'
import en from './locales/en/translation.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof en
    }
  }
}
```

## Translation Files

### File Structure

```
src/
  locales/
    en/
      translation.json
    ar/
      translation.json
```

### Translation Schema

Both translation files follow the same nested structure organized by module:

```json
{
  "login": {
    "title": "Sign In",
    "email": "Email",
    "password": "Password",
    "button": "Sign In",
    "welcome": "Welcome to TBA-WAAD",
    "subtitle": "Health Insurance Management Platform"
  },
  "nav": {
    "dashboard": "Dashboard",
    "users": "Users",
    "organizations": "Organizations",
    "members": "Members",
    "providers": "Providers",
    "claims": "Claims",
    "approvals": "Approvals",
    "finance": "Finance",
    "reports": "Reports",
    "settings": "Settings",
    "logout": "Logout"
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "view": "View",
    "close": "Close",
    "confirm": "Confirm",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success"
  }
}
```

## Usage in Components

### Basic Usage with Hook

```tsx
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.welcome')}</p>
    </div>
  )
}
```

### Accessing Current Language

```tsx
import { useTranslation } from 'react-i18next'

function LanguageInfo() {
  const { i18n } = useTranslation()
  
  return (
    <div>
      Current language: {i18n.language}
      Is RTL: {i18n.dir() === 'rtl' ? 'Yes' : 'No'}
    </div>
  )
}
```

### Changing Language

```tsx
import { useTranslation } from 'react-i18next'

function LanguageSwitcher() {
  const { i18n } = useTranslation()
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }
  
  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('ar')}>العربية</button>
    </div>
  )
}
```

## Language Switcher Component

Location: `src/components/layout/LanguageSwitcher.tsx`

A pre-built language switcher is available as a dropdown menu component:

```tsx
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'

function Header() {
  return (
    <header>
      <LanguageSwitcher />
    </header>
  )
}
```

Features:
- Globe icon button
- Dropdown with English and Arabic options
- Highlights currently selected language
- Accessible with proper ARIA labels

## RTL (Right-to-Left) Support

### Automatic Layout Switching

The application automatically switches to RTL layout when Arabic is selected. This is handled by:

1. **HTML Attribute**: The `dir` attribute is set on the root HTML element
2. **CSS Directives**: CSS in `src/index.css` handles directional styling

### CSS Configuration

Location: `src/index.css`

```css
[dir="rtl"] {
  direction: rtl;
}

[dir="ltr"] {
  direction: ltr;
}
```

### Testing RTL Layout

To test RTL layout:
1. Click the language switcher (globe icon)
2. Select "العربية" (Arabic)
3. The entire layout will flip to RTL
4. Navigation, forms, and content will all align properly for Arabic text

## Adding New Translations

### Step 1: Add English Translation

Edit `src/locales/en/translation.json`:

```json
{
  "myModule": {
    "myKey": "My English Text",
    "myAction": "Click Here"
  }
}
```

### Step 2: Add Arabic Translation

Edit `src/locales/ar/translation.json`:

```json
{
  "myModule": {
    "myKey": "النص العربي",
    "myAction": "انقر هنا"
  }
}
```

### Step 3: Use in Component

```tsx
import { useTranslation } from 'react-i18next'

function MyModule() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('myModule.myKey')}</h1>
      <button>{t('myModule.myAction')}</button>
    </div>
  )
}
```

## Best Practices

### 1. Organize by Module
Group related translations under module namespaces:
```json
{
  "claims": { /* claims-related translations */ },
  "members": { /* members-related translations */ },
  "common": { /* shared translations */ }
}
```

### 2. Use Descriptive Keys
Use clear, hierarchical keys:
```json
{
  "form": {
    "field": {
      "email": "Email Address",
      "password": "Password"
    },
    "button": {
      "submit": "Submit",
      "cancel": "Cancel"
    }
  }
}
```

### 3. Keep Keys Synchronized
Always add the same keys to both English and Arabic files to avoid missing translations.

### 4. Use TypeScript
The TypeScript declaration file provides autocomplete and catches missing translations at compile time.

### 5. Test Both Languages
Always test UI changes in both English and Arabic to ensure:
- All text is translated
- RTL layout works correctly
- No layout breaking or overflow issues
- Icons and buttons are properly positioned

## Troubleshooting

### Translations Not Appearing

1. Check that the translation key exists in both `en/translation.json` and `ar/translation.json`
2. Verify `src/i18n.ts` is imported in `src/main.tsx`
3. Clear browser cache and reload

### RTL Layout Not Working

1. Check browser console for errors
2. Verify `dir` attribute is set on HTML element (inspect with DevTools)
3. Ensure CSS directives in `src/index.css` are present

### Language Not Persisting

1. Check browser localStorage (DevTools → Application → Local Storage)
2. Verify `i18next-browser-languagedetector` is configured correctly
3. Ensure detection order includes 'localStorage'

### TypeScript Errors

1. Make sure `src/i18next.d.ts` exists
2. Verify it's included in TypeScript compilation (check `tsconfig.json`)
3. Restart TypeScript server in IDE

## Build and Deployment

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
```

The translation files are bundled into the production build automatically. No additional configuration needed.

### Environment Variables

No environment variables are required for i18n. Language detection and switching work entirely client-side.

## Performance Considerations

- Translation files are loaded once on app initialization
- Language changes trigger minimal re-renders (only components using translations)
- localStorage caching prevents language detection on every page load
- JSON files are small (~5KB each) and load quickly

## Future Enhancements

Potential future improvements:
- Add more languages (French, Spanish, etc.)
- Implement lazy loading for language files
- Add translation management dashboard
- Integrate with translation service APIs
- Support for pluralization and number formatting
- Date and time localization with date-fns

## Support

For issues or questions about i18n:
1. Check this documentation
2. Review the [i18next documentation](https://www.i18next.com/)
3. Review the [react-i18next documentation](https://react.i18next.com/)

---

**Last Updated**: January 2025
