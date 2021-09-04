"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
function createEslintConfig({ rootDir, writeFile, }) {
    const config = {
        extends: [
            'react-app',
            'prettier/@typescript-eslint',
            'plugin:prettier/recommended',
        ],
    };
    if (writeFile) {
        const file = path_1.default.join(rootDir, '.eslintrc.js');
        if (fs_1.default.existsSync(file)) {
            console.error('Error trying to save the Eslint configuration file:', `${file} already exists.`);
        }
        else {
            try {
                fs_1.default.writeFileSync(file, `module.exports = ${JSON.stringify(config, null, 2)}`);
            }
            catch (e) {
                console.error(e);
            }
        }
    }
    return config;
}
exports.createEslintConfig = createEslintConfig;
