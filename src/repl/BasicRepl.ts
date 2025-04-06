import IRepl from "./IRepl";

class BasicRepl implements IRepl {
    history: string[] = [];

    Process(input: string): string {
        if (input.length === 0) return "";
        return "your input was: " + input + "\r\n";
    }
}

export default BasicRepl;