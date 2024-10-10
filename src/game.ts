import * as Phaser from 'phaser';
import {Preloader} from './preloader'
import {SceneA} from './sceneA'
import { SceneB } from './sceneB';
import { SceneC } from './sceneC';
import { SceneD } from './sceneD';



let myGame: Phaser.Game;

export function startGame(){
    
    const config = {
    
        type: Phaser.WEBGL,
        backgroundColor: '#bfc874',
        width: 1200,
        height: 675,
        parent: 'gameContainer',
        physics: {
            default: 'arcade',
            arcade: {
                debug: true,
            }
        },
        scale: {
            autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
            mode: Phaser.Scale.FIT
          },
        scene: [ Preloader, SceneC, SceneB, SceneA, SceneD],
        //render :render,
    };
    myGame = new Phaser.Game(config);
}

