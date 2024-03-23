initPhotoUploads();
initMediaCardListeners();
initAddAlbums();
initUploadMedia();
initDatePickers();
initQuillEditors();
initEditCopy();

// Добавление альбома в разметку
function renderAlbum(html) {
  const container = document.querySelector('.edit-media__albums');

  container.insertAdjacentHTML('beforeend', html);
}

// Добавление медиа в разметку
function renderMedia(html) {
  const container = document.querySelector('.edit-media__items');

  container.insertAdjacentHTML('beforeend', html);
}

// Добавление медиа альбома в разметку
function renderAlbumMedia(html) {
  const container = document.querySelector('.modal-edit-album .modal-album__items--uploaded');
  console.log(container)
  container.insertAdjacentHTML('beforeend', html);
}

// Загрузка нового медиа и добавление в разметку
function initUploadMedia() {
  const btn = document.querySelector('.edit-media__btn');

  btn.addEventListener('change', (e) => {
    // Проверяем, что был выбран файл
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Проверяем тип загруженного файла
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        // Считываем выбранный файл в формате Data URL
        reader.onload = function (e) {
          const src = e.target.result;
          const html = `
            <li class="edit-media__item media-card">
                <div class="media-card__media">
                  <img src="${src}" width="148" height="148" alt="" />
                </div>
                <div class="media-card__pin"></div>
                <div class="media-card__footer">
                  <button class="media-card__footer-btn media-card__delete" type="button">Удалить</button>
                </div>
              </li>`;

          renderMedia(html);
        }
        reader.readAsDataURL(file);
      } else {
        // Если загруженный файл не является изображением, ничего не делаем
        // Можно вывести сообщение об ошибке или просто игнорировать
        console.error('Выбранный файл не является изображением.');
        // Сбросить значение input type="file"
        btn.value = '';
      }
    }
  })
}

// Создание нового альбома
function initAddAlbums() {
  const modal = document.querySelector('.modal-album');

  if (!modal) return;

  const buttons = modal.querySelectorAll('.modal-album__btn');
  const startPage = 1;

  buttons.forEach(btn => {
    const pageId = btn.dataset.pageTo;

    if (!pageId) return;

    btn.addEventListener('click', (e) => goToPage(pageId));
  })

  // Начальная валидация страницы
  validateAddAlbumPage();
  initUploadMedia();

  function goToPage(id) {
    const page = modal.querySelector(`.modal-album__page[data-page="${id}"]`);
    const prevPage = modal.querySelector('.modal-album__page.is-active');

    prevPage?.classList.remove('is-active');
    page.classList.add('is-active');
  }

  // Будущая валидация текущей страницы при создании нового альбома 
  function validateAddAlbumPage(page) {
    // --- Временная простая валидация ---		
    const modal = document.querySelectorAll('.modal-album');
    const submitBtn = document.querySelector('.modal-album__submit');
    const nameInput = document.querySelector('.modal-album__input');

    if (!modal) return;

    validateName(nameInput.value);

    nameInput.addEventListener('input', (e) => validateName(e.target.value));
    submitBtn.addEventListener('click', addAlbum)

    function validateName(value) {
      if (value.trim().length > 0) {
        submitBtn.disabled = false;
      } else {
        submitBtn.disabled = true;
      }
    }

    function addAlbum() {
      const preview = document.querySelector('.modal-album__items--preview .media-card.is-active .media-card__media img');
      const images = document.querySelectorAll('.modal-album__items--uploaded .media-card.is-active .media-card__media img');

      const imagesSources = [];
      const imagesLimit = 2;
      let count = 0;

      images.forEach(img => {
        if (!img.classList.contains('is-active') && count < imagesLimit) {
          imagesSources.push(img.src);
          count++;
        }
      })

      const html = `
      <li class="edit-media__album album-card">
        <div class="album-card__media">
          <img src="${preview.src}" width="160" height="160" alt="" />
          <img src="${imagesSources[0]}" width="150" height="150" alt="" />
          <img src="${imagesSources[1]}" width="140" height="140" alt="" />
        </div>
        <p class="album-card__name">${nameInput.value}</p>
      </li>
    `;
      renderAlbum(html);
      resetAlbumModal();
    }

    function resetAlbumModal() {
      const previewCard = document.querySelector('.modal-album__items--preview .media-card.is-active');
      previewCard?.classList.remove('is-active');
      const startPreviewCard = document.querySelector('.modal-album__items--preview .media-card');
      startPreviewCard?.classList.add('is-active');

      const cards = document.querySelectorAll('.modal-album__items--uploaded .media-card.is-active');

      cards.forEach(card => {
        card.classList.remove('is-active');
      })

      goToPage(startPage);
    }
  }

  
// Загрузка нового медиа в альбом и добавление в разметку
function initUploadMedia() {
  const section = document.querySelector('.modal-album__new');
  const btn = document.querySelector('.modal-album__add');

  btn.addEventListener('change', (e) => {
    // Проверяем, что был выбран файл
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Проверяем тип загруженного файла
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        // Считываем выбранный файл в формате Data URL
        reader.onload = function (e) {
          const src = e.target.result;
          const html = `
            <li class="modal-album__item media-card">
              <div class="media-card__media">
                <img src="${src}" width="148" height="148" alt="" />
              </div>
              <div class="media-card__checked"></div>
            </li>`;

          renderAlbumMedia(html);
          section.classList.add('is-active');
        }
        reader.readAsDataURL(file);
      } else {
        // Если загруженный файл не является изображением, ничего не делаем
        // Можно вывести сообщение об ошибке или просто игнорировать
        console.error('Выбранный файл не является изображением.');
        // Сбросить значение input type="file"
        btn.value = '';
      }
    }
  })
}
}

// Переключение состояний медиа
function initMediaCardListeners() {
  document.body.addEventListener('click', onMediaCardClick);
  document.body.addEventListener('click', onAlbumCardClick);

  function onAlbumCardClick(e) {
    const card = e.target.closest('.album-card');

    if (!card) return;

    window.SimpleModal.open('modal-edit-album');
  }

  function onMediaCardClick(e) {
    const deleteBtn = e.target.closest('.media-card__delete');
    const removeBtn = e.target.closest('.media-card__remove');
    const card = e.target.closest('.media-card');

    if (!card) return;

    if (card.closest('.one-active')) selectOneCard();
    else selectCard();

    // Когда можно выбрать несколько элементов
    function selectCard() {
      if (deleteBtn) {
        card.remove();
      } else if (card) {
        card.classList.toggle('is-active');
      }
    }

    // Когда можно выбрать только один элемент
    function selectOneCard() {
      const items = card.parentNode.querySelectorAll('.media-card');

      // Клик на кнопку удаления
      if (removeBtn) {
        // Если удаляем активный элемент, после удаления делаем активным первый в списке  
        if (card.classList.contains('is-active')) {
          card.classList.remove('is-active');
          items[0].classList.add('is-active');
        }

        card.remove();

        return;
        // Клик на всю карточку
      } else {
        items.forEach(item => {
          if (item == card) item.classList.add('is-active'); // Всегда оставляем один активный элемент
          else item.classList.remove('is-active');
        })
      }
    }
  }

}

// Загрузка фото и фона профиля
function initPhotoUploads() {
  const wrappers = document.querySelectorAll('.edit-img');

  wrappers.forEach(item => {
    const changeInput = item.querySelector('.edit-img__btn--change input');
    const deleteBtn = item.querySelector('.edit-img__btn--delete');
    const img = item.querySelector('.edit-img__img img');
    // Сохраняем начальное значение src изображения
    const defaultSrc = img.getAttribute('src');

    changeInput.addEventListener('change', (e) => {
      // Проверяем, что был выбран файл
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        // Проверяем тип загруженного файла
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          // Считываем выбранный файл в формате Data URL
          reader.onload = function (e) {
            // Устанавливаем новое значение src изображения
            img.setAttribute('src', e.target.result);
          }
          reader.readAsDataURL(file);
        } else {
          // Если загруженный файл не является изображением, ничего не делаем
          // Можно вывести сообщение об ошибке или просто игнорировать
          console.error('Выбранный файл не является изображением.');
          // Сбросить значение input type="file"
          changeInput.value = '';
        }
      }
    });

    deleteBtn.addEventListener('click', () => {
      // При клике на кнопку "Удалить" возвращаем изображение к начальному значению
      img.setAttribute('src', defaultSrc);
      changeInput.value = '';
    });
  });
}

// Кастомный input для выбора даты
function initDatePickers() {
  const datepickers = document.querySelectorAll('.form-datepicker__input');

  datepickers.forEach((item) => {
    new AirDatepicker(item, {
      // position: 'right top',
      prevHtml: `<svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.728 12.5L12.668 11.56L9.61464 8.5L12.668 5.44L11.728 4.5L7.72797 8.5L11.728 12.5Z" fill="#575965"/>
      <path d="M7.33344 12.5L8.27344 11.56L5.2201 8.5L8.27344 5.44L7.33344 4.5L3.33344 8.5L7.33344 12.5Z" fill="#575965"/>
      </svg>
      `,
      nextHtml: `<svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.27203 4.5L3.33203 5.44L6.38536 8.5L3.33203 11.56L4.27203 12.5L8.27203 8.5L4.27203 4.5Z" fill="#575965"/>
      <path d="M8.66656 4.5L7.72656 5.44L10.7799 8.5L7.72656 11.56L8.66656 12.5L12.6666 8.5L8.66656 4.5Z" fill="#575965"/>
      </svg>
      `,
    });
  });
}

// Копирование ссылки в редактировании профиля
function initEditCopy() {
  const copyBtn = document.querySelector('.edit__copy');
  const link = document.querySelector('.edit__link');

  if (!copyBtn || !link) return;

  copyBtn.addEventListener('click', (e) => {
    copyBtn.classList.add('is-copied');

    // Создаем временный элемент textarea для копирования текста
    var tempTextarea = document.createElement('textarea');
    tempTextarea.value = link.getAttribute('href');
    document.body.appendChild(tempTextarea);

    // Выделяем текст в элементе textarea
    tempTextarea.select();
    tempTextarea.setSelectionRange(0, 99999); /* Для мобильных устройств */

    // Копируем текст в буфер обмена
    document.execCommand('copy');

    // Удаляем временный элемент
    document.body.removeChild(tempTextarea);

    setTimeout(() => {
      copyBtn.classList.remove('is-copied');
    }, 2000);
  });
}

// Текстовые редакторы WYSIWYG
function initQuillEditors() {
  const editors = document.querySelectorAll('.quill-container');

  if (editors.length <= 0) return;

  const toolbarOptions = [
    ['bold', 'italic', 'underline'], // основные стили текста
    [{ align: [] }], // выравнивание
    [{ list: 'ordered' }, { list: 'bullet' }], // списки
    ['clean'], // пользовательская иконка для очистки форматирования
  ];
  var icons = Quill.import('ui/icons');
  icons['clean'] = `
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24.6138 11.0389C25.2907 10.3619 25.2907 9.34656 24.6138 8.66964L19.8753 3.84656C19.1984 3.16964 18.183 3.16964 17.5061 3.84656L5.15222 16.1158C4.4753 16.7927 4.4753 17.8081 5.15222 18.485L8.36761 21.7004H13.9522L24.6138 11.0389Z" stroke="#575965" stroke-width="1.69231" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.5 9.85352L18.6077 16.9612" stroke="#575965" stroke-width="1.69231" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.15234 25H23.7677" stroke="#575965" stroke-width="1.69231" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;
  editors.forEach((item) => {
    const quill = new Quill(item, {
      theme: 'snow',
      placeholder: 'Введите описание',
      modules: {
        toolbar: toolbarOptions,
      },
    });
  });
}