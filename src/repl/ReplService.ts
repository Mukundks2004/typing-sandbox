import LanguageFactory from "../languages/factory/LanguageFactory";
import ILanguageEngine from "../languages/language-abstractions/ILanguageEngine";
import IReplService from "./IReplService";

class ReplService implements IReplService {
  languageEngine: ILanguageEngine;
  history: string[][] = [];
  stackPointer: number = 0;
  languageFactory: LanguageFactory;

  constructor(language: string) {
    this.languageFactory = new LanguageFactory();
    this.languageEngine =
      this.languageFactory.GetLanguageEngineFromString(language);
  }

  Reset(): void {
    this.history = [];
    this.stackPointer = 0;
  }

  ChangeLanguage(newLang: string, keepHistory: boolean = false): void {
    this.languageEngine =
      this.languageFactory.GetLanguageEngineFromString(newLang);
    if (!keepHistory) {
      this.Reset();
    }
  }

  CurrentCommandIsLatest(): boolean {
    if (this.history.length === 0) {
      return true;
    }
    return this.stackPointer >= this.history.length - 1;
  }
  CurrentCommandIsOldest(): boolean {
    if (this.history.length === 0) {
      return true;
    }
    return this.stackPointer <= 0;
  }

  MoveToNextNewerCommand(): void {
    if (this.stackPointer < this.history.length - 1) {
      this.stackPointer++;
    }
  }
  MoveToPreviousOlderCommand(): void {
    if (this.stackPointer > 0) {
      this.stackPointer--;
    }
  }
  GetCurrentCommand(): string[] {
    return this.history[this.stackPointer].slice();
  }
  PushCommand(input: string[]): void {
    this.history.push(input);
    this.stackPointer = this.history.length;
  }

  Process(input: string[]): string {
    return this.languageEngine.Execute(input) + "\n";
  }

  PrintDebugInfo(): void {
    console.log("================");
    console.log("his", this.history);
    console.log("sp", this.stackPointer);
    console.log("================");
  }
}

export default ReplService;
