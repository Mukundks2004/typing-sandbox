import ILanguageEngine from "../language-abstractions/ILanguageEngine";
import MukLanguageEngine from "../muk-lang/MukLanguageEngine";

export default class LanguageFactory {
  GetLanguageEngineFromString(languageName: string): ILanguageEngine {
    switch (languageName) {
      case "Muk":
        return new MukLanguageEngine();
      default:
        return new MukLanguageEngine();
    }
  }
}
