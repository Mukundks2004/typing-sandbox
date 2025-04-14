import IAstNode from "../../utilities/IAstNode";

interface ILexicalAnalyser {
  Tokenise(input: string): IAstNode[];
}

export default ILexicalAnalyser;
