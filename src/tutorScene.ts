import * as Phaser from 'phaser';
import { PersonMap } from './preloader';
import { ObjectMap } from './preloader';
import { objectsArr } from './preloader';
import {STATE } from './preloader';
//import { score } from './preloader';
import { myScoreChecker } from './preloader';

interface MessageTexts{
    tapRight: string,
    tapLeft: string,
    dragAim: string,
    pushToAim:string,
    killGang:string,
    forDesktop:string,
    titleMsg:string,
    skipTutor:string
}

export class TutorScene extends Phaser.Scene
{
    msgTxtObj:MessageTexts;
    msgTxtObjRu:MessageTexts;
    msgTxtObjEn:MessageTexts;

    infoText:Phaser.GameObjects.Text;
    //tutorAnim:Phaser.Animations.Animation;

    tutEl:Phaser.GameObjects.Sprite;
    tutTimeLine:Phaser.Time.Timeline;

    /** подложки прямоугольники для надписей-подсказок жми слева(справа) */
    bubbleForText:Phaser.GameObjects.Image;
    //leftTapBubble:Phaser.GameObjects.Graphics;

    /** подложка прямоугольник для надписи-подсказки тащи прицел */
    dragGunAimBubble:Phaser.GameObjects.Graphics;

    /** текст для надписи на подложках */
    txtForBubble:Phaser.GameObjects.Text;



    //object2Map:ObjectMap;
    // startKey:boolean;
    emptyAnchor:Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    // cursors:Phaser.Types.Input.Keyboard.CursorKeys;
    // direction:string;
    // fireKey:Phaser.Input.Keyboard.Key;
    // sceneObjArr:Array<ObjectMap>;

    /** массив объектов конфигураций для анимаций, используемых
     * для данной сцены */
    animsArr: Array<Phaser.Types.Animations.Animation>;
    
    gunAimX:number;
    gunAimY:number;

    barsContainer:Phaser.GameObjects.Container;

    //debugText:Phaser.GameObjects.Text;
    anchorX:number;
    anchorY:number;
    
    goldEl:Phaser.GameObjects.Image;
    hand:Phaser.GameObjects.Image;
    leftHand:Phaser.GameObjects.Image;

    flashSpr:Phaser.GameObjects.Sprite;

    domElement:Phaser.GameObjects.DOMElement;

    constructor ()
    {
        super('tutorScene');

        this.gunAimY = 350;

        this.msgTxtObjRu = {
            tapRight: "На тачскрине жми справа, чтобы двигать прицел вправо.",
            tapLeft: "На тачскрине жми слева, чтобы двигать прицел влево.",
            dragAim: "Перетаскивай прицел вверх-вниз.",
            pushToAim: "Жми на прицел, стреляй ему в ухо, чтобы выманить.",
            killGang: "Уничтожь бандита и получи награду.",
            forDesktop: "На десктопе стреляет клавиша 'S', прицел перемещается клавишами-стрелками.",
            titleMsg: "Управление на десктопе и тачскрине.",
            skipTutor: "Пропустить."
        }

        this.msgTxtObjEn = {
            tapRight: "On the touchscreen, press on the right to move the gunsight to the right.",
            tapLeft: "On the touchscreen, press left to move the gunsight to the left.",
            dragAim: "Drag the gunsight up and down.",
            pushToAim: "Click on the gunsight, shoot him in the ear to lure him out.",
            killGang: "Destroy the bandit and get a reward.",
            forDesktop: "The 'S' key fires on the desktop, the gunsight moves with the arrow keys.",
            titleMsg: "Control on the desktop and touchscreen.",
            skipTutor: "&nbspSKIP.&nbsp"
        }

        //globalThis.lang = "en";
        //this.msgTxtObj = globalThis.lang == "ru"?this.msgTxtObjRu:this.msgTxtObjEn;

        //this.msgTxtObj = this.msgTxtObjEn;

        globalThis.directions = {toRight: false, toLeft: false,
            toUp:false, toDown: false};

        //this.contrAngle = 60*Math.PI/180;
        //0.7071067812 = sqrt(2)/2 = sin(45) = cos(45)
        //113,137084992 = 160(половина размаха ушей бимбы) * cos(45)
    }  

    create ()
    {
        globalThis.currentScene = this;
        globalThis.numKilledGangs = 0;
        this.msgTxtObj = globalThis.lang == "ru"?this.msgTxtObjRu:this.msgTxtObjEn;

        // объект находится и в соседней сцене
        objectsArr[0].objectX = 2947;
        objectsArr[0].objectY = 410;

        //this.sceneObjArr = [objectsArr[0], objectsArr[4]];

        this.cameras.main.setBounds(0,0,3600,675);
        this.physics.world.setBounds(0,0,3600,675);

        this.add.image(600,608,'atlas0','groundL')
        this.add.image(1800,608,'atlas0','groundL').setFlipX(true);
        this.add.image(3000,608,'atlas0','groundL')
        
        
        this.add.image(600,273,'atlas0','landscapeL');
        this.add.image(1800,273,'atlas0','landscapeL').setFlipX(true);
        //this.add.image(2400,273,'landscapeL');
        this.add.image(3000,273,'atlas0','landscapeL')//.setFlipX(true);
        
        this.add.image(657,352,'atlas0','tutorBld');
        this.anims.create({
            key: 'tutorAnim',
            frames: [
                {frame:'tutFr1', key: 'atlas0'},
                { frame: 'tutFr2', key: 'atlas0'},
                { frame: 'tutFr3', key: 'atlas0'},
                { frame: 'tutFr4', key: 'atlas0'}
            ],
            frameRate: 5,
            repeat: 0
        });

        this.tutEl = this.add.sprite(692,449,'atlas0','tutFr1');
        //this.tutEl.play('tutorAnim');
        this.add.image(572,456,'atlas0','tutorBox');

        this.emptyAnchor = this.physics.add.image(600, 150,'atlas0', 'emptyAnchor').setDepth(5);
        this.cameras.main.startFollow(this.emptyAnchor, true);
        this.hand = this.add.image(1000,300,'atlas0','hand').setAlpha(0);
        this.leftHand = this.add.image(700,300,'atlas0',"hand").setFlipX(true).setAlpha(0);

        this.flashSpr = this.add.sprite(710, 460, 'atlas0',"empty");
        
        // золотая монетка - бонус, премия за подбитого слона
        this.goldEl = this.add.image(0,0,'atlas0', "empty");


        //this.debugText = this.add.text(10,30,"");
        //this.debugText.setFontSize(64)

        myScoreChecker.drawBars(this);
        this.prepareBubbles();

        let domStr:string = `<div id="flexContainer">
            <div id="msgDiv"><span>`+ this.msgTxtObj.titleMsg + `</span></div>
            <div id="btnDiv"><button><span class="skipTxt">` +this.msgTxtObj.skipTutor +
            `</span></button></div></div>`;

        this.domElement = this.add.dom(600,625,'div');
        this.domElement.setHTML(domStr);
        this.domElement.addListener('click');
        this.domElement.on('click', (evt) => {
            let btnDiv = document.getElementById("btnDiv");

            if(btnDiv.contains(evt.target))
            {
                this.domElement.removeAllListeners('click');
                this.tweens.add({
                    targets: this.domElement,
                    y: 800,
                    duration: 1000,
                    loop: 0,
                    onComplete: () => {
                        this.scene.start("sceneB");
                    }
                });
            }
        });

        this.tutTimeLine = this.add.timeline([
            {
                at: 500,
                run: () => {
                    this.add.tween({
                        targets: [this.bubbleForText, this.txtForBubble],
                        props: { alpha: { value: 1, duration: 500 } }
                    });
                }
            },
            {
                from: 3500,
                run: () => {
                    this.add.tween({
                        targets: [this.bubbleForText, this.txtForBubble],
                        props: { alpha: { value: 0, duration: 500 } }
                    });
                }
            },
            {
                from: 500,
                run: () => {
                    this.bubbleForText.setPosition(992,112);
                    this.txtForBubble.setText(this.msgTxtObj.tapRight);
                    let txtBnd = this.txtForBubble.getBounds();
                    this.txtForBubble.setPosition(this.bubbleForText.x - txtBnd.width/2 - 5,
                    this.bubbleForText.y - txtBnd.height/2 - 5);
                    this.add.tween({
                        targets: [this.bubbleForText, this.txtForBubble],
                        props: { alpha: { value: 1, duration: 500 } }
                    });
                }
            },
            {
                from: 500,
                run: () => {
                    this.add.tween({
                        targets: [this.bubbleForText, this.txtForBubble],
                        props: { alpha: { value: 1, duration: 500 } }
                    });
                }
            },
            {
                from: 500,
                run: () => {
                    this.add.tween({
                        targets: this.hand,
                        props: { alpha: { value: 1, duration: 2000 } }
                    });
                }
            },
            {
                from: 2100,
                run: () => {
                    this.add.tween(
                        {
                            targets: [this.emptyAnchor, this.hand, this.bubbleForText,
                                 this.txtForBubble, this.domElement],
                            props: {
                                x: { value: '+=500', duration: 4000 },
                                //y:{value:300, duration: 1200}
                            }
                        }
                    )
                }
            },
            {
                from: 4100,
                run: () => {
                    this.add.tween({
                        targets: [this.hand,this.bubbleForText, this.txtForBubble],
                        props: { alpha: { value: 0, duration: 500 } }
                    })
                }
            },
            {
                from: 600,
                run: () => {
                    this.bubbleForText.setPosition(742,112);
                    this.txtForBubble.setText(this.msgTxtObj.tapLeft);
                    let txtBnd = this.txtForBubble.getBounds();
                    this.txtForBubble.setPosition(this.bubbleForText.x - txtBnd.width/2 - 5,
                    this.bubbleForText.y - txtBnd.height/2 - 5);

                    this.add.tween({
                        targets: [this.leftHand, this.txtForBubble,this.bubbleForText],
                        props: { alpha: { value: 1, duration: 500 } }
                    });
                }
            },
            {
                from: 600,
                run: () => {
                    this.add.tween(
                        {
                            targets: [this.emptyAnchor, this.leftHand, this.txtForBubble,
                                this.bubbleForText, this.domElement],
                            props: {
                                x: { value: '-=450', duration: 4000 },
                            }
                        }
                    )
                }
            },
            {
                from: 4000,
                run: () => {
                    this.add.tween(
                        {
                            targets: [this.txtForBubble, this.bubbleForText],
                            props: {
                                alpha: { value: 0, duration: 500 },
                            }
                        }
                    )
                }
            },
            {
                from: 500,
                run: () => {
                    this.add.tween(
                        {
                            targets: [this.txtForBubble, this.bubbleForText],
                            props: {
                                alpha: { value: 0, duration: 500 },
                            }
                        }
                    )
                }
            },
            {
                from: 500,
                run: () => {
                    this.hand.setX(1000);
                    this.bubbleForText.setPosition(942,112);
                    this.txtForBubble.setText(this.msgTxtObj.dragAim);
                    let txtBnd = this.txtForBubble.getBounds();
                    this.txtForBubble.setPosition(this.bubbleForText.x - txtBnd.width/2 - 5,
                    this.bubbleForText.y - txtBnd.height/2 - 5);
                    this.add.tween(
                        {
                            targets: [ this.hand, this.txtForBubble, this.bubbleForText],
                            props: {
                                alpha: { value: 1, duration: 400 },
                            }
                        }
                    )
                }
            },
            {
                from: 600,
                run: () => {
                    this.add.tween(
                        {
                            targets: [this.emptyAnchor, this.hand],
                            props: {
                                y: { value: '+=270', duration: 2000 },
                            }
                        }
                    )
                }
            },
            {
                from: 2100,
                run: () => {
                    this.add.tween(
                        {
                            targets: [this.leftHand, this.hand],
                            props: {
                                alpha: { value: 0, duration: 200 },
                            }
                        }
                    )
                }
            },
            // убираем предыдущую надпись, выводим надпись "Жми на прицел..."
            {
                from: 300,
                run: () => {
                    this.add.tween(
                        {
                            targets: this.txtForBubble,
                            props: {
                                alpha: { value: 0, duration: 200 },
                            }
                        }
                    )
                }
            },
            {
                from: 300,
                run: () => {
                    this.txtForBubble.setText(this.msgTxtObj.pushToAim);
                    let txtBnd = this.txtForBubble.getBounds();
                    this.txtForBubble.setPosition(this.bubbleForText.x - txtBnd.width/2 - 5,
                        this.bubbleForText.y - txtBnd.height/2 - 5);
                    this.add.tween(
                        {
                            targets: this.txtForBubble,
                            props: {
                                alpha: { value: 1, duration: 300 },
                            }
                        }
                    )
                }
            },
            {
                from: 300,
                run: () => {
                    this.hand.setX(this.emptyAnchor.x).setY(this.emptyAnchor.y).
                        setDepth(7);
                    this.add.tween(
                        {
                            targets: this.hand,
                            props: {
                                alpha: { value: 1, duration: 200 },
                            }
                        }
                    )
                }
            },
            {
                from: 300,
                run: () => {
                    this.add.tween(
                        {
                            targets: this.hand,
                            props: {
                                scale: { value: 0.5, duration: 200 },
                            }
                        }
                    )
                }
            },
            {
                from: 200,
                run: () => {
                    this.shootToPerson(this.emptyAnchor.x,this.emptyAnchor.y);
                }
            },
            {
                from: 500,
                run: () => {
                    this.add.tween(
                        {
                            targets: this.hand,
                            props: {
                                alpha: { value: 0, duration: 200 },
                            }
                        }
                    )
                    this.tutEl.play('tutorAnim');
                }
            },
            // 710, 460   660,460
            // слон начинает стрельбу
            {
                from: 1000,
                run: () => {
                    this.add.tween({
                        targets:[this.txtForBubble, this.bubbleForText],
                        props:{
                            alpha:{value:0, duration: 500}}
                    })
                    this.flashSpr.setPosition(710, 460).setTexture('atlas0',"bigFlash");
                    this.cameras.main.flash(350, 255, 0, 0);
                }
            },
            {
                from: 300,
                run: () => {
                    this.flashSpr.setPosition(710, 460).setTexture('atlas0',"empty");
                }
            },
            {
                from: 500,
                run: () => {
                    this.flashSpr.setPosition(660, 460).setTexture('atlas0',"bigFlash");
                    this.cameras.main.flash(350, 255, 0, 0);
                }
            },
            {
                from: 300,
                run: () => {
                    this.flashSpr.setTexture('atlas0',"empty");
                }
            },
            {
                from: 500,
                run: () => {
                    this.flashSpr.setPosition(710, 460).setTexture('atlas0',"bigFlash");
                    this.cameras.main.flash(350, 255, 0, 0);
                }
            },
            {
                from: 300,
                run: () => {
                    this.flashSpr.setTexture('atlas0',"empty");
                }
            },
            {
                from: 100,
                run: () => {
                    this.txtForBubble.setText(this.msgTxtObj.killGang);
                    let txtBnd = this.txtForBubble.getBounds();
                    this.txtForBubble.setPosition(this.bubbleForText.x - txtBnd.width/2 - 5,
                        this.bubbleForText.y - txtBnd.height/2 - 5);
                    this.add.tween({
                        targets:[this.txtForBubble, this.bubbleForText],
                        props:{alpha:{value:1, duration:500}}
                    });
                    this.flashSpr.setTexture('atlas0',"empty");
                }
            },
            {
                from: 300,
                run: () => {
                    this.hand.setX(this.emptyAnchor.x).setY(this.emptyAnchor.y).
                        setDepth(7);
                    this.add.tween(
                        {
                            targets: this.hand,
                            props: {
                                alpha: { value: 1, duration: 200 },
                            }
                        }
                    )
                }
            },
            {
                from: 300,
                run: () => {
                    this.add.tween(
                        {
                            targets: this.hand,
                            props: {
                                scale: { value: 0.5, duration: 200 },
                            }
                        }
                    )
                }
            },
            {
                from: 500,
                run: () => {
                    this.shootToPerson(this.emptyAnchor.x,this.emptyAnchor.y);
                }
            },
            {
                from: 1500,
                run: () => {
                    this.shootToPerson(this.emptyAnchor.x,this.emptyAnchor.y);
                }
            },
            {
                from: 1500,
                run: () => {
                    this.add.tween({
                        targets:[this.txtForBubble, this.bubbleForText, this.tutEl],
                        props:{alpha:{value:0, duration:500 }}
                    })
                }
            },
            {
                from: 500,
                run: () => {
                    this.goldEl.setPosition(680,460);
                    this.goldEl.setTexture('atlas0',"goldEl").setDepth(5);
                    this.tweens.add({
                        targets:this.goldEl,
                        scale: 0.3,
                        x: myScoreChecker.barsContainer.x + 280,
                        y: myScoreChecker.barsContainer.y,
                        duration: 1000,
                        onComplete: () => {
                            this.goldEl.setTexture('atlas0',"empty");
                            myScoreChecker.changeMoney(10);
                        }
                    })
                }
            },
            {
                from: 1000,
                run: () => {
                    this.bubbleForText.setPosition(600, 112);
                    this.txtForBubble.setText(this.msgTxtObj.forDesktop);
                    let txtBnd = this.txtForBubble.getBounds();
                    this.txtForBubble.setPosition(this.bubbleForText.x - txtBnd.width/2 - 5,
                        this.bubbleForText.y - txtBnd.height/2 - 5);
                    this.add.tween({
                        targets: [this.bubbleForText, this.txtForBubble],
                        props: {alpha: {value:1, duration: 500}}
                    });
                }
            },
            {
                from: 2000,
                run: () => {
                    this.domElement.removeAllListeners('click');
                    this.tweens.add({
                        targets: this.domElement,
                        y: 800,
                        duration: 1000,
                        loop: 0,
                        onComplete: () => {
                            this.scene.start("sceneB");
                        }
                    });
                }
            },
        ]).play();
    }

    update(time: number, delta: number): void {
        // this.debugText.setText(
        //     `scrollX:${this.cameras.main.scrollX}, Y:${this.emptyAnchor.y}`) ;
    }

    shootToPerson(x:number, y: number) {
        let fireSphereArr: Array<Phaser.GameObjects.Image> = [];
        let locPerson: PersonMap;
        this.add.timeline([
            {
                at: 0,
                run: () => {
                    fireSphereArr.push(this.add.image(x, y,'atlas0', "redBall"))
                    fireSphereArr[0].setScale(this.emptyAnchor.width / fireSphereArr[0].width,
                        this.emptyAnchor.height / fireSphereArr[0].height);

                    this.add.tween({
                        targets: fireSphereArr[0],
                        alpha: { from: 0, to: 1 },
                        scale: 0.1,
                        duration: 300,
                        onComplete: () => {
                            fireSphereArr[0].destroy()
                        }
                    })
                },
            },
            {
                from: 200,
                run: () => {
                    fireSphereArr.push(this.add.image(x, y,'atlas0', "redBall"))
                    fireSphereArr[1].setScale(this.emptyAnchor.width / fireSphereArr[1].width,
                        this.emptyAnchor.height / fireSphereArr[1].height);

                    this.add.tween({
                        targets: fireSphereArr[1],
                        alpha: { from: 0, to: 1 },
                        scale: 0.1,
                        duration: 300,
                        onComplete: () => {
                            fireSphereArr[1].destroy()
                        }
                    })
                },
            },
            {
                from: 200,
                run: () => {
                    fireSphereArr.push(this.add.image(x, y,'atlas0', "redBall"))
                    fireSphereArr[2].setScale(this.emptyAnchor.width / fireSphereArr[2].width,
                        this.emptyAnchor.height / fireSphereArr[2].height);

                    this.add.tween({
                        targets: fireSphereArr[2],
                        alpha: { from: 0, to: 1 },
                        scale: 0.1,
                        duration: 300,
                        onComplete: () => {
                            fireSphereArr[2].destroy();
                            myScoreChecker.changeAmmo(-5);
                            //if(this.elephShootTL.paused)
                                //this.elephShootTL.resume();
                        }
                    })
                },
            },
            // {
            //     run: () => {
            //     this.sceneObjArr.forEach((obj) => {
            //         if ("personArr" in obj) {
            //             obj.personArr.forEach((person) => {
            //             // если перс прячется
            //             if (person.state == STATE.HIDDEN) {
            //                 if (new Phaser.Geom.Rectangle(
            //                     obj.objectX + person.hiddenArea.dX,
            //                     obj.objectY + person.hiddenArea.dY,
            //                     person.hiddenArea.w,
            //                     person.hiddenArea.h
            //                 ).contains(x, y) ||
            //                     new Phaser.Geom.Rectangle(
            //                         obj.objectX + person.hiddenArea.dX,
            //                         obj.objectY + person.hiddenArea.dY,
            //                         person.hiddenArea.w,
            //                         person.hiddenArea.h
            //                     ).contains(x, y)) {
            //                         person.state = STATE.SHAKE;
            //                         this.cameras.main.shake(1500, 0.01, undefined, (cam = null, progress = 0) => {
            //                         if (progress === 1) {
            //                             person.sprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE,
            //                                 () => {
            //                                     person.state = STATE.ACTIVE;
            //                                     person.shootTimeLine.play();
            //                                     //this.shootToPlayer(obj.personArr[0]);
            //                                  });
            //                                  person.sprite.play(person.animKey);
            //                         }
            //                     });
            //                 }
            //             } else if (person.state == STATE.ACTIVE) {
            //                 if (new Phaser.Geom.Rectangle(
            //                     obj.objectX + person.activeArea.dX,
            //                     obj.objectY + person.activeArea.dY,
            //                     person.activeArea.w,
            //                     person.activeArea.h
            //                 ).contains(x, y)) 
            //                     {
            //                         // this.elephShootTL.pause();
            //                         // this.brightPerson(obj.personArr[0])
            //                         locPerson = person;
            //                         person.shootTimeLine.pause();
            //                         person.fxClrMatrix.brightness(7)
            //                         //person.shootTimeLine.play();    
            //                 }
            //             }
            //         },
                        
            //         )
            //         }
            //     })}},
            // {
            //     from: 200,
            //     run: () => {
            //         locPerson?.fxClrMatrix.reset();
            //         if(locPerson != undefined){
            //             locPerson.health -= 50;
            //             if(locPerson.health > 0){
            //                  locPerson.shootTimeLine.resume();
            //             }else{
            //                 if(locPerson.sprite.texture.key == "an7fr2"){
            //                     locPerson.sprite.setTexture("doorBld4");
            //                 }else{
            //                     locPerson.sprite.setTexture("empty");
            //                 }
            //                 locPerson.state = STATE.EMPTY;
            //                 locPerson.flashSpriteArr.forEach((spr) => {
            //                     spr.setTexture("empty");
            //                 })
            //                 this.goldEl.setPosition(locPerson.sprite.x, locPerson.sprite.y);
            //                 this.goldEl.setTexture("goldEl").setDepth(2);
            //                 this.tweens.add({
            //                     targets:this.goldEl,
            //                     scale: 0.3,
            //                     x: myScoreChecker.barsContainer.x + 280,
            //                     y: myScoreChecker.barsContainer.y,
            //                     duration: 1000,
            //                     onComplete: () => {
            //                         this.goldEl.setTexture("empty");
            //                         myScoreChecker.changeMoney(10);
            //                     }
            //                 })
            //             }
            //         } 
            //     }
            // }
        ]).play();
    }

    prepareBubbles(){
        const bubble:Phaser.GameObjects.Graphics = this.add.graphics();

        // 992,112 w,h = 378,196
        // bubble = this.add.graphics({x:0, y:0})
        bubble.fillStyle(0x222222, 0.5);
        bubble.fillRoundedRect(6, 6, 378,196, 16);
        //  Bubble color
        bubble.fillStyle(0xffffff, 1);
        //  Bubble outline line style
        bubble.lineStyle(4, 0x565656, 1);
        //  Bubble shape and outline
        bubble.strokeRoundedRect(0, 0, 378,196, 16);
        bubble.fillRoundedRect(0, 0, 378,196, 16);
        //this.rightTapBubble = 
        bubble.generateTexture('bubbleForText',385,204);
        bubble.clear();
        this.bubbleForText = this.add.image(600,112,"bubbleForText").setAlpha(0);

        this.txtForBubble = this.add.text(0, 0, this.msgTxtObj.forDesktop,
            { fontFamily: 'Arial, Roboto', fontStyle:'bold', fontSize: '30px',
             color: '#000000', align: 'center', wordWrap: { width: 360 } }).
             setAlpha(0);

        let txtBnd = this.txtForBubble.getBounds();
        this.txtForBubble.setPosition(this.bubbleForText.x - txtBnd.width/2 - 5,
            this.bubbleForText.y - txtBnd.height/2 - 5).setDepth(2);
    }
}