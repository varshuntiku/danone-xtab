import { useContext, useEffect, useRef, useState } from "preact/hooks";
import QueryOutputItem from "./queryOutputItem/QueryOutputItem";
import "./queryOutput.scss";
import { RootContext } from "../../context/rootContext";
import LoadMore from "../shared/loadMore/LoadMore";
import WavingHand from "../../svg/WavingHand";
import MinervaAvatarIcon from "../../svg/MinervaAvatarIcon";
import Skeleton from "../shared/skeleton/Skeleton";
import { ViewModeContext } from "../../context/viewModeContext";
import { QueryServiceEvents } from "../../model/Events";

const SCROLL_OFFSET = 200;

export default function QueryOutput({ chatPopperView = false }) {
  const {
    mainService,
    queryService,
    empty_state_message_greet,
    empty_state_message_desc,
    emptyStateIcon,
    emptyStateComponent,
    minerva_avatar_url,
  } = useContext(RootContext);
  const { popper } = useContext(ViewModeContext);

  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const chatWindowRef = useRef(null);

  useEffect(() => {
      setShowScrollBtn(false)
  },[queryService.selectedWindowId.value])

  useEffect(() => {
    const handleScroll = () => {
      if (chatWindowRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatWindowRef.current;
        const hiddenContent = scrollHeight - (scrollTop + clientHeight) >= SCROLL_OFFSET;
        setShowScrollBtn(hiddenContent);
      }
    };

    if (chatWindowRef.current) {
      chatWindowRef.current.addEventListener("scroll", handleScroll);
      return () => {
        chatWindowRef.current.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  useEffect(() => {

    const handleNavigateToQuery = (e) => {
      requestAnimationFrame(() => {
          const id = e.detail?.id + "_minerva_result_output";
          scrollToView(id);
        });

    }

    queryService.eventTarget.addEventListener(QueryServiceEvents.JUMP_TO_QUERY, handleNavigateToQuery)

    return () => {
      queryService.eventTarget.removeEventListener(QueryServiceEvents.JUMP_TO_QUERY, handleNavigateToQuery)
    }
  },[])

  const handleScrollToBottom = () => {
    chatWindowRef.current.scrollTo({
      top:
        chatWindowRef.current.scrollHeight +
        parseInt(window.getComputedStyle(chatWindowRef.current).paddingBottom),
      behavior: "smooth",
    });
  };

  const scrollToView = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleScroll = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = chatWindowRef.current;
      const atBottom = scrollHeight - (scrollTop + clientHeight) < SCROLL_OFFSET;
      if (atBottom) {
        requestAnimationFrame(() => {
          chatWindowRef.current?.scrollTo({
            top: chatWindowRef.current.scrollHeight,
            // behavior: "smooth",
          });
        });
      }
    };

    queryService.eventTarget.addEventListener(
      QueryServiceEvents.QUERY_RESPONSE_STREAMING_START,
      handleScroll
    );
    queryService.eventTarget.addEventListener(
      QueryServiceEvents.QUERY_RESPONSE_STREAMING,
      handleScroll
    );
    queryService.eventTarget.addEventListener(
      QueryServiceEvents.QUERY_RESPONSE_STREAMING_END,
      handleScroll
    );

    return () => {
      queryService.eventTarget.removeEventListener(
        QueryServiceEvents.QUERY_RESPONSE_STREAMING_START,
        handleScroll
      );
      queryService.eventTarget.removeEventListener(
        QueryServiceEvents.QUERY_RESPONSE_STREAMING,
        handleScroll
      );
      queryService.eventTarget.removeEventListener(
        QueryServiceEvents.QUERY_RESPONSE_STREAMING_END,
        handleScroll
      );
    };
  }, []);


  return (
    <div
      className={`MinervaQueryOutput ${
        chatPopperView ? "MinervaQueryOutput-popped" : ""
      }`}
      aria-label={chatPopperView ? "chat popper on" : "chat popper off"}
      ref={chatWindowRef}
      id="output-container"
    >
      {queryService.queries.value?.length ||
      queryService.loadingConversation.value ? null : emptyStateComponent ? (
        emptyStateComponent
      ) : (
        <EmptyState
          popper={popper}
          greet_msg={empty_state_message_greet}
          desc_msg={empty_state_message_desc}
          icon={emptyStateIcon}
          iconUrl={minerva_avatar_url}
          isAppDetailsLoading={
            mainService.loadingCopilotAppDetails.value ||
            mainService.loadingConsumerDetails.value
          }
        />
      )}
      <div className="MinervaQueryOutput-loadmore">
        <LoadMore />
      </div>
      {showScrollBtn ? (
        <button
          className="MinervaQueryOutput-scrollbtn MinervaFadeInAnimation"
          style={{ "--duration": "0.5s" }}
          onClick={() => handleScrollToBottom()}
        ></button>
      ) : null}
      {queryService.queries.value?.map((query) => (
        <QueryOutputItem
          key={query.query_trace_id || query.id}
          query={query}
          chatPopperView={chatPopperView}
        />
      ))}
    </div>
  );
}

function EmptyState({
  popper,
  greet_msg = "",
  desc_msg = "",
  icon = null,
  iconUrl = "",
  isAppDetailsLoading = false,
}) {
  const renderIcon =
    icon ||
    (iconUrl ? (
      <img
        src={iconUrl}
        alt="avatar"
        className="MinervaQueryOutput-emptystate-avatar"
      />
    ) : (
      <MinervaAvatarIcon className="MinervaQueryOutput-emptystate-avatar" />
    ));

  const renderIconWithSkeleton = isAppDetailsLoading ? (
    <div className="MinervaQueryOutput-emptystate-avatar">
      <Skeleton height={8} />
    </div>
  ) : (
    renderIcon
  );

  return (
    <div
      className={`MinervaQueryOutput-emptystate ${
        popper ? "" : " MinervaFadeInAnimation"
      }`}
      aria-label="empty state"
    >
      <div className="MinervaQueryOutput-emptystate-greet MinervaFont-2">
        <WavingHand />
        <span> {greet_msg || "Hey"}</span>
      </div>
      {/* {renderIconWithSkeleton} */}
      {isAppDetailsLoading ? (
        <div className="MinervaQueryOutput-emptystate-skeleton-wrapper">
          <Skeleton height={2} typography={true} />
          <Skeleton height={2} typography={true} />
        </div>
      ) : (
        <p>
          {desc_msg ||
            "Welcome to the world of AI Analytics! How can we assist you in unraveling the mysteries hidden within your data today?"}
        </p>
      )}
    </div>
  );
}
