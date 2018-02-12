'use strict';

const nextAfter = require('nextafter');

/**
 * The source of randomness, a Lehmer RNG with the Park-Miller parameters.
 *
 * n = 2^31−1 = 2 147 483 647
 * g = 7^5 = 16 807
 */
module.exports = function(seed) {
	if(typeof seed !== 'number') {
		throw new Error('Random source needs to receive a numeric seed');
	}

	seed = seed % 2147483647;
	return {
		/**
		 * Return a positive int32 value.
		 */
		int32() {
			// Calculate X_k+1 from X_k
			seed = (seed * 16807) % 2147483647;
			return seed;
		},

		/**
		 * Return an integer in the range [min, max].
		 */
		intBetween(min, max) {
			max += 1;
			return Math.floor(min + this.number() * (max - min));
		},

		/**
		 * Return a number in the range [0,1).
		 */
		number() {
			const v = this.int32();
			return (v - 1) / 2147483646;
		},

		/**
		 * Generate a number between in the range [min, max].
		 */
		numberBetween(min, max) {
			// Adjust max up to the next number
			max = nextAfter(max, Number.POSITIVE_INFINITY);
			return min + (this.number() * (max - min));
		},

		_nextGaussian: NaN,

		/**
		 * Gaussian (normal) distribution with mean 0.0 and standard
		 * deviation 1.0. Generated via a Box-Muller transform.
		 */
		gaussian() {
			if(Number.isNaN(this._nextGaussian)) {
				let w;
				let x1;
				let x2;
				do {
					x1 = 2.0 * this.number() - 1.0;
					x2 = 2.0 * this.number() - 1.0;
					w = x1 * x1 + x2 * x2;
				} while(w >= 1.0);

				w = Math.sqrt((-2.0 * Math.log(w)) / w);

				const result = x1 * w;
				this._nextGaussian = x2 * w;
				return result;
			} else {
				const result = this._nextGaussian;
				this._nextGaussian = Number.NaN;
				return result;
			}
		}
	};
};
