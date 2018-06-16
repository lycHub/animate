import 'style/index.scss';

const imgs = [
  'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529157765026&di=f4d36f285fcc3fca0674d77250e7f138&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F-4o3dSag_xI4khGko9WTAnF6hhy%2Flvpics%2Fh%3D800%2Fsign%3Db49dc48f8718367ab28972dd1e728b68%2F9922720e0cf3d7ca7f0736d0f31fbe096a63a9a6.jpg',
  'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529157765337&di=2b0f0e2b235251f908402e7988a06a81&imgtype=0&src=http%3A%2F%2Fimg2.3lian.com%2F2014%2Ff2%2F97%2Fd%2F57.jpg',
  'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529157765336&di=279cbaf1854e2176cc599542c1688bf8&imgtype=0&src=http%3A%2F%2Fpic.qiantucdn.com%2F58pic%2F17%2F95%2F05%2F50G58PIC7tU_1024.jpg',
  'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2194321889,206720783&fm=27&gp=0.jpg',
  'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529157765336&di=678961b24d295d0b4baf1b58ce7246a0&imgtype=0&src=http%3A%2F%2Fpic34.photophoto.cn%2F20150121%2F0034034895426055_b.jpg',
  'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529157765336&di=ec6c41345f40ed6fde528b4e0f56a965&imgtype=0&src=http%3A%2F%2Fd.hiphotos.baidu.com%2Flvpics%2Fh%3D800%2Fsign%3D3a5bf403d043ad4bb92e4bc0b2035a89%2Fa8014c086e061d95e9133e9e7af40ad162d9ca3b.jpg',
  'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1529161958943&di=f52c962e171884f744a64d60f9f1a1b5&imgtype=jpg&src=http%3A%2F%2Fimg2.imgtn.bdimg.com%2Fit%2Fu%3D4225576952%2C2876741302%26fm%3D214%26gp%3D0.jpg'
];

let currentIndex = 0;
const len = imgs.length;

let num = 0;

$(function () {
  $('#box img').attr('src', imgs[currentIndex]);

  $.each(imgs, function (i, item) {
    const oImg = new Image();

    $(oImg).on('load error', function () {
      oImg.onload = null;
      $('.loading .progress').text(Math.round((num + 1)/len*100) + '%');
      if (num >= imgs.length - 1) {
        $('.loading').fadeOut();
      }
      num++;
    });

    oImg.src = item;
  });


  $('.btns').click(function (evt) {
    const type = $(evt.target).data('control');

    if (type === 'prev') {
      currentIndex--;
      currentIndex = Math.max(currentIndex, 0);
    }else {
      currentIndex++;
      currentIndex = Math.min(currentIndex, len);
    }

    $('#box img').attr('src', imgs[currentIndex]);
  })
})