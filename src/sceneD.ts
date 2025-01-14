import * as Phaser from 'phaser';
import { PersonMap } from './preloader';
import { ObjectMap } from './preloader';
import { objectsArr } from './preloader';
import { STATE } from './preloader';
//import { ScoreType } from './preloader';
//import { score } from './preloader';
import { myScoreChecker } from './preloader';

export class SceneD extends Phaser.Scene
{
    infoText:Phaser.GameObjects.Text;
    sceneObjArr:Array<ObjectMap>;
    fireKey:Phaser.Input.Keyboard.Key;

    startKey:boolean;
    emptyAnchor:Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    cursors:Phaser.Types.Input.Keyboard.CursorKeys;

    /** массив объектов конфигураций для анимаций, используемых
     * для данной сцены */
    animsArr: Array<Phaser.Types.Animations.Animation>;

    /** таймлайн для огненного шара */
    elephBrightTL: Phaser.Time.Timeline;

    elephShootTL: Phaser.Time.Timeline;
    debugText:Phaser.GameObjects.Text;
    prevScene:string;
    direction:string;
    graphics: Phaser.GameObjects.Graphics;
    centerZone:Phaser.GameObjects.Zone;
    leftZone:Phaser.GameObjects.Zone;
    rightZone:Phaser.GameObjects.Zone;
    leftDir:number;
    rightDir:number;
    dirSgn:number;

    gunAimX:number;
    gunAimY:number;

    flashesArr:Array<Phaser.GameObjects.Sprite>;
    flashCounter:number;
    physicsAnchor: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    anchorX:number;
    anchorY:number;
    //fxClrMatrix:Phaser.FX.ColorMatrix;

    barsContainer:Phaser.GameObjects.Container;
    goldEl:Phaser.GameObjects.Image;

    constructor ()
    {
        super('sceneD');

        this.gunAimY = 350;

        //this.contrAngle = 60*Math.PI/180;
        //0.7071067812 = sqrt(2)/2 = sin(45) = cos(45)
        //113,137084992 = 160(половина размаха ушей бимбы) * cos(45)
    }  

    init(data){
        if("from" in data && data.from == "sceneA"){
            //this.direction = "left";
            this.anchorX = 600;
            this.anchorY = data.gunAimY;
            this.gunAimY = data.gunAimY;
            this.gunAimX = 600;
        }else{
            this.anchorX = 600;
        }

        if("gunAimY" in data){
            this.anchorY = data.gunAimY;
        }else{
            this.anchorY = 100; 
        }
    }

    create ()
    {
        globalThis.currentScene = this;
        this.startKey = false;
        this.leftDir = 0;
        this.rightDir = 0;
        this.dirSgn = 0;

        this.sceneObjArr = [objectsArr[5]];
        this.flashesArr=[];
        this.flashCounter = 1;

        this.cameras.main.setBounds(0,0,3600,675);
        this.physics.world.setBounds(0,0,3600,675);

        this.add.image(600,608,'groundL').setFlipX(true);
        this.add.image(1800,608,'groundL')
        this.add.image(3000,608,'groundL').setFlipX(true);

        this.add.image(600,273,'landscapeL');
        this.add.image(1800,273,'landscapeL').setFlipX(true);
        this.add.image(3000,273,'landscapeL')//.setFlipX(true);

        this.add.image(3360,415,'landscapeEnd');

        // золотая монетка - бонус, премия за подбитого слона
        this.goldEl = this.add.image(0,0, "empty")

        // прицел
        this.emptyAnchor = this.physics.add.image(this.anchorX, this.anchorY, 'emptyAnchor');
        this.emptyAnchor.setCollideWorldBounds();

        this.physicsAnchor = this.physics.add.image(600, 100, 'redBall');
        this.physicsAnchor.body.setCollideWorldBounds();

        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.right.on('down', (evt) => {
            globalThis.directions.toRight = true; 
        });
        this.cursors.right.on('up', (evt) => {
            globalThis.directions.toRight = false; 
        });

        this.cursors.left.on('down', (evt) => {
            globalThis.directions.toLeft = true; 
        });
        this.cursors.left.on('up', (evt) => {
            globalThis.directions.toLeft = false; 
        });

        this.cursors.up.on('down', (evt) => {
            globalThis.directions.toUp = true; 
        });
        this.cursors.up.on('up', (evt) => {
            globalThis.directions.toUp = false; 
        });

        this.cursors.down.on('down', (evt) => {
            globalThis.directions.toDown = true; 
        });
        this.cursors.down.on('up', (evt) => {
            globalThis.directions.toDown = false; 
        });

        this.cameras.main.startFollow(this.emptyAnchor, true);
        
        // this.add.image(this.sceneObjArr[0].objectX, this.sceneObjArr[0].objectY,
        //     this.sceneObjArr[0].objKey);

            this.sceneObjArr.forEach((obj) => {
                this.add.image(obj.objectX, obj.objectY, obj.objKey);
                obj.personArr.forEach((person) => {
                    person.flashSpriteArr = [];
                    person.flashesArr.forEach((item) => {
                        person.flashSpriteArr.push(this.add.sprite(obj.objectX +
                            item.dx, obj.objectY + item.dy, "empty").setDepth(1)
                        )
                    })
                    // если перс ещё жив, добавляем картинку в зависимости от его состояния,
                    // определяем для него таймлайн и функцию стрельбы
                    if (person.state != STATE.EMPTY) {
                        let sprKey: string = this.anims.get(person.animKey).
                            frames[0].textureKey;
                        if (person.state == STATE.HIDDEN) {
                            person.sprite = this.add.sprite(obj.objectX +
                                person.deltaX, obj.objectY +
                            person.deltaY, (sprKey as string));
                        } else if (person.state == STATE.ACTIVE) {
                            let lastFrame: number = this.anims.get(person.animKey).
                                frames.length - 1;
                            sprKey = this.anims.get(person.animKey).
                                frames[lastFrame].textureKey;
                            person.sprite = this.add.sprite(obj.objectX +
                                person.deltaX, obj.objectY +
                            person.deltaY, (sprKey as string));
                        }
                        //}
                        //person.shoot = () => { };
                        person.shootTimeLine = this.add.timeline([
                            {
                                at: 100,
                                run: () => {
                                    person.flashSpriteArr[0].setTexture("bigFlash");
                                    this.cameras.main.flash(350, 255, 0, 0);
    
                                    if(person.flashSpriteArr.length > 1){
                                        person.flashSpriteArr[1].setTexture("empty");
                                    }
                                    myScoreChecker.changeHealth(-10);
                                },
                            },
                            {
                                from: 300,
                                run: () => {
                                    person.flashSpriteArr[0].setTexture("empty");
                                    if(person.flashSpriteArr.length > 1){
                                        person.flashSpriteArr[1].setTexture("bigFlash");
                                        this.cameras.main.flash(350, 255, 0, 0);
                                        myScoreChecker.changeHealth(-10);
                                    }
                                }
                            },
                            {
                                from: 300,
                                run: () => {
                                    person.flashSpriteArr[0].setTexture("bigFlash");
                                    this.cameras.main.flash(350, 255, 0, 0);
                                    if(person.flashSpriteArr.length > 1){
                                        person.flashSpriteArr[1].setTexture("empty");
                                    }
                                    myScoreChecker.changeHealth(-10);
                                }
                            },
                            {
                                from: 300,
                                run: () => {
                                    person.flashSpriteArr[0].setTexture("empty");
                                    // if(person.flashSpriteArr.length > 1){
                                    //     person.flashSpriteArr[1].setTexture("bigFlash");
                                    // }
                                    person.shootTimeLine.play(true)
                                }
                            }
                        ]);
                        person.fxClrMatrix = person.sprite.preFX.addColorMatrix();
                    }
                }
                )
            })

        // if (this.sceneObjArr[0].personArr[0].state != STATE.EMPTY) {
        //     let sprKey: string = this.anims.get(this.sceneObjArr[0].personArr[0].animKey).
        //         frames[0].textureKey;
        //     this.sceneObjArr[0].personArr[0].sprite = this.add.sprite(this.sceneObjArr[0].objectX +
        //         this.sceneObjArr[0].personArr[0].deltaX, this.sceneObjArr[0].objectY +
        //     this.sceneObjArr[0].personArr[0].deltaY, (sprKey as string));
            
        // }
        
        // this.debugText = this.add.text(10,30,"");
        // this.debugText.setFontSize(64)
        
        if(this.prevScene == "sceneB"){
            //this.emptyAnchor.setX(3000)
        }

        //this.input.addPointer(2)

        // this.input.on('pointerdown', (pointer) => {
            
        //     if (pointer.x + this.cameras.main.scrollX < this.physicsAnchor.x
        //     )
        //     {
        //         this.direction = "left";
        //     }
        //     else if (pointer.x  + this.cameras.main.scrollX > this.physicsAnchor.x
        //     ) {
        //         this.direction = "right";
        //     }
        // })

        // this.input.on('pointermove', (pointer) => {
        //     if(pointer.isDown){
        //         this.physicsAnchor.setY(pointer.y)
        //         console.log(pointer);
        //     }
        // });

        let sprKey: string = this.sceneObjArr[0].personArr[0].animKey;
        sprKey = this.anims.get(sprKey).frames[0].textureKey;

        // отладочная инфа для выделения областей где перс прячется
        // и откуда стреляет
        // this.graphics =  this.add.graphics();
        // this.graphics.lineStyle(5, 0xFF00FF, 1.0);

        // this.sceneObjArr[0].personArr.forEach((person) => {
        //     if ("hiddenArea" in person) {
        //         this.graphics.strokeRect(
        //             this.sceneObjArr[0].objectX + person.hiddenArea.dX,
        //             this.sceneObjArr[0].objectY + person.hiddenArea.dY,
        //             person.hiddenArea.w, person.hiddenArea.h
        //         );
        //         this.graphics.strokeRect(
        //             this.sceneObjArr[0].objectX + person.activeArea.dX,
        //             this.sceneObjArr[0].objectY + person.activeArea.dY,
        //             person.activeArea.w, person.activeArea.h
        //         );
        //     }
        // })

        this.sceneObjArr[0].personArr.forEach((person) => {
            if ("flashesArr" in person) {
                person.flashesArr.forEach((value) => {
                    this.flashesArr.push(this.add.sprite(this.sceneObjArr[0].objectX + 
                        value.dx, this.sceneObjArr[0].objectY + value.dy, "empty"));
                })
            }
        }
        )

        this.fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        this.fireKey.on("down", (key, event) => {
            this.shootToPerson(this.emptyAnchor.x, this.emptyAnchor.y);
        })
        
        this.emptyAnchor.setDepth(1);
        this.emptyAnchor.y = this.gunAimY;
        //this.fxClrMatrix = this.sceneObjArr[0].personArr[0].sprite.preFX.addColorMatrix();

        this.centerZone = this.add.zone(600,335,200,670).setInteractive();
        this.centerZone.on('pointerdown', (pntr) => {
            //if(pntr.event.type != "touchstart") return;

            this.shootToPerson(this.emptyAnchor.x, this.emptyAnchor.y);
            //this.leftDir = -1;
        });

        this.leftZone = this.add.zone(250, 335, 500, 670).setInteractive({draggable:true});
        this.leftZone.on('pointerdown', (pntr) => {
            if(pntr.event.type != "touchstart") return;

            if((pntr.event as TouchEvent).touches.length == 1) this.rightDir =0;
            this.leftDir = -1;
        });

        this.leftZone.on('pointerup', (pntr) => {
            if(pntr.event.type != "touchend") return;

            this.leftDir = 0;
            if((pntr.event as TouchEvent).touches.length == 0) this.rightDir =0;
        });

        this.leftZone.on('drag', (pntr:Phaser.Input.Pointer,x,y,z) => {
            this.emptyAnchor.y += pntr.velocity.y/5
            if(this.emptyAnchor.y + pntr.velocity.y/5 < 0){
                this.emptyAnchor.y = 0;
            }else if(this.emptyAnchor.y + pntr.velocity.y/5 > 675){
                this.emptyAnchor.y = 675;
            }
        });

        

        this.rightZone = this.add.zone(1200, 335, 1000, 670).setInteractive({draggable:true});
        this.rightZone.on('pointerdown', (pntr) => {
            if(pntr.event.type != "touchstart") return;

            this.rightDir = 1;
            if((pntr.event as TouchEvent).touches.length == 1) this.leftDir =0;
            //console.log("rightDir = " +this.rightDir)
        });

        this.rightZone.on('pointerup', (pntr) => {
            if(pntr.event.type != "touchend") return;

            this.rightDir = 0;
            if((pntr.event as TouchEvent).touches.length == 0) this.leftDir =0;
            //console.log("rightDir = " +this.rightDir)
        });
        
        this.rightZone.on('drag', (pntr:Phaser.Input.Pointer,x,y,z) => {
            this.emptyAnchor.y += pntr.velocity.y/5
            if(this.emptyAnchor.y + pntr.velocity.y/5 < 0){
                this.emptyAnchor.y = 0;
            }else if(this.emptyAnchor.y + pntr.velocity.y/5 > 675){
                this.emptyAnchor.y = 675;
            }
        });
        
        
        //this.add.image(600,44,'unionBar');
        

        // this.barsContainer = this.add.container(600, 45);
        // this.barsContainer.addAt(this.add.image(0, -1, 'unionBar'), 0);

        // for (let i = 0; i < 10; i++) {
        //     this.barsContainer.addAt(this.add.image(-488 + i * 24, 0, 'healthPiece'). 
        //         setAlpha(score.health[i]/10), i + 1);
        // }
        // for (let i = 0; i < 10; i++) {
        //     this.barsContainer.addAt(this.add.image(-70 + i * 24, 0, 'ammoPiece').
        //         setAlpha(score.ammo[i]/10), i + 11);
        // }
        // for (let i = 0; i < 10; i++) {
        //     this.barsContainer.addAt(this.add.image(340 + i * 24, 0, 'moneyPiece').
        //         setAlpha(score.money[i]/10), i + 21);
        // }

        // for(let i=1; i < this.barsContainer.list.length; i++){
        //     if(i%2 == 0) this.barsContainer.getAt(i).setAlpha(0.5);
        // }

        myScoreChecker.drawBars(this);
    }

    update(time: number, delta: number): void {
        
        this.emptyAnchor.setVelocityX((this.rightDir + this.leftDir)*180);

        if(this.emptyAnchor.x <= 51) this.leftDir =0;

        if (globalThis.directions.toLeft && this.emptyAnchor.x > 0) {
            this.emptyAnchor.x -= 1.5;
            //this.debugText.x -= 1.5;
        }
        else if (globalThis.directions.toRight && this.emptyAnchor.x < 3600) {
            this.emptyAnchor.x += 1.5;
            //this.debugText.x += 1.5;
        }

        if (globalThis.directions.toUp && this.emptyAnchor.y > 0) {
            this.emptyAnchor.y -= 1.5
        } else if (globalThis.directions.toDown && this.emptyAnchor.y < 675) {
            this.emptyAnchor.y += 1.5
        }

        // if (this.emptyAnchor.x > 3000) {
        //     this.scene.start('sceneC',{from:"sceneB", gunAimY: this.emptyAnchor.y});
        // }
        if (this.emptyAnchor.x < 600) {
            this.scene.start('sceneA', { from: "sceneD", gunAimY: this.emptyAnchor.y });
        }

        myScoreChecker.setX(this.cameras.main.scrollX + 600);

        this.centerZone.setX(this.emptyAnchor.x);
        this.leftZone.setX(this.emptyAnchor.x - 350);
        this.rightZone.setX(this.emptyAnchor.x + 600);
            
        //  this.debugText.setText(
        //      `scrollX:${this.cameras.main.scrollX}, Y:${this.emptyAnchor.y}` )
    }

    /** игрок стреляет в перса */
    shootToPerson(x:number, y: number) {
        let fireSphereArr: Array<Phaser.GameObjects.Image> = [];
        let locPerson: PersonMap;
        this.add.timeline([
            {
                at: 0,
                run: () => {
                    fireSphereArr.push(this.add.image(x, y, "redBall"))
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
                    fireSphereArr.push(this.add.image(x, y, "redBall"))
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
                    fireSphereArr.push(this.add.image(x, y, "redBall"))
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
                        }
                    })
                },
            },
            {
                run: () => {
                this.sceneObjArr.forEach((obj) => {
                    if ("personArr" in obj) {
                        obj.personArr.forEach((person) => {
                        // если перс прячется
                        if (person.state == STATE.HIDDEN) {
                            if (new Phaser.Geom.Rectangle(
                                obj.objectX + person.hiddenArea.dX,
                                obj.objectY + person.hiddenArea.dY,
                                person.hiddenArea.w,
                                person.hiddenArea.h
                            ).contains(x, y) ||
                                new Phaser.Geom.Rectangle(
                                    obj.objectX + person.hiddenArea.dX,
                                    obj.objectY + person.hiddenArea.dY,
                                    person.hiddenArea.w,
                                    person.hiddenArea.h
                                ).contains(x, y)) {
                                    person.state = STATE.SHAKE;
                                    this.cameras.main.shake(1500, 0.01, undefined, (cam = null, progress = 0) => {
                                    if (progress === 1) {
                                        person.sprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE,
                                            () => {
                                                person.state = STATE.ACTIVE;
                                                person.shootTimeLine.play();
                                                //this.shootToPlayer(obj.personArr[0]);
                                             });
                                             person.sprite.play(person.animKey);
                                    }
                                });
                            }
                        } else if (person.state == STATE.ACTIVE) {
                            if (new Phaser.Geom.Rectangle(
                                obj.objectX + person.activeArea.dX,
                                obj.objectY + person.activeArea.dY,
                                person.activeArea.w,
                                person.activeArea.h
                            ).contains(x, y)) 
                                // ||
                                // new Phaser.Geom.Rectangle(
                                //     obj.objectX + obj.personArr[1].activeArea.dX,
                                //     obj.objectY + obj.personArr[1].activeArea.dY,
                                //     obj.personArr[1].activeArea.w,
                                //     obj.personArr[1].activeArea.h
                                // ).contains(x, y)) 
                                {
                                    // this.elephShootTL.pause();
                                    // this.brightPerson(obj.personArr[0])
                                    locPerson = person;
                                    person.shootTimeLine.pause();
                                    person.fxClrMatrix.brightness(7)
                                    //person.shootTimeLine.play();    
                            }
                        }
                    },
                        
                    )
                    }
                })}},
            {
                from: 200,
                run: () => {
                    locPerson?.fxClrMatrix.reset();
                    if(locPerson != undefined){
                        locPerson.health -= 50;
                        if(locPerson.health > 0){
                             locPerson.shootTimeLine.resume();
                        }else{
                            locPerson.sprite.setTexture("empty");
                            locPerson.state = STATE.EMPTY;
                            locPerson.flashSpriteArr.forEach((spr) => {
                                spr.setTexture("empty");
                            })
                            this.goldEl.setPosition(locPerson.sprite.x, locPerson.sprite.y);
                            this.goldEl.setTexture("goldEl").setDepth(2);
                            this.tweens.add({
                                targets:this.goldEl,
                                scale: 0.3,
                                x: myScoreChecker.barsContainer.x + 280,
                                y: myScoreChecker.barsContainer.y,
                                duration: 1000,
                                onComplete: () => {
                                    this.goldEl.setTexture("empty");
                                    myScoreChecker.changeMoney(10);
                                }
                            })
                        }
                    }
                }
            }
        ]).play();
    }
}

    /** перс стреляет в игрока */
//     shootToPlayer(pers: PersonMap){
//         this.elephShootTL = this.add.timeline([
//             {
//                 at: 100,
//                 run: () => {
//                     this.flashesArr[0].setTexture("empty");
//                     this.flashesArr[1].setTexture("bigFlash");
//                     this.cameras.main.flash(350, 255, 0, 0);
//                 },
//             },
//             {
//                 from:300,
//                 run: () => {
//                     this.flashesArr[1].setTexture("empty");
//                 }
//             },
//             {
//                 from: 300,
//                 run: () => {
//                     this.flashesArr[0].setTexture("bigFlash");
//                     //this.flashesArr[1].setTexture("empty");
//                     this.cameras.main.flash(350, 255, 0, 0);
//                 }
//             },
//             {
//                 from:300,
//                 run: () => {
//                     this.flashesArr[0].setTexture("empty");
//                     this.elephShootTL.play(true)
//                 }
//             }
//         ])
//         this.elephShootTL.play();
//     }

//     /** подсветка перса при попадании в него игрока */
//     brightPerson(persMap:PersonMap){
//         //let clrMatrix = persMap.sprite.preFX.addColorMatrix();
//         this.elephBrightTL = this.add.timeline([
//             {
//                 run: () => {
//                     this.fxClrMatrix.brightness(7);
//                 }
//             },
//             {
//                 from:100,
//                 run: () => {
//                     this.fxClrMatrix.reset()
//                 }
//             },
//             {
//                 from:100,
//                 run: () => {
//                     this.fxClrMatrix.brightness(7);
//                 }
//             },
//             {
//                 from:100,
//                 run: () => {
//                     this.fxClrMatrix.reset()
//                 }
//             },
//             {
//                 from:100,
//                 run: () => {
//                     this.fxClrMatrix.brightness(7);
//                 }
//             },
//             {
//                 from:100,
//                 run: () => {
//                     this.fxClrMatrix.reset()
//                 }
//             },
//             {
//                 from:100,
//                 run: () => {
//                     if(this.elephShootTL.paused)
//                         this.elephShootTL.resume()
//                 }
//             },
//         ])
//         this.elephBrightTL.play();
//     }
// }
