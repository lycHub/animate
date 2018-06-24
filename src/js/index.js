import 'style/index';

$(function () {
  const sliderWrap = $('.slider-wrap'),
    slider = sliderWrap.find('.slider'),
    // sliderRail = slider.find('.slider-rail'),
    sliderTrack = slider.find('.slider-track'),
    sliderHandle = slider.find('.slider-handle');

  /***********************************************/
  // slider总长
  const widthCount = slider.width();

  let min = 0, max = 100;

  let step = 1;

  // 初始值（逻辑未实现）
  let initVal = min;


  // 刻度
  const scale = [1, 3, 5, 7, 9, 11];
  // const scale = null;

  if (scale) {
    min = scale[0];
    max = scale[scale.length - 1];
    step = scale[1] - scale[0];

    let scaleDom = '';
    scale.forEach(item => {
      scaleDom += '<li>' + item + '</li>'
    });

    sliderWrap.append(`<div class="slider-scale">
      <ul>${scaleDom}</ul>
    </div>`)
  }


  /******************************************************/


  // 点击移动
  slider.click(function (evt) {
    // 点击的位置离最左边的距离
    const dis = evt.pageX - this.offsetLeft;

    setPosition(dis, function (val) {
      console.log(val);
    });
  });


  // 标记：是否可滑动
  let canMove = false;

  // 记录位置信息
  const touch = {};

  sliderHandle.on('touchstart', function (evt) {
    evt.preventDefault();
    canMove = true;
    touch.startX = evt.touches[0].pageX - slider[0].offsetLeft;    // 按下的位置
    touch.left = sliderTrack.width();    // 进度条当前距离(px)
  }).on('touchmove', function (evt) {
    evt.preventDefault();
    // 如果没有经过touchstart事件，就返回
    if (!canMove) return;

    // 滑动的距离
    const dis = evt.touches[0].pageX - touch.startX;
    setPosition(dis, function (val) {
      console.log(val);
    }, touch.left);
  }).on('touchend', function () {
    this.off("touchstart touchmove");
  })







  /**********************************************/
  function setPosition(dis, cb, trackLeft = 0) {
    let pos = Math.min(widthCount, Math.max(0, dis + trackLeft));

    if (scale) {
      // 步距(px)
      const eachMarkPx = widthCount / (scale.length - 1);
      pos = eachMarkPx * Math.round(pos / eachMarkPx);
    }








    sliderTrack.width(pos);
    sliderHandle.css('left', pos + 'px');


    // 走了几步
    const count = Math.round((pos / widthCount) * (max - min) / step);

    // value值
    const value = scale ? scale[count] : min + count;
    cb(value);
  }
})