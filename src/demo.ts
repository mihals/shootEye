import * as Phaser from 'phaser';

/** объект для описания персонажа - необязательное имя файла из
 *  которого загружается изображение, ключ этого изображения,
 *  анимация, связанная с персонажем, объект спрайта */
type PersonMap = {
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
type ObjectMap = {
    fileName:string
    objKey:string
    objectX : number
    objectY : number
    personArr:Array<PersonMap>
}

export class Demo extends Phaser.Scene
{
    infoText:Phaser.GameObjects.Text;
    object2Map:ObjectMap;
    startKey:boolean;
    emptyAnchor:Phaser.GameObjects.Image;
    cursors:Phaser.Types.Input.Keyboard.CursorKeys;

    /** массив объектов конфигураций для анимаций, используемых
     * для данной сцены */
    animsArr: Array<Phaser.Types.Animations.Animation>;

    constructor ()
    {
        super('demo');

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
            }
        ];

        this.object2Map = {
            fileName:'assets/building1',
            objKey:'building1',
            objectX:612,
            objectY:410,
            personArr:[{ deltaX:-50, deltaY:86, animKey:"elAnim3"},
                        { deltaX:463, deltaY:35, animKey:"elAnim4"} //1075,445
            ]
        }

        //this.contrAngle = 60*Math.PI/180;
        //0.7071067812 = sqrt(2)/2 = sin(45) = cos(45)
        //113,137084992 = 160(половина размаха ушей бимбы) * cos(45)
    }  

    init(data){
        console.log(data)
    }

    preload ()
    {
        this.load.image('landscapeL','assets/landscapeL.png');
        this.load.image('emptyAnchor','assets/redBall41x41.png');

        this.animsArr.forEach((anim) => {
            (anim.frames as Phaser.Types.Animations.AnimationFrame[]).forEach(frame => {
                this.load.image(frame.key,"assets/" + frame.key + ".png")
            });
        })

        this.load.image(this.object2Map.objKey, this.object2Map.fileName + ".png");

        this.object2Map.personArr.forEach(person => {
            if('fileName' in person){
                this.load.image(person.spriteKey, "assets/" + person.fileName + ".png")
            }
        })
    }

    create ()
    {
        globalThis.currentScene = this;
        this.startKey = false;

        this.cameras.main.setBounds(0,0,3600,675);
        this.physics.world.setBounds(0,0,3600,675);
        this.add.image(600,273,'landscapeL');
        this.add.image(1800,273,'landscapeL').setFlipX(true);
        //this.add.image(2400,273,'landscapeL');
        this.add.image(3000,273,'landscapeL')//.setFlipX(true);

        this.emptyAnchor = this.add.image(600, 100, 'emptyAnchor');

        this.cursors = this.input.keyboard.createCursorKeys();

        // this.cameras.main.startFollow(this.ship, true, 0.08, 0.08);
        this.cameras.main.startFollow(this.emptyAnchor, true);

        //this.cameras.main.setZoom(4);
        //this.cameras.resize(500,500)
        //this.cameras.main.setZoom(1);
        //this.cameras.main.centerOn(0, 0);
        
        // создаём анимации по конфигам из массива animsArr
        this.animsArr.forEach( anim => {
            this.anims.create(anim);
        })
        
        // добавляем картинку объекта
        this.add.image(this.object2Map.objectX, this.object2Map.objectY,
            this.object2Map.objKey);

        this.object2Map.personArr.forEach((person) => {
            //this.anims.get(person.animKey).frames[0].textureKey;
            let sprKey: string = ('fileName' in person) ? person.fileName :
                this.anims.get(person.animKey).frames[0].textureKey;
            person.sprite = this.add.sprite(this.object2Map.objectX + person.deltaX,
                this.object2Map.objectY + person.deltaY, (sprKey as string));
        }
        )
        
    }

    update(time: number, delta: number): void {
        
        if(!this.startKey){
            this.object2Map.personArr.forEach(person => {
                person.sprite.play(person.animKey)
            })
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
            
//         this.debugText.setText(
//             `overlap body:${this.bodyOver} 
// deltaAbsY :${this.deltaAbsY}
// left color:${this.bimbo}`)
    }
}