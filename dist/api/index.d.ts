import { Client, Authorization } from 'mappersmith';
import { RetryMiddlewareOptions } from 'mappersmith/middleware/retry/v2';
export interface SchemaRegistryAPIClientArgs {
    host: string;
    auth?: Authorization;
    clientId?: string;
    retry?: Partial<RetryMiddlewareOptions>;
}
export declare type SchemaRegistryAPIClient = Client<{
    Schema: {
        find: (_: any) => any;
    };
    Subject: {
        all: (_: any) => any;
        latestVersion: (_: any) => any;
        version: (_: any) => any;
        config: (_: any) => any;
        updateConfig: (_: any) => any;
        register: (_: any) => any;
        compatible: (_: any) => any;
    };
}>;
declare const _default: ({ auth, clientId, host, retry, }: SchemaRegistryAPIClientArgs) => Client<{
    Schema: {
        find: (_: any) => any;
    };
    Subject: {
        all: (_: any) => any;
        latestVersion: (_: any) => any;
        version: (_: any) => any;
        config: (_: any) => any;
        updateConfig: (_: any) => any;
        register: (_: any) => any;
        compatible: (_: any) => any;
    };
}>;
export default _default;
