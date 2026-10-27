# Acorn Accounting website

This is a static, responsive implementation of the supplied mockup. Open `index.html` in a browser or serve this directory with any static file server.

After changing the root source files, run `powershell -ExecutionPolicy Bypass -File .\build.ps1` to refresh `dist/`, the folder used for the hosted version.

## Change either photograph

The complete hero artwork is `assets/hero-composite.png`; the complete tree artwork is `assets/about-composite.png`. Each is displayed as one image over a replaceable photo layer. The matching `*-window-mask.png` asset makes only the photo area transparent in the upper layer, preserving the exact leaves, cream gaps, and curved edge.

In `index.html`, change the `href` on `<image class="hero-photo">` or `<image class="about-photo">`. They initially point to their composite images so the default site shows the full mockup-inspired artwork. You can use `assets/hero-candidate.jpg` and `assets/oak-canopy.jpg` as replacement examples.

For a replacement with a different aspect ratio, adjust that photo image's `x`, `y`, `width`, and `height` values to choose its crop. Leave the composite image and mask references in place.

## Stock image credits

- Optional hero replacement: [Polina on Pexels](https://www.pexels.com/photo/laptop-beside-white-ceramic-mug-and-pot-on-table-8101964/)
- Optional tree replacement: [Peter Jochim on Pexels](https://www.pexels.com/photo/majestic-forest-canopy-view-with-sunlight-37272050/)
- Contact background: [Ecem Harmankaya on Pexels](https://www.pexels.com/photo/majestic-oak-tree-in-golden-hour-sunset-36864405/)

The contact form opens the visitor's email application with the submitted details. It does not store or transmit enquiries through a backend.
