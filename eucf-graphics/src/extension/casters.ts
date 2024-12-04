import * as nodecgApiContext from './nodecg-api-context';
import { CasterInfo, CasterList } from '../types/schemas';

const nodecg = nodecgApiContext.get();
const commentatorInfoReplicant = nodecg.Replicant<CasterList>('casterInfo');

nodecg.listenFor('updateCommentators', (commentators: CasterInfo[]) => {
    commentatorInfoReplicant.value!.list = commentators;
    console.log(commentatorInfoReplicant.value);
});

nodecg.listenFor('addCommentator', (commentator: CasterInfo) => {
    commentatorInfoReplicant!.value?.list?.push(commentator);
});