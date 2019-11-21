/// <reference types="node" />
import { COMPATIBILITY } from './constants';
import { SchemaRegistryAPIClientArgs } from './api';
import Cache from './cache';
import { Schema } from './@types';
interface RegisteredSchema {
    id: number;
}
interface Opts {
    compatibility?: COMPATIBILITY;
    separator?: string;
    subjectName?: string;
}
export default class SchemaRegistry {
    private api;
    cache: Cache;
    constructor({ auth, clientId, host, retry }: SchemaRegistryAPIClientArgs);
    register(schema: Schema, userOpts?: Opts): Promise<RegisteredSchema>;
    getSchema(registryId: number): Promise<Schema>;
    encode(registryId: number, jsonPayload: any): Promise<Buffer>;
    decode(buffer: Buffer): Promise<any>;
    getRegistryId(subject: string, version: number): Promise<number>;
    getLatestSchemaId(subject: string): Promise<number>;
}
export {};
