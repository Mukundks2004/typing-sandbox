import { TAB_STOP_WIDTH } from "../constants/SandboxConstants";
import IReplService from "../repl/IReplService";
import ReplService from "../repl/ReplService";
import ITerminalService from "./ITerminalService";

class TerminalService implements ITerminalService {
  replService: IReplService = new ReplService();
  prompt: string;
  lineLength: number;
  cursorX: number = 0;
  cursorY: number = 0;
  currentLine: string[] = [""];

  constructor(providedPrompt = "$ ", lineLength: number) {
    this.prompt = providedPrompt;
    this.lineLength = lineLength;
  }

  onKey(key: { key: string; domEvent: KeyboardEvent }): string {
    const pressedKey = key.key;
    // up
    if (pressedKey === "\x1B[A") {
      if (!this.replService.CurrentCommandIsOldest()) {
        const linesToGoUntilEndBeforeUpKeyPressed =
          this.currentLine.length - this.cursorY - 1;
        const linesInCommandBeforeUpKeyPressed = this.currentLine.length;
        this.replService.MoveToPreviousOlderCommand();
        this.currentLine = this.replService.GetCurrentCommand();
        const result =
          "\x1B[B".repeat(linesToGoUntilEndBeforeUpKeyPressed) +
          "\x1b[1M\x1B[A".repeat(linesInCommandBeforeUpKeyPressed - 1) +
          "\x1b[1M" +
          this.prompt +
          this.currentLine.join("\n" + " ".repeat(this.prompt.length));
        this.cursorY = this.currentLine.length - 1;
        this.cursorX = this.currentLine[this.cursorY].length;
        return result;
      }
      return "";
    }
    // down
    if (pressedKey === "\x1B[B") {
      if (!this.replService.CurrentCommandIsLatest()) {
        const linesToGoUntilEndBeforeDownKeyPressed =
          this.currentLine.length - this.cursorY - 1;
        const linesInCommandBeforeDownKeyPressed = this.currentLine.length;
        this.replService.MoveToNextNewerCommand();
        this.currentLine = this.replService.GetCurrentCommand();
        const result =
          "\x1B[B".repeat(linesToGoUntilEndBeforeDownKeyPressed) +
          "\x1b[1M\x1B[A".repeat(linesInCommandBeforeDownKeyPressed - 1) +
          "\x1b[1M" +
          this.prompt +
          this.currentLine.join("\n" + " ".repeat(this.prompt.length));
        this.cursorY = this.currentLine.length - 1;
        this.cursorX = this.currentLine[this.cursorY].length;
        return result;
      }
      return "";
    }
    if (pressedKey === "\x1B\r") {
      this.currentLine = splitStringAt(
        this.currentLine,
        this.cursorY,
        this.cursorX
      );
      this.cursorX = 0;
      this.cursorY++;
      const secondHalfOfSplitString = this.currentLine[this.cursorY];

      const result =
        "\x1b[P".repeat(secondHalfOfSplitString.length) +
        "\x1B[B\r" +
        "\x1B[L" +
        " ".repeat(this.prompt.length) +
        secondHalfOfSplitString +
        "\x1B[D".repeat(secondHalfOfSplitString.length);

      console.log("xy", this.cursorX, this.cursorY, this.currentLine);
      return result;
    }
    if (pressedKey === "\r") {
      if (isJustWhitespace(this.currentLine)) {
        this.currentLine = [""];
        this.cursorX = 0;
        this.cursorY = 0;
        return "\n" + this.prompt;
      }
      const whitespaceCount = countWhitespaceElements(this.currentLine);
      this.currentLine = removeWhitespaceElements(this.currentLine);
      this.replService.PushCommand(this.currentLine);
      const result = this.replService.Process(this.currentLine);
      const linesToGo =
        this.currentLine.length + whitespaceCount - this.cursorY;
      this.currentLine = [""];
      this.cursorX = 0;
      this.cursorY = 0;
      return "\x1B[B".repeat(linesToGo) + "\r" + result + this.prompt;
    }
    if (pressedKey === "\x7F") {
      if (this.cursorX > 0) {
        this.currentLine[this.currentLine.length - 1] = removeNthCharacter(
          this.currentLine[this.currentLine.length - 1],
          this.cursorX - 1
        );
        this.cursorX--;
        return "\x1B[D\x1b[P";
      }
      if (this.currentLine.length > 1) {
        this.currentLine = this.currentLine.slice(0, -1);
        this.cursorX = this.currentLine[this.currentLine.length - 1].length;
        console.log("cursor:", this.cursorX);
        this.cursorY--;
        return (
          "\x1b[1M" +
          "\x1B[A" +
          "\x1B[C".repeat(this.cursorX + this.prompt.length)
        );
      }
      return "";
    }
    if (pressedKey === "\t") {
      this.cursorX += TAB_STOP_WIDTH;
      this.currentLine[this.currentLine.length - 1] =
        this.currentLine[this.currentLine.length - 1] +
        " ".repeat(TAB_STOP_WIDTH);
      return " ".repeat(TAB_STOP_WIDTH);
    }
    if (pressedKey === "\x1B[C") {
      if (this.cursorX < this.currentLine[this.cursorY].length) {
        this.cursorX++;
        return "\x1B[C";
      }
      if (this.currentLine.length - 1 > this.cursorY) {
        this.cursorX = 0;
        this.cursorY++;
        const scroll = true ? "\x1b[1T" : "";
        return "\r\x1B[B" + "\x1B[C".repeat(this.prompt.length);
      }
      return "";
    }
    if (pressedKey === "\x1B[D") {
      if (this.cursorX > 0) {
        this.cursorX--;
        return "\x1B[D";
      }
      if (this.cursorY > 0) {
        this.cursorY--;
        this.cursorX = this.currentLine[this.cursorY].length;
        return "\r\x1B[A" + "\x1B[C".repeat(this.cursorX + this.prompt.length);
      }
      return "";
    }
    if (pressedKey === "\x1B[3~") {
      if (this.cursorX < this.currentLine[this.cursorY].length) {
        this.currentLine[this.cursorY] = removeNthCharacter(
          this.currentLine[this.cursorY],
          this.cursorX
        );
        return "\x1b[P";
      }
      if (this.cursorY < this.currentLine.length) {
        const charCountBeforeDelete = this.currentLine[this.cursorY].length;
        const charCountOfNextLine = this.currentLine[this.cursorY + 1].length;
        this.currentLine = mergeAtIndex(this.currentLine, this.cursorY);
        return (
          "\x1B[B\x1b[1M\x1B[A" +
          "\x1B[C".repeat(charCountBeforeDelete + this.prompt.length) +
          this.currentLine[this.cursorY].slice(
            charCountBeforeDelete,
            this.currentLine[this.cursorY].length
          ) +
          "\x1B[D".repeat(charCountOfNextLine)
        );
      }
      console.log("at the end");
      return "";
    }

    this.currentLine[this.cursorY] = insertString(
      this.currentLine[this.cursorY],
      pressedKey,
      this.cursorX
    );

    this.cursorX++;

    return "\x1b[1@" + pressedKey;
  }
}

function removeNthCharacter(str: string, n: number): string {
  return str.slice(0, n) + str.slice(n + 1);
}

function insertString(original: string, insert: string, index: number): string {
  return original.slice(0, index) + insert + original.slice(index);
}

function isJustWhitespace(arr: string[]): boolean {
  return arr.every((str) => str.trim() === "");
}

function removeWhitespaceElements(arr: string[]) {
  return arr.filter((str) => str.trim() !== "");
}

function countWhitespaceElements(arr: string[]) {
  return arr.filter((str) => str.trim() === "").length;
}

function mergeAtIndex(arr: string[], index: number) {
  const merged = arr[index] + arr[index + 1];
  return [...arr.slice(0, index), merged, ...arr.slice(index + 2)];
}

function splitStringAt(arr: string[], strIndex: number, charIndex: number) {
  const original = arr[strIndex];

  const firstPart = original.slice(0, charIndex);
  const secondPart = original.slice(charIndex);

  return [
    ...arr.slice(0, strIndex),
    firstPart,
    secondPart,
    ...arr.slice(strIndex + 1),
  ];
}

export default TerminalService;
