import Token from "../../utilities/Token";

interface ILexicalAnalyser {
  Tokenise(input: string): Token[];
}

export default ILexicalAnalyser;
