// pages/home-video/index.js
import { getTopMVs } from '../../service/movie_api'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    topMVs: [],
    hasMore: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const res =  await getTopMVs(0)
    // if(res.code && res.code === 200) this.setData({ topMVs : res.data })
    this.getTopMVData(0)
  },

  /**
   * 方法
   */
  async getTopMVData(offset) {
    // 判断是否可以请求
    if (!this.data.hasMore && offset !== 0) return
    // 发送请求
    const res =  await getTopMVs(offset)
    // 请求成功
    if(res.code && res.code === 200) {
      // 处理数据
      let newData = this.data.topMVs
      if(offset === 0) newData = res.data
      else newData = newData.concat(res.data)
      this.setData({ topMVs : newData })
      this.setData({ hasMore : res.hasMore})
      // 若是 下拉刷新(重新请求数据)/初次请求数据 则再拿到数据后立刻将 下拉动画 结束;(其中 初次请求数据 也会执行触发,但不影响)
      if(offset === 0) wx.stopPullDownRefresh()
    }
  },

  /**
   * 页面相关事件
   */
  // 下拉刷新
  onPullDownRefresh: function() {
    this.getTopMVData(0)
    // const res =  await getTopMVs(0)
    // if(res.code && res.code === 200) this.setData({ topMVs : res.data })
  },

  // 触底
  onReachBottom: function() {
    if(!this.data.hasMore) return
    // const res =  await getTopMVs(this.data.topMVs.length)
    // if(res.code && res.code === 200) {
    //   this.setData({ topMVs : this.data.topMVs.concat(res.data) })
    //   this.setData({ hasMore : res.hasMore})
    // }
    this.getTopMVData(this.data.topMVs.length)
  }
})