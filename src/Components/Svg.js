import React from "react";

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
			<circle onClick={this.props.onClick} onMouseEnter={() => this.setState({radius: this.size.hover})} onMouseLeave={() => this.setState({radius: this.size.default})} className="box__dot" cx={this.props.cx} cy={this.props.cy} r={this.state.radius} stroke="black"
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
		<g className="box__line-group" onClick={props.onClick}>
			<line className="box__line" x1={props.x1} y1={props.y1} x2={props.x2} y2={props.y2} stroke={props.color}/>

			{/*<line className="box__line-hover" x1={props.x1} y1={props.y1} x2={props.x2} y2={props.y2}  stroke={props.currentColor}/>*/}
		</g>
	);
};

export class MouseLine extends React.Component {
	constructor(props){
		super(props);

		console.log(props);
	}

	render(){
		if(this.props.id === false){
			return (null);
		}

		return(
			<line className="box__mouseline"
			      x1={this.props.x1}
			      y1={this.props.y1}
			      x2={this.props.x2}
			      y2={this.props.y2}
			      stroke={this.props.currentColor}
			      strokeWidth="10" strokeLinecap={"round"}/>
		)
	}
}