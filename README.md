
# Hutzell Creative Co. — Portfolio Site

Pastel green + white, responsive, and deployable on **GitHub Pages**.

## Quick Start
1. Create a new GitHub repo (e.g., `hutzell-creative-site`).
2. Upload these files (or push via Git).
3. In GitHub, go to **Settings → Pages**:
   - Source: **Deploy from a branch**
   - Branch: **main** (root)
4. Your site appears at `https://YOUR-USER.github.io/hutzell-creative-site/` within ~1–2 minutes.
5. Optionally, add a custom domain in **Settings → Pages → Custom domain**.

## Contact Form (sends to your email)
This template uses **Formspree** which works on GitHub Pages.

- Sign up at formspree.io with **hutzellcreativeco@gmail.com**.
- Create a new form to get an endpoint like: `https://formspree.io/f/abcdwxyz`.
- Open `contact.html` and replace `YOUR_FORM_ID` with your actual Formspree ID.
- Submit once from the live site and confirm the address if Formspree asks.

If you don't want to use Formspree, you can swap in EmailJS or Netlify Forms (requires Netlify). The form also falls back to a `mailto:` compose if the network call fails.

## Portfolio
- Edit `assets/portfolio.json` to add items.
- For **videography**, use an embeddable link (YouTube or Vimeo): e.g. `https://www.youtube.com/embed/VIDEO_ID`.
- For **photos/design**, add files into `assets/img/` and reference them by path.

Example entry:
```json
{ "type":"photo", "title":"Studio flatlay", "src":"assets/img/my-shot.jpg" }
```

## Colors & Typography
- Pastel green theme in `assets/css/style.css` (variables at the top).
- Fonts: Playfair Display (headings) + Inter (body).

## Navigation
- Pages: Home, Portfolio, About, Inquiry.
- Update navigation in the `base_head` blocks if you add more pages.

## Tips
- To make the site root (no folder in the URL), rename the repo to `YOUR-USER.github.io`.
- For a custom domain (`.com`), point DNS to GitHub Pages and set it under **Settings → Pages**.
