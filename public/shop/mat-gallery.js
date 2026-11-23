/* Source photos, kept in the supplier’s original order. */
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

var SHOP_GALLERIES = {
  "chandra-organic-herbal-yoga-mat": [
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/R0005948_d1420227-7ddd-4905-a54a-5f35f9971951.jpg?v=1775754627",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/R0001139.jpg?v=1775754629",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/R0005944.jpg?v=1775754627",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/R0005948.jpg?v=1775754627",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/R0005810.jpg?v=1775754628",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/R0005805.jpg?v=1775754629",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/R0005913.jpg?v=1775754627",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/R0005917.jpg?v=1775754629",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/R0005966.jpg?v=1775754628",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/R0005973.jpg?v=1775754628"
  ],
  "chakra-organic-herbal-yoga-mat": [
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5626.jpg?v=1696360381",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A4970.jpg?v=1696360381",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A4951.jpg?v=1696360359",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A4896.jpg?v=1696360359",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A4870.jpg?v=1696360360"
  ],
  "chakra-copper-water-bottle": [
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5374.jpg?v=1696360171",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5324.jpg?v=1696360171",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5299.jpg?v=1696360171",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5532.jpg?v=1696360171",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5529.jpg?v=1696360171",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5296.jpg?v=1696360105"
  ],
  "organic-cotton-yoga-mat-non-slip-design": [
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC00072.png?v=1669203761",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC00092.png?v=1669203761",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC09114.png?v=1669203761",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC09140.png?v=1669203762",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC07754.png?v=1669203761",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC07774.png?v=1669203762",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC6585.png?v=1669203762",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC6591.png?v=1669203761"
  ],
  "ganga-copper-water-pot": [
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5328.jpg?v=1696439102",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5434.jpg?v=1696439102",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5336.jpg?v=1696439102",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5330.jpg?v=1696439102",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5429.jpg?v=1696439101"
  ],
  "yamuna-copper-water-jug": [
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5522.jpg?v=1696439102",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5493.jpg?v=1696439101",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5417.jpg?v=1696439101",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5498.jpg?v=1696360767",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5525.jpg?v=1696439102",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5495.jpg?v=1696439102",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5269.jpg?v=1696439101"
  ],
  "soma-sambu-grass-yoga-mat": [
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5219.jpg?v=1696439101",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5178.jpg?v=1696439101",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5197.jpg?v=1696439101"
  ],
  "nadi-sambu-grass-yoga-mat": [
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/20231003143859.jpg?v=1696439100",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/20231003143930.jpg?v=1696439100"
  ],
  "prana-recycled-cotton-yoga-mat": [
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5125.jpg?v=1696439102",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5107.jpg?v=1696439102",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5116.jpg?v=1696439101",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5172.jpg?v=1696439101",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5135.jpg?v=1696439101",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5106.jpg?v=1696361327",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5151.jpg?v=1696361327",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5613.jpg?v=1696439101"
  ],
  "sutra-organic-cotton-yoga-mat": [
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5640.jpg?v=1696439101",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5088.jpg?v=1696361191",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A4993.jpg?v=1696439101",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5001.jpg?v=1696439102",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5006.jpg?v=1696439102",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5009.jpg?v=1696439102",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5027.jpg?v=1696439101",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5062.jpg?v=1696439102",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/314AB6D5-C3BE-4653-96D5-F06ED1C89124.jpg?v=1719594482",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/BB2936C0-7E15-422E-BB4E-16A83F4D1057.jpg?v=1719594482",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/9A4DD10C-5715-4ED9-8FDF-408CFD3D9456.jpg?v=1719594482"
  ],
  "copper-cup": [
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-03103818_20220103_110250.jpg?v=1698858759",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-16125806.jpg?v=1698858759",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-03103818_19.jpg?v=1698858759",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-16125956.jpg?v=1698858760"
  ],
  "hammered-copper-water-storage-pot": [
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/3C5A1841.png?v=1669203760",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/3C5A1843.png?v=1669203760"
  ],
  "copper-bowl-spoon-set": [
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-03103818_20220103_105932.jpg?v=1698858760",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-03103818_20220103_105649.jpg?v=1698858759",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-03103818_52.jpg?v=1698858760",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-16130658.jpg?v=1698858760",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-16130521.jpg?v=1698858759"
  ],
  "copper-water-jug": [
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-18144351.jpg?v=1698858759",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-03103818_20220103_105828.jpg?v=1698858759",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-03103818_56.jpg?v=1698858760",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-18144150_1.jpg?v=1698858759",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-18143509.jpg?v=1698858760",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-03103818_20220103_110600.jpg?v=1698858759",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-18143728.jpg?v=1698858760"
  ],
  "hammer-copper-water-jug": [
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-16125124.jpg?v=1698858759",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-16125506.jpg?v=1698858759",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-03103818_20220103_110301.jpg?v=1698858759",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-16125243.jpg?v=1698858759"
  ],
  "hammered-copper-watter-bottle": [
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-16130024.jpg?v=1698858759",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-16130041.jpg?v=1698858759",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-03103818_20220103_110426.jpg?v=1698858759",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-16130137.jpg?v=1698858759"
  ],
  "organic-cotton-meditation-cushion": [
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5712.jpg?v=1696554402",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5533.jpg?v=1696554402",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-16132640.jpg?v=1696554402",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5565.jpg?v=1696554402",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-03103818_20220103_105726.jpg?v=1696554380",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5548.jpg?v=1696362040",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5575.jpg?v=1696439100"
  ],
  "organic-cotton-yoga-blanket": [
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC6551_-removebg.png?v=1669203760",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC6539_-removebg.png?v=1669203759",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC6541-removebg.png?v=1669203759",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC6549_-removebg.png?v=1669203759",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC6553-removebg.png?v=1669203759",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC6560-removebg.png?v=1669203760"
  ],
  "natural-cotton-yoga-mat": [
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC00054.png?v=1669203761",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC00052.png?v=1669203760",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC09204.png?v=1669203760",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC09197.png?v=1669203761",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC09194.png?v=1669203761",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC09202.png?v=1669203760"
  ],
  "banana-fiber-yoga-mat": [
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC00063-removebg.png?v=1696362329",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5248.jpg?v=1696439101",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5232.jpg?v=1696439100",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC09143-removebg.png?v=1696362329",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/J37A5233.jpg?v=1696439101"
  ],
  "organic-cotton-yoga-mat-diamond-pattern": [
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC00095.png?v=1669203761",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC00066.png?v=1669203761",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC6582.png?v=1669203759",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC09095.png?v=1666952557",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC09107.png?v=1666952632",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC09099.png?v=1666952633",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC07778.png?v=1669203760",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC07782.png?v=1669203760",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC6644.png?v=1669203760",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-11095544.jpg?v=1698858759",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/files/2022-01-11132341.jpg?v=1698858759"
  ],
  "organic-cotton-yoga-mat-ayurvedic-plant-dye": [
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC00058.png?v=1669203761",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC00070.png?v=1669203762",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC00077.png?v=1669203760",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC00080.png?v=1669203760",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC00086.png?v=1669203761",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC09127.png?v=1669203760",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC09129.png?v=1669203761",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC07757.png?v=1669203761",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC09206.png?v=1669203760",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC09187.png?v=1669203760"
  ],
  "organic-cotton-yoga-mat-natural-white": [
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC00041.png?v=1669203760",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC09219.png?v=1669203761",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC09223.png?v=1669203761",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC09222.png?v=1666867682",
    "https://cdn.shopify.com/s/files/1/0555/8602/9876/products/DSC07770.png?v=1669203761"
  ]
};
function renderMatGallery(card, dialog, main) {
  var panel = dialog.querySelector('.mat-gallery');
  var ja = document.documentElement.lang === 'ja';
  var title = card.querySelector('h3').textContent;
  var originals = SHOP_GALLERIES[card.getAttribute('data-photo-gallery')];
  var photos = card.hasAttribute('data-mat-gallery')
    ? MAT_GALLERY_PHOTOS.map(function (p) {
        var src = '/shop/img/mat-gallery/' + p[0];
        return { src: src, thumb: src, alt: p[ja ? 2 : 1] };
      })
    : (originals || []).map(function (src, i) {
        return { src: src, thumb: src + (src.includes('?') ? '&' : '?') + 'width=160', alt: title + (ja ? '｜画像 ' : ' | Photo ') + (i + 1) };
      });

  panel.hidden = photos.length < 2;
  panel.replaceChildren();
  main.parentElement.classList.toggle('is-mat-gallery', !panel.hidden);
  if (panel.hidden) return;

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
    button.setAttribute('aria-label', photo.alt);
    var img = document.createElement('img');
    img.alt = '';
    img.loading = 'lazy';
    img.src = photo.thumb;
    button.append(img);
    button.addEventListener('click', function () { select(i); });
    grid.append(button);
    return button;
  });
  function select(i) {
    main.src = photos[i].src;
    main.alt = photos[i].alt;
    count.textContent = (i + 1) + ' / ' + photos.length;
    buttons.forEach(function (button, j) {
      button.setAttribute('aria-pressed', String(i === j));
    });
  }
  panel.append(heading, grid);
  select(0);
}
