import BasicRepl from "./BasicRepl";
import IRepl from "./IRepl";
import IReplManager from "./IReplManager";

class BasicReplManager implements IReplManager {
    activeRepl: IRepl = new BasicRepl();
    prompt: string = "$ ";
    stackPointer: number = 0;

    currentLine: string = "";
    cursor: number = 0;

    ReceiveKey(key: string): string {
        return key;
    }

    Clear() {
        this.stackPointer = 0;
    }
}

export default BasicReplManager;