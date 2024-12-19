export const form_config = {
    trigger_button: {
        text: 'Upload Actual Schedules'
    },
    dialog: {
        title: 'Upload Document'
    },
    dialog_actions: [
        {
            is_cancel: true,
            text: 'Cancel'
        },
        {
            name: 'generate',
            text: 'Generate',
            variant: 'contained'
        }
    ],
    form_config: {
        title: '',
        fields: [
            {
                id: 1,
                name: 'Resources',
                label: 'Resources',
                type: 'select',
                value: '',
                variant: 'outlined',
                options: ['1', '2', '3', '4'],
                margin: 'none',
                fullWidth: true,
                inputprops: {
                    type: 'select'
                },
                placeholder: 'Enter your Input',
                grid: 6
            },
            {
                id: 2,
                type: 'blank',
                grid: 6
            },
            {
                id: 3,
                name: 'Start Date',
                label: 'Start Date',
                type: 'datepicker',
                value: new Date(),
                variant: 'outlined',
                margin: 'none',
                inputprops: {
                    format: 'DD/MM/yyyy',
                    minDate: new Date(),
                    variant: 'inline'
                },
                InputLabelProps: {
                    disableAnimation: true,
                    shrink: true
                },
                placeholder: 'Enter StartDate',
                helperText: 'Invalid Input',
                fullWidth: true,
                grid: 6
            },
            {
                id: 4,
                name: 'End Date',
                label: 'End Date',
                type: 'datepicker',
                value: new Date(),
                variant: 'outlined',
                margin: 'none',
                inputprops: {
                    format: 'DD/MM/yyyy',
                    minDate: new Date(),
                    variant: 'inline'
                },
                InputLabelProps: {
                    disableAnimation: true,
                    shrink: true
                },
                placeholder: 'Enter EndDate',
                helperText: 'Invalid Input',
                fullWidth: true,
                grid: 6
            },
            {
                id: 5,
                label: 'Input Data',
                type: 'label',
                value: 'Input Data',
                variant: 'outlined',
                margin: 'none',
                inputprops: {
                    elevation: 0,
                    variant: 'outlined'
                },
                InputLabelProps: {
                    variant: 'h4',
                    align: 'inherit',
                    display: 'initial'
                },
                placeholder: 'Input Data',
                helperText: 'Input Data',
                fullWidth: true,
                grid: 12
            },
            {
                id: 9,
                name: 'Schedule',
                label: 'Schedule',
                type: 'upload',
                value: '',
                variant: 'outlined',
                margin: 'none',
                inputprops: {
                    type: 'file',
                    error: 'false',
                    multiple: true,
                    accept: 'image/*'
                },
                InputLabelProps: {
                    disableAnimation: true,
                    shrink: true
                },
                placeholder: 'Enter your Input',
                grid: 12
            },
            {
                id: 10,
                name: 'Maintainance',
                label: 'Maintainance',
                type: 'upload',
                value: '',
                variant: 'outlined',
                margin: 'none',
                inputprops: {
                    type: 'file',
                    error: 'false',
                    multiple: true,
                    accept: 'image/*'
                },
                InputLabelProps: {
                    disableAnimation: true,
                    shrink: true
                },
                placeholder: 'Enter your Input',
                grid: 12
            },
            {
                id: 10,
                name: 'Data name 3',
                label: 'Data name 3',
                type: 'upload',
                value: '',
                variant: 'outlined',
                margin: 'none',
                required: true,
                inputprops: {
                    type: 'file',
                    multiple: true,
                    accept: 'image/*'
                },
                InputLabelProps: {
                    disableAnimation: true,
                    shrink: true
                },
                placeholder: 'Enter your Input',
                grid: 12
            }
        ]
    }
};

export const form_config_generate_schedule = {
    trigger_button: {
        text: 'Generate Schedule'
    },
    dialog: {
        title: 'Generate Schedule'
    },
    dialog_actions: [
        {
            is_cancel: true,
            text: 'Cancel'
        },
        {
            name: 'generate',
            text: 'Generate',
            variant: 'contained'
        }
    ],
    form_config: {
        title: '',
        fields: [
            {
                id: 1,
                name: 'Active MC',
                label: 'Active MC',
                type: 'select',
                value: '',
                variant: 'outlined',
                options: ['1', '2', '3', '4'],
                margin: 'none',
                fullWidth: true,
                inputprops: {
                    type: 'select'
                },
                placeholder: 'Enter your Input',
                grid: 6
            },
            {
                id: 2,
                name: 'Active Pipe Constraints',
                label: 'Active Pipe Constraints',
                type: 'select',
                value: '',
                variant: 'outlined',
                options: ['1', '2', '3', '4'],
                margin: 'none',
                fullWidth: true,
                inputprops: {
                    type: 'select'
                },
                placeholder: 'Enter your Input',
                grid: 6
            },
            {
                id: 3,
                name: 'Start Date',
                label: 'Start Date',
                type: 'datepicker',
                value: new Date(),
                variant: 'outlined',
                margin: 'none',
                inputprops: {
                    format: 'DD/MM/yyyy',
                    minDate: new Date(),
                    variant: 'inline'
                },
                InputLabelProps: {
                    disableAnimation: true,
                    shrink: true
                },
                placeholder: 'Enter StartDate',
                helperText: 'Invalid Input',
                fullWidth: true,
                grid: 6
            },
            {
                id: 4,
                name: 'End Date',
                label: 'End Date',
                type: 'datepicker',
                value: new Date(),
                variant: 'outlined',
                margin: 'none',
                inputprops: {
                    format: 'DD/MM/yyyy',
                    minDate: new Date(),
                    variant: 'inline'
                },
                InputLabelProps: {
                    disableAnimation: true,
                    shrink: true
                },
                placeholder: 'Enter EndDate',
                helperText: 'Invalid Input',
                fullWidth: true,
                grid: 6
            },
            {
                id: 5,
                name: 'Input Data',
                label: 'Input Data',
                type: 'label',
                value: 'Input Data',
                variant: 'outlined',
                margin: 'none',
                inputprops: {
                    elevation: 0,
                    variant: 'outlined'
                },
                InputLabelProps: {
                    variant: 'h4',
                    align: 'inherit',
                    display: 'initial'
                },
                placeholder: 'Input Data',
                helperText: 'Input Data',
                fullWidth: true,
                grid: 12
            },
            {
                id: 9,
                name: 'Schedule',
                label: 'Schedule',
                type: 'upload',
                value: '',
                variant: 'outlined',
                margin: 'none',
                inputprops: {
                    type: 'file',
                    error: 'false',
                    multiple: true,
                    accept: 'image/*'
                },
                InputLabelProps: {
                    disableAnimation: true,
                    shrink: true
                },
                placeholder: 'Enter your Input',
                grid: 12
            },
            {
                id: 10,
                name: 'Maintainance',
                label: 'Maintainance',
                type: 'upload',
                value: '',
                variant: 'outlined',
                margin: 'none',
                inputprops: {
                    type: 'file',
                    error: 'false',
                    multiple: true,
                    accept: 'image/*'
                },
                InputLabelProps: {
                    disableAnimation: true,
                    shrink: true
                },
                placeholder: 'Enter your Input',
                grid: 12
            },
            {
                id: 10,
                name: 'Data name 3',
                label: 'Data name 3',
                type: 'upload',
                value: '',
                variant: 'outlined',
                margin: 'none',
                required: true,
                inputprops: {
                    type: 'file',
                    multiple: true,
                    accept: 'image/*'
                },
                InputLabelProps: {
                    disableAnimation: true,
                    shrink: true
                },
                placeholder: 'Enter your Input',
                grid: 12
            }
        ]
    }
};

// export const form_config = {
//     trigger_button: {
//         text: "Generate Schedule",
//         variant: "outlined"
//     },
//     dialog: {
//         title: "Generate Schedule",
//     },
//     dialog_actions: [
//         {
//             is_cancel: true,
//             text: "Cancel",
//             variant: "outlined"
//         },
//         {
//             name: "generate",
//             text: "Generate",
//             variant: "contained"
//         }
//     ],
//     form_config: {
//         title:'',
//         fields:[
//             {   id:12,
//                 name:'Active MC',
//                 label:'Select Resources',
//                 type:'select',
//                 value:'',
//                 variant:'outlined',
//                 options:['1','2','3','4'],
//                 margin:'none',
//                 fullWidth:true,
//                 required:true,
//                 error:false,
//                 multiple:false,
//                 inputprops:{
//                     type:'select',
//                 },
//                 placeholder:'Enter your Input',
//                 helperText:false,
//                 grid:6
//             },
//             {   id:12,
//                 name:'Active Pipe Constraints',
//                 label:'Select Resources',
//                 type:'select',
//                 value:'',
//                 variant:'outlined',
//                 options:['1','2','3','4'],
//                 margin:'none',
//                 fullWidth:true,
//                 required:true,
//                 error:false,
//                 multiple:false,
//                 inputprops:{
//                     type:'select',
//                 },
//                 placeholder:'Enter your Input',
//                 helperText:false,
//                 grid:6
//             },
//             {
//                 id:5,
//                 name:'Start Date',
//                 label:'Start Date',
//                 type:'datepicker',
//                 value:new Date(),
//                 variant:'outlined',
//                 options:false,
//                 margin:'none',
//                 required:true,
//                 error:true,
//                 multiple:false,
//                 inputprops:{
//                   format:"DD/MM/yyyy",
//                   minDate:new Date(),
//                   variant:'inline'
//                 },
//                 InputLabelProps:{
//                     disableAnimation:true,
//                     shrink: true,
//                 },
//                 placeholder:'Enter StartDate',
//                 helperText:"Invalid Input",
//                 fullWidth:true,
//                 grid:6
//             }, {
//                 id:7,
//                 name:'End Date',
//                 label:'End Date',
//                 type:'datepicker',
//                 value:new Date(),
//                 variant:'outlined',
//                 options:false,
//                 margin:'none',
//                 required:true,
//                 error:true,
//                 multiple:false,
//                 inputprops:{
//                   format:"DD/MM/yyyy",
//                   minDate:new Date(),
//                   variant:'inline'
//                 },
//                 InputLabelProps:{
//                     disableAnimation:true,
//                     shrink: true,
//                 },
//                 placeholder:'Enter EndDate',
//                 helperText:"Invalid Input",
//                 fullWidth:true,
//                 grid:6
//             },
//             {
//                 id:8,
//                 name:'Input Data',
//                 label:'Input Data',
//                 type:'label',
//                 value:"Input Data",
//                 variant:'outlined',
//                 options:false,
//                 margin:'none',
//                 required:false,
//                 error:false,
//                 multiple:false,
//                 inputprops:{
//                     elevation:0,
//                     variant:'outlined',
//                     square:false
//                 },
//                 InputLabelProps:{
//                     variant:"h4",
//                     align:"inherit",
//                     display:"initial"
//                 },
//                 placeholder:'Input Data',
//                 helperText:"Input Data",
//                 fullWidth:true,
//                 grid:12
//             },
//             {
//                 id:9,
//                 name:'Schedule',
//                 label:'Schedule',
//                 type:'upload',
//                 value:'',
//                 variant:'outlined',
//                 options:false,
//                 margin:'none',
//                 fullWidth:false,
//                 required:true,
//                 error:false,
//                 multiple:false,
//                 inputprops:{
//                     type:'file',
//                     error:'false',
//                     multiple:true,
//                     accept:"image/*"//".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
//                 },
//                 InputLabelProps:{
//                     disableAnimation:true,
//                     shrink: true,
//                 },
//                 placeholder:'Enter your Input',
//                 helperText:false,
//                 grid:12
//             },
//             {
//                 id:10,
//                 name:'Maintainance',
//                 label:'Maintainance',
//                 type:'upload',
//                 value:'',
//                 variant:'outlined',
//                 options:false,
//                 margin:'none',
//                 fullWidth:false,
//                 required:true,
//                 error:false,
//                 multiple:false,
//                 inputprops:{
//                     type:'file',
//                     error:'false',
//                     multiple:true,
//                     accept:"image/*"//".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
//                 },
//                 InputLabelProps:{
//                     disableAnimation:true,
//                     shrink: true,
//                 },
//                 placeholder:'Enter your Input',
//                 helperText:false,
//                 grid:12
//             },
//             {
//                 id:10,
//                 name:'Data name 3',
//                 label:'Data name 3',
//                 type:'upload',
//                 value:'',
//                 variant:'outlined',
//                 options:false,
//                 margin:'none',
//                 fullWidth:false,
//                 required:true,
//                 error:false,
//                 multiple:false,
//                 inputprops:{
//                     type:'file',
//                     error:'false',
//                     multiple:true,
//                     accept:"image/*"//".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
//                 },
//                 InputLabelProps:{
//                     disableAnimation:true,
//                     shrink: true,
//                 },
//                 placeholder:'Enter your Input',
//                 helperText:false,
//                 grid:12
//             },
//         ]
//     }
// }

export const text_list = {
    fetch_on_load: false,
    list: [
        {
            text: 'Schedule Inputs:',
            style: {
                fontWeight: 600
            }
        },
        {
            text: 'Active MC:'
        },
        {
            text: 'All, MC1, MC2, MC3.....',
            color: 'contrast'
        },
        {
            text: '|'
        },
        {
            text: 'Active Pipe Constraints:'
        },
        {
            text: 'A, B, C, D....',
            color: 'contrast'
        },
        {
            text: 'Dates'
        },
        {
            text: '|'
        },
        {
            text: '6/5/2021 to 15/5/2021',
            color: 'contrast'
        }
    ]
};
