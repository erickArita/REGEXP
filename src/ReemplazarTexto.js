const replace = require("replace-in-file");
const readline = require("readline");

const csvFilePath = "data.csv";

function findTextInCSV(filePath, searchTextRegex) {
  const foundLines = [];
  const rl = readline.createInterface({
    input: require("fs").createReadStream(filePath),
    crlfDelay: Infinity,
  });

  rl.on("line", (line) => {
    if (line.match(searchTextRegex)) {
      foundLines.push(line);
    }
  });

  return new Promise((resolve) => {
    rl.on("close", () => resolve(foundLines));
  });
}
async function replaceTextInCSV(searchText, replaceWord,searchWord) {
  const options = {
    files: csvFilePath,
    from: searchText,
    to: replaceWord,
  };

  try {
    await replace(options);
    console.log(`Palabra "${searchWord}" reemplazada por "${replaceWord}"`);
  } catch (error) {
    console.error("Error al reemplazar:", error);
  }
}
async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const searchWord = await new Promise((resolve) =>
      rl.question(
        "Ingrese la palabra a buscar en el archivo CSV (o 'salir' para terminar): ",
        resolve
      )
    );

    if (searchWord.toLowerCase() === "salir") {
      console.log("Saliendo del programa.");
      rl.close();
      break;
    }

    const searchTextRegex = new RegExp(searchWord, "gi");
    const foundLines = await findTextInCSV(csvFilePath, searchTextRegex);

    if (foundLines.length) {
      console.log(
        `Palabra "${searchWord}" encontrada en las siguientes líneas:`
      );
      console.log(foundLines.join("\n"));

      const editOption = await new Promise((resolve) =>
        rl.question(
          "¿Desea editar el archivo y reemplazar las ocurrencias encontradas? (s/n): ",
          resolve
        )
      );

      if (editOption.toLowerCase() === "s") {
        const replaceWord = await new Promise((resolve) =>
          rl.question("Ingrese la palabra de reemplazo: ", resolve)
        );
        replaceTextInCSV(searchTextRegex, replaceWord,searchWord);
      } else {
        console.log("No se realizaron cambios en el archivo CSV.");
      }
    } else {
      console.log(
        `Palabra "${searchWord}" no encontrada en el archivo CSV. Por favor, intente con otra palabra.`
      );
    }
  }

  rl.close();
}



main();
