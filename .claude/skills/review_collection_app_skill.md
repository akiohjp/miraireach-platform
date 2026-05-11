# Skill Name: Review Collection App Generator (English Only / Zero-API Model)
# Description: Generates a zero-cost, purely frontend review collection web app (Next.js + Tailwind CSS) for clients. All UI and outputs MUST be in English.

## 1. Inputs (Client Configuration)
- `Store_Name`: Name of the business.
- `Greeting_Text`: Short welcome message.
- `Keywords`: Array of 20+ MEO-focused English keywords. This allows the client to strategically cover a wide range of search terms (e.g., specific menu items, service quality, atmosphere).
- `GBP_Review_URL`: The direct link to the Google Business Profile review page.

## 2. Output Requirements
- A single-page application prototype (React/Next.js) using Tailwind CSS.
- Strictly English UI. No Japanese or other languages.

## 3. Core Logic & UI Flow (Cost-Free Architecture)
1. **Step 1 (Rating)**: 1-5 Star Selection.
   - 4-5 Stars -> Proceed to Step 2.
   - 1-3 Stars -> Show internal feedback text area (do NOT redirect to Google).
2. **Step 2 (Keywords)**: 
   - Display the 20+ `Keywords` as tappable "pill" shaped buttons (tags).
   - **UI Requirement**: Use a flex-wrap layout or a clean scrollable container so that displaying 20+ buttons on a mobile screen does not look cluttered.
   - Users can select multiple keywords. Selected state should be clearly visible (e.g., color change).
3. **Step 3 (Advanced Dynamic Template Generation - NO API)**:
   - Do NOT use external APIs. Generate text purely on the client side to keep costs at zero.
   - **Crucial SEO/MEO Requirement**: To avoid Google's spam filters, the generated reviews MUST NOT look repetitive or formulaic. 
   - **Implementation**: Build a "Sentence Assembler" logic. Create separate arrays for:
     1. `Openers` (e.g., "Had an amazing time...", "Just visited...", "Absolutely loved...")
     2. `Keyword Connectors` (Varied phrasing depending on if 1, 2, or 3+ keywords are selected. e.g., "The [KW] was fantastic", "I was really impressed by the [KW]")
     3. `Closers` (e.g., "Will definitely be back!", "Highly recommended.", "Can't wait to return.")
   - Assemble these parts randomly using `Math.random()` so that even if the same keywords are selected multiple times, the resulting text structure, length, and wording are completely different each time.
   4. **Step 4 (Submission & Optional Translation)**:
   - Provide a text area displaying the generated text (editable by the user).
   - "Copy Review" button (copies to clipboard and shows "Copied!" toast).
   - **"Translate via Google" button (Optional)**: Opens a new tab to Google Translate (`https://translate.google.com/?sl=en&tl=auto&text=[Generated_Text]`) so users can easily translate the English template into Arabic or their native language using their own device/account.
   - "Post on Google" button (redirects to `GBP_Review_URL` in a new tab).

