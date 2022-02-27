// pages/detail-search/index.js
import { getHotKeywords, getSuggestSongs } from "../../service/search_api"

Page({
  data: {
    isInput: false,
    keywords: [],
    suggestSongs: [],
    searchValue: "",
  },
  onLoad: function (options) {
    this.getPageData();
  },

  // 方法
  getPageData() {
    getHotKeywords().then(res => {
      this.setData({ keywords : res.result.hots });
    })
  },

  // 事件
  searchFocus() {
    this.setData({ isInput: true })
  },
  searchCancel() {
    this.setData({ isInput: false })
  },
  changeValue(event) {
    const searchValue = event.detail;
    this.setData({ searchValue });
    if(!searchValue.length) {
      this.setData({ suggestSongs : []})
      return 
    }
    getSuggestSongs(searchValue).then(res => {
      this.setData({ suggestSongs: res.result.allMatch})
    })
  }
})