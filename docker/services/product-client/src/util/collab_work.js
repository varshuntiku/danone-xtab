import { fetch_socket_connection } from './initiate_socket';

const collab_info = {};

let socket = null;

export function init_codx_collab({
    key = '',
    user_email = '',
    user_first_name = '',
    user_last_name = '',
    onToken = () => {},
    onParticipants = () => {},
    getState = () => {},
    onStateChange = () => {}
}) {
    const socketConnection = fetch_socket_connection();
    socket = socketConnection['socket_product'];
    socket?.emit('init:codx_collab', {
        key: key,
        user_email: user_email,
        user_first_name: user_first_name,
        user_last_name: user_last_name
    });

    let token = null;
    let session_initiated_at = 0;
    let participants = {};

    socket?.on('token:codx_collab#' + key, (data) => {
        token = data.token;
        session_initiated_at = data.session_initiated_at;
        collab_info[key] = {
            token,
            session_initiated_at
        };
        onToken(token, session_initiated_at);

        socket?.on('syn:codx_collab#' + key, (data) => {
            const state = getState();
            socket?.emit('ack:codx_collab', {
                to: data.source_token,
                token: token,
                state: state
            });
            participants[data.from.sid] = data.from;
            onParticipants(Object.values(participants));
        });

        socket?.on('ack:codx_collab#' + key, (data) => {
            if (data.session_initiated_at <= session_initiated_at) {
                session_initiated_at = data.session_initiated_at;
                token = data.token;
                collab_info[key] = {
                    token,
                    session_initiated_at
                };
                onToken(token, session_initiated_at);
                onStateChange(data.state);
                participants[data.from.sid] = data.from;
                onParticipants(Object.values(participants));
            }
        });
    });

    socket?.on('edit:codx_collab#' + key, (data) => {
        if (data.session_initiated_at <= session_initiated_at) {
            onStateChange(data.state);
            participants[data.from.sid] = data.from;
            onParticipants(Object.values(participants));
        }
    });

    socket?.on('stop:codx_collab#' + key, (data) => {
        delete participants[data.from.sid];
        onParticipants(Object.values(participants));
    });
}

export function stop_codx_collab(key) {
    socket?.removeListener('token:codx_collab#' + key);
    socket?.removeListener('syn:codx_collab#' + key);
    socket?.removeListener('ack:codx_collab#' + key);
    socket?.removeListener('edit:codx_collab#' + key);
    socket?.removeListener('stop:codx_collab#' + key);
    const token = collab_info[key]?.token;
    if (token) {
        socket?.emit('stop:codx_collab', {
            token: token
        });
    }
    delete collab_info[key];
}

export function emit_change_codx_collab(key, state) {
    const token = collab_info[key]?.token;
    if (token) {
        socket?.emit('edit:codx_collab', {
            token: token,
            state: state
        });
    }
}
