import * as nodecgApiContext from './nodecg-api-context';
import { Scene } from '../types/schemas';

const nodecg = nodecgApiContext.get();
const currScene = nodecg.Replicant<Scene>('scene');

nodecg.listenFor('switchScene', (scene : number) => {
    currScene.value = scene;
});