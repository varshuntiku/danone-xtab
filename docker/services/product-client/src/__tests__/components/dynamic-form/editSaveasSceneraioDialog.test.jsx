import React from 'react';
import { render, cleanup,screen, fireEvent } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import FormDialogSaveAsScenario from '../../../components/dynamic-form/editSaveasScenarioDialog.jsx';
import { describe, it, afterEach, expect, vi } from 'vitest';

const history = createMemoryHistory();


describe('FormDialogSaveAsScenario', () => {
  const handleDialogClose = vi.fn();
  const handleSaveScenario = vi.fn();

  beforeEach(() => {
    handleDialogClose.mockClear();
    handleSaveScenario.mockClear();
  });

  it('should render the dialog when dialogOpen is true', () => {
    render(
        <CustomThemeContextProvider>
                <Router history={history}>
      <FormDialogSaveAsScenario
        dialogOpen={true}
        handleDialogClose={handleDialogClose}
        handleSaveScenario={handleSaveScenario}
        scenerioname="Test Scenario"
      /></Router></CustomThemeContextProvider>
    );

    expect(screen.getByText('Save Simulator Scenario')).toBeInTheDocument();
  });

  it('should not render the dialog when dialogOpen is false', () => {
    render(
        <CustomThemeContextProvider>
                <Router history={history}>
      <FormDialogSaveAsScenario
        dialogOpen={false}
        handleDialogClose={handleDialogClose}
        handleSaveScenario={handleSaveScenario}
        scenerioname="Test Scenario"
      /></Router></CustomThemeContextProvider>
    );

    expect(screen.queryByText('Save Simulator Scenario')).not.toBeInTheDocument();
  });


  it('should call handleDialogClose when the close button is clicked', () => {
    render(
        <CustomThemeContextProvider>
                <Router history={history}>
      <FormDialogSaveAsScenario
        dialogOpen={true}
        handleDialogClose={handleDialogClose}
        handleSaveScenario={handleSaveScenario}
        scenerioname="Test Scenario"
      /></Router></CustomThemeContextProvider>
    );

    const closeButton = screen.getByLabelText('close');
    fireEvent.click(closeButton);

    expect(handleDialogClose).toHaveBeenCalledTimes(1);
  });

  

  it('should correctly set initial name state from props', () => {
    render(
        <CustomThemeContextProvider>
                <Router history={history}>
      <FormDialogSaveAsScenario
        dialogOpen={true}
        handleDialogClose={handleDialogClose}
        handleSaveScenario={handleSaveScenario}
        scenerioname="Test Scenario"
      /></Router></CustomThemeContextProvider>
    );

    expect(screen.getByText('Enter Scenario Version')).toBeInTheDocument();
  });
});
