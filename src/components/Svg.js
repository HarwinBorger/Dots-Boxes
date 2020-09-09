import React from "react";
import config from "../config/config";

/**
 * Dot class
 */
export class Dot extends React.Component {
	size = {
		default: 10,
		hover: 20
	};

	constructor(props)
	{
		super(props);

		this.state = {
			radius: this.size.default
		}
	}

	render()
	{
		return (
			<circle onClick={this.props.onClick} onMouseEnter={() => this.setState({radius: this.size.hover})}
			        onMouseLeave={() => this.setState({radius: this.size.default})}
			        className={`box__dot box__dot--${this.props.modifier}`} cx={this.props.cx} cy={this.props.cy}
			        r={this.state.radius} stroke="black"
			        strokeWidth="3" fill={this.props.currentColor}/>)
	}
}


/**
 * Linen Group
 * @param props
 * @returns {*}
 * @constructor
 */
export const LineGroup = (props) => {
	return (
		<line className="box__line" x1={props.x1} y1={props.y1} x2={props.x2} y2={props.y2} stroke={props.color}/>
	);
};

export class MouseLine extends React.Component {
	constructor(props)
	{
		super(props);
	}

	render()
	{
		if (this.props.id === false) {
			return (null);
		}

		return (
			<line className="box__mouseline"
			      x1={this.props.x1}
			      y1={this.props.y1}
			      x2={this.props.x2}
			      y2={this.props.y2}
			      stroke={this.props.currentColor}
			      strokeWidth="8" strokeLinecap={"round"}/>
		)
	}
}

export const Player = (props) => {
	return (
		<g className={"players__player player " + (props.currentPlayer ? 'player--current' : '')}>
			<circle className={"player__circle"} cx={props.cx} cy={-50} fill="#48443C" r={"50"} strokeDasharray={157/props.score} stroke={(props.currentPlayer ? props.fill : 'black')}/>
			<text className="player__score" x={props.cx}
			      y={-45} dominantBaseline="middle" textAnchor="middle"
			      fill={props.fill}>{props.score}</text>
			<text className="player__name" x={props.cx}
			      y={25} dominantBaseline="middle" textAnchor="middle"
			      fill="black">{props.name}</text>
		</g>
	);
};