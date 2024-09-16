import * as Phaser from 'phaser';
import { PersonMap } from './preloader';
import { ObjectMap } from './preloader';

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
    object1Map:ObjectMap;
    object2Map:ObjectMap;
    //object4Map:ObjectMap;

    startKey:boolean;
    emptyAnchor:Phaser.GameObjects.Image;
    cursors:Phaser.Types.Input.Keyboard.CursorKeys;

    /** массив объектов конфигураций для анимаций, используемых
     * для данной сцены */
    animsArr: Array<Phaser.Types.Animations.Animation>;
    debugText:Phaser.GameObjects.Text;
    prevScene:string;
    

    constructor ()
    {
        super('sceneA');

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

        

        //this.contrAngle = 60*Math.PI/180;
        //0.7071067812 = sqrt(2)/2 = sin(45) = cos(45)
        //113,137084992 = 160(половина размаха ушей бимбы) * cos(45)
    }  

    init(data){
        console.log(data)
        if('from' in data){
            this.prevScene = data.from;
        }else{this.prevScene = ""}
    }


    create ()
    {
        globalThis.currentScene = this;
        this.startKey = false;

        this.cameras.main.setBounds(0,0,3600,675);
        this.physics.world.setBounds(0,0,3600,675);

        this.add.image(600,608,'groundL')
        this.add.image(1800,608,'groundL').setFlipX(true);
        this.add.image(3000,608,'groundL')

        this.add.image(600,273,'landscapeL');
        this.add.image(1800,273,'landscapeL').setFlipX(true);
        this.add.image(3000,273,'landscapeL')//.setFlipX(true);
        
        this.add.image(3700,368,'building2')//.setFlipX(true);

        this.emptyAnchor = this.add.image(600, 100, 'emptyAnchor');

        this.cursors = this.input.keyboard.createCursorKeys();

        // this.cameras.main.startFollow(this.ship, true, 0.08, 0.08);
        this.cameras.main.startFollow(this.emptyAnchor, true);

        //this.cameras.main.setZoom(4);
        //this.cameras.resize(500,500)
        //this.cameras.main.setZoom(1);
        //this.cameras.main.centerOn(0, 0);
        
        
        
        // добавляем картинку объекта
        this.add.image(this.object2Map.objectX, this.object2Map.objectY,
            this.object2Map.objKey);

        this.object2Map.personArr.forEach((person) => {
            let sprKey: string = ('fileName' in person) ? person.fileName :
                this.anims.get(person.animKey).frames[0].textureKey;
            person.sprite = this.add.sprite(this.object2Map.objectX + person.deltaX,
                this.object2Map.objectY + person.deltaY, (sprKey as string));
        })

        this.add.image(this.object1Map.objectX, this.object1Map.objectY,
            this.object1Map.objKey);

        this.object1Map.personArr.forEach((person) => {
            let sprKey: string = ('fileName' in person) ? person.fileName :
                this.anims.get(person.animKey).frames[0].textureKey;
            person.sprite = this.add.sprite(this.object1Map.objectX + person.deltaX,
                this.object1Map.objectY + person.deltaY, (sprKey as string));
        }
        )

        

        let myGraphics:Phaser.GameObjects.Graphics = this.add.graphics();
        myGraphics.lineStyle(50, 0xffffff);
        //myGraphics.fillCircle(100,100,50)
        this.debugText = this.add.text(800,30,"");
        this.debugText.setFontSize(64)
        //this.debugText.style.fontSize = '64px';
        //myGraphics.lineBetween(100, 100, 600, 500);
        
        if(this.prevScene == "sceneB"){
            this.emptyAnchor.setX(3000)
            //this.cameras.main.scrollX = 2399;
        }
    }

    update(time: number, delta: number): void {
        
        if(!this.startKey){
            this.object1Map.personArr.forEach(person => {
                person.sprite.play(person.animKey)
            })
            this.object2Map.personArr.forEach(person => {
                person.sprite.play(person.animKey)
            })
            

            let ch = this.children.getChildren()
            console.log(ch.length)
            this.startKey = true;
        }

        if (this.cursors.left.isDown && this.emptyAnchor.x > 0)
            {
                
                this.emptyAnchor.x -= 1.5;
            }
            else if (this.cursors.right.isDown && this.emptyAnchor.x < 3600)
            {
                this.emptyAnchor.x += 1.5;
            }

            if(this.emptyAnchor.x > 3000){
                this.scene.start('sceneB',{from:"demo"});
            }
            
         this.debugText.setText(
             `scrollX:${this.cameras.main.scrollX}` )
// deltaAbsY :${this.deltaAbsY}
// left color:${this.bimbo}`)
    }
}