type Sym = string;
type Address = number;
type Symbols = { [key: Sym]: Address };

export class SymbolTable {
  symbols: Symbols;
  nextAvailableAddress: number;

  constructor() {
    this.symbols = this.createInitialTable();
    this.nextAvailableAddress = 18;
  }

  addEntry(key: string, address: number) {
    this.symbols[key] = address;
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
    const table = {
      SCREEN: 16384,
      KBD: 24576,
      SP: 0,
      LCL: 1,
      ARG: 2,
      THIS: 3,
      THAT: 4,
      LOOP: 4,
      STOP: 18,
      i: 16,
      sum: 17,
      ...registers,
    };
    return table;
  }
}
