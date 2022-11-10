import { Code } from './Code';
import { SymbolTable } from './SymbolTable';
import { AsmLine, Binary, Instruction } from './types';

//FIXME: Shame!

export class Parser {
  asmLines: AsmLine[];
  symbolTable: SymbolTable;
  codeCompute: Code;
  constructor(symbolTable: SymbolTable, codeCompute: Code) {
    this.asmLines = [];
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
