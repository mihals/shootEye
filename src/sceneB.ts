import * as Phaser from 'phaser';
import { PersonMap } from './preloader';
import { ObjectMap } from './preloader';
import { objectsArr } from './preloader';
import { STATE } from './preloader';
//import { score } from './preloader';
import { myScoreChecker } from './preloader';
import { recoverData } from './preloader';
import { myModalWnd } from './preloader';
import type { domElContent } from './preloader';
import { ModalWndMode } from './preloader';


export class SceneB extends Phaser.Scene
{
    startKey:boolean;
    emptyAnchor:Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    cursors:Phaser.Types.Input.Keyboard.CursorKeys;
    direction:string
    fireKey:Phaser.Input.Keyboard.Key;
    dragIsStart:boolean = false;

    debugText:Phaser.GameObjects.Text;

    /** массив объектов конфигураций для анимаций, используемых
     * для данной сцены */
    sceneObjArr:Array<ObjectMap>
    //physicsAnchor: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    anchorX:number;
    anchorY:number;

    //barsContainer:Phaser.GameObjects.Container;

    graphics:Phaser.GameObjects.Graphics;
    //fxClrMatrix:Phaser.FX.ColorMatrix;

    centerZone:Phaser.GameObjects.Zone;
    leftZone:Phaser.GameObjects.Zone;
    rightZone:Phaser.GameObjects.Zone;
    leftDir:number;
    rightDir:number;

    dirSgn:number;
    goldEl:Phaser.GameObjects.Image;

    winWnd:Phaser.GameObjects.DOMElement;

    constructor ()
    {
        super('sceneB');
    }  

    init(data){
        if("from" in data && data.from == "sceneC"){
            this.direction = "left";
            this.anchorX = 2999;
        }else{
            this.anchorX = 600;
        }

        if("gunAimY" in data){
            this.anchorY = data.gunAimY;
        }else{
            this.anchorY = 100; 
        }

        this.scene.stop("winScene");
    }

    create ()
    {
        globalThis.currentScene = this;
        this.startKey = false;
        this.leftDir = 0;
        this.rightDir = 0;
        this.dirSgn = 0;

        this.sceneObjArr = [objectsArr[2], objectsArr[3]];

        this.cameras.main.setBounds(0,0,3600,675);
        this.physics.world.setBounds(0,0,3600,675);

        this.add.image(600,608,'atlas0', 'groundL')
        this.add.image(1800,608,'atlas0','groundL').setFlipX(true);
        this.add.image(3000,608,'atlas0','groundL')
        
        this.add.image(600,273,'atlas0','landscapeL');
        this.add.image(1800,273,'atlas0','landscapeL').setFlipX(true);
        this.add.image(3000,273,'atlas0','landscapeL')//.setFlipX(true);

        // краешек здания из obj5Map
        this.add.image(3750,320,'atlas1', objectsArr[4].objKey);

        // золотая монетка - бонус, премия за подбитого слона
        this.goldEl = this.add.image(0,0,'atlas0', "empty")

        // прицел
        this.emptyAnchor = this.physics.add.image(this.anchorX, this.anchorY,'atlas0', 'emptyAnchor');
        this.emptyAnchor.setCollideWorldBounds();

        // физическое тело - красный шар
        //this.physicsAnchor = this.physics.add.image(600, 100, 'redBall');
        //this.physicsAnchor.body.setCollideWorldBounds();

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


        // this.cameras.main.startFollow(this.ship, true, 0.08, 0.08);
        this.cameras.main.startFollow(this.emptyAnchor, true);

        // this.add.image(this.sceneObjArr[0].objectX, this.sceneObjArr[0].objectY,
        //     this.sceneObjArr[0].objKey);

        // ИНИЦИАЛИЗАЦИЯ ПЕРСА
        // каждому персу в каждом объекте добавляем в зависимости от его(перса) 
        // состояния (он прячется(hidden), выскочил из укрытия(active),
        //  уничтожен(empty)) соответствующий спрайт из анимации
        this.sceneObjArr.forEach((obj) => {
            if(obj.objKey == "building4"){
                this.add.image(obj.objectX, obj.objectY,'atlas1', obj.objKey);
            }
            else{
                this.add.image(obj.objectX, obj.objectY,'atlas0', obj.objKey);
            }
            obj.personArr.forEach((person) => {
                person.flashSpriteArr = [];
                person.flashesArr.forEach((item) => {
                    person.flashSpriteArr.push(this.add.sprite(obj.objectX +
                        item.dx, obj.objectY + item.dy,'atlas0', "empty").setDepth(1)
                    )
                })
                // если перс ещё жив, добавляем картинку в зависимости от его состояния,
                // определяем для него таймлайн и функцию стрельбы
                if (person.state != STATE.EMPTY) {
                    let sprKey: string = this.anims.get(person.animKey).
                            frames[0].textureKey;
                    let sprFrame: string = this.anims.get(person.animKey).
                            frames[0].textureFrame as string;
                    if (person.state == STATE.HIDDEN) {
                        person.sprite = this.add.sprite(obj.objectX +
                            person.deltaX, obj.objectY +
                        person.deltaY, sprKey, sprFrame);
                    } else if (person.state == STATE.ACTIVE) {
                        let lastFrame: number = this.anims.get(person.animKey).
                            frames.length - 1;
                        sprKey = this.anims.get(person.animKey).
                            frames[lastFrame].textureKey;
                        person.sprite = this.add.sprite(obj.objectX +
                            person.deltaX, obj.objectY +
                        person.deltaY, sprKey, sprFrame);
                    }
                    person.shootTimeLine = this.add.timeline([
                        {
                            at: 100,
                            run: () => {
                                person.flashSpriteArr[0].setTexture('atlas0',"empty");
                                person.flashSpriteArr[1].setTexture('atlas0',"bigFlash");
                                this.cameras.main.flash(350, 255, 0, 0);
                                myScoreChecker.changeHealth(-10);
                                if(myScoreChecker.health[0] <= 0){
                                    try{
                                        globalThis.gYsdk.features.GameplayAPI.stop()
                                    }catch(err){}
                                    let content:domElContent = myModalWnd.getModalWnd(ModalWndMode.HEALTH);
                                    let dom = this.add.dom(this.emptyAnchor.x, 300,'div', content.styleContent);
                                    dom.setHTML(content.htmlContent);
                                    dom.addListener('click');
                                    dom.on('click', (evt) => {
                                        let retryBtnDiv = document.getElementById("retryBtnDiv");
                                        let tutorBtnDiv = document.getElementById("tutorBtnDiv");
                                        let currAchievments:Achievments ={ 
                                            numAttempts:globalThis.plrAchievments.numAttempts++,
                                            numKilledGangs: globalThis.numKilledGangs
                                        }
                                    
                                        if(retryBtnDiv.contains(evt.target))
                                        {
                                            dom.removeAllListeners('click');
                                            recoverData(currAchievments,"sceneB");
                                            //this.scene.start("sceneB");
                                        }else if(tutorBtnDiv.contains(evt.target)){
                                            dom.removeAllListeners('click');
                                            recoverData(currAchievments,"tutorScene");
                                            //this.scene.start("tutorScene");
                                        }
                                    });
                                    this.scene.pause();
                                }
                            },
                        },
                        {
                            from: 300,
                            run: () => {
                                person.flashSpriteArr[1].setTexture('atlas0',"empty");
                            }
                        },
                        {
                            from: 300,
                            run: () => {
                                person.flashSpriteArr[0].setTexture('atlas0',"bigFlash");
                                //this.flashesArr[1].setTexture("empty");
                                this.cameras.main.flash(350, 255, 0, 0);
                            }
                        },
                        {
                            from: 300,
                            run: () => {
                                person.flashSpriteArr[0].setTexture('atlas0',"empty");
                                if(person.state == STATE.ACTIVE)
                                    person.shootTimeLine.play(true);
                                else 
                                    console.log("person empty");
                            }
                        }
                    ]);
                    person.fxClrMatrix = person.sprite.preFX.addColorMatrix();
                }
            }
            )
        })

        this.add.image(1400,440,'atlas0','wantedStand')
        this.add.image(192,500,'atlas0','flowerStones')

        // this.debugText = this.add.text(10,30,"");
        // this.debugText.setFontSize(64)

        // отладочная инфа для выделения областей где перс прячется
        // и откуда стреляет
        // this.graphics =  this.add.graphics();
        // this.graphics.lineStyle(5, 0xFF00FF, 1.0);

        // this.sceneObjArr[0].personArr.forEach((person) => {
        //     this.graphics.strokeRect(
        //         this.sceneObjArr[0].objectX + person.hiddenArea.dX,
        //         this.sceneObjArr[0].objectY + person.hiddenArea.dY,
        //         person.hiddenArea.w, person.hiddenArea.h
        //     );
        //     this.graphics.strokeRect(
        //         this.sceneObjArr[0].objectX + person.activeArea.dX,
        //         this.sceneObjArr[0].objectY + person.activeArea.dY,
        //         person.activeArea.w, person.activeArea.h
        //     );
        // })

        // this.sceneObjArr[1].personArr.forEach((person) => {
        //     this.graphics.strokeRect(
        //         this.sceneObjArr[1].objectX + person.hiddenArea.dX,
        //         this.sceneObjArr[1].objectY + person.hiddenArea.dY,
        //         person.hiddenArea.w, person.hiddenArea.h
        //     );
        //     this.graphics.strokeRect(
        //         this.sceneObjArr[1].objectX + person.activeArea.dX,
        //         this.sceneObjArr[1].objectY + person.activeArea.dY,
        //         person.activeArea.w, person.activeArea.h
        //     );
        // })

        this.fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.fireKey.on("down", (key, event) => {
            this.shootToPerson(this.emptyAnchor.x, this.emptyAnchor.y);
        })

        this.emptyAnchor.setDepth(1);

        let res =this.input.addPointer(1);
        this.input.dragDistanceThreshold = 32;

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
        });

        this.rightZone.on('pointerup', (pntr) => {
            if(pntr.event.type != "touchend") return;

            this.rightDir = 0;
            if((pntr.event as TouchEvent).touches.length == 0) this.leftDir =0;
        });
        
        this.rightZone.on('drag', (pntr:Phaser.Input.Pointer,x,y,z) => {
            this.emptyAnchor.y += pntr.velocity.y/5
            if(this.emptyAnchor.y + pntr.velocity.y/5 < 0){
                this.emptyAnchor.y = 0;
            }else if(this.emptyAnchor.y + pntr.velocity.y/5 > 675){
                this.emptyAnchor.y = 675;
            }
        });
        
        myScoreChecker.drawBars(this);
        globalThis.numKilledGangs = 0;
    }

    update(time: number, delta: number): void {
        this.emptyAnchor.setVelocityX((this.rightDir + this.leftDir)*180);

        if(this.emptyAnchor.x <= 51) this.leftDir =0;

        // if (this.cursors.left.isDown && this.emptyAnchor.x > 0) {
        //     this.emptyAnchor.x -= 1.5;
        //     //this.debugText.x -= 1.5;
        // }
        // else if (this.cursors.right.isDown && this.emptyAnchor.x < 3600) {
        //     this.emptyAnchor.x += 1.5;
        //     //this.debugText.x += 1.5;
        // }

        // if (this.cursors.up.isDown && this.emptyAnchor.y > 0) {
        //     this.emptyAnchor.y -= 1.5
        // } else if (this.cursors.down.isDown && this.emptyAnchor.y < 675) {
        //     this.emptyAnchor.y += 1.5
        // }

        // if (this.emptyAnchor.x > 3000) {
        //     this.scene.start('sceneC',{from:"sceneB", gunAimY: this.emptyAnchor.y});
        // }

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

        if (this.emptyAnchor.x > 3000) {
            this.sceneObjArr.forEach((obj) => {
                obj.personArr.forEach((person) => {
                    if(person.state != STATE.EMPTY) person.state = STATE.HIDDEN;
                })
            })
            this.scene.start('sceneC',{from:"sceneB", gunAimY: this.emptyAnchor.y});
        }

        myScoreChecker.setX(this.cameras.main.scrollX + 600);

        this.centerZone.setX(this.emptyAnchor.x);
        this.leftZone.setX(this.emptyAnchor.x - 350);
        this.rightZone.setX(this.emptyAnchor.x + 600);
            
        // this.debugText.setText(
        //     `scrollX:${this.cameras.main.scrollX}, Y:${this.emptyAnchor.y}`) 
// deltaAbsY :${this.deltaAbsY}
// left color:${this.bimbo}`)
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
                            fireSphereArr[0].destroy();
                            myScoreChecker.changeAmmo(-5);
                            if(myScoreChecker.ammo[0] <= 0){
                                try{
                                    globalThis.gYsdk.features.GameplayAPI.stop()
                                }catch(err){}
                                let content:domElContent = myModalWnd.getModalWnd(ModalWndMode.AMMO);
                                let dom = this.add.dom(this.emptyAnchor.x, 300,'div', content.styleContent);
                                dom.setHTML(content.htmlContent);
                                dom.addListener('click');
                                dom.on('click', (evt) => {
                                    let retryBtnDiv = document.getElementById("retryBtnDiv");
                                    let tutorBtnDiv = document.getElementById("tutorBtnDiv");
                                    let currAchievments:Achievments ={ 
                                        numAttempts:globalThis.plrAchievments.numAttempts++,
                                        numKilledGangs: globalThis.numKilledGangs
                                    }
                                
                                    if(retryBtnDiv.contains(evt.target))
                                    {
                                        dom.removeAllListeners('click');
                                        recoverData(currAchievments,"sceneB");
                                        //this.scene.start("sceneB");
                                    }else if(tutorBtnDiv.contains(evt.target)){
                                        dom.removeAllListeners('click');
                                        recoverData(currAchievments,"tutorScene");
                                        //this.scene.start("tutorScene");
                                    }
                                });
                                this.scene.pause();
                            }
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
                                {
                                    locPerson = person;
                                    person.shootTimeLine.pause();
                                    person.fxClrMatrix.brightness(7)
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
                        locPerson.health -= globalThis.elStrength;
                        if(locPerson.health > 0){
                             locPerson.shootTimeLine.resume();
                        }else if(locPerson.state != STATE.EMPTY){
                            locPerson.shootTimeLine.stop();
                            locPerson.sprite.setTexture('atlas0',"empty");
                            locPerson.state = STATE.EMPTY;
                            locPerson.flashSpriteArr.forEach((spr) => {
                                spr.setTexture('atlas0',"empty");
                            })
                            this.goldEl.setPosition(locPerson.sprite.x, locPerson.sprite.y);
                            this.goldEl.setTexture('atlas0',"goldEl").setDepth(2);
                            this.tweens.add({
                                targets:this.goldEl,
                                scale: 0.3,
                                x: myScoreChecker.barsContainer.x + 280,
                                y: myScoreChecker.barsContainer.y,
                                duration: 1000,
                                onComplete: () => {
                                    this.goldEl.setTexture('atlas0',"empty");
                                    myScoreChecker.changeMoney(10);
                                    globalThis.numKilledGangs++;

                                    if(globalThis.numKilledGangs == 9){
                                        let content:domElContent = myModalWnd.getModalWnd(ModalWndMode.WIN);
                                        this.winWnd = this.add.dom(this.emptyAnchor.x, 300,'div', content.styleContent);
                                        this.winWnd.setHTML(content.htmlContent).setAlpha(0);
                                        this.add.tween({
                                        targets:this.winWnd,
                                        props:{alpha:1},
                                        duration:3000,
                                        yoyo:true,
                                        onComplete: () => {
                                            this.scene.pause();
                                            this.scene.launch('winScene',{x:this.emptyAnchor.x});
                                        }
                                    })
                                    }
                                }
                            })
                        }
                    } 
                }
            }
        ]).play();
    }
}
