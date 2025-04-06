interface ITerminalInstance {
    prompt: string;
    currentLine: string;
    onKey(key: {key: string, domEvent: KeyboardEvent}): string;
}

export default ITerminalInstance;