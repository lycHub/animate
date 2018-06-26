import 'style/index.scss';
import rabbit from '@/assets/rabbit-big.png';
import animation from './animation';

const positions = [
  '0 -854',
  '-174 -852',
  '-349 -852',
  '-524 -852',
  '-698 -852',
  '-873 -848'
];

const ele = document.getElementById('rabbit');

animation().loadImage([rabbit]).changePosition(ele, positions, rabbit).repeatForever().start(80);


/*
 animation(ele, positions, rabbit);

function animation(ele, positions, imgUrl) {
  $(ele).css('background', `url(${imgUrl}) no-repeat`);

  // 当前索引(帧)
  let index = 0;

  function run() {
    const position = positions[index].split(' ');
    $(ele).css('backgroundPosition', `${position[0]}px ${position[1]}px`);
    index++;
    if (index >= positions.length) index = 0;
    setTimeout(run, 80);
  }
  run();
}*/
