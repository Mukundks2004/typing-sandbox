import ILanguageService from "../languages/language-abstractions/ILanguageService";

interface IReplService {
  languageService: ILanguageService;
  ChangeLanguageService(newLanguage: string): void;
  Process(input: string[]): string;
  CurrentCommandIsLatest(): boolean;
  CurrentCommandIsOldest(): boolean;
  MoveToNextNewerCommand(): void;
  MoveToPreviousOlderCommand(): void;
  GetCurrentCommand(): string[];
  PushCommand(input: string[]): void;
  PrintDebugInfo(): void;
}

export default IReplService;
