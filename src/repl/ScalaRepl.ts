import IRepl from "./IRepl";

const HELP = `Welcome to the SCALA Sandbox! Here are the commands available:
    :help               print this menu
    :type               get type information for a type
    :del                remove type from namespace\n\n`

class ScalaRepl implements IRepl {
    history: string[] = [];

    Process(input: string): string {
        switch (input) {
            case input.match(/^\s*$/)?.input: return "";
            case ":help": return HELP;
            case ":type": return "'type' command not implemented yet\n\n";
            case ":del": return "'del' command not implemented yet\n\n";
            default: return input + ': command not found\n\n'
        }
    }
}

export default ScalaRepl;