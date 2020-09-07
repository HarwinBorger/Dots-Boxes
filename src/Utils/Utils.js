/**
 * Get line position
 * @param x
 * @param y
 * @param size
 * @returns {{br: {x: number, y: number}, tl: {x: number, y: number}, bl: {x: number, y: number}, tr: {x: number, y: number}}}
 */
export const getLinePositions = (x, y, size) => {
	return {
		// top left
		tl: {
			x: x * size,
			y: y * size
		},
		// top right
		tr: {
			x: (x + 1) * size,
			y: y * size
		},
		// bottom left
		bl: {
			x: (x) * size,
			y: (y + 1) * size
		},
		// bottom right (not needed atm)
		br: {
			x: (x + 1) * size,
			y: (y + 1) * size
		}
	};
};