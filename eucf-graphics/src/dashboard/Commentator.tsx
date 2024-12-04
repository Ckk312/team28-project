import React, { useState } from 'react';
import { CasterInfo } from '../types/schemas';

export function Panel() {
	return (
		<Commentator />
	);
}

function Commentator() {
	const [commentatorNum, setCommentatorNum] = useState<number>(2);
	const [incDisable, setIncDisable] = useState<boolean>(false);
	const [decDisable, setDecDisable] = useState<boolean>(false);
	const [commentatorArr, setCommentatorArr] = useState<CasterInfo[]>([{username: 'Example Caster', pronouns: '/', handle:'@example'},
																		{username: 'Example Caster', pronouns: '/', handle:'@example'}]);

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>, isIncrease: boolean) => {
		e.preventDefault();
		if (isIncrease) {
			setCommentatorNum((c) => {
				let newVal = c;
				if (newVal === 3) {
					return c;
				}
				newVal++;
				if (newVal > 2) {
					setIncDisable(true);
				}
				if (newVal === 1) {
					setDecDisable(false);
				}
				setCommentatorArr((oldVal) => {
					const newValue = [...oldVal];
					newValue.push({username: 'Example Commentator', pronouns: '/', handle: '@example'});
					return newValue;
				})
				return newVal;
			});
		} else {
			setCommentatorNum((c) => {
				let newVal = c;
				if (newVal === 0) {
					return c;
				}
				newVal--;
				if (newVal < 1) {
					setDecDisable(true);
				}
				if (newVal === 2) {
					setIncDisable(false);
				}
				setCommentatorArr((oldVal) => {
					const newValue = [...oldVal];
					newValue.pop();
					return newValue;
				})
				return newVal;
			});
		}
	}
	
	const CommentatorRender = (props: any) => {
		const [name, setName] = useState('Example Commentator');
		const [pronouns, setPronouns] = useState('/');
		const [handle, setHandle] = useState('@example');

		return (
			<>
				<input
					className="commentator-name"
					type="text"
					value={name}
					onChange={ (e) => {
						setName(e.target.value);
						commentatorArr[props.index].username = name;
					}}
				/>
				<input
					className="commentator-pronouns"
					type="text"
					value={pronouns}
					onChange={ (e) => {
						setPronouns(e.target.value);
						commentatorArr[props.index].pronouns = pronouns;
					}}
				/>
				<input
					className="commentator-handle"
					type="text"
					value={handle}
					onChange={ (e) => {
						setHandle(e.target.value);
						commentatorArr[props.index].handle = handle;
					}}
				/>
			</>
		);
	}

	const SetCommentators = (props: any) => {
		const arr = Array(props.size).fill(0);

		return (
			<>
				{ arr.length > 0 &&
					<form name="commentator-submit" onSubmit={(e) => {
						e.preventDefault();
						console.log(commentatorArr);
						nodecg!.sendMessage('updateCommentators', {commentatorArr});
					}}>
						{ arr.map((key, index) => {
							return <CommentatorRender key={index} index={index} />;
						}) }
						<input type="submit" />
					</form>
				}
			</>
		)
	}

	return (
		<>
			<div id="container">
				<button
					id="increase-button"
					disabled={incDisable}
					onClick={(e) => { handleClick(e, true) }}
				>⬆️</button>
				<div id="commentator-amount">
					<h1>{commentatorNum}</h1>
				</div>
				<button
					id="decrease-button"
					disabled={decDisable}
					onClick={(e) => { handleClick(e, false) }}
				>⬇️</button>
			</div>
			<div id="commentator-container">
				<SetCommentators size={commentatorNum} />
			</div>
		</>
	);
}