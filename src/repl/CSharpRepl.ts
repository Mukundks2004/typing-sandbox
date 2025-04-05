import IRepl from "./IRepl";

class CSharpRepl implements IRepl {
    Process(input: string): string {
        return "your input was: " + input + "\r\n";
    }
}

export default CSharpRepl;