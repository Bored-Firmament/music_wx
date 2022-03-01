import xxRequest from "./index"

export function getSongDetail(ids) {
  return xxRequest.get('/song/detail?ids=' + ids)
}