import * as Phaser from 'phaser';
import { BallsKeeper } from './ballsKeeper';
import { Ball } from './ballsKeeper';
import { Colors } from './ballsKeeper';


export class Demo extends Phaser.Scene
{
    infoText:Phaser.GameObjects.Text;
    //bimbo:Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody;
    bimbo:Phaser.GameObjects.Image;
    bimboGrp:Phaser.Physics.Arcade.Group;
    myBallsKeeper:BallsKeeper;
    wallBody:Phaser.Physics.Arcade.Image;

    debugText:Phaser.GameObjects.Text;
    figureOver:boolean;
    bodyOver:boolean;
    contrAngle:number;
    deltaAbsY:number;

    constructor ()
    {
        super('demo');
        this.contrAngle = 60*Math.PI/180;
        //0.7071067812 = sqrt(2)/2 = sin(45) = cos(45)
        //113,137084992 = 160(половина размаха ушей бимбы) * cos(45)
    }  

    preload ()
    {
        this.load.image("empty","assets/empty.png")
        this.load.image("whiteBall","assets/whiteBall.png")
        this.load.image("redBall","assets/redBall.png")

        
        this.load.image("bronzTop","assets/bronzTop.png")
        this.load.image("bronzTopRight","assets/bronzTopRight.png")
        this.load.image("bronzTopLeft","assets/bronzTopLeft.png")
        this.load.image("bronzTopLeftRight","assets/bronzTopLeftRight.png")
    }

    create ()
    {
        globalThis.currentScene = this;


        this.wallBody = this.physics.add.image(450, 10, "empty");
        this.wallBody.body.setSize(100,10);
        this.wallBody.setImmovable();


        // размер 300 на 180
        //this.bimbo = this.add.image(450,800,"elephMaket");
        this.bimboGrp = new Phaser.Physics.Arcade.Group(this.physics.world, this)
        //this.bimboGrp.add(this.bimbo);
        
        this.bimboGrp.add(this.add.image(336,1200,"bronzTop").
            setData({left: Colors.Bronze, right:Colors.Bronze}))
        this.bimboGrp.add(this.add.image(564,800,"bronzTop").
            setData({left: Colors.Bronze, right:Colors.Bronze}));
        this.bimboGrp.add(this.add.image(336,400,"bronzTop").
            setData({left: Colors.Bronze, right:Colors.Bronze}))

        this.bimboGrp.getChildren().forEach((obj) => {
            let locObj = obj as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody;
            if(locObj.body.gameObject.y != 800){
                locObj.body.setAngularVelocity(30);
            }else{
                locObj.body.setAngularVelocity(-30);
            }
        })

        

        this.figureOver = false;
        this.bodyOver = false;

        this.debugText = this.add.text(20,20,"empty");
        this.debugText.setColor('fffffff');
        this.debugText.setFontSize(40);

        this.debugText.setText(
            `overlap body:${this.bodyOver} 
overlap figure:${this.figureOver}`)

        this.myBallsKeeper = new BallsKeeper(this)

        this.infoText = this.add.text(14,4,'').setStyle({fontFamily: 'Arial, Roboto',
            fill:'black', fontSize: '24px'});

        //this.add.image(220,320,"bimbo");

        
        //this.bimbo.body.setAngularVelocity(-10)

        this.input.on('pointerdown', (pointer) => {
            if (pointer.x > 450){
                this.myBallsKeeper.fireBall()
            }
        })

        // обработчик столкновений слоников с красными шарами
        // this.physics.add.overlap( this.bimboGrp, this.myBallsKeeper.myRedBalls,
        //     (target, ball) => {
        //         let locBimbo = target as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody;
        //         let radAngle: number = locBimbo.body.gameObject.angle * Math.PI / 180;
        //         this.bodyOver = true;
        //         // углы поворота бимбы, при которых его левое ухо находится
        //         // в зоне поражения правым шаром
        //         //this.bimbo.angle<this.contrAngle && this.bimbo.angle>-this.contrAngle
        //         if (radAngle < this.contrAngle && radAngle > -this.contrAngle) {
        //             this.figureOver = true;
        //             this.deltaAbsY = (ball as Ball).body.deltaAbsY()
        //             if ((ball as Ball).y < locBimbo.body.gameObject.y + 150 * Math.sin(radAngle)) {
        //                 // пытаемся исключить случай, когда ухо проворачивается в зону
        //                 // поражения после того, как шар пролетел точку соударения,
        //                 // но из зоны поражения ещё не вылетел 
        //                 if ((ball as Ball).y + (ball as Ball).body.deltaAbsY() <
        //                     locBimbo.body.gameObject.y + 150 * Math.sin(radAngle)) {
        //                     this.deltaAbsY = (ball as Ball).body.deltaAbsY()
        //                     return false;
        //                 }
        //                 (ball as Ball).hide();
        //                 locBimbo.body.gameObject.angle -= 10;
        //                 if(locBimbo.data.values.left != Colors.Red){
        //                     this.changeColor(locBimbo, "left", Colors.Red);
        //                     this.debugText.setText(locBimbo.data.values.left);
        //                 }
        //             }
        //             return true;
        //         } else
        //             // углы поворота бимбы, при которых его правое ухо находится
        //             // в зоне поражения правым шаром
        //             //(this.bimbo.angle < -180 + this.contrAngle ||
        //             //      this.bimbo.angle > 180 - this.contrAngle)
        //             if (radAngle < -Math.PI + this.contrAngle || radAngle > Math.PI - this.contrAngle) {
        //                 this.figureOver = true;
        //                 this.deltaAbsY = (ball as Ball).body.deltaAbsY()
        //                 if ((ball as Ball).y < locBimbo.body.gameObject.y - 150 * Math.sin(radAngle)) {
        //                     // пытаемся исключить случай, когда ухо проворачивается в зону
        //                     // поражения после того, как шар пролетел точку соударения,
        //                     // но из зоны поражения ещё не вылетел 
        //                     if ((ball as Ball).y + (ball as Ball).body.deltaAbsY() <
        //                         locBimbo.body.gameObject.y - 150 * Math.sin(radAngle)) {
        //                         this.deltaAbsY = (ball as Ball).body.deltaAbsY()
        //                         return false;
        //                     }
        //                     (ball as Ball).hide();
        //                     locBimbo.body.gameObject.angle -= 10;
        //                     if(locBimbo.data.values.right != Colors.Red){
        //                         this.changeColor(locBimbo, "right", Colors.Red);
        //                         this.debugText.setText(locBimbo.data.values.left);
        //                     }
        //                 }
        //                 return true;
        //             }
        //         this.infoText.setText("OVERLAPED");
        //         return false;
        //     })

            // обработчик столкновений слоников с белыми шарами
            this.physics.add.overlap(this.bimboGrp,[this.myBallsKeeper.myRedBalls,
                this.myBallsKeeper.myWhiteBalls], (target,ball ) => {
                let locBall = ball as Ball;
                let locBimbo = target as Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody;
                let radAngle:number = locBimbo.body.gameObject.angle*Math.PI/180;
                this.bodyOver = true;
                // углы поворота бимбы, при которых его левое ухо находится
                // в зоне поражения шаром справа и правое ухо бимбы, который 
                // находится в зоне поражения шаром слева
                //this.bimbo.angle<this.contrAngle && this.bimbo.angle>-this.contrAngle
                    if (radAngle < this.contrAngle && radAngle > -this.contrAngle) {
                        this.figureOver = true;
                        this.deltaAbsY = (ball as Ball).body.deltaAbsY()
                        // если бимба слева от шара
                        if ((ball as Ball).x > locBimbo.body.gameObject.x) {
                            if ((ball as Ball).y <= locBimbo.body.gameObject.y + 
                                150 * Math.sin(radAngle)) {
                                // пытаемся исключить случай, когда ухо проворачивается в зону
                                // поражения после того, как шар пролетел точку соударения,
                                // но из зоны поражения ещё не вылетел 
                                // if((ball as Ball).y + (ball as Ball).body.deltaAbsY() < 
                                //     locBimbo.body.gameObject.y + 150*Math.sin(radAngle))
                                //     {
                                //         this.deltaAbsY = (ball as Ball).body.deltaAbsY()
                                //         return false;
                                // }
                                
                                (ball as Ball).hide();
                                locBimbo.body.gameObject.angle -= 10;
                                //if (locBimbo.data.values.left != Colors.White) {
                                //let color:Colors = (ball as Ball).data.values.color 
                                this.changeColor(locBimbo, "left", (ball as Ball).data.values.color);
                                this.debugText.setText(locBimbo.data.values.left);
                                //}
                                return true;
                            }
                        }
                        // случай когда бимба справа от шара
                        else{
                            // если шар коснулся уха
                            if ((ball as Ball).y <= locBimbo.body.gameObject.y - 150 * Math.sin(radAngle)) {
                                (ball as Ball).hide();
                                locBimbo.body.gameObject.angle += 10;
                                //if (locBimbo.data.values.right != Colors.White) {
                                this.changeColor(locBimbo, "right", (ball as Ball).data.values.color);
                                this.debugText.setText(locBimbo.data.values.right);
                                //}
                            }
                        }
                        return true;
                    } else
                        // углы поворота бимбы слева от шара, при которых его правое ухо находится
                        // в зоне поражения и для бимбы справа от шара, при которых его левое
                        // ухо будет в зоне поражения
                        if (radAngle < -Math.PI + this.contrAngle || radAngle > Math.PI - this.contrAngle) {
                            this.figureOver = true;
                            this.deltaAbsY = (ball as Ball).body.deltaAbsY()
                            // если бимба слева от шара
                            if ((ball as Ball).x > locBimbo.body.gameObject.x) {
                                if (locBall.y < locBimbo.body.gameObject.y - 150 * Math.sin(radAngle)) {
                                    // if ((ball as Ball).y + (ball as Ball).body.deltaAbsY() <
                                    //     locBimbo.body.gameObject.y - 150 * Math.sin(radAngle)) {
                                    //     this.deltaAbsY = (ball as Ball).body.deltaAbsY()
                                    //     return false;
                                    // }
                                    (ball as Ball).hide();
                                    locBimbo.body.gameObject.angle -= 10;
                                    //if (locBimbo.data.values.right != Colors.White) {
                                    this.changeColor(locBimbo, "right", (ball as Ball).data.values.color);
                                    this.debugText.setText(locBimbo.data.values.right);
                                    //}
                                }
                                return true;
                            }
                            // если бимба справа от шара
                            else{
                                if ((ball as Ball).y < locBimbo.body.gameObject.y + 150 * Math.sin(radAngle)) {
                                    // if ((ball as Ball).y + (ball as Ball).body.deltaAbsY() <
                                    //     locBimbo.body.gameObject.y - 150 * Math.sin(radAngle)) {
                                    //     this.deltaAbsY = (ball as Ball).body.deltaAbsY()
                                    //     return false;
                                    // }
                                    (ball as Ball).hide();
                                    locBimbo.body.gameObject.angle += 10;
                                    //if (locBimbo.data.values.left != Colors.White) {
                                    this.changeColor(locBimbo, "left", (ball as Ball).data.values.color);
                                    this.debugText.setText(locBimbo.data.values.left);
                                    //}
                                }
                                return true;
                            }
                        }
                    this.infoText.setText("OVERLAPED");
                    return false;
                })

        // this.physics.add.collider(this.wallBody, this.myBallsKeeper.myRedBalls,
        //     (wall, ball) => {
        //         (ball as Ball).bounceBall();
        //     })

        // this.physics.add.collider(this.wallBody, this.myBallsKeeper.myWhiteBalls,
        //     (wall, ball) => {
        //         (ball as Ball).bounceBall();
        //     })
    }

    update(time: number, delta: number): void {
        this.debugText.setText(
            `overlap body:${this.bodyOver} 
deltaAbsY :${this.deltaAbsY}
left color:${this.bimbo}`)
    }

    /** принимает объект, ухо которого надо закрасить, сторону, которую
     *  надо закрасить и цвет
     */
    changeColor(bimbo:Phaser.Types.Physics.Arcade.GameObjectWithDynamicBody,
                side:string, color:Colors)
    {
        if(bimbo.getData(side) == color) return;

        bimbo.setData(side,color);

        if(bimbo.data.values.left == Colors.Bronze && 
            bimbo.data.values.right == Colors.Bronze){
                bimbo.body.gameObject.setTexture("bronzTop");
                return;
        }

        if(bimbo.data.values.left == Colors.Bronze && 
            bimbo.data.values.right == Colors.Red){
                bimbo.body.gameObject.setTexture("bronzTopRight");
                return;
        }

        if(bimbo.data.values.left == Colors.Red && 
            bimbo.data.values.right == Colors.Bronze){
                bimbo.body.gameObject.setTexture("bronzTopLeft");
                return;
        }

        if(bimbo.data.values.left == Colors.Red && 
            bimbo.data.values.right == Colors.Red){
                bimbo.body.gameObject.setTexture("bronzTopLeftRight");
                return;
        }
    }
}