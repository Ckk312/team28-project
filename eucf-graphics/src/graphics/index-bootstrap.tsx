import React from 'react';
import ReactDOM from 'react-dom/client';

import { Index } from './Index';
import { Scene } from '../types/schemas/scene';

const scene = nodecg.Replicant<Scene>('scene');

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<Index scene={scene}/>);