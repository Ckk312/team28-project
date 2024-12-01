import type NodeCG from '@nodecg/types';

let context: NodeCG.ServerAPI;

export function get(): NodeCG.ServerAPI {
    return context;
}

export function set(ctx: NodeCG.ServerAPI) {
    context = ctx;
}