// import { lvlNames } from "./enums";
// import { GameState } from "./enums";
// import { LvlState } from "./enums";
// import { UIBlocks } from "./uiblocks";
import * as Phaser from "phaser";
declare global{
     var gYsdk;
     var gPlayer;
     var gData;
     var lang: string;

     type MotionDir = {
          toRight:boolean,
          toLeft:boolean,
          toUp:boolean,
          toDown:boolean,
     }

     var directions:MotionDir;

     var currentScene:Phaser.Scene;
     
          
     var currentSceneName:string;
     var myResizeObserver : ResizeObserver;

     
}
export {}