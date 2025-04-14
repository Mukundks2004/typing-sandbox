import IAstNode from "../../utilities/IAstNode";
import IToken from "../../utilities/IToken";

interface ISyntacticAnalyser {
  Parse(tokenList: IToken[]): IAstNode;
}

export default ISyntacticAnalyser;
