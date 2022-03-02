// pages/home-music/index.js
import { rankingStore } from "../../store/index"
import { getBanners, getSongMenu } from "../../service/music_api"

import queryRect from "../../utils/query-rect"
import throttle from "../../utils/throttle"

const throttleQueryRect = throttle(queryRect, 1000)

Page({
  data: {
    swiperHeight: 0,    // 轮播图高度
    banners: [],        // 轮播图资源
    recommendSongs: [], // 推荐歌曲(热歌榜)
    hotSongMenu: [],    // 热门歌单
    recommendSongMenu: [],  // 推荐歌单
    rankings: { 0: {}, 2: {}, 3: {} } // 榜单合集
  },

  onLoad: function (options) {
    // 发起获取本页数据的请求
    this.getPageData()
    // 发起共享数据的请求
    rankingStore.dispatch("getRankingDataAction")
    // 从store获取共享的数据
    rankingStore.onState("hotRanking", res => {
      if(!res.tracks) return 
      const recommendSongs = res.tracks.slice(0, 6);
      this.setData({ recommendSongs })
    })
    rankingStore.onState("newRanking", this.handleRankingData(0))
    rankingStore.onState("originRanking", this.handleRankingData(2))
    rankingStore.onState("upRanking", this.handleRankingData(3))
  },

  getPageData() {
    // 1.获取轮播图数据
    getBanners().then(res => {
      this.setData({banners : res.banners})
    })

    // 2.获取歌单数据
    getSongMenu().then(res => {
      this.setData({ hotSongMenu : res.playlists });
    })
    getSongMenu("流行").then(res => {
      this.setData({ recommendSongMenu : res.playlists });
    })
  },

  // 事件
  handleSearchClick() {
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },
  handleImageLoaded() {
    throttleQueryRect(".swiper-image").then(res => {
      const rect = res[0]
      if(rect && rect.height) {
        this.setData({ swiperHeight: rect.height })
      }
    })
  },
  handleToSongsListClick(event) {
    const idx = event.currentTarget.dataset.idx;
    wx.navigateTo({
      url: `/pages/detail-songs/index?idx=${idx}&type=rank`,
    })
  },

  // 方法
  handleRankingData(idx) {
    return (res) => {
      if(Object.keys(res).length === 0) return 
      const name = res.name;
      const coverImgUrl = res.coverImgUrl;
      const playCount = res.playCount;
      const songList = res.tracks.slice(0, 3)
      let newList = { ...this.data.rankings, [idx] : { name, coverImgUrl, playCount, songList } }
      this.setData({ rankings : newList })
    }
  }
})