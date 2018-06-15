import 'style/index.scss';

$(function () {
  $(document).on('readystatechange', function () {  // 页面加载状态变化时触发
    // 页面加载状态
    if (this.readyState === 'complete') {
      console.log('加载ok');
      $('.overlay').fadeOut();
    }
  });
})