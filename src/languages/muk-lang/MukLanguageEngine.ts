import AstNode from "../../utilities/AstNode";
import Token from "../../utilities/Token";
import ILanguageEngine from "../language-abstractions/ILanguageEngine";

class MukLanguageEngine implements ILanguageEngine {
  Tokenise(input: string): Token[] {
    throw new Error(`Method not implemented, cannot process ${input}.`);
  }
  Parse(tokenList: Token[]): AstNode {
    throw new Error(`Method not implemented, cannot process ${tokenList}.`);
  }
  AnalyseSemantics(root: AstNode): void {
    throw new Error(`Method not implemented, cannot process ${root}.`);
  }
  Interpret(root: AstNode): string {
    throw new Error(`Method not implemented, cannot process ${root}.`);
  }

  Execute(_: string[]): string {
    return "lol";
  }
}

export default MukLanguageEngine;
