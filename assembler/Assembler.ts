import { readFileSync, writeFileSync } from 'fs';
import { Code } from './Code';
import path from 'path';
import { Parser } from './Parser';
import { SymbolTable } from './SymbolTable';
import { AsmLine } from './types';

//FIXME: This is ugly

export class Assembler extends Parser {
  hackFile: string;
  programName: string;

  constructor() {
    super(new SymbolTable(), new Code());
    this.hackFile = '';
    this.programName = '';
  }

  init() {
    const programName = this.getProgramName();
    this.asmLines = this.readAsmFile(programName);
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
    this.writeHackFile(parsedLines.join('\n') + '\n', this.programName);
  }

  readAsmFile(programName: string): AsmLine[] {
    const data = readFileSync(path.resolve(__dirname, `${programName}.asm`), 'utf-8');
    const getAsmLines = (data: string): AsmLine[] => data.split('\n');
    const removeWhiteSpace = (line: AsmLine): AsmLine => line.replace(/( |\r)/gi, '');
    const removeComments = (line: AsmLine) => line.split('//').shift() as string;
    const cleanAsmFile = getAsmLines(data).map(removeWhiteSpace).map(removeComments).filter(Boolean);
    return cleanAsmFile;
  }

  writeHackFile(binaryInstructions: string, programName: string) {
    writeFileSync(path.resolve(__dirname, `${programName}.hack`), binaryInstructions);
  }
}

const assblr = new Assembler();
assblr.init();
