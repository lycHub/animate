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
      this.bindEvent();
    }

    init(){
      // 窗口高宽比
      this.heightWidthRatio = window.innerHeight / window.innerWidth;

      // 每次滚动的距离
      this.slideDis = window.innerWidth;

      // 当前索引
      this.idx = 0;

      // 是否可以滑动
      this.canSlide = false;
    }


    // 渲染dom
    renderDom(){
      const wrap = this.wrap,
        data = this.data;
      const len = data.length;
      const dis = this.slideDis;

      this.outer = document.createElement('ul');
      // this.outer.style.width = `${len * 100}%`;
      $(this.outer).width(`${len * 100}%`).attr('class', 'clearfix');

      for (let i = 0; i < len; i++) {
        const li = document.createElement('li');
        const item = data[i];
        li.style.width = dis + 'px';
        // li.style.transform = `translateX(${dis * i}px)`;

        li.innerHTML = `<img src="${item.src}" />`;
        this.outer.appendChild(li);
      }
      wrap.appendChild(this.outer);
    }


    bindEvent(){
      const self = this;
      const dis = this.slideDis;
      const outer = this.outer;
      const len = this.data.length;
      // console.log(outer);
      $(outer).on('touchstart', {context: self}, Slider.onTouchStart)
        .on('touchmove',  {context: self}, Slider.onTouchMove)
        .on('touchend',  {context: self}, Slider.onTouchEnd);
    }

    static onTouchStart(evt) {
      const self = evt.data.context;
      self.canSlide = true;

      self.startX = evt.touches[0].pageX;

      // 偏移量
      self.disX = 0;
      self.startTime = new Date().getTime();
    }

    static onTouchMove(evt) {
      evt.preventDefault();
      const self = evt.data.context;

      if (self.canSlide) {
        // <0是左
        self.disX += evt.touches[0].pageX - self.startX;
        // console.log(self.disX);

        // 偏移后的位置

        $(self.outer).css('transform', `translateX(${self.disX}px)`);
      }
    }

    static onTouchEnd(evt) {
      const self = evt.data.context;
      self.canSlide = false;
      console.log(self.disX);
    }
  }


  new Slider({
    dom: document.getElementById('canvas'),
    data,
  });


});

