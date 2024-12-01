import React from 'react';
import { createRoot } from 'react-dom/client';
import { Panel } from './scene';

const root = createRoot(document.getElementById('root')!);
root.render(<Panel />);
