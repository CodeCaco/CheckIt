import React from 'react';
import './Graph.css';

export const Graph = (props) => {
    console.log(props.data.length)

    return (
        <>
            <table className="charts-css area show-heading graph-area" id="my-chart">
                <caption className="caption">Win Probabilities</caption>
                <tbody>
                    {props.data.map((percentage, i) => {
                        if (i === 0) {
                            return null
                        }
                        const size = percentage / 100
                        const start = props.data[i - 1] / 100
                        return (
                            <tr key={"graph" + i}>
                                <td style={{"--start": start, "--size": size}}></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
};