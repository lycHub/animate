const DEFAULT_INTERVAL = 1000 / 60;

// 初始化状态
const STATE_INITIAL = 0;

// 开始状态
const STATE_START = 1;

// 停止状态
const STATE_STOP = 2;


const reqAnimFrame = (function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, callback.interval || DEFAULT_INTERVAL);
      }
})();


const cancelAnimFrame = (function () {
  return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame ||
    function (id) {
      return window.clearTimeout(id);
    };
})();



export default class Timeline{
  constructor(){
    this.animationHandler = 0;
    this.state = STATE_INITIAL;
  }


  /*
  * 时间轴上每一次回调执行的函数
  * time: 从动画开始到当前执行的时间
  * */
  onEnterFrame(time){

  }


  /*
  * 动画开始
  * interval: 每次回调的间隔时间
  * */
  start(interval){
    if (this.state === STATE_START) return;
    this.state = STATE_START;
    this.interval = interval || DEFAULT_INTERVAL;

    // +new Date() === new Date().getTime()
    startTimeLine(this, +new Date());
  }


  /*
  * 动画停止
  * */
  stop(){
    if (this.state !== STATE_START) return;

    this.state = STATE_STOP;

    //如果动画开始过，则记录动画从开始到当前所经历的时间
    if (this.startTime) {
      this.dur = +new Date() - this.startTime;
    }
    cancelAnimFrame(this.animationHandler);
  }


  /*
   * 重新开始动画
   * */
  reStart(){
    if (this.state === STATE_START)
      return;
    if (!this.dur || !this.interval)
      return;

    this.state = STATE_START;

    //无缝连接停止动画的状态
    startTimeline(this, +new Date() - this.dur);
  }
}


/**
 * 时间轴动画启动函数
 * @param timeline 时间轴实例
 * @param startTime 动画开始时间戳
 */
function startTimeLine(timeline, startTime) {
  timeline.startTime = startTime;
  nextTick.interval = timeLine.interval;

  // 上一次动画的时间
  let lastTick = +new Date();
  nextTick();

  /**
   * 每一帧执行的函数
   */
  function nextTick() {
    const now = +new Date();

    timeline.animationHandler = reqAnimFrame(nextTick);

    //如果当前时间与上一次回调的时间戳相差大于我们设置的间隔时间，表示可以执行一次回调函数。
    if (now - lastTick >= timeline.interval) {
      timeline.onEnterFrame(now - startTime);
      lastTick = now;
    }
  }
}