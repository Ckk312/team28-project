import type NodeCG from '@nodecg/types';
import * as nodecgApiContext from './nodecg-api-context';

module.exports = (nodecg: NodeCG.ServerAPI) => {
	nodecgApiContext.set(nodecg);

	require('./replicants');
	require('./breaktext');
	require('./matchinfo');
	require('./players');
	require('./scene');
	require('./teams');
};
