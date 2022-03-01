// pages/music-player/index.js
import { getSongDetail } from "../../service/player_api"

Page({
  data: {
    id: '',
    contentHeight: 0,
    songs: [],
    currentSong: {},
    currentPage: 0
  },
  
  // 生命周期
  onLoad: function (options) {
    // 保存id
    const id = options.id;
    this.setData({ id});
    // 请求数据
    this.getPageData();
    // 动态计算内容高度
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight = globalData.navBarHeight
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    this.setData({ contentHeight })

    // 播放
    const audioContext = wx.createInnerAudioContext();
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
    audioContext.play();
  },

  // 事件
  handleChangeCurrent(event) {
    this.setData({ currentPage : event.detail.current });
  },
  clickItem(event) {
    this.setData({ currentPage : event.currentTarget.dataset.current });
  },

  // 方法
  getPageData() {
    getSongDetail(this.data.id).then(res => {
      this.setData({ songs : res.songs })
      this.setData({ currentSong : res.songs[0] })
    });
  }
})