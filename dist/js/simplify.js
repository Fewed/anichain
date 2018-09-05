;function sel(target) {
  var arr = document.querySelectorAll(target);
  return arr.length === 1 ? arr[0] : arr;
}
function lis(eventType, process) {
  return window.addEventListener(eventType, process);
}
function raf(cb) {
  return requestAnimationFrame(cb);
}
function gs(element) {
  return getComputedStyle(element);
}
var log = console.log.bind(console);