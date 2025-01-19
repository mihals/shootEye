import * as Phaser from 'phaser';
import {Preloader} from './preloader'
import {SceneA} from './sceneA'
import { SceneB } from './sceneB';
import { SceneC } from './sceneC';
import { SceneD } from './sceneD';
import {TutorScene} from './tutorScene';



let myGame: Phaser.Game;

export function startGame(){
    
    const config = {
    
        type: Phaser.WEBGL,
        backgroundColor: '#bfc874',
        width: 1200,
        height: 675,
        parent: 'gameContainer',
        dom: {
            createContainer: true
        },
        physics: {
            default: 'arcade',
            arcade: {
                debug: false,
            }
        },
        scale: {
            autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
            mode: Phaser.Scale.FIT
          },
        scene: [ Preloader, TutorScene, SceneC, SceneB, SceneA, SceneD],
        //render :render,
    };
    myGame = new Phaser.Game(config);
}

// isSDKInfo == -1, если sdk ещё не загрузилось, 0 если загрузилось с
// ошибкой, 1 если загрузилось корректно. Для  isGameAtlas -аналогично 
// при загрузке ассетов для игры
const loadings = {
    'isSDKLoaded': -1, 'isGameAtlas': -1,
    'isAdvFinish': -1, 'isPlayerData': -1
}

// устанавливает для загрузки name объекта loadings значение value
// value = -1, если загрузка ещё не закончилась, 0 если загрузка
// прошла с ошибкой или такой объект не существует, 1 если всё
// прошло штатно
export function addLoading(name, value) {
    loadings[name] = value;
    // если ключа с таким именем нет, выходим 
    if (!Object.keys(loadings).includes(name)) return;

    // если загрузка всех необходимых компонентов удачно или нет завершилась,
    // начинаем игру 
    if (!Object.values(loadings).includes(-1)) {
        let locAchievments:Array<number>
        let remoteAchievments:Array<number>

        try {
            // Показываем SDK, что игра загрузилась и можно начинать играть.
            if (globalThis.gYsdk.features.LoadingAPI) {
                globalThis.gYsdk.features.LoadingAPI.ready();
            }
        }
        catch (err) { }

        try{
            //locAchievments = JSON.parse(localStorage.getItem("lvlsData"))
        }
        catch(err){
            locAchievments = [-1,-1,-1,-1,-1]
        }

        

        if(loadings.isPlayerData == 1){
            try{
                let data = globalThis.gData
                globalThis.achievments = data.achievments
            }catch(err){

            }
        }
        
        myGame.scene.start('tutorScene');
        
        // если нулевой уровень (учебка) ещё не проходился, запускаем его
        // if (globalThis.achievments[0] == LvlState.NonAttempted) {
        //     globalThis.currentLevel = lvlNames.Demo;
        //     myGame.scene.start("demo")
        // }else{
        //     globalThis.myUIBlocks.showBaseWnd(achievments,lang)
        // }
    }
}

export function initApp(YaGames) {
    /** данные о достижениях игрока из localStorage  */
    let locAchievments:Array<number>;
    /** данные о достижениях игрока из объекта player из yasdk  */
    //let remotecAchievments:Array<number>;
    // значение по умолчанию
    globalThis.lang = "ru";

    /** содержит данные о том, сколько раз игрок уже играл в игру, какой его рекорд
     *  по количеству уничтоженных гангстеров и сколько гангстеров он обнаружил,
     *  от этого зависит живучесть слонов, она постепенно уменьшается
     */
    globalThis.plrAchievments = {numAttempts:0, numKilledGangs:0,numFindedGangs:0 };

    globalThis.elStrength = 25;
    //currentTexts = ruTexts;
    
    // запускаем игру и загружаем ассеты в сцене Preload
    startGame();

    if (YaGames === null) {
        globalThis.lang = "ru"
        //currentTexts = ruTexts;
        addLoading('isSDKLoaded', 0)
        addLoading('isPlayerData', 0)
        addLoading('isAdvFinish', 0)
        return
    }

    YaGames
        .init()
        .then(ysdk => {
            globalThis.gYsdk = ysdk;
            try {
                globalThis.lang = ysdk.environment.i18n.lang
                if(globalThis.lang == "en"){
                    //currentTexts = enTexts;
                }else{
                    globalThis.lang == "ru"
                    //currentTexts =ruTexts;
                }
            } catch (err) {
                globalThis.lang = "ru"
                //currentTexts =ruTexts;
            }
            addLoading('isSDKLoaded', 1)
            addLoading('isAdvFinish', 0)
            ysdk.getPlayer().then(player => {
                globalThis.gPlayer = player;
                player.getData().then(data => {
                    try {
                        globalThis.gData = data;
                        globalThis.achievments = JSON.parse(data.lvlsData)
                        addLoading('isPlayerData', 1)
                    } catch (err) {
                        globalThis.achievments = [-1,-1,-1,-1,-1,-1]
                        addLoading('isPlayerData', 0)
                    }
                }).catch(err => {
                    globalThis.achievments = [-1,-1,-1,-1,-1,-1]
                    addLoading('isPlayerData', 0)
                })
            }).catch(err => {
                globalThis.achievments = [-1,-1,-1,-1,-1,-1]
                addLoading('isPlayerData', 0)
            });
            
        })
        .catch(err => {
            addLoading('isSDKLoaded', 0)
            addLoading('isPlayerData', 0)
            addLoading('isAdvFinish', 0)
            globalThis.achievments = [-1,-1,-1,-1,-1,-1]
            globalThis.lang = "ru"
            //currentTexts =ruTexts;
        });
}

