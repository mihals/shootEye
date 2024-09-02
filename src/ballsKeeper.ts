import * as Phaser from 'phaser';
//import { Colors } from './demo';

export enum Colors {Bronze, Red};

export class BallsKeeper
{
    myRedBalls:Balls;
    myWhiteBalls:Balls;
    counter:number;

    constructor(scene:Phaser.Scene){
        this.myRedBalls = new Balls(scene, "redBall")
        this.myWhiteBalls = new Balls(scene, "whiteBall")
        this.counter = 0;
    }

    fireBall(){
        if(this.counter%2 == 0){
            this.myRedBalls.fireBall();
        }else{
            this.myWhiteBalls.fireBall();
        }
        this.counter++;
    }
}



class Balls extends Phaser.Physics.Arcade.Group
{
    myScene: Phaser.Scene
    blankShot:Phaser.Physics.Arcade.Sprite
    

    constructor (scene:Phaser.Scene, srcImg:string)
    {
        super(scene.physics.world, scene);

        this.myScene = scene;
        this.createMultiple({
            frameQuantity: 15,
            key: srcImg,
            active: false,
            visible: false,
            classType: Ball
        });

        // this.getChildren().forEach(element => {
        //     //element.name = srcImg;
        //     (element as Ball).setTexture("srcImg"); 
        // });
    }

    fireBall ()
    {
        const ball = this.getFirstDead(false);

        if (ball)
        {
            ball.setActive(true);
            ball.setVisible(true);
            ball.body.reset(450,1550)
            ball.body.setVelocityY(-500)
        }
    }
}


export class Ball extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y, srcImg)
    {
        super(scene, -100, -100, srcImg);
        if(srcImg == "redBall"){
            this.setData('color', Colors.Red);
        }else{
            this.setData('color', Colors.Bronze);
        }
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        if (this.y <= -50)
        {
            this.body.reset(-100,-100);
            this.setActive(false);
            this.setVisible(false);
        }
    }

    hide(){
        this.body.reset(-100,-100);
        this.setActive(false);
        this.setVisible(false);
    }

    bounceBall(){
        this.setVelocityY(500)
    }
}