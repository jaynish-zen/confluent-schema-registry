"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const encoder_1 = require("./encoder");
const decoder_1 = __importDefault(require("./decoder"));
const constants_1 = require("./constants");
const api_1 = __importDefault(require("./api"));
const cache_1 = __importDefault(require("./cache"));
const errors_1 = require("./errors");
const DEFAULT_OPTS = {
    compatibility: constants_1.COMPATIBILITY.BACKWARD,
    separator: constants_1.DEFAULT_SEPERATOR,
    subjectName: null
};
class SchemaRegistry {
    constructor({ auth, clientId, host, retry }) {
        this.api = api_1.default({ auth, clientId, host, retry });
        this.cache = new cache_1.default();
    }
    async register(schema, userOpts) {
        const { compatibility, separator, subjectName } = { ...DEFAULT_OPTS, ...userOpts };
        if (!schema.name) {
            throw new errors_1.ConfluentSchemaRegistryArgumentError(`Invalid name: ${schema.name}`);
        }
        if (!schema.namespace) {
            throw new errors_1.ConfluentSchemaRegistryArgumentError(`Invalid namespace: ${schema.namespace}`);
        }
        const subject = subjectName || [schema.namespace, schema.name].join(separator);
        try {
            const response = await this.api.Subject.config({ subject });
            const { compatibilityLevel } = response.data();
            if (compatibilityLevel.toUpperCase() !== compatibility) {
                throw new errors_1.ConfluentSchemaRegistryCompatibilityError(`Compatibility does not match the configuration (${compatibility} != ${compatibilityLevel.toUpperCase()})`);
            }
        }
        catch (error) {
            if (error.status !== 404) {
                throw error;
            }
            if (compatibility) {
                await this.api.Subject.updateConfig({ subject, body: { compatibility } });
            }
        }
        const response = await this.api.Subject.register({
            subject,
            body: { schema: JSON.stringify(schema) },
        });
        const registeredSchema = response.data();
        this.cache.setLatestRegistryId(subject, registeredSchema.id);
        this.cache.setSchema(registeredSchema.id, schema);
        return registeredSchema;
    }
    async getSchema(registryId) {
        const schema = this.cache.getSchema(registryId);
        if (schema) {
            return schema;
        }
        const response = await this.api.Schema.find({ id: registryId });
        const foundSchema = response.data();
        const rawSchema = JSON.parse(foundSchema.schema);
        return this.cache.setSchema(registryId, rawSchema);
    }
    async encode(registryId, jsonPayload) {
        if (!registryId) {
            throw new errors_1.ConfluentSchemaRegistryArgumentError(`Invalid registryId: ${JSON.stringify(registryId)}`);
        }
        const schema = await this.getSchema(registryId);
        return encoder_1.encode(schema, registryId, jsonPayload);
    }
    async decode(buffer) {
        if (!Buffer.isBuffer(buffer)) {
            throw new errors_1.ConfluentSchemaRegistryArgumentError('Invalid buffer');
        }
        const { magicByte, registryId, payload } = decoder_1.default(buffer);
        if (Buffer.compare(encoder_1.MAGIC_BYTE, magicByte) !== 0) {
            throw new errors_1.ConfluentSchemaRegistryArgumentError(`Message encoded with magic byte ${JSON.stringify(magicByte)}, expected ${JSON.stringify(encoder_1.MAGIC_BYTE)}`);
        }
        const schema = await this.getSchema(registryId);
        return schema.fromBuffer(payload);
    }
    async getRegistryId(subject, version) {
        const response = await this.api.Subject.version({ subject, version });
        const { id } = response.data();
        return id;
    }
    async getLatestSchemaId(subject) {
        const response = await this.api.Subject.latestVersion({ subject });
        const { id } = response.data();
        return id;
    }
}
exports.default = SchemaRegistry;
//# sourceMappingURL=SchemaRegistry.js.map