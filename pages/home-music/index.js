// pages/home-music/index.js
import { rankingStore, playerStore, audioContext } from "../../store/index"
import { getBanners, getSongMenu } from "../../service/music_api"

import queryRect from "../../utils/query-rect"
import throttle from "../../utils/throttle"

const throttleQueryRect = throttle(queryRect, 1000, { trailing: false })

const playModeNames = ["order", "repeat", "random"]


Page({
  data: {
    swiperHeight: 0,    // 轮播图高度
    banners: [],        // 轮播图资源
    recommendSongs: [], // 推荐歌曲(热歌榜)
    hotSongMenu: [],    // 热门歌单
    recommendSongMenu: [],  // 推荐歌单
    rankings: { 0: {}, 2: {}, 3: {} }, // 榜单合集

    id: 0,                // 当前歌曲 id -store
    currentSong: {},      // 当前歌曲 info - store
    isPlaying: false,     // 是否播放 - store
    playModeIndex: 0,     // 当前歌曲 - store
    playModeName: "order",// 当前歌曲 - store
    songsList: [],        // 歌曲列表

    isShowSongsList: false, // 是否显示歌曲列表

    showPage: false,      // 页面初始不展示、等数据差不多了再展示(或者说:等待2s再展示);
  },

  onLoad: function () {
    setTimeout(() => {
      this.setData({showPage: true})
    }, 2000)
    // 发起获取本页数据的请求
    this.getPageData()
    // 发起共享数据的请求
    rankingStore.dispatch("getRankingDataAction")
    // 获取共享的数据
    this.getStoreData()
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
  getStoreData() {
    // 从 rankingStore 获取共享的数据
    rankingStore.onState("hotRanking", this.handleHotRankingData())
    rankingStore.onState("newRanking", this.handleRankingData(0))
    rankingStore.onState("originRanking", this.handleRankingData(2))
    rankingStore.onState("upRanking", this.handleRankingData(3))
    
     // 从 playerStore 获取共享的数据
    playerStore.onStates([ "id", "songsList", "currentSong", "isPlaying", "playModeIndex", ], this.handlePlayerStoreData())
  },
  onUnload(){
    if (this.data.recommendSongs) rankingStore.offState("hotRanking", this.handleHotRankingData())
    if (this.data.rankings[0]) rankingStore.offState("newRanking", this.handleRankingData(0))
    if (this.data.rankings[2]) rankingStore.offState("originRanking", this.handleRankingData(2))
    if (this.data.rankings[3]) rankingStore.offState("upRanking", this.handleRankingData(3))

    playerStore.offfStates([ "id", "songsList", "currentSong", "isPlaying", "playModeIndex", ], this.handlePlayerStoreData())
  },

  // 事件
  handleSongItemClick(event) {
    playerStore.setState("songsList", this.data.recommendSongs)
    playerStore.setState("currentSongIndex", event.currentTarget.dataset.index)
  },
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
  changePlayStatusClick() {
    if(audioContext.paused) this.resume();
    else this.pause();
  },
  handlePlayBarClick() {
    const id = this.data.id;
    wx.navigateTo({
      url: '/pages/music-player/index?id=' + id,
    })
    playerStore.dispatch("playSongAction", { id })
  },
  
  isSongsListClick() {
    this.setData({ isShowSongsList: !this.data.isShowSongsList })
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
  },
  handleHotRankingData() {
    return (res) => {
      if(!res.tracks) return 
      const recommendSongs = res.tracks.slice(0, 6);
      this.setData({ recommendSongs })
    }
  },
  handlePlayerStoreData() {
    return ({ id, songsList, currentSong, isPlaying, playModeIndex }) => {
      if(id) this.setData({ id })
      if(songsList) {
        this.setData({ songsList })
      }
      if(currentSong) this.setData({ currentSong });
      if(isPlaying !== undefined) this.setData({ isPlaying });
      if(playModeIndex !== undefined) {
        let playModeName = playModeNames[playModeIndex];
        this.setData({ playModeIndex, playModeName });
      }
    }
  },
  // 播放
  resume() { 
    playerStore.dispatch("changeMusicPlayStatusAction");
  },
  // 暂停
  pause() { 
    playerStore.dispatch("changeMusicPlayStatusAction", false );
  },
})