import React from "react";


export const Square = (props) => {
	return (<line className="line" x1={props.tl.x} y1={props.tl.y} x2={props.tr.x} y2={props.tr.y}/>);
};


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
			<circle onMouseEnter={() => this.setState({radius: this.size.hover})} onMouseLeave={() => this.setState({radius: this.size.default})} className="box__dot" cx={this.props.cx} cy={this.props.cy} r={this.state.radius} stroke="black"
			        strokeWidth="3" fill="yellow"/>)
	}
}


export const LineGroup = (props) => {
	return (
		<g className="box__line-group" onClick={props.onClick}>
			<line className="box__line" x1={props.x1} y1={props.y1} x2={props.x2} y2={props.y2} stroke={props.color}/>
			<line className="box__line-hover" x1={props.x1} y1={props.y1} x2={props.x2} y2={props.y2}  stroke={props.currentColor}/>
		</g>
	);
};
