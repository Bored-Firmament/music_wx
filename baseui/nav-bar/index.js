// baseui/nav-bar/index.js
const globalData = getApp().globalData;
Component({
  options: {
    multipleSlots: true
  },
  properties: {
    title: {
      type: String,
      value: "默认标题"
    }
  },
  data: {
    statusHeight: globalData.statusBarHeight,
    navHeight: globalData.navBarHeight
  },
  methods: {
    handleBack() {
      wx.navigateBack()
    }
  }
})
