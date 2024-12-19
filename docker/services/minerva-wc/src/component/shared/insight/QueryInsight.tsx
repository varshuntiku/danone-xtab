import './queryInsight.scss'

export default function QueryInsight({ insights = [] }) {

    return (
        <div className='MinervaQueryInsight-container'>
            {insights.map((insight) => (
                <p className='MinervaQueryInsight-item' key={insight["key"]}>
                    {insight["key"]} : <span>{insight["value"]}</span>
                </p>
            ))}
        </div>
    )
}