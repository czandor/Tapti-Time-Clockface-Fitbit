import * as C from "./const";
// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}
export function monoDigits(digits) {
  var ret = "";
  var str = digits.toString();
  for (var index = 0; index < str.length; index++) {
    var num = str.charAt(index);
    ret = ret.concat(hex2a("0x1" + num));
  }
  return ret;
}
export function hex2a(hex) {
  var str = '';
  for (var index = 0; index < hex.length; index += 2) {
    var val = parseInt(hex.substr(index, 2), 16);
    if (val) str += String.fromCharCode(val);
  }
  return str.toString();
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function setDevice(device){
  if (!device.screen) device.screen = { width: 300, height: 300 };
  device.ionic=(device.screen.width==348);
  device.versa=(device.screen.width==300);
  device.sense=(device.screen.width==336);
  
  if(!device.modelId) device.modelId = "0";
  if(!device.modelName) device.modelName = "unknown";

  device.noBarometer=(device.modelName=='Versa Lite');
  device.performance=(device.modelId < 35 || device.noBarometer)?1:2;
}
