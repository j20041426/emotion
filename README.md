## 聊天应用中的表情插件

> 用于即时聊天应用的图片表情插件，具有展示表情、插入表情和表情编解码的功能

### 项目地址

[看代码](https://github.com/j20041426/emotion)

[看demo](https://j20041426.github.io/emotion/)

### 原理介绍

web端的即时聊天中看到的表情，其实就是一张张表情图片，通过`img`标签引用并展示在页面上。在整个聊天的流程上主要有这几个要点：

 - 当用户要发送表情时，首先要显示表情列表，让用户可以从中选择要发送的表情。然后通过插入表情的功能，将表情插入到当前光标所在的位置。**这里有一个小技巧**，如果输入框用`<input type="text">`的话，是无法在输入框中显示表情图片的，这样用户无法直观的看到他想发送的表情。可以使用H5中的新特性`contenteditable`，使`div`变为可编辑状态，就可以显示表情图片了。
 - 用户点击了发送之后，将输入框中的内容进行编码，用户输入框中的内容应该类似于`你好啊<img src="arclist/1.gif">`，编码之后会得到`你好啊[em_1]`，就可以将之发送或者存储。
 - 当用户页面读取到聊天内容时，会得到`你好啊[em_1]`这样的字符串，其中`[em_1]`就是表情图片对应的编码，进行解码后，`[em_1]`会解析成`<img src="arclist/1.gif">`，然后直接渲染到页面中，用户就能看到对应的表情图片了。

代码注释比较详细，使用的时候可以根据项目的具体情况，做一些适当的修改。