// // import io from 'socket.io-client';

// export function setupSocketConn(url = "", authToken = "", accessKey = "") {
//     if (url.endsWith("/")) {
//         url = url.slice(0, url.length - 1);
//     }
//     if(url.startsWith("https://")) {
//         url = url.substring(5)
//         url = "wss"+url;
//     } else if (url.startsWith("http")) {
//         url = url.substring(4);
//         url = "ws"+url;
//     }

//     url = url+"/minerva";
//     // return io(url, {
//     //     path: '/ws/socket.io',
//     //     transports: ['websocket'],
//     //     auth: {
//     //         auth_token: authToken,
//     //         access_key: accessKey
//     //     }
//     // })
// }