let count = 0;

// 默认全部图片加载成功
let success = true;

// 超时timer的id
let timeoutId = null;

// 是否加载超时
let isTimeout = false;


/*
 * 图片预加载
 *当所有图片加载成功后执行回调
 * 如果加载出错，那么超过等待时间(timeout)后，也执行回调
 * */
export default function loadImage(images, timeout, callback){
  for (const key in images) {
    if (!images.hasOwnProperty(key)) continue;

    // 每个图片期望的格式 {src: 'xxx'}
    let item = images[key];

    // 如果格式不对，就转化
    if (typeof item === 'string') {
      item = images[key] = {src: item};
    }

    if (!item || !item.src) continue;

    count++;

    // 给每个图片加上唯一标识
    item.id = `__img__${key}${getId()}`

    // 设置图片元素的img属性，值是个Image对象
    // 这里window[item.id]确实不是必须的，为了便于在浏览器直接调试，通过window['__img_id']可以直接访问到某个image对象
    item.img = window[item.id] = new Image();

    doLoad(item, callback);
  }

  // 此处循环结束count应该是最大值
  if (!count) {
    callback(success);
  }else if (timeout) {
    timeoutId = setTimeout(onTimeout, timeout);
  }


  function onTimeout() {
    isTimeout = true;
    callback(false);
  }
}


let __id = 0;
function getId() {
  return ++__id;
}


// 加载操作
function doLoad(item, callback){
  item.status = 'loading';

  const img = item.img;

  img.onload = function () {
    success = success & true;
    item.status = 'loaded';
    done();
  }

  img.onerror = function () {
    success = false;
    item.status = 'error';
    done();
  }

  img.src = item.src;

  function done() {
    img.onload = img.onerror = null;

    try{
      delete window[item.id];
    }catch (e){

    }

    // 图片全加载完执行回调
    // 由于加载图片是个异步过程，等执行到doLoad时，count已经是最大的数了，然后每执行一次doLoad，就--
    // 当--count = 0时，可以任务全部加载
    console.log(count);

    // 如果加载完并且没有超时，则阻止定时器触发
    if (!--count && !isTimeout){
      clearTimeout(timeoutId);
      callback(success);
    }
  }
}