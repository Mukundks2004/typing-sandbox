import ILanguageService from "../languages/language-abstractions/ILanguageService";
import MukLanguageService from "../languages/muk-lang/MukLanguageService";
import IReplService from "./IReplService";

class ReplService implements IReplService {
  languageService: ILanguageService;
  history: string[][] = [];
  stackPointer: number = 0;

  constructor() {
    this.languageService = new MukLanguageService();
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

  ChangeLanguageService(newLanguage: string): void {
    switch (newLanguage) {
      case "Muk":
        this.languageService = new MukLanguageService();
        break;
      default:
        break;
    }
  }

  Process(input: string[]): string {
    console.log(input.join(""));
    return input.join("\n") + "\n";
  }

  PrintDebugInfo(): void {
    console.log("================");
    console.log("his", this.history);
    console.log("sp", this.stackPointer);
    console.log("================");
  }
}

export default ReplService;
