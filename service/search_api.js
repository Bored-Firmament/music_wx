import xxRequest from './index';

export function getHotKeywords() {
  return xxRequest.get('/search/hot')
}

export function getSuggestSongs(keywords) {
  return xxRequest.get(`/search/suggest?keywords=${keywords}&type=mobile`)
}