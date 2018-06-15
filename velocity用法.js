  const test = document.getElementById("test");

  Velocity(test, {
    width: 500,       // 如果不写属性值的单位, Velocity 会将像素(px)作为默认单位
    opacity: 0.5
  }, {
    duration: 400,         // 动画执行时间
    easing: "swing",       // 缓动效果
    queue: "",             // 队列
    begin: undefined,      // 动画开始时的回调函数
    progress: undefined,   // 动画执行中的回调函数（该函数会随着动画执行被不断触发）
    complete: undefined,   // 动画结束时的回调函数
    display: undefined,    // 动画结束时设置元素的 css display 属性
    visibility: undefined, // 动画结束时设置元素的 css visibility 属性
    loop: false,           // 循环
    delay: false,          // 延迟
    mobileHA: true         // 移动端硬件加速（默认开启）
  });


// 动态属性
$element.velocity({
  top: 50,                // 等同于 "50px"
  left: "50%",
  width: "+=5rem",        // 每次在当前值上叠加 5rem
  height: "*=2"           // 每次在当前值上叠乘 2
  color: ["#888", "#000"] // 每次动画执行前，color 的初始值都为"#000"（从"#000"过渡成"#888"）
});


  // 直接使用预定于动画
  // 动画名有很多，但是大多需要引入velocity.ui：
  // http://www.mrfront.com/docs/velocity.js/plugins.html
  Velocity(test, 'fadeIn', { duration: 1000, loop: true});