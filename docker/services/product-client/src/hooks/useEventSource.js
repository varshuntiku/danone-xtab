import { useEffect, useRef } from 'react';
import eventSourceClient from 'services/eventSource/eventSourceClient';

let intervalTimer;

const useEventSource = () => {
    const controllerRef = useRef(null);
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, []);

    const connect = (url, { onMessage, onError, onFreeze = null, interval = 60000 }) => {
        const onMessageHandler = (e) => {
            setOnFreeze();
            onMessage(e);
        };

        const setOnFreeze = () => {
            if (onFreeze) {
                if (intervalTimer) {
                    clearInterval(intervalTimer);
                }
                intervalTimer = setInterval(onFreeze, interval);
            }
        };

        controllerRef.current = new AbortController();
        eventSourceClient(url, {
            isSignal: true,
            onMessage: onMessageHandler,
            signal: controllerRef.current.signal,
            forceInterval: 5000,
            onError
        });
        setOnFreeze();
    };

    const disconnect = () => {
        if (intervalTimer) {
            clearInterval(intervalTimer);
        }
        if (controllerRef.current) {
            controllerRef.current.abort();
            controllerRef.current = null;
        }
    };

    return { connect, disconnect };
};

export default useEventSource;
