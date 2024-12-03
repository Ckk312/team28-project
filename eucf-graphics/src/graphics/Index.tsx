import { useReplicant } from '@nodecg/react-hooks'
import React from 'react';
import { MatchInfo } from '../types/schemas';

export function Index() {
	const [scene] = useReplicant('scene');

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
	const [text] = useReplicant('breakFlavorText');

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
						{ match?.teams[0].players.map((player) => {
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
						{ (match as unknown as MatchInfo | undefined)?.teams[1].players.map((player) => {
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