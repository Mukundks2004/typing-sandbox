import AstNode from "../../utilities/AstNode";
import Token from "../../utilities/Token";

interface ISyntacticAnalyser {
  Parse(tokenList: Token[]): AstNode;
}

export default ISyntacticAnalyser;
