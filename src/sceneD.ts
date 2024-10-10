import * as Phaser from 'phaser';
import { PersonMap } from './preloader';
import { ObjectMap } from './preloader';
import { objectsArr } from './preloader';
import {STATE } from './preloader';

export class SceneD extends Phaser.Scene
{
    infoText:Phaser.GameObjects.Text;
    sceneObjArr:Array<ObjectMap>;
    fireKey:Phaser.Input.Keyboard.Key;

    startKey:boolean;
    emptyAnchor:Phaser.GameObjects.Image;
    cursors:Phaser.Types.Input.Keyboard.CursorKeys;

    /** массив объектов конфигураций для анимаций, используемых
     * для данной сцены */
    animsArr: Array<Phaser.Types.Animations.Animation>;

    /** таймлайн для огненного шара */
    //fbTimeLine:Phaser.Time.Timeline;

    /** таймлайн для огненного шара */
    elephBrightTL: Phaser.Time.Timeline;

    elephShootTL: Phaser.Time.Timeline;
    debugText:Phaser.GameObjects.Text;
    prevScene:string;
    direction:string;
    graphics: Phaser.GameObjects.Graphics;
    gunAimY: number;
    flashesArr:Array<Phaser.GameObjects.Sprite>;
    flashCounter:number;
    physicsAnchor: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    fxClrMatrix:Phaser.FX.ColorMatrix;

    constructor ()
    {
        super('sceneD');

        this.gunAimY = 350;

        //this.contrAngle = 60*Math.PI/180;
        //0.7071067812 = sqrt(2)/2 = sin(45) = cos(45)
        //113,137084992 = 160(половина размаха ушей бимбы) * cos(45)
    }  

    init(data){
        console.log(data)
        if('from' in data){
            this.prevScene = data.from;
        }else{this.prevScene = ""}
        if('gunAimY' in data){
            this.gunAimY = data.gunAimY;
        }
    }


    create ()
    {
        globalThis.currentScene = this;
        this.startKey = false;

        this.sceneObjArr = [objectsArr[5]];
        this.flashesArr=[];
        this.flashCounter = 1;

        // this.sceneObjArr[0].objectX = 547;
        // this.sceneObjArr[0].objectY = 410;

        //console.log(objectsArr[0].objectX);

        this.cameras.main.setBounds(0,0,3600,675);
        this.physics.world.setBounds(0,0,3600,675);

        this.add.image(600,608,'groundL').setFlipX(true);
        this.add.image(1800,608,'groundL')
        this.add.image(3000,608,'groundL').setFlipX(true);

        this.add.image(600,273,'landscapeL');
        this.add.image(1800,273,'landscapeL').setFlipX(true);
        this.add.image(3000,273,'landscapeL')//.setFlipX(true);

        this.add.image(3360,415,'landscapeEnd')
        
        //960,415
        //this.add.image(3700,368,'building2')//.setFlipX(true);

        this.emptyAnchor = this.add.image(600, 100, 'emptyAnchor');
        this.physicsAnchor = this.physics.add.image(600, 100, 'redBall');
        this.physicsAnchor.body.setCollideWorldBounds();

        this.cursors = this.input.keyboard.createCursorKeys();

        // this.cameras.main.startFollow(this.ship, true, 0.08, 0.08);
        this.cameras.main.startFollow(this.emptyAnchor, true);
        
        // добавляем картинку объекта
        // this.add.image(this.sceneObjArr[1].objectX, this.sceneObjArr[1].objectY,
        //     this.sceneObjArr[1].objKey);

        // this.sceneObjArr[1].personArr.forEach((person) => {
        //     if (person.state != STATE.EMPTY) {
        //         let sprKey: string = this.anims.get(person.animKey).
        //             frames[0].textureKey;
        //         if (person.state == STATE.HIDDEN) {
        //             person.sprite = this.add.sprite(this.sceneObjArr[1].objectX +
        //                 person.deltaX, this.sceneObjArr[1].objectY +
        //             person.deltaY, (sprKey as string));
        //         } else if (person.state == STATE.ACTIVE) {
        //             let lastFrame: number = this.anims.get(person.animKey).
        //                 frames.length - 1;
        //             sprKey = this.anims.get(person.animKey).
        //                 frames[lastFrame].textureKey;
        //             person.sprite = this.add.sprite(this.sceneObjArr[1].objectX +
        //                 person.deltaX, this.sceneObjArr[1].objectY +
        //             person.deltaY, (sprKey as string));
        //         }
        //     }
        // }
        // )

        this.add.image(this.sceneObjArr[0].objectX, this.sceneObjArr[0].objectY,
            this.sceneObjArr[0].objKey);

        //this.sceneObjArr[0].personArr[0]
        if (this.sceneObjArr[0].personArr[0].state != STATE.EMPTY) {
            let sprKey: string = this.anims.get(this.sceneObjArr[0].personArr[0].animKey).
                frames[0].textureKey;
            this.sceneObjArr[0].personArr[0].sprite = this.add.sprite(this.sceneObjArr[0].objectX +
                this.sceneObjArr[0].personArr[0].deltaX, this.sceneObjArr[0].objectY +
            this.sceneObjArr[0].personArr[0].deltaY, (sprKey as string));
            
        }
        
        this.debugText = this.add.text(10,30,"");
        this.debugText.setFontSize(64)
        
        if(this.prevScene == "sceneB"){
            //this.emptyAnchor.setX(3000)
        }

        this.input.addPointer(2)

        this.input.on('pointerdown', (pointer) => {
            
            if (pointer.x + this.cameras.main.scrollX < this.physicsAnchor.x
            )
            {
                this.direction = "left";
            }
            else if (pointer.x  + this.cameras.main.scrollX > this.physicsAnchor.x
            ) {
                this.direction = "right";
            }
        })

        this.input.on('pointermove', (pointer) => {
            if(pointer.isDown){
                this.physicsAnchor.setY(pointer.y)
                console.log(pointer);
            }
        });

        let sprKey: string = this.sceneObjArr[0].personArr[0].animKey;
        sprKey = this.anims.get(sprKey).frames[0].textureKey;
        //this.add.sprite(this.sceneObjArr[0].objectX + this.sceneObjArr[0].personArr[0].deltaX,
           // this.sceneObjArr[0].objectY + this.sceneObjArr[0].personArr[0].deltaY, (sprKey as string));

        // this.sceneObjArr[0].personArr.forEach((person) => {
        //     if ("flashesArr" in person) {
        //         person.flashesArr.forEach((value) => {
        //             this.add.sprite(this.sceneObjArr[0].objectX + value.dx,
        //                 this.sceneObjArr[0].objectY + value.dy, "bigFlash");
        //         })
        //     }
        // }
        // )

        // this.add.sprite(this.sceneObjArr[0].objectX + 247,
        //     this.sceneObjArr[0].objectY + 126, "bigFlash")

        // отладочная инфа для выделения областей где перс прячется
        // и откуда стреляет
        this.graphics =  this.add.graphics();
        this.graphics.lineStyle(5, 0xFF00FF, 1.0);

        this.sceneObjArr[0].personArr.forEach((person) => {
            if ("hiddenArea" in person) {
                this.graphics.strokeRect(
                    this.sceneObjArr[0].objectX + person.hiddenArea.dX,
                    this.sceneObjArr[0].objectY + person.hiddenArea.dY,
                    person.hiddenArea.w, person.hiddenArea.h
                );
                this.graphics.strokeRect(
                    this.sceneObjArr[0].objectX + person.activeArea.dX,
                    this.sceneObjArr[0].objectY + person.activeArea.dY,
                    person.activeArea.w, person.activeArea.h
                );
            }
        })

        this.sceneObjArr[0].personArr.forEach((person) => {
            if ("flashesArr" in person) {
                person.flashesArr.forEach((value) => {
                    this.flashesArr.push(this.add.sprite(this.sceneObjArr[0].objectX + 
                        value.dx, this.sceneObjArr[0].objectY + value.dy, "empty"));
                })
            }
        }
        )

        this.elephShootTL = this.add.timeline([
            {
                at: 100,
                run: () => {
                    this.flashesArr[0].setTexture("empty");
                    this.flashesArr[1].setTexture("bigFlash");
                    this.cameras.main.flash(350, 255, 0, 0);
                },
            },
            {
                from:300,
                run: () => {
                    this.flashesArr[1].setTexture("empty");
                }
            },
            {
                from: 300,
                run: () => {
                    this.flashesArr[0].setTexture("bigFlash");
                    //this.flashesArr[1].setTexture("empty");
                    this.cameras.main.flash(350, 255, 0, 0);
                }
            },
            {
                from:300,
                run: () => {
                    this.flashesArr[0].setTexture("empty");
                    this.elephShootTL.play(true)
                }
            }
        ])

        

        // this.sceneObjArr[1].personArr.forEach((person) => {
        //     if ("hiddenArea" in person) {
        //         this.graphics.strokeRect(
        //             this.sceneObjArr[1].objectX + person.hiddenArea.dX,
        //             this.sceneObjArr[1].objectY + person.hiddenArea.dY,
        //             person.hiddenArea.w, person.hiddenArea.h
        //         );
        //         this.graphics.strokeRect(
        //             this.sceneObjArr[1].objectX + person.activeArea.dX,
        //             this.sceneObjArr[1].objectY + person.activeArea.dY,
        //             person.activeArea.w, person.activeArea.h
        //         );
        //     }
        // })

        this.fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        this.fireKey.on("down", (key, event) => {
            this.shootBall(this.emptyAnchor.x, this.emptyAnchor.y);
        })
        
        this.emptyAnchor.setDepth(1);
        this.emptyAnchor.y = this.gunAimY;
    }

    update(time: number, delta: number): void {
        
        if(!this.startKey){
            // this.sceneObjArr[0].personArr.forEach(person => {
            //     person.sprite.play(person.animKey)
            // })
            this.startKey = true;
        }

        if(this.direction == "left" && 
            this.physicsAnchor.body.velocity.x >= 0){
                this.physicsAnchor.setVelocityX(-180);
            } else if(this.direction == "right" && 
            this.physicsAnchor.body.velocity.x <= 0){
                this.physicsAnchor.setVelocityX(180);
            } else {this.physicsAnchor.setVelocityX(0);}

        if(this.direction == "left" && this.emptyAnchor.x > 0){
            this.emptyAnchor.x -= 1.5;
            this.debugText.x -= 1.5;
        }else if(this.direction == "right" && this.emptyAnchor.x < 3600){
            this.emptyAnchor.x += 1.5;
            this.debugText.x += 1.5;
        }

        if (this.cursors.left.isDown && this.emptyAnchor.x > 0)
            {
                this.emptyAnchor.x -= 1.5;
                this.debugText.x -= 1.5;
            }
            else if (this.cursors.right.isDown && this.emptyAnchor.x < 3600)
            {
                this.emptyAnchor.x += 1.5;
                this.debugText.x += 1.5;
            }

            if(this.cursors.up.isDown && this.emptyAnchor.y > 0){
                this.emptyAnchor.y -=1.5
            }else if(this.cursors.down.isDown && this.emptyAnchor.y < 675){
                this.emptyAnchor.y +=1.5
            }

            if(this.emptyAnchor.x > 1800){
                //this.scene.start('sceneB',{from:"sceneD"});
            }
            
         this.debugText.setText(
             `scrollX:${this.cameras.main.scrollX}, Y:${this.emptyAnchor.y}` )
    }

    shootBall(x:number, y: number) {
        let fireSphereArr: Array<Phaser.GameObjects.Image> = [];

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
                            fireSphereArr[2].destroy()
                        }
                    })
                },
            },
            {
                run: () => {
                this.sceneObjArr.forEach((obj) => {
                    if ("personArr" in obj) {
                        // если перс прячется
                        if (obj.personArr[0].state == STATE.HIDDEN) {
                            if (new Phaser.Geom.Rectangle(
                                obj.objectX + obj.personArr[0].hiddenArea.dX,
                                obj.objectY + obj.personArr[0].hiddenArea.dY,
                                obj.personArr[0].hiddenArea.w,
                                obj.personArr[0].hiddenArea.h
                            ).contains(x, y) ||
                                new Phaser.Geom.Rectangle(
                                    obj.objectX + obj.personArr[1].hiddenArea.dX,
                                    obj.objectY + obj.personArr[1].hiddenArea.dY,
                                    obj.personArr[1].hiddenArea.w,
                                    obj.personArr[1].hiddenArea.h
                                ).contains(x, y)) {
                                    obj.personArr[0].state = STATE.APPIARENCE;
                                    this.cameras.main.shake(1500, 0.01, undefined, (cam = null, progress = 0) => {
                                    if (progress === 1) {
                                        obj.personArr[0].sprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE,
                                            () => {
                                                obj.personArr[0].state = STATE.ACTIVE;
                                                this.elephShootTL.play();
                                             });
                                        obj.personArr[0].sprite.play(obj.personArr[0].animKey);
                                    }
                                });
                            }
                        } else if (obj.personArr[0].state == STATE.ACTIVE) {
                            if (new Phaser.Geom.Rectangle(
                                obj.objectX + obj.personArr[0].activeArea.dX,
                                obj.objectY + obj.personArr[0].activeArea.dY,
                                obj.personArr[0].activeArea.w,
                                obj.personArr[0].activeArea.h
                            ).contains(x, y) ||
                                new Phaser.Geom.Rectangle(
                                    obj.objectX + obj.personArr[1].activeArea.dX,
                                    obj.objectY + obj.personArr[1].activeArea.dY,
                                    obj.personArr[1].activeArea.w,
                                    obj.personArr[1].activeArea.h
                                ).contains(x, y)) {
                                    this.elephShootTL.pause();
                                this.brightPerson(obj.personArr[0])
                            }
                        }
                    }
                })
            }
            }
        ]).play();
    }

    brightPerson(persMap:PersonMap){
        let clrMatrix = persMap.sprite.preFX.addColorMatrix();
        this.elephBrightTL = this.add.timeline([
            {
                run: () => {
                    clrMatrix.brightness(7);
                }
            },
            {
                from:100,
                run: () => {
                    clrMatrix.reset()
                }
            },
            {
                from:100,
                run: () => {
                    clrMatrix.brightness(7);
                }
            },
            {
                from:100,
                run: () => {
                    clrMatrix.reset()
                }
            },
            {
                from:100,
                run: () => {
                    clrMatrix.brightness(7);
                }
            },
            {
                from:100,
                run: () => {
                    clrMatrix.reset()
                }
            },
        ])
        this.elephBrightTL.play();
    }
}
