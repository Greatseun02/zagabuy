"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import {
  Heart,
  Share2,
  Mail,
  Trash2,
  Settings,
  ChevronRight,
  Plus,
  Download,
} from "lucide-react";

export default function ComponentDemo() {
  const [loadingButton, setLoadingButton] = useState<string | null>(null);

  const handleLoadingClick = (id: string) => {
    setLoadingButton(id);
    setTimeout(() => setLoadingButton(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background p-8 space-y-16">
      {/* Header */}
      <div className="space-y-4">
        <Typography
          component="h1"
          variant="display"
          size="2xl"
          weight="bold"
          color="primary"
        >
          Component Showcase
        </Typography>
        <Typography component="p" size="lg" color="muted-foreground">
          Explore all available Typography and Button variants
        </Typography>
      </div>

      {/* Typography Section */}
      <section className="space-y-8">
        <div>
          <Typography
            component="h2"
            variant="display"
            size="xl"
            weight="bold"
            className="mb-4"
          >
            Typography
          </Typography>

          {/* Variants */}
          <div className="bg-card rounded-lg p-6 space-y-8 border border-border">
            {/* Display Variant */}
            <div className="space-y-3">
              <Typography weight="semibold" color="accent">
                Display Variant
              </Typography>
              <div className="space-y-2">
                <Typography variant="display" size="xs">
                  Display XS
                </Typography>
                <Typography variant="display" size="sm">
                  Display Small
                </Typography>
                <Typography variant="display" size="md">
                  Display Medium
                </Typography>
                <Typography variant="display" size="lg">
                  Display Large
                </Typography>
                <Typography variant="display" size="xl">
                  Display XL
                </Typography>
                <Typography variant="display" size="2xl">
                  Display 2XL
                </Typography>
              </div>
            </div>

            {/* Text Variant */}
            <div className="space-y-3">
              <Typography weight="semibold" color="accent">
                Text Variant (Default)
              </Typography>
              <div className="space-y-2">
                <Typography size="xs">Text XS</Typography>
                <Typography size="sm">Text Small</Typography>
                <Typography size="md">Text Medium</Typography>
                <Typography size="lg">Text Large</Typography>
                <Typography size="xl">Text XL</Typography>
                <Typography size="2xl">Text 2XL</Typography>
              </div>
            </div>

            {/* Weights */}
            <div className="space-y-3">
              <Typography weight="semibold" color="accent">
                Font Weights
              </Typography>
              <div className="space-y-2">
                <Typography weight="regular">Regular (400)</Typography>
                <Typography weight="medium">Medium (500)</Typography>
                <Typography weight="semibold">Semibold (600)</Typography>
                <Typography weight="bold">Bold (700)</Typography>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-3">
              <Typography weight="semibold" color="accent">
                Colors
              </Typography>
              <div className="space-y-2">
                <Typography color="primary">Primary Color</Typography>
                <Typography color="secondary">Secondary Color</Typography>
                <Typography color="error">Error Color</Typography>
                <Typography color="warning">Warning Color</Typography>
                <Typography color="success">Success Color</Typography>
                <Typography color="muted-foreground">
                  Muted Foreground
                </Typography>
                <Typography color="foreground">Foreground</Typography>
                <Typography color="accent">Accent</Typography>
              </div>
            </div>

            {/* Fonts */}
            <div className="space-y-3">
              <Typography weight="semibold" color="accent">
                Font Families
              </Typography>
              <div className="space-y-2">
                <Typography font="sans">Sans Font (Default)</Typography>
                <Typography font="mono">Mono Font</Typography>
              </div>
            </div>

            {/* Components */}
            <div className="space-y-3">
              <Typography weight="semibold" color="accent">
                Components
              </Typography>
              <div className="space-y-2">
                <Typography component="p">Paragraph Element</Typography>
                <Typography component="span">Span Element</Typography>
                <Typography component="h1" variant="display" size="lg">
                  H1 Element
                </Typography>
                <Typography component="h2" size="lg" weight="semibold">
                  H2 Element
                </Typography>
                <Typography component="h3" size="md" weight="semibold">
                  H3 Element
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Button Section */}
      <section className="space-y-8">
        <div>
          <Typography
            component="h2"
            variant="display"
            size="xl"
            weight="bold"
            className="mb-4"
          >
            Buttons
          </Typography>

          <div className="bg-card rounded-lg p-6 space-y-8 border border-border">
            {/* Variants */}
            <div className="space-y-4">
              <Typography weight="semibold" color="accent">
                Variants
              </Typography>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
                <Button variant="transparent">Transparent</Button>
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-4">
              <Typography weight="semibold" color="accent">
                Sizes
              </Typography>
              <div className="flex flex-wrap gap-3 items-center">
                <Button size="x-small">X-Small</Button>
                <Button size="small">Small</Button>
                <Button size="medium">Medium</Button>
                <Button size="large">Large</Button>
                <Button size="icon">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button size="icon-sm">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button size="icon-lg">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Width Options */}
            <div className="space-y-4">
              <Typography weight="semibold" color="accent">
                Width Options
              </Typography>
              <div className="space-y-2">
                <Button width="auto">Auto Width</Button>
                <Button width="fit">Fit Width</Button>
                <Button width="full">Full Width</Button>
              </div>
            </div>

            {/* With Icons */}
            <div className="space-y-4">
              <Typography weight="semibold" color="accent">
                With Icons
              </Typography>
              <div className="flex flex-wrap gap-3">
                <Button startIcon={Mail} variant="primary">
                  Send Email
                </Button>
                <Button endIcon={ChevronRight} variant="secondary">
                  Next Step
                </Button>
                <Button startIcon={Plus} endIcon={Download} variant="outline">
                  Add & Download
                </Button>
                <Button startIcon={Trash2} variant="destructive">
                  Delete
                </Button>
                <Button size="icon" variant="primary">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Loading States */}
            <div className="space-y-4">
              <Typography weight="semibold" color="accent">
                Loading States
              </Typography>
              <div className="flex flex-wrap gap-3">
                <Button
                  isLoading={loadingButton === "primary"}
                  onClick={() => handleLoadingClick("primary")}
                  variant="primary"
                >
                  Primary Loading
                </Button>
                <Button
                  isLoading={loadingButton === "secondary"}
                  onClick={() => handleLoadingClick("secondary")}
                  variant="secondary"
                  loadingText="Processing..."
                >
                  With Loading Text
                </Button>
                <Button
                  isLoading={loadingButton === "outline"}
                  onClick={() => handleLoadingClick("outline")}
                  variant="outline"
                >
                  Outline Loading
                </Button>
              </div>
            </div>

            {/* States */}
            <div className="space-y-4">
              <Typography weight="semibold" color="accent">
                States
              </Typography>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Normal</Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
              </div>
            </div>

            {/* Combined Examples */}
            <div className="space-y-4">
              <Typography weight="semibold" color="accent">
                Combined Examples
              </Typography>
              <div className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline">Cancel</Button>
                  <Button variant="primary" endIcon={ChevronRight}>
                    Continue
                  </Button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" width="full">
                    Cancel
                  </Button>
                  <Button variant="destructive" startIcon={Trash2} width="full">
                    Delete Forever
                  </Button>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
