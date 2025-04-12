import ILanguageEngine from "./language-abstractions/ILanguageEngine";

interface ILanguageService {
  engine: ILanguageEngine;
  Execute(input: string): string;
}

export default ILanguageService;
