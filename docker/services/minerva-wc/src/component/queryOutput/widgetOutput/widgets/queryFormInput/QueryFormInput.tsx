import { useContext, useState } from 'preact/hooks';
import { RootContext } from '../../../../../context/rootContext';
import { GridContainer, GridItem } from '../../../../shared/grid/Grid';
import ButtonOptions from './buttonOptions/ButtonOptions';
import TableInput from './tableInput/TableInput';
import { OuterActionParams } from '../../../../shared/gridTable/GridTableModel';
import useDisableUserInput from '../../../../../util/useDisableUserInput';

export default function QueryFormInput({data}) {
    const {queryService} = useContext(RootContext);
    const [formLayout, ] = useState(data?.layout || []);
    const disableFormItems = useDisableUserInput()

    const handleFormButtonClick = (item) => {
        queryService.makeQuery(item.query,'text', 'input-form');
    };

    const handleTableSubmit = (event: OuterActionParams) => {
        queryService.makeQuery(event.button.name,'text', 'input-form', event);
    }

    return (
        <form onSubmit={e => e.preventDefault()}>
            <GridFormElements
                formLayout={formLayout}
                disableFormItems={disableFormItems}
                handleFormButtonClick={handleFormButtonClick}
                handleTableSubmit={handleTableSubmit}
            />
        </form>
    );
}

const GridFormElements = ({ formLayout, disableFormItems, handleFormButtonClick, handleTableSubmit }) => {
    return (
        <GridContainer className="MinervaGridContainer" spacing={2}>
            {formLayout.map((layoutItem, index) => {
                return (
                    <GridItem xs={layoutItem.grid} key={index}>
                        <FieldElements
                            key={index}
                            item={layoutItem}
                            disableFormItems={disableFormItems}
                            handleFormButtonClick={handleFormButtonClick}
                            handleTableSubmit={handleTableSubmit}
                        />
                    </GridItem>
                );
            })}
        </GridContainer>
    );
};

const FieldElements = ({ item, disableFormItems, handleFormButtonClick, handleTableSubmit }) => {
    let { element, elementProps } = item;

    switch (element) {
        case 'button-options':
            return (<ButtonOptions params={elementProps} disabled={disableFormItems} onClick={handleFormButtonClick} />);
        case 'table-input':
            return (<TableInput params={elementProps} disabled={disableFormItems} onSubmit={handleTableSubmit} />);
        default:
            return <div>Input Component Not found</div>;
    }
};
