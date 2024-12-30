import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      // TODO: Fix the types here
      netracker: (interfaceCard: number) => Promise<string>,
      onTrackerData: (callback: (data: string) => void) => Electron.IpcRenderer
    }
  }
}
