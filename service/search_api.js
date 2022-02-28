import xxRequest from './index';

export function getHotKeywords() {
  return xxRequest.get('/search/hot')
}

export function getSuggestSongs(keywords) {
  return xxRequest.get(`/search/suggest?keywords=${keywords}&type=mobile`)
}

export function getSearchResult(keywords, limit = 30, offset = 0) {
  return xxRequest.get('/search', {
    keywords,
    limit,
    offset
  })
}