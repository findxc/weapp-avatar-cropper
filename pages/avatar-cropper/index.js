import { loadCanvasImage } from './util'

Page({
  data: {
    dpr: 2,
    // 用户选择的图片的地址
    imageSrc: '',
    // movable-area top 的值
    areaTop: 0,
    initialWidth: 0,
    initialHeight: 0,
    initialX: 0,
    initialY: 0,
    initialScale: 1,
    clipSize: 0,

    x: 0,
    y: 0,
    scale: 1,

    canvasSize: 0,
  },
  onLoad() {
    const imageSrc = this.options.url

    const { windowWidth, windowHeight, pixelRatio } = wx.getSystemInfoSync()

    // 裁剪框是 600rpx，计算出对应的 px 值
    const clipSize = (windowWidth / 750) * 600
    // 计算出裁剪框应该距离顶部的值，以便定位
    const areaTop = (windowHeight - clipSize) / 2

    wx.getImageInfo({
      src: imageSrc,
      success: (res) => {
        const { width, height } = res
        // 在知道图片本身的宽高后，一开始需要缩放一下图片使得图片的宽或者高等于裁剪框尺寸
        const scale = Math.max(clipSize / width, clipSize / height)
        const initialWidth = width * scale
        const initialHeight = height * scale

        this.setData({
          dpr: pixelRatio,
          imageSrc,
          areaTop,
          initialWidth,
          initialHeight,
          initialX: (clipSize - initialWidth) / 2,
          initialY: (clipSize - initialHeight) / 2,
          initialScale: scale,
          clipSize,
        })
      },
    })
  },
  onChange: function (e) {
    const { x, y } = e.detail
    this.setData({ x, y })
  },
  onScale: function (e) {
    const { x, y, scale } = e.detail
    this.setData({ x, y, scale })
  },
  onClickCancel() {
    wx.navigateBack()
  },
  onClickConfirm() {
    const { dpr, imageSrc, x, y, initialScale, scale, clipSize } = this.data

    const totalScale = scale * initialScale
    const sx = -x / totalScale
    const sy = -y / totalScale
    const canvasSize = clipSize / totalScale

    this.setData({ canvasSize })

    const query = wx.createSelectorQuery()
    query
      .select('.canvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        const context = canvas.getContext('2d')

        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        context.scale(dpr, dpr)

        // 在 canvas 上把原图上裁剪框对应的部分给画上去，然后导出即可
        loadCanvasImage(canvas, imageSrc).then((img) => {
          context.drawImage(
            img,
            sx,
            sy,
            canvasSize,
            canvasSize,
            0,
            0,
            canvasSize,
            canvasSize
          )

          wx.canvasToTempFilePath({
            fileType: 'jpg',
            canvas,
            success: (res) => {
              // TODO: 这里在实际项目中应该是调用 wx.uploadFile 来上传采集后图片
              const app = getApp()
              app.globalData.avatar = res.tempFilePath
              wx.navigateBack()
            },
          })
        })
      })
  },
})
