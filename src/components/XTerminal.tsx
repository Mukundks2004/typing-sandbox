import { Terminal, ITerminalOptions } from "@xterm/xterm";
import { useEffect, useRef } from "react";
import "@xterm/xterm/css/xterm.css";
import "../App.css";

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

// function XTerminal() {
//   // 80 24
//   const term = new Terminal({
//     allowProposedApi: true,
//     windowsMode: true,
//     fontFamily: '"WindowsTerminalFont", monospace',
//     theme: xtermjsTheme,
//     letterSpacing: 1,
//     cursorBlink: true,
//   } as ITerminalOptions);
//   const terminalRef = useRef<HTMLDivElement | null>(null);
//   useEffect(() => {
//     if (!terminalRef.current) {
//       return;
//     }

//     term.resize(80, 24);

//     const keyHandler = (ev: KeyboardEvent) => {
//       console.log(ev.key.charCodeAt(0));
//       if (ev.key.charCodeAt(0) === 69) term.write("\n");
//       term.write(ev.key);
//       return true;
//     };

//     term.attachCustomKeyEventHandler(keyHandler);

//     if (!term.element) {
//       term.open(terminalRef.current);
//       term.write("Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ");
//     }
//   }, [term]);

//   return <div ref={terminalRef}></div>;
// }

function XTerminal() {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const termRef = useRef<Terminal | null>(null);

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
        // letterSpacing: 1,
        cursorBlink: true,
      });

      termRef.current.open(terminalRef.current);
      termRef.current.writeln("Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ");

      termRef.current.resize(80, 24);

      // termRef.current.onData((data) => {
      //   if (data === "\n") {
      //     termRef.current!.writeln("");
      //     console.log("new");
      //   } else {
      //     termRef.current!.write(data);
      //   }
      //   console.log(data);
      // });

      // termRef.current.attachCustomKeyEventHandler((key) => {
      //   if (key.down)
      //   console.log(key.key);
      //   return false;
      // });

      termRef.current.onKey((key, keyboardEvent) => {
        console.log(key);
        console.log(keyboardEvent);
        if (key.key === "\r") {
          termRef.current!.writeln("");
        } else {
          termRef.current!.write(key.key);
        }
      });
    }
  }, []);

  return <div ref={terminalRef}></div>;
}

export default XTerminal;
