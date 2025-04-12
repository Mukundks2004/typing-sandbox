import { Terminal } from "@xterm/xterm";
import { useEffect, useRef, useState } from "react";
import "@xterm/xterm/css/xterm.css";
import "../App.css";
import TerminalService from "../terminal/TerminalService";
import Dropdown from "./Dropdown";
import {
  INITIAL_LANGUAGE_SELECTION,
  SHELL_PROMPT,
  TAB_STOP_WIDTH,
  TERMINAL_HEIGHT,
  TERMINAL_WIDTH,
} from "../constants/SandboxConstants";

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
  const terminalInstanceRef = useRef<TerminalService | null>(null);
  const [selectedLang, setSelectedLang] = useState(INITIAL_LANGUAGE_SELECTION);

  useEffect(() => {
    if (!terminalRef.current) {
      return;
    }

    if (!terminalInstanceRef.current) {
      terminalInstanceRef.current = new TerminalService(
        SHELL_PROMPT,
        TERMINAL_WIDTH - SHELL_PROMPT.length
      );
    }

    if (!termRef.current) {
      termRef.current = new Terminal({
        allowProposedApi: true,
        windowsMode: true,
        fontFamily: '"WindowsTerminalFont", monospace',
        theme: xtermjsTheme,
        letterSpacing: 1,
        cursorBlink: true,
        convertEol: true,
        tabStopWidth: TAB_STOP_WIDTH,
      });

      termRef.current.open(terminalRef.current);
      termRef.current.write(terminalInstanceRef.current!.prompt);

      termRef.current.resize(TERMINAL_WIDTH, TERMINAL_HEIGHT);

      termRef.current.onKey((key, _) => {
        termRef.current!.write(terminalInstanceRef.current!.onKey(key));
        terminalInstanceRef.current!.replService.PrintDebugInfo();
        console.log(termRef.current!.buffer.active.cursorX);
      });
    }
  }, []);

  const handleLangChange = (newLang: string) => {
    setSelectedLang(newLang);
    terminalInstanceRef.current!.replService.ChangeLanguageService(newLang);
    termRef.current?.clear();
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "10px",
        }}
      >
        <Dropdown
          initialSelection={selectedLang}
          onDropdownChange={handleLangChange}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "800px",
            padding: "20px",
            boxSizing: "border-box",
            backgroundColor: "#2D2E2C",
            borderRadius: "20px",
          }}
          ref={terminalRef}
        ></div>
      </div>
      );
    </>
  );
}

export default XTerminal;
