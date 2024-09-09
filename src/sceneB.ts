import * as Phaser from 'phaser';

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

    constructor ()
    {
        super('sceneB');

        

        //this.contrAngle = 60*Math.PI/180;
        //0.7071067812 = sqrt(2)/2 = sin(45) = cos(45)
        //113,137084992 = 160(половина размаха ушей бимбы) * cos(45)
    }  

    init(data){
        console.log(data)
    }

    preload ()
    {
        this.load.image('building1','assets/building1.png');
        //this.load.image('emptyAnchor','assets/redBall41x41.png');

        
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

        this.add.image(400,300,'building1');

        //this.cameras.main.setZoom(4);
        //this.cameras.resize(500,500)
        //this.cameras.main.setZoom(1);
        //this.cameras.main.centerOn(0, 0);
        
        
        
    }

    update(time: number, delta: number): void {
        

        if (this.cursors.left.isDown && this.emptyAnchor.x > 0) {

            this.emptyAnchor.x -= 1.5;
        }
        else if (this.cursors.right.isDown && this.emptyAnchor.x < 3600) {
            this.emptyAnchor.x += 1.5;
        }

        if (this.emptyAnchor.x < 600) {
            this.scene.start('demo',{from:"sceneB"})
        }
            
//         this.debugText.setText(
//             `overlap body:${this.bodyOver} 
// deltaAbsY :${this.deltaAbsY}
// left color:${this.bimbo}`)
    }
}