import { EMPTY, SPACE } from "../../constants/SandboxConstants";
import IAstNode from "../../utilities/IAstNode";
import IToken from "../../utilities/IToken";
import ILanguageEngine from "../language-abstractions/ILanguageEngine";

const superContext: Map<string, number> = new Map<string, number>();

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

enum TokenType {
  print = "print",
  id = "id",
  num = "num",
  low_op = "low_op",
  high_op = "high_op",
  open_bracket = "open_bracket",
  close_bracket = "close_bracket",
  semicolon = "sem",
  whitespace = "whitespace",
  assignment = "assignment",
  eof = "eof",
  epsilon = "epsilon",
}

enum LabelType {
  START = "START",
  LOS = "LOS",
  STAT = "STAT",
  PRINT = "PRINT",
  INIT = "INIT",
  EXPR = "EXPR",
  EXPR_PRIME = "EXPR_PRIME",
  TERM = "TERM",
  TERM_PRIME = "TERM_PRIME",
  FACTOR = "FACTOR",
  TERMINAL = "TERMINAL",
}

function isLabel(value: LabelType | TokenType): value is LabelType {
  return Object.values(LabelType).includes(value as LabelType);
}

const rules = [
  { regex: /^print\b/, type: TokenType.print },
  { regex: /^[a-zA-Z_]\w*/, type: TokenType.id },
  { regex: /^\d+/, type: TokenType.num },
  { regex: /^[+\-]/, type: TokenType.low_op },
  { regex: /^[*/]/, type: TokenType.high_op },
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
  ])
);

parseTable.set(
  LabelType.LOS,
  new Map([
    [TokenType.eof, [TokenType.epsilon]],
    [TokenType.print, [LabelType.STAT, LabelType.LOS]],
    [TokenType.id, [LabelType.STAT, LabelType.LOS]],
  ])
);

parseTable.set(
  LabelType.STAT,
  new Map([
    [TokenType.print, [LabelType.PRINT, TokenType.semicolon]],
    [TokenType.id, [LabelType.INIT, TokenType.semicolon]],
  ])
);

parseTable.set(
  LabelType.PRINT,
  new Map([[TokenType.print, [TokenType.print, LabelType.EXPR]]])
);

parseTable.set(
  LabelType.INIT,
  new Map([
    [TokenType.id, [TokenType.id, TokenType.assignment, LabelType.EXPR]],
  ])
);

parseTable.set(
  LabelType.EXPR,
  new Map([
    [TokenType.id, [LabelType.TERM, LabelType.EXPR_PRIME]],
    [TokenType.num, [LabelType.TERM, LabelType.EXPR_PRIME]],
    [TokenType.open_bracket, [LabelType.TERM, LabelType.EXPR_PRIME]],
  ])
);

parseTable.set(
  LabelType.EXPR_PRIME,
  new Map([
    [TokenType.semicolon, [TokenType.epsilon]],
    [
      TokenType.low_op,
      [TokenType.low_op, LabelType.TERM, LabelType.EXPR_PRIME],
    ],
    [TokenType.close_bracket, [TokenType.epsilon]],
  ])
);

parseTable.set(
  LabelType.TERM,
  new Map([
    [TokenType.id, [LabelType.FACTOR, LabelType.TERM_PRIME]],
    [TokenType.num, [LabelType.FACTOR, LabelType.TERM_PRIME]],
    [TokenType.open_bracket, [LabelType.FACTOR, LabelType.TERM_PRIME]],
  ])
);

parseTable.set(
  LabelType.TERM_PRIME,
  new Map([
    [TokenType.semicolon, [TokenType.epsilon]],
    [TokenType.low_op, [TokenType.epsilon]],
    [
      TokenType.high_op,
      [TokenType.high_op, LabelType.FACTOR, LabelType.TERM_PRIME],
    ],
    [TokenType.close_bracket, [TokenType.epsilon]],
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
              rule.type === TokenType.high_op
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
    // var context: Map<string, number> = new Map<string, number>();
    const output = this.PerformProgramExecution(node, superContext);
    return output;
  }

  PerformProgramExecution(
    node: MukLangAstNode,
    context: Map<string, number>
  ): string {
    const output = this.PerformLos(node.children[0], context, EMPTY);
    return output;
  }

  EvaluateFactor(node: MukLangAstNode, context: Map<string, number>): number {
    if (node.children.length === 3) {
      return this.EvaluateExpression(node.children[1], context);
    } else if (node.children.length === 1) {
      const token = node.children[0].token!;
      if (token.tokenType === TokenType.num) {
        return +token.value!;
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
    context: Map<string, number>,
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
    context: Map<string, number>,
    output: string
  ): string {
    const firstChild = node.children[0];
    if (firstChild.label === LabelType.PRINT) {
      output = this.PerformPrint(node.children[0], context, output);
    } else if (firstChild.label === LabelType.INIT) {
      this.PerformInit(node.children[0], context);
    } else {
      throw new InterpretError(`Stat encountered bad node: ${node.label}`);
    }
    return output;
  }

  PerformPrint(
    node: MukLangAstNode,
    context: Map<string, number>,
    output: string
  ): string {
    return (
      output +
      this.EvaluateExpression(node.children[1], context).toString() +
      "\n"
    );
  }

  PerformInit(node: MukLangAstNode, context: Map<string, number>): void {
    const initValue = this.EvaluateExpression(node.children[2], context);
    context.set(node.children[0].token!.value!, initValue);
  }

  EvaluateExpression(node: MukLangAstNode, context: Map<string, number>) {
    if (node.children.length !== 2) {
      throw new InterpretError(
        `Bad number of children in Expression: ${node.children.length}`
      );
    }
    return this.EvaluateExpressionPrime(
      node.children[1],
      context
    )(this.EvaluateTerm(node.children[0], context));
  }

  EvaluateExpressionPrime(
    node: MukLangAstNode,
    context: Map<string, number>
  ): (a: number) => number {
    if (node.children.length === 1) {
      return (a: number) => a;
    } else if (node.children.length === 3) {
      const innerFunction = (a: number) =>
        this.EvaluateLowHighOp(node.children[0])(
          a,
          this.EvaluateTerm(node.children[1], context)
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

  EvaluateTerm(node: MukLangAstNode, context: Map<string, number>): number {
    if (node.children.length !== 2) {
      throw new InterpretError(
        `Bad number of children in Term: ${node.children.length}`
      );
    }
    return this.EvaluateTermPrime(
      node.children[1],
      context
    )(this.EvaluateFactor(node.children[0], context));
  }

  EvaluateTermPrime(
    node: MukLangAstNode,
    context: Map<string, number>
  ): (a: number) => number {
    if (node.children.length === 1) {
      return (a: number) => a;
    } else if (node.children.length === 3) {
      const innerFunction = (a: number) =>
        this.EvaluateLowHighOp(node.children[0])(
          a,
          this.EvaluateFactor(node.children[1], context)
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
      return this.Interpret(parseResult);
    } catch (err) {
      var errorMsg;
      if (err instanceof LexError) {
        errorMsg = "LexError";
      } else if (err instanceof ParseError) {
        errorMsg = "ParseError";
      } else if (err instanceof SemanticError) {
        errorMsg = "SemanticError";
      } else if (err instanceof InterpretError) {
        errorMsg = "InterpretError";
      } else {
        errorMsg = "Generic Error";
      }
      return errorMsg + "\n";
    }
  }
}

export default MukLanguageEngine;
