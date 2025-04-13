import ILanguageEngine from "./ILanguageEngine";

interface ILanguageService {
  engine: ILanguageEngine;
  Execute(input: string): string;
}

export default ILanguageService;
