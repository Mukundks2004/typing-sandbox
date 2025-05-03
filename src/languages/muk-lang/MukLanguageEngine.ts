import { EMPTY, SPACE } from "../../constants/SandboxConstants";
import IAstNode from "../../utilities/IAstNode";
import IToken from "../../utilities/IToken";
import ILanguageEngine from "../language-abstractions/ILanguageEngine";

// the goal of this wi is to make it so that variables have to be declared before they can be used

const superContext: Map<string, MukLangData> = new Map<string, MukLangData>();

class LexError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LexError";
  }
}

class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParseError";
  }
}

class SemanticError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SemanticError";
  }
}

class InterpretError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InterpretError";
  }
}

enum VarType {
  int = "int",
  bool = "bool",
}

enum TokenType {
  print = "print",
  id = "id",
  num = "num",
  low_op = "low_op",
  high_op = "high_op",
  bool_op = "bool_op",
  rel_op = "rel_op",
  bool_lit = "bool_lit",
  open_bracket = "open_bracket",
  close_bracket = "close_bracket",
  semicolon = "sem",
  whitespace = "whitespace",
  assignment = "assignment",
  eof = "eof",
  epsilon = "epsilon",
  int_lit = "int",
  bool = "bool",
}

enum LabelType {
  START = "START",
  LOS = "LOS",
  STAT = "STAT",
  TYPE = "TYPE",
  POS_ASS = "POS_ASS",
  EXPR = "EXPR",
  BOOLEXPR = "BOOLEXPR",
  RELEXPR = "RELEXPR",
  RELEXPRP = "RELEXPRP",
  ARITHEXPR = "ARITHEXPR",
  ARITHEXPRP = "ARITHEXPRP",
  TERM = "TERM",
  TERMP = "TERMP",
  FACTOR = "FACTOR",
  TERMINAL = "TERMINAL",
}

interface MukLangData {
  type: VarType;
  intValue: null | number;
}

function isLabel(value: LabelType | TokenType): value is LabelType {
  return Object.values(LabelType).includes(value as LabelType);
}

function datatypeStringToEnum(datatypeName: string): VarType {
  switch (datatypeName) {
    case "int":
      return VarType.int;
    case "bool":
      return VarType.bool;
    default:
      throw new Error(`Bad datatype: ${datatypeName}`);
  }
}

const rules = [
  { regex: /^int\b/, type: TokenType.int_lit },
  { regex: /^bool\b/, type: TokenType.bool_lit },
  { regex: /^>=|^<=|^<|^>/, type: TokenType.rel_op },
  { regex: /^!=|^==|^&&|^\|\|/, type: TokenType.bool_op },
  { regex: /^true\b/, type: TokenType.bool },
  { regex: /^false\b/, type: TokenType.bool },
  { regex: /^print\b/, type: TokenType.print },
  { regex: /^[a-zA-Z_][a-zA-Z0-9_]*/, type: TokenType.id },
  { regex: /^\d+/, type: TokenType.num },
  { regex: /^[+\-]/, type: TokenType.low_op },
  { regex: /^[*/]/, type: TokenType.high_op },
  { regex: /^%/, type: TokenType.high_op },
  { regex: /^=/, type: TokenType.assignment },
  { regex: /^\(/, type: TokenType.open_bracket },
  { regex: /^\)/, type: TokenType.close_bracket },
  { regex: /^;/, type: TokenType.semicolon },
  { regex: /^\s+/, type: TokenType.whitespace },
  { regex: /^\$/, type: TokenType.eof },
];

class MukLangAstNode implements IAstNode {
  label: LabelType;
  token: MukLangToken | null;
  parent: MukLangAstNode | null;
  children: MukLangAstNode[] = [];

  constructor(
    label: LabelType,
    token: MukLangToken | null,
    parent: MukLangAstNode | null
  ) {
    this.label = label;
    this.token = token;
    this.parent = parent;
  }

  addChild(child: MukLangAstNode) {
    this.children.push(child);
  }

  addChildToStart(child: MukLangAstNode) {
    this.children.unshift(child);
  }

  printDebug(indent = 0) {
    if (this.label === LabelType.TERMINAL) {
      console.log(
        "-".repeat(indent) +
          this.label +
          " " +
          this.token!.tokenType +
          " " +
          this.token!.value
      );
    } else {
      console.log("-".repeat(indent) + this.label);
    }
    this.children.forEach((child) => {
      child.printDebug(indent + 1);
    });
  }
}

const parseTable: Map<
  LabelType,
  Map<TokenType, (TokenType | LabelType)[]>
> = new Map();

parseTable.set(
  LabelType.START,
  new Map([
    [TokenType.eof, [LabelType.LOS, TokenType.eof]],
    [TokenType.print, [LabelType.LOS, TokenType.eof]],
    [TokenType.id, [LabelType.LOS, TokenType.eof]],
    [TokenType.int_lit, [LabelType.LOS, TokenType.eof]],
    [TokenType.bool_lit, [LabelType.LOS, TokenType.eof]],
  ])
);

parseTable.set(
  LabelType.LOS,
  new Map([
    [TokenType.eof, [TokenType.epsilon]],
    [TokenType.print, [LabelType.STAT, LabelType.LOS]],
    [TokenType.id, [LabelType.STAT, LabelType.LOS]],
    [TokenType.int_lit, [LabelType.STAT, LabelType.LOS]],
    [TokenType.bool_lit, [LabelType.STAT, LabelType.LOS]],
  ])
);

parseTable.set(
  LabelType.STAT,
  new Map([
    [TokenType.print, [TokenType.print, LabelType.EXPR, TokenType.semicolon]],
    [
      TokenType.id,
      [TokenType.id, TokenType.assignment, LabelType.EXPR, TokenType.semicolon],
    ],
    [
      TokenType.int_lit,
      [LabelType.TYPE, TokenType.id, LabelType.POS_ASS, TokenType.semicolon],
    ],
    [
      TokenType.bool_lit,
      [LabelType.TYPE, TokenType.id, LabelType.POS_ASS, TokenType.semicolon],
    ],
  ])
);

parseTable.set(
  LabelType.TYPE,
  new Map([
    [TokenType.int_lit, [TokenType.int_lit]],
    [TokenType.bool_lit, [TokenType.bool_lit]],
  ])
);

parseTable.set(
  LabelType.POS_ASS,
  new Map([
    [TokenType.semicolon, [TokenType.epsilon]],
    [TokenType.assignment, [TokenType.assignment, LabelType.EXPR]],
  ])
);

parseTable.set(
  LabelType.EXPR,
  new Map([
    [TokenType.id, [LabelType.RELEXPR, LabelType.BOOLEXPR]],
    [TokenType.bool, [LabelType.RELEXPR, LabelType.BOOLEXPR]],
    [TokenType.open_bracket, [LabelType.RELEXPR, LabelType.BOOLEXPR]],
    [TokenType.num, [LabelType.RELEXPR, LabelType.BOOLEXPR]],
  ])
);

parseTable.set(
  LabelType.BOOLEXPR,
  new Map([
    [TokenType.semicolon, [TokenType.epsilon]],
    [
      TokenType.bool_op,
      [TokenType.bool_op, LabelType.RELEXPR, LabelType.BOOLEXPR],
    ],
    [TokenType.close_bracket, [TokenType.epsilon]],
  ])
);

parseTable.set(
  LabelType.RELEXPR,
  new Map([
    [TokenType.id, [LabelType.ARITHEXPR, LabelType.RELEXPRP]],
    [TokenType.open_bracket, [LabelType.ARITHEXPR, LabelType.RELEXPRP]],
    [TokenType.num, [LabelType.ARITHEXPR, LabelType.RELEXPRP]],
    [TokenType.bool, [TokenType.bool]],
  ])
);

parseTable.set(
  LabelType.RELEXPRP,
  new Map([
    [TokenType.semicolon, [TokenType.epsilon]],
    [TokenType.bool_op, [TokenType.epsilon]],
    [TokenType.close_bracket, [TokenType.epsilon]],
    [TokenType.rel_op, [TokenType.rel_op, LabelType.ARITHEXPR]],
  ])
);

parseTable.set(
  LabelType.ARITHEXPR,
  new Map([
    [TokenType.id, [LabelType.TERM, LabelType.ARITHEXPRP]],
    [TokenType.open_bracket, [LabelType.TERM, LabelType.ARITHEXPRP]],
    [TokenType.num, [LabelType.TERM, LabelType.ARITHEXPRP]],
  ])
);

parseTable.set(
  LabelType.ARITHEXPRP,
  new Map([
    [TokenType.semicolon, [TokenType.epsilon]],
    [TokenType.bool_op, [TokenType.epsilon]],
    [TokenType.rel_op, [TokenType.epsilon]],
    [TokenType.close_bracket, [TokenType.epsilon]],
    [
      TokenType.low_op,
      [TokenType.low_op, LabelType.TERM, LabelType.ARITHEXPRP],
    ],
  ])
);

parseTable.set(
  LabelType.TERM,
  new Map([
    [TokenType.id, [LabelType.FACTOR, LabelType.TERMP]],
    [TokenType.open_bracket, [LabelType.FACTOR, LabelType.TERMP]],
    [TokenType.num, [LabelType.FACTOR, LabelType.TERMP]],
  ])
);

parseTable.set(
  LabelType.TERMP,
  new Map([
    [TokenType.semicolon, [TokenType.epsilon]],
    [TokenType.bool_op, [TokenType.epsilon]],
    [TokenType.rel_op, [TokenType.epsilon]],
    [TokenType.low_op, [TokenType.epsilon]],
    [TokenType.close_bracket, [TokenType.epsilon]],
    [TokenType.high_op, [TokenType.high_op, LabelType.FACTOR, LabelType.TERMP]],
  ])
);

parseTable.set(
  LabelType.FACTOR,
  new Map([
    [TokenType.id, [TokenType.id]],
    [TokenType.num, [TokenType.num]],
    [
      TokenType.open_bracket,
      [TokenType.open_bracket, LabelType.EXPR, TokenType.close_bracket],
    ],
  ])
);

class MukLangToken implements IToken {
  tokenType: TokenType;
  value: string | null;

  constructor(tokenType: TokenType, value: string | null) {
    this.tokenType = tokenType;
    this.value = value;
  }

  printDebug() {
    const value = this.value === null ? "" : ": " + this.value.toString();
    return "[" + this.tokenType + value + "]";
  }
}

class MukLanguageEngine implements ILanguageEngine {
  Tokenise(input: string): MukLangToken[] {
    const tokens: MukLangToken[] = [];
    let i = 0;

    while (i < input.length) {
      let chunk = input.slice(i);
      let matched = false;

      for (const rule of rules) {
        const match = chunk.match(rule.regex);
        if (match) {
          if (rule.type !== TokenType.whitespace) {
            if (
              rule.type === TokenType.num ||
              rule.type === TokenType.id ||
              rule.type === TokenType.low_op ||
              rule.type === TokenType.high_op ||
              rule.type === TokenType.int_lit ||
              rule.type === TokenType.bool
            ) {
              tokens.push(new MukLangToken(rule.type, match[0]));
            } else {
              tokens.push(new MukLangToken(rule.type, null));
            }
          }
          i += match[0].length;
          matched = true;
          break;
        }
      }

      if (!matched) {
        throw new LexError(`Unexpected token at position ${i}: ${chunk[0]}`);
      }
    }
    tokens.push(new MukLangToken(TokenType.eof, null));

    return tokens;
  }

  Parse(tokenList: MukLangToken[]): MukLangAstNode {
    var index = 0;
    var root = new MukLangAstNode(LabelType.START, null, null);
    var varStack: MukLangAstNode[] = [root];
    var currentNode: MukLangAstNode;

    while (varStack.length !== 0 && index < tokenList.length) {
      currentNode = varStack.pop()!;
      var currentStackSymbol = currentNode.label;
      if (currentStackSymbol === LabelType.TERMINAL) {
        let currentVarAsToken = currentNode.token!;
        if (currentVarAsToken.tokenType === tokenList[index].tokenType) {
          currentVarAsToken.value = tokenList[index].value;
          index++;
        } else {
          throw new ParseError(
            `Mismatch, expected: ${currentVarAsToken.tokenType} but was ${tokenList[index].tokenType}`
          );
        }
      } else {
        var currentTerminal = tokenList[index].tokenType;
        if (currentTerminal === TokenType.epsilon) {
          continue;
        }
        try {
          var symbolsToPush = parseTable
            .get(currentStackSymbol)!
            .get(currentTerminal);

          if (symbolsToPush === undefined) {
            throw new Error();
          }

          for (var symbol of [...symbolsToPush!].reverse()) {
            if (isLabel(symbol)) {
              var newNode = new MukLangAstNode(symbol, null, currentNode);
              currentNode.addChildToStart(newNode);
              varStack.push(newNode);
            } else {
              var newNode = new MukLangAstNode(
                LabelType.TERMINAL,
                new MukLangToken(symbol, null),
                currentNode
              );
              currentNode.addChildToStart(newNode);
              if (symbol !== TokenType.epsilon) {
                varStack.push(newNode);
              }
            }
          }
        } catch {
          throw new ParseError(
            `Entry not in table: ${currentStackSymbol}, ${currentTerminal}`
          );
        }
      }
    }
    if (index !== tokenList.length) {
      throw new ParseError("Contents leftover in tokens list");
    }
    if (varStack.length !== 0) {
      throw new ParseError("Expected more, varstack not empty");
    }
    return root;
  }

  AnalyseSemantics(_: MukLangAstNode): void {}

  Interpret(node: MukLangAstNode): string {
    const output = this.PerformProgramExecution(node, superContext);
    return output;
  }

  PerformProgramExecution(
    node: MukLangAstNode,
    context: Map<string, MukLangData>
  ): string {
    const output = this.PerformLos(node.children[0], context, EMPTY);
    return output;
  }

  PerformType(node: MukLangAstNode): VarType {
    return datatypeStringToEnum(node.children[0].token!.value!);
  }

  EvaluateFactor(
    node: MukLangAstNode,
    context: Map<string, MukLangData>
  ): MukLangData {
    if (node.children.length === 3) {
      return this.EvaluateExpression(node.children[1], context);
    } else if (node.children.length === 1) {
      const token = node.children[0].token!;
      if (token.tokenType === TokenType.num) {
        const factorValue: MukLangData = {
          type: VarType.int,
          intValue: +token.value!,
        };
        return factorValue;
      }
      if (token.tokenType === TokenType.id) {
        const varName = token.value!;
        if (context.has(varName)) {
          return context.get(varName)!;
        }
        throw new InterpretError(
          `NameError, following undefined: ${token.value}`
        );
      }
      throw new InterpretError(`Bad tokentype in factor: ${token.tokenType}`);
    }
    throw new InterpretError(
      `Wrong number of children in factor: ${node.children.length}`
    );
  }

  PerformLos(
    node: MukLangAstNode,
    context: Map<string, MukLangData>,
    output: string
  ): string {
    if (node.children.length === 1) {
      return output;
    } else if (node.children.length === 2) {
      output = this.PerformStat(node.children[0], context, output);
      output = this.PerformLos(node.children[1], context, output);
      return output;
    }
    throw new InterpretError(
      `Los has bad number of children: ${node.children.length}`
    );
  }

  PerformStat(
    node: MukLangAstNode,
    context: Map<string, MukLangData>,
    output: string
  ): string {
    const firstChild = node.children[0];
    if (firstChild.label === LabelType.TYPE) {
      this.PerformDecl(node, context);
    } else if (firstChild.token?.tokenType === TokenType.print) {
      // ASSUMES INT IS THE ONLY DATATYPE
      output +=
        this.EvaluateExpression(
          node.children[1],
          context
        ).intValue!.toString() + "\n";
    } else if (firstChild.token?.tokenType === TokenType.id) {
      this.PerformAssignment(node, context);
    } else {
      throw new InterpretError(`Stat encountered bad node: ${node.label}`);
    }
    return output;
  }

  PerformAssignment(
    node: MukLangAstNode,
    context: Map<string, MukLangData>
  ): void {
    const varName = node.children[0].token!.value!;
    if (context.has(varName)) {
      const initValue = this.EvaluateExpression(node.children[2], context);
      context.set(varName, initValue);
    } else {
      throw new InterpretError(`Unknown id ${varName}`);
    }
  }

  PerformDecl(node: MukLangAstNode, context: Map<string, MukLangData>): void {
    const type = this.PerformType(node.children[0]);
    const varName = node.children[1].token!.value!;

    context.set(varName, { type: type, intValue: 0 });
    this.PerformPosAss(varName, node.children[2], context);
  }

  PerformPosAss(
    varName: string,
    node: MukLangAstNode,
    context: Map<string, MukLangData>
  ): void {
    if (node.children.length === 1) {
      return;
    } else {
      if (context.has(varName)) {
        const initValue = this.EvaluateExpression(node.children[1], context);
        context.set(varName, initValue);
      } else {
        throw new InterpretError(`Unknown id ${varName}`);
      }
    }
  }

  EvaluateExpression(
    node: MukLangAstNode,
    context: Map<string, MukLangData>
  ): MukLangData {
    if (node.children.length !== 2) {
      throw new InterpretError(
        `Bad number of children in Expression: ${node.children.length}`
      );
    }
    // NOTE: THIS CAN FAIL IF INTVALUE IS NULL WHEN THERE ARE MORE DATATYPES, ASSUMES SYSTEM IS TYPE SAFE
    const factorValue: MukLangData = {
      type: VarType.int,
      intValue: this.EvaluateExpressionPrime(
        node.children[1],
        context
      )(this.EvaluateTerm(node.children[0], context).intValue!),
    };
    return factorValue;
  }

  EvaluateExpressionPrime(
    node: MukLangAstNode,
    context: Map<string, MukLangData>
  ): (a: number) => number {
    if (node.children.length === 1) {
      return (a: number) => a;
    } else if (node.children.length === 3) {
      // NOTE: THIS CAN FAIL IF INTVALUE IS NULL WHEN THERE ARE MORE DATATYPES, ASSUMES SYSTEM IS TYPE SAFE
      const innerFunction = (a: number) =>
        this.EvaluateLowHighOp(node.children[0])(
          a,
          this.EvaluateTerm(node.children[1], context).intValue!
        );
      const outerFunction = this.EvaluateExpressionPrime(
        node.children[2],
        context
      );
      return (a: number) => outerFunction(innerFunction(a));
    } else {
      throw new InterpretError(
        `Wrong number of children of EXPR_PRIME: ${node.children.length}`
      );
    }
  }

  EvaluateTerm(
    node: MukLangAstNode,
    context: Map<string, MukLangData>
  ): MukLangData {
    if (node.children.length !== 2) {
      throw new InterpretError(
        `Bad number of children in Term: ${node.children.length}`
      );
    }
    const factorValue: MukLangData = {
      type: VarType.int,
      intValue: this.EvaluateTermPrime(
        node.children[1],
        context
      )(this.EvaluateFactor(node.children[0], context).intValue!),
    };
    return factorValue;
  }

  EvaluateTermPrime(
    node: MukLangAstNode,
    context: Map<string, MukLangData>
  ): (a: number) => number {
    if (node.children.length === 1) {
      return (a: number) => a;
    } else if (node.children.length === 3) {
      // NOTE: THIS CAN FAIL IF INTVALUE IS NULL WHEN THERE ARE MORE DATATYPES, ASSUMES SYSTEM IS TYPE SAFE
      const innerFunction = (a: number) =>
        this.EvaluateLowHighOp(node.children[0])(
          a,
          this.EvaluateFactor(node.children[1], context).intValue!
        );
      const outerFunction = this.EvaluateTermPrime(node.children[2], context);
      return (a: number) => outerFunction(innerFunction(a));
    } else {
      throw new InterpretError(
        `Wrong number of children of TERM_PRIME: ${node.children.length}`
      );
    }
  }

  EvaluateLowHighOp(node: MukLangAstNode): (a: number, b: number) => number {
    switch (node.token!.value!) {
      case "+":
        return (a: number, b: number) => a + b;
      case "-":
        return (a: number, b: number) => a - b;
      case "*":
        return (a: number, b: number) => a * b;
      case "/":
        return (a: number, b: number) => (a / b) >> 0;
      default:
        throw new InterpretError(`Bad operation: ${node.token!.value!}`);
    }
  }

  Execute(input: string[]): string {
    try {
      const result = this.Tokenise(input.join(SPACE));
      const parseResult = this.Parse(result);
      this.AnalyseSemantics(parseResult);
      return "";
      // return this.Interpret(parseResult);
    } catch (err: unknown) {
      console.log(err);
      var errorMsg;
      if (err instanceof LexError) {
        errorMsg = "LexError";
      } else if (err instanceof ParseError) {
        errorMsg = "ParseError";
      } else if (err instanceof SemanticError) {
        errorMsg = "SemanticError";
      } else if (err instanceof InterpretError) {
        errorMsg = "InterpretError";
      } else if (err instanceof Error) {
        errorMsg = "Generic Error " + err.message + " " + err.stack;
      }
      return errorMsg + "\n";
    }
  }
}

export default MukLanguageEngine;
