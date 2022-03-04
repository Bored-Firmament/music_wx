// pages/detail-video/index.js
import { playerStore } from "../../store/index"
import { getMVURL, getMVDetail, getRelatedVideo } from "../../service/movie_api"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvUrlInfo: {},
    mvDetail: {},
    relatedVideo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 如果在放歌,需要暂停;
    playerStore.dispatch("changeMusicPlayStatusAction", false);

    this.getPageData(options.id)
  },

  /**
   * 方法
   */
  // 获取页面相关内容数据的 方法
  getPageData(id) {
    getMVURL(id).then(res => {
      this.setData({mvUrlInfo : res.data})
    })
    getMVDetail(id).then(res => {
      this.setData({mvDetail : res.data})
    })
    getRelatedVideo(id).then(res => {
      this.setData({relatedVideo : res.data})
    })
  }
})