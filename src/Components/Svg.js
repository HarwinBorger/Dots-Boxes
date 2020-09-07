import React from "react";


export const Square = (props) => {
	return (<line className="line" x1={props.tl.x} y1={props.tl.y} x2={props.tr.x} y2={props.tr.y}/>);
};


export const Dot = (props) => {
	return (<line className="line" x1={props.tl.x} y1={props.tl.y} x2={props.tr.x} y2={props.tr.y}/>);
};


export const LineGroup = (props) => {
	return (
		<g className="lineGroup">
			<line className="line" x1={props.x1} y1={props.y1} x2={props.x2} y2={props.y2}/>
			<line className="lineHover" x1={props.x1} y1={props.y1} x2={props.x2} y2={props.y2}/>
		</g>
	);
};
