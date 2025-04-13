import ILanguageService from "../language-abstractions/ILanguageService";
import ILanguageEngine from "../language-abstractions/ILanguageEngine";
import MukLanguageEngine from "../muk-lang/MukLanguageEngine";

class MukLanguageService implements ILanguageService {
  engine: ILanguageEngine;

  constructor() {
    this.engine = new MukLanguageEngine();
  }

  Execute(input: string): string {
    console.log(input);
    return input;
  }
}

export default MukLanguageService;
