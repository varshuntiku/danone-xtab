import React from 'react';
import { SolutionBluePrint as SolutionBlueprintWebComponent } from 'solution-blueprint';

function SolutionBlueprint() {
    const envConfig = {
        global_style: {
            VITE_APP_ENV: import.meta.env['REACT_APP_ENV'],
            VITE_APP_COPILOT_ADMIN_CLIENT: import.meta.env['REACT_APP_COPILOT_ADMIN_CLIENT'],
            VITE_APP_ENABLE_FASTAPI: import.meta.env['REACT_APP_ENABLE_FASTAPI'],
            VITE_APP_NUCLIOS_BACKEND_API: import.meta.env['REACT_APP_NUCLIOS_BACKEND_API'],
            VITE_APP_BACKEND_API: import.meta.env['REACT_APP_BACKEND_API']
        },
        solution_blueprint: {
            VITE_APP_DEE_ENV_BASE_URL: import.meta.env['REACT_APP_DEE_ENV_BASE_URL'],
            VITE_APP_BACKEND_API: import.meta.env['REACT_APP_BACKEND_API'],
            VITE_APP_NUCLIOS_BACKEND_API: import.meta.env['REACT_APP_NUCLIOS_BACKEND_API'],
            VITE_APP_ENV: import.meta.env['REACT_APP_ENV'],
            VITE_APP_ENABLE_FASTAPI: import.meta.env['REACT_APP_ENABLE_FASTAPI'],
            VITE_APP_SOLUTION_BP_ENV_BASE_URL: import.meta.env[
                'REACT_APP_SOLUTION_BP_ENV_BASE_URL'
            ],
            VITE_APP_JUPYTER_HUB_ENV_BASE_URL: import.meta.env['REACT_APP_JUPYTER_HUB_ENV_BASE_URL']
        }
    };
    const currentTheme = localStorage.getItem('codx-products-theme');
    window.envConfig = envConfig;
    return <SolutionBlueprintWebComponent currentTheme={currentTheme} />;
}

export default SolutionBlueprint;
