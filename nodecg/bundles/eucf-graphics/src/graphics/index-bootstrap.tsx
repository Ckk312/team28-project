import React from 'react';
import ReactDOM from 'react-dom/client';

import { Index } from './Index';
import { BreakFlavorText } from '../types/schemas';

const breakFlavorText = nodecg.Replicant<BreakFlavorText>('breakFlavorText');

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<Index />);