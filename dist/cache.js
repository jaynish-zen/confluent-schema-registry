"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const avsc_1 = __importDefault(require("avsc"));
class Cache {
    constructor() {
        this.getLatestRegistryId = (subject) => this.registryIdBySubject[subject];
        this.setLatestRegistryId = (subject, id) => {
            this.registryIdBySubject[subject] = id;
            return this.registryIdBySubject[subject];
        };
        this.getSchema = (registryId) => this.schemasByRegistryId[registryId];
        this.setSchema = (registryId, schema) => {
            this.schemasByRegistryId[registryId] = avsc_1.default.Type.forSchema(schema);
            return this.schemasByRegistryId[registryId];
        };
        this.clear = () => {
            this.registryIdBySubject = {};
            this.schemasByRegistryId = {};
        };
        this.registryIdBySubject = {};
        this.schemasByRegistryId = {};
    }
}
exports.default = Cache;
//# sourceMappingURL=cache.js.map