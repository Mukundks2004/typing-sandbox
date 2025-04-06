interface IRepl {
    history: string[];
    Process(input: string): string;
}

export default IRepl;