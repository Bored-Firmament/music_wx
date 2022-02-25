// pages/home-music/index.js
import { rankingStore } from "../../store/index"
import { getBanners } from "../../service/music_api"
import queryRect from "../../utils/query-rect"
import throttle from "../../utils/throttle"


const throttleQueryRect = throttle(queryRect, 1000)

Page({
  data: {
    swiperHeight: 0,
    banners: [],
    recommendSongs: []
  },

  onLoad: function (options) {
    // 发起获取本页数据的请求
    this.getPageData()
    // 发起共享数据的请求
    rankingStore.dispatch("getRankingDataAction")
    // 从store获取共享的数据
    rankingStore.onState("hotRanking", (res) => {
      if(!res.tracks) return 
      const recommendSongs = res.tracks.slice(0, 6);
      this.setData({ recommendSongs })
    })
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