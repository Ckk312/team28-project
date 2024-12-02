import type NodeCG from '@nodecg/types';
import React, { useState } from 'react';

import * as nodecgApiContext from '../extension/nodecg-api-context';
import { BreakFlavorText, MatchInfo, TeamInfo, Scene } from '../types/schemas';

export function Index() {
	const nodecg = nodecgApiContext.get();
	const sceneReplicant = nodecg.Replicant<Scene>('scene');
	const [scene, setScene] = useState(sceneReplicant.value);

	sceneReplicant.on('change', (newValue) => {
		setScene(newValue);
	});

	return(
		<>
			<div id="index-root">
				<BRB />
				<MapsTeams />
				<div id="third-option">
					{ scene == 0 && <BRB />}
					{ scene == 1 && <MapsTeams />}
				</div>
			</div>
		</>
	)
}

function BRB() {
	const nodecg = nodecgApiContext.get();
	const breakFlavorTextReplicant = nodecg.Replicant<BreakFlavorText>('breakFlavorText');
	const [text, setText] = useState(breakFlavorTextReplicant.value!);

	breakFlavorTextReplicant.on('change', (newValue) => {
		setText(newValue!);
	});

	return (
		<>
			<div id="text-box">
				<h1>{ text }</h1>
			</div>
		</>
	);
}

function MapsTeams() {
	const nodecg = nodecgApiContext.get();
	const matchInfoReplicant = nodecg.Replicant<MatchInfo>('matchInfo') as unknown as NodeCG.ServerReplicantWithSchemaDefault<MatchInfo>; 
	const [teams, setTeams] = useState(matchInfoReplicant.value.teams);

	let change: boolean = false;
	matchInfoReplicant.on('change', (newValue: MatchInfo | undefined, oldValue: MatchInfo | undefined) => {
		for (let j = 0; j < 2; j++) {
			let teamLength = newValue?.teams[j].players.length!;
			if (teamLength === oldValue?.teams[j].players.length) {
				for (let i = 0; i < teamLength; i++) {
					if (newValue?.teams[j].players[i].username !== oldValue?.teams[j].players[i].username) {
						change = true;
						break;
					}
				}
			} else {
				change = true;
				break;
			}
			if (change) {
				break;
			}
		}

		if (change) {
			const newTeams: [TeamInfo, TeamInfo] = [newValue?.teams[0]!, newValue?.teams[1]!];
			setTeams(newTeams);
		}
	});

	return (
		<>
			<div id="team-box-root">
				<div className="team-box" id="team-box-A">
					<div className="title">

					</div>
					<div className="player-list-box">
					<ul className="player-list">
						{ teams[0].players.map((player) => {
							return (
								<>
									<p className="player-text">{ player.username }</p>
								</>
							)
						}) }
						</ul>
					</div>
				</div>
				<div id="vs">
					<p>vs</p>
				</div>
				<div className="team-box" id="team-box-B">
					<div className="title">

					</div>
					<div className="player-list-box">
						<ul className="player-list">
						{ teams[1].players.map((player) => {
							return (
								<>
									<p className="player-text">{ player.username }</p>
								</>
							)
						}) }
						</ul>
					</div>
				</div>
			</div>
		</>
	);
}