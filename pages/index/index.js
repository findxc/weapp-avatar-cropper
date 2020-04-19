Page({
  data: {
    avatar: '',
  },
  onShow() {
    const app = getApp()
    const { avatar } = app.globalData
    if (avatar) {
      this.setData({ avatar })
    }
  },
  chooseImage() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        const { tempFilePaths } = res
        const filePath = tempFilePaths[0]
        wx.navigateTo({
          url: `/pages/avatar-cropper/index?url=${filePath}`,
        })
      },
    })
  },
})
