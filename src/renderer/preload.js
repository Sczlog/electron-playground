const { getCurrentWebContents } = require('@electron/remote');
const { contextBridge, ipcRenderer } = require('electron');

getCurrentWebContents();

console.log('1');

contextBridge.exposeInMainWorld('webview', {
  cdp: () => {
    return getCurrentWebContents().debugger;
  },
});
