// Bundled to scripts/optii-savr-usermanual.js.
import { scrollToTop, initScrollToTopButton } from "../usermanual/scroll-to-top.js";

// scrollToTop must stay on `window`: the "Go to top" button calls it via an
// inline onclick="scrollToTop()" HTML attribute.
window.scrollToTop = scrollToTop;

initScrollToTopButton();
