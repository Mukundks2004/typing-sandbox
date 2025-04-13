import { EMPTY } from "../constants/SandboxConstants";
import LanguageFactory from "../languages/factory/LanguageFactory";
import ILanguageService from "../languages/language-abstractions/ILanguageService";
import IReplService from "./IReplService";

class ReplService implements IReplService {
  languageService: ILanguageService;
  history: string[][] = [];
  stackPointer: number = 0;
  languageFactory: LanguageFactory;

  constructor(language: string) {
    this.languageFactory = new LanguageFactory();
    this.languageService =
      this.languageFactory.GetLanguageServiceFromString(language);
  }

  Reset(): void {
    this.history = [];
    this.stackPointer = 0;
  }

  ChangeLanguage(newLang: string, keepHistory: boolean = false): void {
    this.languageService =
      this.languageFactory.GetLanguageServiceFromString(newLang);
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
    return this.languageService.Execute(input.join("\n")) + "\n";
  }

  PrintDebugInfo(): void {
    console.log("================");
    console.log("his", this.history);
    console.log("sp", this.stackPointer);
    console.log("================");
  }
}

export default ReplService;
