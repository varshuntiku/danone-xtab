import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { IThemeManager } from '@jupyterlab/apputils';

/**
 * Initialization data for the nuclios-dark-v2 extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'nuclios-dark-v2:plugin',
  description: 'A JupyterLab extension for nulcios dark theme.',
  autoStart: true,
  requires: [IThemeManager],
  activate: (app: JupyterFrontEnd, manager: IThemeManager) => {
    console.log('JupyterLab extension nuclios-dark-v2 is activated!');
    const style = 'nuclios-dark-v2/index.css';

    window.addEventListener('message', (event: any) => {
      if (event.data.mode === 'dark') {
        // manager.loadCSS(style);
        app.commands.execute('apputils:change-theme', {
          theme: 'nuclios-dark-v2'
        });
      }
    });

    window.parent.postMessage(
      {
        type: 'jupyter-extension-activated',
        data: {
          name: 'nuclios-dark-v2'
        }
      },
      '*'
    );

    manager.register({
      name: 'nuclios-dark-v2',
      isLight: true,
      load: () => manager.loadCSS(style),
      unload: () => Promise.resolve(undefined)
    });
  }
};

export default plugin;
