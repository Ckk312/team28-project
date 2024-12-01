import React from 'react';
import { Scene } from '../../types/schemas/scene';

const SceneReplicant = nodecg.Replicant<Scene>('scene');

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
	const handleClick = (scene : number) => {
		SceneReplicant.value = scene;
	};
	
	return (
		<>
			<div>
				<button onClick={() => handleClick(1)}>Break</button>
				<button onClick={() => handleClick(2)}>Team Info</button>
				<button onClick={() => handleClick(3)}>Match</button>
			</div>
		</>
	);
}
