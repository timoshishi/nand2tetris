import { Address, AsmLine } from './Parser';

export const DESTINATIONS = {
  NODEST: '000',
  M: '001',
  D: '010',
  DM: '011',
  A: '100',
  AM: '101',
  AD: '110',
  ADM: '111',
} as const;

export const JUMPS = {
  NOJMP: '000',
  JGT: '001',
  JEQ: '010',
  JGE: '011',
  JLT: '100',
  JNE: '101',
  JLE: '110',
  JMP: '111',
} as const;

export const COMPUTATIONS = {
  0: '0101010',
  1: '0011111',
  '-1': '0111010',
  D: '0001100',
  A: '0110000',
  '!D': '0001101',
  '!A': '110001',
  '-D': '0001111',
  '-A': '0110011',
  'D+1': '0011111',
  'A+1': '0110111',
  'D-1': '0001110',
  'A-1': '0110010',
  'D+A': '0000010',
  'D-A': '0010011',
  'A-D': '0000111',
  'D&A': '0000000',
  'D|A': '0010101',
  M: '1110000',
  '!M': '1110001',
  '-M': '1110011',
  'M+1': '1110111',
  'M-1': '1110010',
  'D+M': '1000010',
  'D-M': '1010011',
  'M-D': '1000111',
  'D&M': '1000000',
  'D|M': '1010101',
} as const;

export type DestinationKey = keyof typeof DESTINATIONS;
export type BinaryDestination = typeof DESTINATIONS[DestinationKey];
export type ComputationKey = keyof typeof COMPUTATIONS;
export type BinaryComputation = typeof COMPUTATIONS[ComputationKey];
export type JumpKey = keyof typeof JUMPS;
export type BinaryJump = typeof JUMPS[JumpKey];

export type Binary = string;

export class Code {
  getAddressBinary(address: Address): Binary {
    const binaryCode = address.toString(2);
    const padded16 = '0'.repeat(16 - binaryCode.length);
    return padded16 + binaryCode;
  }

  getComputationBinary(line: AsmLine): Binary {
    const [dest, comp, jmp] = this.getComputationKeys(line);
    const destination = DESTINATIONS[dest];
    const computation = COMPUTATIONS[comp];
    const jump = JUMPS[jmp];
    return ['111', computation, destination, jump].join('');
  }

  getComputationKeys(line: AsmLine) {
    let destination = 'NODEST';
    let jump = 'NOJMP';
    let computation = '*****';
    try {
      const hasJump = line.includes(';');
      const hasDestination = line.includes('=');
      if (hasJump) {
        jump = line.split(';').pop()!;
      }
      if (hasDestination) {
        destination = line.split('=')[0];
      }
      if (!hasDestination && !hasJump) computation = line;
      if (hasJump && !hasDestination) computation = line.split(';')[0];
      if (!hasJump && hasDestination) computation = line.split('=')[1];

      return [
        destination as unknown as DestinationKey,
        computation as unknown as ComputationKey,
        jump as unknown as JumpKey,
      ] as const;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      console.error(`error parsing computation key line ${line}`);
      throw new Error(`error parsing computation key line ${line}`);
    }
  }
}
