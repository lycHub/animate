(function ($) {
  class PageSwitch {
    constructor($el, options) {
      this.element = $el;
      this.settings = $.extend(true, $.fn.PageSwitch.default, options || {});
      this.init();
    }

    init(){
      const me = this;
      me.selectors = me.settings.selectors;
      me.sections = me.element.find(me.selectors.sections);
      me.section = me.sections.find(me.selectors.section);

      // 是否是竖着的
      me.direction = me.settings.direction === 'vertical';

      // 页面数
      me.pagesCount = me.pagesCount();

      // 当前页数
      me.index = me.settings.index >= 0 && me.settings.index < me.pagesCount ? me.settings.index : 0;

      if (!me.direction) this._initLayout();

      if (me.settings.pagination) me._initPaging();

      // 保证鼠标滚轮一页页的滑
      me.canScroll = true;
    }


    // 获取页面数
    pagesCount(){
      return $(this.section).length;
    }

    // 获取滑动的距离
    switchLength(){
      return this.direction ? this.element.height() : this.element.width();
    }


    // 如果是横向，需要改变下css
    _initLayout(){
      const containerWidth = (this.pagesCount * 100) + '%',
        singlePageWidth = (100 / this.pagesCount).toFixed(2) + '%';

      this.sections.width(containerWidth);
      this.section.width(singlePageWidth).css('float', 'left');
    }


    // 初始化分页
    _initPaging(){
      const me = this;
      const pageContanierClass = me.selectors.page.slice(1);
      me.pageActiveClass = me.selectors.active.slice(1);
      const pageContanier = `<ul class="${pageContanierClass}"></ul>`;

      for (let i = 0; i < me.pagesCount; i++) {
        $(pageContanier).append('<li></li>');
      }

      this.element.append(pageContanier);

      // 保存每一个按钮
      this.pageItem = $(pageContanier).find('li');
      this.pageItem.eq(me.index).addClass(me.pageActiveClass);

      // 如果是竖着的
      if (me.direction) {
        $(pageContanier).addClass('vertical');
      }else {
        $(pageContanier).addClass('horizontal');
      }

      this._bindEvent();
    }


    _bindEvent(){
      const me = this;
      me.element.on('click', this.selectors.page + 'li', function () {
        me.index = $(this).index();
        me._scrollPage();
      }).on('mousewheel DOMMouseScroll', function (e) {
        if (me.canScroll) {
          // 原生事件对象
          const event = e.originalEvent;

          // 火狐的滚轮方向跟其它的相反的，所以加个-  保持正负对应上下滚动
          const dilta = event.wheelDelta || -event.detail;

          if (dilta > 0 && (me.index && !me.settings.loop || me.settings.loop)){ // 上滚
            this._prev();
          }else if(dilta < 0 && (me.index < (me.pagesCount - 1) && !me.settings.loop || me.settings.loop)) {
            this._next();
          }
        }
      });

      // 键盘事件
      if (me.settings.keyboard) {
        $(window).on('keydown', function (e) {
          const keyCode = e.keyCode;
          if (keyCode === 37 || keyCode === 38) { // 左或上
            this._prev();
          }else {
            this._next();
          }
        })
      }


      // 窗口改变事件
      $(window).resize(function () {
        const currentLength = me.switchLength();
        const offset = me.settings.direction ? me.section.eq(me.index).offset().top : me.section.eq(me.index).offset().left;

        if ((Math.abs(offset) > currentLength / 2) && (me.index < me.pagesCount - 1)) {
          me.index++;
        }

        if (me.index) this._scrollPage();
      });


      // transition结束事件
      me.sections.on('transitionend', function () {
        if (me.settings.callback && $.type(me.settings.callback) === 'function') {
          me.canScroll = true;
          me.settings.callback();
        }
      })
    }

    _scrollPage(){
      const me = this;
      const dest = me.section.eq(me.index).position();

      if (!dest) return;
      me.canScroll = false;

      const translate = me.direction ? `translateY(-${dest.top}px)` : `translateX(-${dest.left}px)`;
      me.sections.css({
        transiton: `all ${me.settings.duration}ms ${me.settings.easing}`,
        transform: translate
      });

      if (me.sections.pagination) {
        me.pageItem.eq(me.index).addClass(me.pageActiveClass).siblings('li').removeClass(me.pageActiveClass);
      }
    }

    _prev(){
      const me = this;
      if (me.index > 0) {
        me.index--;
      }else if (me.settings.loop) {
        me.index = me.pagesCount - 1;
      }
      this._scrollPage();
    }

    _next(){
      if (me.index < me.pagesCount) {
        me.index++;
      }else if (me.settings.loop) {
        me.index = 0;
      }
      this._scrollPage();
    }
  }


  // 将PageSwitch做成jq插件
  $.fn.PageSwitch = function (options) {
    return this.each(function () {
      const me = $(this);
      // 对象实例，控制单例模式
      let instance = me.instance;
      if (!instance) {
        instance = me.instance = new PageSwitch(me, options);
        // me.data('PageSwitch', instance);
      }

      // 如果传递的参数是字符串，就认为是想要调用PageSwitch中的某个方法
      // $('div').PageSwitch('init')
      if ($.type(options) === 'string') return instance[options]();
    });
  }

  $.fn.PageSwitch.default = {
    selectors: {
      setions: '.sections',
      section: '.section',
      page: '.pages',
      active: '.active'
    },
    index: 0,
    easing: 'ease',
    duration: 500,
    loop: false,
    pagination: true,
    keyboard: true,
    direction: 'verticle',
    callback: null
  }

})(jQuery);