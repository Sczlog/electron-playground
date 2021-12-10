const { contextBridge, ipcRenderer } = require('electron');
const { randomUUID } = require('crypto');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    on(...args) {
      return ipcRenderer.on(...args);
    },
    once(...args) {
      return ipcRenderer.once(...args);
    },
    send(...args) {
      return ipcRenderer.send(...args);
    },
    off(...args) {
      return ipcRenderer.off(...args);
    },
    invoke(...args) {
      return ipcRenderer.invoke(...args);
    },
  },
  uuid: () => {
    return randomUUID();
  },
});
