import type NodeCG from '@nodecg/types';
import * as nodecgApiContext from './nodecg-api-context';

module.exports = function (nodecg: NodeCG.ServerAPI) {
	nodecgApiContext.set(nodecg);

	require('./replicants');
	require('./breaktext');
	require('./matches');
	require('./players');
	require('./scene');
	require('./teams');
};