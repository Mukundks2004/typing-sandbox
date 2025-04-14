import IAstNode from "../../utilities/IAstNode";

interface ISemanticAnalyser {
  AnalyseSemantics(root: IAstNode): void;
}

export default ISemanticAnalyser;
