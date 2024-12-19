
// This will act as a singleton for our comments setup

class GlobalState {
    constructor() {
      this.state = {};
    }
  
    getState() {
      return this.state;
    }
  
    setState(newState) {
      this.state = { ...this.state, ...newState };
    }
  }
  
  const globalState = new GlobalState();
  export default globalState;
  