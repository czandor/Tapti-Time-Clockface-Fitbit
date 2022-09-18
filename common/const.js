import { me as device } from "device";
import * as util from "../common/utils";
util.setDevice(device);

import * as sense from "../common/const.sense";
import * as def from "../common/const.def";

//export const corners = (device.sense)?sense.corners:def.corners;
//export const drawSize = (device.sense)?sense.drawSize:def.drawSize;

export const APP_LOG=0;
export const DOUBLE_CLICK_TIMEOUT=500;

export const VibeTap=0;
export const VibeShort=4;
export const VibeLong=5;
export const VibeNext=10;
export const VibeEmpty=11;
export const VibeTop=3;
export const VibeConfirmTop=9;
export const VibeBottom=12;
export const VibeConfirmBottom=9;
export const VibeModeCancel=7;

export const Vibes=[{"pattern":"bump","time":50,"color":"gray"}, //0; "Z"
                    {"pattern":"confirmation","time":80,"color":"gray"}, //1; "zz"
                    {"pattern":"confirmation-max","time":80,"color":"white"}, //2; "ZZ"
                    {"pattern":"nudge","time":120,"color":"gray"},  //3; "zzz"
                    {"pattern":"nudge-max","time":120,"color":"white"}, //4; "ZZZ"
                    {"pattern":"ping","time":270,"color":"white"}, //5; "ZZ-ZZ"
                    {"pattern":"alert","time":1700,"color":"fb-red"}, //6; "z-z z Zzzzzzzz"
                    {"pattern":"ring","time":1500,"color":"fb-yellow"}, //7; "z-z-z-Zzzzzzzz"
                    {"pattern":"alert","time":800,"color":"fb-cyan"}, //8; "z-z z Zz"
                    {"pattern":"ring","time":600,"color":"fb-cyan"}, //9; "z-z-z-Zz"
                    {"pattern":"","time":300,"color":"white"}, //10; "  "
                    {"pattern":"","time":0,"color":"white"}, //11; ""
                    {"pattern":"ping","time":220,"color":"gray"}, //12; "Z-z"
                   ];
export const VibePause=700;
export const ModeWait=2000;

export const TypeHour=0;
export const TypeMinute=1;
export const TypeBattery=2;
export const TypeHR=3;

export const MONTHNAMES_DEFAULT= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const WEEKDAYS_DEFAULT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

