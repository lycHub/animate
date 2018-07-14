import 'style/index.scss';

const books = [{
  id: 1,
  name: 'javascript语言精粹',
  price: 40,
  pic: '/src/assets/img1.jpg'
}, {
  id: 2,
  name: 'javascript权威指南',
  price: 120,
  pic: require('../assets/img2.jpg')
}, {
  id: 3,
  name: '精通javascript',
  price: 50,
  pic: require('../assets/img3.jpg')
}, {
  id: 4,
  name: 'DOM编程艺术',
  price: 35,
  pic: require('../assets/img4.jpg')
}];

const cartList = [];

let count = 0;

$(function () {
  books.forEach(book => {
    $('ul:first').append(` <li draggable="true" data-id="${book.id}">
    <img src="${book.pic}" />
    <p>${book.name}</p>
    <p>${book.price}￥</p>
  </li>`)
  });

  $('ul:first li').on('dragstart', function (event) {
    const evt = event.originalEvent;
    count = 0;
    evt.dataTransfer.setData('bookId',this.dataset.id);
  });

  $('#div1').on('dragover', function (event) {
    event.preventDefault();
  }).on('drop', function (event) {
    const evt = event.originalEvent;
    const newId = Number.parseInt(evt.dataTransfer.getData('bookId'));

    const indexInBookList = books.findIndex(item => item.id === newId);
    const indexInCart = cartList.findIndex(item => item.id === newId);
    if (indexInCart === -1) {
      cartList.push(Object.assign(books[indexInBookList], {num: 1}));
    }else {
      cartList[indexInCart].num++;
    }

    $(this).html('');
    cartList.forEach(item => {
      count += item.price * item.num;
      $(this).append(`<p>
        <span class="box1">${item.num}</span>
        <span class="box2">${item.name}</span>
        <span class="box3">${item.price * item.num}￥</span>
    </p>`)
    });

    $(this).append(`<div id="allMoney">${count}￥</div>`);
  })
});