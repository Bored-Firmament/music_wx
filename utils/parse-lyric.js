export default function parseLyric(stringLyric) {
  const lyrics = [];
  const stringLyrics  = stringLyric.split('\n');
  const timePattern = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
  for(let stringItem of stringLyrics) {
    const timeRegExpResult = timePattern.exec(stringItem);
    // 获取时间
    if(timeRegExpResult) {
      const minute =  timeRegExpResult[1] * 60 * 1000
      const second =  timeRegExpResult[2] * 1000
      const millisecond =  timeRegExpResult[3].length === 3 ?  timeRegExpResult[3] * 1 : timeRegExpResult[3] * 10
      let time = minute + second + millisecond;
      // 获取歌词
      let text = stringItem.replace(timePattern, '');
      lyrics.push({ time, text });
    }
  }
  return lyrics
}