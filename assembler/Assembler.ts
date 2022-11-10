import { readFileSync, writeFileSync } from 'fs';
import { Code } from './Code';
import path from 'path';
import { Parser } from './Parser';
import { SymbolTable } from './SymbolTable';

type AsmLine = string;

export class Assembler extends Parser {
  hackFile: string;
  programName: string;

  constructor() {
    super([], new SymbolTable(), new Code());
    this.hackFile = '';
    this.programName = '';
  }
  init() {
    const programName = this.getProgramName();
    this.asmLines = fileHandler.readAsmFile(programName);
    this.parseAsm();
  }

  getProgramName() {
    const programName = process.argv[2];
    this.programName = programName;
    return programName;
  }

  parseAsm() {
    this.getLabels();
    const parsedLines = this.asmLines.map((line) => this.parseLine(line));
    fileHandler.writeHackFile(parsedLines.join('\n') + '\n', this.programName);
  }
}

const fileHandler = {
  readAsmFile(programName: string): AsmLine[] {
    const data = readFileSync(path.resolve(__dirname, `${programName}.asm`), 'utf-8');
    const getAsmLines = (data: string): AsmLine[] => data.split('\n');
    const removeWhiteSpace = (line: AsmLine): AsmLine => line.replace(/( |\r)/gi, '');
    const removeComments = (line: AsmLine) => line.split('//').shift() as string;
    const cleanAsmFile = getAsmLines(data).map(removeWhiteSpace).map(removeComments).filter(Boolean);
    return cleanAsmFile;
  },
  writeHackFile(binaryInstructions: string, programName: string) {
    writeFileSync(path.resolve(__dirname, `${programName}.hack`), binaryInstructions);
  },
};

type Sym = string;
type Address = number;
type Symbols = { [key: Sym]: Address };

// is label (XXXX)
// remove labels first and put them to the symbols as the next line in the program, splice
// is variable @Xxx
// if not in symbols, assign it to addresses starting at 16

// A instruction char at 0 = 0
// then 1-15 => binary

// C Instruction
// first three chars are 1, can just check char at 1
// 111a cccc cc then if a===1, check table for values of c against the value of a

// 111a cccc ccdd d // if ddd has value, then has a destination
// 111a cccc ccdd djjj // if jjj has value then there is a jump

const ass = new Assembler();
ass.init();
