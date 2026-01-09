/**
 * Zagabuy Platform - Footer Component
 *
 * Site footer with links and information.
 */

import { cn } from "@/lib/utils";
import { RouteConstant } from "@/utilities/constants/routeConstant";
import { Facebook, X, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import Typography from "@/components/ui/typography";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: "Browse Deals", href: RouteConstant.deals.path },
      { label: "Categories", href: RouteConstant.deals.path },
      { label: "Trending", href: RouteConstant.deals.path },
      { label: "Featured", href: RouteConstant.deals.path },
    ],
    merchants: [
      {
        label: "Become a Merchant",
        href: RouteConstant.merchant.dashboard.path,
      },
      {
        label: "Merchant Dashboard",
        href: RouteConstant.merchant.dashboard.path,
      },
      {
        label: "Upload Deals",
        href: RouteConstant.merchant.deals.createDeal.path,
      },
      { label: "Analytics", href: RouteConstant.merchant.analytics.path },
    ],
    company: [
      { label: "About Us", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
    legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "Advertiser Terms", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: X, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer
      className={cn("bg-muted/50 border-t", className)}
      data-testid="footer"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href={RouteConstant.app.path}>
              <span className="flex items-center gap-2 font-display font-bold text-xl mb-4 cursor-pointer">
                <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                    Z
                  </span>
                </div>
                <span>Zagabuy</span>
              </span>
            </Link>
            <Typography size="sm" color="muted-foreground" className="mb-4">
              Your community-driven deals marketplace. Discover amazing deals
              from verified merchants every day.
            </Typography>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded-md bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <Typography weight="semibold" className="mb-4">
              Platform
            </Typography>
            <ul className="space-y-2.5">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <Typography
                      size="sm"
                      color="muted-foreground"
                      className="hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Typography>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Merchants Links */}
          <div>
            <Typography weight="semibold" className="mb-4">
              For Merchants
            </Typography>
            <ul className="space-y-2.5">
              {footerLinks.merchants.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <Typography
                      size="sm"
                      color="muted-foreground"
                      className="hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Typography>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <Typography weight="semibold" className="mb-4">
              Company
            </Typography>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <Typography
                      size="sm"
                      color="muted-foreground"
                      className="hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Typography>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <Typography weight="semibold" className="mb-4">
              Legal
            </Typography>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <Typography
                      size="sm"
                      color="muted-foreground"
                      className="hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Typography>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <Typography size="sm" color="muted-foreground">
            &copy; {currentYear} Zagabuy. All rights reserved.
          </Typography>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">
              <Typography size="sm" color="muted-foreground">
                Privacy
              </Typography>
            </a>
            <span>•</span>
            <a href="#" className="hover:text-foreground transition-colors">
              <Typography size="sm" color="muted-foreground">
                Terms
              </Typography>
            </a>
            <span>•</span>
            <a href="#" className="hover:text-foreground transition-colors">
              <Typography size="sm" color="muted-foreground">
                Cookies
              </Typography>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
