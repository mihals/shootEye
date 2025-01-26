import * as Phaser from 'phaser';
import {Preloader} from './preloader'
import {SceneA} from './sceneA'
import { SceneB } from './sceneB';
import { SceneC } from './sceneC';
import { SceneD } from './sceneD';
import {TutorScene} from './tutorScene';
import { WinScene } from './winScene';



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
        scene: [ Preloader, TutorScene, SceneC, SceneB, SceneA, SceneD, WinScene],
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
        let locAchievments:Achievments;
        let remoteAchievments:Array<number>

        try {
            // Показываем SDK, что игра загрузилась и можно начинать играть.
            if (globalThis.gYsdk.features.LoadingAPI) {
                globalThis.gYsdk.features.LoadingAPI.ready();
            }


        }
        catch (err) { }

        // пытаемся получить данные из локалсторадж и если что-то пошло не так
        // присваиваем объекту нулевые значения
        try{
            locAchievments = JSON.parse(localStorage.getItem("data"));
            if(!('numKilledGangs' in locAchievments && 
                'numAttempts' in locAchievments)){
                    locAchievments =  {numAttempts:0, numKilledGangs:0};
                }
        }
        catch(err){
            locAchievments = {numAttempts:0, numKilledGangs:0};
        }

        if(loadings.isPlayerData == 1){
            try{
                let data = globalThis.gData;
                globalThis.plrAchievments = data.achievments;
                // сравниваем значения объектов из локалсторадж и из данных игрока
                // на сервере, выбираем бОльшие
                if( ('numKilledGangs' in globalThis.plrAchievments) && 
                    ('numAttempts' in globalThis.plrAchievments) &&
                    locAchievments.numKilledGangs>globalThis.plrAchievments.numKilledGangs){
                        globalThis.plrAchievments.numKilledGangs = locAchievments.numKilledGangs;
                        globalThis.plrAchievments.numAttempts = locAchievments.numAttempts;
                    }
                else{
                    globalThis.plrAchievments = locAchievments;
                }
            }catch(err){

            }
        }

        try{
            // Подписка на события 'game_api_pause'.
            globalThis.gYsdk.on('game_api_pause', () => {
                try{
                    globalThis.currentScene.game.pause();
                }catch(err){};
            }); 
            globalThis.gYsdk.on('game_api_resume', () => {
                try{
                    globalThis.currentScene.game.resume();
                }catch(err){};
            }); 
        }catch(err){};
        
        try{
            globalThis.gYsdk.features.GameplayAPI.start()
        }catch(err){}

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
    globalThis.plrAchievments = {numAttempts:0, numKilledGangs:0};

    globalThis.elStrength = 20;

    globalThis.numKilledGangs =0;
    
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
                    globalThis.lang = "en";
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
                        let locAchievments = JSON.parse(data.achv);
                        console.log(locAchievments);
                        globalThis.plrAchievments = JSON.parse(data.achv);
                        addLoading('isPlayerData', 1)
                    } catch (err) {
                        //globalThis.plrAchievments = {numAttempts:0, numKilledGangs:0};
                        addLoading('isPlayerData', 0)
                    }
                }).catch(err => {
                    //globalThis.plrAchievments = {numAttempts:0, numKilledGangs:0};
                    addLoading('isPlayerData', 0)
                })
            }).catch(err => {
                //globalThis.plrAchievments = {numAttempts:0, numKilledGangs:0};
                addLoading('isPlayerData', 0)
            });
            
        })
        .catch(err => {
            addLoading('isSDKLoaded', 0)
            addLoading('isPlayerData', 0)
            addLoading('isAdvFinish', 0)
            //globalThis.plrAchievments = {numAttempts:0, numKilledGangs:0};
            globalThis.lang = "ru"
            //currentTexts =ruTexts;
        });
}

