import { Select } from "tw-elements";
export const createSlideTree = (files, depth = 0) => {
  const result = [];
  const folders = {};

  files.forEach((file) => {
    const paths = file.split('/').splice(depth);
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

export const slideMap = (files, fn) =>
  files.map((file) => (Array.isArray(file) ? slideMap(file, fn) : fn(file)));

export const getSlideName = (file) => {
  let fileName = file;
  try {
    fileName = file.match(/([\w.\s-]+?)(?:\.\w+)?$/)[1];
  } catch (err) {
    console.log('error getting file name', file);
  }

  return fileName;
};

export const getSlides = (context, folder) => {
  if (!context) {
    throw new Error('Slides context is required');
  }

  const files = context.keys();

  const fileTree = createSlideTree(files, 1);
  const slideList = slideMap(fileTree, (file) => {
    const slide = context(file);
    const name = getSlideName(file);
    const content = slide.default ? slide.default : slide;
    const slideIdRegex = /<!--\s*{\s*id\s*=\s*"([^"]*)"\s*}\s*-->/;
    let match = content.match(slideIdRegex);
    let id = match ? match[1] : null;
    return {
      name: `${folder}/${name}`,
      content,
      id,
      uuid: self.crypto.randomUUID()
    };
  });

  return slideList;
};

const getSearchSlideVal = ({onChange}) => {
  const selectEl = document.getElementById('searchInputEl');
  const select = Select.getInstance(selectEl);
  select.open();
  const submitHandler = () => {
    onChange(select.value)
  }
  const submitBtn = document.querySelector('#selectSlidesButton');
  submitBtn.addEventListener('click', submitHandler.bind(submitBtn))
}

const getSearchedSlide = async (slidesClone) => {
  createSlidesListForSearch(slidesClone)
  return new Promise(resolve => {
    getSearchSlideVal({
      onChange: (slidesSelectedIds) => {
        const selectEl = document.getElementById('searchInputEl');
        const select = Select.getInstance(selectEl);
        console.log(select);
        if (!slidesSelectedIds.length) {
          return;
        }
        resolve(slidesClone.filter(slide => {
          return slidesSelectedIds.includes(slide.uuid);
        }));
      }
      
    });
  })
}

const showSearchContainer = () => {
  document.querySelector('#searchContainer').style.display="flex";
}

const hideSearchContainer = () => {
  document.querySelector('#searchContainer').style.display="none";
}

export const renderSlides = async (slides, container) => {
  container.querySelectorAll('.slides section').forEach((el) => el.remove());
  const href = location.href.split('#');
  let slidesClone = [...slides];
  if (!href[1]) {
    showSearchContainer();
    slidesClone = await getSearchedSlide(slidesClone);
    localStorage.setItem('slides-cache', JSON.stringify(slidesClone));
  } else {
    const cachedSlidesStr = localStorage.getItem('slides-cache');
    if (cachedSlidesStr) {
      slidesClone = JSON.parse(cachedSlidesStr);
    }
  }
  hideSearchContainer();
  createSlides(slidesClone, container);
};

const createSlidesListForSearch = (slides) => {
  const slidesListContainer = document.querySelector('#searchInputEl');
  slidesListContainer.querySelectorAll('option').forEach(el => el.remove());
  slides.forEach((slide) => {
    const option = document.createElement('OPTION');
    option.value = slide.uuid;
    option.setAttribute('data-uuid', slide.uuid);
    option.textContent = slide.name;
    slidesListContainer.append(option)
  })
}

export const createSlides = (slides, container) => {
  return slides.map((slide) => {
    const section = document.createElement('section');
    container.appendChild(section);
    if (typeof slide.content !== 'string') {
      return;
    }
    section.innerHTML = `<script type="text/template">${slide.content}</script>`;
    section.setAttribute('id', slide.name);
    section.setAttribute('data-markdown', '');
    section.setAttribute('data-separator-vertical', '^\n---\n$');
    section.setAttribute('data-separator-notes', '^Notes:');
    section.setAttribute('data-element-attributes', '{s*?([^}]+?)}');
    return slide;
  });
};
