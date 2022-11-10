import { Symbols } from './types';
import { SYMBOLS } from './constants';
export class SymbolTable {
  symbols: Symbols;
  nextAvailableAddress: number;

  constructor() {
    this.symbols = this.createInitialTable();
    this.nextAvailableAddress = 18;
  }

  addEntry(key: string, address: number) {
    this.symbols[key] = this.nextAvailableAddress;
    this.nextAvailableAddress = 1 + this.nextAvailableAddress;
  }

  contains(key: string) {
    const hasProp = this.symbols.hasOwnProperty(key);
    return hasProp;
  }

  getAddress(key: string) {
    return this.symbols[key];
  }

  createInitialTable() {
    const registers = [...new Array(16)].reduce((acc, _, i) => {
      acc[`R${i}`] = i;
      return acc;
    }, {});
    return {
      ...SYMBOLS,
      ...registers,
    };
  }
}
