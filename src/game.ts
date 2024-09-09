import * as Phaser from 'phaser';
import {Demo} from './demo'
import { SceneB } from './sceneB';

let myGame: Phaser.Game;

export function startGame(){
    
    const config = {
    
        type: Phaser.AUTO,
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
        scene: [ Demo, SceneB],
        //render :render,
    };
    myGame = new Phaser.Game(config);
}

