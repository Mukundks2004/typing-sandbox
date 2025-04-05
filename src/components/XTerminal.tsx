import { Terminal } from "@xterm/xterm";
import { useEffect, useRef, useState } from "react";
import terminalInstance from "../terminal/ITerminalInstance";
import "@xterm/xterm/css/xterm.css";
import "../App.css";
import TerminalInstance from "../terminal/terminalInstance";

const xtermjsTheme = {
  foreground: "#F8F8F8",
  background: "#2D2E2C",
  selectionBackground: "#5DA5D533",
  black: "#1E1E1D",
  brightBlack: "#262625",
  red: "#CE5C5C",
  brightRed: "#FF7272",
  green: "#5BCC5B",
  brightGreen: "#72FF72",
  yellow: "#CCCC5B",
  brightYellow: "#FFFF72",
  blue: "#5D5DD3",
  brightBlue: "#7279FF",
  magenta: "#BC5ED1",
  brightMagenta: "#E572FF",
  cyan: "#5DA5D5",
  brightCyan: "#72F0FF",
  white: "#F8F8F8",
  brightWhite: "#FFFFFF",
};

function XTerminal() {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const termRef = useRef<Terminal | null>(null);
  const [terminalInstance, setTerminalInstance] = useState<TerminalInstance>(
    new TerminalInstance()
  );

  useEffect(() => {
    if (!terminalRef.current) {
      return;
    }

    if (!termRef.current) {
      termRef.current = new Terminal({
        allowProposedApi: true,
        windowsMode: true,
        fontFamily: '"WindowsTerminalFont", monospace',
        theme: xtermjsTheme,
        letterSpacing: 1,
        cursorBlink: true,
      });

      termRef.current.open(terminalRef.current);
      termRef.current.write(terminalInstance.prompt);

      termRef.current.resize(80, 24);

      termRef.current.onKey((key, _) => {
        termRef.current!.write(terminalInstance.onKey(key));
        // console.log(
        //   "Key",
        //   key,
        //   "Cursor",
        //   terminalInstance.cursor,
        //   "Current line",
        //   terminalInstance.currentLine,
        //   "Stack pointer",
        //   terminalInstance.stackPointer,
        //   "history",
        //   terminalInstance.history
        // );
      });
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        ref={terminalRef}
        style={{
          width: "850px",
          padding: "20px",
          boxSizing: "border-box",
          backgroundColor: "#2D2E2C",
          borderRadius: "20px",
        }}
      ></div>
    </div>
  );
}

export default XTerminal;
