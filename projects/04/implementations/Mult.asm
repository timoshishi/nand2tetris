// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[3], respectively.)

@sum // sets to first free memory address (16)
M=0 // starts at 0
@i  // sets to first free memory address (17)
M=1   //i=1
(LOOP)
@i    
D=M // value of address 17 (starts at 0)
@R0
D=D-M // address 17 - R0
@END
D;JGT  // if(i-R0)[R0 = total iterations] > 0 goto END

// else
@R1
D=M   //D=R1 value of address 2
@sum
M=D+M  // sum adds the value of R1 to sum
@i
M=M+1  // increase our iteration count
@LOOP
0;JMP  //Go to Beginning again
(END)
@sum
D=M
@R2
M=D