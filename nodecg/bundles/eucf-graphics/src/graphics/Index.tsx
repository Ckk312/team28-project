import React, { useState } from 'react';
import { BreakFlavorText } from '../types/schemas';

export function Index() {
	const breakFlavorTextReplicant = nodecg.Replicant<BreakFlavorText>('breakFlavorText');
	const [text, setText] = useState(breakFlavorTextReplicant.value);

	breakFlavorTextReplicant.on('change', (newValue, oldValue) => {
		setText(newValue);
	});

	return (
		<>
			<div id="text-box">
				<h1>{ text }</h1>
			</div>
		</>
	);
}
