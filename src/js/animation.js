import loadImage from './imgloader';
import TimeLine from './timeline';

// 初始化状态
const STATE_INITIAL = 0;

// 开始状态
const STATE_START = 1;

// 停止状态
const STATE_STOP = 2;


// 任务类型
// 同步任务
const TASK_SYNC = 0;

// 异步任务
const TASK_ASYNC = 1;


function next(callback) {
  callback && callback();
}

export default class Animation{

  constructor(){
    this.taskQueue = [];
    this.index = 0;
    this.state = STATE_INITIAL;
    this.timeline = new TimeLine();
  }


  // 图片预加载
  loadImage(imgList){
    const taskFn = function (next) {

      // 避免loadImage函数内部会音响到原数组imgList
      loadImage(imgList.slice(), next);
    }

    const type = TASK_SYNC;

    return this._add(taskFn, type);
  }


  // 改变background的位置
  changePosition(ele, positions, imgUrl){
    const len = positions.length;
    let taskFn, type;
    if (len) {
      const me = this;
      taskFn = function (next, time) {
        if (imgUrl) {
          ele.style.backgroundImage = `url${imgUrl}`;
        }

        //获得当前背景图片位置索引
        const index = Math.min(Math.floor(time / me.interval), len - 1);
        const position = positions[index].split(' ');

        //改变dom对象的背景图片位置
        ele.style.backgroundPosition = position[0] + 'px ' + position[1] + 'px';

        //当前任务执行完毕
        if (index === len) {
          next();
        }
      }
      type = TASK_ASYNC;
    }else {
      taskFn = next;
      type = TASK_SYNC;
    }
    return this._add(taskFn, type);
  }


  // 改变img的src
  changeSrc(ele, imgList){
    const len = imglist.length;
    let taskFn;
    let type;
    if (len) {
      const me = this;
      taskFn = function (next, time) {
        //获得当前的图片索引
        const index = Math.min(time / me.interval | 0, len);
        //改变image对象的图片地址
        ele.src = imglist[index - 1];
        //当前任务执行完毕
        if (index === len) {
          next();
        }
      };
      type = TASK_ASYNC;
    } else {
      taskFn = next;
      type = TASK_SYNC;
    }

    return this._add(taskFn, type);
  }


  // 自定义动画每帧执行的函数
  enterFrame(taskFn){
    return this._add(taskFn, TASK_ASYNC);
  }


  // 开始执行任务
  start(interval){
    if (this.state === STATE_START || !this.taskQueue.length) {
      return this;
    }

    this.state = STATE_START;
    this.interval = interval;
    this._runTask();
    return this;

  }



  /**
   * 添加一个同步任务，该任务就是回退到上一个任务中，
   * 实现重复上一个任务的效果，可定义重复的次数。
   * @param times 重复次数
   */
  repeat(times){
    const me = this;
    const taskFn = function () {
      if (typeof times === 'undefined') {
        //无限回退到上一个任务
        me.index--;
        me._runTask();
        return;
      }
      if (times) {
        times--;
        //回退到上一个任务
        me.index--;
        me._runTask();
      } else {
        //达到重复执行次数，则跳转到下一个任务
        const task = me.taskQueue[me.index];
        me._next(task);
      }
    };
    const type = TASK_SYNC;

    return this._add(taskFn, type);
  }


  // 无限重复上一个任务
  repeatForever(){
    return this.repeat();
  }


  // 当前任务结束后，延迟多久开始下一个任务
  wait(){
    if (this.taskQueue && this.taskQueue.length > 0) {
      this.taskQueue[this.taskQueue.length - 1].wait = time;
    }
    return this;
  }


  // 暂停任务
  pauze(){
    if (this.state === STATE_START) {
      this.state = STATE_STOP;
      this.timeline.stop();
      return this;
    }
    return this;
  }


  // 重新开始暂停的任务
  reStart(){
    if (this.state === STATE_STOP) {
      this.state = STATE_START;
      this.timeline.reStart();
      return this;
    }
    return this;
  }


  /**
   * 添加一个同步任务，可在上一个任务完成执行回调函数
   * @param callback 回调函数
   */
  then(callback){
    const taskFn = function (next) {
      callback(this);
      next();
    };
    const type = TASK_SYNC;

    return this._add(taskFn, type);
  }


  // 释放资源
  dispose(){
    if (this.state !== STATE_INITIAL) {
      this.state = STATE_INITIAL;
      this.taskQueue = null;
      this.timeline.stop();
      this.timeline = null;
      return this;
    }
    return this;
  }


  // 给任务队列中添加任务
  _add(taskFn, type){
    this.taskQueue.push({
      taskFn,
      type
    });

    return this;
  }


  // 执行任务
  _runTask(){
    if (!this.taskQueue || this.state !== STATE_START) return;

    if (this.index === this.taskQueue.length) {
      this.dispose();
      return;
    }

    // 当前任务
    const task = this.taskQueue[this.index];

    if (task.type === TASK_SYNC) {
      this._syncTask(task);
    }else {
      this._asyncTask(task);
    }
  }


  // 同步任务
  _syncTask(task){
    const me = this;
    const taskFn = task.taskFn;

    const next = function () {
      // taskFn执行完后继续到下一个任务
      me._next(task);
    }

    taskFn(next);
  }

  // 异步任务
  _asyncTask(task){
    const me = this;
    const taskFn = task.taskFn;

    // 定义每一帧的回调函数
    const enterFrame = function (time) {
      const next = function () {

        // 停止当前动画
        me.timeline.stop();

        // 进行下一个
        me._next(task);
      };
      taskFn(next, time);
    }

    this.timeline.onEnterFrame = enterFrame;
    this.timeline.start(this.interval);
  }


  _next(task){
    this.index++;

    task.wait ? setTimeout(() => {
      me._runTask();
    }, task.wait) : this._runTask();
  }
}