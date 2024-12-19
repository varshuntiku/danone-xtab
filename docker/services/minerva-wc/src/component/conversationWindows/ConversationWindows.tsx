import { useCallback, useContext, useState } from "preact/hooks";
import ChatWindowItem from "./ChatWindowItem";
import { RootContext } from "../../context/rootContext";
import "./conversationWindows.scss";
import { IConversationWindow } from "../../model/ConversationWindow";
import ArrowBackIcon from "../../svg/ArrowBackIcon";
import AddIcon from "../../svg/AddIcon";

export default function ConversationWindows({closeConvoWindow = () => {}}) {
    const [search, setSearch] = useState('');
    const {queryService} = useContext(RootContext);

    const handleCreateNewChat = useCallback(() => {
        queryService.startNewChatWindow();
        closeConvoWindow()
    }, []);

    const handleWindowChange = (selectedWindow: IConversationWindow, close:boolean) => {
        if (close) {
            closeConvoWindow();
        }
        if (queryService.selectedWindowId.value !== selectedWindow.id && !queryService.loadingConversation.value) {
            queryService.changeChatWindow(selectedWindow.id);
        }
    };

    return (
        <div className="MinervaConvoWindows">
            <div className="MinervaConvoWindows-header">
                <button title="close" class="MinervaIconButton" onClick={closeConvoWindow}>
                    <ArrowBackIcon />
                </button>
                <p className="MinervaFont-2">
                    Conversations
                </p>
                <div style={{flex: 1}} />
            </div>

            <div className="MinervaConvoWindows-action">
                <button
                    class="MinervaConvoWindows-newchat-btn MinervaButton-outlined"
                    onClick={handleCreateNewChat}
                    aria-label="New chat"
                >
                    <AddIcon className="MinervaIconContrast"/>
                    New Chat
                </button>
            </div>
            <div className="MinervaConvoWindows-search">
                <input aria-label="search convo input" placeholder="Search..." value={search} onChange={(e:any) => setSearch(e.target.value)} />
            </div>
            <div className="MinervaConvoWindow-list-container">
                {queryService.conversationWindows.value?.filter((el) => {
                        if (search) {
                            return el?.title.toLowerCase().includes(search.toLowerCase());
                        } else return true;
                    })
                    .map((el) => (
                        <ChatWindowItem
                            key={el.id}
                            data={el}
                            selected={el.id === queryService.selectedWindowId.value}
                            onSelect={(close) => handleWindowChange(el, close)}
                        />
                    ))}
            </div>
        </div>
    );
}

