import { Binary, Code, COMPUTATIONS } from './Code';
import { SymbolTable } from './SymbolTable';

export type AsmLine = string;

export type Instruction = 'A_INSTRUCTION' | 'C_INSTRUCTION' | 'L_INSTRUCTION';

export class Parser {
  asmLines: AsmLine[];
  symbolTable: SymbolTable;
  codeCompute: Code;
  constructor(asmLines: AsmLine[], symbolTable: SymbolTable, codeCompute: Code) {
    this.asmLines = asmLines;
    this.symbolTable = symbolTable;
    this.codeCompute = codeCompute;
  }

  getLabels() {
    const lines = this.asmLines;
    for (let i = 0; i < lines.length; ) {
      const line = lines[i];
      const isLabel = line[0] + line[line.length - 1] === '()';
      if (isLabel) {
        const replacementSymbol = `${line.slice(1, -1)}`;
        this.symbolTable.addEntry(replacementSymbol, i);
        lines.splice(i, 1);
      } else {
        i++;
      }
    }
    console.log(lines, lines.length);
    this.asmLines = lines;
  }
  getInstructionType(line: AsmLine): Instruction {
    const stripped = line.replace('@', '');
    if (!isNaN(+stripped) || this.symbolTable.contains(stripped)) {
      return 'A_INSTRUCTION';
    } else if (stripped.includes(';') || stripped.includes('=')) {
      return 'C_INSTRUCTION';
    } else if (stripped[0] + stripped[stripped.length - 1] === '()') {
      return 'L_INSTRUCTION';
    } else {
      throw new Error(`invalid instruction type ${line}, STRIPPED: ${stripped}`);
    }
  }

  parseLine(line: AsmLine): Binary {
    const stripped = line.replace(/@|\(|\)/gi, '');
    const instructionType = this.getInstructionType(stripped);
    if (instructionType === 'C_INSTRUCTION') {
      return this.codeCompute.getComputationBinary(stripped);
    } else if (instructionType === 'A_INSTRUCTION') {
      const isInteger = !isNaN(+stripped);
      const address = this.symbolTable.getAddress(stripped);
      const binaryAddress = this.codeCompute.getAddressBinary(isInteger ? +stripped : address);
      return binaryAddress;
    }
    throw new Error(`Not valid line: ${line}, Stripped: ${stripped}`);
  }
}

type Sym = string;
export type Address = number;

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
