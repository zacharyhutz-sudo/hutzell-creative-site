HCC USER EXPERIENCE PATCH — October 21, 2026

INSTALLATION
1. Back up your current site files or keep your previous Git commit.
2. Extract this ZIP and copy the 11 HTML/CSS/JavaScript files into the root of your existing HCC website repository, replacing the matching files.
3. Keep your existing assets folder, images, fonts, CNAME, sitemap, and other unchanged files. This is a patch, not a standalone copy of the entire website.
4. Commit/upload the replacement files and let your existing hosting deployment finish. No build command or new dependency is required.
5. Hard-refresh the site. HTML references include a new CSS/JavaScript version query to refresh cached assets.

WHAT CHANGED
- Replaced the homepage's long pinned horizontal service sequence with three normal-flow service cards: a row on desktop, a stack on phones.
- Replaced the pinned video sequence with a responsive grid of four film previews. YouTube players are created only after clicking a preview; without JavaScript, links open the original films on YouTube.
- Removed scroll-time position calculations, scaling, dark-background transitions, and the constantly moving hero/review tracks.
- Reduced the hero collage from 72 image elements to 12, with low-priority asynchronous decoding.
- Added subtle one-time entrances below the initial viewport, with full reduced-motion support and visible keyboard focus.
- Kept testimonials stationary and removed their duplicate copies.
- Added actual image dimensions and predeclared landscape spans so photo galleries do not rearrange after images load.
- Kept design gallery dimensions stable and added keyboard navigation, touch swipes, accessible 44px indicator buttons, and a slide counter. All designs remain visible when JavaScript is disabled.
- Cropped tall website screenshots into consistent preview frames.
- Added service shortcuts and service-specific inquiry links that preselect the appropriate form option.
- Added form sending/success/error feedback and duplicate-submit protection while retaining the existing Formspree endpoint and native HTML POST fallback.
- Made the mobile header and form more compact, improved focus/selected states, and added skip-to-content links and main landmarks.
- Consolidated duplicate Google Fonts requests, added local font-display: swap, repaired missing favicon references, and removed surplus gallery closing tags.

VERIFICATION
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
