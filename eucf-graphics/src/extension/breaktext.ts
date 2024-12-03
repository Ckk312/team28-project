import * as nodecgApiContext from './nodecg-api-context';
import { BreakFlavorText } from '../types/schemas';

const nodecg = nodecgApiContext.get();
const flavortext = nodecg.Replicant<BreakFlavorText>('breakFlavorText');

nodecg.listenFor('updateFlavorText', (text : string) => {
        flavortext.value = text;
});