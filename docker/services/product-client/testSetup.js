import '@testing-library/jest-dom';
// import { vi } from 'vitest';

// vi.spyOn(window.URL, "createObjectURL").mockImplementation(() => "http://fake.url");
global.Plotly = {
    purge: () => { }
}