window.gLocalAssetContainer["torpedo"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TorpedoManager = void 0;
const effect_1 = require("./effect");
// ============================================================================
//  魚雷
// ============================================================================
class Torpedo extends g.Sprite {
    constructor(scene, layer, x, y, angle) {
        super({
            scene: scene,
            parent: layer,
            src: scene.assets["torpedo_bullet"],
            width: scene.assets["torpedo_bullet"].width,
            height: scene.assets["torpedo_bullet"].height,
            x: x,
            y: y,
            anchorX: 0.5,
            anchorY: 0.5,
            angle: angle
        });
        this.speed = 5;
        this.effect = new effect_1.WaterColumn(scene, layer);
        this.se = scene.assets["se"];
    }
    get getCollisionArea() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height
        };
    }
    move() {
        const rad = this.angle * Math.PI / 180;
        this.x += Math.cos(rad) * this.speed;
        this.y += Math.sin(rad) * this.speed;
        if (this.x < 0 || this.x > g.game.width || this.y < 0 || this.y > g.game.height) {
            this.destroy();
        }
        this.modified();
    }
    explode() {
        this.effect.startEffect(this.x, this.y);
        let se = this.se.play();
        se.changeVolume(0.12);
    }
}
// ============================================================================
//  魚雷管理クラス
// ============================================================================
class TorpedoManager {
    constructor(scene, layer) {
        this.scene = scene;
        this.layer = layer;
        this.torpedos = [];
    }
    set setEnemyManager(enemyManager) {
        this.enemyManager = enemyManager;
    }
    spawnTorpedo(x, y, angle) {
        const torpedo = new Torpedo(this.scene, this.layer, x, y, angle - 90);
        this.torpedos.push(torpedo);
    }
    update() {
        this.torpedos.forEach((torpedo, index) => {
            torpedo.move();
            this.enemyManager.getEnemies.forEach((enemy) => {
                if (g.Collision.intersectAreas(torpedo.getCollisionArea, enemy.getCollisionArea)) {
                    enemy.takeDamage(1);
                    torpedo.explode();
                    torpedo.destroy();
                    this.torpedos.splice(index, 1);
                }
            });
        });
        // 削除した魚雷をリストからも削除
        this.torpedos = this.torpedos.filter((torpedo) => !torpedo.destroyed());
    }
}
exports.TorpedoManager = TorpedoManager;

})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}