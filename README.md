
# Services (Videos + Scroll Slideshow)

## What changed
- **Services page (`services.html`)** now has:
  - Two video embeds (the second is set to your link: https://www.youtube.com/watch?v=fQBHS2ZIFLU)
  - A **scroll-reveal slideshow** under "Photography & Design"

## Add your photos (~12)
1. Upload images to `assets/img/gallery/` (JPG/PNG/WebP, ~1200px wide, 150–300 KB).
2. Edit `assets/gallery.json` and list them like:
```json
[
  {"src":"assets/img/gallery/photo1.jpg","alt":"First look","caption":"First look at golden hour"},
  {"src":"assets/img/gallery/photo2.jpg","alt":"Aisle walk"},
  {"src":"assets/img/gallery/photo3.jpg","alt":"Portraits"}
]
```
3. Save/commit. As you scroll the Services page, each image fades in.

## Replace videos
- In `services.html`, replace `VIDEO_1` with your first film's YouTube ID (the bit after `v=`). The second video already uses `fQBHS2ZIFLU`.

## Performance tips
- Compress images with Squoosh.app.
- You can add as many slides as you want; they lazy-load and reveal as the user scrolls.

