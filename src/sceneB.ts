import * as Phaser from 'phaser';
import { PersonMap } from './preloader';
import { ObjectMap } from './preloader';

export class SceneB extends Phaser.Scene
{
    infoText:Phaser.GameObjects.Text;
    //object2Map:ObjectMap;
    startKey:boolean;
    emptyAnchor:Phaser.GameObjects.Image;
    cursors:Phaser.Types.Input.Keyboard.CursorKeys;

    /** массив объектов конфигураций для анимаций, используемых
     * для данной сцены */
    animsArr: Array<Phaser.Types.Animations.Animation>;
    object3Map: ObjectMap;
    object4Map: ObjectMap;

    constructor ()
    {
        super('sceneB');

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
            objectX: 2300,
            objectY: 320,
            personArr: [{ deltaX: 9, deltaY: -62, animKey: "elAnim6" },
            ]
        }
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

        this.add.image(this.object3Map.objectX, this.object3Map.objectY,
            this.object3Map.objKey);

        this.object3Map.personArr.forEach((person) => {
            let sprKey: string = ('fileName' in person) ? person.fileName :
                this.anims.get(person.animKey).frames[0].textureKey;
            person.sprite = this.add.sprite(this.object3Map.objectX + person.deltaX,
                this.object3Map.objectY + person.deltaY, (sprKey as string));
        }
        )

        this.add.image(this.object4Map.objectX, this.object4Map.objectY,
            this.object4Map.objKey);

        this.object4Map.personArr.forEach((person) => {
            let sprKey: string = ('fileName' in person) ? person.fileName :
                this.anims.get(person.animKey).frames[0].textureKey;
            person.sprite = this.add.sprite(this.object4Map.objectX + person.deltaX,
                this.object4Map.objectY + person.deltaY, (sprKey as string));
        }
        )
    }

    update(time: number, delta: number): void {
        if(!this.startKey){
            this.object3Map.personArr.forEach(person => {
                person.sprite.play(person.animKey)
            })

            this.object4Map.personArr.forEach(person => {
                person.sprite.play(person.animKey)
            })
            
            this.startKey = true;
        }

        if (this.cursors.left.isDown && this.emptyAnchor.x > 0) {

            this.emptyAnchor.x -= 1.5;
        }
        else if (this.cursors.right.isDown && this.emptyAnchor.x < 3600) {
            this.emptyAnchor.x += 1.5;
        }

        if (this.emptyAnchor.x < 600) {
            this.scene.start('sceneA',{from:"sceneB"})
        }
            
//         this.debugText.setText(
//             `overlap body:${this.bodyOver} 
// deltaAbsY :${this.deltaAbsY}
// left color:${this.bimbo}`)
    }
}