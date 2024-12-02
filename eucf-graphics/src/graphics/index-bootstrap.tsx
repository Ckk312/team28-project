import React from 'react';
import ReactDOM from 'react-dom/client';
import * as nodecgApiContext from '../extension/nodecg-api-context';

import { Index } from './Index';
import { Scene } from '../types/schemas/scene';

const nodecg = nodecgApiContext.get();
const scene = nodecg.Replicant<Scene>('scene');

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<Index />);