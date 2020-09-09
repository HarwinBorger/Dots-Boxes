import _ from "lodash";

export default class Utils {
	/**
	 * Get line position
	 * @param x
	 * @param y
	 * @param size
	 * @returns {{br: {x: number, y: number}, tl: {x: number, y: number}, bl: {x: number, y: number}, tr: {x: number, y: number}}}
	 */
	static getLinePositions = (x, y, size) => {
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

	/**
	 * getOptions
	 * @description function to retrieve connected dots to lines based on coordinates
	 * @param lines
	 * @param dots
	 * @param x
	 * @param y
	 * @returns {Array}
	 */
	static getOptions = (lines, dots, x, y) => {
		let optionLines = _.filter(lines, function (line) {
			return (
				((line.pos.x1 === x && line.pos.y1 === y) || (line.pos.x2 === x && line.pos.y2 === y)) &&
				(line.player === false)
			)
		});

		let optionDots = _.filter(dots, function (dot) {
			let optionMatch = _.filter(optionLines, function (option) {
				return (option.pos.x1 === dot.pos.x && option.pos.y1 === dot.pos.y) || (option.pos.x2 === dot.pos.x && option.pos.y2 === dot.pos.y)
			});

			return optionMatch.length;
		});

		return _.map(optionDots, 'id');
	}
}