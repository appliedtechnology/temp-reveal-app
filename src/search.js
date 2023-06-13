import { initEventHandlers } from './scripts/eventHandlers';
import { getSlides, renderSlides } from './scripts/slides';
import { isCurrentUrlPrintUrl } from './scripts/utils';
import './styles/slides.scss';
import { Select, initTE } from "tw-elements";
initTE({ Select });

const slideContainer = document.querySelector('#reveal .reveal .slides');

/**
 * We can't optimize this to run a loop or something because as soon as we use a variable
 * with require.context(), we get run-time errors. This needs thorough investigation if
 * we really need that optimization.
 */
const folderContexts = [
  require.context('../../jsfs/', true, /^\/?([^/]+\/?){0,3}(js|md)$/),
  require.context('../../jfs/', true, /^\/?([^/]+\/?){0,3}(js|md)$/),
  require.context('../../dnfs/', true, /^\/?([^/]+\/?){0,3}(js|md)$/),
  require.context('../../shared/', true, /^\/?([^/]+\/?){0,3}(js|md)$/),
];

const folders = ['jsfs', 'jfs', 'dnfs', 'shared'];

const createCSSResource = (href = '') => {
  const theme = document.createElement('link');
  theme.rel = 'stylesheet';
  theme.type = 'text/css';
  theme.href = href;
  return theme;
};


let slides = [...folderContexts.map((context, index) => getSlides(context, folders[index]))].flat();

const main = async () => {
  await renderSlides(slides, slideContainer);

  const theme = createCSSResource(
    isCurrentUrlPrintUrl()
      ? 'node_modules/reveal.js/css/print/pdf.css'
      : 'node_modules/reveal.js/css/print/paper.css'
  );
  document.getElementsByTagName('head')[0].appendChild(theme);

  // eslint-disable-next-line no-undef
  Reveal.initialize({
    controls: true,
    progress: true,
    history: true,
    center: true,
    transition: 'slide', // none/fade/slide/convex/concave/zoom
    slideNumber: false, // 'c/t',
    pdfSeparateFragments: false,
    plugins: [RevealMarkdown],
  });

  initEventHandlers();
};

main();
