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

     // sceneB
     // чистенький двухэтажный дом (object3)
     // bldobject3Hidden: scrXLeft:330, scrXRight:372, scrYTop:440, scrYDown:482
     // чистенький шестигранный дом(object4)
     // bldobject3Hidden: scrXLeft:1702, scrXRight:1728, scrYTop:136, scrYDown:190
     // object5 - дом с забором, попадает краем в сцену B, но анимация
     // в сцене B не видна

     // sceneC 
     // дом с забором (object5)
     // bldobject5Hidden: scrXLeft:806, scrXRight:852, scrYTop:382, scrYDown:406
     // три ветхих домика (object1), заходящих на следующую сцену A
     // bldobject1Hidden object1: scrXLeft:2018, scrXRight:2050, scrYTop:440, scrYDown:488
     // bldobject1Hidden object1: scrXLeft:2274, scrXRight:2300, scrYTop:330, scrYDown:360
     // слон из третьего домика участия в этой сцене не принимает
     
     // sceneA 
     // три ветхих домика (object1)
     // слоны из первых двух домиков участия в сцене A не принимает
     // bldobject1Hidden object1: scrXLeft:328, scrXRight:372, scrYTop:428, scrYDown:500
     // длинный дом-сарай
     // bldobject2Hidden object1: scrXLeft:1268, scrXRight:1290, scrYTop:468, scrYDown:506
     // bldobject2Hidden object1: scrXLeft:1584, scrXRight:1618, scrYTop:374, scrYDown:432
     
     var currentSceneName:string;
     var myResizeObserver : ResizeObserver;
}
export {}