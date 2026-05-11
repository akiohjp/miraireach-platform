# Skill Name: Multi-Tenant SaaS Admin & Client Portal Generator
# Description: Generates a complete backend management dashboard and client self-service portal (Next.js + Supabase) for the review collection app. Supports multilingual stores (English / Japanese / Arabic).

## 1. Database & Storage Schema (Supabase)

### Table `stores`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID, PK | `gen_random_uuid()` |
| `owner_id` | UUID, FK → `auth.users` | `ON DELETE CASCADE` |
| `store_name` | JSONB | Localized. Shape: `{"en":"...","ja":"...","ar":"..."}` |
| `greeting_text` | JSONB | Localized. Same shape as `store_name`. |
| `description` | JSONB | Localized. Same shape as `store_name`. |
| `default_language` | text | ISO 639-1. Allowed values: `en`, `ja`, `ar`. Drives RTL detection. |
| `google_review_url` | text | Direct link to the GBP review page. |
| `keywords` | JSONB array | 20+ MEO-focused English keywords. |
| `brand_color` | text | Hex code, e.g. `#FF5733`. |
| `logo_url` | text \| null | Public URL from Supabase Storage. |
| `created_at` | timestamptz | Auto-set. |
| `updated_at` | timestamptz | Auto-updated via trigger. |

**Multilingual field contract**
- All three JSONB text fields (`store_name`, `greeting_text`, `description`) MUST be `jsonb_typeof = 'object'` — enforced by DB CHECK constraint.
- `default_language` is the authoritative fallback when a requested locale is missing.
- Frontend resolution order: `requested locale → default_language → first available key → ""`.
- `default_language = "ar"` signals the UI to render `dir="rtl"`.

**TypeScript helpers (from `types/database.ts`)**
- `SupportedLocale = "en" | "ja" | "ar"`
- `LocalizedText = Partial<Record<SupportedLocale, string>>`
- `getLocalizedText(field, locale, defaultLocale)` — resolves with fallback chain.
- `isRtlLocale(locale)` — returns `true` for `"ar"`.

### Storage
- Bucket: **`store-logos`** (public read, owner-scoped write at `<owner_id>/*`).

---

## 2. Authentication & Roles (Supabase Auth)

- **Login**: Email / Password.
- **Super Admin**: `app_metadata.role = "super_admin"` — full access to all stores via RLS policy `super_admin_all`. Set with `supabase.auth.admin.updateUserById`.
- **Client Owner**: Can only SELECT / INSERT / UPDATE / DELETE the row where `owner_id = auth.uid()`.

---

## 3. Client Portal UI (Self-Service Dashboard)

A simplified, mobile-friendly dashboard for busy store owners.

**Features**
- **Logo Upload**: Drag-and-drop or file picker → uploads to `store-logos/<owner_id>/logo`.
- **Brand Color Picker**: Updates `brand_color` hex.
- **Keyword Manager**: Tag-input to add / remove MEO keywords (stored in `keywords` JSONB array).
- **Multilingual Text Editor**: Tabbed input (EN / JA / AR) for `store_name`, `greeting_text`, `description`. Active tab set by `default_language`.
- **Language Selector**: Dropdown to set `default_language`; switching to `ar` previews RTL layout.
- **QR Code Download**: `qrcode.react` — links to `app/store/[id]`.

---

## 4. Frontend Dynamic Integration

The customer-facing page (`app/store/[id]/page.tsx`) must:

1. Fetch the store row from Supabase.
2. Detect the visitor's locale (browser `Accept-Language` or explicit query param `?lang=`).
3. Call `getLocalizedText(store.store_name, locale, store.default_language)` for all displayed text.
4. Set `<html dir={isRtlLocale(locale) ? "rtl" : "ltr"}>` dynamically.
5. Apply `brand_color` as a CSS custom property (`--brand-color`).
6. Display `logo_url` if present; fall back to a text placeholder.
7. Pass `keywords` to the Zero-API review template generator (from `review_collection_app_skill.md`).
