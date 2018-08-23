
/**
 * 格式化成 00:00的格式
 */
 export function formatTime(secondsTime){
  let minutes = Math.floor(secondsTime / 60);
  let seconds = secondsTime % 60;
  if(minutes.toString().length === 1){
    minutes = "0" + minutes;
  }
  if(seconds.toString().length === 1){
    seconds = "0" + seconds;
  }
  return minutes + ":" + seconds;
}
