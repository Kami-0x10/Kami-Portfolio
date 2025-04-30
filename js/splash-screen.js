var textarea = $('.start');
var i = 0;

var output = Array.from({ length: 101 }, (_, idx) => `${idx}%`);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runner() {
  await sleep(2000);
  while (i < output.length) {
    textarea.append(output[i] + "<br><br>");
    textarea.scrollTop(textarea[0].scrollHeight);
    i++;
    await sleep(Math.floor(Math.random() * 2) + 1); // 元の速度に戻す
  }
  
  setTimeout(feedbacker, 1000);
}

async function feedbacker() {
  while (i < output.length) {
    textarea.append(output[i] + "<br><br>");
    textarea.scrollTop(textarea[0].scrollHeight);
    i++;
    await sleep(Math.floor(Math.random() * 2) + 1); // フィードバックの時間も短縮
  }

  setTimeout(() => $(".load").fadeOut(1000), 1000);
}

// 初期化
runner();
