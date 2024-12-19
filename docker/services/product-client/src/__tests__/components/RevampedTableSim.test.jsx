import React from 'react';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import RevampedTableSim from '../../components/simulators/RevampedTableSim';
import CustomThemeContextProvider from '../../themes/customThemeContext';

const history = createMemoryHistory();


const simulatorInfo = {
    "isRevampedTableSim": true,
    "toplevel_inputs": [
        {
            "label": "dropdwn1",
            "type": "dropdown",
            "value": "option1",
            "options": [
                {
                    "label": "option1",
                    "value": "option1"
                },
                {
                    "label": "option2",
                    "value": "option2"
                }
            ]
        },
        {
            "label": "radio grp",
            "type": "radio_btn",
            "value": "option1",
            "options": [
                {
                    "label": "option1",
                    "value": "option1"
                },
                {
                    "label": "option2",
                    "value": "option2"
                }
            ]
        },
        {
            "label": "mutliselect",
            "type": "multiselect_dropdown",
           "value": ["option1"],
            "options": [
                {
                    "label": "option1",
                    "value": "option1"
                },
                {
                    "label": "labour management focus",
                    "value": "labour management focus"
                },
                {
                    "label": "option3",
                    "value": "option3"
                },
                {
                    "label": "option4",
                    "value": "option4"
                },
                {
                    "label": "option5",
                    "value": "option5"
                },
                {
                    "label": "option6",
                    "value": "option6"
                },
                {
                    "label": "option7",
                    "value": "option7"
                },
                {
                    "label": "option8",
                    "value": "option8"
                },
                {
                    "label": "labour management focus 1",
                    "value": "labour management focus 1"
                },
                {
                    "label": "labour management focus 2",
                    "value": "labour management focus 2"
                }
            ]
        }
    ],
    "simulator_inputs": [
        [
            {
                "label": "dropdown1",
                "type": "dropdown",
                "value": "option1",
                "options": [
                    {
                        "label": "option1",
                        "value": "option1"
                    },
                    {
                        "label": "option2",
                        "value": "option2"
                    }
                ]
            },
            {
                "label": "active",
                "type": "toggle",
                "value": true,
                "disabled": false
            },
            {
                "label": "passive",
                "type": "toggle",
                "value": true,
                "disabled": false
            },
            {
                "label": "budget",
                "type": "number",
                "value": 100,
                "height": "default",
                "variant": "outlined"
            },
            {
                "label": "min",
                "type": "number",
                "value": 0,
                "height": "default",
                "min": 0,
                "max": 100,
                "variant": "outlined"
            },
            {
                "label": "slider",
                "type": "slider",
                "value": 150,
                "steps": 2
            },
            {
                "label": "max",
                "type": "number",
                "value": 200,
                "height": "default",
                "min": 101,
                "max": 200,
                "variant": "outlined"
            }
        ],
        [
            {
                "label": "dropdown1",
                "type": "dropdown",
                "value": "option1",
                "options": [
                    {
                        "label": "option1",
                        "value": "option1"
                    },
                    {
                        "label": "option2",
                        "value": "option2"
                    }
                ]
            },
            {
                "label": "active",
                "type": "toggle",
                "value": true,
                "disabled": false
            },
            {
                "label": "passive",
                "type": "toggle",
                "value": true,
                "disabled": false
            },
            {
                "label": "budget",
                "type": "number",
                "value": 100,
                "height": "default",
                "variant": "outlined"
            },
            {
                "label": "min",
                "type": "number",
                "value": 0,
                "height": "default",
                "min": 0,
                "max": 100,
                "variant": "outlined"
            },
            {
                "label": "slider",
                "type": "slider",
                "value": 150,
                "steps": 2
            },
            {
                "label": "max",
                "type": "number",
                "value": 200,
                "height": "default",
                "min": 101,
                "max": 200,
                "variant": "outlined"
            }
        ],
        [
            {
                "label": "dropdown1",
                "type": "dropdown",
                "value": "option1",
                "options": [
                    {
                        "label": "option1",
                        "value": "option1"
                    },
                    {
                        "label": "option2",
                        "value": "option2"
                    }
                ]
            },
            {
                "label": "active",
                "type": "toggle",
                "value": true,
                "disabled": false
            },
            {
                "label": "passive",
                "type": "toggle",
                "value": true,
                "disabled": false
            },
            {
                "label": "budget",
                "type": "number",
                "value": 100,
                "height": "default",
                "variant": "outlined"
            },
            {
                "label": "min",
                "type": "number",
                "value": 0,
                "height": "default",
                "min": 0,
                "max": 100,
                "variant": "outlined"
            },
            {
                "label": "slider",
                "type": "slider",
                "value": 150,
                "steps": 2
            },
            {
                "label": "max",
                "type": "number",
                "value": 200,
                "height": "default",
                "min": 101,
                "max": 200,
                "variant": "outlined"
            }
        ]
    ],
    "actions": [
        {
            "name": "Analyze Changes",
            "variant": "contained",
            "type": "Primary",
            "action": "change",
            "action_flag_type": "Slidersection Analyse Changes"
        },
        {
            "name": "Save Scenario",
            "variant": "contained",
            "type": "Primary",
            "action": "submit",
            "action_flag_type": false
        },
        {
            "name": "Reset",
            "variant": "outlined",
            "type": "Primary",
            "action": "submit",
            "action_flag_type": false
        }
    ]
}

describe('Nuclios product test',()=>{
    const mockopenSavedScenerioPopup = vi.fn();
    const mockActionFunc = vi.fn();
    const mockChangeFunc = vi.fn();
    const mockResetFunc = vi.fn();
    const mockUploadFunc = vi.fn();
    const mockDownloadFunc = vi.fn();
    const mockSaveScenario = vi.fn();
    const mockSaveAsScenario = vi.fn();
  
    const mockProps = {
      isEditing: false,
      selectedScenario: { id: 1, name: 'Test Scenario' },
  
      simulatorInfo: {
        sections: [],
        section_orientation: 'horizontal',
        actions: [],
      },
      getScenarios: vi.fn(),
      setIsEditingParent: vi.fn(),
      changefunc: mockChangeFunc,
      resetfunc: mockResetFunc,
      submitfunc: vi.fn(),
      uploadfunc: mockUploadFunc,
      downloadfunc: mockDownloadFunc,
      actionfunc: mockActionFunc,
      onSaveScenario: mockSaveScenario,
      onSaveasScenario: mockSaveAsScenario,
      savedScenarios: [],
      linkedScreen: 'TestScreen',
      classes: {
          button: 'mock-button-class', 
          savebutton: 'mock-savebutton-class',
          menu: 'mock-menu-class',
          downloadSheet: 'mock-downloadSheet-class',
        },
      action_buttons: [
        { name: 'Change', action: 'change', variant: 'contained' },
        { name: 'Reset', action: 'reset', variant: 'outlined' },
        { name: 'Save', action: 'submit', variant: 'contained' },
        { name: 'Upload', action: 'upload', variant: 'contained' },
        { name: 'Download', action: 'download', variant: 'outlined' },
      ],
    };
    test('should render revamaped table simulator',()=>{
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <RevampedTableSim  data={simulatorInfo} />
                </Router>
            </CustomThemeContextProvider>
        );
    })

    test('renders dropdown', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <RevampedTableSim  data={simulatorInfo} />
                </Router>
            </CustomThemeContextProvider>
        );

        const dropdown = screen.getAllByRole('dropdown');
        expect(dropdown[0]).toBeInTheDocument();
      });

      test('renders number input', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <RevampedTableSim  data={simulatorInfo} />
                </Router>
            </CustomThemeContextProvider>
        );
        const numberInputs = screen.getAllByRole('spinbutton');
        expect(numberInputs[0]).toBeInTheDocument();

      });

      test('renders number input updates its value', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <RevampedTableSim  data={simulatorInfo} />
                </Router>
            </CustomThemeContextProvider>
        );
        const numberInputs = screen.getAllByRole('spinbutton');
        fireEvent.change(numberInputs[0], { target: { value: '10' } });
        expect(numberInputs[0].value).toBe('10');

        fireEvent.change(numberInputs[1], { target: { value: '20' } });
        expect(numberInputs[1].value).toBe('20');
      });

      test('render sliders input', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <RevampedTableSim  data={simulatorInfo} />
                </Router>
            </CustomThemeContextProvider>
        );
        const sliders = screen.getAllByRole('slider');
        expect(sliders[0]).toBeInTheDocument()
      });

      test('render toggle component', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <RevampedTableSim  data={simulatorInfo} />
                </Router>
            </CustomThemeContextProvider>
        );
        const toggleBtn = screen.getAllByRole('checkbox');
        expect(toggleBtn[0]).toBeInTheDocument();

      });

      test('render and updates the toggle value correctly', () => {
        const { getByText, debug } = render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <RevampedTableSim  data={simulatorInfo} />
                </Router>
            </CustomThemeContextProvider>
        );
        const toggleBtn = screen.getAllByRole('checkbox');
        expect(toggleBtn[0]).toBeChecked()

        userEvent.click(toggleBtn[0])
        expect(toggleBtn[0]).not.toBeChecked()

      });
      test('renders and handles Snackbar correctly', () => {
        render(
            <CustomThemeContextProvider>
                <Router history={history}>
                    <RevampedTableSim data={simulatorInfo} />
                </Router>
            </CustomThemeContextProvider>
        );

        const actionButton = screen.getByText('Analyze Changes');
        userEvent.click(actionButton);

        const snackbar = screen.getByRole('group');
        expect(snackbar).toBeInTheDocument();
      
    });
})