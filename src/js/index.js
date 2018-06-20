import 'style/index.scss';

const data = [{
  width: 800,
  height: 950,
  src: require('../assets/a.jpg')
}, {
  width: 800,
  height: 950,
  src: require('../assets/b.jpg')
}, {
  width: 800,
  height: 950,
  src: require('../assets/c.jpg')
}, {
  width: 800,
  height: 950,
  src: require('../assets/d.jpg')
}, {
  width: 800,
  height: 950,
  src: require('../assets/e.jpg')
}, {
  width: 800,
  height: 950,
  src: require('../assets/f.jpg')
}];

$(function () {

  class Slider{
    constructor({ dom, data }){
      this.wrap = dom;
      this.data = data;
      this.init();
      this.renderDom();
      // this.bindEvent();
    }

    init(){
      // 窗口高宽比
      this.heightWidthRatio = window.innerHeight / window.innerWidth;

      // 每次滚动的距离
      this.slideDis = window.innerWidth;

      // 当前索引
      this.idx = 0;
    }


    // 渲染dom
    renderDom(){
      const wrap = this.wrap,
        data = this.data;
      const len = data.length;
      const dis = this.slideDis;

      this.outer = document.createElement('ul');

      for (let i = 0; i < len; i++) {
        const li = document.createElement('li');
        const item = data[i];
       //  li.style.width = dis + 'px';
        li.style.transform = `translateX(${dis * i}px)`;

        li.innerHTML = `<img src="${item.src}" />`;
        this.outer.appendChild(li);
      }
      wrap.appendChild(this.outer);
    }
  }


  new Slider({
    dom: document.getElementById('canvas'),
    data,
  });


});

