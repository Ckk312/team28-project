import React, { useState } from 'react';
import * as nodecgApiContext from '../../extension/nodecg-api-context';

const nodecg = nodecgApiContext.get();

export function Panel() {
	return (
		<>
			<div id="flavor-root">
				<div id="flavor-text-box">
					<FlavorTextSubmit />
				</div>
			</div>
		</>
	);
}

function FlavorTextSubmit() {
	const [term, setTerm] = useState('');

	function handleSubmit (e: React.FormEvent<HTMLFormElement>) : void{
		e.preventDefault();
		nodecg.sendMessage('updateFlavorText', term);
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				<label id="flavor-submit-label">Flavor Text:
					<input 
						id="flavor-text-submit"
						type="text"
						value={ term }
						onChange={ (e) => setTerm(e.target.value) }
					/>
				</label>
				<input type="submit" />
			</form>
		</>
	);
}