window.gLocalAssetContainer["enemy"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnemyManager = void 0;
const effect_1 = require("./effect");
// ============================================================================
//  エネミー基本クラス
// ============================================================================
class Enemy extends g.Sprite {
    constructor(scene, layer, assetId, x, y, hp, speed, score) {
        super({
            scene: scene,
            src: scene.assets[assetId],
            parent: layer,
            local: true,
            width: scene.assets[assetId].width,
            height: scene.assets[assetId].height,
            x: x,
            y: y,
            anchorX: 0.5,
            anchorY: 0.5,
        });
        this.maxHp = hp;
        this.hp = this.maxHp;
        this.speed = speed;
        this.score = score;
        this.isDestroy = false;
        this.seKilled = scene.assets["se"];
        this.seDamaged = scene.assets["se2"];
        this.effect = new effect_1.Explosion(scene, layer);
    }
    get getScore() {
        return this.score;
    }
    get getCollisionArea() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height
        };
    }
    takeDamage(damage) {
        if (this.isDestroy)
            return;
        this.hp -= damage;
        if (this.hp <= 0) {
            this.isDestroy = true;
            this.killed();
            this.destroy();
            g.game.vars.gameState.score += this.score;
        }
        else {
            let se = this.seDamaged.play();
            se.changeVolume(0.12);
        }
    }
    move() { }
    killed() { }
}
// ============================================================================
//  敵駆逐艦その1
// ============================================================================
class EnemyDestroyer1 extends Enemy {
    constructor(scene, layer, x, y) {
        super(scene, layer, "enemy_destroyer", x, y, 1, 4, 100);
    }
    move() {
        if (this.x < -this.width / 2) {
            this.destroy();
        }
        this.x -= this.speed;
        this.modified();
    }
    killed() {
        this.effect.startEffect(this.x, this.y);
        let se = this.seKilled.play();
        se.changeVolume(0.12);
    }
}
// ============================================================================
//  敵駆逐艦その2
// ============================================================================
class EnemyDestroyer2 extends Enemy {
    constructor(scene, layer, x, y) {
        super(scene, layer, "enemy_destroyer", x, y, 1, 3, 200);
    }
    move() {
        if (this.x < -this.width / 2) {
            this.destroy();
        }
        this.x -= this.speed;
        this.modified();
    }
    killed() {
        this.effect.startEffect(this.x, this.y);
        let se = this.seKilled.play();
        se.changeVolume(0.12);
    }
}
// ============================================================================
//  敵駆逐艦その3
// ============================================================================
class EnemyDestroyer3 extends Enemy {
    constructor(scene, layer, x, y) {
        super(scene, layer, "enemy_destroyer", x, y, 1, 2, 300);
    }
    move() {
        if (this.x < -this.width / 2) {
            this.destroy();
        }
        this.x -= this.speed;
        this.modified();
    }
    killed() {
        this.effect.startEffect(this.x, this.y);
        let se = this.seKilled.play();
        se.changeVolume(0.12);
    }
}
// ============================================================================
//  敵駆逐艦(金)
// ============================================================================
class EnemyDestroyerGold extends Enemy {
    constructor(scene, layer, x, y) {
        super(scene, layer, "enemy_destroyer_gold", x, y, 1, 6, 1000);
    }
    move() {
        if (this.x < -this.width / 2) {
            this.destroy();
        }
        this.x -= this.speed;
        this.modified();
    }
    killed() {
        this.effect.startEffect(this.x, this.y);
        let se = this.seKilled.play();
        se.changeVolume(0.12);
    }
}
// ============================================================================ 
//  敵駆逐艦(虹)
// ============================================================================
class EnemyDestroyerRainbow extends Enemy {
    constructor(scene, layer, x, y) {
        super(scene, layer, "enemy_destroyer_rainbow", x, y, 1, 10, 2000);
    }
    move() {
        if (this.x < -this.width / 2) {
            this.destroy();
        }
        this.x -= this.speed;
        this.modified();
    }
    killed() {
        this.effect.startEffect(this.x, this.y);
        let se = this.seKilled.play();
        se.changeVolume(0.12);
    }
}
// ============================================================================
//  島その1
// ============================================================================
class Island1 extends Enemy {
    constructor(scene, layer, x, y) {
        super(scene, layer, "island01", x, y, 1, 4, 0);
    }
    move() {
        if (this.x < -this.width / 2) {
            this.destroy();
        }
        this.x -= this.speed;
        this.modified();
    }
    takeDamage(damage) {
        // 島はダメージを受けない
    }
}
// ============================================================================
//  島その2
// ============================================================================
class Island2 extends Enemy {
    constructor(scene, layer, x, y) {
        super(scene, layer, "island01", x, y, 1, 3, 0);
    }
    move() {
        if (this.x < -this.width / 2) {
            this.destroy();
        }
        this.x -= this.speed;
        this.modified();
    }
    takeDamage(damage) {
        // 島はダメージを受けない
    }
}
// ============================================================================
//  島その3
// ============================================================================
class Island3 extends Enemy {
    constructor(scene, layer, x, y) {
        super(scene, layer, "island01", x, y, 1, 2, 0);
    }
    move() {
        if (this.x < -this.width / 2) {
            this.destroy();
        }
        this.x -= this.speed;
        this.modified();
    }
    takeDamage(damage) {
        // 島はダメージを受けない
    }
}
// ============================================================================
//  敵管理クラス
// ============================================================================
class EnemyManager {
    constructor(scene) {
        this.scene = scene;
        this.enemies = [];
        this.schedule = [];
    }
    set setSpawnLayer(layer) {
        this.spawnLayer = layer;
    }
    get getEnemies() {
        return this.enemies;
    }
    addEnemySchedule(assetId, spawnTime, x, y) {
        this.schedule.push({ assetId, spawnTime, x, y });
    }
    spawnEnemy(enemyName, x, y) {
        let enemy;
        switch (enemyName) {
            case "敵駆逐艦その1":
                enemy = new EnemyDestroyer1(this.scene, this.spawnLayer, x, y);
                break;
            case "敵駆逐艦その2":
                enemy = new EnemyDestroyer2(this.scene, this.spawnLayer, x, y);
                break;
            case "敵駆逐艦その3":
                enemy = new EnemyDestroyer3(this.scene, this.spawnLayer, x, y);
                break;
            case "敵駆逐艦(金)":
                enemy = new EnemyDestroyerGold(this.scene, this.spawnLayer, x, y);
                break;
            case "敵駆逐艦(虹)":
                enemy = new EnemyDestroyerRainbow(this.scene, this.spawnLayer, x, y);
                break;
            case "島その1":
                enemy = new Island1(this.scene, this.spawnLayer, x, y);
                break;
            case "島その2":
                enemy = new Island2(this.scene, this.spawnLayer, x, y);
                break;
            case "島その3":
                enemy = new Island3(this.scene, this.spawnLayer, x, y);
                break;
            default:
                break;
        }
        if (enemy) {
            this.enemies.push(enemy);
        }
    }
    update(remainingTime) {
        for (let i = this.schedule.length - 1; i >= 0; i--) {
            const enemyData = this.schedule[i];
            if (remainingTime <= enemyData.spawnTime) {
                this.spawnEnemy(enemyData.assetId, enemyData.x, enemyData.y);
                this.schedule.splice(i, 1);
            }
        }
        // 全ての敵の移動処理
        this.enemies.forEach((enemy) => enemy.move());
        // 削除した敵をリストからも削除
        this.enemies = this.enemies.filter((enemy) => !enemy.destroyed());
    }
}
exports.EnemyManager = EnemyManager;

})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}