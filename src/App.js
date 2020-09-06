import React from 'react';
import {Component} from 'react';
import './App.css';

/**
 * Box game
 */

class App extends Component {
	size = 100;
	width = 5; // define amount of horizontal squares
	height = 5; // define amount of vertical squares

	constructor()
	{
		super();

		this.state = {
			tales: this.generateTales(),
//			lines: this.generateLines()
		};
	}

	generateTales = () => {
		let tales = [];

		for (let y = 0; y < this.height; y++) {
			tales[y] = [];

			for (let x = 0; x < this.width; x++) {
				tales[y][x] = {
					player: false,
					number: (this.width * y) + x, // todo something with this
					color: '#ccc'
				};
			}
		}

		return tales;
	};

//	generateLines = () => {
//		/**
//		 * Draw the lines
//		 */
//		let lines = true;
//
//		// Loop through columns
//		for (let column = 0; column <= this.width; column++) {
//			// Loop through rows
//			for (let row = 0; row <= this.height; row++) {
//				// Vertical lines
//				if (row !== this.width) {
//					console.log(`${column - 1}:${column}`);
//				}
//
//				// Horizontal lines
//				if (column !== this.height) {
//					console.log(`${row - 1}:${row}`);
//				}
//			}
//		}
//
//		return lines;
//	};

	setColor = (y, x) => {
		console.log(`click => ${y}:${x}`);
		console.log(this.state.tales[y][x]);
		let tales = this.state.tales;
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
		const lines = [];

		/**
		 * Draw the lines
		 */
		// Loop through columns
		for (let column = 0; column <= this.width; column++) {
			// Loop through rows
			for (let row = 0; row <= this.height; row++) {
				let line = this.getLinePositions(row, column, this.size, this.strokeWidth);

				// Vertical lines
				if (row !== this.width) {
					lines.push(
						<g className="lineGroup">
							<line className="line" x1={line.tl.x} y1={line.tl.y} x2={line.tr.x}
							      y2={line.tr.y}/>
							<line className="lineHover" x1={line.tl.x} y1={line.tl.y} x2={line.tr.x}
							      y2={line.tr.y}/>
						</g>
					);
				}

				// Horizontal lines
				if (column !== this.height) {
					lines.push(
						<g className="lineGroup">
							<line className="line" x1={line.tl.x} y1={line.tl.y} x2={line.bl.x}
							      y2={line.bl.y}/>
							<line className="lineHover" x1={line.tl.x} y1={line.tl.y} x2={line.bl.x}
							      y2={line.bl.y}/>
						</g>
					);
				}
			}
		}

		/**
		 * Draw rectangles
		 */

			// Loop through rows
		let squares = this.state.tales.map((i, row) => {
				return i.map((box, column) => {
					// Loop through columns
					let x = column * this.size;
					let y = row * this.size;

					return (
						<g>
							<rect onClick={() => this.setColor(row, column)} x={x}
							      y={y} width={this.size} height={this.size}
							      fill={box.color}/>
							<text className="number" x={x + this.size / 2}
							      y={y + this.size / 2} dominantBaseline="middle" textAnchor="middle"
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
				<svg width="1000" height="1000">
					<g transform="translate(20,20)">
						{squares}

						{lines}
					</g>
				</svg>
			</div>
		);
	}
}

export default App;
