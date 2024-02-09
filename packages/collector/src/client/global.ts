declare global {
  interface Window {
    electronAPI: {
      addEventListener: (event: string, callback: (value: any) => void) => void;
      dispatchEvent: (event: ElectronRendererToMainEvent) => void;
    }
  }
}

export class ElectronRendererToMainEvent extends Event {
  public readonly name: string;
  constructor(eventName: string) {
    super(eventName);
    this.name = eventName;
  }
}
