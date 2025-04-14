import { EMPTY, SPACE } from "../../constants/SandboxConstants";
import IAstNode from "../../utilities/IAstNode";
import IToken from "../../utilities/IToken";
import ILanguageEngine from "../language-abstractions/ILanguageEngine";

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
  op = "op",
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
  TERMINAL = "TERMINAL",
}

function isLabel(value: LabelType | TokenType): value is LabelType {
  return Object.values(LabelType).includes(value as LabelType);
}

const rules = [
  { regex: /^print\b/, type: TokenType.print },
  { regex: /^[a-zA-Z_]\w*/, type: TokenType.id },
  { regex: /^\d+/, type: TokenType.num },
  { regex: /^[+\-*/]/, type: TokenType.op },
  { regex: /^=/, type: TokenType.assignment },
  { regex: /^\(/, type: TokenType.open_bracket },
  { regex: /^\)/, type: TokenType.close_bracket },
  { regex: /^;/, type: TokenType.semicolon },
  { regex: /^\s+/, type: TokenType.whitespace },
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
          this.token?.tokenType +
          " " +
          this.token?.value
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
    [TokenType.id, [TokenType.id, LabelType.EXPR_PRIME]],
    [TokenType.num, [TokenType.num, LabelType.EXPR_PRIME]],
    [
      TokenType.open_bracket,
      [
        TokenType.open_bracket,
        LabelType.EXPR,
        TokenType.close_bracket,
        LabelType.EXPR_PRIME,
      ],
    ],
  ])
);

parseTable.set(
  LabelType.EXPR_PRIME,
  new Map([
    [TokenType.semicolon, [TokenType.epsilon]],
    [TokenType.close_bracket, [TokenType.epsilon]],
    [TokenType.op, [TokenType.op, LabelType.EXPR]],
  ])
);

class MukLangToken implements IToken {
  tokenType: TokenType;
  value: number | string | null;

  constructor(tokenType: TokenType, value: number | string | null) {
    this.tokenType = tokenType;
    this.value = value;
  }

  printDebug() {
    // const value = this.value === null ? "" : ": " + this.value.toString();
    return "[" + this.tokenType + this.value + "]";
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
            if (rule.type === TokenType.num || rule.type === TokenType.id) {
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

  Interpret(root: MukLangAstNode): string {
    var output = EMPTY;
    var vars: Map<string, number> = [];

    return output;
  }

  Evaluate(node: MukLangAstNode): number {}

  Execute(input: string[]): string {
    try {
      const result = this.Tokenise(input.join(SPACE));
      console.log(result.map((x) => x.printDebug()).join(", "));
      const parseResult = this.Parse(result);
      console.log(parseResult.printDebug());
      this.AnalyseSemantics(parseResult);
      const output = this.Interpret(parseResult);
      return output;
    } catch (err) {
      if (err instanceof LexError) {
        return "LexError";
      }
      if (err instanceof ParseError) {
        return "ParseError";
      }
      if (err instanceof SemanticError) {
        return "SemanticError";
      }
      if (err instanceof InterpretError) {
        return "InterpretError";
      }
      return "Generic Error";
    }
  }
}

export default MukLanguageEngine;
