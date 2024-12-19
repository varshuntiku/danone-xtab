import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { IThemeManager } from '@jupyterlab/apputils';

/**
 * Initialization data for the nuclios-light-v2 extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'nuclios-light-v2:plugin',
  description: 'A JupyterLab extension for nuclios light theme',
  autoStart: true,
  requires: [IThemeManager],
  activate: (app: JupyterFrontEnd, manager: IThemeManager) => {
    console.log('JupyterLab extension nuclios-light-v2 is activated!');
    const style = 'nuclios-light-v2/index.css';

    
    window.addEventListener('message', (event: any) => {
      if (event.data.mode === 'light') {
        // manager.loadCSS(style);
        app.commands.execute('apputils:change-theme', {
          theme: 'nuclios-light-v2'
        });
      }
    });

    window.parent.postMessage(
      {
        type: 'jupyter-extension-activated',
        data: {
          name: 'nuclios-light-v2'
        }
      },
      '*'
    );

    manager.register({
      name: 'nuclios-light-v2',
      isLight: true,
      load: () => manager.loadCSS(style),
      unload: () => Promise.resolve(undefined)
    });
  }
};

export default plugin;
