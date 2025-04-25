window.gLocalAssetContainer["main"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";
const title_1 = require("./title");
function main(param) {
    g.game.pushScene((0, title_1.createTitleScene)(param));
}
module.exports = main;

})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}