'use strict';

const { newRandomizer, hasSeed } = require('dumbfound');

module.exports = function(name, min, max, runner) {

	if(hasSeed()) {
		// When a seed is present only run once
		describe(name, () => {
			runner(1);
		});
	} else {
		// Create the randomizer
		const randomizer = newRandomizer();
		const runs = randomizer.intBetween(min, max + 1);
		describe(name, () => {
			for(let i=0; i<runs; i++) {
				runner(i+1);
			}
		});
	}

};
