#### Depoly to Azure Function

## Running headless Chromium in Azure Functions with Puppeteer

`By default, the Azure Functions VS Code extension will deploy the app using local build, which means it'll run npm install locally and deploy the app package. For remote build, we update the app's .vscode/settings.json to enable scmDoBuildDuringDeployment.`

 `We can also remove the postDeployTask and preDeployTask settings that runs npm commands before and after the deployment; they're not needed because we're running the build remotely.`

`we're running npm install remotely, we can add node_modules to .funcignore. This excludes the node_modules folder from the   deployment package to make the upload as small as possible.`

## .vscode/setting.json

"{
    "azureFunctions.deploySubpath": ".",
   // "azureFunctions.postDeployTask": "npm install",
    "azureFunctions.projectLanguage": "JavaScript",
    "azureFunctions.projectRuntime": "~3",
    "debug.internalConsoleOptions": "neverOpen",
    //"azureFunctions.preDeployTask": "npm prune",
     "azureFunctions.scmDoBuildDuringDeployment": true
}"

## .funcignore

"
*.js.map
*.ts
.git*
.vscode
local.settings.json
test
tsconfig.json
node_modules
"