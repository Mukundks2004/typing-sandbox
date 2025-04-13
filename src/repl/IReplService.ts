import ILanguageService from "../languages/language-abstractions/ILanguageService";

interface IReplService {
  languageService: ILanguageService;
  Process(input: string[]): string;
  CurrentCommandIsLatest(): boolean;
  CurrentCommandIsOldest(): boolean;
  MoveToNextNewerCommand(): void;
  MoveToPreviousOlderCommand(): void;
  GetCurrentCommand(): string[];
  PushCommand(input: string[]): void;
  PrintDebugInfo(): void;
  Reset(): void;
  ChangeLanguage(newLang: string, keepHistory?: boolean): void;
}

export default IReplService;
