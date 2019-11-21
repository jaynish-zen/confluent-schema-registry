"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
exports.default = (path) => JSON.parse(fs_1.default.readFileSync(path, 'utf-8'));
//# sourceMappingURL=readAVSC.js.map