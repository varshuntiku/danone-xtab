import "./cardView.scss";
export default function CardView({graphData}) {
    var newArray = graphData?.data?.values?.map((e, i) => [
        e,
        graphData?.data?.columns[i]
    ]);
    return  (<div className="MinervaCardView">
        {newArray?.map((value) => (
            <div key={value} className="MinervaCardView-item">
                        <p className="MinervaCardView-title">
                            {value[1]}
                        </p>
                        {new Intl.NumberFormat('en-US').format(value[0]) !== 'NaN' &&
                        value[1]?.toLowerCase() !== 'year' ? (
                            <p className="MinervaCardView-value">
                                {new Intl.NumberFormat('en-US').format(value[0])}
                            </p>
                        ) : (
                            <p className="MinervaCardView-value">
                                {value[0]}
                            </p>
                        )}
            </div>
        ))}
    </div>)
}