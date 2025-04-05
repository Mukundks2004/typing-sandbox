import IRepl from "./IRepl";

class BasicRepl implements IRepl {
    Process(input: string): string {
        return "your input was: " + input + "\r\n";
    }
}

export default BasicRepl;