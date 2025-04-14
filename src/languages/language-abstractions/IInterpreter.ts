import IAstNode from "../../utilities/IAstNode";

interface IInterpreter {
  Interpret(root: IAstNode): string;
}

export default IInterpreter;
