import type NodeCG from '@nodecg/types';
import React, { useState } from 'react';
import { MatchInfo, TeamInfo } from '../../types/schemas';
import * as nodecgApiContext from '../../extension/nodecg-api-context';
import { useReplicant } from '@nodecg/react-hooks';

export function Panel() {
	return (
		<>
			<div id="team-info-root">
				<TeamPlayers team="A" />
				<TeamPlayers team="B" />
			</div>
		</>
	);
}

function TeamPlayers(props: any) {
	const [match] = useReplicant<MatchInfo>('matchInfo');
	const [teamPlayerValue, setTeamPlayerValue] = useState<string[]>([]);
	const [inputsRendered, setInputsRendered] = useState<number>(1);
	const [isDisabled, setIsDisabled] = useState<boolean>(false);
	const teamType = (props.team == 'A' || props.team == 'B') ? 0 : 1;
	const team = match?.teams[teamType];
	const playerList = team?.players;

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) : void => {
		e.preventDefault();
		teamPlayerValue.map((name) => {
			nodecg.sendMessage('updatePlayer' + props.team, { username: name });
		})
	}

	const InputCreator = (props: any) => {
		if (props.index < 0 || props.index >= teamPlayerValue.length) {
			return null;
		}

		return (
			<>
				<input
					id={ divId + '-' + props.index }
					type="text"
					placeholder={ 'Player ' + props.index + 1}
					value={ teamPlayerValue[props.index] }
					onChange={ e => { setTeamPlayerValue((oldVal): string[] => {
						const newVal = [...oldVal];
						newVal[props.index] = e.target.value;
						return newVal;
					})}}
				/>
			</>
		);
	}

	const InputRender = (props: any) => {
		const num = props.number < 1 ? 1 : props.number;

		const arr = Array(num).fill('k');
		return (
			<>
				<label className="team-list-label">
					{ arr.map((key, index) => {
						return <InputCreator index={ index }/>;
					}) }
				</label>
			</>
		);
	}

	const divId = 'team-list-' + props.team;
	return (
		<>
			<div id={ divId }>
				<form className="team-list-form" onSubmit={handleSubmit}>
					<InputRender number={ inputsRendered }/>
					<input type="submit" />
				</form>
				<div className="change-player-box" id={ 'change-player-box-side-' + props.team }>
					<button
						className="create-player-button"
						type="button"
						onClick={ e => {
							e.preventDefault();
							setInputsRendered((curVal): number => {
								if (++curVal > 1) {
									setIsDisabled(false);
								}
							return curVal;
						})}}
					>Increment</button>
					<button
						className="delete-player-button"
						type="button"
						disabled={ isDisabled }
						onClick={ e => {
							e.preventDefault();
							setInputsRendered((curVal): number => {
								if (curVal === 1) {
									return 1;
								}
								curVal--;
								if (curVal <= 1) {
									setIsDisabled(true);
								}
								return curVal;
						})}}
					>Decrement</button>
				</div>
			</div>
		</>
	);
}
