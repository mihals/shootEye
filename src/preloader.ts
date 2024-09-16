import * as Phaser from 'phaser';

/** объект для описания персонажа - необязательное имя файла из
 *  которого загружается изображение, ключ этого изображения,
 *  анимация, связанная с персонажем, объект спрайта */
export type PersonMap = {
    fileName?:string
    spriteKey?:string
    animKey?:string
    sprite?:Phaser.GameObjects.Sprite
    deltaX:number,
    deltaY:number
}

/** объект для описания сценического объекта - дома, сарая и т.п.,
 *  координаты его на сцене, массив связанных с ним персонажей с указанием
 *  смещения X и Y относительно самого объекта
 */
export type ObjectMap = {
    fileName:string
    objKey:string
    objectX : number
    objectY : number
    personArr:Array<PersonMap>
}

export class Preloader extends Phaser.Scene
{
    object1Map:ObjectMap;
    object2Map:ObjectMap;
    object3Map: ObjectMap;
    object4Map: ObjectMap;
    

    /** массив объектов конфигураций для анимаций, используемых
     * для данной сцены */
    animsArr: Array<Phaser.Types.Animations.Animation>;

    constructor(){
        super("preloader")

        this.animsArr = [
            {
                key: 'elAnim0',
                frames: [
                    { key: 'an0fr0' },
                    { key: 'an0fr1' },
                    { key: 'an0fr2' },
                    { key: 'an0fr3' },
                    { key: 'an0fr4' }
                ],
                frameRate: 5,
                repeat: -1
            },
            {
                key: 'elAnim1',
                frames: [
                    { key: 'an1fr0' },
                    { key: 'an1fr1' },
                    { key: 'an1fr2' },
                    { key: 'an1fr3' },
                    { key: 'an1fr4' }
                ],
                frameRate: 5,
                repeat: -1
            },
            {
                key: 'elAnim2',
                frames: [
                    { key: 'an2fr0' },
                    { key: 'an2fr1' },
                    { key: 'an2fr2' },
                    { key: 'an2fr3' },
                    { key: 'an2fr4' }
                ],
                frameRate: 5,
                repeat: -1
            },
            {
                key: 'elAnim3',
                frames: [
                    { key: 'an3fr0' },
                    { key: 'an3fr1' },
                    { key: 'an3fr2' },
                    { key: 'an3fr3' },
                    { key: 'an3fr4' }
                ],
                frameRate: 5,
                repeat: -1
            },
            {
                key: 'elAnim4',
                frames: [
                    { key: 'an4fr0' },
                    { key: 'an4fr1' },
                    { key: 'an4fr2' },
                    { key: 'an4fr3' },
                    { key: 'an4fr4' }
                ],
                frameRate: 5,
                repeat: -1
            },
            {
                key: 'elAnim5',
                frames: [
                    { key: 'an5fr0' },
                    { key: 'an5fr1' },
                    { key: 'an5fr2' },
                    { key: 'an5fr3' },
                    { key: 'an5fr4' }
                ],
                frameRate: 5,
                repeat: -1
            },
            {
                key: 'elAnim6',
                frames: [
                    { key: 'an6fr0' },
                    { key: 'an6fr1' },
                    { key: 'an6fr2' },
                    { key: 'an6fr3' },
                    { key: 'an6fr4' }
                ],
                frameRate: 5,
                repeat: -1
            }]

        this.object1Map = {
            fileName: 'assets/building0',
            objKey: 'building0',
            objectX: 547,
            objectY: 410,
            personArr: [{ deltaX: -359, deltaY: 77, animKey: "elAnim0" },
            { deltaX: -23, deltaY: -151, animKey: "elAnim1" },
            { deltaX: 493, deltaY: 78, animKey: "elAnim2" } //1075,445
            ]
        }

        this.object2Map = {
            fileName: 'assets/building1',
            objKey: 'building1',
            objectX: 1869,
            objectY: 410,
            personArr: [{ deltaX: -50, deltaY: 86, animKey: "elAnim3" },
            { deltaX: 463, deltaY: 35, animKey: "elAnim4" }
            ]
        }

        this.object3Map = {
            fileName: 'assets/building2',
            objKey: 'building2',
            objectX: 1300,
            objectY: 368,
            personArr: [{ deltaX: 46, deltaY: 92, animKey: "elAnim5" },
            ]
        }

        this.object4Map = {
            fileName: 'assets/building3',
            objKey: 'building3',
            objectX: 300,
            objectY: 368,
            personArr: [{ deltaX: 9, deltaY: 62, animKey: "elAnim6" },
            ]
        }
    }

    preload (){
        this.load.image('groundL', 'assets/groundL.png');
        this.load.image('landscapeL','assets/landscapeL.png');
        this.load.image('emptyAnchor','assets/redBall41x41.png');

        this.load.image(this.object1Map.objKey, this.object1Map.fileName + ".png");
        this.load.image(this.object2Map.objKey, this.object2Map.fileName + ".png");
        this.load.image(this.object3Map.objKey, this.object3Map.fileName + ".png");
        this.load.image(this.object4Map.objKey, this.object4Map.fileName + ".png");

        this.animsArr.forEach((anim) => {
            (anim.frames as Phaser.Types.Animations.AnimationFrame[]).forEach(frame => {
                this.load.image(frame.key,"assets/" + frame.key + ".png")
            });
        })
    }

    create(){
        // создаём анимации по конфигам из массива animsArr
        this.animsArr.forEach( anim => {
            this.anims.create(anim);
        })

        this.scene.start('sceneA',{from:"preloader"});
    }
}