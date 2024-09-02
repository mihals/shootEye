import * as Phaser from 'phaser';
import {Demo} from './demo'

let myGame: Phaser.Game;

export function startGame(){
    
    const config = {
    
        type: Phaser.AUTO,
        backgroundColor: '#bfc874',
        width: 900,
        height: 1600,
        parent: 'gameContainer',
        physics: {
            default: 'arcade',
            arcade: {
                debug: false,
            }
        },
        scale: {
            autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
            mode: Phaser.Scale.FIT
          },
        scene: [ Demo],
        //render :render,
    };
    myGame = new Phaser.Game(config);
}

