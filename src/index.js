import "./styles/slides.scss";

const createSlideTree = (files, depth = 0) => {
  const result = [];
  const folders = {};

  files.forEach((file) => {
    const paths = file.split("/").splice(depth);
    const path = paths.shift();

    if (paths.length) {
      if (!folders[path]) {
        folders[path] = [];
        result.push(folders[path]);
      }
      folders[path].push(file);
    } else {
      result.push(file);
    }
  });

  Object.keys(folders).forEach((key) => {
    const folderFiles = folders[key];
    const filesNew = createSlideTree(folderFiles, depth + 1);
    folderFiles.splice(0, folderFiles.length);
    Array.prototype.push.apply(folderFiles, filesNew);
  });

  return result;
};

const slideMap = (files, fn) =>
  files.map((file) => (Array.isArray(file) ? slideMap(file, fn) : fn(file)));

const getSlideName = (file) => {
  const fileName = file.split("/").pop();

  return fileName.substring(fileName.indexOf("-") + 1, fileName.indexOf("."));
};

const createCSSResource = (href = '') => {
  const theme = document.createElement("link");
  theme.rel = "stylesheet";
  theme.type = "text/css";
  theme.href = href;
  return theme
}

const getSlides = () => {
  const context = require.context(
    "./slides/",
    true,
    /^\/?([^/]+\/?){0,3}(js|md)$/
  );

  console.log({ context });
  const files = context.keys();

  const fileTree = createSlideTree(files, 1);
  const slideList = slideMap(fileTree, (file) => {
    const slide = context(file);
    const name = getSlideName(file);

    return {
      name,
      content: slide.default ? slide.default : slide,
    };
  });

  return slideList;
};

const slideContainer = document.querySelector("#reveal .reveal .slides");
const slides = getSlides();
// eslint-disable-next-line no-console
// console.log(slides);

slides.forEach((slide) => {
  const section = document.createElement("section");
  slideContainer.appendChild(section);
  if (typeof slide.content === "string") {
    section.innerHTML = `<script type="text/template">${slide.content}</script>`;
    section.setAttribute("id", slide.name);
    section.setAttribute("data-markdown", "");
    // section.setAttribute('data-separator', '^\n===\n$');
    section.setAttribute("data-separator-vertical", "^\n---\n$");
    section.setAttribute("data-separator-notes", "^Notes:");
    section.setAttribute("data-element-attributes", "{s*?([^}]+?)}");
  } /* else if (Array.isArray(slide)) {
    slide.forEach(subSlide => {
      const subSection = document.createElement('section');
      section.appendChild(subSection);
      subSection.innerHTML = `<script type="text/template">${subSlide.content}</script>`;
      subSection.setAttribute('id', subSlide.name);
      subSection.setAttribute('data-markdown', '');
      subSection.setAttribute('data-separator', '^\n---\n$');
      subSection.setAttribute('data-separator-notes', '^Notes:');
      subSection.setAttribute('data-element-attributes', '{\s*?([^}]+?)}');
    });
  } */
});

const isCurrentUrlPrintUrl = () => window.location.search.match(/print-pdf/gi);

const theme = createCSSResource(isCurrentUrlPrintUrl()
? "node_modules/reveal.js/css/print/pdf.css"
: "node_modules/reveal.js/css/print/paper.css");
document.getElementsByTagName("head")[0].appendChild(theme);

// eslint-disable-next-line no-undef
Reveal.initialize({
  controls: true,
  progress: true,
  history: true,
  center: true,
  transition: "slide", // none/fade/slide/convex/concave/zoom
  slideNumber: false, // 'c/t',
  pdfSeparateFragments: false,
  plugins: [RevealMarkdown]
});

window.onload = function onload() {
  if (isCurrentUrlPrintUrl()) {
    window.print();
  }
};

window.onafterprint = function () {
  window.close();
}

const openTabForPrint = () => {
  const newUrl = `${window.location.origin}?print-pdf/${window.location.hash}`;
  window.open(newUrl, "_blank").focus();
};

document
  .querySelector(".background__salt-logo")
  .addEventListener("click", openTabForPrint);
