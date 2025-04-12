import AstNode from "../../utilities/AstNode";

interface IInterpreter {
  Interpret(root: AstNode): string;
}

export default IInterpreter;
