import { useReplicant } from '@nodecg/react-hooks'
import React from 'react';
import { MatchInfo } from '../types/schemas';

export function Index() {
	const [scene] = useReplicant<number>('scene');

	return(
		<>
			<div id="index-root">
				<ChooseScene scene={scene} />
			</div>
		</>
	);
}

function ChooseScene(props: any) {
	if (props.scene === 0) {
		return <BRB />;
	}
	else if (props.scene === 1) {
		return <MapsTeams />;
	}
}

function BRB() {
	const [text] = useReplicant<string>('breakFlavorText');

	return (
		<>
			<div id="text-box">
				<h1>{ text }</h1>
			</div>
		</>
	);
}

function MapsTeams() {
	let [match] = useReplicant<MatchInfo>('matchInfo');

	return (
		<>
			<div id="team-box-root">
				<div className="team-box" id="team-box-A">
					<div className="title">

					</div>
					<div className="player-list-box">
					<ul className="player-list">
						{ match?.teams[0].players.map((player, index) => {
							return (
								<p className="player-text" key={ index }>{ match?.teams[0].players[index].username }</p>
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
						{ match?.teams[1].players.map((player, index) => {
							return (
								<p className="player-text" key={ index }>{ player.username }</p>
							)
						}) }
						</ul>
					</div>
				</div>
			</div>
		</>
	);
}