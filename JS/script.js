document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector)
  ];

  /* =========================================================
     TAHUN FOOTER
  ========================================================= */
  const year = $('#currentYear');

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  /* =========================================================
     MENU DRAWER
  ========================================================= */
  const menuButton = $('#menuButton');
  const menuDrawer = $('#menuDrawer');
  const menuBackdrop = $('#menuBackdrop');
  const menuClose = $('#menuClose');

  function setMenu(open) {
    if (!menuDrawer || !menuBackdrop) return;

    menuDrawer.classList.toggle('open', open);
    menuBackdrop.hidden = !open;

    menuDrawer.setAttribute(
      'aria-hidden',
      String(!open)
    );

    menuButton?.setAttribute(
      'aria-expanded',
      String(open)
    );

    document.body.classList.toggle(
      'menu-open',
      open
    );
  }

  menuButton?.addEventListener('click', () => {
    const isOpen = menuDrawer?.classList.contains('open');
    setMenu(!isOpen);
  });

  menuClose?.addEventListener('click', () => {
    setMenu(false);
  });

  menuBackdrop?.addEventListener('click', () => {
    setMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenu(false);
    }
  });


  /* =========================================================
     GALERI + FILTER
  ========================================================= */

  const cards = $$('.portal-card');
  const filters = $$('.filter');

  const search = $('#exploreSearch');
  const headerSearch = $('#headerSearch');

  const count = $('#resultCount');
  const empty = $('#exploreEmpty');

  let category =
    new URLSearchParams(location.search).get('category') ||
    'semua';

  const allowedCategories = [
    'semua',
    'wisata',
    'budaya',
    'kuliner',
    'sejarah'
  ];

  if (!allowedCategories.includes(category)) {
    category = 'semua';
  }


  function render() {

    const keyword = (
      search?.value || ''
    )
      .trim()
      .toLowerCase();

    let visible = 0;


    cards.forEach((card) => {

      const cardCategory =
        card.dataset.category || '';

      const searchableText =
        card.dataset.search || '';

      const categoryMatch =
        category === 'semua' ||
        cardCategory === category;

      const searchMatch =
        !keyword ||
        searchableText
          .toLowerCase()
          .includes(keyword);

      const show =
        categoryMatch &&
        searchMatch;

      card.hidden = !show;

      if (show) {
        visible++;
      }
    });


    if (count) {
      count.textContent =
        `Menampilkan ${visible} cerita Kebumen`;
    }


    if (empty) {
      empty.hidden = visible !== 0;
    }


    filters.forEach((button) => {

      button.classList.toggle(
        'active',
        button.dataset.category === category
      );

    });


    updateRailButtons();
  }


  /* =========================================================
     FILTER BUTTON
  ========================================================= */

  filters.forEach((button) => {

    button.addEventListener('click', () => {

      category =
        button.dataset.category || 'semua';


      const url =
        new URL(location.href);


      if (category === 'semua') {

        url.searchParams.delete(
          'category'
        );

      } else {

        url.searchParams.set(
          'category',
          category
        );

      }


      history.replaceState(
        {},
        '',
        url.pathname +
        (url.search ? url.search : '') +
        '#jelajah'
      );


      render();


      $('#jelajah')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

    });

  });


  /* =========================================================
     SEARCH
  ========================================================= */

  search?.addEventListener(
    'input',
    () => {
      render();
    }
  );


  headerSearch?.addEventListener(
    'input',
    (event) => {

      if (!search) return;

      search.value =
        event.target.value;

      render();

    }
  );


  $('#headerSearchForm')?.addEventListener(
    'submit',
    (event) => {

      event.preventDefault();

      $('#jelajah')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      search?.focus();

    }
  );


  /* =========================================================
     LINK KATEGORI
     
     Contoh HTML:
     data-focus-category="wisata"
  ========================================================= */

  $$('[data-focus-category]').forEach(
    (link) => {

      link.addEventListener(
        'click',
        (event) => {

          event.preventDefault();

          const target =
            link.dataset.focusCategory;

          const button =
            $(
              `.filter[data-category="${target}"]`
            );

          button?.click();

        }
      );

    }
  );


  $$('[data-quick]').forEach(
    (link) => {

      link.addEventListener(
        'click',
        (event) => {

          event.preventDefault();

          const target =
            link.dataset.quick;

          const button =
            $(
              `.filter[data-category="${target}"]`
            );

          button?.click();

        }
      );

    }
  );


  /* =========================================================
     GALERI HORIZONTAL
  ========================================================= */

  const rail = $('#exploreGrid');

  const prev =
    $('#scrollPrev');

  const next =
    $('#scrollNext');


  function updateRailButtons() {

    if (
      !rail ||
      !prev ||
      !next
    ) {
      return;
    }


    const hasOverflow =
      rail.scrollWidth >
      rail.clientWidth + 5;


    prev.disabled =
      !hasOverflow ||
      rail.scrollLeft <= 3;


    next.disabled =
      !hasOverflow ||
      rail.scrollLeft >=
      rail.scrollWidth -
      rail.clientWidth -
      3;

  }


  prev?.addEventListener(
    'click',
    () => {

      rail?.scrollBy({
        left: -450,
        behavior: 'smooth'
      });

    }
  );


  next?.addEventListener(
    'click',
    () => {

      rail?.scrollBy({
        left: 450,
        behavior: 'smooth'
      });

    }
  );


  rail?.addEventListener(
    'scroll',
    updateRailButtons,
    {
      passive: true
    }
  );


  window.addEventListener(
    'resize',
    updateRailButtons
  );


  /* =========================================================
     HERO CAROUSEL
  ========================================================= */

  const hero =
    $('.hero-portal');

  const heroImg =
    $('.hero-portal > img');

  const heroTag =
    $('.hero-tag');

  const heroTitle =
    $('.hero-copy h1');

  const heroText =
    $('.hero-copy p');

  const heroCaption =
    $('.hero-caption');

  const heroDots =
    $$('.hero-dots button');


  const heroSlides = [

    {
      image: 'images/wisata1.jpg',

      tag:
        'DESTINASI PILIHAN · KEBUMEN',

      title:
        'Selalu ada cerita<br>di <em>Kebumen.</em>',

      text:
        'Temukan pesona pantai, budaya, kuliner, sejarah, dan cerita lokal dari kabupaten di selatan Jawa.',

      number: '01',

      label:
        'Pantai & Pesisir Selatan'
    },


    {
      image: 'images/ebleg.jpg',

      tag:
        'BUDAYA · KEBUMEN',

      title:
        'Tradisi yang terus<br>hidup di <em>Kebumen.</em>',

      text:
        'Kenali kesenian, tari, batik, dan tradisi yang menjadi bagian dari identitas masyarakat Kebumen.',

      number: '02',

      label:
        'Budaya & Tradisi Lokal'
    },


    {
      image: 'images/makanan4.jpg',

      tag:
        'KULINER · KEBUMEN',

      title:
        'Ada rasa yang selalu<br>mengantar pulang.',

      text:
        'Jelajahi kuliner khas yang sederhana, dekat dengan keseharian, dan penuh cerita.',

      number: '03',

      label:
        'Rasa Khas Kebumen'
    },


    {
      image: 'images/geopark.jpg',

      tag:
        'SEJARAH & ALAM · KEBUMEN',

      title:
        'Jejak masa lalu,<br>alam yang <em>bercerita.</em>',

      text:
        'Dari sejarah kota hingga bentang geologi, Kebumen menyimpan cerita yang panjang.',

      number: '04',

      label:
        'Sejarah & Warisan Alam'
    }

  ];


  let heroIndex = 0;


  function showHero(index) {

    if (
      !heroImg ||
      heroSlides.length === 0
    ) {
      return;
    }


    heroIndex =
      (
        index +
        heroSlides.length
      ) %
      heroSlides.length;


    const slide =
      heroSlides[heroIndex];


    hero?.classList.add(
      'is-switching'
    );


    setTimeout(() => {

      heroImg.src =
        slide.image;

      heroImg.alt =
        slide.label;


      if (heroTag) {
        heroTag.textContent =
          slide.tag;
      }


      if (heroTitle) {
        heroTitle.innerHTML =
          slide.title;
      }


      if (heroText) {
        heroText.textContent =
          slide.text;
      }


      if (heroCaption) {

        heroCaption.innerHTML = `
          <span>${slide.number}</span>
          <b>${slide.label}</b>
          <small>
            Geser untuk menjelajahi cerita berikutnya
          </small>
        `;

      }


      heroDots.forEach(
        (dot, dotIndex) => {

          dot.classList.toggle(
            'active',
            dotIndex === heroIndex
          );

        }
      );


      hero?.classList.remove(
        'is-switching'
      );

    }, 180);

  }


  /* =========================================================
     HERO DOTS
  ========================================================= */

  heroDots.forEach(
    (dot, index) => {

      dot.addEventListener(
        'click',
        () => {
          showHero(index);
        }
      );

    }
  );


  /* =========================================================
     HERO AUTO PLAY
  ========================================================= */

  let heroTimer =
    setInterval(
      () => {
        showHero(
          heroIndex + 1
        );
      },
      6500
    );


  hero?.addEventListener(
    'mouseenter',
    () => {
      clearInterval(heroTimer);
    }
  );


  hero?.addEventListener(
    'mouseleave',
    () => {

      heroTimer =
        setInterval(
          () => {
            showHero(
              heroIndex + 1
            );
          },
          6500
        );

    }
  );


  /* =========================================================
     CAROUSEL BUDAYA
  ========================================================= */

  const cultureImg =
    $('.feature-banner > img');

  const cultureTitle =
    $('.feature-content h2');

  const cultureText =
    $('.feature-content p');

  const cultureCounter =
    $('#cultureCounter');


  const cultureSlides = [

    {
      image:
        'images/ebleg.jpg',

      title:
        'Budaya Kebumen,<br>warisan yang bergerak.',

      text:
        'Dari Ebleg hingga kesenian rakyat lainnya, kenali tradisi yang membuat Kebumen punya karakter sendiri.'
    },


    {
      image:
        'images/budaya2.jpg',

      title:
        'Tari Lawet,<br>gerak yang khas.',

      text:
        'Tari Lawet terinspirasi dari kehidupan burung lawet dan menjadi salah satu simbol seni budaya Kebumen.'
    },


    {
      image:
        'images/budaya.jpg',

      title:
        'Cepetan Alas,<br>cerita dari tradisi.',

      text:
        'Seni pertunjukan dengan topeng, musik, dan gerak yang diwariskan melalui kehidupan masyarakat.'
    },


    {
      image:
        'images/batik.jpg',

      title:
        'Batik Kebumen,<br>warisan dalam motif.',

      text:
        'Motif dan warna batik menjadi cara perajin merekam karakter serta kekayaan visual daerah.'
    }

  ];


  let cultureIndex = 0;


  function showCulture(index) {

    cultureIndex =
      (
        index +
        cultureSlides.length
      ) %
      cultureSlides.length;


    const slide =
      cultureSlides[cultureIndex];


    if (cultureImg) {

      cultureImg.src =
        slide.image;

    }


    if (cultureTitle) {

      cultureTitle.innerHTML =
        slide.title;

    }


    if (cultureText) {

      cultureText.textContent =
        slide.text;

    }


    if (cultureCounter) {

      cultureCounter.textContent =
        `${String(
          cultureIndex + 1
        ).padStart(2, '0')} / 04`;

    }

  }


  $('#culturePrev')?.addEventListener(
    'click',
    () => {
      showCulture(
        cultureIndex - 1
      );
    }
  );


  $('#cultureNext')?.addEventListener(
    'click',
    () => {
      showCulture(
        cultureIndex + 1
      );
    }
  );


  /* =========================================================
     DETAIL PAGE
     
     Jika script.js juga dipanggil oleh detail.html,
     bagian ini tidak akan mengganggu halaman.
  ========================================================= */

  const detailPage =
    document.querySelector(
      '[data-detail-page]'
    );


  if (detailPage) {

    const params =
      new URLSearchParams(
        window.location.search
      );

    const detailId =
      params.get('id');


    if (detailId) {

      document.body.dataset.detailId =
        detailId;

    }

  }


  /* =========================================================
     SMOOTH SCROLL UNTUK LINK INTERNAL
  ========================================================= */

  $$('a[href^="#"]').forEach(
    (link) => {

      link.addEventListener(
        'click',
        (event) => {

          const targetId =
            link.getAttribute('href');

          if (
            !targetId ||
            targetId === '#'
          ) {
            return;
          }


          const target =
            document.querySelector(
              targetId
            );


          if (!target) {
            return;
          }


          event.preventDefault();


          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

        }
      );

    }
  );


  /* =========================================================
     INITIAL STATE
  ========================================================= */

  render();

  updateRailButtons();

  showHero(0);

  showCulture(0);

});
