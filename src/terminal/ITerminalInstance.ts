interface ITerminalInstance {
    onKey(key: {key: string, domEvent: KeyboardEvent}): string;
}

export default ITerminalInstance;