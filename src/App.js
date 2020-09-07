import React from 'react';
import _ from 'lodash';

// Configs
import config from './Config/Config';
// Components
import {LineGroup, Dot} from './Components/Svg';
//  Utilities
import {getLinePositions} from './Utils/Utils';

import './App.css';

/**
 * Box game
 */

class App extends React.Component {

	constructor()
	{
		super();

		this.state = {
			game: {
				currentPlayer: 0
			},
			players: [
				{name: 'Albert Einstein', color: 'red'},
				{name: 'Leonardo da Vinci', color: 'blue'}
			],
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
			for (let x = 0; x < config.width; x++) {
				const number = (config.width * y) + x;
				taleData[number] = {
					pos: {
						x: x,
						y: y
					},
					player: false,
					number: number,
					color: '#ccc'
				};
			}
		}

		return taleData;
	};

	/**
	 * Generate Line Data
	 */
	generateLineData = () => {
		let lineData = [];
		let id = 0;

		for (let x = 0; x <= config.width; x++) {
			for (let y = 0; y <= config.height; y++) {

				const pos = getLinePositions(x, y, config.size);
				const numberCurrent = (config.width * y) + x;

				// Todo horizontal and vertical use exact same script, should be put into function to centralize functionality
				// Horizontal line
				if (x < config.width) {
					const numberAbove = y > 0 ? numberCurrent - config.height : false; // if not most top line
					const numberBelow = y < config.height ? numberCurrent : false; // if not most bottom line

					lineData.push({
						id: id,
						pos: {
							x1: pos.tl.x,
							y1: pos.tl.y,
							x2: pos.tr.x,
							y2: pos.tr.y
						},
						numbers: [numberAbove, numberBelow],
						player: false
					});
					id++;
				}

				// Vertical line
				if (y < config.height) {
					const numberLeft = x > 0 ? numberCurrent - 1 : false; // if not most left line
					const numberRight = x < config.width ? numberCurrent : false; // if not most right line

					lineData.push({
						id: id,
						pos: {
							x1: pos.tl.x,
							y1: pos.tl.y,
							x2: pos.bl.x,
							y2: pos.bl.y
						},
						numbers: [numberLeft, numberRight],
						player: false
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

	/**
	 * Try to set Line
	 * @param id
	 */
	setLine = (id) => {
		// Retrieve several states
		const game = {...this.state.game};
		let lines = {...this.state.box.lines};

		// Check if player is allowed to set this line
		if (lines[id].player !== false) {
			alert('Leuk geprobeerd! ;-)');
			return
		}

		// Connect a player to a line
		lines[id].player = game.currentPlayer;
		this.setState({lines});

		// Check if any of the numbers from line has 4 lines connected
		let success = false; // flag set on true when 1 or more boxes are filled
		lines[id].numbers.map((number) => {
			// When number is not a number, we are on the edge, we skip this number
			if (number === false) {
				return;
			}

			let match = _.filter(lines, function (line) {
				return line.numbers.includes(number) && line.player !== false;
			});

			if (match.length === 4) {
				this.setBox(number, game.currentPlayer);
				success = true;
			}
		});

		// If player didn't succeed, then switch to other player
		if (success === false) {
			// Switch between players
			game.currentPlayer = 1 - game.currentPlayer; // Toggle to other player
			this.setState({game});
		}
	};

	/**
	 * Set Box
	 * @param id
	 * @param player
	 */
	setBox = (id, player) => {
		let tales = {...this.state.box.tales};
		tales[id].player = player;
		this.setState(tales);
	};

	/**
	 * Get Line Color
	 * @param id
	 * @returns {string|string}
	 */
	getLineColor = (id) => {
		const lines = {...this.state.box.lines};
		const player = lines[id].player;

		if (player === false) {
			return 'black';
		}

		return this.state.players[player].color;
	};

	/**
	 * Get Box Color
	 * @param id
	 * @returns {string|string}
	 */
	getBoxColor = (id) =>{
		const tales = {...this.state.box.tales};
		const player = tales[id].player;

		if (player === false) {
			return 'white';
		}

		return this.state.players[player].color;
	};

	/**
	 * Get Current Player Color
	 * @returns {string}
	 */
	getCurrentPlayerColor = () => {
		return this.state.players[this.state.game.currentPlayer].color;
	};

	/**
	 * Render
	 * @returns {*}
	 */
	render()
	{
		let dots = this.generateDots();
		/**
		 * Draw rectangles
		 */
			// Loop through rows
		let squares = this.state.box.tales.map((tale) => {
				// Loop through columns
				let x = tale.pos.x * config.size;
				let y = tale.pos.y * config.size;

				return (
					<g key={tale.number}>
						<rect className="box__tale" x={x}
						      y={y} width={config.size} height={config.size}
						      fill={this.getBoxColor(tale.number)}/>
						<text className="box__number" x={x + config.size / 2}
						      y={y + config.size / 2} dominantBaseline="middle" textAnchor="middle"
						      fill="black">{tale.number}</text>
					</g>
				)
			});

		let lines = this.state.box.lines.map((line) => {
			return (
				<LineGroup onClick={() => this.setLine(line.id)}
				           key={line.id}
				           x1={line.pos.x1}
				           y1={line.pos.y1}
				           x2={line.pos.x2}
				           y2={line.pos.y2}
				           color={this.getLineColor(line.id)}
				           currentColor={this.getCurrentPlayerColor()}
				/>
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

				Current player:
				{this.state.players[this.state.game.currentPlayer].name} ({this.state.players[this.state.game.currentPlayer].color})

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
