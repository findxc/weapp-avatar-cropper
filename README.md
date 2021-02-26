# weapp-avatar-cropper

参照 [如何实现微信小程序图像剪切](https://juejin.im/post/5dba99ac518825644402e559) 这篇文章中的思路实现了头像裁剪。

在 `pages/constant.js` 中可以修改裁剪框尺寸，支持矩形。

[点击这里](https://developers.weixin.qq.com/s/KwkzOpm77aoa) 在微信开发者工具中预览效果。

## 实现时需要注意的问题

1. movable-view 的 damping 需要设得很大，比如 1000 ，否则可能在拖动图片时显示上有问题；
2. 使用 canvas 来绘制图片然后导出图片时，要先 canvas.createImage 来创建一个图片对象，然后使用这个图片对象来 context.drawImage ；
3. canvas 因为实际上在页面上看不到，所以可以用 fixed 定位到屏幕外即可；
4. [movable-view 中图片在 IOS 下缩放模糊](https://developers.weixin.qq.com/community/develop/doc/000cca893107c8895fc839e6351400) 。
