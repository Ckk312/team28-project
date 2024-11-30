import React, { FormEventHandler } from 'react';

export function Panel() {
	return (
		<>
			<div id="root">
				<div id="flavor-text-box">
					<FlavorTextSubmit />
				</div>
			</div>
		</>
	);
}

export function FlavorTextSubmit() {
	const handleSubmit: any = (e: any) => {
		e.preventDefault();
		
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				<label id="flavor-submit-label">Flavor Text:
					<input id="flavor-text-submit" type="text"/>
				</label>
				<input type="submit" />
			</form> 
		</>
	);
}
