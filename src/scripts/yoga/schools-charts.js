import Chart from 'chart.js/auto';

// Bar charts on the localized schools pages. Canvas can't resolve var(), so read tokens from :root.
/* canvas can't resolve var(): read the tokens from :root */
var tok = function (n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); };
var ink = tok('--color-text-primary'), grid = tok('--color-border'), font = "'Zen Kaku Gothic New', system-ui, sans-serif";
Chart.defaults.font.family = font;
Chart.defaults.font.size = 14;
Chart.defaults.color = ink;
var locale = document.documentElement.lang === 'en' ? 'en' : 'ja';
var studentLabels = locale === 'en' ? ['Elementary school', 'Junior high school', 'High school'] : ['小学生', '中学生', '高校生'];
var studentSuffix = locale === 'en' ? ' students' : '人';
function make(id, labels, data, colors, suffix, axisMax) {
  var el = document.getElementById(id);
  if (!el) return;
  new Chart(el, {
    type: 'bar',
    data: { labels: labels, datasets: [{ data: data, backgroundColor: colors, borderColor: colors, borderWidth: 0, borderRadius: 4, barPercentage: 0.62, categoryPercentage: 0.72 }] },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 900, easing: 'easeOutCubic' },
      layout: { padding: { right: 18, top: 4 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: tok('--color-text-primary'), titleFont: { size: 15 }, bodyFont: { size: 15 }, padding: 12, displayColors: false,
          callbacks: { label: function (c) { return c.parsed.x.toLocaleString(locale) + suffix; } }
        }
      },
      scales: {
        x: { beginAtZero: true, suggestedMax: axisMax, grid: { color: grid, drawBorder: false }, border: { display: false }, ticks: { font: { size: 14 }, color: tok('--color-deep-olive') } },
        y: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 16 }, color: ink } }
      }
    }
  });
}
make('chartTruancy', studentLabels, [23.0, 67.9, 23.3], [tok('--color-deep-olive'), tok('--color-warm-brown'), tok('--color-soft-terracotta')], studentSuffix, 75);
make('chartSuicide', studentLabels, [10, 172, 356], [tok('--color-deep-olive'), tok('--color-warm-brown'), tok('--color-soft-terracotta')], studentSuffix, 380);
