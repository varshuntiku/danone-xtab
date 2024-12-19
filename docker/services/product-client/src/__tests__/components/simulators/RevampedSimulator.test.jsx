import React from 'react';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import RevampedSimulator, { CutomButtonGeneration } from 'components/simulators/RevampedSimulator';
import { vi } from 'vitest';
import { SavedScenarioContext } from '../../../components/AppScreen';

const history = createMemoryHistory();

describe('RevampedSimulator', () => {
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

  afterEach(cleanup);

  it('should render without crashing', () => {
    render(
      <CustomThemeContextProvider>
        <Router history={history}>
          <SavedScenarioContext.Provider value={{ openSavedScenarioPopup: mockopenSavedScenerioPopup }}>
            <RevampedSimulator {...mockProps} />
          </SavedScenarioContext.Provider>
        </Router>
      </CustomThemeContextProvider>
    );
    expect(screen.getByText(/Saved Scenarios/i)).toBeInTheDocument();
  });
  it('should initialize simulatorInfo based on isEditing prop', () => {
   
    const { rerender } = render(
      <CustomThemeContextProvider>
        <Router history={history}>
          <SavedScenarioContext.Provider value={{ openSavedScenarioPopup: vi.fn() }}>
            <RevampedSimulator {...mockProps} />
          </SavedScenarioContext.Provider>
        </Router>
      </CustomThemeContextProvider>
    );
   

    
    rerender(
      <CustomThemeContextProvider>
        <Router history={history}>
          <SavedScenarioContext.Provider value={{ openSavedScenarioPopup: vi.fn() }}>
            <RevampedSimulator {...mockProps} isEditing={true} />
          </SavedScenarioContext.Provider>
        </Router>
      </CustomThemeContextProvider>
    );
    expect(screen.getByText(/You are editing the scenario/i)).toBeInTheDocument();
  });

  it('should call getScenarios on mount', () => {
    render(
      <CustomThemeContextProvider>
        <Router history={history}>
          <SavedScenarioContext.Provider value={{ openSavedScenarioPopup: mockopenSavedScenerioPopup }}>
            <RevampedSimulator {...mockProps} />
          </SavedScenarioContext.Provider>
        </Router>
      </CustomThemeContextProvider>
    );
    expect(mockProps.getScenarios).toHaveBeenCalled();
  });

  it('should render simulator sections correctly', () => {
    const simulatorInfo = {
      sections: [
        {
          header: 'Section 1',
          inputs: [
            { input_type: 'text', value: 'Test Input', label: 'Label 1' },
          ],
        },
      ],
      section_orientation: 'horizontal',
      actions: [],
    };
    render(
      <CustomThemeContextProvider>
        <Router history={history}>
          <SavedScenarioContext.Provider value={{ openSavedScenarioPopup: mockopenSavedScenerioPopup }}>
            <RevampedSimulator {...mockProps} simulatorInfo={simulatorInfo} />
          </SavedScenarioContext.Provider>
        </Router>
      </CustomThemeContextProvider>
    );
    expect(screen.getByText(/Section 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Label 1/i)).toBeInTheDocument();
  });

  it('should render floating div when isEditing is true', () => {
    render(
      <CustomThemeContextProvider>
        <Router history={history}>
          <SavedScenarioContext.Provider value={{ openSavedScenarioPopup: mockopenSavedScenerioPopup }}>
            <RevampedSimulator {...mockProps} isEditing={true} />
          </SavedScenarioContext.Provider>
        </Router>
      </CustomThemeContextProvider>
    );
    expect(screen.getByText(/You are editing the scenario/i)).toBeInTheDocument();
  });

  it('should handle back to default click', () => {
    const simulatorInfo = {
      sections: [
        {
          header: 'Section 1',
          inputs: [
            { input_type: 'text', value: 'Test Input', label: 'Label 1' },
          ],
        },
      ],
      section_orientation: 'horizontal',
      actions: [],
    };
    render(
      <CustomThemeContextProvider>
        <Router history={history}>
          <SavedScenarioContext.Provider value={{ openSavedScenarioPopup: mockopenSavedScenerioPopup }}>
            <RevampedSimulator {...mockProps} simulatorInfo={simulatorInfo} isEditing={true} />
          </SavedScenarioContext.Provider>
        </Router>
      </CustomThemeContextProvider>
    );
    const clickHereElement = screen.getByText(/Click here/i);
    fireEvent.click(clickHereElement);
    expect(mockProps.setIsEditingParent).toHaveBeenCalledWith(false);
  });

  it('should render and handle actions of CutomButtonGeneration component', () => {
    render(
      <CustomThemeContextProvider>
        <Router history={history}>
          <SavedScenarioContext.Provider value={{ openSavedScenarioPopup: mockopenSavedScenerioPopup }}>
            <CutomButtonGeneration {...mockProps} />
          </SavedScenarioContext.Provider>
        </Router>
      </CustomThemeContextProvider>
    );

    // Check if buttons are rendered
    expect(screen.getByRole('button', { name: /Change/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Download/i })).toBeInTheDocument();

    // Trigger actions and verify functions are called
    fireEvent.click(screen.getByRole('button', { name: /Change/i }));
    expect(mockChangeFunc).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /Reset/i }));
    expect(mockResetFunc).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /Upload/i }));
    expect(mockUploadFunc).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /Download/i }));
    expect(mockDownloadFunc).toHaveBeenCalled();
  });
});
