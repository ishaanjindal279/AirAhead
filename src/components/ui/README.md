# AQI Platform Design System

A comprehensive, reusable design system built for the Air Quality Index Prediction Platform with Tailwind CSS v4, featuring full dark/light mode support.

## Table of Contents

- [Color System](#color-system)
- [Typography](#typography)
- [Components](#components)
- [Usage Examples](#usage-examples)
- [Dark Mode](#dark-mode)

---

## Color System

### AQI Color Scale (EPA Standard)

The platform uses EPA-standard color coding for air quality levels:

| AQI Range | Category | Color | CSS Variable |
|-----------|----------|-------|--------------|
| 0-50 | Good | Green | `--aqi-good` |
| 51-100 | Moderate | Yellow | `--aqi-moderate` |
| 101-150 | Unhealthy for Sensitive Groups | Orange | `--aqi-unhealthy-sensitive` |
| 151-200 | Unhealthy | Red | `--aqi-unhealthy` |
| 201-300 | Very Unhealthy | Purple | `--aqi-very-unhealthy` |
| 300+ | Hazardous | Maroon | `--aqi-hazardous` |

### Dashboard Colors

```css
--success: #10b981
--warning: #f59e0b
--error: #ef4444
--info: #3b82f6
```

Each color includes light variants for backgrounds (`-light` suffix).

---

## Typography

### Scale

The design system uses a consistent typography scale:

| Token | Size | Usage |
|-------|------|-------|
| `text-xs` | 0.75rem | Fine print, timestamps |
| `text-sm` | 0.875rem | Secondary text, labels |
| `text-base` | 1rem | Body text |
| `text-lg` | 1.125rem | Card titles |
| `text-xl` | 1.25rem | Section headings |
| `text-2xl` | 1.5rem | Page headings |
| `text-3xl` | 1.875rem | Large headings |
| `text-4xl` | 2.25rem | Hero text |

### Font Weights

- Normal: 400 (`--font-weight-normal`)
- Medium: 500 (`--font-weight-medium`)

---

## Components

### Card

Flexible container component with multiple variants.

**Props:**
- `variant`: 'default' | 'elevated' | 'outlined' | 'flat'
- `padding`: 'none' | 'sm' | 'md' | 'lg'
- `hover`: boolean
- `className`: string

**Sub-components:**
- `CardHeader`
- `CardTitle`
- `CardDescription`
- `CardContent`
- `CardFooter`

**Example:**
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';

<Card variant="elevated" padding="lg">
  <CardHeader>
    <CardTitle>Dashboard Stats</CardTitle>
    <CardDescription>Real-time metrics</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content here */}
  </CardContent>
</Card>
```

---

### Alert

Contextual feedback messages with icons.

**Props:**
- `variant`: 'info' | 'success' | 'warning' | 'error'
- `title`: string (optional)
- `dismissible`: boolean
- `onDismiss`: () => void
- `icon`: boolean
- `className`: string

**Example:**
```tsx
import { Alert } from './ui/Alert';

<Alert variant="warning" title="Important Notice" dismissible>
  Please review the air quality conditions before going outside.
</Alert>
```

---

### Badge

Status indicators and labels.

**Props:**
- `variant`: 'default' | 'success' | 'warning' | 'error' | 'info' | 'aqi-*'
- `size`: 'sm' | 'md' | 'lg'
- `dot`: boolean
- `className`: string

**Example:**
```tsx
import { Badge } from './ui/Badge';

<Badge variant="success" size="md" dot>
  Active
</Badge>
```

---

### AQIBadge

Specialized badge for displaying AQI values with automatic color coding.

**Props:**
- `value`: number (AQI value)
- `size`: 'sm' | 'md' | 'lg'
- `showLabel`: boolean
- `className`: string

**Example:**
```tsx
import { AQIBadge } from './ui/AQIBadge';

<AQIBadge value={68} size="md" showLabel />
// Displays: 68 · Moderate (with yellow color coding)
```

---

### Button

Interactive button component with multiple styles.

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `fullWidth`: boolean
- `icon`: ReactNode
- `disabled`: boolean
- All standard button HTML attributes

**Example:**
```tsx
import { Button } from './ui/Button';
import { Download } from 'lucide-react';

<Button variant="primary" icon={<Download className="w-4 h-4" />}>
  Download Report
</Button>
```

---

## Usage Examples

### Creating a Dashboard Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { AQIBadge } from './ui/AQIBadge';
import { Alert } from './ui/Alert';

function DashboardCard() {
  return (
    <Card variant="default" hover>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Current Air Quality</CardTitle>
          <AQIBadge value={72} />
        </div>
      </CardHeader>
      <CardContent>
        <Alert variant="info">
          Air quality is moderate. Sensitive individuals should limit outdoor exposure.
        </Alert>
      </CardContent>
    </Card>
  );
}
```

### Status Indicators

```tsx
import { Badge } from './ui/Badge';

<div className="flex gap-2">
  <Badge variant="success" dot>Online</Badge>
  <Badge variant="warning" dot>Pending</Badge>
  <Badge variant="error" dot>Offline</Badge>
</div>
```

---

## Dark Mode

### Implementation

Dark mode is automatically handled through CSS variables and Tailwind's `dark:` variant.

**Toggle Component:**
```tsx
import { ThemeToggle } from './ThemeToggle';

<ThemeToggle />
```

### Theme Persistence

The theme preference is automatically saved to `localStorage` and respects the user's system preferences by default.

### Using Dark Mode in Components

All design system components include built-in dark mode support. For custom components:

```tsx
// Light and dark mode classes
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  Content adapts to theme
</div>
```

### Custom CSS Variables

Dark mode values are automatically swapped when `.dark` class is applied to the root element.

---

## Spacing Scale

Consistent spacing tokens:

```css
--spacing-xs: 0.25rem    /* 4px */
--spacing-sm: 0.5rem     /* 8px */
--spacing-md: 1rem       /* 16px */
--spacing-lg: 1.5rem     /* 24px */
--spacing-xl: 2rem       /* 32px */
--spacing-2xl: 3rem      /* 48px */
```

---

## Shadow Scale

Elevation system for depth:

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
```

---

## Best Practices

1. **Consistency**: Always use design system components instead of custom styles
2. **Accessibility**: All components include focus states and ARIA attributes
3. **Responsiveness**: Components are mobile-first and responsive by default
4. **Theme Support**: Always include dark mode variants when extending components
5. **AQI Colors**: Use the AQIBadge component for all AQI-related displays to ensure consistency

---

## Viewing the Design System

Navigate to the "Design System" page in the sidebar to see all components with live examples and variations.
