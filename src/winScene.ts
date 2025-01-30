import * as Phaser from 'phaser';
import { recoverData } from './preloader';

export class WinScene extends Phaser.Scene
{
    rbImg:Phaser.GameObjects.Image;
    x:number;
    constructor ()
    {
        super('winScene');
    }  

    init(data){
        this.x=data.x;
    }

    create ()
    {
        // globalThis.currentScene = this;
        // this.rbImg = this.add.image(600,350,"atlas0", "moneyPiece");

        // this.add.tween({
        //     targets:this.rbImg,
        //     props:{y:0},
        //     duration:500,
        //     yoyo:true
        // })

        const emitter = this.add.particles(600, 100, 'atlas0', {
            frame: [ 'goldEl' ],
            speed: 300,
            gravityY: 400,
            lifespan: 4000,
            scale: 0.3,
            duration:5000,
            
            blendMode: 'ADD',
        });

        emitter.on('complete', () => {
            globalThis.currentScene.scene.stop();
            recoverData({numKilledGangs:0, numAttempts:0}, "sceneB")
            this.scene.start("sceneB");
        });
    }

    update(time: number, delta: number): void {
        
    }
}