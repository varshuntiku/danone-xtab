import { useContext, useEffect, useRef, useState } from "preact/hooks";
import "./queryInput.scss";
import { RootContext } from "../../context/rootContext";
import MicOn from '../../svg/MicOn';
import SendIcon from '../../svg/SendIcon';
import SuggestedQuery from '../suggestedQuery/SuggestedQuery';

import { ViewModeContext } from "../../context/viewModeContext";
import { SideWorkspaceContext } from "../../model/SideWorkspace";
import { QueryServiceEvents } from "../../model/Events";
import CustomTooltip from "../shared/tooltip/CustomTooltip";
import { Fragment } from "preact/jsx-runtime";
import  QueryInputDatasourceItem  from "./QueryInputDatasource";
import FileUploadIcon from "../../svg/FileUploadIcon";
import CustomSnackbar from "../shared/snackbar/CustomSnackbar";
import CloseIcon from "../../svg/CloseIcon";

import { StatusType } from "../../model/Query";
import MicOnMute from "../../svg/MicOnMute";
import TiltedSendIcon from "../../svg/TiltedSendIcon";
// import { makeQuery } from "../../service/queryService";
export default function QueryInput( ) {
    const [textQuery, setTextQuery] = useState( '' );
    const { queryService, input_placeholder, mainService } = useContext( RootContext );
    const [listening, setListening] = useState( false );
    const [isStopping, setIsStopping] = useState(false);
    const queriesList = queryService.queries.value
    const query = queriesList?.[queriesList?.length - 1]
    const [queryDatasource, setQueryDatasource] = useState<Array<File>>([])
    const [dragging, setDragging] = useState(false);
    const [snackbar, setSnackbar] = useState({open: false, message: '', variant: ''});
    const recognitionRef = useRef( null );
    const audioPlayer = useRef(null);
    const [inputMode, setInputMode] = useState("text")
    const [isProcessing, setIsProcessing] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const [isResponding, setIsResponding] = useState(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(()=>{
        if((query?.status === 'resolved' || query?.status === 'rejected') && isStopping){
            setIsStopping(false)
        }
    },[query?.status])


    useEffect(() => {
        let Window: any = window;
        const SpeechRecognition = Window.SpeechRecognition || Window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
        }
    }, []);

    useEffect(() => {
        if (!listening && textQuery.trim()) {
            handleSendQuery();
        }
        else if (listening) {
            startRecognition();
        }
    }, [listening]);

    useEffect(() => {
        if (query?.playing === false && inputMode == "voice") {
            setIsResponding(false);
            setListening(false);
            setIsWaiting(false);
            setIsProcessing(false);
        } else if (query?.playing === true && isProcessing && inputMode == "voice") {
            setIsProcessing(false);
            setIsResponding(true);
            setListening(false);
            setIsWaiting(false);
        }
        else if (query?.status === 'rejected' && isProcessing && inputMode == "voice") {
            setIsProcessing(false);
            setIsWaiting(true);
            setListening(true);
        }
        else if (inputMode == 'text' && (query?.status == 'resolved' || query?.status === 'rejected') && isProcessing) {
            setIsProcessing(false)
        }
    }, [query?.status, query?.playing]);

    const startRecognition = () => {
        if (recognitionRef.current) {
            const recognition = recognitionRef.current;
            recognition.onstart = () => setListening(true);
            recognition.onresult = (e) => {
                const transcript = e.results[0][0].transcript;
                setTextQuery((s) => s + ' ' + transcript);
            };
            recognition.onspeechstart = () => setIsWaiting(false);
            recognition.onend = () => {
                if (!isProcessing) {
                    setListening(false);
                    setIsWaiting(false);
                }
            };
            recognition.start();
        }
    };

    const handleSendQuery = () => {
        if ((textQuery.trim() || queryDatasource.length) && !queryService.stopQueryFetch.value) {
            const queryType = queryDatasource.length > 0 ? "file_input" : null
            setIsProcessing(true);
            queryService.makeQuery(textQuery.trim(), inputMode, queryType, '', queryDatasource);
            setTextQuery('');
            setQueryDatasource([])
        }
    };

    const handleVoiceMode = () =>{
        if(inputMode === "text"){
                setIsWaiting(true);
                setListening(true)
            }
        setInputMode("voice");
        handleVoiceToCommand()
   }



    const handleVoiceToCommand = () => {
        if ( listening ) {
            queryService.updateStopQueryFetch(false)
            recognitionRef.current?.stop();
            setListening(false);
            setIsWaiting(false);
            return;
        }
        if (inputMode === 'voice') {
            setIsWaiting(true);
            setListening(true);
        }
    };

    const handleStopQueryFetch = () =>{
        queryService.eventTarget.dispatchEvent(QueryServiceEvents.QUERY_INTERRUPTED)
        setIsStopping(true);
        if (inputMode === 'voice') {
            setListening(false);
            setIsWaiting(false);
        }
    }

    const handleQueryDatasourceInput = (inputFiles : FileList) => {
        // event.preventDefault();
        let total_files = queryDatasource ? [...queryDatasource, ...inputFiles] : [...inputFiles]

        if(total_files.length > mainService.inputConfig.value.max_files) {
            setSnackbar({ open: false, message: '' , variant: ''});
            setTimeout(() => {
            setSnackbar({
                open: true,
                message: `Maximum of ${mainService.inputConfig.value.max_files} files should be uploaded`,
                variant: 'error'
            });
        }, 100);
            return;
        }
        else if (total_files.some(file => file?.size > mainService.inputConfig.value.max_file_size * 1024 )) { //in bytes
            setSnackbar({ open: false, message: '', variant: '' });
            setTimeout(() => {
            setSnackbar({
                open: true,
                message: 'One or more files are too large',
                variant: 'error'
            })
            }, 100);
            return;
        }
        else if (inputFiles) {
            const set = new Set(total_files.map(file => file.name))
            if(total_files.length > set.size){
                setSnackbar({ open: false, message: '', variant:'' });
                setTimeout(() => {
                setSnackbar({
                    open: true,
                    message: 'File with same name already exists!',
                    variant: 'error'
                })
                }, 100);
                return;
            }
            setQueryDatasource(total_files);
        }
    };

    const handleRemoveQueryDatasource = (i: number) => {
        const datasourceInput = queryDatasource?.filter((_, index) => index != i)
        setQueryDatasource([...datasourceInput])

    }

    const handleDrag = (e) => {
        e.preventDefault();
         e.stopPropagation();
        if (e.type === 'dragover') {
            setDragging(true);
        } else if (e.type === 'dragleave' || e.type === 'drop') {
            setDragging(false);
        }
    };

    const handleDrop =(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false)
        let inputFiles = e.dataTransfer?.files
        if(!([...inputFiles].some(file => mainService?.inputConfig?.value.accepted_file_type?.includes('.'+file.name.split('.').at(-1))))){
                setSnackbar({ open: false, message: '', variant:'' });
                setTimeout(() => {
                setSnackbar({
                    open: true,
                    message: 'You are trying to upload Unsupported file',
                    variant: 'error'
                })
                }, 100);
                return;
        }
        handleQueryDatasourceInput(e.dataTransfer?.files)
    }

    const stopResponse = () => {
      if (audioPlayer?.current) {
        audioPlayer.current.pause();
        audioPlayer.current.src = null;
      }
      queryService.updateStopQueryFetch(false);
      if (query?.id) {
        queryService.updateQuery(query.id, { playing: false, status: StatusType.resolved, interrupted: true, progress_message: "" });
      }
    };

    const switchToTextInput = async () => {
        setInputMode('text');

        if (isProcessing && queryService?.stopQueryFetch.value) {
            handleStopQueryFetch();
        }
        else if (isResponding) {
            stopResponse();
        }

        setListening(false);
        setIsWaiting(false);
        setIsResponding(false);

    };

    const handleQueryInput = (e: any) => {
        const textarea = textAreaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
        setTextQuery(e.target.value)
    }

    useEffect(() => {
        const textarea = textAreaRef.current;
        if (textarea && textQuery) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    },[inputMode])

    return (
        <div className="MinervaQueryInput"
            id="drop-zone"
            onDrop={handleDrop}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
        >
            <audio id="audio-player" ref={audioPlayer}></audio>
            {queryService?.queries.value.length ?
                null
                : <SuggestedQuery />}
            <div
            >
                {dragging  && (queryDatasource?.length < mainService.inputConfig.value.max_files) && inputMode === "text" ?
                <div className=" MinervaQueryInput-datasource MinervaQueryInput-dropbox-wrapper"
                    onDrop={handleDrop}
                >
                    <div className="MinervaQueryInput-dropbox">
                        <p>Drag and drop your files here</p>
                        <p>You can add a maximum of {mainService.inputConfig?.value.max_files} files</p>
                    </div>
                </div> : null}
                {(queryDatasource?.length && inputMode === "text" && (!dragging || (queryDatasource?.length >= mainService.inputConfig.value.max_files))) ? <div className="MinervaQueryInput-datasource">
                    <QueryInputDatasourceItem queryDatasourceList={queryDatasource} removeDatasource={handleRemoveQueryDatasource} allowFileRemove={true} enablePreview={true} />
                    <p className="MinervaQueryInput-filelimit">{queryDatasource?.length}{queryDatasource?.length == 1 ? ' file' : ' files'} uploaded. Maximum limit {queryDatasource?.length == mainService.inputConfig?.value.max_files ? 'reached' : `${mainService.inputConfig?.value.max_files} files`}</p>
                </div> : null
                }

                {inputMode === "text" &&<form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if(!queryService.stopQueryFetch.value && !isStopping) {
                            handleSendQuery();
                        }
                    }}
                >
                    <textarea
                        value={textQuery}
                        aria-label="query input"
                        placeholder={input_placeholder || 'Type your query...'}
                        onInput={(e:any) => handleQueryInput(e)}
                        ref={textAreaRef}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                if (e.shiftKey) {
                                    return;
                                }
                                e.preventDefault();
                                if(!queryService.stopQueryFetch.value && !isStopping) {
                                    handleSendQuery();
                                }
                            }
                        }}
                        // rows={2}
                    />

                    {!queryService.stopQueryFetch.value && !isStopping ?
                        <div className="MinervaQueryInput-icon-wrapper">
                            {mainService?.enableFileInput?.value ? (
                                <Fragment>
                                    <input
                                        id="upload-query-datasource"
                                        type="file"
                                        multiple
                                        style={{ display: 'none' }}
                                        onChange={(e)=>handleQueryDatasourceInput((e.target as HTMLInputElement)?.files)}
                                        disabled={(queryDatasource?.length >= mainService.inputConfig?.value.max_files)}
                                        accept={mainService.inputConfig.value.accepted_file_type.join(", ")}
                                        data-testid="file-input"
                                    />
                                    <label htmlFor="upload-query-datasource">
                                        <CustomTooltip
                                            content={queryDatasource?.length >= mainService.inputConfig?.value?.max_files?
                                                "You have reached maximum limit" :
                                                `You can upload maximum of ${mainService.inputConfig?.value?.max_files} ${mainService.inputConfig?.value?.max_files == 1? 'file' : 'files'}`}
                                            placement="top" arrow={true}
                                        >
                                            <span type="span" class="MinervaIconButton" disabled={(queryDatasource?.length >= mainService.inputConfig?.value.max_files)}>
                                                <FileUploadIcon class="MinervaQueryInput-icon" />
                                            </span>
                                        </CustomTooltip>
                                    </label>
                                </Fragment>
                            ) : null}
                            <button class="MinervaIconButton" type="button" title="Use microphone" onClick={handleVoiceMode}>
                                <MicOn class="MinervaQueryInput-icon" />
                            </button>
                            {(!textQuery && !queryDatasource?.length) ? <button class="MinervaIconButton" title="send" disabled={!textQuery && !queryDatasource?.length} type="submit">
                                <SendIcon class="MinervaQueryInput-icon" />
                            </button>: <button class="MinervaIconButton MinervaIconButton-tilted" title="send" type="submit">
                                <TiltedSendIcon class="MinervaQueryInput-icon" />
                            </button>}
                        </div>
                        : null}

                    {isStopping ? <p className="MinervaQueryInput-stopText">Stopping...</p> : (queryService.stopQueryFetch.value ? <StopIcon handleStopQueryFetch={handleStopQueryFetch} /> : null)}
                </form>}
                {
                    inputMode === "voice" && <div className="MinervaVoiceButtonsController-wrapper">
                    <>
                        {isResponding && (
                            <div className="MinervaVoiceIcon">
                                <button className="MinervaVoiceIconButton" type="button" title="Stop Responding" onClick={stopResponse}>
                                    <RespondingGif />
                                </button>
                            </div>
                        )}

                        {(isWaiting || listening) && (
                            <div className="MinervaVoiceIcon">
                                <button className="MinervaVoiceIconButton" type="button" title={isWaiting ? 'Waiting' : 'Listening'} onClick={handleVoiceToCommand}>
                                    <ListeningGif/>
                                </button>
                            </div>
                        )}

                        {!listening && !queryService.stopQueryFetch.value && !isResponding && !isProcessing && (
                            <div className="MinervaVoiceIcon">
                                <button className="MinervaVoiceIconButton" type="button" title="Tap to start" onClick={handleVoiceToCommand}>
                                    <MicOnmute />
                                </button>
                            </div>
                        )}

                        {isProcessing && (
                            <div className="MinervaVoiceIcon">
                                <button className="MinervaVoiceIconButton" type="button" title="Stop" onClick={handleStopQueryFetch}>
                                    <ProcessingGif />
                                </button>
                            </div>
                        )}
                    </>
                    <button className="MinervaIconButton MinervaVoiceButtonsController-cross-button " title="Switch to Text" onClick={switchToTextInput}>
                        <CloseIcon />
                    </button>
                </div>
                }
            </div>
            <CustomSnackbar message={snackbar?.message} open={snackbar?.open} autoHideDuration={3000} showCloseButton={true} variant={snackbar?.variant} />
        </div>
    );
}

const StopIcon = ({handleStopQueryFetch}) => {
    return (
        <button title='Stop' className="MinervaQueryInput-stopIcon" onClick={handleStopQueryFetch} type="button">
            <div className="MinervaQueryInput-stopIcon-outer">
                <div className="MinervaQueryInput-stopIcon-inner"></div>
            </div>
        </button>
    )
}

const RespondingGif = () => {
    return (
        <>
            <div className="MinervaQueryInput-outer">
                <div className="MinervaQueryInput-vui-state-responding"></div>
            </div>
            <p>Tap to interrupt</p>
        </>
    );
};

const ProcessingGif = () => {
    return (
        <>

            <div className="MinervaQueryInput-outer">
                <div className="MinervaQueryInput-vui-state-processing"></div>
            </div>
            <p>Processing</p>

        </>
    );
};
const ListeningGif = () => {
    return (
        <>

            <div className="MinervaQueryInput-outer">
                <div className="MinervaQueryInput-vui-state-listening"></div>
            </div>
            <p>Listening to you...</p>

        </>
    );
};

const MicOnmute = () => {
    return (
        <>
            <div className="MinervaQueryInput-outer-onMute">
                <MicOnMute/>
            </div>
            <p>Tap to try</p>
        </>
    );
};