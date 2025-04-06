import ITerminalInstance from "./ITerminalInstance";
import BasicRepl from "../repl/BasicRepl";
import CSharpRepl from "../repl/CSharpRepl";
import ScalaRepl from "../repl/ScalaRepl";
import IRepl from "../repl/IRepl";
import IReplManager from "./IReplManager"
import { INITIAL_LANGUAGE_SELECTION } from "../constants/Constants";

function removeNthCharacter(str: string, n: number): string {
    return str.slice(0, n) + str.slice(n + 1);
}

function insertString(original: string, insert: string, index: number): string {
    return original.slice(0, index) + insert + original.slice(index);
}

class TerminalInstance implements ITerminalInstance, IReplManager {
    prompt: string = "$ ";
    stackPointer: number = 0;

    currentLine: string = "";
    cursor: number = 0;

    activeRepl: IRepl = new BasicRepl();
    
    constructor() {
        this.SetRepl(INITIAL_LANGUAGE_SELECTION);
    }

    Clear(): void {
        this.stackPointer = 0;
    }

    SetRepl(newReplName: string): void {
        switch (newReplName) {
            case "C#":
                this.activeRepl = new CSharpRepl();
                break;
            case "Scala":
                this.activeRepl = new ScalaRepl();
                break;
            default:
                this.activeRepl = new BasicRepl();
                break;
        }
        
    }
    
    onKey(key: {key: string, domEvent: KeyboardEvent}): string {
        if (this.cursor === 80 && key.key !== "\r") {
            return "";
        }
        else if (key.key === "\r") {
            if (!this.currentLine.match(/^\s*$/)) {
                this.activeRepl.history.push(this.currentLine);
            }
            const temp = this.currentLine;
            this.currentLine = "";
            this.cursor = 0;
            this.stackPointer = this.activeRepl.history.length;
            return "\r\n" + this.activeRepl.Process(temp) + this.prompt;
        }
        else if (key.key === '\x1B[A') {
            if (this.stackPointer > 0) {
                this.stackPointer--;
                this.cursor = this.activeRepl.history[this.stackPointer].length;
                this.currentLine =  this.activeRepl.history[this.stackPointer]
                return "\x1b[1M" + this.prompt + this.activeRepl.history[this.stackPointer];
            }
            else {
                return "";
            }
        }
        else if (key.key === '\x1B[B') {
            if (this.stackPointer < this.activeRepl.history.length - 1) {
                this.stackPointer++;
                this.cursor = this.activeRepl.history[this.stackPointer].length;
                this.currentLine =  this.activeRepl.history[this.stackPointer]
                return "\x1b[1M" + this.prompt + this.activeRepl.history[this.stackPointer];
            }
            else {
                return "";
            }
        }
        else if (key.key === '\x1B[C') {
            if (this.cursor < this.currentLine.length) {
                this.cursor++;
                return "\x1B[C";
            }
            else {
                return "";
            }
        }
        else if (key.key === '\x1B[D') {
            if (this.cursor > 0) {
                this.cursor--;
                return '\x1B[D';
            }
            else {
                return "";
            }
        }
        else if (key.key === '\x7F') {
            if (this.cursor > 0) {
                this.currentLine = removeNthCharacter(this.currentLine, this.cursor - 1);
                this.cursor--;
                return "\x1B[D\x1b[P";
            }
            return "";
        }
        else if (key.key === '\x1B[3~') {
            if (this.cursor < this.currentLine.length) {
                this.currentLine = removeNthCharacter(this.currentLine, this.cursor);
                return "\x1b[P";
            }
            return "";
        }
        else {
            this.currentLine = insertString(this.currentLine, key.key, this.cursor);
            this.cursor++;
            return '\x1b[1@' + key.key;
        }
    }
}

export default TerminalInstance