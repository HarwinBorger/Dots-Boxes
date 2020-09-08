import React from 'react';
import _ from 'lodash';

// Configs
import config from './Config/Config';
// Components
import {LineGroup, Dot, MouseLine} from './Components/Svg';
//  Utilities
import {getLinePositions} from './Utils/Utils';

import './App.css';

/**
 * Box game
 *
 */

class App extends React.Component {
	constructor()
	{
		super();

		// Todo use Redux to store data on a more centralize location so we can split up all functions to improve readability of code
		// Todo or use NodeJS to store data on a server to play the game over different clients
		this.state = {
			// game data
			game: {
				currentPlayer: 0,
				mouseLine: {
					id: false,
					x: 0,
					y: 0
				},
				mouse: {
					x: false,
					y: false,
				},
			},
			// player data
			players: [
				{
					name: 'Albert Einstein',
					color: 'red'
				},
				{
					name: 'Leonardo da Vinci',
					color: 'blue'
				}
			],
			// data to draw the game
			// todo create a super function so we don't need to loop 3 times over the columns and rows
			box: {
				tales: this.generateTaleData(),
				lines: this.generateLineData(),
				dots: this.generateDotData(),
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

					lineData[id] = {
						id: id,
						pos: {
							x1: pos.tl.x,
							y1: pos.tl.y,
							x2: pos.tr.x,
							y2: pos.tr.y
						},
						numbers: [numberAbove, numberBelow],
						player: false
					};
					id++;
				}

				// Vertical line
				if (y < config.height) {
					const numberLeft = x > 0 ? numberCurrent - 1 : false; // if not most left line
					const numberRight = x < config.width ? numberCurrent : false; // if not most right line

					lineData[id] = {
						id: id,
						pos: {
							x1: pos.tl.x,
							y1: pos.tl.y,
							x2: pos.bl.x,
							y2: pos.bl.y
						},
						numbers: [numberLeft, numberRight],
						player: false
					};
					id++;
				}
			}
		}

		return lineData;
	};

	generateDotData = () => {
		/**
		 * Draw the lines
		 */
		const dots = [];
		let id = 0;
		// Loop through columns
		for (let column = 0; column <= config.width; column++) {
			// Loop through rows
			for (let row = 0; row <= config.height; row++) {
				dots[id] = {
					id: id,
					pos: {
						x: row * config.size,
						y: column * config.size,
					}
				};

				id++;
			}
		}

		return dots;
	};

	drawLine = (id) => {
		const dots = {...this.state.box.dots};
		const game = {...this.state.game};

		let x = dots[id].pos.x;
		let y = dots[id].pos.y;
		let mx = game.mouseLine.x;
		let my = game.mouseLine.y;

		let match = false;
		// WHEN the 1th DOT and 2nd DOT are not identical try to find connected LINE
		if (id !== game.mouseLine.id && game.mouseLine.id !== false) {
			const lines = {...this.state.box.lines};

			// Note: finding the line is a bit tricky, since we use coordinates to find them
			// Check if a line matches the tale
			match = _.filter(lines, function (line) {
				return (
					((line.pos.x1 === x && line.pos.y1 === y) || (line.pos.x2 === x && line.pos.y2 === y)) &&
					((line.pos.x1 === mx && line.pos.y1 === my) || (line.pos.x2 === mx && line.pos.y2 === my))
				)
			});
		}

		// IF same dot is clicked THEN cancel current line
		// OR when line is already connected THEN also cancel current line
		if (id === game.mouseLine.id || game.mouseLine.id !== false) {
			id = false;
			x = false;
			y = false;
		}

		// Write back new data to the mouse line
		game.mouseLine.id = id;
		game.mouseLine.x = x;
		game.mouseLine.y = y;

		this.setState({game});

		// Set line after we are done, other wise 'setStates' conflicts
		if (match.length === 1) {
			this.setLine(_.first(match).id);
		}
	};

	/**
	 * Try to set Line
	 * @param id
	 */
	setLine = (id) => {
		// Retrieve several states
		const game = {...this.state.game};
		const lines = {...this.state.box.lines};

		// Check if player is allowed to set this line
		if (lines[id].player !== false) {
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

			// Check if a line matches the tale
			let match = _.filter(lines, function (line) {
				return line.numbers.includes(number) && line.player !== false;
			});

			// When the tale has 4 lines set connect player to it
			if (match.length === 4) {
				this.setBox(number, game.currentPlayer);
				success = true;
			}
		});

		// If player didn't succeed, then switch to other player
		if (success !== true) {
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
			return '#ccc';
		}

		return this.state.players[player].color;
	};

	/**
	 * Get Box Color
	 * @param id
	 * @returns {string|string}
	 */
	getBoxColor = (id) => {
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
	 * Handle mouse move
	 */
	handleMouseMove = (e) => {
		const game = {...this.state.game};

		// Create SVG point to capture relative mouse position within SVG component
		let point = this.svg.createSVGPoint();
		point.x = e.clientX;
		point.y = e.clientY;
		game.mouse = point.matrixTransform(this.svg.getScreenCTM().inverse());

		// Write back relative mouse position to state
		this.setState({game});
	};

	/**
	 * Render
	 * @returns {*}
	 */
	render()
	{
		// Draw tales
		let squares = this.state.box.tales.map((tale) => {
			let x = tale.pos.x * config.size;
			let y = tale.pos.y * config.size;

			return (
				<g key={tale.number}>
					<rect className="box__tale" x={x}
					      y={y} width={config.size} height={config.size}
					      fill={this.getBoxColor(tale.number)} stroke={"black"} strokeWidth={"12"}/>
					<text className="box__number" x={x + config.size / 2}
					      y={y + config.size / 2} dominantBaseline="middle" textAnchor="middle"
					      fill="black">{tale.number}</text>
				</g>
			)
		});

		// Draw lines
		let lines = this.state.box.lines.map((line) => {
			return (
				<LineGroup
					//onClick={() => this.setLine(line.id)} // This functionality is replace by line drag
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

		// Draw dots
		let dots = this.state.box.dots.map((dot) => {
			return (
				<Dot onClick={() => this.drawLine(dot.id)} key={dot.id} cx={dot.pos.x} cy={dot.pos.y} currentColor={this.getCurrentPlayerColor()}/>
			);
		});

		let viewportOffset = config.offset;
		let viewportWidth = config.width * config.size + config.offset * -2;
		let viewportHeight = config.height * config.size + config.offset * -2;

		return (
			<div className="App">
				Current player:
				{this.state.players[this.state.game.currentPlayer].name} ({this.state.players[this.state.game.currentPlayer].color})

				<svg className={"box"} width="100%" height="1000"
				     viewBox={`${viewportOffset},${viewportOffset} ${viewportWidth} ${viewportHeight}`}
				     onMouseMove={(e) => this.handleMouseMove(e)}
				     ref={(svg) => this.svg = svg}>
					{squares}
					{lines}
					{dots}

					<MouseLine
						id={this.state.game.mouseLine.id}
						x1={this.state.game.mouseLine.x}
						y1={this.state.game.mouseLine.y}
						x2={this.state.game.mouse.x}
						y2={this.state.game.mouse.y}
						currentColor={this.getCurrentPlayerColor()}
					/>
				</svg>
			</div>
		);
	}
}

export default App;
