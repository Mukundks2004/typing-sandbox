import ITerminalInstance from "./ITerminalInstance";
import IReplManager from "../repl/IReplManager";
import { INITIAL_LANGUAGE_SELECTION } from "../constants/Constants";
import BasicReplManager from "../repl/BasicReplManager";
import CSharpReplManager from "../repl/CSharpReplManager";

class TerminalInstance implements ITerminalInstance {
    activeReplManager: IReplManager = new BasicReplManager();
    
    constructor() {
        this.SetRepl(INITIAL_LANGUAGE_SELECTION);
    }

    Clear(): void {
        this.activeReplManager.Clear();
    }

    SetRepl(newReplName: string): void {
        switch (newReplName) {
            case "C#":
                this.activeReplManager = new CSharpReplManager();
                break;
            default:
                this.activeReplManager = new BasicReplManager();
                break;
        }
    }
    
    onKey(key: {key: string, domEvent: KeyboardEvent}): string {
        return this.activeReplManager.ReceiveKey(key.key);
    }
}

export default TerminalInstance