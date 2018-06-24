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


  // 刻度
  const scale = [0, 2, 4, 6, 8, 10, 12, 14];
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

  // 初始值
  let initVal = 2;
  // let initVal = [4, 8];

  // 滑块和色条初始位置
  let initPosTrack = null, initPosHandle = null;

  // 是否双滑块
  const isRange = false;

  if (isRange){
    sliderHandle.last().show();

    // 初始值
    if (initVal && !initVal instanceof Array || initVal.length !== 2) {
      initVal = [min, max];
    }
    // initVal = initVal ? initVal : [min, max];


    // 滑块初始的位置
    initPosHandle = [
      (initVal[0] - min) / (max - min) * widthCount,
      (initVal[1] - min) / (max - min) * widthCount
    ]

    sliderHandle.first().css('left', initPosHandle[0] + 'px').end().last().css('left', initPosHandle[1] + 'px');


    // 色条初始的位置
    initPosTrack = { left: initPosHandle[0], width: initPosHandle[1] - initPosHandle[0] };
  }else {
    sliderHandle.last().hide();

    initVal = initVal ? initVal : min;

    // 滑块初始的位置
    initPosHandle = (initVal - min) / (max - min) * widthCount;

    sliderHandle.css('left', initPosHandle + 'px');


    // 色条初始位置
    initPosTrack = { left: 0, width: initPosHandle };
  }

  sliderTrack.css({
    left: initPosTrack.left,
    width: initPosTrack.width + 'px'
  });

  /******************************************************/

// 记录位置信息
  const touch = {};

  // 点击移动
  slider.click(function (evt) {
    // 点击的位置离最左边的距离
    const dis = evt.pageX - this.offsetLeft;

    touch.left = 0;

    if (isRange) {
      const type = Math.abs(dis - initPosHandle[0]) < Math.abs(dis - initPosHandle[1]) ? 'left' : 'right';
      console.log(type);
      setPosition(dis, type, function (val) {
        console.log(val);
      });
    } else {
      setPosition(dis, null, function (val) {
        console.log(val);
      });
    }
  });


  // 标记：是否可滑动
  let canMove = false;

  sliderHandle.on('touchstart', function (evt) {
    evt.preventDefault();
    canMove = true;
    touch.startX = evt.touches[0].pageX - slider[0].offsetLeft;    // 按下的位置


    const type = evt.target.dataset.type;
    if (type === 'left') {
      touch.left = sliderHandle.first()[0].offsetLeft + 6;    // 进度条当前距离(px)
    }else {
      touch.left = sliderHandle.last()[0].offsetLeft + 6;
    }

   // console.log(sliderTrack.width(), sliderHandle[0].offsetLeft);
  }).on('touchmove', function (evt) {
    evt.preventDefault();
    // 如果没有经过touchstart事件，就返回
    if (!canMove) return;

    // 滑动的距离
    const dis = evt.touches[0].pageX - touch.startX;
    setPosition(dis, evt.target.dataset.type, function (val) {
      console.log(val);
    });
  }).on('touchend', function () {
    // this.off("touchstart touchmove");
  })







  /**********************************************/
  function setPosition(dis, type, cb) {
    const trackLeft = touch.left ? touch.left : 0;
    let pos = Math.min(widthCount, Math.max(0, dis + trackLeft));


    if (scale) {
      // 步距(px)
      const eachMarkPx = widthCount / (scale.length - 1);
      pos = eachMarkPx * Math.round(pos / eachMarkPx);
    }

    let value = null;

    // 滑块位置
    if (isRange) {
      if (type === 'left') {
        sliderHandle.first().css('left', pos + 'px');
      } else {
        sliderHandle.last().css('left', pos + 'px');
      }

      const handleLefts = [sliderHandle.first()[0].offsetLeft, sliderHandle.last()[0].offsetLeft];
      sliderTrack.css({
        left: Math.min(handleLefts[0], handleLefts[1]),
        width: Math.abs(handleLefts[1] - handleLefts[0]) + 'px'
      });

      // 更新value
      const valueLeft = Math.round((Math.min(handleLefts[0], handleLefts[1]) / widthCount) * (max - min) / step);
      const valueRight = Math.round((Math.max(handleLefts[0], handleLefts[1]) / widthCount) * (max - min) / step);


      value = scale ? [scale[valueLeft], scale[valueRight]] : [min + valueLeft, min + valueRight];
    }else {
    // console.log(Math.round(pos / widthCount * 100));
      console.log(pos);
      sliderTrack.width(pos);
      sliderHandle.css('left', pos + 'px');


      // 走了几步
      const count = Math.round((pos / widthCount) * (max - min) / step);

      // value值
      value = scale ? scale[count] : min + count;
    }



    cb(value);
  }
})