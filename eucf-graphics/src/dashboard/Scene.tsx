import React from 'react';

export function Panel() {
	return (
		<>
			<div id="scene-root">
				<div id="scene">
					<SceneSelect />
				</div>
			</div>
		</>
	);
}

function SceneSelect() {
	return (
		<>
			<div>
				<button onClick={() => nodecg.sendMessage('switchScene', 0)}>Break</button>
				<button onClick={() => nodecg.sendMessage('switchScene', 1)}>Team Info</button>
				<button onClick={() => nodecg.sendMessage('switchScene', 2)}>Match</button>
			</div>
		</>
	);
}