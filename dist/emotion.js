(function($, window) {

  if(!$) {
    console.error('please import jQuery or Zepto first!');
    return false;
  }

  var opts = {
    //表情库列表
    "emoLib": [{
      "path": "arclist/", //表情文件路径
      "postfix": "gif",   //表情文件后缀
      "number": 75        //表情包总数
    }],
    "input": "#input",    //输入框
  }

  //表情框模板
  var html = '<div id="emo">{{imgs}}</div>';
  var imgs = '<img src="{{path}}{{num}}.{{postfix}}" onclick="$.insertAtCaret({{num}})" />';

  //初始化函数，用来生成表情列表，并绑定点击事件到当前元素
  $.fn.emotion = function(options) {
    opts = $.extend({}, opts, options);

    //采用模板方法生成表情的HTML代码
    $('body').append(template(html, {
      "imgs": function() {
        var tempStr = "";
        for(var emo of opts.emoLib) {
          tempStr += template(imgs, {
            "path": emo.path,
            "num": function(index) {
              return index + 1;
            },
            "postfix": emo.postfix
          }, emo.number);
        }
        return tempStr;
      }
    }));

    //绑定点击事件
    $(this).click(function(e) {
      $('#emo').toggle();
    })
  }

  //表情编码函数，用于将表情图片HTML编码后存入数据库
  $.emoEncode = function(str) {
    return str.replace(/<img src="[\w]*\/([0-9]*).[\w]{3}">/g, '[em_$1]');
  }

  //表情解码函数，用于将数据库中取出的表情编码转为HTML展示到页面
  $.emoDecode = function(str) {
    return str.replace(/\[em_([0-9]*)\]/g, function(a, b) {
      var emo = getEmoLib(b);
      return template('<img src="{{path}}{{num}}.{{postfix}}">', {
        "path": emo.path,
        "num": b,
        "postfix": emo.postfix
      });
    });
  }

  //将表情插入到光标位置
  $.insertAtCaret = function(num) {
    var emo = getEmoLib(num);
    var text = template('<img src="{{path}}{{num}}.{{postfix}}" />', {
      "path": emo.path,
      "num": num,
      "postfix": emo.postfix
    });
    var obj = $(opts.input)[0];
    var range, node;
    if(!obj.hasfocus) {
      obj.focus();
    }
    if(window.getSelection && window.getSelection().getRangeAt) {
      range = window.getSelection().getRangeAt(0);
      range.collapse(false);
      node = range.createContextualFragment(text);
      var c = node.lastChild;
      range.insertNode(node);
      if(c) {
        range.setEndAfter(c);
        range.setStartAfter(c);
      }
      var j = window.getSelection();
      j.removeAllRanges();
      j.addRange(range);
    } else if(document.selection && document.selection.createRange) {
      document.selection.createRange().pasteHTML(text);
    }
  }

  //模板方法
  var template = function(temp, params, repeat) {
    var ret = "";
    var repeat = repeat || 1;

    for(var i = 0; i < repeat; i++) {
      ret += temp.replace(/{{[\w]+}}/g, function(a, b) {
        var value = params[a.replace(/[{}]/g, "")];
        if(typeof value === "function") {
          return value.call(this, i);
        } else {
          return value;
        }
      })
    }

    return ret;
  }

  //获取当前表情所在的库
  var getEmoLib = function(num) {
    var emo = null;
    var sum = 0;
    for(var value of opts.emoLib) {
      sum += value.number;
      if(num <= sum) {
        emo = value;
        break;
      }
    }
    return emo;
  }
})(window.jQuery || window.Zepto, window);