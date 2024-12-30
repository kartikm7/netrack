import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  netracker: (interfaceCard: number): Promise<string> => ipcRenderer.invoke('tracker', interfaceCard),
  // This is just a layer of abstraction, to ensure that I can do whatever with the string that I get from the tracker-data channel
  // the callback interface is highly flexible, it allows
  onTrackerData: (callback: (data: string) => void): Electron.IpcRenderer => ipcRenderer.on('tracker-data', (_, data) => callback(data))
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
