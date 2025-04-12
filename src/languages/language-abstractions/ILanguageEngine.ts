import IInterpreter from "./IInterpreter";
import ILexicalAnalyser from "./ILexicalAnalyser";
import ISemanticAnalyser from "./ISemanticAnalyser";
import ISyntacticAnalyser from "./ISyntacticAnalyser";

interface ILanguageEngine
  extends ILexicalAnalyser,
    ISyntacticAnalyser,
    ISemanticAnalyser,
    IInterpreter {}

export default ILanguageEngine;
