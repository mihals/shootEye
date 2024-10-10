import * as Phaser from 'phaser';
import { PersonMap } from './preloader';
import { ObjectMap } from './preloader';
import { objectsArr } from './preloader';
import {STATE } from './preloader';

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
    // object3Map: ObjectMap;
    // object4Map: ObjectMap;
    // object5Map: ObjectMap;
    // object1Map: ObjectMap;
    gunAimY:number;

    debugText:Phaser.GameObjects.Text;
    graphics: Phaser.GameObjects.Graphics;

    constructor ()
    {
        super('sceneC');

        // this.object3Map = {
        //     fileName: 'assets/building2',
        //     objKey: 'building2',
        //     objectX: 794,
        //     objectY: 368,
        //     personArr: [{ deltaX: 46, deltaY: 92, animKey: "elAnim5" },
        //     ]
        // }

        // this.object1Map = {
        //     fileName: 'assets/building0',
        //     objKey: 'building0',
        //     objectX: 2947,
        //     objectY: 410,
        //     personArr: [{
        //         deltaX: -359, deltaY: 77, animKey: "elAnim0",
        //         hiddenArea: { dX: -336, dY: 28, w: 42, h: 55 },
        //         activeArea: { dX: -420, dY: 30, w: 117, h: 113 }
        //     },
        //     {
        //         deltaX: -23, deltaY: -151, animKey: "elAnim1",
        //         hiddenArea: { dX: -88, dY: -84, w: 38, h: 36 },
        //         activeArea: { dX: -67, dY: -255, w: 86, h: 116 }
        //     },
        //     { deltaX: 493, deltaY: 78, animKey: "elAnim2" }
        //     ]
        // }

        // this.object5Map = {
        //     fileName: 'assets/building4',
        //     objKey: 'building4',
        //     objectX: 1350,
        //     objectY: 320,
        //     personArr: [{
        //         deltaX: -4, deltaY: 86, animKey: "elAnim7",
        //         hiddenArea: { dX: 55, dY: 55, w: 58, h: 40 },
        //         activeArea: { dX: -75, dY: 23, w: 132, h: 230 }
        //     }
        //     ]
        // }

        this.gunAimY = 350;
        //this.contrAngle = 60*Math.PI/180;
        //0.7071067812 = sqrt(2)/2 = sin(45) = cos(45)
        //113,137084992 = 160(половина размаха ушей бимбы) * cos(45)
    }  

    init(data){
        console.log(data)
        if('gunAimY' in data){
            this.gunAimY = data.gunAimY;
        }
    }

    

    create ()
    {
        globalThis.currentScene = this;
        this.startKey = false;
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

        this.emptyAnchor = this.add.image(600, 100, 'emptyAnchor');

        this.cursors = this.input.keyboard.createCursorKeys();

        // this.cameras.main.startFollow(this.ship, true, 0.08, 0.08);
        this.cameras.main.startFollow(this.emptyAnchor, true);


        this.add.image(this.sceneObjArr[0].objectX, this.sceneObjArr[0].objectY,
            this.sceneObjArr[0].objKey);

        // this.sceneObjArr[0].personArr.forEach((person) => {
        //     let sprKey: string = ('fileName' in person) ? person.fileName :
        //         this.anims.get(person.animKey).frames[0].textureKey;
        //     person.sprite = this.add.sprite(this.sceneObjArr[0].objectX + person.deltaX,
        //         this.sceneObjArr[0].objectY + person.deltaY, (sprKey as string));
        // }
        // )

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

        this.add.image(this.sceneObjArr[1].objectX, this.sceneObjArr[1].objectY,
            this.sceneObjArr[1].objKey);

        this.sceneObjArr[1].personArr.forEach((person) => {
            let sprKey: string = ('fileName' in person) ? person.fileName :
                this.anims.get(person.animKey).frames[0].textureKey;
            person.sprite = this.add.sprite(this.sceneObjArr[1].objectX + person.deltaX,
                this.sceneObjArr[1].objectY + person.deltaY, (sprKey as string));
        }
        )

        this.add.image(-100,320,'building3');
        //this.add.image(2947,410,'building0');

        // this.add.image(1300,440,'wantedStand')
        // this.add.image(192,500,'flowerStones')

        // this.add.image(this.object4Map.objectX, this.object4Map.objectY,
        //     this.object4Map.objKey);

        // this.object4Map.personArr.forEach((person) => {
        //     let sprKey: string = ('fileName' in person) ? person.fileName :
        //         this.anims.get(person.animKey).frames[0].textureKey;
        //     person.sprite = this.add.sprite(this.object4Map.objectX + person.deltaX,
        //         this.object4Map.objectY + person.deltaY, (sprKey as string));
        // }
        // )

        // this.add.image(636,296,'building4')
        // this.add.image(632,382,"an7fr2")

        this.input.addPointer(2)

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
                        }else if(pers.state == STATE.ACTIVE){
                            if( new Phaser.Geom.Rectangle(
                                obj.objectX+pers.activeArea.dX,
                                obj.objectY+pers.activeArea.dY,
                                pers.activeArea.w,
                                pers.activeArea.h
                            ).contains(this.emptyAnchor.x, this.emptyAnchor.y)){
                                if (pers.animKey == "elAnim7") {
                                    pers.sprite.setTexture("doorBld4");
                                } else {
                                    pers.sprite.setTexture("empty");
                                }
                            }
                        }
                    })
                }
            })
        } )
        
        this.emptyAnchor.setDepth(1);
        this.emptyAnchor.y = this.gunAimY;
    }

    update(time: number, delta: number): void {
        if(!this.startKey){
            // this.object5Map.personArr.forEach(person => {
            //     person.sprite.play(person.animKey)
            // })

            // this.object5Map.personArr.forEach(person => {
            //     person.sprite.play(person.animKey)
            // })
            
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
            this.scene.start('sceneA',{from:"sceneB"})
        }

        if(this.emptyAnchor.x > 3000){
            this.scene.start('sceneA',{from:"demo", gunAimY : this.emptyAnchor.y});
        }
            
        this.debugText.setText(
            `scrollX:${this.cameras.main.scrollX}, Y:${this.emptyAnchor.y}`) ;
// deltaAbsY :${this.deltaAbsY}
// left color:${this.bimbo}`)
    }
}