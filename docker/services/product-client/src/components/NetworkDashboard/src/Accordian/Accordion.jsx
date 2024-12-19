import React from 'react';
import MaterialAccordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// const array=["sharath","kumar","sana"]
export default function Accordion(props) {
    const { data } = props;
    return (
        <div>
            <MaterialAccordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>{data.label} 1</Typography>
                </AccordionSummary>
                {data.typo.map((el, i) => (
                    <AccordionDetails key={'accrodianDetail' + i}>
                        <Typography>{el}</Typography>
                    </AccordionDetails>
                ))}
            </MaterialAccordion>
        </div>
    );
}

export const AccordianJson = {};
