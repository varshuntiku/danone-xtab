import React from 'react';

function CompatibleVersionsList(props) {
    const { classes, summary, list } = props;

    return (
        <React.Fragment>
            <details>
                <summary>{summary}</summary>
                <div>
                    <ul className={classes.ul}>
                        {list.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            </details>
        </React.Fragment>
    );
}

export default CompatibleVersionsList;
