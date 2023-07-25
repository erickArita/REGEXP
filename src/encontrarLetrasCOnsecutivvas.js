const fs = require("fs");
const readline = require("readline");

const inputFilePath = "data.csv";
const outputFilePath = "output.csv";

function encontrarPalabrasConTresLetrasConsecutivasIguales(texto) {
  const palabras = texto.split(/\s+/);

  const tresLetrasIgualesRegex = /(\w)\1{2}/g;

  palabras.forEach((palabra, index, array) => {
    if (tresLetrasIgualesRegex.test(palabra)) {
      array[index] = palabra.replace(tresLetrasIgualesRegex, "$1");
    }
  });

  return palabras.join(" ");
}

function corregirPalabras() {
  const rl = readline.createInterface({
    input: fs.createReadStream(inputFilePath),
    crlfDelay: Infinity,
  });

  const outputFileStream = fs.createWriteStream(outputFilePath);

  rl.on("line", (line) => {
    const [nombre, edad, ciudad] = line.split(",");

    const nombreCorregida =
      encontrarPalabrasConTresLetrasConsecutivasIguales(nombre);

    const ciudadCorregida =
      encontrarPalabrasConTresLetrasConsecutivasIguales(ciudad);
    const outputLine = `${nombreCorregida},${edad},${ciudadCorregida}\n`;

    outputFileStream.write(outputLine);
  });

  rl.on("close", () => {
    console.log(`Archivo ${outputFilePath} generado con éxito.`);
    outputFileStream.end();
  });
}

corregirPalabras();
