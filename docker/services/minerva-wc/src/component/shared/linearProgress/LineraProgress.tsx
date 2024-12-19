import "./lineraProgress.scss";

type LinearProgressType = {
	variant?: 'indeterminate' | 'determinate';
	height?: number;
	value?: number;
	showPercentage?: boolean
}
export default function LinearProgress({ variant="indeterminate", height=1, value=null, showPercentage=false }: LinearProgressType) {
	return (
		<div className="MinervaLinearProgress">
			<div className="MinervaLinearProgress-bar-root" role="progressbar" style={{"--bar-height": height}}>
				{variant === 'indeterminate'?
					<>
						<div className="MinervaLinearProgress-bar MinervaLinearProgress-bar1"></div>
						<div className="MinervaLinearProgress-bar MinervaLinearProgress-bar2"></div>
					</>
				: null}
				{variant === 'determinate'?
					<div className="MinervaLinearProgress-bar MinervaLinearProgress-bar-determinate" style={{"--bar-progress-value": value}}></div>
				: null}
			</div>
			{showPercentage? <small>{value}%</small> : null}
		</div>
	);
}
