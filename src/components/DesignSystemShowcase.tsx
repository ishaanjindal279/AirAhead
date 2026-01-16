import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { Alert } from './ui/Alert';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { AQIBadge } from './ui/AQIBadge';
import { Download, Plus, Trash2, Edit } from 'lucide-react';

export function DesignSystemShowcase() {
  return (
    <div className="space-y-8 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            AQI Platform Design System
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Reusable components for dashboard interfaces
          </p>
        </div>

        {/* Typography */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Typography Scale</CardTitle>
            <CardDescription>Consistent text sizes across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">text-4xl</p>
                <h1 className="text-4xl">Dashboard Heading</h1>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">text-3xl</p>
                <h2 className="text-3xl">Section Title</h2>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">text-2xl</p>
                <h2 className="text-2xl">Card Heading</h2>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">text-xl</p>
                <h3 className="text-xl">Subsection</h3>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">text-base</p>
                <p className="text-base">Body text for content and descriptions</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">text-sm</p>
                <p className="text-sm">Secondary text and labels</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Card Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card variant="default">
              <CardTitle>Default</CardTitle>
              <CardDescription>Standard card with border</CardDescription>
            </Card>
            <Card variant="elevated">
              <CardTitle>Elevated</CardTitle>
              <CardDescription>Card with shadow</CardDescription>
            </Card>
            <Card variant="outlined">
              <CardTitle>Outlined</CardTitle>
              <CardDescription>Transparent with thick border</CardDescription>
            </Card>
            <Card variant="flat">
              <CardTitle>Flat</CardTitle>
              <CardDescription>Subtle background</CardDescription>
            </Card>
          </div>
        </div>

        {/* Buttons */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <CardDescription>Different button styles for various actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" icon={<Plus className="w-4 h-4" />}>With Icon</Button>
                <Button variant="outline" icon={<Download className="w-4 h-4" />}>Download</Button>
                <Button variant="danger" icon={<Trash2 className="w-4 h-4" />}>Delete</Button>
                <Button variant="secondary" loading>Loading</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Alert Components</CardTitle>
            <CardDescription>System notifications and messages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="info" title="Information">
              This is an informational message to keep users updated.
            </Alert>
            <Alert variant="success" title="Success">
              Your action was completed successfully!
            </Alert>
            <Alert variant="warning" title="Warning">
              Please review this important information before proceeding.
            </Alert>
            <Alert variant="error" title="Error">
              An error occurred while processing your request.
            </Alert>
            <Alert variant="info" dismissible onDismiss={() => console.log('Dismissed')}>
              This alert can be dismissed by clicking the X button.
            </Alert>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Badge Components</CardTitle>
            <CardDescription>Status indicators and labels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Standard Badges</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="info">Info</Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sizes</p>
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge variant="info" size="sm">Small</Badge>
                  <Badge variant="info" size="md">Medium</Badge>
                  <Badge variant="info" size="lg">Large</Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">With Dots</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="success" dot>Active</Badge>
                  <Badge variant="warning" dot>Pending</Badge>
                  <Badge variant="error" dot>Offline</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AQI Badges */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>AQI Badge Components</CardTitle>
            <CardDescription>Air Quality Index indicators with color coding</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AQI Ranges</p>
                <div className="flex flex-wrap gap-3">
                  <AQIBadge value={25} />
                  <AQIBadge value={75} />
                  <AQIBadge value={125} />
                  <AQIBadge value={175} />
                  <AQIBadge value={225} />
                  <AQIBadge value={325} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sizes</p>
                <div className="flex flex-wrap gap-3 items-center">
                  <AQIBadge value={68} size="sm" />
                  <AQIBadge value={68} size="md" />
                  <AQIBadge value={68} size="lg" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Without Labels</p>
                <div className="flex flex-wrap gap-3">
                  <AQIBadge value={45} showLabel={false} />
                  <AQIBadge value={85} showLabel={false} />
                  <AQIBadge value={155} showLabel={false} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle>AQI Color Scale</CardTitle>
            <CardDescription>EPA standard air quality color coding</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-green-100 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="w-12 h-12 bg-green-500 rounded-lg mb-3"></div>
                <h4 className="font-semibold text-green-900 dark:text-green-100">Good (0-50)</h4>
                <p className="text-sm text-green-700 dark:text-green-300">Air quality is satisfactory</p>
              </div>
              <div className="p-4 bg-yellow-100 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="w-12 h-12 bg-yellow-500 rounded-lg mb-3"></div>
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">Moderate (51-100)</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">Acceptable air quality</p>
              </div>
              <div className="p-4 bg-orange-100 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
                <div className="w-12 h-12 bg-orange-500 rounded-lg mb-3"></div>
                <h4 className="font-semibold text-orange-900 dark:text-orange-100">Unhealthy for Sensitive (101-150)</h4>
                <p className="text-sm text-orange-700 dark:text-orange-300">May affect sensitive groups</p>
              </div>
              <div className="p-4 bg-red-100 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="w-12 h-12 bg-red-500 rounded-lg mb-3"></div>
                <h4 className="font-semibold text-red-900 dark:text-red-100">Unhealthy (151-200)</h4>
                <p className="text-sm text-red-700 dark:text-red-300">Everyone may experience effects</p>
              </div>
              <div className="p-4 bg-purple-100 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-lg">
                <div className="w-12 h-12 bg-purple-500 rounded-lg mb-3"></div>
                <h4 className="font-semibold text-purple-900 dark:text-purple-100">Very Unhealthy (201-300)</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">Health alert conditions</p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="w-12 h-12 bg-gray-700 dark:bg-gray-600 rounded-lg mb-3"></div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">Hazardous (300+)</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">Health emergency</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
