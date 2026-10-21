HCC USER EXPERIENCE PATCH — REVISED: HERO AND REVIEWS RESTORED
October 21, 2026

RESTORATION IN THIS REVISION
- Restored the original moving photo collage behind the hero: same 24 photos, tile dimensions, tilted arrangement, pale overlay, and 60-second linear motion.
- Restored the full-width scrolling review strip: original card widths, padding, shadows, gold stars, type treatment, and 40-second linear motion.
- Made each repeat include its full trailing gap, removing the jump at the loop boundary. Extra offscreen copies prevent blank space on wide screens.
- Pause motion when its section is offscreen or the tab is hidden, preserving the current position. Hover or keyboard focus pauses reviews for reading.
- Respect reduced-motion preferences; reviews stay readable without animation when that preference is enabled.
- This ZIP supersedes the previous ZIP and includes all 11 replacement files. The other changes from the previous patch remain; this correction restores the hero and review animations specifically.

INSTALLATION
1. Back up your current site files or keep your previous Git commit.
2. Extract this ZIP and copy the 11 HTML/CSS/JavaScript files into the root of your existing HCC website repository, replacing the matching files.
3. Keep your existing assets folder, images, fonts, CNAME, sitemap, and other unchanged files. This is a patch, not a standalone copy of the entire website.
4. Commit/upload the replacement files and let your existing hosting deployment finish. No build command or new dependency is required.
5. Hard-refresh the site. HTML references include a new CSS/JavaScript version query to refresh cached assets.

WHAT CHANGED
- Replaced the homepage's long pinned horizontal service sequence with three normal-flow service cards: a row on desktop, a stack on phones.
- Replaced the pinned video sequence with a responsive grid of four film previews. YouTube players are created only after clicking a preview; without JavaScript, links open the original films on YouTube.
- Removed the pinned service/video sections' scroll-time position calculations, scaling, and dark-background transitions; restored the original moving hero/review treatments.
- Repeated the original hero photo set as needed for continuous coverage, with low-priority asynchronous decoding and animation starting after its thumbnails are decoded.
- Added subtle one-time entrances below the initial viewport, with full reduced-motion support and visible keyboard focus.
- Restored continuously scrolling testimonials; duplicate copies are hidden from assistive technology.
- Added actual image dimensions and predeclared landscape spans so photo galleries do not rearrange after images load.
- Kept design gallery dimensions stable and added keyboard navigation, touch swipes, accessible 44px indicator buttons, and a slide counter. All designs remain visible when JavaScript is disabled.
- Cropped tall website screenshots into consistent preview frames.
- Added service shortcuts and service-specific inquiry links that preselect the appropriate form option.
- Added form sending/success/error feedback and duplicate-submit protection while retaining the existing Formspree endpoint and native HTML POST fallback.
- Made the mobile header and form more compact, improved focus/selected states, and added skip-to-content links and main landmarks.
- Consolidated duplicate Google Fonts requests, added local font-display: swap, repaired missing favicon references, and removed surplus gallery closing tags.

ADDITIONAL RESTORATION CHECKS
- Hero and reviews checked at 320, 390, 768, 1440, and 1920 CSS pixels in Chromium.
- Confirmed active movement, original styling values, complete hero/review coverage at loop end, and no horizontal page overflow.
- Compared rendered images immediately before/after the loop boundaries to verify continuous alignment.
- Checked review hover/focus pause, offscreen pause, reduced motion, and JavaScript-disabled reviews.

PREVIOUS PATCH VERIFICATION
- Headless Chromium: all nine HTML pages at 320, 390, 768, and 1440 CSS pixels.
- No horizontal overflow, missing local image assets, duplicate IDs, unbalanced HTML tags, local 404s, or JavaScript exceptions in the checked pages.
- Gallery arrows, indicators, keyboard navigation, synthetic touch swipe events, stable frame dimensions, video creation on click, and service anchor offsets.
- Form service preselection, sending, success, server rejection, network failure, and duplicate-submit protection, using intercepted simulated provider responses. No real inquiries were submitted.
- Reduced motion on load and when the preference changes; JavaScript-disabled gallery, video links, and native form fallback.
- Desktop and phone screenshots inspected locally.

AFTER UPLOAD
- Play each film on the live site and confirm the YouTube thumbnails/players work. Preview failures retain a labeled watch link; playback still depends on the original videos' embedding permissions.
- Send one deliberate inquiry from your live site and confirm receipt in your inbox.
- Check Google Fonts loading and the page feel in Safari/iPhone and Android browsers. External font, thumbnail, and player requests were blocked during local verification; live provider delivery and device-specific scrolling were not end-to-end tested.

ROLLBACK
Restore the previous versions of the 11 replacement files from your backup or previous Git commit.

REPLACEMENT FILES
- about.html
- contact.html
- index.html
- main.js
- portfolio-couples.html
- portfolio-families.html
- portfolio-seniors.html
- portfolio-weddings.html
- portfolio.html
- services.html
- style.css
