import { COMPUTATIONS, DESTINATIONS, JUMPS } from './constants';
import { Address, AsmLine, Binary, ComputationKey, DestinationKey, JumpKey } from './types';

//FIXME: Damn this is ugly
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

  //FIXME: Good lord this is even uglier
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
