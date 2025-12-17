"use client";

import ZagabuyLogo from "@/components/custom/ZagabuyLogo";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

export default function LogoShowcase() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const examples = [
    {
      id: "logo-md",
      label: "Medium (Default)",
      component: <ZagabuyLogo size="md" />,
      code: '<ZagabuyLogo size="md" />',
    },
    {
      id: "logo-sm",
      label: "Small",
      component: <ZagabuyLogo size="sm" />,
      code: '<ZagabuyLogo size="sm" />',
    },
    {
      id: "logo-lg",
      label: "Large",
      component: <ZagabuyLogo size="lg" />,
      code: '<ZagabuyLogo size="lg" />',
    },
    {
      id: "logo-xl",
      label: "Extra Large",
      component: <ZagabuyLogo size="xl" />,
      code: '<ZagabuyLogo size="xl" />',
    },
    {
      id: "logo-icon-only",
      label: "Icon Only",
      component: <ZagabuyLogo showText={false} />,
      code: "<ZagabuyLogo showText={false} />",
    },
    {
      id: "logo-trending",
      label: "Trending Variant",
      component: <ZagabuyLogo variant="trending" />,
      code: '<ZagabuyLogo variant="trending" />',
    },
    {
      id: "logo-zap",
      label: "Zap Variant",
      component: <ZagabuyLogo variant="zap" />,
      code: '<ZagabuyLogo variant="zap" />',
    },
    {
      id: "logo-dark",
      label: "Dark Mode",
      component: (
        <div className="bg-slate-900 rounded-lg p-4">
          <ZagabuyLogo size="lg" />
        </div>
      ),
      code: '<ZagabuyLogo size="lg" /> {/* in dark mode */}',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-heading font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Zagabuy Logo
          </h1>
          <p className="text-muted-foreground text-lg">
            Professional logo component with multiple size and style variants
          </p>
        </div>

        {/* Hero */}
        <div className="mb-12 p-12 flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
          <ZagabuyLogo size="xl" />
        </div>

        {/* Variants Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-heading font-bold mb-6">Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {examples.map((example) => (
              <div
                key={example.id}
                className="p-6 flex flex-col items-center justify-center gap-4 hover:border-primary transition-colors"
              >
                {example.component}
                <p className="text-sm font-medium text-center text-muted-foreground">
                  {example.label}
                </p>
                <Button
                  size="small"
                  variant="ghost"
                  onClick={() => copyToClipboard(example.code, example.id)}
                  className="w-full"
                >
                  {copied === example.id ? (
                    <>
                      <Check size={14} className="mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} className="mr-1" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Usage */}
        <div className="mb-12">
          <h2 className="text-2xl font-heading font-bold mb-6">Usage</h2>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Basic Import</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`import ZagabuyLogo from "@/components/custom/ZagabuyLogo"`}</code>
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Basic Usage</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`<ZagabuyLogo />`}</code>
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">With Props</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`<ZagabuyLogo 
  size="lg"
  variant="trending"
  showText={true}
  className="cursor-pointer"
/>`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Props Documentation */}
        <div className="mb-12">
          <h2 className="text-2xl font-heading font-bold mb-6">Props</h2>
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 font-semibold">Prop</th>
                  <th className="text-left py-2 px-2 font-semibold">Type</th>
                  <th className="text-left py-2 px-2 font-semibold">Default</th>
                  <th className="text-left py-2 px-2 font-semibold">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-2 px-2">size</td>
                  <td className="py-2 px-2 text-primary">
                    <code className="text-xs">"sm" | "md" | "lg" | "xl"</code>
                  </td>
                  <td className="py-2 px-2">
                    <code className="text-xs">"md"</code>
                  </td>
                  <td className="py-2 px-2">Size of the logo</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-2 px-2">variant</td>
                  <td className="py-2 px-2 text-primary">
                    <code className="text-xs">"bag" | "trending" | "zap"</code>
                  </td>
                  <td className="py-2 px-2">
                    <code className="text-xs">"bag"</code>
                  </td>
                  <td className="py-2 px-2">Icon style variant</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-2 px-2">showText</td>
                  <td className="py-2 px-2 text-primary">
                    <code className="text-xs">boolean</code>
                  </td>
                  <td className="py-2 px-2">
                    <code className="text-xs">true</code>
                  </td>
                  <td className="py-2 px-2">Show or hide text label</td>
                </tr>
                <tr className="hover:bg-muted/50">
                  <td className="py-2 px-2">className</td>
                  <td className="py-2 px-2 text-primary">
                    <code className="text-xs">string</code>
                  </td>
                  <td className="py-2 px-2">
                    <code className="text-xs">""</code>
                  </td>
                  <td className="py-2 px-2">Additional CSS classes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Color Palette */}
        <div>
          <h2 className="text-2xl font-heading font-bold mb-6">
            Color Palette
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-primary shadow-lg" />
                <div>
                  <p className="font-semibold">Primary</p>
                  <p className="text-xs text-muted-foreground">
                    hsl(230 80% 55%)
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Main brand color for icon background
              </p>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-accent shadow-lg" />
                <div>
                  <p className="font-semibold">Accent</p>
                  <p className="text-xs text-muted-foreground">
                    hsl(170 60% 45%)
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Accent color for gradient
              </p>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-success shadow-lg" />
                <div>
                  <p className="font-semibold">Success</p>
                  <p className="text-xs text-muted-foreground">
                    hsl(142 71% 45%)
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Corner indicator dot
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
