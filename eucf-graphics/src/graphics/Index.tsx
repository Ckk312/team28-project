import { useReplicant } from '@nodecg/react-hooks'
import React from 'react';
import { CasterInfo, CasterList, MatchInfo } from '../types/schemas';

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
	else if (props.scene === 2) {
		return <MatchOverlay />;
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
	const test: CasterInfo = { username: "Example Commentator", pronouns: "/", handle: '@example' };
	const [commentators] = useReplicant<CasterList>('casterInfo', { defaultValue: {list: [{ test }] }} );

	return (
		<>
			<div id="team-box-root">
				<div className="team-box" id="team-box-A">
					<div className="title">

					</div>
					<div className="player-list-box">
						<h1>{ match?.teams[0].teamName }</h1>
						<ul className="player-list">
							{ match?.teams[0].players.map((player, index) => {
								return (
									<div className={'player-text-box'} key={ index }>
										<p className="player-text">{ player.username }</p>
									</div>
								)
							}) }
						</ul>
					</div>
				</div>
				<div id="vs">
					<h1 id="vs-text">vs</h1>
				</div>
				<div className="team-box" id="team-box-B">
					<div className="title">

					</div>
					<div className="player-list-box">
						<h1>{ match?.teams[1].teamName }</h1>
						<ul className="player-list">
							{ match?.teams[1].players.map((player, index) => {
								return (
									<div className={'player-text-box'} key={ index }>
										<p className="player-text">{ player.username }</p>
									</div>
								)
							}) }
						</ul>
					</div>
				</div>
			</div>
			<div id="commentator-container">
				{ (commentators !== undefined && commentators.list.length > 0) &&
				
				commentators.list.map((commentator) => {
					return (
						<>
							<div className="commentator-username">
								<h3>{(commentator as CasterInfo).username}</h3>
							</div>
							<div className="commentator-pronouns">
								<p>{(commentator as CasterInfo).pronouns}</p>
							</div>
							<div className="commentator-handle">
								<p>{(commentator as CasterInfo).handle}</p>
							</div>
						</>
					)
				}) }
			</div>
		</>
	);
}

function MatchOverlay() {
	let [match] = useReplicant<MatchInfo>('matchInfo');
	let temp = JSON.stringify(match?.score);
	let score = JSON.parse(temp);

	return (
		<>
			<div id="team-box-root">
				<div className="team-box" id="team-box-A">
					<div className="title">

					</div>
					<div className="team-score-box">
						<h1>{ match?.teams[0].teamName }</h1>
						<ul className="team-score-text">
							<div>
								<p className="score-text">{ score.teamAScore }</p>
							</div>
						</ul>
					</div>
				</div>
				<div id="vs">
					<h1 id="vs-text">vs</h1>
				</div>
				<div className="team-box" id="team-box-B">
					<div className="title">

					</div>
					<div className="team-score-box">
						<h1>{ match?.teams[1].teamName }</h1>
						<ul className="team-score-text">
							<div>
								<p className="score-text">{ score.teamBScore }</p>
							</div>
						</ul>
					</div>
				</div>
			</div>
		</>
	);
}