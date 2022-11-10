import { JUMPS, COMPUTATIONS, DESTINATIONS } from './constants';

export type AsmLine = string;

export type Instruction = 'A_INSTRUCTION' | 'C_INSTRUCTION' | 'L_INSTRUCTION';

export type Sym = string;

export type Address = number;

export type Symbols = { [key: Sym]: Address };

export type DestinationKey = keyof typeof DESTINATIONS;

export type BinaryDestination = typeof DESTINATIONS[DestinationKey];

export type ComputationKey = keyof typeof COMPUTATIONS;

export type BinaryComputation = typeof COMPUTATIONS[ComputationKey];

export type JumpKey = keyof typeof JUMPS;

export type BinaryJump = typeof JUMPS[JumpKey];

export type Binary = string;
