# FlowBudget Visual Asset Specifications

## Brand Colors
| Name | Hex | Usage |
|------|-----|-------|
| Deep Teal | #0D9488 | Primary brand, CTA buttons, logo |
| Warm Coral | #F97316 | Accents, alerts, "before" states |
| Fresh Green | #22C55E | Success, growth, "after" states |
| Charcoal | #1E293B | Text, dark backgrounds |
| Snow | #F8FAFC | Light backgrounds, white text |

## Typography
- **Primary:** Inter (400, 600, 700, 800)
- **Mono:** JetBrains Mono (500) — for numbers, code, pricing

## Logo
### Primary (Wordmark + Icon)
- File: `logo-primary.svg`
- Dimensions: 280×60 viewport
- Icon: Teal circle with dual wave motif (income smoothing visualization)
- Wordmark: "Flow" in teal + "Budget" in charcoal
- Tagline: "Smooth your income. Own your cash flow."

### Icon Only
- File: `logo-icon.svg`
- Dimensions: 64×64 viewport
- Teal circle with wave motif
- Use for: avatars, favicons at larger sizes, app icons

## Favicons
- `favicon-32.svg` — 32×32, simplified wave on teal circle
- `favicon-192.svg` — 192×192, rounded rect with wave motif

### Production Notes
To generate PNG favicons from SVG:
```bash
# Using Inkscape or rsvg-convert
rsvg-convert -w 32 -h 32 favicon-32.svg > favicon-32.png
rsvg-convert -w 192 -h 192 favicon-192.svg > favicon-192.png
```

## Social Media Kit (Open Graph 1200×630)
All templates are HTML/CSS files — screenshot at 1200×630 for production use.

### Homepage Share (`og-homepage.html`)
- Dark teal gradient background
- Headline: "Smooth Your Income. Own Your Cash Flow."
- Mock bar chart showing income smoothing
- URL badge at bottom

### Income Smoothing Feature (`og-income-smoothing.html`)
- Light background (Snow)
- Side-by-side comparison: "Without Smoothing" vs "With Smoothing"
- Red panel (chaotic bars) → Green panel (consistent bars)
- Clear value proposition visualization

### Pricing Comparison (`og-pricing.html`)
- Light gradient background
- Three pricing tiers: Free ($0), Pro ($9), Business ($29)
- Pro tier highlighted as "Most Popular"
- Feature lists for each tier

### Screenshot Instructions
Open each HTML file in a browser at exactly 1200×630 viewport:
```bash
# Using Playwright or Puppeteer
npx playwright screenshot --viewport-size=1200,630 og-homepage.html og-homepage.png
npx playwright screenshot --viewport-size=1200,630 og-income-smoothing.html og-income-smoothing.png
npx playwright screenshot --viewport-size=1200,630 og-pricing.html og-pricing.png
```

## Design Motif
The core visual motif is the **dual wave** — representing:
1. Irregular income (chaotic wave) being transformed into
2. Smooth, predictable cash flow (steady wave)

This motif appears in the logo, favicon, and throughout the social media kit.
