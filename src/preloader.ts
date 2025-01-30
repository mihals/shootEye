import * as Phaser from 'phaser';
import { addLoading } from './game';

//жёлтая кнопка w=251, h=64, r=30, clr=#e7a425, контур clr=#f6dfa3
// смещение по x = +4, по y = +4
//красная clr=#85132a, контур clr=#e9d1d6

export enum STATE {EMPTY, HIDDEN, SHAKE, ACTIVE, APPIARENCE};

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
    health:number,
    hiddenArea?:{dX:number,dY:number,w:number,h:number},
    activeArea?:{dX:number,dY:number,w:number,h:number},
    flashesArr?:Array<{dx:number, dy:number}>,
    flashSpriteArr?:Array<Phaser.GameObjects.Sprite>,
    fxClrMatrix?:Phaser.FX.ColorMatrix;
    shootTimeLine?: Phaser.Time.Timeline,
    shoot?:() => void
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

export enum ModalWndMode {AMMO, HEALTH, WIN, GOBACK};

export let objectsArr:Array<ObjectMap> = [
    //object1Map = 
    {
        fileName: 'assets/building0',
        objKey: 'building0',
        objectX: 547,
        objectY: 410,
        personArr: [{
            deltaX: -359, deltaY: 77, animKey: "elAnim0", state: STATE.HIDDEN,health:100,
            hiddenArea: { dX: -336, dY: 28, w: 42, h: 55 },
            activeArea: { dX: -420, dY: 30, w: 117, h: 113 },
            flashesArr:[{dx:-379,dy:90},{dx:-340,dy:90}]
        },
            {
            deltaX: -23, deltaY: -151, animKey: "elAnim1", state: STATE.HIDDEN,health:100,
            hiddenArea: { dX: -86, dY: -84, w: 38, h: 36 },
            activeArea: { dX: -67, dY: -255, w: 86, h: 116 },
            flashesArr:[{dx:-39,dy:-194},{dx:-9,dy:-196}]
        },
            {
                deltaX: 493, deltaY: 78, animKey: "elAnim2", state: STATE.HIDDEN,health:100,
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
            deltaX: -50, deltaY: 86, animKey: "elAnim3", state: STATE.HIDDEN,health:100,
            hiddenArea: { dX: 0, dY: 60, w: 22, h: 40 },
            activeArea: { dX: -126, dY: 54, w: 76, h: 76 },
            flashesArr:[{dx:-100,dy:90},{dx:-72,dy:90}]
        },
        {
            deltaX: 463, deltaY: 35, animKey: "elAnim4", state: STATE.HIDDEN,health:100,
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
            deltaX: 46, deltaY: 92, animKey: "elAnim5", state: STATE.HIDDEN,health:100,
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
            deltaX: 9, deltaY: -62, animKey: "elAnim6", state: STATE.HIDDEN,health:100,
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
            deltaX: -4, deltaY: 86, animKey: "elAnim7", state: STATE.HIDDEN,health:100,
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
            deltaX: 351, deltaY: 97, animKey: "elAnim8", state: STATE.HIDDEN,health:200,
            hiddenArea: { dX: 398, dY: 24, w: 32, h: 61 },
            activeArea: { dX: 400, dY: 35, w: 178, h: 195 },
            flashesArr:[{dx:442, dy:150}, {dx:247, dy:126}]
        },
        // {
        //     deltaX: 351, deltaY: 97, animKey: "elAnim8", state: STATE.HIDDEN,health:100,
        //     hiddenArea: { dX: 238, dY: 19, w: 34, h: 66 },
        //     activeArea: { dX: 134, dY: -12, w: 134, h: 242 },
        //     flashesArr:[{dx:247, dy:126}]
        // }
        ]
    }
];

// export type ScoreType = {
//     health:Array<number>,
//     ammo:Array<number>,
//     money:Array<number>
// }

// export const score:ScoreType = {
//     health: [10,10,10,10,10,10,10,10,10,10],
//     ammo: [10,10,10,10,10,10,10,10,10,10],
//     money: [0,0,0,0,0,0,0,0,0,0],
// }

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
                    { key:'atlas0', frame: 'an0fr0' },
                    { key:'atlas0', frame: 'an0fr1' },
                    { key:'atlas0', frame: 'an0fr2' },
                    { key:'atlas0', frame: 'an0fr3' },
                    { key:'atlas0', frame: 'an0fr4' }
                ],
                frameRate: 5,
                repeat: 0
            },
            {
                key: 'elAnim1',
                frames: [
                    { key:'atlas0', frame: 'an1fr0' },
                    { key:'atlas0', frame: 'an1fr1' },
                    { key:'atlas0', frame: 'an1fr2' },
                    { key:'atlas0', frame: 'an1fr3' },
                    { key:'atlas0', frame: 'an1fr4' }
                ],
                frameRate: 5,
                repeat: 0
            },
            {
                key: 'elAnim2',
                frames: [
                    { key:'atlas1', frame: 'an2fr0' },
                    { key:'atlas1', frame: 'an2fr1' },
                    { key:'atlas1', frame: 'an2fr2' },
                    { key:'atlas1', frame: 'an2fr3' },
                    { key:'atlas1', frame: 'an2fr4' }
                ],
                frameRate: 5,
                repeat: 0
            },
            {
                key: 'elAnim3',
                frames: [
                    { key:'atlas1', frame: 'an3fr0' },
                    { key:'atlas1', frame: 'an3fr1' },
                    { key:'atlas1', frame: 'an3fr2' },
                    { key:'atlas1', frame: 'an3fr3' },
                    { key:'atlas1', frame: 'an3fr4' }
                ],
                frameRate: 5,
                repeat: 0
            },
            {
                key: 'elAnim4',
                frames: [
                    { key:'atlas1', frame: 'an4fr0' },
                    { key:'atlas1', frame: 'an4fr1' },
                    { key:'atlas1', frame: 'an4fr2' },
                    { key:'atlas1', frame: 'an4fr3' },
                    { key:'atlas1', frame: 'an4fr4' }
                ],
                frameRate: 5,
                repeat: 0
            },
            {
                key: 'elAnim5',
                frames: [
                    { key:'atlas1', frame: 'an5fr0' },
                    { key:'atlas1', frame: 'an5fr1' },
                    { key:'atlas1', frame: 'an5fr2' },
                    { key:'atlas1', frame: 'an5fr3' },
                    { key:'atlas1', frame: 'an5fr4' }
                ],
                frameRate: 5,
                repeat: 0
            },
            {
                key: 'elAnim6',
                frames: [
                    { key:'atlas1', frame: 'an6fr0' },
                    { key:'atlas1', frame: 'an6fr1' },
                    { key:'atlas1', frame: 'an6fr2' },
                    { key:'atlas1', frame: 'an6fr3' },
                    { key:'atlas1', frame: 'an6fr4' }
                ],
                frameRate: 5,
                repeat: 0
            },
            {
                key: 'elAnim7',
                frames: [
                    { key:'atlas1', frame: 'an7fr0' },
                    { key:'atlas1', frame: 'an7fr1' },
                    { key:'atlas1', frame: 'an7fr2' },
                ],
                frameRate: 5,
                repeat: 0
            },
            {
                key: 'elAnim8',
                frames: [
                    { key:'atlas1', frame: 'an8fr0' },
                    { key:'atlas1', frame: 'an8fr1' },
                    { key:'atlas1', frame: 'an8fr2' },
                ],
                frameRate: 5,
                repeat: 0
            }]

        // this.object1Map = {
        //     fileName: 'assets/building0',
        //     objKey: 'building0',
        //     objectX: 547,
        //     objectY: 410,
        //     personArr: [{ deltaX: -359, deltaY: 77, animKey: "elAnim0" },
        //     { deltaX: -23, deltaY: -151, animKey: "elAnim1" },
        //     { deltaX: 493, deltaY: 78, animKey: "elAnim2" } //1075,445
        //     ]
        // }

        // this.object2Map = {
        //     fileName: 'assets/building1',
        //     objKey: 'building1',
        //     objectX: 1869,
        //     objectY: 410,
        //     personArr: [{ deltaX: -50, deltaY: 86, animKey: "elAnim3" },
        //     { deltaX: 463, deltaY: 35, animKey: "elAnim4" }
        //     ]
        // }

        // this.object3Map = {
        //     fileName: 'assets/building2',
        //     objKey: 'building2',
        //     objectX: 1300,
        //     objectY: 368,
        //     personArr: [{
        //         deltaX: 46, deltaY: 92, animKey: "elAnim5",
        //         hiddenArea: { dX: -133, dY: -66, w: 46, h: 50 },
        //         activeArea: { dX: -89, dY: -43, w: 160, h: 116 }
        //     },
        //     ]
        // }

        // this.object4Map = {
        //     fileName: 'assets/building3',
        //     objKey: 'building3',
        //     objectX: 300,
        //     objectY: 368,
        //     personArr: [{ deltaX: 9, deltaY: 62, animKey: "elAnim6", 
        //                 hiddenArea:{dX:-6,dY:-187,w:34,h:58},
        //                 activeArea:{dX:-71,dY:-95,w:143,h:167} },
        //     ]
        // }

        // this.object5Map = {
        //     fileName: 'assets/building4',
        //     objKey: 'building4',
        //     objectX: 636,
        //     objectY: 296,
        //     personArr: [{ deltaX: -4, deltaY: 86, animKey: "elAnim7" },
        //     ]
        // }
    }

    preload (){

        this.load.atlas([{key: 'atlas0',textureURL: 'assets/atlas0.png',
            atlasURL: 'assets/atlas0.json'}, {key: 'atlas1',textureURL: 'assets/atlas1.png',
            atlasURL: 'assets/atlas1.json'}]);

        //this.load.image('groundL', 'assets/groundL.png');
        //this.load.image('bigFlash','assets/bigFlash.png');
        //this.load.image('smallFlash','assets/smallFlash.png');
        //this.load.image('landscapeL','assets/landscapeL.png');
        //this.load.image('landscapeEnd','assets/landscapeEnd.png');

        //this.load.image('empty','assets/empty.png');
        //this.load.image('emptyAnchor','assets/gunAim.png');
        //this.load.image('redBall','assets/redBall41x41.png');
        //this.load.image('wantedStand','assets/wantedStand.png');
        //this.load.image('flowerStones','assets/flowerStones.png');
        //this.load.image('doorBld4','assets/doorBld4.png');

        //this.load.image('yellowBtn','assets/yellowBtn.png');
        //this.load.image('redBtn','assets/redBtn.png');
        //this.load.image('dlgWnd','assets/dlgWnd.png');
        //this.load.image('yellowRect','assets/yellowRect.png');

        //this.load.image('unionBar','assets/unionBar.png');
        //this.load.image('healthPiece','assets/healthPiece.png');
        //this.load.image('moneyPiece','assets/moneyPiece.png');
        //this.load.image('ammoPiece','assets/ammoPiece.png');
        //this.load.image('goldEl','assets/goldEl.png');

        // this.load.image(this.object1Map.objKey, this.object1Map.fileName + ".png");
        // this.load.image(this.object2Map.objKey, this.object2Map.fileName + ".png");
        // this.load.image(this.object3Map.objKey, this.object3Map.fileName + ".png");
        // this.load.image(this.object4Map.objKey, this.object4Map.fileName + ".png");
        // this.load.image(this.object5Map.objKey, this.object5Map.fileName + ".png");

        // objectsArr.forEach((item) => {
        //     this.load.image(item.objKey, item.fileName + ".png");
        // })

        // this.animsArr.forEach((anim) => {
        //     (anim.frames as Phaser.Types.Animations.AnimationFrame[]).forEach(frame => {
        //         this.load.image(frame.key,"assets/" + frame.key + ".png")
        //     });
        // })



        //this.load.image('building4','assets/building4.png');
        // this.load.image('an7fr0','assets/an7fr0.png');
        // this.load.image('an7fr1','assets/an7fr1.png');
        // this.load.image('an7fr2','assets/an7fr2.png');

        //this.load.image('hand','assets/hand.png');
        //this.load.image('tutorBld','assets/tutorBld.png');
        //this.load.image('tutorBox','assets/tutorBox.png');
        //this.load.image('tutFr1','assets/tutFr1.png');
        //this.load.image('tutFr2','assets/tutFr2.png');
        //this.load.image('tutFr3','assets/tutFr3.png');
        //this.load.image('tutFr4','assets/tutFr4.png');
    }

    create(){
        // создаём анимации по конфигам из массива animsArr
        this.animsArr.forEach( anim => {
            this.anims.create(anim);
        })
        myScoreChecker = new ScoreChecker();
        myModalWnd = new ModalWnd();
        addLoading('isGameAtlas',1);
        //this.scene.start('sceneD',{from:"preloader"});
        //this.scene.start('sceneD');
    }
}

class ScoreChecker{

    health:Array<number>;
    ammo:Array<number>;
    money:Array<number>;
    barsContainer:Phaser.GameObjects.Container;

    constructor(){
        this.health = [10,10,10,10,10,10,10,10,10,10];
        this.ammo = [20,20,20,20,20,20,20,20,20,20];
        this.money = [0,0,0,0,0,0,0,0,0,0];
    }

    /** отрисовывает ресурсы в сцене */
    drawBars(scene:Phaser.Scene){
        this.barsContainer = scene.add.container(600, 45);
        this.barsContainer.addAt(scene.add.image(0, -1,'atlas0', 'unionBar'), 0);

        for (let i = 0; i < 10; i++) {
            this.barsContainer.addAt(scene.add.image(-488 + i * 24, 0,'atlas0', 'healthPiece'). 
                setAlpha(this.health[i]/10), i + 1);
        }
        for (let i = 0; i < 10; i++) {
            this.barsContainer.addAt(scene.add.image(-70 + i * 24, 0,'atlas0', 'ammoPiece').
                setAlpha(this.ammo[i]/10), i + 11);
        }
        for (let i = 0; i < 10; i++) {
            this.barsContainer.addAt(scene.add.image(340 + i * 24, 0,'atlas0', 'moneyPiece').
                setAlpha(this.money[i]/10), i + 21);
        }
    }

    setX(newX:number){
        this.barsContainer.setX(newX);
    }

    changeHealth(delta:number){
        let ind = this.health.findIndex((el) => {return el==0});
        
        if(ind == -1){
            this.health[9]-=5;
            (this.barsContainer.getAt(10) as Phaser.GameObjects.Image).
                setAlpha(this.health[9]/10);
        }else {
            this.health[ind-1]-=5;
            (this.barsContainer.getAt(ind) as Phaser.GameObjects.Image).
                setAlpha(this.health[ind-1]/10);
        }
    }

    changeAmmo(delta:number){
        let ind = this.ammo.findIndex((el) => {return el==0});

        if(ind == -1){
            this.ammo[9]-=5;
            (this.barsContainer.getAt(20) as Phaser.GameObjects.Image).
                setAlpha(this.ammo[9]/20);
        }else {
            this.ammo[ind-1]-=5;
            (this.barsContainer.getAt(ind+10) as Phaser.GameObjects.Image).
                setAlpha(this.ammo[ind-1]/20);
        }
    }

    changeMoney(delta?:number){
        let ind = this.money.findIndex((el) => {return el==0});
        if(ind != -1){
            this.money[ind] = 10;
            (this.barsContainer.getAt(ind+21) as Phaser.GameObjects.Image).
                setAlpha(1);
        }
    }
}

let myScoreChecker:ScoreChecker ;
export  {myScoreChecker};

export type domElContent = {
    htmlContent:string,
    styleContent:string
}
class ModalWnd{
    constructor(){

    }

    getModalWnd(mode:ModalWndMode):domElContent{
        let ammoHtmlRu:string =
        `<div id="uiContainer">
            <div id="modalWnd">
                <div id ="yellowRect">
                    <p id="msgP">У вас закончились патроны. Игра Закончена!</p>
                </div>
                <div id="buttonsCont">
                    <div id="tutorBtnDiv"><button id="tutorBtn"><span id="tutorSpan">Обучалка</span></button></div>
                    <div id="retryBtnDiv"><button id="retryBtn"><span id="retrySpan">Повторить</span></button></div>
                </div>
            </div>
        </div>`;
        

        let ammoHtmlEn:string =
        `<div id="uiContainer">
            <div id="modalWnd">
                <div id ="yellowRect">
                    <p id="msgP">You're out of ammo. The Game Is Over!</p>
                </div>
                <div id="buttonsCont">
                    <div id="tutorBtnDiv"><button id="tutorBtn"><span id="tutorSpan">&nbspTutor&nbsp</span></button></div>
                    <div id="retryBtnDiv"><button id="retryBtn"><span id="retrySpan">Try again</span></button></div>
                </div>
            </div>
        </div>`; 

        let healthHtmlRu:string =
        `<div id="uiContainer">
            <div id="modalWnd">
                <div id ="yellowRect">
                    <p id="msgP">У вас закончилась жизнь. Игра Закончена!</p>
                </div>
                <div id="buttonsCont">
                    <div id="tutorBtnDiv"><button id="tutorBtn"><span id="tutorSpan">Обучалка</span></button></div>
                    <div id="retryBtnDiv"><button id="retryBtn"><span id="retrySpan">Повторить</span></button></div>
                </div>
            </div>
        </div>`;
        

        let healthHtmlEn:string =
        `<div id="uiContainer">
            <div id="modalWnd">
                <div id ="yellowRect">
                    <p id="msgP">Your health is over. The Game Is Over!</p>
                </div>
                <div id="buttonsCont">
                    <div id="tutorBtnDiv"><button id="tutorBtn"><span id="tutorSpan">&nbspTutor&nbsp</span></button></div>
                    <div id="retryBtnDiv"><button id="retryBtn"><span id="retrySpan">Try again</span></button></div>
                </div>
            </div>
        </div>`; 

        let goBackHtmlRu:string =
        `<div class="uiContainer">
            <div class="modalWnd">
                <div class ="yellowRect">
                    <p class="msgP">Вам необходимо вернуться назад, чтобы 
                    уничтожить оставшихся бандитов !</p>
                </div>
            </div>
        </div>`;

        let goBackHtmlEn:string =
        `<div class="uiContainer">
            <div class="modalWnd">
                <div class ="yellowRect">
                    <p class="msgP">You need to go back to 
                    Destroy the remaining bandits !</p>
                </div>
            </div>
        </div>`;

        let winHtmlRu:string =
        `<div class="uiContainer">
            <div class="modalWnd">
                <div class ="yellowRect">
                    <p class="msgP">Поздравляем! Игра закончена!
                     Вы полностью уничтожили всю банду! </p>
                </div>
            </div>
        </div>`;

        let winHtmlEn:string =
        `<div class="uiContainer">
            <div class="modalWnd">
                <div class ="yellowRect">
                    <p class="msgP">Congratulations! The game is over!
                    You have completely destroyed the entire gang!</p>
                </div>
            </div>
        </div>`;

        let content:string;
        switch(mode){
            case ModalWndMode.AMMO:
                content = globalThis.lang == "ru"?ammoHtmlRu:ammoHtmlEn;
                return {htmlContent:content, styleContent:""};
                break;
            case ModalWndMode.HEALTH:
                content = globalThis.lang == "ru"?healthHtmlRu:healthHtmlEn;
                return {htmlContent:content, styleContent:""};
                break;
            case ModalWndMode.GOBACK:
                content = globalThis.lang == "ru"?goBackHtmlRu:goBackHtmlEn;
                return {htmlContent:content, styleContent:""};
                break;
            case ModalWndMode.WIN:
                content = globalThis.lang == "ru"?winHtmlRu:winHtmlEn;
                return {htmlContent:content, styleContent:""};
        }

        // return{htmlContent:
        // `<div id="uiContainer">
        //     <div id="modalWnd">
        //         <div id ="yellowRect">
        //             <p id="msgP">У вас закончились патроны. Игра Закончена!</p>
        //         </div>
        //         <div id="buttonsCont">
        //             <div id="tutorBtnDiv"><button id="tutorBtn"><span id="tutorSpan">Обучалка</span></button></div>
        //             <div id="retryBtnDiv"><button id="retryBtn"><span id="retrySpan">Повторить</span></button></div>
        //         </div>
        //     </div>
        // </div>`,
        // styleContent:""
        // `#uiContainer { width: 1200px; height: 625px; }
        // #modalWnd { position: absolute; display: flex; flex-direction: column; align-items: center;
        //     justify-content: space-between;
        //     align-content: space-between; width: 536px; height: 418px; left: 362px; top: 148px; 
        //     border-radius: 10px;  background-color: rgba(0, 0, 0, 0.8);}
        // #yellowRect { width: 500px; height: 172px; margin-top: 44px; border-radius: 10px;
        //     border: 3px solid white; border-width: 3px; background-color: #fbedd2;}
        // #buttonsCont { width: 536px; margin-bottom: 30px; display: flex; flex-direction: row;
        //     justify-content: space-around;}
        // #tutorBtn {border-radius: 15px; background-color: #f8b927; padding: 10px;}
        // #retryBtn {border-radius: 15px; background-color: #861229; padding: 10px;}
        // #tutorSpan {
        //     color: #fafafa;
        //     font-family: Arial, Roboto, Helvetica, sans-serif;
        //     font-weight: bold;
        //     font-size: 30px;
        // }
        // #retrySpan {
        //     color: #fafafa;
        //     font-family: Arial, Roboto, Helvetica, sans-serif;
        //     font-weight: bold;
        //     font-size: 30px;
        // }
        // #msgP {
        //     text-align: center;
        //     color: #861229;
        //     font-family: Arial, Roboto, Helvetica, sans-serif;
        //     font-weight: bold;
        //     font-size: 30px;
        // }`
    }
}

let myModalWnd:ModalWnd;
export {myModalWnd};

/** перезапускает игру после неудачной попытки, возвращает слонов-гангстеров на
 *  исходные, перезаписывает достижения пользователя, если его достижения (numKilledGangs)
 *  улучшились, показывает рекламу
 */
export function recoverData(currAchievments:Achievments, sceneName:string){
    saveResult(currAchievments.numKilledGangs);
    globalThis.numKilledGangs = 0;

    switch(globalThis.elStrength){
        case 20:
            if(globalThis.plrAchievments.numKilledGangs >= 3)
                elStrength = 25;
            break;
        case 25:
            if(globalThis.plrAchievments.numKilledGangs >= 5)
                elStrength = 35;
            break;
        case 35:
            if(globalThis.plrAchievments.numKilledGangs >= 7)
                elStrength = 50;
            break;
    }
    
    objectsArr = [
        //object1Map = 
        {
            fileName: 'assets/building0',
            objKey: 'building0',
            objectX: 547,
            objectY: 410,
            personArr: [{
                deltaX: -359, deltaY: 77, animKey: "elAnim0", state: STATE.HIDDEN,health:100,
                hiddenArea: { dX: -336, dY: 28, w: 42, h: 55 },
                activeArea: { dX: -420, dY: 30, w: 117, h: 113 },
                flashesArr:[{dx:-379,dy:90},{dx:-340,dy:90}]
            },
                {
                deltaX: -23, deltaY: -151, animKey: "elAnim1", state: STATE.HIDDEN,health:100,
                hiddenArea: { dX: -86, dY: -84, w: 38, h: 36 },
                activeArea: { dX: -67, dY: -255, w: 86, h: 116 },
                flashesArr:[{dx:-39,dy:-194},{dx:-9,dy:-196}]
            },
                {
                    deltaX: 493, deltaY: 78, animKey: "elAnim2", state: STATE.HIDDEN,health:100,
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
                deltaX: -50, deltaY: 86, animKey: "elAnim3", state: STATE.HIDDEN,health:100,
                hiddenArea: { dX: 0, dY: 60, w: 22, h: 40 },
                activeArea: { dX: -126, dY: 54, w: 76, h: 76 },
                flashesArr:[{dx:-100,dy:90},{dx:-72,dy:90}]
            },
            {
                deltaX: 463, deltaY: 35, animKey: "elAnim4", state: STATE.HIDDEN,health:100,
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
                deltaX: 46, deltaY: 92, animKey: "elAnim5", state: STATE.HIDDEN,health:100,
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
                deltaX: 9, deltaY: -62, animKey: "elAnim6", state: STATE.HIDDEN,health:100,
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
                deltaX: -4, deltaY: 86, animKey: "elAnim7", state: STATE.HIDDEN,health:100,
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
                deltaX: 351, deltaY: 97, animKey: "elAnim8", state: STATE.HIDDEN,health:100,
                hiddenArea: { dX: 398, dY: 24, w: 32, h: 61 },
                activeArea: { dX: 400, dY: 35, w: 178, h: 195 },
                flashesArr:[{dx:442, dy:150}, {dx:247, dy:126}]
            },
            ]
        }
    ]

    myScoreChecker.health = [10,10,10,10,10,10,10,10,10,10];
    myScoreChecker.ammo = [20,20,20,20,20,20,20,20,20,20];
    myScoreChecker.money = [0,0,0,0,0,0,0,0,0,0];

    globalThis.directions = {toRight: false, toLeft: false,
        toUp:false, toDown: false};
    
    showAdv(sceneName);
}

function showAdv(sceneName:string){
    try {
        globalThis.gYsdk.adv.showFullscreenAdv({
            callbacks: {
                onClose: () => {
                    try{
                        globalThis.gYsdk.features.GameplayAPI.start()
                    }catch(err){}
                    globalThis.currentScene.scene.start(sceneName,null);
                },
                onError: (e) => {
                    try{
                        globalThis.gYsdk.features.GameplayAPI.start()
                    }catch(err){}
                    globalThis.currentScene.scene.start(sceneName,null);
                }
            }
        });

    } catch (err) {
        try{
            globalThis.gYsdk.features.GameplayAPI.start()
        }catch(err){}
        globalThis.currentScene.scene.start(sceneName,null);
    }
}

function saveResult(numKilledGangs:number){
    //globalThis.plrAchievments.numAttempts++;
    
    if(numKilledGangs>globalThis.plrAchievments.numKilledGangs){
        globalThis.plrAchievments.numKilledGangs = numKilledGangs;
    }

    //globalThis.plrAchievments.numAttempts++;

    try{
        localStorage.setItem("data", JSON.stringify(globalThis.plrAchievments));
    }catch(err){}

    try{
        globalThis.gPlayer.setData({achv:JSON.stringify(globalThis.plrAchievments)});
    }catch(err){}
}

export function winScene(scene:Phaser.Scene){
    
    scene.scene.launch("winScene");
}

