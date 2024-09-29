import * as Phaser from 'phaser';
import { PersonMap } from './preloader';
import { ObjectMap } from './preloader';
import { objectsArr } from './preloader';
import {STATE } from './preloader';

export class SceneB extends Phaser.Scene
{
    //object2Map:ObjectMap;
    startKey:boolean;
    emptyAnchor:Phaser.GameObjects.Image;
    cursors:Phaser.Types.Input.Keyboard.CursorKeys;
    direction:string
    fireKey:Phaser.Input.Keyboard.Key;

    debugText:Phaser.GameObjects.Text;

    /** массив объектов конфигураций для анимаций, используемых
     * для данной сцены */
    //animsArr: Array<Phaser.Types.Animations.Animation>;
    sceneObjArr:Array<ObjectMap>
    // object3Map: ObjectMap;
    // object4Map: ObjectMap;

    graphics:Phaser.GameObjects.Graphics;

    constructor ()
    {
        super('sceneB');

        // this.object3Map = {
        //     fileName: 'assets/building2',
        //     objKey: 'building2',
        //     objectX: 794,
        //     objectY: 368,
        //     personArr: [{
        //         deltaX: 46, deltaY: 92, animKey: "elAnim5",
        //         hiddenArea: { dX: 133, dY: 66, w: 46, h: 50 },
        //         activeArea: { dX: -89, dY: 43, w: 160, h: 116 }
        //     }
        //     ]
        // }

        // this.object4Map = {
        //     fileName: 'assets/building3',
        //     objKey: 'building3',
        //     objectX: 2300,
        //     objectY: 320,
        //     personArr: [{
        //         deltaX: 9, deltaY: -62, animKey: "elAnim6",
        //         hiddenArea: { dX: -6, dY: -187, w: 34, h: 58 },
        //         activeArea: { dX: -71, dY: -95, w: 143, h: 167 }
        //     },
        //     ]
        // }

        // this.object3Map = objectsArr[2];
        // this.object4Map = objectsArr[3];
        
        //this.contrAngle = 60*Math.PI/180;
        //0.7071067812 = sqrt(2)/2 = sin(45) = cos(45)
        //113,137084992 = 160(половина размаха ушей бимбы) * cos(45)
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
        //this.add.image(2400,273,'landscapeL');
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
            let sprKey: string = ('fileName' in person) ? person.fileName :
                this.anims.get(person.animKey).frames[0].textureKey;
            person.sprite = this.add.sprite(this.sceneObjArr[0].objectX + person.deltaX,
                this.sceneObjArr[0].objectY + person.deltaY, (sprKey as string));
        }
        )

        this.add.image(1400,440,'wantedStand')
        this.add.image(192,500,'flowerStones')

        this.add.image(this.sceneObjArr[1].objectX, this.sceneObjArr[1].objectY,
            this.sceneObjArr[1].objKey);

        this.sceneObjArr[1].personArr.forEach((person) => {
            let sprKey: string = ('fileName' in person) ? person.fileName :
                this.anims.get(person.animKey).frames[0].textureKey;
            person.sprite = this.add.sprite(this.sceneObjArr[1].objectX + person.deltaX,
                this.sceneObjArr[1].objectY + person.deltaY, (sprKey as string));
        }
        )

        this.debugText = this.add.text(10,30,"");
        this.debugText.setFontSize(64)

        // let bnd = this.debugText.getBounds()
        // console.log(bnd)

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

        //this.sceneObjArr[0].personArr[0].state = STATE.ACTIVE;

        // this.add.image(640,360,'dlgWnd')
        // this.add.image(640,278,'yellowRect')
        // this.add.image(772,518,'redBtn')
        // this.add.image(503,518,'yellowBtn')

        //this.emptyAnchor.setScale(0.5)
        this.emptyAnchor.setDepth(1);
    }

    update(time: number, delta: number): void {
        if(!this.startKey){
            // this.object3Map.personArr.forEach(person => {
            //     person.sprite.play(person.animKey)
            // })

            // this.object4Map.personArr.forEach(person => {
            //     person.sprite.play(person.animKey)
            // })
            
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