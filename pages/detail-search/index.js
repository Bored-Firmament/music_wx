// pages/detail-search/index.js
import { getHotKeywords, getSuggestSongs, getSearchResult } from "../../service/search_api"
import debounce from "../../utils/debounce"
import stringToNodes from "../../utils/string2nodes"

const debounceGetSuggestSongs = debounce(getSuggestSongs);

Page({
  data: {
    isInput: false,
    searchValue: "",
    keywords: [],
    suggestSongs: [],
    suggestSongsNodes: [],
    hasMore: false,
    resultSongs: [],
  },
  onLoad: function () {
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
  searchClear() {
    this.setData({ isInput: false })
  },
  searchCancel() {
    this.setData({ isInput: false })
  },
  changeValue(event) {
    const searchValue = event.detail;
    this.setData({ searchValue });
    if(!searchValue.length) {
      this.setData({ suggestSongs : []})
      this.setData({ suggestSongsNodes : []})
      this.setData({ resultSongs : []})
      return 
    }
    debounceGetSuggestSongs(searchValue).then(res => {
      // 获取 搜索建议列表
      const suggestSongs = res.result.allMatch;
      // 若空则清空 前端 可能保存了的 搜索建议列表、搜索建议列表node 
      if(!suggestSongs) {
        this.setData({ suggestSongs : []})
        this.setData({ suggestSongsNodes : []})
        return 
      }
      // 成功取得 搜索建议列表 ,保存到 data 中
      this.setData({ suggestSongs })
      // 处理数据 得到 搜索建议列表node
      let suggestSongsNodes = []
      for(let item of suggestSongs) {
        // 后台反馈的 建议搜索 都是 将输入的内容作为字符串头部搜索 得到的结果,所以不需要使用正则!
        const nodes = stringToNodes(item.keyword, this.data.searchValue);
        suggestSongsNodes.push(nodes);
      }
      // 将 搜索建议列表node 保存至 data 中
      this.setData({ suggestSongsNodes })
    })
  },
  searchAction() {
    getSearchResult(this.data.searchValue).then(res => {
      // 清空 搜索建议
      this.setData({ suggestSongs : []})
      this.setData({ suggestSongsNodes : []})
      // 保存 搜索结果
      this.setData({ resultSongs : res.result.songs })
      this.setData({ hasMore : res.result.hasMore })
    })
  },

  handleTagClick(event) {
    const keyword = event.currentTarget.dataset.keyword;
    this.setData({ searchValue: keyword });
    this.searchAction();
  }
})