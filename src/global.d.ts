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

     var currentScene:Phaser.Scene;
     
     // var currentLevel: lvlNames;
     // var currentResult: GameState;
     // var achievments: Array<LvlState>;
     // var numStars:number;
     // var myUIBlocks:UIBlocks;
     
     var currentSceneName:string;
     var myResizeObserver : ResizeObserver;
}
export {}