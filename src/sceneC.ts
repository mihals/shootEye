import * as Phaser from 'phaser';
import { PersonMap } from './preloader';
import { ObjectMap } from './preloader';
import { objectsArr } from './preloader';
import {STATE } from './preloader';
//import { score } from './preloader';
import { myScoreChecker } from './preloader';

export class SceneC extends Phaser.Scene
{
    infoText:Phaser.GameObjects.Text;
    //object2Map:ObjectMap;
    startKey:boolean;
    emptyAnchor:Phaser.GameObjects.Image;
    cursors:Phaser.Types.Input.Keyboard.CursorKeys;
    direction:string;
    fireKey:Phaser.Input.Keyboard.Key;
    sceneObjArr:Array<ObjectMap>;

    /** массив объектов конфигураций для анимаций, используемых
     * для данной сцены */
    animsArr: Array<Phaser.Types.Animations.Animation>;
    
    gunAimX:number;
    gunAimY:number;

    barsContainer:Phaser.GameObjects.Container;

    debugText:Phaser.GameObjects.Text;
    graphics: Phaser.GameObjects.Graphics;
    goldEl:Phaser.GameObjects.Image;

    constructor ()
    {
        super('sceneC');

        this.gunAimY = 350;
        //this.contrAngle = 60*Math.PI/180;
        //0.7071067812 = sqrt(2)/2 = sin(45) = cos(45)
        //113,137084992 = 160(половина размаха ушей бимбы) * cos(45)
    }  

    init(data) {
        if ("from" in data) {
            if (data.from == "sceneB") {
                this.gunAimY = data.gunAimY;
                this.gunAimX = 600;
            }
            if (data.from == "sceneA") {
                this.gunAimY = data.gunAimY;
                this.gunAimX = 2999;
            }
        }
    }

    create ()
    {
        globalThis.currentScene = this;
        this.startKey = false;

        // объект находится и в соседней сцене
        objectsArr[0].objectX = 2947;
        objectsArr[0].objectY = 410;

        this.sceneObjArr = [objectsArr[0], objectsArr[4]];

        this.cameras.main.setBounds(0,0,3600,675);
        this.physics.world.setBounds(0,0,3600,675);

        this.add.image(600,608,'groundL')
        this.add.image(1800,608,'groundL').setFlipX(true);
        this.add.image(3000,608,'groundL')
        
        
        this.add.image(600,273,'landscapeL');
        this.add.image(1800,273,'landscapeL').setFlipX(true);
        //this.add.image(2400,273,'landscapeL');
        this.add.image(3000,273,'landscapeL')//.setFlipX(true);

        this.emptyAnchor = this.add.image(this.gunAimX, this.gunAimY, 'emptyAnchor');

        this.cursors = this.input.keyboard.createCursorKeys();

        // this.cameras.main.startFollow(this.ship, true, 0.08, 0.08);
        this.cameras.main.startFollow(this.emptyAnchor, true);


        this.add.image(this.sceneObjArr[0].objectX, this.sceneObjArr[0].objectY,
            this.sceneObjArr[0].objKey);

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

        this.add.image(-100,320,'building3');
        
        // золотая монетка - бонус, премия за подбитого слона
        this.goldEl = this.add.image(0,0, "image");


        this.input.on('pointerdown', (pointer) => {
            
            if (pointer.x < this.cameras.main.scrollX)
            {
                this.direction = "left";
            }
            else if (pointer.x > this.cameras.main.scrollX) {
                this.direction = "right";
            }
        })

        this.debugText = this.add.text(10,30,"");
        this.debugText.setFontSize(64)

        // отладочная инфа для выделения областей где перс прячется
        // и откуда стреляет
        this.graphics =  this.add.graphics();
        this.graphics.lineStyle(5, 0xFF00FF, 1.0);

        this.sceneObjArr[1].personArr.forEach((person) => {
            this.graphics.strokeRect(
                this.sceneObjArr[1].objectX + person.hiddenArea.dX,
                this.sceneObjArr[1].objectY + person.hiddenArea.dY,
                person.hiddenArea.w, person.hiddenArea.h
            );
            this.graphics.strokeRect(
                this.sceneObjArr[1].objectX + person.activeArea.dX,
                this.sceneObjArr[1].objectY + person.activeArea.dY,
                person.activeArea.w, person.activeArea.h
            );
        })

        this.fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.fireKey.on("down", (key, event) => {
            this.shootToPerson(this.emptyAnchor.x, this.emptyAnchor.y);
        })

        this.emptyAnchor.setDepth(1);
        this.emptyAnchor.y = this.gunAimY;

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

        myScoreChecker.drawBars(this);
    }

    update(time: number, delta: number): void {
        if(!this.startKey){
            this.startKey = true;
        }

        if(this.direction == "left" && this.emptyAnchor.x > 0){
            this.emptyAnchor.x -= 1.5;
            this.debugText.x -= 1.5;
        }else if(this.direction == "right" && this.emptyAnchor.x < 3600){
            this.emptyAnchor.x += 1.5;
            this.debugText.x+=1.5;
        }
        
        if (this.cursors.left.isDown && this.emptyAnchor.x > 0) {

            this.emptyAnchor.x -= 1.5;
            this.debugText.x-=1.5;
        }
        else if (this.cursors.right.isDown && this.emptyAnchor.x < 3600) {
            this.emptyAnchor.x += 1.5;
            this.debugText.x+=1.5;
        }

        if(this.cursors.up.isDown && this.emptyAnchor.y > 0){
            this.emptyAnchor.y -=1.5
        }else if(this.cursors.down.isDown && this.emptyAnchor.y < 675){
            this.emptyAnchor.y +=1.5
        }

        if (this.emptyAnchor.x < 600) {
            this.scene.start('sceneB',{from:"sceneC", gunAimY : this.emptyAnchor.y})
        }

        if(this.emptyAnchor.x > 3000){
            this.scene.start('sceneA',{from:"sceneC", gunAimY : this.emptyAnchor.y});
        }

        myScoreChecker.setX(this.cameras.main.scrollX + 600);
            
        this.debugText.setText(
            `scrollX:${this.cameras.main.scrollX}, Y:${this.emptyAnchor.y}`) ;
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
                            //if(this.elephShootTL.paused)
                                //this.elephShootTL.resume();
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
                            if(locPerson.sprite.texture.key == "an7fr2"){
                                locPerson.sprite.setTexture("doorBld4");
                            }else{
                                locPerson.sprite.setTexture("empty");
                            }
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