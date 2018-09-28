import 'style/index.scss';

$(function () {
  $('#planetmap area:first').mouseenter(function (evt) {
    console.log(evt.target.dataset.name);
    console.log($(this).attr('coords'));
  });
})