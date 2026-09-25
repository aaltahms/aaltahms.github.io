# Aymen Al-Tahmschi — portfolio

Static HTML/CSS portfolio for GitHub Pages at aaltahms.github.io. No build step, tracking or third-party fonts. Optional vanilla JavaScript adds a pointer-responsive signal field and glass-card highlights; navigation, content and downloads work without JavaScript.

Run locally with `python3 -m http.server 4325 --directory portfolio` from the parent workspace. Open http://localhost:4325.

Content reflects verified project status in September 2026. CPU restoration is explicitly separate from original coursework. Resume downloads contain professional contact information supplied for applications. Source screenshots are from the already published ResolveAI repository.

Publish the files at the root of a public `aaltahms.github.io` repository and enable GitHub Pages from main / root. Keep the `.nojekyll` file. No deployment has occurred merely by creating these local files.

## Motion design

Motion follows the pointer only on fine-pointer devices, stops when the tab is hidden, and settles instead of running a continuous idle loop. The Motion toggle disables effects. The operating-system reduced-motion preference takes priority. Glass styling uses CSS backdrop blur and layered borders/shadows, with opaque fallbacks. This is a custom web interpretation, not Apple Liquid Glass framework integration.
