import React from 'react';
import _ from 'lodash';

// Configs
import config from './config/config';
// Components
import {LineGroup, Dot, MouseLine, Player, Tale, Winner} from './components/Svg';
//  Utilities
import utils from './utils/utils';
import enums from './enums/enums';

import './App.css';

/**
 * Box game
 */

class App extends React.Component {

	constructor()
	{
		super();

		this.state = this.initialState;
	}

	get initialState() {
		// Todo use Redux to store data on a more centralize location so we can split up all functions to improve readability of code
		// Todo or use NodeJS to store data on a server to play the game over different clients
		return  {
			// game data
			game: {
				currentPlayer: 0,
				mouseLine: {
					id: false,
					x: 0,
					y: 0,
					options: false
				},
				mouse: {
					x: false,
					y: false,
				},
				winner: false,
			},
			// player data
			players: [
				{
					name: 'Albert Einstein',
					color: '#E0474C'
				},
				{
					name: 'Leonardo da Vinci',
					color: '#72A6CA'
				}
			],
			// data to draw the game
			// todo create a super function so we don't need to loop 3 times over the columns and rows
			box: {
				tiles: this.generateTileData(),
				lines: this.generateLineData(),
				dots: this.generateDotData(),
			}
		};
	}

	/**
	 * Restart Game
	 */
	restartGame = () =>{
		this.setState(this.initialState);
	};

	/**
	 * Generate Tile Data
	 * @returns {Array}
	 */
	generateTileData = () => {
		let tileData = [];

		for (let y = 0; y < config.height; y++) {
			for (let x = 0; x < config.width; x++) {
				const tileNumber = utils.calcTileNumber(x, y, config.width);
				tileData[tileNumber] = {
					pos: {
						x: x,
						y: y
					},
					player: false,
					number: tileNumber,
				};
			}
		}

		return tileData;
	};

	/**
	 * Generate Line Data
	 */
	generateLineData = () => {
		let lineData = [];
		let id = 0;

		for (let y = 0; y <= config.height; y++) {
			for (let x = 0; x <= config.width; x++) {

				const pos = utils.getLinePositions(x, y, config.size);
				const baseNumber = utils.calcTileNumber(x, y, config.width);

				// Todo horizontal and vertical use exact same script, should be put into function to centralize functionality
				// Horizontal line
				if (x < config.width) {

					const tileAbove = y > 0 ? baseNumber - config.width : false; // if not most top line
					const tileBelow = y < config.height ? baseNumber : false; // if not most bottom line

					lineData[id] = {
						id: id,
						pos: {
							x1: pos.tl.x,
							y1: pos.tl.y,
							x2: pos.tr.x,
							y2: pos.tr.y
						},
						tiles: [tileAbove, tileBelow],
						player: false
					};
					id++;
				}

				// Vertical line
				if (y < config.height) {
					const tileLeft = x > 0 ? baseNumber - 1 : false; // if not most left line
					const tileRight = x < config.width ? baseNumber : false; // if not most right line

					lineData[id] = {
						id: id,
						pos: {
							x1: pos.tl.x,
							y1: pos.tl.y,
							x2: pos.bl.x,
							y2: pos.bl.y
						},
						tiles: [tileLeft, tileRight],
						player: false
					};
					id++;
				}
			}
		}

		return lineData;
	};

	/**
	 * Generate Dot Data
	 * @returns {Array}
	 */
	generateDotData = () => {
		const dots = [];
		let id = 0;
		// Loop through rows
		for (let y = 0; y <= config.height; y++) {
			// Loop through column
			for (let x = 0; x <= config.width; x++) {
				dots[id] = {
					id: id,
					pos: {
						x: x * config.size,
						y: y * config.size,
					}
				};

				id++;
			}
		}

		return dots;
	};

	/**
	 * Draw a line on mouse click
	 * @param id
	 */
	drawLine = (id) => {
		// Retrieve state data
		const dots = {...this.state.box.dots};
		const game = {...this.state.game};
		const lines = {...this.state.box.lines};

		// Create shorthand variables
		let x = dots[id].pos.x;
		let y = dots[id].pos.y;
		let mx = game.mouseLine.x;
		let my = game.mouseLine.y;

		// Show possible options in yellow dots
		let options = utils.getPossibleOptions(lines, dots, x, y);

		// WHEN the 1th DOT and 2nd DOT are not identical try to find connected LINE
		let match = false;
		if (id !== game.mouseLine.id && game.mouseLine.id !== false) {

			// Note: finding the line is a bit tricky, since we use coordinates to find them, should use ID's instead
			// Check if a line matches the tile
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
			options = false;
		}

		// Write back new data to the mouse line
		game.mouseLine.id = id;
		game.mouseLine.x = x;
		game.mouseLine.y = y;
		game.mouseLine.options = options;

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

		// Check if any of the tiles from line has 4 lines connected
		let success = false; // flag set on true when 1 or more boxes are filled
		lines[id].tiles.forEach((number) => {
			// When number is not a number, we are on the edge, we skip this number
			if (number === false) {
				return;
			}

			// Check if a line matches the tile
			let match = _.filter(lines, function (line) {
				return line.tiles.includes(number) && line.player !== false;
			});

			// When the tile has 4 lines set player to it, it could be 2 tiles
			if (match.length === 4) {
				this.setBox(number, game.currentPlayer);
				success = true;
			}
		});

		// If player didn't succeed, then switch to other player
		if (success !== true) {
			this.switchPlayer();
		}
	};

	/**
	 * Switch Player
	 */
	switchPlayer()
	{
		const game = {...this.state.game};

		// Switch between players
		game.currentPlayer = 1 - game.currentPlayer; // Toggle to other player

		this.setState({game});
	}

	/**
	 * Set Box
	 * @param id
	 * @param player
	 */
	setBox = (id, player) => {
		let tiles = {...this.state.box.tiles};
		tiles[id].player = player;
		this.setState(tiles);

		this.isFinish()
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
			return '#49453D';
		}

		return this.state.players[player].color;
	};

	/**
	 * Get Box Color
	 * @param id
	 * @returns {string|string}
	 */
	getBoxColor = (id) => {
		const tiles = {...this.state.box.tiles};
		const player = tiles[id].player;
		if (player === false) {
			return '#6B675E';
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
	 * Get Dot option class
	 * @description check if the current dot (id) is in the list with possible options
	 * @param id
	 * @returns {string}
	 */
	getDotOptionClass = (id) => {
		if (this.state.game.mouseLine.options && this.state.game.mouseLine.options.includes(id)) {
			return 'active'
		}

		return ''
	};


	/**
	 * Get Player Score
	 * @param id
	 */
	getPlayerScore = (id) => {
		const tiles = this.state.box.tiles;

		let score = _.filter(tiles, (tale) => {
			return tale.player === id;
		});

		return score.length;
	};

	/**
	 * is Current Player
	 * @param id
	 * @returns {boolean}
	 */
	isCurrentPlayer = (id) => {
		return id === this.state.game.currentPlayer;
	};

	/**
	 * Is the game finished?
	 * @returns {boolean}
	 */
	isFinish = () =>{
		const tiles = this.state.box.tiles;

		let playerTiles = _.filter(tiles, (tale) => {
			return tale.player !== false;
		});

		if(tiles.length === playerTiles.length){
			const game = {...this.state.game};

			if(this.getPlayerScore(0) > this.getPlayerScore(1)){
				game.winner = 0;
			}else if(this.getPlayerScore(1) > this.getPlayerScore(0)) {
				game.winner = 1;
			}else{
				game.winner = enums.equal;
			}

			this.setState({game});

			return true;
		}

		return false;
	};


	getWinner = (id) =>{
		if(id===false){
			return false;
		}else if(id===enums.equal){
			return 'Draw!'
		}else{
			return this.state.players[id].name + ' won the game!';
		}
	};

	/**
	 * Render
	 * @returns {*}
	 */
	render()
	{
		// Draw tiles
		let squares = this.state.box.tiles.map((tile) => {
			let x = tile.pos.x * config.size;
			let y = tile.pos.y * config.size;

			return (
				<Tale key={tile.number} fill={this.getBoxColor(tile.number)} x={x} y={y} size={config.size}
				      number={tile.number}/>
			)
		});

		// Draw lines
		let lines = this.state.box.lines.map((line) => {
			return (
				<LineGroup
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
				<Dot onClick={() => this.drawLine(dot.id)} key={dot.id} cx={dot.pos.x} cy={dot.pos.y}
				     currentColor={this.getCurrentPlayerColor()} modifier={this.getDotOptionClass(dot.id)}/>
			);
		});

		let viewportOffsetX = config.offsetX;
		let viewportOffsetY = config.offsetY;
		let viewportWidth = config.width * config.size + config.offsetX * -2;
		let viewportHeight = config.height * config.size + config.offsetY * -2;

		return (
			<div className="App">
				<svg className={"box"} width="100%" height="100vh"
				     viewBox={`${viewportOffsetX} ${viewportOffsetY} ${viewportWidth} ${viewportHeight}`}
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

					<Player cx={'-100'} cy={0}
					        fill={this.state.players[0].color}
					        score={this.getPlayerScore(0)}
					        name={this.state.players[0].name}
					        currentPlayer={this.isCurrentPlayer(0)}/>
					<Player cx={viewportWidth - 100 * 3} cy={0}
					        fill={this.state.players[1].color}
					        score={this.getPlayerScore(1)}
					        name={this.state.players[1].name}
					        currentPlayer={this.isCurrentPlayer(1)}/>

			        <text onClick={this.restartGame} x={250} y={'90%'} dominantBaseline="middle" textAnchor="middle" fill="white">Restart</text>

					<Winner onClick={this.restartGame} offset={viewportWidth/2} player={this.getWinner(this.state.game.winner)} />
				</svg>
			</div>
		);
	}
}

export default App;
