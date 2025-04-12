interface ITerminalService {
  prompt: string;
  cursorX: number;
  cursorY: number;
  onKey(key: { key: string; domEvent: KeyboardEvent }): string;
}

export default ITerminalService;
