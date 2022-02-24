// pages/home-music/index.js
import { getBanners } from "../../service/music_api"
import queryRect from "../../utils/query-rect"
import throttle from "../../utils/throttle"

const throttleQueryRect = throttle(queryRect, 1000)

Page({
  data: {
    swiperHeight: 0,
    banners: []
  },

  onLoad: function (options) {
    this.getPageData()
  },

  getPageData() {
    getBanners().then(res => {
      this.setData({banners : res.banners})
    })
  },

  handleSearchClick() {
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },
  handleImageLoaded() {
    throttleQueryRect(".swiper-image").then(res => {
      const rect = res[0]
      this.setData({ swiperHeight: rect.height })
    })
  }
})