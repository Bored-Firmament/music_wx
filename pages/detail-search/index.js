// pages/detail-search/index.js
import { playerStore } from "../../store/index"
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
    hasMore: true,
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
    // 搜索框没有内容,清空数据
    if(!this.data.searchValue.length) {
      this.setData({ suggestSongs : []})
      this.setData({ suggestSongsNodes : []})
      this.setData({ resultSongs : []})
      debounceGetSuggestSongs.cancel(); // debounce内部提供取消方法
      return 
    }
    debounceGetSuggestSongs(searchValue).then(res => {
      if(!this.data.searchValue.length) {
        this.setData({ suggestSongs : []})
        this.setData({ suggestSongsNodes : []})
        return 
      }
      // 获取 搜索建议列表
      const suggestSongs = res.result.allMatch;
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
    // 能不能发送请求
    if (!this.data.hasMore) return

    const offset = this.data.resultSongs.length;
    // 发送 获取搜索列表 的请求
    getSearchResult(this.data.searchValue, 30, offset).then(res => {
      // 清空 搜索建议
      if(this.data.suggestSongs) {
        this.setData({ suggestSongs : []})
        this.setData({ suggestSongsNodes : []})
      }
      // 保存 搜索结果
      if(!offset) {
        this.setData({ resultSongs : res.result.songs })
      } else {
        let newResultSongs = this.data.resultSongs;
        newResultSongs = newResultSongs.concat(res.result.songs);
        this.setData({ resultSongs : newResultSongs })
      }
      this.setData({ hasMore : res.result.hasMore })
    })
  },

  handleTagClick(event) {
    const keyword = event.currentTarget.dataset.keyword;
    this.setData({ searchValue: keyword });
    this.searchAction();
  },
  handleSongItemClick(event) {
    playerStore.setState("songsList", this.data.resultSongs)
    playerStore.setState("currentSongIndex", event.currentTarget.dataset.index)
  },

  // 触底 请求新数据
  onReachBottom() {
    if(this.data.resultSongs.length) {
      this.searchAction();
    }
  },
})