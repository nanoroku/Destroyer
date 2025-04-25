window.gLocalAssetContainer["destroyer"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Destroyer = void 0;
exports.gameAgeMs = gameAgeMs;
// ============================================================================
//  駆逐艦
// ============================================================================
class Destroyer extends g.E {
    constructor(scene, spawnLayer, radarLayer, x, y) {
        super({
            scene: scene,
            parent: spawnLayer,
            width: scene.assets["mutsuki_base"].width,
            height: scene.assets["mutsuki_base"].height,
            x: x,
            y: y,
            anchorX: 0.5,
            anchorY: 0.5,
        });
        this.lastShotTime = 0; // 最後に魚雷を発射した時間
        this.SHOOT_COOLDOWN_MS = 3000; // 魚雷発射のクールタイム(ミリ秒)
        this.MS_PER_FRAME = 1000 / g.game.fps; // 1フレームあたりのミリ秒
        this.isStopped = false;
        this.torpedoTubePos = [
            { x: 67, y: 11 }, // フロント
            { x: -44, y: 11 }, // リア
        ];
        this.torpedoFrontIdx = 0;
        this.torpedoRearIdx = 1;
        this.torpedoTubeAnchor = {
            anchorX: 0.43, anchorY: 0.5
        };
        this.torpedoTubeBaseAngle = -90;
        this.spriteRangeFront = new g.Sprite({
            scene: scene,
            parent: radarLayer,
            src: scene.assets["range"],
            width: scene.assets["range"].width,
            height: scene.assets["range"].height,
            x: this.torpedoTubePos[this.torpedoFrontIdx].x + x,
            y: this.torpedoTubePos[this.torpedoFrontIdx].y + y,
            anchorX: 0.5,
            anchorY: 1.0,
        });
        this.spriteRangeRear = new g.Sprite({
            scene: scene,
            parent: radarLayer,
            src: scene.assets["range"],
            width: scene.assets["range"].width,
            height: scene.assets["range"].height,
            x: this.torpedoTubePos[this.torpedoRearIdx].x + x,
            y: this.torpedoTubePos[this.torpedoRearIdx].y + y,
            anchorX: 0.5,
            anchorY: 1.0,
        });
        this.spriteLineFront = new g.Sprite({
            scene: scene,
            parent: radarLayer,
            src: scene.assets["line"],
            width: scene.assets["line"].width,
            height: scene.assets["line"].height,
            x: this.torpedoTubePos[this.torpedoFrontIdx].x + x,
            y: this.torpedoTubePos[this.torpedoFrontIdx].y + y,
            anchorX: 0.5,
            anchorY: 1.0,
            angle: 0
        });
        this.spriteLineRear = new g.Sprite({
            scene: scene,
            parent: radarLayer,
            src: scene.assets["line"],
            width: scene.assets["line"].width,
            height: scene.assets["line"].height,
            x: this.torpedoTubePos[this.torpedoRearIdx].x + x,
            y: this.torpedoTubePos[this.torpedoRearIdx].y + y,
            anchorX: 0.5,
            anchorY: 1.0,
            angle: 0
        });
        this.spriteBase = new g.Sprite({
            scene: scene,
            parent: this,
            src: scene.assets["mutsuki_base"],
            width: scene.assets["mutsuki_base"].width,
            height: scene.assets["mutsuki_base"].height
        });
        this.spriteTorpedoTubeFront = new g.Sprite({
            scene: scene,
            parent: this,
            src: scene.assets["mutsuki_torpedo_tube"],
            width: scene.assets["mutsuki_torpedo_tube"].width,
            height: scene.assets["mutsuki_torpedo_tube"].height,
            x: this.torpedoTubePos[this.torpedoFrontIdx].x + this.spriteBase.width / 2,
            y: this.torpedoTubePos[this.torpedoFrontIdx].y,
            anchorX: this.torpedoTubeAnchor.anchorX,
            anchorY: this.torpedoTubeAnchor.anchorY,
            angle: this.torpedoTubeBaseAngle
        });
        this.spriteTorpedoTubeRear = new g.Sprite({
            scene: scene,
            parent: this,
            src: scene.assets["mutsuki_torpedo_tube"],
            width: scene.assets["mutsuki_torpedo_tube"].width,
            height: scene.assets["mutsuki_torpedo_tube"].height,
            x: this.torpedoTubePos[this.torpedoRearIdx].x + this.spriteBase.width / 2,
            y: this.torpedoTubePos[this.torpedoRearIdx].y,
            anchorX: this.torpedoTubeAnchor.anchorX,
            anchorY: this.torpedoTubeAnchor.anchorY,
            angle: this.torpedoTubeBaseAngle
        });
        this.spriteBuilding = new g.Sprite({
            scene: scene,
            parent: this,
            src: scene.assets["mutsuki_building"],
            width: scene.assets["mutsuki_building"].width,
            height: scene.assets["mutsuki_building"].height
        });
    }
    set setTorpedoManager(torpedoManager) {
        this.torpedoManager = torpedoManager;
    }
    set setAngle(angle) {
        this.spriteTorpedoTubeFront.angle = angle + this.torpedoTubeBaseAngle;
        this.spriteTorpedoTubeRear.angle = angle + this.torpedoTubeBaseAngle;
        this.spriteLineFront.angle = angle;
        this.spriteLineRear.angle = angle;
    }
    renderTorpedoTube() {
        this.spriteTorpedoTubeFront.modified();
        this.spriteTorpedoTubeRear.modified();
        this.spriteLineFront.modified();
        this.spriteLineRear.modified();
    }
    get getTorpedoTubeFrontPosX() {
        return this.torpedoTubePos[this.torpedoFrontIdx].x;
    }
    get getTorpedoTubeRearPosX() {
        return this.torpedoTubePos[this.torpedoRearIdx].x;
    }
    get getLastShotTime() {
        return this.lastShotTime;
    }
    get getIsStopped() {
        return this.isStopped;
    }
    stop() {
        this.isStopped = true;
    }
    shootTorpedo(angle) {
        const now = gameAgeMs();
        if (now - this.lastShotTime < this.SHOOT_COOLDOWN_MS)
            return;
        this.lastShotTime = now;
        this.torpedoManager.spawnTorpedo(this.x + this.getTorpedoTubeFrontPosX, this.y + this.height / 2, angle);
        this.torpedoManager.spawnTorpedo(this.x + this.getTorpedoTubeRearPosX, this.y + this.height / 2, angle);
    }
}
exports.Destroyer = Destroyer;
function gameAgeMs() {
    return g.game.age * (1000 / g.game.fps);
}

})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}