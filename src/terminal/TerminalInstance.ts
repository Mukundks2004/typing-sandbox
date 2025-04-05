import ITerminalInstance from "./ITerminalInstance";
import process from "../repl/sample";

function removeNthCharacter(str: string, n: number): string {
    return str.slice(0, n) + str.slice(n + 1);
}

function insertString(original: string, insert: string, index: number): string {
    return original.slice(0, index) + insert + original.slice(index);
}  

class TerminalInstance implements ITerminalInstance {
    prompt: string = "$ ";
    history: string[] = [];
    stackPointer: number = 0;

    currentLine: string = "";
    cursor: number = 0;
    
    onKey(key: {key: string, domEvent: KeyboardEvent}): string {
        if (key.key === "\r") {
            this.history.push(this.currentLine);
            const temp = this.currentLine;
            this.currentLine = "";
            this.cursor = 0;
            this.stackPointer = this.history.length;
            return "\r\n" + process(temp) + this.prompt;
        }
        else if (key.key === '\x1B[A') {
            if (this.stackPointer > 0) {
                this.stackPointer--;
                this.cursor = this.history[this.stackPointer].length;
                this.currentLine =  this.history[this.stackPointer]
                return "\x1b[1M" + this.prompt + this.history[this.stackPointer];
            }
            else {
                return "";
            }
        }
        else if (key.key === '\x1B[B') {
            if (this.stackPointer < this.history.length - 1) {
                this.stackPointer++;
                this.cursor = this.history[this.stackPointer].length;
                this.currentLine =  this.history[this.stackPointer]
                return "\x1b[1M" + this.prompt + this.history[this.stackPointer];
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
            if (this.cursor < this.currentLine.length - 1) {
                this.currentLine = removeNthCharacter(this.currentLine, this.cursor);
                this.cursor--;
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