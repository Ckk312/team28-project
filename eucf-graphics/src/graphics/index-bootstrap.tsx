import React from 'react';
import ReactDOM from 'react-dom/client';
import * as nodecgApiContext from '../extension/nodecg-api-context';

import { Index } from './Index';
<<<<<<< HEAD
import { Scene } from '../types/schemas/scene';

const nodecg = nodecgApiContext.get();
const scene = nodecg.Replicant<Scene>('scene');
=======
>>>>>>> 7252a698cec56172558da4c5208641c6e754c110

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<Index />);