import 'style/index.scss';
import BScroll from 'better-scroll';

$(function () {
  const dataArr = [1,2,3,4,5,6,7,8,9,10,11,12,13];
  const listWrap = $('.list-wrapper')[0];

  dataArr.forEach((item, key, arr) => {
    $('.list-content').append(`<li class="list-item">I am the No.${item} line</li>`);
  });

  setTimeout(() => {
    const myScroll = new BScroll(listWrap, {
      startY: -60
    });
  }, 100);
});