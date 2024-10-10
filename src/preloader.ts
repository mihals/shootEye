import * as Phaser from 'phaser';

//жёлтая кнопка w=251, h=64, r=30, clr=#e7a425, контур clr=#f6dfa3
// смещение по x = +4, по y = +4
//красная clr=#85132a, контур clr=#e9d1d6

export enum STATE {EMPTY, HIDDEN, APPIARENCE, ACTIVE};


/** объект для описания персонажа - необязательное имя файла из
 *  которого загружается изображение, ключ этого изображения,
 *  анимация, связанная с персонажем, объект спрайта и смещение
 *  относительно родительского объекта */
export type PersonMap = {
    fileName?:string
    spriteKey?:string
    animKey:string
    sprite?:Phaser.GameObjects.Sprite
    deltaX:number,
    deltaY:number,
    state?:STATE,
    hiddenArea?:{dX:number,dY:number,w:number,h:number},
    activeArea?:{dX:number,dY:number,w:number,h:number},
    flashesArr?:Array<{dx:number, dy:number}>
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

export const objectsArr:Array<ObjectMap> = [
    //object1Map = 
    {
        fileName: 'assets/building0',
        objKey: 'building0',
        objectX: 547,
        objectY: 410,
        personArr: [{
            deltaX: -359, deltaY: 77, animKey: "elAnim0", state: STATE.HIDDEN,
            hiddenArea: { dX: -336, dY: 28, w: 42, h: 55 },
            activeArea: { dX: -420, dY: 30, w: 117, h: 113 },
            flashesArr:[{dx:-379,dy:90},{dx:-340,dy:90}]
        },
            {
            deltaX: -23, deltaY: -151, animKey: "elAnim1", state: STATE.HIDDEN,
            hiddenArea: { dX: -86, dY: -84, w: 38, h: 36 },
            activeArea: { dX: -67, dY: -255, w: 86, h: 116 },
            flashesArr:[{dx:-39,dy:-194},{dx:-9,dy:-196}]
        },
            {
                deltaX: 493, deltaY: 78, animKey: "elAnim2", state: STATE.HIDDEN,
                hiddenArea: { dX: 379, dY: 22, w: 48, h: 74 },
                activeArea: { dX: 396, dY: 12, w: 227, h: 141 },
                flashesArr:[{dx:503,dy:105}]
            } //1075,445
        ]
    },
    
    //object2Map = 
    {
        fileName: 'assets/building1',
        objKey: 'building1',
        objectX: 1869,
        objectY: 410,
        personArr: [{
            deltaX: -50, deltaY: 86, animKey: "elAnim3", state: STATE.HIDDEN,
            hiddenArea: { dX: 0, dY: 60, w: 22, h: 40 },
            activeArea: { dX: -126, dY: 54, w: 76, h: 76 },
            flashesArr:[{dx:-100,dy:90},{dx:-72,dy:90}]
        },
        {
            deltaX: 463, deltaY: 35, animKey: "elAnim4", state: STATE.HIDDEN,
            hiddenArea: { dX: 313, dY: -34, w: 40, h: 60 },
            activeArea: { dX: 433, dY: 10, w: 130, h: 122 },
            flashesArr:[{dx:484,dy:74},{dx:520,dy:74}]
            //1075,445
        }
        ]
    },

    //object3Map = 
    {
        fileName: 'assets/building2',
        objKey: 'building2',
        objectX: 794,
        objectY: 368,
        personArr: [{
            deltaX: 46, deltaY: 92, animKey: "elAnim5", state: STATE.HIDDEN,
            hiddenArea: { dX: 133, dY: 66, w: 46, h: 50 },
            activeArea: { dX: -89, dY: 43, w: 160, h: 116 },
            flashesArr:[{dx:-48,dy:105},{dx:33,dy:98}]
        }
        ],
    },

    //object4Map = 
    {
        fileName: 'assets/building3',
        objKey: 'building3',
        objectX: 2300,
        objectY: 320,
        personArr: [{
            deltaX: 9, deltaY: -62, animKey: "elAnim6", state: STATE.HIDDEN,
            hiddenArea: { dX: -6, dY: -187, w: 34, h: 58 },
            activeArea: { dX: -71, dY: -95, w: 143, h: 167 },
            flashesArr:[{dx:-22,dy:-5},{dx:27,dy:-5}]
        },
        ]
    },

    //object5Map = 
    {
        fileName: 'assets/building4',
        objKey: 'building4',
        objectX: 1350,
        objectY: 320,
        personArr: [{
            deltaX: -4, deltaY: 86, animKey: "elAnim7", state: STATE.HIDDEN,
            hiddenArea: { dX: 55, dY: 55, w: 58, h: 40 },
            activeArea: { dX: -75, dY: 23, w: 132, h: 230 },
            flashesArr:[{dx:-22,dy:168}]
        }
        ]
    },


    //object6Map = 
    {
        fileName: 'assets/building7',
        objKey: 'building7',
        objectX: 1090,
        objectY: 358,
        personArr: [{
            deltaX: 351, deltaY: 97, animKey: "elAnim8", state: STATE.HIDDEN,
            hiddenArea: { dX: 398, dY: 24, w: 32, h: 61 },
            activeArea: { dX: 400, dY: 35, w: 178, h: 195 },
            flashesArr:[{dx:442, dy:150}]
        },
        {
            deltaX: 351, deltaY: 97, animKey: "elAnim8", state: STATE.HIDDEN,
            hiddenArea: { dX: 238, dY: 19, w: 34, h: 66 },
            activeArea: { dX: 134, dY: -12, w: 134, h: 242 },
            flashesArr:[{dx:247, dy:126}]
        }
        ]
    }
];

export class Preloader extends Phaser.Scene
{
    object1Map:ObjectMap;
    object2Map:ObjectMap;
    object3Map: ObjectMap;
    object4Map: ObjectMap;
    object5Map: ObjectMap;
    object6Map: ObjectMap;
    

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
                repeat: 0
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
                repeat: 0
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
                repeat: 0
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
                repeat: 0
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
                repeat: 0
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
                repeat: 0
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
                repeat: 0
            },
            {
                key: 'elAnim7',
                frames: [
                    { key: 'an7fr0' },
                    { key: 'an7fr1' },
                    { key: 'an7fr2' },
                ],
                frameRate: 5,
                repeat: 0
            },
            {
                key: 'elAnim8',
                frames: [
                    { key: 'an8fr0' },
                    { key: 'an8fr1' },
                    { key: 'an8fr2' },
                ],
                frameRate: 5,
                repeat: 0
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
            personArr: [{
                deltaX: 46, deltaY: 92, animKey: "elAnim5",
                hiddenArea: { dX: -133, dY: -66, w: 46, h: 50 },
                activeArea: { dX: -89, dY: -43, w: 160, h: 116 }
            },
            ]
        }

        this.object4Map = {
            fileName: 'assets/building3',
            objKey: 'building3',
            objectX: 300,
            objectY: 368,
            personArr: [{ deltaX: 9, deltaY: 62, animKey: "elAnim6", 
                        hiddenArea:{dX:-6,dY:-187,w:34,h:58},
                        activeArea:{dX:-71,dY:-95,w:143,h:167} },
            ]
        }

        this.object5Map = {
            fileName: 'assets/building4',
            objKey: 'building4',
            objectX: 636,
            objectY: 296,
            personArr: [{ deltaX: -4, deltaY: 86, animKey: "elAnim7" },
            ]
        }
    }

    preload (){
        this.load.image('groundL', 'assets/groundL.png');
        this.load.image('bigFlash','assets/bigFlash.png');
        this.load.image('smallFlash','assets/smallFlash.png');
        this.load.image('landscapeL','assets/landscapeL.png');
        this.load.image('landscapeEnd','assets/landscapeEnd.png');
        this.load.image('empty','assets/empty.png');
        this.load.image('emptyAnchor','assets/gunAim.png');
        this.load.image('redBall','assets/redBall41x41.png');
        this.load.image('wantedStand','assets/wantedStand.png');
        this.load.image('flowerStones','assets/flowerStones.png');
        this.load.image('doorBld4','assets/doorBld4.png');
        

        this.load.image('yellowBtn','assets/yellowBtn.png');
        this.load.image('redBtn','assets/redBtn.png');
        this.load.image('dlgWnd','assets/dlgWnd.png');
        this.load.image('yellowRect','assets/yellowRect.png');

        // this.load.image(this.object1Map.objKey, this.object1Map.fileName + ".png");
        // this.load.image(this.object2Map.objKey, this.object2Map.fileName + ".png");
        // this.load.image(this.object3Map.objKey, this.object3Map.fileName + ".png");
        // this.load.image(this.object4Map.objKey, this.object4Map.fileName + ".png");
        // this.load.image(this.object5Map.objKey, this.object5Map.fileName + ".png");

        objectsArr.forEach((item) => {
            this.load.image(item.objKey, item.fileName + ".png");
        })

        this.animsArr.forEach((anim) => {
            (anim.frames as Phaser.Types.Animations.AnimationFrame[]).forEach(frame => {
                this.load.image(frame.key,"assets/" + frame.key + ".png")
            });
        })



        //this.load.image('building4','assets/building4.png');
        // this.load.image('an7fr0','assets/an7fr0.png');
        // this.load.image('an7fr1','assets/an7fr1.png');
        // this.load.image('an7fr2','assets/an7fr2.png');
    }

    create(){
        // создаём анимации по конфигам из массива animsArr
        this.animsArr.forEach( anim => {
            this.anims.create(anim);
        })

        this.scene.start('sceneD',{from:"preloader"});
    }
}