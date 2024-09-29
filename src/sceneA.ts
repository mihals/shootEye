import * as Phaser from 'phaser';
import { PersonMap } from './preloader';
import { ObjectMap } from './preloader';
import { objectsArr } from './preloader';
import {STATE } from './preloader';

// /** объект для описания персонажа - необязательное имя файла из
//  *  которого загружается изображение, ключ этого изображения,
//  *  анимация, связанная с персонажем, объект спрайта */
// export type PersonMap = {
//     fileName?:string
//     spriteKey?:string
//     animKey?:string
//     sprite?:Phaser.GameObjects.Sprite
//     deltaX:number,
//     deltaY:number
// }

// /** объект для описания сценического объекта - дома, сарая и т.п.,
//  *  координаты его на сцене, массив связанных с ним персонажей с указанием
//  *  смещения X и Y относительно самого объекта
//  */
// export type ObjectMap = {
//     fileName:string
//     objKey:string
//     objectX : number
//     objectY : number
//     personArr:Array<PersonMap>
// }

export class SceneA extends Phaser.Scene
{
    infoText:Phaser.GameObjects.Text;
    //object1Map:ObjectMap;
    //object2Map:ObjectMap;
    //object4Map:ObjectMap;
    sceneObjArr:Array<ObjectMap>;
    fireKey:Phaser.Input.Keyboard.Key;

    startKey:boolean;
    emptyAnchor:Phaser.GameObjects.Image;
    cursors:Phaser.Types.Input.Keyboard.CursorKeys;

    /** массив объектов конфигураций для анимаций, используемых
     * для данной сцены */
    animsArr: Array<Phaser.Types.Animations.Animation>;
    debugText:Phaser.GameObjects.Text;
    prevScene:string;
    direction:string;
    graphics: Phaser.GameObjects.Graphics;
    gunAimY: number;

    constructor ()
    {
        super('sceneA');

        // this.object1Map = {
        //     fileName: 'assets/building0',
        //     objKey: 'building0',
        //     objectX: 547,
        //     objectY: 410,
        //     personArr: [{
        //         deltaX: -359, deltaY: 77, animKey: "elAnim0",
        //         hiddenArea: { dX: -336, dY: 28, w: 42, h: 55 },
        //         activeArea: { dX: -420, dY: 30, w: 117, h: 113 }
        //     },
        //         {
        //         deltaX: -23, deltaY: -151, animKey: "elAnim1",
        //         hiddenArea: { dX: -86, dY: -84, w: 38, h: 36 },
        //         activeArea: { dX: -67, dY: -255, w: 86, h: 116 }
        //     },
        //         {
        //             deltaX: 493, deltaY: 78, animKey: "elAnim2",
        //             hiddenArea: { dX: 379, dY: 22, w: 48, h: 74 },
        //             activeArea: { dX: 396, dY: 12, w: 227, h: 141 }
        //         } //1075,445
        //     ]
        // }

        // this.object2Map = {
        //     fileName: 'assets/building1',
        //     objKey: 'building1',
        //     objectX: 1869,
        //     objectY: 410,
        //     personArr: [{
        //         deltaX: -50, deltaY: 86, animKey: "elAnim3",
        //         hiddenArea: { dX: 0, dY: 60, w: 22, h: 40 },
        //         activeArea: { dX: -126, dY: 54, w: 76, h: 76 }
        //     },
        //     {
        //         deltaX: 463, deltaY: 35, animKey: "elAnim4",
        //         hiddenArea: { dX: 313, dY: -34, w: 40, h: 60 },
        //         activeArea: { dX: 433, dY: 10, w: 130, h: 122 }
        //     }
        //     ]
        //}

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

        this.sceneObjArr = [objectsArr[0], objectsArr[1]];

        this.sceneObjArr[0].objectX = 547;
        this.sceneObjArr[0].objectY = 410;

        //console.log(objectsArr[0].objectX);

        this.cameras.main.setBounds(0,0,3600,675);
        this.physics.world.setBounds(0,0,3600,675);

        this.add.image(600,608,'groundL')
        this.add.image(1800,608,'groundL').setFlipX(true);
        this.add.image(3000,608,'groundL')

        this.add.image(600,273,'landscapeL');
        this.add.image(1800,273,'landscapeL').setFlipX(true);
        this.add.image(3000,273,'landscapeL')//.setFlipX(true);
        
        //this.add.image(3700,368,'building2')//.setFlipX(true);

        this.emptyAnchor = this.add.image(600, 100, 'emptyAnchor');

        this.cursors = this.input.keyboard.createCursorKeys();

        // this.cameras.main.startFollow(this.ship, true, 0.08, 0.08);
        this.cameras.main.startFollow(this.emptyAnchor, true);

        //this.cameras.main.setZoom(4);
        //this.cameras.resize(500,500)
        //this.cameras.main.setZoom(1);
        //this.cameras.main.centerOn(0, 0);
        
        
        
        // добавляем картинку объекта
        this.add.image(this.sceneObjArr[1].objectX, this.sceneObjArr[1].objectY,
            this.sceneObjArr[1].objKey);

        this.sceneObjArr[1].personArr.forEach((person) => {
            let sprKey: string = ('fileName' in person) ? person.fileName :
                this.anims.get(person.animKey).frames[0].textureKey;
            person.sprite = this.add.sprite(this.sceneObjArr[1].objectX + person.deltaX,
                this.sceneObjArr[1].objectY + person.deltaY, (sprKey as string));
        })

        this.add.image(this.sceneObjArr[0].objectX, this.sceneObjArr[0].objectY,
            this.sceneObjArr[0].objKey);

        this.sceneObjArr[0].personArr.forEach((person) => {
            let sprKey: string = ('fileName' in person) ? person.fileName :
                this.anims.get(person.animKey).frames[0].textureKey;
            person.sprite = this.add.sprite(this.sceneObjArr[0].objectX + person.deltaX,
                this.sceneObjArr[0].objectY + person.deltaY, (sprKey as string));
        }
        )

        

        // let myGraphics:Phaser.GameObjects.Graphics = this.add.graphics();
        // myGraphics.lineStyle(50, 0xffffff);
        //myGraphics.fillCircle(100,100,50)
        this.debugText = this.add.text(10,30,"");
        this.debugText.setFontSize(64)
        //this.debugText.style.fontSize = '64px';
        //myGraphics.lineBetween(100, 100, 600, 500);
        
        if(this.prevScene == "sceneB"){
            this.emptyAnchor.setX(3000)
            //this.cameras.main.scrollX = 2399;
        }

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

        this.sceneObjArr[1].personArr.forEach((person) => {
            if ("hiddenArea" in person) {
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
            }
        })

        this.fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        this.fireKey.on("down", (key, event) => {
            this.sceneObjArr.forEach((obj) => {
                if("personArr" in obj){
                    obj.personArr.forEach((pers) => {
                        if(pers.state == STATE.HIDDEN){
                            if( new Phaser.Geom.Rectangle(
                                obj.objectX+pers.hiddenArea.dX,
                                obj.objectY+pers.hiddenArea.dY,
                                pers.hiddenArea.w,
                                pers.hiddenArea.h
                            ).contains(this.emptyAnchor.x, this.emptyAnchor.y)){
                                pers.sprite.play(pers.animKey);
                                pers.state = STATE.ACTIVE;
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
            // this.object1Map.personArr.forEach(person => {
            //     person.sprite.play(person.animKey)
            // })
            // this.object2Map.personArr.forEach(person => {
            //     person.sprite.play(person.animKey)
            // })
            

            // let ch = this.children.getChildren()
            // console.log(ch.length)
            this.startKey = true;
        }

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

            if(this.emptyAnchor.x > 3000){
                this.scene.start('sceneB',{from:"demo"});
            }
            
         this.debugText.setText(
             `scrollX:${this.cameras.main.scrollX}, Y:${this.emptyAnchor.y}` )
// deltaAbsY :${this.deltaAbsY}
// left color:${this.bimbo}`)
    }
}