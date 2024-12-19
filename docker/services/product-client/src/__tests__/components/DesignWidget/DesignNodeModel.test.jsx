import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Router } from 'react-router-dom';
import CustomThemeContextProvider from '../../../themes/customThemeContext';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import store from '../../../store/store';
import { DefaultPortModel, Toolkit } from 'storm-react-diagrams';
import { DesignNodeModel } from '../../../components/DesignWidget/DesignNodeModel';

const history = createMemoryHistory();
describe('DesignNodeModel', () => {
    let nodeModel;

    beforeEach(() => {
        nodeModel = new DesignNodeModel('Test Node', 'darkColor', 'lightColor');
    });

    it('should create an instance with the correct properties', () => {
        expect(nodeModel).toBeInstanceOf(DesignNodeModel);
        expect(nodeModel.name).toBe('Test Node');
        expect(nodeModel.dark_color).toBe('darkColor');
        expect(nodeModel.light_color).toBe('lightColor');
    });

    it('should add an in port correctly', () => {
        const label = 'In Port';
        const port = nodeModel.addInPort(label);
        expect(port).toBeInstanceOf(DefaultPortModel);
        expect(port.in).toBe(true);
    });

    it('should add an out port correctly', () => {
        const label = 'Out Port';
        const port = nodeModel.addOutPort(label);
        expect(port).toBeInstanceOf(DefaultPortModel);
        expect(port.in).toBe(false);
    });

    it('should deserialize correctly', () => {
        const object = {
            name: 'Deserialized Node',
            dark_color: 'newDarkColor',
            light_color: 'newLightColor',
            ports: []
        };
        nodeModel.deSerialize(object);
        expect(nodeModel.name).toBe('Deserialized Node');
        expect(nodeModel.dark_color).toBe('newDarkColor');
        expect(nodeModel.light_color).toBe('newLightColor');
    });

    it('should get in ports correctly', () => {
        const inPort = nodeModel.addInPort('In Port');
        const outPort = nodeModel.addOutPort('Out Port');
        expect(nodeModel.getInPorts()).toContain(inPort);
        expect(nodeModel.getInPorts()).not.toContain(outPort);
    });

    it('should get out ports correctly', () => {
        const inPort = nodeModel.addInPort('In Port');
        const outPort = nodeModel.addOutPort('Out Port');
        expect(nodeModel.getOutPorts()).toContain(outPort);
        expect(nodeModel.getOutPorts()).not.toContain(inPort);
    });
});
