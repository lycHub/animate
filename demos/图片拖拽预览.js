/*
* <div id="box">将文件拖入</div>
 <ul></ul>
* */

$(function () {
  $('#box').on('dragenter', function () {
    this.innerHTML = '可以释放了';
  })
    .on('dragleave', function () {
      this.innerHTML = '将文件拖入';
    })
    .on('dragover', function (evt) {
      evt.preventDefault();
    })
    .on('drop', function (evt) {
      evt.preventDefault();

      const fs = evt.originalEvent.dataTransfer.files;		//被拖拽文件的集合,是个数组


      for (let a = 0; a < fs.length; a++) {
        // console.log(fs[a]);
        const fd = new FileReader();
        fd.readAsDataURL(fs[a]);
        fd.onload = function(){				//读取文件成功时触发
          if (fd.readyState === 2) {  // 文件读取完成
            // console.log( this.result );			//读取文件数据
            $('ul:first').append(`<li><img src="${this.result}" /><span>${fs[a].name}</span></li>`)
          }
        };
      }


    })
});