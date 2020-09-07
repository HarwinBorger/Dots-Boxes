import React from 'react';
import {LineGroup, Dot} from './Components/Svg';
import config from './Config/Config';

import './App.css';

/**
 * Box game
 */

class App extends React.Component {

	constructor()
	{
		super();

		this.state = {
			playerData: {},
			box: {
				tales: this.generateTaleData(),
				lines: this.generateLineData(),
			}
		};
	}

	/**
	 * Generate Tale Data
	 * @returns {Array}
	 */
	generateTaleData = () => {
		let taleData = [];

		for (let y = 0; y < config.height; y++) {
			taleData[y] = [];

			for (let x = 0; x < config.width; x++) {
				taleData[y][x] = {
					player: false,
					number: (config.width * y) + x,
					color: '#ccc'
				};
			}
		}

		return taleData;
	};

	/**
	 * Generate Line Data
	 *
	 * Todo centralize data format in lineData array
	 */
	generateLineData = () => {
		let lineData = [];
		let id = 0;

		for (let y = 0; y <= config.height; y++) {
			for (let x = 0; x <= config.width; x++) {

				const pos = this.getLinePositions(y, x, config.size);
				const numberCurrent = (config.width * y) + x;

				// Horizontal line
				const numberAbove = y > 0 ? numberCurrent - config.width : false; // if not most top line
				const numberBelow = y < config.height ? numberCurrent : false; // if not most bottom line

				if (y !== config.width) {
					lineData.push({
						id: id,
						pos: {
							x1: pos.tl.x,
							y1: pos.tl.y,
							x2: pos.tr.x,
							y2: pos.tr.y
						},
						numbers: [numberAbove, numberBelow]
					});
					id++;
				}

				// Vertical line
				const numberLeft = x > 0 ? numberCurrent - 1 : false; // if not most left line
				const numberRight = x < config.width ? numberCurrent : false; // if not most right line

				if (x !== config.height) {
					lineData.push({
						id: id,
						pos: {
							x1: pos.tl.x,
							y1: pos.tl.y,
							x2: pos.bl.x,
							y2: pos.bl.y
						},
						numbers: [numberLeft, numberRight]
					});
					id++;
				}
			}
		}

		return lineData;
	};

	generateDots = () => {
		/**
		 * Draw the lines
		 */
		const dots = [];
		// Loop through columns
		for (let column = 0; column <= config.width; column++) {
			// Loop through rows
			for (let row = 0; row <= config.height; row++) {
				let dot = {
					x: row * config.size,
					y: column * config.size,
				};

				// Vertical lines
				dots.push(
					<Dot key={row + ':' + column} cx={dot.x} cy={dot.y}/>
				);
			}
		}

		return dots;
	};

	setColor = (y, x) => {
		let tales = this.state.box.tales;
		tales[y][x].color = 'blue';

		this.setState({tales: tales});
	};

	setLine = (id) => {
		console.log(this.state.box.lines[id]);
	};

	getLinePositions = (column, row, size) => {
		return {
			// top left
			tl: {
				x: column * size,
				y: row * size
			},
			// top right
			tr: {
				x: (column + 1) * size,
				y: row * size
			},
			// bottom left
			bl: {
				x: (column) * size,
				y: (row + 1) * size
			},
			// bottom right (not needed atm)
			br: {
				x: (column + 1) * size,
				y: (row + 1) * size
			}
		};
	};

	render()
	{
		let dots = this.generateDots();
		/**
		 * Draw rectangles
		 */
			// Loop through rows
		let squares = this.state.box.tales.map((i, row) => {
				return i.map((box, column) => {
					// Loop through columns
					let x = column * config.size;
					let y = row * config.size;

					return (
						<g key={box.number}>
							<rect className="box__tale" onClick={() => this.setColor(row, column)} x={x}
							      y={y} width={config.size} height={config.size}
							      fill={box.color}/>
							<text className="box__number" x={x + config.size / 2}
							      y={y + config.size / 2} dominantBaseline="middle" textAnchor="middle"
							      fill="black">{box.number}</text>
						</g>
					)
				})
			});

		let lines = this.state.box.lines.map((line) => {
			return (
				<LineGroup onClick={() => this.setLine(line.id)} key={line.id} x1={line.pos.x1}
				           y1={line.pos.y1} x2={line.pos.x2} y2={line.pos.y2}/>
			);
		});

		return (
			<div className="App">
				Ideas:
				<ul>
					<li>Make default game work</li>
					<li>Bonus perks idea: at a randomizer not knowing which color the line get</li>
					<li>Bonus game: Guess the picture</li>
				</ul>

				<svg width="100%" height="1000" viewBox="0 0 1000 1000">
					<g className="box" transform="translate(50,50)">
						{squares}
						{lines}
						{dots}
					</g>
				</svg>
			</div>
		);
	}
}

export default App;
