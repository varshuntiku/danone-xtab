import React, { useContext, useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Card
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import CloseIcon from 'assets/Icons/CloseBtn';
import { StyledTableCell, StyledTableRow } from '../../Styles/ExecutionEnvStyles';
import ExecutionEnvironmentContext from '../../context/ExecutionEnvironmentContext';
import clsx from 'clsx';
import BrowseEnvTypes from './BrowseEnvTypes';

function BrowseEnvironments(props) {
    const execEnvContext = useContext(ExecutionEnvironmentContext);
    const { updateContext } = execEnvContext;
    const execEnvContextData = execEnvContext.data;
    const { browseEnv, createNewEnv } = execEnvContextData;
    const { envTypes } = browseEnv;
    const createNewEnvTypes = createNewEnv.envTypes;
    const createNewEnvCurrentEnv = createNewEnvTypes.currentEnv;
    const { classes } = props;
    const [envLists, setEnvLists] = useState([]);
    const [currentEnvLists, setCurrentEnvLists] = useState([]);
    const [packageLists, setPackageLists] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedEnv, setSelectedEnv] = useState({});
    const [selectedId, setSelectedId] = useState(browseEnv.defaultEnv?.id || 0);
    const [disableCloneBtn, setDisableCloneBtn] = useState(true);

    const computeTypes = {
        shared_env: 'shared',
        dedicated_env: 'dedicated',
        all_env: 'all'
    };

    useEffect(() => {
        const currentEnvType = computeTypes[envTypes.currentEnv];
        let envList = [];
        if (currentEnvType === 'all') {
            envList = execEnvContextData.dynamicExecEnvs;
        } else {
            execEnvContextData.dynamicExecEnvs.forEach((item) => {
                if (item.compute_type === currentEnvType) {
                    envList.push(item);
                }
            });
        }

        setEnvLists(envList);
        setCurrentEnvLists(envList);
        setSearch('');
        if (envList.length > 0) {
            setSelectedId(envList[0].id);
            updateContext({
                browseEnv: {
                    ...browseEnv,
                    defaultEnv: envList[0]
                }
            });
            setSelectedEnv(envList[0]);
            setDisableCloneBtn(false);
        } else {
            setSelectedEnv({});
            setDisableCloneBtn(true);
        }
    }, [envTypes.currentEnv]);

    useEffect(() => {
        setPackageLists(selectedEnv.packages || []);
    }, [envLists]);

    const closeBrowseEnv = () => {
        updateContext({
            showBrowseEnv: false
        });
    };

    const onEnvCardClicked = (el) => {
        const itemId = el.target.getAttribute('itemId');
        let clickedItem;
        execEnvContextData.dynamicExecEnvs.forEach((item) => {
            if (item.id === +itemId) {
                clickedItem = item;
                setSelectedId(itemId);
            }
        });
        setPackageLists(clickedItem.packages);
        setSelectedEnv(clickedItem);
        setDisableCloneBtn(false);
        updateContext({
            browseEnv: {
                ...browseEnv,
                defaultEnv: clickedItem
            }
        });
    };

    const handleSearch = (searchValue) => {
        searchValue = searchValue.trim();
        const searchEnvList = [];
        currentEnvLists.forEach((item) => {
            if (item.name.toLowerCase().indexOf(searchValue) !== -1) {
                searchEnvList.push(item);
            }
        });
        setEnvLists(searchEnvList);
        if (searchEnvList.length > 0) {
            setSelectedEnv(searchEnvList[0]);
            setPackageLists(searchEnvList[0].packages);
            setSelectedId(searchEnvList[0].id);
            setDisableCloneBtn(false);
        } else {
            setSelectedEnv({});
            setPackageLists([]);
            setDisableCloneBtn(true);
        }
    };

    const cloneConfiguration = () => {
        const envTypes = {
            ...createNewEnvTypes,
            [createNewEnvCurrentEnv]: {
                ...createNewEnvTypes[createNewEnvCurrentEnv],
                disableCreateEnvBtn: true,
                envName: ''
            }
        };
        const browseEnvTypes = {
            ...browseEnv.envTypes,
            [createNewEnvCurrentEnv]: {
                ...browseEnv.envTypes[createNewEnvCurrentEnv],
                cloneConfig: true,
                name: selectedEnv.name,
                packageLists: selectedEnv.packages
            }
        };

        updateContext({
            showBrowseEnv: false,
            createNewEnv: {
                ...createNewEnv,
                envTypes: {
                    ...envTypes
                }
            },
            browseEnv: {
                ...browseEnv,
                defaultEnv: selectedEnv,
                envTypes: {
                    ...browseEnvTypes
                }
            }
        });
    };

    return (
        <React.Fragment>
            <Dialog
                open={execEnvContextData.showBrowseEnv}
                fullWidth
                classes={{ paper: classes.browseEnvPaper }}
                maxWidth="md"
                aria-labelledby="visualization-execution-env"
                aria-describedby="environment-content"
            >
                <DialogTitle
                    className={classes.title}
                    disableTypography
                    id="visualization-execution-env"
                >
                    <Typography variant="h4" className={classes.heading}>
                        {'Browse Environments'}
                    </Typography>
                    <IconButton
                        title="Close"
                        onClick={closeBrowseEnv}
                        className={classes.closeIcon}
                        aria-label="Close"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <hr className={classes.sepratorline} />
                <DialogContent
                    id="environment-content"
                    className={clsx(classes.dialogContent, classes.browseEnvDialog)}
                >
                    <div className={clsx(classes.main, classes.browseEnvSideBarContainer)}>
                        <TextField
                            variant="outlined"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                handleSearch(e.target.value);
                            }}
                            InputProps={{
                                startAdornment: <Search />
                            }}
                            className={classes.searchField}
                        />
                        <Typography variant="h4">Environment Type</Typography>
                        <BrowseEnvTypes props={props} classes={classes} />
                        <Typography
                            variant="h4"
                            style={{ marginTop: '2rem' }}
                        >{`Showing results for "Projects"`}</Typography>
                        <ul className={classes.list}>
                            {envLists.map((item, index) => {
                                return (
                                    <Card
                                        elevation={0}
                                        component={'li'}
                                        key={index}
                                        onClick={(el) => onEnvCardClicked(el)}
                                        itemId={item.id}
                                        className={clsx(
                                            classes.listItem,
                                            item.id === +selectedId ? classes.selectedListItem : ''
                                        )}
                                    >
                                        <Typography itemId={item.id} variant="body1">
                                            {item.name}
                                        </Typography>
                                    </Card>
                                );
                            })}
                        </ul>
                    </div>
                    <div className={classes.browseEnvDetailsContainer}>
                        <Typography variant="h3">Environment Details</Typography>
                        <hr className={classes.borderLine} />
                        <div className={classes.browseEnvDetailsSubContainer}>
                            <Typography variant="h4">
                                Environment Type : <b>{`${selectedEnv.name || ''}`}</b>
                            </Typography>
                            <Typography variant="h4">
                                Environment Name : <b>{selectedEnv.name || ''}</b>
                            </Typography>
                            <Typography variant="h4">
                                Replicas : <b>{selectedEnv.replicas || ''}</b>
                            </Typography>
                            <div>
                                <Typography variant="h4">
                                    Run Time : <b>{selectedEnv.runTime || ''}</b>
                                </Typography>
                                <Typography variant="h4">
                                    Run Time Version : <b>{selectedEnv.runTimeVersion || ''}</b>
                                </Typography>
                            </div>
                            <Typography variant="h4">
                                Index URL : <b>{selectedEnv.indexUrl || ''}</b>
                            </Typography>
                            <Typography variant="h4">Packages :</Typography>
                            <TableContainer component={Paper} className={classes.tableContainer}>
                                <Table stickyHeader aria-label="caption table" id="packageTable">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell className={classes.halfWidth}>
                                                Package Name
                                            </StyledTableCell>
                                            <StyledTableCell>Version</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {packageLists.map((row) => (
                                            <StyledTableRow key={row.name}>
                                                <StyledTableCell>{row.name}</StyledTableCell>
                                                <StyledTableCell>{row.version}</StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </DialogContent>

                <DialogActions className={clsx(classes.dialogAction, classes.customDialogAction)}>
                    <div>
                        <Button
                            className={classes.btn}
                            variant="outlined"
                            onClick={closeBrowseEnv}
                            aria-label="Cancel"
                        >
                            Cancel
                        </Button>
                        <Button
                            className={classes.btn}
                            variant="contained"
                            onClick={cloneConfiguration}
                            aria-label="clone_config_btn"
                            disabled={disableCloneBtn}
                        >
                            {'Clone Configuration'}
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default BrowseEnvironments;
