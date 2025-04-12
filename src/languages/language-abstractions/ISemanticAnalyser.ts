import AstNode from "../../utilities/AstNode";

interface ISemanticAnalyser {
  AnalyseSemantics(root: AstNode): void;
}

export default ISemanticAnalyser;
