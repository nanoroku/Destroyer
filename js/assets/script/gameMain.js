window.gLocalAssetContainer["gameMain"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGameMainScene = createGameMainScene;
const destroyer_1 = require("./destroyer");
const torpedo_1 = require("./torpedo");
const enemy_1 = require("./enemy");
function createGameMainScene(param) {
    // ========================================================================
    //  変数宣言
    // ========================================================================
    // レイヤー
    let backgroundLayer = null;
    let enemyLayer = null;
    let darkLayer = null;
    let radarLayer = null;
    let torpedoLayer = null;
    let mutsukiLayer = null;
    let uiLayer = null;
    const scrollSpeed = 2;
    const destroyerPos = { x: g.game.width / 2, y: 650 };
    const sensitivity = 0.25;
    const maxAngle = 45.0;
    let currentAngle = 0.0;
    // UI関係
    let scoreLabel = null;
    let timerLabel = null;
    let torpedoCoolTimeLabel = null;
    let torpedoCoolTimeBar = null;
    let torpedoCoolTimeBarBackground = null;
    const torpedoCoolTimeBarWidth = 250;
    const torpedoCoolTimeBarHeight = 25;
    // タイム関係
    let time = 95;
    let remainingTime = time - 5;
    // ========================================================================
    //  シーンの生成
    // ========================================================================
    const scene = new g.Scene({
        game: g.game,
        assetIds: [
            "background_night", // 夜背景
            "dark", // 闇
            "mutsuki_base", // 睦月の船体
            "mutsuki_building", // 睦月の建造物
            "mutsuki_torpedo_tube", // 睦月の魚雷発射管
            "range", // 魚雷角度範囲
            "line", // 魚雷角度線
            "torpedo_bullet", // 魚雷
            "enemy_destroyer", // 敵駆逐艦
            "island01", // 島1
            "enemy_destroyer_gold", // 敵駆逐艦(金)
            "enemy_destroyer_rainbow", // 敵駆逐艦(虹)
            "explosion", // 爆発
            "waterColumn", // 水柱
            "Towards_the_light", // BGM
            "se", // 衝突音
            "se2", // ダメージ音
        ]
    });
    scene.onLoad.add(() => {
        // 市場コンテンツのランキングモードでは、g.game.vars.gameState.scoreの値をスコアとして扱います
        g.game.vars.gameState = { score: 0 };
        // BGMの再生
        let stageBgm = scene.assets["Towards_the_light"];
        let bgmPlayer = stageBgm.play();
        bgmPlayer.changeVolume(0.12);
        // ====================================================================
        //  レイヤーの生成
        // ====================================================================
        backgroundLayer = new g.E({
            scene: scene,
            parent: scene,
        });
        enemyLayer = new g.E({
            scene: scene,
            parent: scene,
        });
        darkLayer = new g.E({
            scene: scene,
            parent: scene,
        });
        radarLayer = new g.E({
            scene: scene,
            parent: scene,
        });
        torpedoLayer = new g.E({
            scene: scene,
            parent: scene,
        });
        mutsukiLayer = new g.E({
            scene: scene,
            parent: scene,
        });
        uiLayer = new g.E({
            scene: scene,
            parent: scene,
        });
        // ====================================================================
        //  背景の生成
        // ====================================================================
        const bg1 = new g.Sprite({
            scene: scene,
            parent: backgroundLayer,
            src: scene.assets["background_night"],
            x: 0,
            y: 0,
        });
        const bg2 = new g.Sprite({
            scene: scene,
            parent: backgroundLayer,
            src: scene.assets["background_night"],
            x: bg1.width,
            y: 0,
        });
        const dark = new g.Sprite({
            scene: scene,
            parent: darkLayer,
            src: scene.assets["dark"],
            x: 0,
            y: 0,
        });
        // ====================================================================
        //  UIの生成
        // ====================================================================
        // フォントの生成
        var strokeFont = new g.DynamicFont({
            game: g.game,
            fontFamily: "sans-serif",
            fontColor: "black",
            strokeColor: "white",
            strokeWidth: 4,
            size: 36
        });
        // スコア表示用のラベル
        var scoreLabel = new g.Label({
            scene: scene,
            parent: uiLayer,
            text: "SCORE: 0",
            font: strokeFont,
            fontSize: strokeFont.size,
            x: 0.00 * g.game.width
        });
        // 残り時間表示用ラベル
        var timeLabel = new g.Label({
            scene: scene,
            parent: uiLayer,
            text: "TIME: " + remainingTime,
            font: strokeFont,
            fontSize: strokeFont.size,
            x: 0.65 * g.game.width
        });
        var torpedoCoolTimeLabel = new g.Label({
            scene: scene,
            parent: uiLayer,
            text: "COOL GAUGE:",
            font: strokeFont,
            fontSize: strokeFont.size,
            x: 0.40 * g.game.width,
            y: 0.95 * g.game.height,
            anchorX: 1.0,
            anchorY: 0.5,
        });
        var torpedoCoolTimeBarBackground = new g.FilledRect({
            scene: scene,
            parent: uiLayer,
            width: torpedoCoolTimeBarWidth,
            height: torpedoCoolTimeBarHeight,
            cssColor: "#000090",
            x: 0.50 * g.game.width - torpedoCoolTimeBarWidth / 2,
            y: 0.95 * g.game.height,
            anchorX: 0.0,
            anchorY: 0.5,
        });
        var torpedoCoolTimeBar = new g.FilledRect({
            scene: scene,
            parent: uiLayer,
            width: torpedoCoolTimeBarWidth,
            height: torpedoCoolTimeBarHeight,
            cssColor: "#00ff00",
            x: 0.50 * g.game.width - torpedoCoolTimeBarWidth / 2,
            y: 0.95 * g.game.height,
            anchorX: 0.0,
            anchorY: 0.5,
        });
        // ====================================================================
        //  プレイヤーの生成
        // ====================================================================
        const destroyer = new destroyer_1.Destroyer(scene, mutsukiLayer, radarLayer, destroyerPos.x, destroyerPos.y);
        // ====================================================================
        //  魚雷管理クラスの生成
        // ====================================================================
        const torpedoManager = new torpedo_1.TorpedoManager(scene, torpedoLayer);
        // ====================================================================
        //  敵管理クラスの生成
        // ====================================================================
        const enemyManager = new enemy_1.EnemyManager(scene);
        enemyManager.setSpawnLayer = enemyLayer;
        // ====================================================================
        //  各種管理クラスの設定
        // ====================================================================
        // プレイヤーの設定
        destroyer.setTorpedoManager = torpedoManager;
        // 魚雷管理クラスの設定
        torpedoManager.setEnemyManager = enemyManager;
        // ====================================================================
        //  敵の生成タイムスケジュール
        // ====================================================================
        const startTime = remainingTime;
        // Wave 1
        enemyManager.addEnemySchedule("敵駆逐艦その2", startTime - 5, 1400, 200);
        enemyManager.addEnemySchedule("敵駆逐艦その2", startTime - 5, 2000, 200);
        // Wave 2
        enemyManager.addEnemySchedule("敵駆逐艦その1", startTime - 10, 1400, 300);
        enemyManager.addEnemySchedule("敵駆逐艦その1", startTime - 10, 2000, 300);
        // Wave 3
        enemyManager.addEnemySchedule("敵駆逐艦その2", startTime - 15, 1400, 200);
        enemyManager.addEnemySchedule("島その1", startTime - 15, 1700, 300);
        enemyManager.addEnemySchedule("敵駆逐艦その2", startTime - 15, 2000, 200);
        // Wave 4
        for (let i = 0; i < 10; i++) {
            const r = g.game.random.generate() * 100;
            console.log("r:", r);
            if (r < 10) {
                console.log("敵駆逐艦(金)");
                enemyManager.addEnemySchedule("敵駆逐艦(金)", startTime - 30 - i * 3, 1400, 100);
            }
            else if (r < 40) {
                enemyManager.addEnemySchedule("島その1", startTime - 30 - i * 3, 1400, 300);
            }
            else if (r < 70) {
                enemyManager.addEnemySchedule("敵駆逐艦その1", startTime - 30 - i * 3, 1400, 300);
            }
            else {
                enemyManager.addEnemySchedule("敵駆逐艦その2", startTime - 30 - i * 3, 1400, 200);
            }
        }
        // Wave 5
        for (let i = 0; i < 8; i++) {
            const r = g.game.random.generate() * 100;
            console.log("r:", r);
            if (r < 5) {
                console.log("敵駆逐艦(虹)");
                enemyManager.addEnemySchedule("敵駆逐艦(虹)", startTime - 60 - i * 3, 1400, 100);
            }
            else if (r < 20) {
                console.log("敵駆逐艦(金)");
                enemyManager.addEnemySchedule("敵駆逐艦(金)", startTime - 60 - i * 3, 1400, 100);
            }
            else if (r < 50) {
                enemyManager.addEnemySchedule("島その1", startTime - 60 - i * 3, 1400, 300);
            }
            else if (r < 75) {
                enemyManager.addEnemySchedule("敵駆逐艦その1", startTime - 60 - i * 3, 1400, 300);
            }
            else {
                enemyManager.addEnemySchedule("敵駆逐艦その2", startTime - 60 - i * 3, 1400, 200);
            }
        }
        // ====================================================================
        //  タイマーカウント処理
        // ====================================================================
        const timer = scene.setInterval(() => {
            remainingTime--;
            if (remainingTime === 0) {
                scene.clearInterval(timer); // タイマーの停止
                // TODO: 終了処理
                destroyer.stop();
                bgmPlayer.stop();
            }
        }, 1000);
        // ====================================================================
        //  フレーム毎の更新処理
        // ====================================================================
        scene.onUpdate.add(() => {
            scoreLabel.text = "SCORE: " + g.game.vars.gameState.score;
            scoreLabel.invalidate();
            timeLabel.text = "TIME: " + remainingTime;
            timeLabel.invalidate();
            if (remainingTime <= 0)
                return;
            bg1.x -= scrollSpeed;
            bg2.x -= scrollSpeed;
            // 背景1が完全に画面外に出たら、右端に移動
            if (bg1.x <= -bg1.width) {
                bg1.x = bg2.x + bg1.width;
            }
            // 背景2が完全に画面外に出たら、右端に移動
            if (bg2.x <= -bg1.width) {
                bg2.x = bg1.x + bg1.width;
            }
            bg1.modified();
            bg2.modified();
            destroyer.renderTorpedoTube();
            torpedoManager === null || torpedoManager === void 0 ? void 0 : torpedoManager.update();
            enemyManager.update(remainingTime);
            const now = (0, destroyer_1.gameAgeMs)();
            const elapsed = now - destroyer.getLastShotTime;
            const t = Math.min(Math.max(elapsed / destroyer.SHOOT_COOLDOWN_MS, 0), 1);
            torpedoCoolTimeBar.width = torpedoCoolTimeBarWidth * t;
            torpedoCoolTimeBar.modified();
        });
        // ====================================================================
        //  マウスドラッグ操作
        // ====================================================================
        scene.onPointMoveCapture.add((e) => {
            if (remainingTime <= 0)
                return;
            const dx = e.prevDelta.x;
            let angle = currentAngle + dx * sensitivity;
            angle = Math.max(-maxAngle, Math.min(maxAngle, angle));
            destroyer.setAngle = angle;
            currentAngle = angle;
        });
        // ====================================================================
        //  マウスボタンを離した時
        // ====================================================================
        scene.onPointUpCapture.add((e) => {
            if (remainingTime <= 0)
                return;
            destroyer.shootTorpedo(currentAngle);
        });
    });
    return scene;
}

})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}