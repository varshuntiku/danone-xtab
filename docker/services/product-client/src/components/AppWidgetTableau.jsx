import React from 'react';

class TableauEmbed extends React.Component {
    constructor(props) {
        super(props);
        this.vizRef = React.createRef();
        this.viz = null;
        this.isVizReady = false;
    }

    componentDidMount() {
        this.initializeTableauViz();
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.params.workbookName !== this.props.params.workbookName ||
            prevProps.params.viewName !== this.props.params.viewName
        ) {
            this.initializeTableauViz();
        }

        if (prevProps.selected_filters !== this.props.selected_filters && this.isVizReady) {
            this.applyFilters();
        }
    }

    componentWillUnmount() {
        this.disposeTableauViz();
    }

    initializeTableauViz = () => {
        let { workbookName, viewName } = this.props.params;
        const storedcontentURL = sessionStorage.getItem('contentURL');
        workbookName = workbookName.replace(/\s+/g, '');
        viewName = viewName.replace(/\s+/g, '');

        const tableauVizUrl = `https://prod-apnortheast-a.online.tableau.com/t/${storedcontentURL}/views/${workbookName}/${viewName}`;
        const vizContainer = this.vizRef.current;
        const options = {
            hideTabs: true,
            hideToolbar: true,
            height: '100%',
            width: '100%',
            onFirstInteractive: () => {
                this.isVizReady = true;
                this.applyFilters();
            }
        };

        if (this.viz) {
            this.viz.dispose();
        }

        this.viz = new window.tableau.Viz(vizContainer, tableauVizUrl, options);
        this.isVizReady = false;
    };

    // listSheets = async () => {
    //     if (!this.viz) {
    //         console.warn('Viz is not initialized.');
    //         return;
    //     }

    //     try {
    //         const workbook = this.viz.getWorkbook();
    //         const activeSheet = workbook.getActiveSheet();

    //         if (activeSheet.getSheetType() === window.tableau.SheetType.DASHBOARD) {

    //             const worksheets = activeSheet.getWorksheets();
    //             worksheets.forEach((worksheet) => {
    //             });
    //         } else if (activeSheet.getSheetType() === window.tableau.SheetType.WORKSHEET) {
    //         } else {
    //             console.warn('Unknown sheet type.');
    //         }
    //     } catch (error) {
    //         console.error('Error retrieving sheets:', error);
    //     }
    // };

    applyFilters = async () => {
        const { selected_filters } = this.props;

        if (!this.viz || !selected_filters || Object.keys(selected_filters).length === 0) {
            console.warn('Cannot apply filters: Missing Viz instance or filter parameters.');
            return;
        }

        try {
            const activeSheet = this.viz.getWorkbook().getActiveSheet();

            for (const [filterField, filterValues] of Object.entries(selected_filters)) {
                await activeSheet.applyFilterAsync(
                    filterField,
                    filterValues,
                    window.tableau.FilterUpdateType.REPLACE
                );
            }
        } catch (error) {
            console.error('Error applying filters:', error);
        }
    };

    disposeTableauViz = () => {
        if (this.viz) {
            this.viz.dispose();
            this.viz = null;
        }
    };

    render() {
        return (
            <div>
                <div ref={this.vizRef} style={{ width: '100%', height: '1000px' }} />
            </div>
        );
    }
}

export default TableauEmbed;
