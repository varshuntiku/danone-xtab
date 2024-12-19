// import layout1Img from '../../assets/img/create-story-layouts/layout-1.png';
// import layout2Img from '../../assets/img/create-story-layouts/layout-2.png';
// import layout3Img from '../../assets/img/create-story-layouts/layout-3.png';
// export const CreateStoryData = {
//     pages: [],
//     layouts: [
//         {
//             id: 1,
//             style: {
//                 gridTemplateAreas: "'h h h h''g g t t''g g t t''g g t t''k k k k'",
//             },
//             layoutProps: {
//                 rows: { h: 1, g: 3, t: 3, k: 1 },
//                 cols: { h: 4, g: 2, t: 2, k: 4 }
//             },
//             thumbnail: layout1Img
//         },
//         {
//             id: 2,
//             style: {
//                 gridTemplateAreas: "'h h h h''g g g k''g g g k''g g g k''t t t k'"
//             },
//             layoutProps: {
//                 rows: { h: 1, g: 3, t: 1, k: 4 },
//                 cols: { h: 4, g: 3, t: 3, k: 1 }
//             },
//             thumbnail: layout2Img
//         },
//         {
//             id: 3,
//             style: {
//                 gridTemplateAreas: "'h h h h''g g t t''g g t t''g g t t''g g t t'",
//             },
//             layoutProps: {
//                 rows: { h: 1, g: 4, t: 4, k: 0 },
//                 cols: { h: 4, g: 2, t: 2, k: 0 }
//             },
//             thumbnail: layout3Img
//         }
//     ]
// }

// export const NewPage = {
//     pIndex: 0, //pageindex used to set the order of the page.
//     style: {
//         gridTemplateAreas: null,
//     },
//     layoutId: null,
//     layoutProps: null, // these are from layout, can be tsken from layout table
//     headerContent: {
//         data: null
//     },
//     graphContent: {
//         data: null
//     },
//     textContent: {
//         data: null
//     },
//     keyFindingContent: {
//         data: null
//     } // these are text data, can be stored in the description column as json graph content will point to the value id directly.
// }

export const CreateStoryData = {
    pages: [],
    layouts: [
        {
            id: 1,
            style: {
                gridTemplateAreas: `
                    'h h h h'
                    'v v k k'
                    'v v k k'
                    't t t t'
                    't t t t'
                `
            },
            layoutProps: {
                sections: [
                    { component: 'header', gridArea: 'h', dataKey: 'h1', rowCount: 1, colCount: 4 },
                    {
                        component: 'visualContent',
                        gridArea: 'v',
                        dataKey: 'v1',
                        rowCount: 2,
                        colCount: 2
                    },
                    {
                        component: 'keyFinding',
                        gridArea: 'k',
                        dataKey: 'k1',
                        rowCount: 2,
                        colCount: 2
                    },
                    { component: 'text', gridArea: 't', dataKey: 't1', rowCount: 2, colCount: 4 }
                ]
            },
            thumbnail: ''
        },
        {
            id: 2,
            style: {
                gridTemplateAreas: `
                    'h h h h'
                    'v v t t'
                    'v v t t'
                    'v v t t'
                    'k k k k'
                `
            },
            layoutProps: {
                sections: [
                    { component: 'header', gridArea: 'h', dataKey: 'h1', rowCount: 1, colCount: 4 },
                    {
                        component: 'visualContent',
                        gridArea: 'v',
                        dataKey: 'v1',
                        rowCount: 3,
                        colCount: 2
                    },
                    {
                        component: 'keyFinding',
                        gridArea: 'k',
                        dataKey: 'k1',
                        rowCount: 1,
                        colCount: 4
                    },
                    { component: 'text', gridArea: 't', dataKey: 't1', rowCount: 3, colCount: 2 }
                ]
            },
            thumbnail: ''
        },
        {
            id: 3,
            style: {
                gridTemplateAreas: `
                    'h h h h'
                    '. v v .'
                    '. v v .'
                    '. v v .'
                    't t t t'
                `
            },
            layoutProps: {
                sections: [
                    { component: 'header', gridArea: 'h', dataKey: 'h1', rowCount: 1, colCount: 4 },
                    {
                        component: 'visualContent',
                        gridArea: 'v',
                        dataKey: 'v1',
                        rowCount: 3,
                        colCount: 2
                    },
                    { component: 'text', gridArea: 't', dataKey: 't1', rowCount: 1, colCount: 4 }
                ]
            },
            thumbnail: ''
        },
        {
            id: 4,
            style: {
                gridTemplateAreas: `
                    'h h h h'
                    'v1 v1 v2 v2'
                    'v1 v1 v2 v2'
                    'v1 v1 v2 v2'
                    't t t t'
                `
            },
            layoutProps: {
                sections: [
                    { component: 'header', gridArea: 'h', dataKey: 'h1', rowCount: 1, colCount: 4 },
                    {
                        component: 'visualContent',
                        gridArea: 'v1',
                        dataKey: 'v1',
                        rowCount: 2,
                        colCount: 3
                    },
                    {
                        component: 'visualContent',
                        gridArea: 'v2',
                        dataKey: 'v2',
                        rowCount: 2,
                        colCount: 3
                    },
                    { component: 'text', gridArea: 't', dataKey: 't1', rowCount: 1, colCount: 4 }
                ]
            },
            thumbnail: ''
        },
        {
            id: 5,
            style: {
                gridTemplateAreas: `
                    'h h h h'
                    'k k v v'
                    'k k v v'
                    't t t t'
                    't t t t'
                `
            },
            layoutProps: {
                sections: [
                    { component: 'header', gridArea: 'h', dataKey: 'h1', rowCount: 1, colCount: 4 },
                    {
                        component: 'visualContent',
                        gridArea: 'v',
                        dataKey: 'v1',
                        rowCount: 2,
                        colCount: 2
                    },
                    {
                        component: 'keyFinding',
                        gridArea: 'k',
                        dataKey: 'k1',
                        rowCount: 2,
                        colCount: 2
                    },
                    { component: 'text', gridArea: 't', dataKey: 't1', rowCount: 2, colCount: 4 }
                ]
            },
            thumbnail: ''
        },
        {
            id: 6,
            style: {
                gridTemplateAreas: `
                    'h h h h'
                    't t v v'
                    't t v v'
                    't t v v'
                    'k k k k'
                `
            },
            layoutProps: {
                sections: [
                    { component: 'header', gridArea: 'h', dataKey: 'h1', rowCount: 1, colCount: 4 },
                    {
                        component: 'visualContent',
                        gridArea: 'v',
                        dataKey: 'v1',
                        rowCount: 3,
                        colCount: 2
                    },
                    {
                        component: 'keyFinding',
                        gridArea: 'k',
                        dataKey: 'k1',
                        rowCount: 1,
                        colCount: 4
                    },
                    { component: 'text', gridArea: 't', dataKey: 't1', rowCount: 3, colCount: 2 }
                ]
            },
            thumbnail: ''
        },
        {
            id: 7,
            style: {
                gridTemplateAreas: `
                    'h h h h'
                    'v1 v1 v2 v2'
                    'v1 v1 v2 v2'
                    'v1 v1 v2 v2'
                    't1 t1 t2 t2'
                `
            },
            layoutProps: {
                sections: [
                    { component: 'header', gridArea: 'h', dataKey: 'h1', rowCount: 1, colCount: 4 },
                    {
                        component: 'visualContent',
                        gridArea: 'v1',
                        dataKey: 'v1',
                        rowCount: 2,
                        colCount: 3
                    },
                    {
                        component: 'visualContent',
                        gridArea: 'v2',
                        dataKey: 'v2',
                        rowCount: 2,
                        colCount: 3
                    },
                    { component: 'text', gridArea: 't1', dataKey: 't1', rowCount: 1, colCount: 2 },
                    { component: 'text', gridArea: 't2', dataKey: 't2', rowCount: 1, colCount: 2 }
                ]
            },
            thumbnail: ''
        },
        {
            id: 8,
            style: {
                gridTemplateAreas: `
                    'v1 v1 h h'
                    'v1 v1 t1 t1'
                    'v1 v1 t1 t1'
                    'v1 v1 t1 t1'
                    't2 t2 t2 t2'
                `
            },
            layoutProps: {
                sections: [
                    { component: 'header', gridArea: 'h', dataKey: 'h1', rowCount: 1, colCount: 2 },
                    {
                        component: 'visualContent',
                        gridArea: 'v1',
                        dataKey: 'v1',
                        rowCount: 3,
                        colCount: 2
                    },
                    { component: 'text', gridArea: 't1', dataKey: 't1', rowCount: 3, colCount: 2 },
                    { component: 'text', gridArea: 't2', dataKey: 't2', rowCount: 1, colCount: 4 }
                ]
            },
            thumbnail: ''
        },
        {
            id: 9,
            style: {
                gridTemplateAreas: `
                    'h h h h'
                    'v v v v'
                    'v v v v'
                    'v v v v'
                    't t t t'
                `
            },
            layoutProps: {
                sections: [
                    { component: 'header', gridArea: 'h', dataKey: 'h1', rowCount: 1, colCount: 4 },
                    {
                        component: 'visualContent',
                        gridArea: 'v',
                        dataKey: 'v1',
                        rowCount: 2,
                        colCount: 4
                    },
                    { component: 'text', gridArea: 't', dataKey: 't1', rowCount: 1, colCount: 4 }
                ]
            },
            thumbnail: ''
        },
        {
            id: 10,
            style: {
                gridTemplateAreas: `
                    't1 t1 h h'
                    't1 t1 t2 t2'
                    't1 t1 v1 v1'
                    't1 t1 v1 v1'
                    't1 t1 v1 v1'
                `
            },
            layoutProps: {
                sections: [
                    { component: 'header', gridArea: 'h', dataKey: 'h1', rowCount: 1, colCount: 2 },
                    {
                        component: 'visualContent',
                        gridArea: 'v1',
                        dataKey: 'v1',
                        rowCount: 3,
                        colCount: 2
                    },
                    { component: 'text', gridArea: 't1', dataKey: 't1', rowCount: 5, colCount: 2 },
                    { component: 'text', gridArea: 't2', dataKey: 't2', rowCount: 1, colCount: 2 }
                ]
            },
            thumbnail: ''
        },
        {
            id: 11,
            style: {
                gridTemplateAreas: `
                    't t t t'
                    't t t t'
                    't t t t'
                    't t t t'
                    't t t t'
                `
            },
            layoutProps: {
                sections: [
                    { component: 'text', gridArea: 't', dataKey: 't1', rowCount: 5, colCount: 4 }
                ]
            },
            thumbnail: ''
        }

        // {
        //     id: 2,
        //     style: {
        //         gridTemplateAreas: `
        //             'h h h h'
        //             'v1 v1 k k'
        //             'v1 v1 k k'
        //             't t v2 v2'
        //             't t v2 v2'
        //         `
        //     },
        //     layoutProps: {
        //         sections: [
        //             { component: 'header', gridArea: 'h', dataKey: 'h1', rowCount: 1, colCount: 4 },
        //             { component: 'visualContent', gridArea: 'v1', dataKey: 'v1', rowCount: 2, colCount: 2 },
        //             { component: 'visualContent', gridArea: 'v2', dataKey: 'v2', rowCount: 2, colCount: 2 },
        //             { component: 'keyFinding', gridArea: 'k', dataKey: 'k1', rowCount: 2, colCount: 2 },
        //             { component: 'text', gridArea: 't', dataKey: 't1', rowCount: 2, colCount: 2 },
        //         ]
        //     },
        //     thumbnail: ''
        // }
    ]
};

export const NewPage = {
    pIndex: 0, //pageindex used to set the order of the page.
    style: {
        gridTemplateAreas: null
    },
    layoutId: null,
    layoutProps: null, // these are from layout, can be tsken from layout table
    data: {}
};
