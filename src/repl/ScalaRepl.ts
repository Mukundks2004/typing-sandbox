import IRepl from "./IRepl";

class ScalaRepl implements IRepl {
    Process(input: string): string {
        return "your input was: " + input + "\r\n";
    }
}

export default ScalaRepl;