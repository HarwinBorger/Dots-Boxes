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
			gameData: {
				tales: this.generateTaleData(),
				lines: this.generateLines(),
				dots: this.generateLines(),
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
	 */
	generateLineDate = () => {

	};

	generateLines = () => {
		/**
		 * Draw the lines
		 */
		const lines = [];
		// Loop through columns
		for (let column = 0; column <= config.width; column++) {
			// Loop through rows
			for (let row = 0; row <= config.height; row++) {
				let line = this.getLinePositions(row, column, config.size, this.strokeWidth);

				// Vertical lines
				if (row !== config.width) {
					lines.push(
						<LineGroup key={row+'-'+column+'v'} x1={line.tl.x} y1={line.tl.y} x2={line.tr.x} y2={line.tr.y}/>
					);
				}

				// Horizontal lines
				if (column !== config.height) {
					lines.push(
						<LineGroup key={row+'-'+column+'h'} x1={line.tl.x} y1={line.tl.y} x2={line.bl.x} y2={line.bl.y}/>
					);
				}
			}
		}

		return lines;
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
				let dot ={
					x: row * config.size,
					y: column* config.size,
				}

				// Vertical lines
				dots.push(
					<Dot key={row+':'+column} cx={dot.x} cy={dot.y}/>
				);
			}
		}

		return dots;
	};

	setColor = (y, x) => {
		let tales = this.state.gameData.tales;
		tales[y][x].color = 'blue';

		this.setState({tales: tales});
	};

	getLinePositions = (column, row, size) => {
		return {
			// top left
			tl: {
				x: row * size,
				y: column * size
			},
			// top right
			tr: {
				x: row * size,
				y: (column + 1) * size
			},
			// bottom left
			bl: {
				x: (row + 1) * size,
				y: column * size
			},
			// bottom right (not needed atm)
			br: {
				x: (row + 1) * size,
				y: (column + 1) * size
			}
		};
	};

	render()
	{
		let lines = this.generateLines();
		let dots = this.generateDots();
		/**
		 * Draw rectangles
		 */
			// Loop through rows
		let squares = this.state.gameData.tales.map((i, row) => {
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
