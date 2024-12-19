import React, { lazy, useEffect, useState } from 'react';
import { IconButton, List, ListItem, Typography, makeStyles } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import { useSelector } from 'react-redux';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
const FileGallery = lazy(() => import('./FileGallery'));

const useStyles = makeStyles((theme) => ({
    navigationContainer: {
        display: 'flex',
        flexDirection: 'row',
        padding: '1rem'
    },
    backBtn: {
        padding: '0rem'
    },
    breadcrumbNavigation: {
        color: theme.palette.text.default,
        alignSelf: 'center',
        fontSize: '2.3rem',
        letterSpacing: '0.5px'
    },
    directoryItems: {
        color: theme.palette.text.default,
        borderTop: '1px solid rgba(151, 151, 151, 0.4)',
        fontSize: '3.2rem',
        letterSpacing: '1px',
        gridGap: '1.5rem',
        paddingTop: '3rem',
        paddingBottom: '3rem'
    },
    folderIcon: {
        fontSize: '5rem',
        fill: '#FAD02C'
    },
    listContainer: {
        maxHeight: 'calc(100vh - 50rem)',
        overflowY: 'scroll'
    },
    noDocuments: {
        fontSize: ' 3rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.text.default,
        height: 'calc(100vh - 72rem)'
    },
    directoryInfo: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        fontWeight: 450,
        '& span': {
            fontSize: '2.3rem',
            fontWeight: 350
        }
    },
    directoryTimestamp: {
        fontSize: '2.3rem'
    }
}));

export default function FileExplorer({ params, fetchDirectory, onDirectoryUpdate }) {
    const classes = useStyles();

    const [directoryList, setDirectoryList] = useState([]);
    const [currentPath, setCurrentPath] = useState(params?.selectedDirectory || '/');
    const [currentDirectory, setCurrentDirectory] = useState([]);
    const [folderData, setFolderData] = useState([]);
    const [fileData, setFileData] = useState([]);

    const directoryData = useSelector((s) => s.directoryData);

    useEffect(() => {
        const rootDir = [
            {
                name: 'root',
                prefix: null,
                type: 'folder',
                directory: params?.directory || []
            }
        ];
        setDirectoryList(rootDir);
        setCurrentDirectory(params?.directory);
    }, [params?.directory]);

    useEffect(() => {
        const folderItem = [];
        const fileItem = [];
        currentDirectory?.filter((item) => {
            if (item.type === 'folder') {
                folderItem.push(item);
            } else if (item.type === 'file') {
                fileItem.push(item);
            }
        });

        setFolderData(folderItem);
        setFileData(fileItem);
    }, [currentDirectory]);

    useEffect(() => {
        if (directoryData?.updatedStorageUrl === params?.blob_root_url + params?.container_name) {
            setDirectoryList([]);
            setCurrentDirectory([]);
            setFolderData([]);
            setFileData([]);
            const payload = {
                selected_directory_path: currentPath
            };
            getUpdatedData(payload);
        }
    }, [directoryData]);

    const getUpdatedData = async (payload) => {
        const updatedDirectoryList = [];

        const res = await onDirectoryUpdate(null, payload);

        const updatedPath = getDirectoryHierarchyPath(payload['selected_directory_path']);
        const updatedDirectory = updatedPath[updatedPath.length - 1];

        if (currentPath !== res?.selectedDirectory) {
            const prevPath = getDirectoryHierarchyPath(currentPath);
            const prevActiveDirectory = prevPath[prevPath.length - 1];
            const prevDirectory = res?.directory?.find((item) => item.name === prevActiveDirectory);
            if (prevDirectory) prevDirectory['directory'] = currentDirectory;
        }

        if (updatedDirectory) {
            const activeDirectoryData = {
                name: updatedDirectory,
                type: 'folder',
                prefix: res.selectedDirectory,
                directory: [...(res?.directory || [])]
            };
            updatedDirectoryList.push(activeDirectoryData);
            setDirectoryList([
                {
                    directory: updatedDirectoryList
                }
            ]);
        } else {
            const activeDirectoryData = {
                name: 'root',
                type: 'folder',
                prefix: res.selectedDirectory,
                directory: [...(res?.directory || [])]
            };
            updatedDirectoryList.push(activeDirectoryData);
            setDirectoryList(updatedDirectoryList);
        }
        setCurrentPath(res?.selectedDirectory);
        setCurrentDirectory(res?.directory);
    };

    const getDirectoryHierarchyPath = (strPath) => {
        return strPath?.split('/').filter((element) => element);
    };

    const handleFolderClick = async (selected) => {
        if (selected.type === 'folder') {
            const selectedPath =
                selected.prefix + (selected.prefix === '/' ? '' : '/') + selected.name;
            const payload = {
                selected_directory_path: selectedPath,
                current_directory: currentDirectory
            };
            fetchFolderData(selected, payload);
        }
    };

    const fetchFolderData = async (selected, payload) => {
        if (!selected.directory) {
            const resp = await fetchDirectory(params.validator, payload);

            const newDirectoryPath = resp?.selectedDirectory + '/';
            const updateDirectories = updateDirectoryData(directoryList, selected, resp?.directory);

            setDirectoryList(updateDirectories);
            setCurrentDirectory(resp?.directory);
            setCurrentPath(newDirectoryPath);
        } else {
            const newDirectoryPath =
                selected.prefix + (selected.prefix === '/' ? '' : '/') + selected.name;

            setCurrentPath(newDirectoryPath);
            setCurrentDirectory(selected?.directory);
        }
    };

    const handleExplorerNavigation = () => {
        const directoryItems = directoryList[0].directory || directoryList;
        const updatedPathList = getDirectoryHierarchyPath(currentPath).slice(0, -1);
        let updatedPath = updatedPathList.join('/');
        updatedPath = updatedPath.startsWith('/') ? updatedPath : '/'.concat(updatedPath);

        if (updatedPathList.length === 0) {
            const goToDirectory = directoryList.find((item) => item.name === 'root');
            if (goToDirectory?.directory) {
                setCurrentPath('/');
                setCurrentDirectory(goToDirectory.directory);
            } else {
                getUpdatedData({
                    selected_directory_path: updatedPath
                });
            }
        } else {
            const goToDirectory = directoryItems.find(
                (item) => item.name === updatedPathList[updatedPathList.length - 1]
            );

            if (goToDirectory?.directory) {
                setCurrentPath(updatedPath);
                setCurrentDirectory(goToDirectory.directory);
            } else {
                getUpdatedData({
                    selected_directory_path: updatedPath
                });
            }
        }
    };

    return (
        <React.Fragment>
            <div id="explorer-navigator" className={classes.navigationContainer}>
                {currentPath && currentPath !== '/' ? (
                    <React.Fragment>
                        <IconButton
                            onClick={handleExplorerNavigation}
                            disabled={!currentPath}
                            className={classes.backBtn}
                        >
                            <ArrowBackIcon fontSize="large" style={{ fontSize: '3rem' }} />
                        </IconButton>
                        <Typography variant="h4" className={classes.breadcrumbNavigation}>
                            {currentPath
                                .split('/')
                                .filter((element) => element)
                                .join(' > ')}
                        </Typography>
                    </React.Fragment>
                ) : (
                    <Typography variant="h4" className={classes.breadcrumbNavigation}>
                        {params?.defaultLabel || 'Documents'}
                    </Typography>
                )}
            </div>
            <List className={classes.listContainer}>
                {folderData?.map((item) => {
                    return (
                        <FolderItem
                            key={item.name}
                            classes={classes}
                            item={item}
                            handleClickHandler={() => {
                                handleFolderClick(item);
                            }}
                        />
                    );
                })}
                {fileData?.length > 0 && (
                    <FileGallery
                        params={{ filesList: fileData, totalItems: fileData?.length + 'items' }}
                    />
                )}
                {folderData.length === 0 && fileData.length === 0 && (
                    <Typography variant="h4" className={classes.noDocuments}>
                        You have no documents!
                        <span>click to upload new image</span>
                    </Typography>
                )}
            </List>
        </React.Fragment>
    );
}

const FolderItem = ({ classes, item, handleClickHandler }) => {
    return (
        <ListItem className={classes.directoryItems} onClick={handleClickHandler}>
            <FolderIcon fontSize="large" className={classes.folderIcon} />
            <Typography variant="h3" className={classes.directoryInfo}>
                {item.name}
                <span>{item.info}</span>
            </Typography>
            <Typography variant="h4" className={classes.directoryTimestamp}>
                {item.updated_at}
            </Typography>
        </ListItem>
    );
};

const updateDirectoryData = (data, selectedItem, updatedData) => {
    return data?.map((item) => {
        if (!item.directory && selectedItem.name === item.name) {
            item['directory'] = updatedData;
            return item;
        } else if (!item.directory && selectedItem.name !== item.name) {
            return item;
        } else if (item.directory) {
            const itemDirectory = updateDirectoryData(item.directory, selectedItem, updatedData);
            return { ...item, directory: itemDirectory };
        }
    });
};
