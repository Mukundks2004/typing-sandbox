import CSharpRepl from "./CSharpRepl";
import IRepl from "./IRepl";
import IReplManager from "./IReplManager";

function removeNthCharacter(str: string, n: number): string {
    return str.slice(0, n) + str.slice(n + 1);
}

function insertString(original: string, insert: string, index: number): string {
    return original.slice(0, index) + insert + original.slice(index);
}

class CSharpReplManager implements IReplManager {
    activeRepl: IRepl = new CSharpRepl();
    prompt: string = "$ ";
    stackPointer: number = 0;

    currentLine: string = "";
    braceStack: string[] = [];
    oppositeBrace: any = {'}': '{', ')': '(', ']': '['}
    cursor: number = 0;

    Clear(): void{
        this.stackPointer = 0;
    }

    ReceiveKey(key: string): string {
        if (this.cursor === 80 && key !== "\r") {
            return "";
        }
        if (key === "\r") {
            if (this.braceStack.length !== 0) {
                this.cursor += 2;
                this.currentLine += '\n\t';
                console.log('p');
                return '\n' + '\t'.repeat(this.braceStack.length);
            }
            if (!this.currentLine.match(/^\s*$/)) {
                this.activeRepl.history.push(this.currentLine);
            }
            const temp = this.currentLine;
            this.currentLine = "";
            this.cursor = 0;
            this.stackPointer = this.activeRepl.history.length;
            return "\n" + this.activeRepl.Process(temp) + this.prompt;
        }
        if (key === '\x1B[A') {
            if (this.stackPointer > 0) {
                this.stackPointer--;
                this.cursor = this.activeRepl.history[this.stackPointer].length;
                this.currentLine =  this.activeRepl.history[this.stackPointer]
                return "\x1b[1M" + this.prompt + this.activeRepl.history[this.stackPointer];
            }
            return "";
        }
        if (key === '\x1B[B') {
            if (this.stackPointer < this.activeRepl.history.length - 1) {
                this.stackPointer++;
                this.cursor = this.activeRepl.history[this.stackPointer].length;
                this.currentLine =  this.activeRepl.history[this.stackPointer]
                return "\x1b[1M" + this.prompt + this.activeRepl.history[this.stackPointer];
            }
            return "";
        }
        if (key === '\x1B[C') {
            if (this.cursor < this.currentLine.length) {
                this.cursor++;
                return "\x1B[C";
            }
            return "";
        }
        if (key === '\x1B[D') {
            if (this.cursor > 0) {
                this.cursor--;
                return '\x1B[D';
            }
            return "";
        }
        if (key === '\x7F') {
            if (this.cursor > 0) {
                this.currentLine = removeNthCharacter(this.currentLine, this.cursor - 1);
                this.cursor--;
                return "\x1B[D\x1b[P";
            }
            return "";
        }
        if (key === '\x1B[3~') {
            if (this.cursor < this.currentLine.length) {
                this.currentLine = removeNthCharacter(this.currentLine, this.cursor);
                return "\x1b[P";
            }
            return "";
        }
        if ('({['.includes(key)) {
            this.braceStack.push(key);
        }
        if (')}]'.includes(key)) {
            if (this.braceStack.length === 0 || this.oppositeBrace[this.braceStack[this.braceStack.length - 1]] !== key) {
                return key + "\n" + 'Unexpected bracket\n' + this.prompt;
            }
            this.braceStack.pop();
        }

        this.currentLine = insertString(this.currentLine, key, this.cursor);
        this.cursor++;
        return '\x1b[1@' + key;
    }
}

export default CSharpReplManager;