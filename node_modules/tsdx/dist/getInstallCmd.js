"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const execa_1 = tslib_1.__importDefault(require("execa"));
let cmd;
function getInstallCmd() {
    if (cmd) {
        return cmd;
    }
    try {
        execa_1.default.sync('yarnpkg', ['--version']);
        cmd = 'yarn';
    }
    catch (e) {
        cmd = 'npm';
    }
    return cmd;
}
exports.default = getInstallCmd;
