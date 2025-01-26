import * as Phaser from 'phaser';

export class WinScene extends Phaser.Scene
{
    rbImg:Phaser.GameObjects.Image;
    constructor ()
    {
        super('winScene');
    }  

    init(data){
        
    }

    create ()
    {
        globalThis.currentScene = this;
        this.rbImg = this.add.image(600,350,"redBall");

        this.add.tween({
            targets:this.rbImg,
            props:{y:0},
            duration:500,
            yoyo:true
        })
    }

    update(time: number, delta: number): void {
        
    }
}