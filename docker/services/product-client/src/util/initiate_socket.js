import io from 'socket.io-client';

let socket_product, socket_platform;
// let minerva_socket;

export default function initiate_socket_connect(user_email) {
    socket_product = io(import.meta.env['REACT_APP_SOCKET_IO'] + 'codx_product_notification', {
        path: '/ws/socket.io',
        transports: ['websocket'],
        auth: {
            user_email: user_email
        }
    });

    if (
        import.meta.env['REACT_APP_ENABLE_PLATFORM_PUSH'] &&
        import.meta.env['REACT_APP_ENABLE_PLATFORM_PUSH'] === 'true'
    ) {
        socket_platform = io(
            import.meta.env['REACT_APP_PLATFORM_SOCKET_IO'] + 'codx_platform_notification',
            { transports: ['websocket'] }
        );
    }

    // Todo: this socket connection might be redundant. check and remove later
    // if (import.meta.env['REACT_APP_ENABLE_MINERVA']) {
    //     minerva_socket = io(import.meta.env['REACT_APP_MINERVA_SOCKET_IO'] + 'minerva', {
    //         path: '/ws/socket.io',
    //         transports: ['websocket'],
    //         auth: {
    //             user_email: user_email
    //         }
    //     });
    // }
}

export function fetch_socket_connection() {
    let sockets = {
        socket_product: socket_product,
        socket_platform: socket_platform
    };
    // if (minerva_socket) {
    //     sockets['minerva_socket'] = minerva_socket;
    // }
    return { ...sockets };
}

/**
 * @param {'minerva_socket' | 'socket_platform' | 'socket_product'} socket_name
 * @returns {Socket}
 */
export function getSocket(socket_name) {
    let sockets = {
        socket_product: socket_product,
        socket_platform: socket_platform
    };
    // if (minerva_socket) {
    //     sockets['minerva_socket'] = minerva_socket;
    // }
    return sockets[socket_name];
}
