/* First Shop item only. Gallery photographs remain unchanged source files. */
var MAT_GALLERY_PHOTOS = [
  [
    "01-J37A5589.jpg",
    "Rose yoga mat laid flat in a sunlit room",
    "床に広げたローズ色のヨガマット"
  ],
  [
    "02-J37A4782.jpg",
    "Four rolled yoga mats in indigo, rose, jade and sun",
    "4色の丸めたヨガマット"
  ],
  [
    "03-J37A4827.jpg",
    "Person in tree pose on a jade yoga mat",
    "翡翠色のマットで木のポーズ"
  ],
  [
    "04-J37A4800.jpg",
    "Person carrying a folded rose yoga mat",
    "折りたたんだローズ色のマットを持った人"
  ],
  [
    "05-J37A4794.jpg",
    "Close-up of four stacked woven yoga mats",
    "4色のマットを重ねた織り目の拡大"
  ],
  [
    "06-J37A5679.jpg",
    "Indigo yoga mat laid flat in a living room",
    "床に広げた藍色のヨガマット"
  ],
  [
    "07-J37A4842.jpg",
    "Close-up of the jade yoga mat’s woven texture",
    "翡翠色のヨガマットの織り目"
  ],
  [
    "08-2F013959-DF47-437C-864D-B1F6DFAB4A88.jpg",
    "Sun yoga mat partly unrolled on a white background",
    "オレンジ色のマットを半分広げた状態"
  ]
];

function renderMatGallery(card, dialog, main) {
  var panel = dialog.querySelector('.mat-gallery');
  var enabled = card.hasAttribute('data-mat-gallery');
  panel.hidden = !enabled;
  panel.replaceChildren();
  main.parentElement.classList.toggle('is-mat-gallery', enabled);
  if (!enabled) return;

  var ja = document.documentElement.lang === 'ja';
  var photos = MAT_GALLERY_PHOTOS;
  var heading = document.createElement('div');
  heading.className = 'mat-gallery__heading';
  var label = document.createElement('span');
  label.textContent = ja ? '商品画像' : 'Product photos';
  var count = document.createElement('span');
  count.setAttribute('role', 'status');
  heading.append(label, count);
  var grid = document.createElement('div');
  grid.className = 'mat-gallery__photos';
  var buttons = photos.map(function (photo, i) {
    var button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', (ja ? '画像 ' : 'Photo ') + (i + 1) + ': ' + photo[ja ? 2 : 1]);
    var img = document.createElement('img');
    img.alt = '';
    img.loading = 'lazy';
    img.src = '/shop/img/mat-gallery/' + photo[0];
    button.append(img);
    button.addEventListener('click', function () { select(i); });
    grid.append(button);
    return button;
  });
  function select(i) {
    main.src = '/shop/img/mat-gallery/' + photos[i][0];
    main.alt = photos[i][ja ? 2 : 1];
    count.textContent = (i + 1) + ' / ' + photos.length;
    buttons.forEach(function (button, j) {
      button.setAttribute('aria-pressed', String(i === j));
    });
  }
  panel.append(heading, grid);
  select(0);
}
