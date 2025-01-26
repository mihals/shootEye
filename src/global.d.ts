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

     type Achievments = {
          numAttempts:number,
          numKilledGangs:number,
     }

     var plrAchievments:Achievments;

     /** живучесть слона в процентах */
     var elStrength:number;

     /** текущее значение уничтоженных слонов суммарное количество слонов 
      * в игре = 9, последние два за тумбой считаются за одного*/
     var numKilledGangs:number;
}
export {}