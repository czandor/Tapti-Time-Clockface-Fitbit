import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import * as C from "../common/const";
import { units} from "user-settings";
import { user } from "user-profile";
import { today as todayActivity } from "user-activity";
import { primaryGoal } from "user-activity";
import { goals } from "user-activity";

import { me } from "appbit";
import { display } from "display";

import { vibration } from "haptics";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { battery } from "power";
import { charger } from "power";
import { me as device } from "device";
util.setDevice(device);

// Update the clock every minute
clock.granularity = "minutes";

let bodyPresent=false;
let hrbpm=0;
let hrm=null;
let body=null;

let vibeRunning=-1;
let vibeActual=0;
let hours=0;
let mins=0;
let chargeLevel=0;

const timeText = document.getElementById("timeText");
const hrBlock = document.getElementById("hrBlock");
const batteryBlock = document.getElementById("batteryBlock");
const hrIcon = document.getElementById("hrIcon");
const batteryIcon = document.getElementById("batteryIcon");
const hrText = document.getElementById("hrText");
const batteryText = document.getElementById("batteryText");

const bg = document.getElementById("bg");
const buttonTop = document.getElementById("buttonTop");
const buttonBottom = document.getElementById("buttonBottom");


if (me.permissions.granted("access_heart_rate")) {
  if (HeartRateSensor) {
    hrm = new HeartRateSensor({ frequency: 1 });
    hrm.addEventListener("reading", () => {
      //if(LOG) log("Current heart rate: " + hrm.heartRate);
      hrbpm = hrm.heartRate;
      tick();
      //drawDelayed();
    });
    hrm.start();
  }
  if (BodyPresenceSensor) {
    body = new BodyPresenceSensor();
    body.addEventListener("reading", () => {
      bodyPresent=body.present;
      //updateHR();
      if (!bodyPresent) {
        hrm.stop();
      } else {
        hrm.start();
      }
      tick();
      //drawDelayed();
    });
    body.start();
  }
  
  
  //if(LOG) log("Started heart rate: " + JSON.stringify(hrm));
}
else{
  //if(LOG) log("Heart rate not started, no permission");
}
battery.onchange=function(evt){tick();};
charger.onchange=function(evt){tick();};

let lastClick=0;
buttonTop.addEventListener("click", (evt) => {onClick("buttonTop")});
buttonBottom.addEventListener("click", (evt) => {onClick("buttonBottom")});
let clickVibeTimer=null;
function onClick(button){
  let top=(button=="buttonTop");
  let today = new Date();
  if ((lastClick + C.DOUBLE_CLICK_TIMEOUT) > today.getTime()){
    if(clickVibeTimer) clearTimeout(clickVibeTimer);
    clickVibeTimer=null;
    //lastClick=0;
    
    if(vibeRunning == vibeActual){
      vibe(C.VibeModeCancel,true);
      vibeActual++;
      animateCancel();
    }
    else{
      vibeRunning = vibeActual;
      //vibe(C.VibeTap,true);
      let vibeType=(top)?C.VibeTop:C.VibeBottom;
      let waitTime=(C.Vibes[vibeType].time-Math.min(today.getTime()-lastClick,0))+C.Vibes[C.VibeNext].time;
      log(waitTime);
      //vibe(vibeType,true);
      setTimeout(function(){
        vibe((top)?C.VibeConfirmTop:C.VibeConfirmBottom,true);
      },waitTime);
      let _hours=hours;
      let _mins=mins;
      let _battery=chargeLevel;
      let _hr=(bodyPresent)?hrbpm:0;
      setTimeout(function(){
        if(top){
          let hourTime=startVibe(_hours,false,vibeRunning,C.TypeHour);
          let minuteTime=startVibe(_mins,true,vibeRunning,C.TypeMinute,hourTime);
        }
        else{
          let batteryTime=startVibe(_battery,false,vibeRunning,C.TypeBattery);
          let hrTime=startVibe(_hr,true,vibeRunning,C.TypeHR,batteryTime);
        }
      },waitTime+C.VibePause+C.ModeWait);
    }
  }
  else {
    if(vibeRunning != vibeActual) {
      vibe((top)?C.VibeTop:C.VibeBottom);
      /*if(clickVibeTimer) clearTimeout(clickVibeTimer);
      clickVibeTimer=setTimeout(function(){
        vibe((top)?C.VibeTop:C.VibeBottom);
      },C.DOUBLE_CLICK_TIMEOUT+1);*/
    }
    lastClick=today.getTime();
  }
}
/*document.getElementById("b0").addEventListener("click", (evt) => { vibe(0);});
document.getElementById("b1").addEventListener("click", (evt) => { vibe(1);});
document.getElementById("b2").addEventListener("click", (evt) => { vibe(2);});
document.getElementById("b3").addEventListener("click", (evt) => { vibe(3);});
document.getElementById("b4").addEventListener("click", (evt) => { vibe(4);});
document.getElementById("b5").addEventListener("click", (evt) => { vibe(5);});
document.getElementById("b6").addEventListener("click", (evt) => { vibe(6);});
document.getElementById("b7").addEventListener("click", (evt) => { vibe(7);});
document.getElementById("b8").addEventListener("click", (evt) => { vibe(8);});
document.getElementById("b9").addEventListener("click", (evt) => { vibe(9);});*/

clock.ontick = (evt) => {
  //let today = evt.date;
  tick();
}
function animateCancel(){
  timeText.animate("disable");
  batteryBlock.animate("disable");
  hrBlock.animate("disable");
  batteryText.animate("disable");
  hrText.animate("disable");

  timeText.animate("mouseup");
  batteryBlock.animate("mouseup");
  hrBlock.animate("mouseup");
}
function animateHour(){
  timeText.animate("enable");
  batteryBlock.animate("disable");
  hrBlock.animate("disable");
  batteryText.animate("disable");
  hrText.animate("disable");

  timeText.animate("mouseup");
  batteryBlock.animate("mousedown");
  hrBlock.animate("mousedown");
}
function animateMinute(){
  timeText.animate("activate");
  batteryBlock.animate("disable");
  hrBlock.animate("disable");
  batteryText.animate("disable");
  hrText.animate("disable");

  timeText.animate("mouseup");
  batteryBlock.animate("mousedown");
  hrBlock.animate("mousedown");
}
function animateBattery(){
  timeText.animate("disable");
  batteryBlock.animate("enable");
  hrBlock.animate("disable");
  batteryText.animate("enable");
  hrText.animate("disable");

  timeText.animate("mousedown");
  batteryBlock.animate("mouseup");
  hrBlock.animate("mousedown");
}
function animateHR(){
  timeText.animate("disable");
  batteryBlock.animate("disable");
  hrBlock.animate("enable");
  batteryText.animate("disable");
  hrText.animate("enable");

  timeText.animate("mousedown");
  batteryBlock.animate("mousedown");
  hrBlock.animate("mouseup");
}
function tick(){
  if(vibeRunning == vibeActual) return;
  let today = new Date();
  hours=today.getHours();
  //hours=12;
  if (true || preferences.clockDisplay === "12h") {
    // 12h format
    hours = (hours % 12 || 12);
    if(hours < 10) hours=" "+hours;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  mins = util.zeroPad(today.getMinutes());
  timeText.text = `${hours}:${mins}`;
  hrText.text=(bodyPresent)?hrbpm:"--";
  chargeLevel=battery.chargeLevel;
  let charging=(battery.charging || charger.connected);
  if(charging) batteryIcon.href="images/battery-c.png";
  else batteryIcon.href="images/battery-"+(Math.round(chargeLevel/20)*20)+".png";
  /*{
    if(chargeLevel < 25) batteryIcon.href="images/battery-empty.png";
    if(chargeLevel >= 25 && chargeLevel < 80) batteryIcon.href="images/battery-half.png";
    if(chargeLevel >=80) batteryIcon.href="images/battery-full.png";
  }*/
  batteryText.text=chargeLevel;
}



function startVibe(number,last,vibeR,type,delay){
  if(vibeR != vibeActual) return 0;
  let pattern=[C.VibeEmpty];
  let sumTime=C.Vibes[C.VibeEmpty].time+C.VibePause;
  let n1=Math.floor(number/10);
  let n2=number%10;
  let longNum=pattern.length;
  for(let a=0 ; a<n1 ; a++) {
    pattern[a+longNum]=C.VibeLong;
    sumTime+=C.Vibes[C.VibeLong].time+C.VibePause;
  }
  //if(pattern.length==1){
    pattern[pattern.length]=C.VibeEmpty;
    sumTime+=C.Vibes[C.VibeEmpty].time+C.VibePause;
  //}
  longNum=pattern.length;
  for(let a=0 ; a<n2 ; a++) {
    pattern[a+longNum]=C.VibeShort;
    sumTime+=C.Vibes[C.VibeShort].time+C.VibePause;
  }
  
  //if(pattern.length==1){
    pattern[pattern.length]=C.VibeEmpty;
    sumTime+=C.Vibes[C.VibeEmpty].time+C.VibePause;
  //}
  if(!last){
    pattern[pattern.length]=C.VibeNext;
    sumTime+=C.Vibes[C.VibeNext].time+C.VibePause;
  }
  if(!delay){
    if(type==C.TypeHour) animateHour();
    if(type==C.TypeMinute) animateMinute();
    if(type==C.TypeBattery) animateBattery();
    if(type==C.TypeHR) animateHR();
    doVibe(pattern,vibeR);
  }
  else {
    setTimeout(function(){startVibe(number,last,vibeR,type)},delay);
  }
  return sumTime;
}
function doVibe(pattern,vibeR){
  if(!pattern || !Array.isArray(pattern) || !pattern.length || vibeR != vibeActual) return;
  let type=pattern.shift();
  vibe(type);
  if(pattern.length) setTimeout(function(){
    if(vibeR == vibeActual) doVibe(pattern,vibeR);
  },C.VibePause+C.Vibes[type].time);
  else if(type !=C.VibeNext) {
    vibeActual++;
    setTimeout(function(){
      animateCancel();
    },500);
  }
}
let vibeStopTimer=null;
function vibe(vibeId,stop){
  //String: "alert" (z-z z Zzzzz, 1000) (nem áll meg) | "bump" (Z, 50) | "confirmation" (z, 100) | "confirmation-max" (Z, 100) | "nudge" (z, 200) | "nudge-max" (Z, 200) | "ping" (Z-Z, 400) | "ring" (z-z-z-Zzzzzz)(nem áll meg)
  display.poke();
  if(!C.Vibes[vibeId].pattern) return;
  bg.style.fill=C.Vibes[vibeId].color;
  vibeStopTimer=setTimeout(function(){
    vibration.stop();
    bg.style.fill="black";
    vibeStopTimer=null;
    //if(!type) vibe(actualVibe,1);
  },C.Vibes[vibeId].time);
  if(!stop) vibration.start(C.Vibes[vibeId].pattern);
  else{
    if(vibeStopTimer){
      clearTimeout(vibeStopTimer);
    }
    vibration.stop();
    bg.style.fill="black";
    vibeStopTimer=null;
    setTimeout(function(){vibe(vibeId);},250);
  }
  //document.getElementById("vibe").text=C.Vibes[vibeId].pattern+" "+C.Vibes[vibeId].time;
  
}





function log(message){
  if(C.APP_LOG) console.log(message);
}
