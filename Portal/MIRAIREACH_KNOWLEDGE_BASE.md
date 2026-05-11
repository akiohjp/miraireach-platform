# mirAIreach PRESS: Knowledge Base & Design Guidelines

This document serves as the **Source of Truth** for the mirAIreach.PRESS platform. Every AI agent working on this repository must adhere to the following "Golden Rules" to maintain brand integrity and B2B professional quality.

---

## 1. Brand Identity & Visual Rules

### 💎 Logo Absolute Rule
The logo must be consistent across all headers, footers, and internal sections.
- **Design Target**: Mirror the Footer's bold, high-contrast design.
- **Case Sensitivity**: `mirAIreach.PRESS` (mixed case for brand, uppercase for PRESS).
- **Styling**: `font-black` (900 weight), `tracking-tighter`, no extra letter-spacing.
- **Forbidden**: Never use `uppercase` utility on the logo text, as it breaks the `mirAIreach` branding.

### 🔳 The "No Ghost Space" Rule
The platform must maintain a dense, high-premium B2B feel.
- **Sidebar Fix**: Sidebars (Right Column) must use `h-fit` to prevent invisible expansion that creates "huge gaps" below the content.
- **Section Spacing**: Avoid compounding margins. Use targeted `py-16` or `mt-16` for section separation rather than global `space-y` on the `<main>` container.
- **Grid Alignment**: Always use `items-start` on main section grids to ensure columns don't stretch to the height of the tallest neighbor.

### 🖼️ Image Uniqueness Rule
Thumbnails are the face of the B2B content archive.
- **No Duplicates**: Never use the same Unsplash URL for multiple articles.
- **Implementation**: Always use unique seeds (`&sig=${Date.now()}_${id}`) or, preferably, the verified URL pool from `scripts/verified-photo-sync.mjs`.
- **Quality**: Use `auto=format&fit=crop&q=80&w=800` for high-performance, high-quality delivery.

---

## 2. Business Logic & Content Strategy

### 🏗️ The "Foundation First" Story
The platform is designed to convert B2B clients through a specific logical sequence:
1. **AI Identity Aggregation (The Foundation)**: Integrating scattered information into a single high-precision source.
2. **Growth Acceleration (The Accelerator)**: Leveraging that structured identity for targeted AI-driven advertising.
*Constraint*: Never prioritize Ads (Accelerator) over Identity (Foundation). One cannot exist effectively without the other.

---

## 3. Technical Implementation History

### Major Fix Log (Reference for Future Agents)
- **Logo Case Correction**: Standardized `mirAIreach.PRESS` across `Header.tsx`, `Footer.tsx`, and `HomeClient.tsx` (`b7f2be4`).
- **Thumbnail Sync**: Recovered from a "Broken ID" bug by using a pool of 45 verified, live-extracted Unsplash URLs (`3915811`).
- **Layout Gap Resolution**: Eliminated the 400px+ whitespace issue by implementing `h-fit` on sidebar containers and tightening grid alignment (`1d2834d`).
- **Bilingual Handling**: Full RTL support for Arabic using `useLanguage` hook and `dir="rtl"` in content clients.

---

## 4. Operational Guidelines for Agents

- **Verification First**: Never report "completed" without physically checking the code and (if possible) visual rendering.
- **No Hallucination**: Do not fabricate commit IDs or file paths. If a file isn't there, report it.
- **Bilingual Consistency**: Any UI change must be applied to both English and Arabic translations.
