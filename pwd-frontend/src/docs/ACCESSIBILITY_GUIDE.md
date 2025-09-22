# Screen Reader Accessibility Implementation Guide

## Overview
This guide shows how to implement screen reader functionality across all pages so that when users click on any function or element, the system will announce what they clicked.

## Implementation Steps

### 1. Import the Accessibility Hook
```javascript
import { useAccessibleClick } from '../../hooks/useAccessibleClick';
```

### 2. Use the Hook in Your Component
```javascript
function YourComponent() {
  const { handleClick, handleFieldChange, handleNavigation, handleMessage } = useAccessibleClick();
  
  // Your component logic here
}
```

### 3. Add Click Announcements to Buttons
```javascript
<Button
  onClick={(e) => handleClick(e, 'Custom message')}
  // ... other props
>
  Button Text
</Button>
```

### 4. Add Field Change Announcements
```javascript
const handleInputChange = (field) => (event) => {
  const value = event.target.value;
  // Your logic here
  handleFieldChange(field, value);
};
```

### 5. Add Navigation Announcements
```javascript
const navigateToPage = (pageName) => {
  handleNavigation(pageName);
  navigate('/some-page');
};
```

### 6. Add Message Announcements
```javascript
// Success message
handleMessage('Operation completed successfully', 'success');

// Error message
handleMessage('Something went wrong', 'error');

// Warning message
handleMessage('Please check your input', 'warning');

// Info message
handleMessage('Information updated', 'info');
```

## Example Implementation

### Before (No Accessibility)
```javascript
function LoginButton() {
  const handleLogin = () => {
    // Login logic
  };

  return (
    <Button onClick={handleLogin}>
      Login
    </Button>
  );
}
```

### After (With Accessibility)
```javascript
function LoginButton() {
  const { handleClick } = useAccessibleClick();
  
  const handleLogin = (e) => {
    handleClick(e, 'Login button clicked');
    // Login logic
  };

  return (
    <Button onClick={handleLogin}>
      Login
    </Button>
  );
}
```

## Features Available

### Click Announcements
- Automatically detects button text, aria-label, title, or alt attributes
- Custom messages can be provided
- Immediate feedback for user interactions

### Field Change Announcements
- Announces when form fields are updated
- Includes field name and new value
- Helps users track their input

### Navigation Announcements
- Announces page changes
- Helps users understand where they are
- Useful for screen reader users

### Message Announcements
- Success, error, warning, and info messages
- Consistent formatting across the application
- Clear communication of system status

## Testing

1. Enable Text-to-Speech in the accessibility toolbar
2. Click on buttons and interactive elements
3. Fill out form fields
4. Navigate between pages
5. Trigger success/error messages

The system will announce all interactions audibly, making the application fully accessible to screen reader users.

## Notes

- All announcements respect the user's speech settings (rate, volume, pitch)
- Announcements are only made when Text-to-Speech is enabled
- The system automatically handles language detection
- No DOM manipulation is used - all announcements are speech-based
