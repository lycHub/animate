import 'style/index.scss';

$(function () {
  const imgs = $('img');
  const len = imgs.length;
  let num = 0;

  $.each(imgs, function (i) {
    const oImg = new Image();

    oImg.onload = function () {
      // 避免重复请求
      oImg.onload = null;
      num++;
      $('.overlay .loading b').text(Math.round(num/len*100) + '%');
      if (num >= imgs.length - 1) $('.overlay').fadeOut();
    }

    oImg.src = imgs[i].src;
  })
})
