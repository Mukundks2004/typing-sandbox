import IRepl from "../repl/IRepl";

interface IReplManager {
    Clear(): void;
    SetRepl(newRepl: IRepl): void;
}

export default IReplManager;