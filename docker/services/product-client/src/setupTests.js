import '@testing-library/jest-dom/extend-expect';

window.HTMLCanvasElement.prototype.getContext = () => {};
window.URL.createObjectURL = () => {};
