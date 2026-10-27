# Acorn Accounting website

This is a static, responsive implementation of the supplied mockup. Open `index.html` in a browser or serve this directory with any static file server.

After changing the root source files, run `powershell -ExecutionPolicy Bypass -File .\build.ps1` to refresh `dist/`, the folder used for the hosted version.

## Change the hero photograph

In `index.html`, change the `href` on the `<image class="hero-photo">` element. The curved photo mask and leaf assets stay in place. The current stock image is `assets/hero-candidate.jpg`.

The botanical artwork is stored as transparent, high-resolution PNG assets in `assets/hero-leaves-generated.png`, `assets/hero-lower-leaves-generated.png`, and `assets/about-leaves-generated.png`. The hero and tree photographs remain separate from these assets, so changing a photograph preserves its curved crop and leaf treatment.

For a replacement with a different aspect ratio, adjust the image's `x`, `y`, `width`, and `height` values to choose the crop. Keep the `clip-path="url(#hero-photo-shape)"` attribute.

## Stock image credits

- Hero: [Polina on Pexels](https://www.pexels.com/photo/laptop-beside-white-ceramic-mug-and-pot-on-table-8101964/)
- About tree: [Peter Jochim on Pexels](https://www.pexels.com/photo/majestic-forest-canopy-view-with-sunlight-37272050/)
- Contact background: [Ecem Harmankaya on Pexels](https://www.pexels.com/photo/majestic-oak-tree-in-golden-hour-sunset-36864405/)

The contact form opens the visitor's email application with the submitted details. It does not store or transmit enquiries through a backend.
