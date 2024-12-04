import React from 'react';
import { createRoot } from 'react-dom/client';
import { Panel } from './MatchOverlay';
import { MatchInfo } from '../../types/schemas';

nodecg.Replicant<MatchInfo>('matchInfo');

const root = createRoot(document.getElementById('root')!);
root.render(<Panel />);