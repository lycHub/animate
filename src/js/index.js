import 'style/index.scss';
import Velocity from 'velocity-animate';

window.addEventListener('DOMContentLoaded', function () {
  const test = document.getElementById("test");

  // 直接使用预定于动画
  Velocity(test, 'slideRightIn', { duration: 1000});
})