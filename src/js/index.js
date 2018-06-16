import 'style/index.scss';

$(function () {
  // 最外层容器
  const wrap = $('.wrap');

  // 二级菜单的容器
  const sub = $('.sub-wrap');


  // 当前激活的一级菜单项和当前显示的二级菜单
  let activeRow, activeMenu;


  // 定时器用于延迟
  let timer = null;

  // 判断是否在二级菜单内
  let mouseInSub = false;


  // 记录鼠标move时的坐标(只记录最后三次)
  // const mouseTrack = [];

  wrap.on('mouseenter', 'li', function (e) { // 事件代理
    // $(document).mousemove(moveHandler);
    sub.removeClass('none');

    const target = e.target;
    if (!activeRow) { // 第一次enter
      activeRow = $(target).addClass('active');
      activeMenu = $('#' + activeRow.data('id'));
      activeMenu.removeClass('none');
    }else { // 切换菜单
      // 去抖，也就是当mouseenter触发频率很快时，只执行最后一次
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(function () {
        if (mouseInSub) {
          return;
        }

        activeRow.removeClass('active');
        activeMenu.addClass('none');


        activeRow = $(target).addClass('active');
        activeMenu = $('#' + activeRow.data('id'));
        activeMenu.removeClass('none');
        timer = null;
      }, 300);
    }
  }).on('mouseleave', function () {
    sub.addClass('none');

    if (activeRow) {
      activeRow.removeClass('active');
      activeRow = null;
    }

    if (activeMenu) {
      activeMenu.addClass('none');
      activeMenu = null;
    }
    // $(document).off('mousemove', moveHandler);
  });



  sub.mouseenter(function () {
    mouseInSub = true;
  }).mouseleave(function () {
    mouseInSub = false;
  });


 /* function moveHandler(e) {
    mouseTrack.push({
      x: e.pageX,
      y: e.pageY
    })

    if (mouseTrack.length > 3) mouseTrack.shift();
  }*/
})