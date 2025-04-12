import IRepl from "./IRepl";

interface IReplManager {
    activeRepl: IRepl
    prompt: string;
    stackPointer: number;

    currentLine: string;
    cursor: number;

    Clear(): void;
    ReceiveKey(key: string): string;
}

export default IReplManager;