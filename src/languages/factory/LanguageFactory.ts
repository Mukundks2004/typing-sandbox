import ILanguageService from "../language-abstractions/ILanguageService";
import MukLanguageService from "../muk-lang/MukLanguageService";

export default class LanguageFactory {
  GetLanguageServiceFromString(languageName: string): ILanguageService {
    switch (languageName) {
      case "Muk":
        return new MukLanguageService();
      default:
        return new MukLanguageService();
    }
  }
}
