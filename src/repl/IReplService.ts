import ILanguageEngine from "../languages/language-abstractions/ILanguageEngine";

interface IReplService {
  languageEngine: ILanguageEngine;
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
