let isScrolling;
let scrollIndicatorVisible = true;

window.addEventListener('DOMContentLoaded', function () {
  const scrollIndicator = document.getElementById('menu-icon');
  const checkbox = document.getElementById('menu-btn');
  const body = document.getElementById('body');

  function updateMenuVisibility() {
    const pageWidth = body.clientWidth;

    // PC表示の際はハンバーガーメニューを非表示に
    if (pageWidth >= 1200) {
      scrollIndicator.style.display = 'none';
      checkbox.checked = false; // チェックボックスもオフにする
      scrollIndicatorVisible = false; // 表示状態を更新
    } else {
      scrollIndicator.style.display = 'block'; // モバイル表示の際は表示
    }
  }

  // 初回実行
  updateMenuVisibility();

  // スクロールイベントの追加
  window.addEventListener('scroll', function () {
    // スクロール中はインジケーターを非表示
    scrollIndicator.style.display = 'none';
    scrollIndicatorVisible = false;

    // スクロールが止まった後の処理
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(function () {
      if (body.clientWidth < 1200) {
        scrollIndicator.style.display = 'block';
        scrollIndicatorVisible = true;

      }
    }, 1000);
    if (checkbox.checked && body.clientWidth < 1200){
      scrollIndicator.style.display = 'block';
      scrollIndicatorVisible = true;
    }
  });
  // ウィンドウサイズ変更時にメニューの表示を更新
  window.addEventListener('resize', updateMenuVisibility);
});


document.addEventListener('DOMContentLoaded', function() {
  // メニュー項目のすべてのリンクを取得
  const menuLinks = document.querySelectorAll('.menu a');
  // チェックボックスの状態を管理している要素を取得
  const menuBtn = document.querySelector('.menu-btn');

  // 各リンクにクリックイベントを追加
  menuLinks.forEach(link => {
      link.addEventListener('click', function() {
          // メニューを閉じるためにチェックボックスを未選択にする
          menuBtn.checked = false;
      });
  });
});