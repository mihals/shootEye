import * as Phaser from 'phaser';
import { PersonMap } from './preloader';
import { ObjectMap } from './preloader';
import { objectsArr } from './preloader';
import { STATE } from './preloader';

export class SceneB extends Phaser.Scene
{
    startKey:boolean;
    emptyAnchor:Phaser.GameObjects.Image;
    cursors:Phaser.Types.Input.Keyboard.CursorKeys;
    direction:string
    fireKey:Phaser.Input.Keyboard.Key;
    dragIsStart:boolean = false;

    debugText:Phaser.GameObjects.Text;

    /** массив объектов конфигураций для анимаций, используемых
     * для данной сцены */
    sceneObjArr:Array<ObjectMap>

    graphics:Phaser.GameObjects.Graphics;

    constructor ()
    {
        super('sceneB');
    }  

    init(data){
        console.log(data)
    }

    create ()
    {
        globalThis.currentScene = this;
        this.startKey = false;

        this.sceneObjArr = [objectsArr[2], objectsArr[3]];

        this.cameras.main.setBounds(0,0,3600,675);
        this.physics.world.setBounds(0,0,3600,675);

        this.add.image(600,608,'groundL')
        this.add.image(1800,608,'groundL').setFlipX(true);
        this.add.image(3000,608,'groundL')
        
        this.add.image(600,273,'landscapeL');
        this.add.image(1800,273,'landscapeL').setFlipX(true);
        this.add.image(3000,273,'landscapeL')//.setFlipX(true);

        // краешек здания из obj5Map
        this.add.image(3750,320,objectsArr[4].objKey);

        this.emptyAnchor = this.add.image(600, 100, 'emptyAnchor');

        this.cursors = this.input.keyboard.createCursorKeys();

        // this.cameras.main.startFollow(this.ship, true, 0.08, 0.08);
        this.cameras.main.startFollow(this.emptyAnchor, true);

        this.add.image(this.sceneObjArr[0].objectX, this.sceneObjArr[0].objectY,
            this.sceneObjArr[0].objKey);

        this.sceneObjArr[0].personArr.forEach((person) => {
            if (person.state != STATE.EMPTY) {
                let sprKey: string = this.anims.get(person.animKey).
                    frames[0].textureKey;
                if (person.state == STATE.HIDDEN) {
                    person.sprite = this.add.sprite(this.sceneObjArr[0].objectX +
                        person.deltaX, this.sceneObjArr[0].objectY +
                    person.deltaY, (sprKey as string));
                } else if (person.state == STATE.ACTIVE) {
                    let lastFrame: number = this.anims.get(person.animKey).
                        frames.length - 1;
                    sprKey = this.anims.get(person.animKey).
                        frames[lastFrame].textureKey;
                    person.sprite = this.add.sprite(this.sceneObjArr[0].objectX +
                        person.deltaX, this.sceneObjArr[0].objectY +
                    person.deltaY, (sprKey as string));
                }
            }
        }
        )

        this.add.image(1400,440,'wantedStand')
        this.add.image(192,500,'flowerStones')

        this.add.image(this.sceneObjArr[1].objectX, this.sceneObjArr[1].objectY,
            this.sceneObjArr[1].objKey);

        this.sceneObjArr[1].personArr.forEach((person) => {
            if (person.state != STATE.EMPTY) {
                let sprKey: string = this.anims.get(person.animKey).
                    frames[0].textureKey;
                if (person.state == STATE.HIDDEN) {
                    person.sprite = this.add.sprite(this.sceneObjArr[1].objectX +
                        person.deltaX, this.sceneObjArr[1].objectY +
                    person.deltaY, (sprKey as string));
                } else if (person.state == STATE.ACTIVE) {
                    let lastFrame: number = this.anims.get(person.animKey).
                        frames.length - 1;
                    sprKey = this.anims.get(person.animKey).
                        frames[lastFrame].textureKey;
                    person.sprite = this.add.sprite(this.sceneObjArr[1].objectX +
                        person.deltaX, this.sceneObjArr[1].objectY +
                    person.deltaY, (sprKey as string));
                }
            }
        }
        )

        this.debugText = this.add.text(10,30,"");
        this.debugText.setFontSize(64)

        //this.input.addPointer(2)

        this.input.on('pointerdown', (pointer) => {
            
            if (pointer.x < this.cameras.main.scrollX)
            {
                this.direction = "left";
            }
            else if (pointer.x > this.cameras.main.scrollX) {
                this.direction = "right";
            }
        })


        // отладочная инфа для выделения областей где перс прячется
        // и откуда стреляет
        this.graphics =  this.add.graphics();
        this.graphics.lineStyle(5, 0xFF00FF, 1.0);

        this.sceneObjArr[0].personArr.forEach((person) => {
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
        })

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

        this.fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.fireKey.on("down", (key, event) => {
            this.sceneObjArr.forEach((obj) => {
                if("personArr" in obj){
                    obj.personArr.forEach((pers) => {
                        // если перс прячется
                        if(pers.state == STATE.HIDDEN){
                            if( new Phaser.Geom.Rectangle(
                                obj.objectX+pers.hiddenArea.dX,
                                obj.objectY+pers.hiddenArea.dY,
                                pers.hiddenArea.w,
                                pers.hiddenArea.h
                            ).contains(this.emptyAnchor.x, this.emptyAnchor.y)){
                                pers.sprite.play(pers.animKey);
                                pers.state = STATE.ACTIVE;
                                if("flashesArr" in pers){
                                    pers.flashesArr.forEach((value) => {
                                        this.add.sprite(obj.objectX + value.dx,
                                            obj.objectY + value.dy, "bigFlash");
                                    })
                                }
                            }
                            // если перс уже выскочил
                        } else if (pers.state == STATE.ACTIVE) {
                            if (new Phaser.Geom.Rectangle(
                                obj.objectX + pers.activeArea.dX,
                                obj.objectY + pers.activeArea.dY,
                                pers.activeArea.w,
                                pers.activeArea.h
                            ).contains(this.emptyAnchor.x, this.emptyAnchor.y)) {
                                pers.sprite.setTexture("doorBld4");
                                pers.state = STATE.EMPTY;
                            }
                        }
                    })
                }
            })
        } )

        let pointer = this.input.activePointer;
        console.log(pointer);
        let res =this.input.addPointer(2);
        console.log(res);
        // this.input.on('pointerdown', (pointer) => {
        //     var touchX = pointer.x;
        //     var touchY = pointer.y;
        //     // ...
        // });
        // this.input.on('drag', (pointer) => {
        //     var touchX = pointer.x;
        //     console.log(touchX);
        //     var touchY = pointer.y;
        //     // ...
        // });

        //this.events.st
        // let tm = this.input.pointer1.;
        //      console.log(tm.enabled)
        // }

        this.input.on('pointermove', (arg) => {
            console.log(arg)
            let pointer = this.input.activePointer;
            console.log(pointer)
        })
        this.emptyAnchor.setDepth(1);

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
            this.debugText.x += 1.5;
        }
        
        if (this.cursors.left.isDown && this.emptyAnchor.x > 0) {

            this.emptyAnchor.x -= 1.5;
            this.debugText.x -= 1.5;
        }
        else if (this.cursors.right.isDown && this.emptyAnchor.x < 3600) {
            this.emptyAnchor.x += 1.5;
            this.debugText.x += 1.5;
        }

        if(this.cursors.up.isDown && this.emptyAnchor.y > 0){
            this.emptyAnchor.y -=1.5
        }else if(this.cursors.down.isDown && this.emptyAnchor.y < 675){
            this.emptyAnchor.y +=1.5
        }

        if (this.emptyAnchor.x < 600) {
            this.scene.start('sceneA',{from:"sceneB"})
        }

        if(this.emptyAnchor.x > 3000){
            this.scene.start('sceneC',{from:"demo", gunAimY : this.emptyAnchor.y});
        }
            
        this.debugText.setText(
            `scrollX:${this.cameras.main.scrollX}, Y:${this.emptyAnchor.y}`) 
// deltaAbsY :${this.deltaAbsY}
// left color:${this.bimbo}`)
    }
}