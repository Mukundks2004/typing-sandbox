import {
  TAB_STOP_WIDTH,
  UP,
  DOWN,
  LEFT,
  RIGHT,
  INSERT_CHAR,
  TAB,
  ALT_ENTER,
  EMPTY,
  DELETE_LINE,
  DELETE_CHAR,
  SPACE,
  NEWLINE,
  CARRIAGE_RETURN,
  BACKSPACE,
  DELETE_KEY,
  TERMINAL_WIDTH,
} from "../constants/SandboxConstants";

import IReplService from "../repl/IReplService";
import ReplService from "../repl/ReplService";
import ITerminalService from "./ITerminalService";

class TerminalService implements ITerminalService {
  replService: IReplService;
  prompt: string;
  promptLen: number;
  lineLength: number;
  cursorX: number = 0;
  cursorY: number = 0;
  currentLine: string[] = [EMPTY];

  constructor(
    providedPrompt: string,
    lineLength: number,
    defaultLanguage: string
  ) {
    this.prompt = providedPrompt;
    this.lineLength = lineLength;
    this.promptLen = this.prompt.length;
    this.replService = new ReplService(defaultLanguage);
  }

  onKey(key: { key: string; domEvent: KeyboardEvent }): string {
    const pressedKey = key.key;
    if (pressedKey === UP) {
      if (!this.replService.CurrentCommandIsOldest()) {
        const linesToGoUntilEndBeforeUpKeyPressed =
          this.currentLine.length - this.cursorY - 1;
        const linesInCommandBeforeUpKeyPressed = this.currentLine.length;
        this.replService.MoveToPreviousOlderCommand();
        this.currentLine = this.replService.GetCurrentCommand();
        const result =
          DOWN.repeat(linesToGoUntilEndBeforeUpKeyPressed) +
          (DELETE_LINE + UP).repeat(linesInCommandBeforeUpKeyPressed - 1) +
          DELETE_LINE +
          this.prompt +
          this.currentLine.join(NEWLINE + SPACE.repeat(this.promptLen));
        this.cursorY = this.currentLine.length - 1;
        this.cursorX = this.currentLine[this.cursorY].length;
        return result;
      }
      return EMPTY;
    }
    if (pressedKey === DOWN) {
      if (!this.replService.CurrentCommandIsLatest()) {
        const linesToGoUntilEndBeforeDownKeyPressed =
          this.currentLine.length - this.cursorY - 1;
        const linesInCommandBeforeDownKeyPressed = this.currentLine.length;
        this.replService.MoveToNextNewerCommand();
        this.currentLine = this.replService.GetCurrentCommand();
        const result =
          DOWN.repeat(linesToGoUntilEndBeforeDownKeyPressed) +
          (DELETE_LINE + UP).repeat(linesInCommandBeforeDownKeyPressed - 1) +
          DELETE_LINE +
          this.prompt +
          this.currentLine.join(NEWLINE + SPACE.repeat(this.promptLen));
        this.cursorY = this.currentLine.length - 1;
        this.cursorX = this.currentLine[this.cursorY].length;
        return result;
      }
      return EMPTY;
    }
    if (pressedKey === ALT_ENTER) {
      const ogX = this.cursorX;
      const ogY = this.cursorY;
      const endY = this.currentLine.length - 1;
      const endX = this.currentLine[endY].length;
      const distanceToGoDown = endY - ogY;
      this.currentLine = splitStringAt(
        this.currentLine,
        this.cursorY,
        this.cursorX
      );
      this.cursorX = 0;
      this.cursorY++;
      const secondHalfOfSplitString = this.currentLine[this.cursorY];
      const result =
        CARRIAGE_RETURN +
        DOWN.repeat(distanceToGoDown) +
        RIGHT.repeat(endX) +
        NEWLINE +
        (DELETE_LINE + UP).repeat(distanceToGoDown + 1) +
        RIGHT.repeat(this.promptLen + ogX) +
        DELETE_CHAR.repeat(secondHalfOfSplitString.length) +
        NEWLINE +
        SPACE.repeat(this.promptLen) +
        this.currentLine
          .slice(this.cursorY)
          .join(NEWLINE + SPACE.repeat(this.promptLen)) +
        CARRIAGE_RETURN +
        UP.repeat(distanceToGoDown) +
        RIGHT.repeat(this.promptLen);

      return result;
    }
    if (pressedKey === CARRIAGE_RETURN) {
      if (isJustWhitespace(this.currentLine)) {
        this.currentLine = [EMPTY];
        this.cursorX = 0;
        this.cursorY = 0;
        return NEWLINE + this.prompt;
      }
      const totalLength = this.currentLine.length;
      const lengthOfLastLineInCurrentLine =
        this.currentLine[this.currentLine.length - 1].length;
      this.currentLine = removeWhitespaceElements(this.currentLine);
      this.replService.PushCommand(this.currentLine);
      const result = this.replService.Process(this.currentLine);
      const linesToGo = totalLength - this.cursorY - 1;
      this.currentLine = [EMPTY];
      this.cursorX = 0;
      this.cursorY = 0;
      return (
        DOWN.repeat(linesToGo) +
        CARRIAGE_RETURN +
        RIGHT.repeat(lengthOfLastLineInCurrentLine) +
        NEWLINE +
        result +
        this.prompt
      );
    }
    if (pressedKey === BACKSPACE) {
      if (this.cursorX > 0) {
        this.currentLine[this.currentLine.length - 1] = removeNthCharacter(
          this.currentLine[this.currentLine.length - 1],
          this.cursorX - 1
        );
        this.cursorX--;
        return LEFT + DELETE_CHAR;
      }
      if (this.currentLine.length > 1) {
        this.currentLine = this.currentLine.slice(0, -1);
        this.cursorX = this.currentLine[this.currentLine.length - 1].length;
        this.cursorY--;
        return DELETE_LINE + UP + RIGHT.repeat(this.cursorX + this.promptLen);
      }
      return EMPTY;
    }
    if (pressedKey === TAB) {
      this.currentLine[this.cursorY] =
        this.currentLine[this.cursorY].slice(0, this.cursorX) +
        SPACE.repeat(TAB_STOP_WIDTH) +
        this.currentLine[this.cursorY].slice(this.cursorX);
      this.cursorX += TAB_STOP_WIDTH;
      return (INSERT_CHAR + SPACE).repeat(TAB_STOP_WIDTH);
    }
    if (pressedKey === RIGHT) {
      if (this.cursorX < this.currentLine[this.cursorY].length) {
        this.cursorX++;
        return RIGHT;
      }
      if (this.currentLine.length - 1 > this.cursorY) {
        this.cursorX = 0;
        this.cursorY++;
        return CARRIAGE_RETURN + DOWN + RIGHT.repeat(this.promptLen);
      }
      return EMPTY;
    }
    if (pressedKey === LEFT) {
      if (this.cursorX > 0) {
        this.cursorX--;
        return LEFT;
      }
      if (this.cursorY > 0) {
        this.cursorY--;
        this.cursorX = this.currentLine[this.cursorY].length;
        return (
          CARRIAGE_RETURN + UP + RIGHT.repeat(this.cursorX + this.promptLen)
        );
      }
      return EMPTY;
    }
    if (pressedKey === DELETE_KEY) {
      if (this.cursorX < this.currentLine[this.cursorY].length) {
        this.currentLine[this.cursorY] = removeNthCharacter(
          this.currentLine[this.cursorY],
          this.cursorX
        );
        return DELETE_CHAR;
      }
      if (this.cursorY < this.currentLine.length) {
        const charCountBeforeDelete = this.currentLine[this.cursorY].length;
        const charCountOfNextLine = this.currentLine[this.cursorY + 1].length;
        this.currentLine = mergeAtIndex(this.currentLine, this.cursorY);
        return (
          DOWN +
          DELETE_LINE +
          UP +
          RIGHT.repeat(charCountBeforeDelete + this.promptLen) +
          this.currentLine[this.cursorY].slice(
            charCountBeforeDelete,
            this.currentLine[this.cursorY].length
          ) +
          LEFT.repeat(charCountOfNextLine)
        );
      }
      return EMPTY;
    }

    const thisLineLength = this.currentLine[this.cursorY].length;
    if (thisLineLength < TERMINAL_WIDTH - this.promptLen - 1) {
      this.currentLine[this.cursorY] = insertString(
        this.currentLine[this.cursorY],
        pressedKey,
        this.cursorX
      );

      this.cursorX++;
      return INSERT_CHAR + pressedKey;
    }
    return EMPTY;
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
