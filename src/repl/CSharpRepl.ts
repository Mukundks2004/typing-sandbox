import IRepl from "./IRepl";

const HELP = `Welcome to the C# Sandbox! Here are the commands available:\r
    :help               print this menu\r
    :type               get type information for a type\r
    :del                remove type from namespace\r\n\r\n`

class CSharpRepl implements IRepl {
    history: string[] = [];
    Process(input: string): string {
        switch (input) {
            case input.match(/^\s*$/)?.input: return "";
            case ":help": return HELP;
            case ":h": return HELP;
            case ":type": return "'type' command not implemented yet\r\n\r\n";
            case ":del": return "'del' command not implemented yet\r\n\r\n";
            default: return input + ': command not found\r\n\r\n'
        }
    }
}

export default CSharpRepl;