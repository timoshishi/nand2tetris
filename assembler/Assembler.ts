import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

type AsmLine = string;

export class Assembler {
  asmLines: string[];
  hackFile: string[];
  symbolTable: SymbolTable;
  programName: string;

  constructor(programName: string) {
    this.asmLines = fileHandler.readAsmFile(programName)
    this.hackFile = [];
    this.symbolTable = new SymbolTable();
    this.programName = programName
  }
  init() {}

}

const fileHandler = {
  readAsmFile(programName: string): AsmLine[] {
    const data = readFileSync(path.join(__dirname, programName), 'utf-8')
    const getAsmLines = (data: string): AsmLine[] => data.split('\n');
    const removeWhiteSpace =(line: AsmLine): AsmLine => line.replace(/ /ig, '');
    const removeComments = (line: AsmLine) => line.split('//').shift() as string;
    return getAsmLines(data)
    .map(removeWhiteSpace)
    .map(removeComments)
    .filter(Boolean);
  },
  writeHackFile(binaryInstructions: string[], programName: string){
    const fileContents = binaryInstructions.join('\n')
    writeFileSync(`${programName}.hack`, fileContents)
  }
}

const parser = {
  hasMoreLines(){},
  advance(){},
  instructionType(){},
  getSymbol(){},
  dest(){},
  comp(){},
  jump(){},

}

const  parseCode = {
  dest(){},
  comp(){},
  jump(){},
}

type Sym = string;
type Address = number
type Symbols = {[key: Sym]: Address}

class SymbolTable {
symbols: Symbols
constructor(){
  this.symbols = this.createInitialTable();
}

addEntry(key:string, address:number){
  this.symbols[key] = address
}

contains(key:string){
  return this.symbols.hasOwnProperty(key)
}

getAddress(key: string){
  return this.symbols[key]
}

createInitialTable() {
  const registers = [...new Array(16)].reduce((acc, _, i) => {
    acc[`R${i}`] = i;
    return acc;
  },{});
  const table = {
    SCREEN: 16384,
    KBD: 24576,
    SP:0,
    LCL:1,
    ARG:2,
    THIS:3,
    THAT:4,
    LOOP:4,
    STOP:18,
  i:16,
  sum:17,
  ...registers
  }
  return table;
}
}

