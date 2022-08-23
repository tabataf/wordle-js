var height = 6; //número de palpites
var width = 5; //comprimento da palavra

var row = 0; //palpite atual
var col = 0; //coluna atual para essa tentativa

var gameOver = false;
// var word = "amora";
wordList.includes('palavra')

let palavradodia
console.log(wordList[0])
palavrapordia()
function palavrapordia() {
    var listDate = []
    const dateIntervalGenerator = (() => {
    const _generateInterval = (startDate, endDate) => {
    const date = new Date(startDate.getTime());
    const dates = [];
    while (date <= endDate) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return dates;
    };
    return {
    generateIn: _generateInterval,
    };
})();
// dateIntervalGenerator = fazer a lista da data 01 até a data 02
var data01 = new Date("2022-08-19")
var data02 = new Date ("2025-09-11")
var dates = dateIntervalGenerator.generateIn(data01, data02);

dates.forEach(element => {
    listDate.push(element.toLocaleDateString())
});

// toLocaleDateString = tranforma a data em //
// pegar o indice da minha lista e acha o indice com a data atual
let indice = listDate.indexOf(new Date().toLocaleDateString())
let dia = wordList[indice]
palavradodia= dia.toUpperCase()

console.log(listDate)
}


guessList = guessList.concat(wordList);
// wordlist = palavras para chute
// guesslist = possiveis erros - lista de suposições

// random (pegar palavra aleatoria)

// var word = wordList[Math.floor(Math.random()*wordList.length)].toUpperCase();
// console.log(word);

var word = palavradodia

//quando recarregar
window.onload = function(){
    intialize();
}

// quando iniciar
function intialize() {

    // Crie o tabuleiro do jogo
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            // <span id="0-0" class="tile">P</span>
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
        }
    }

    // Crie o teclado
    let keyboard = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L",],
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫" ]
    ]

    for (let i = 0; i < keyboard.length; i++) {
        let currRow = keyboard[i];
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard-row");

        for (let j = 0; j < currRow.length; j++) {
            let keyTile = document.createElement("div");

            let key = currRow[j];
            keyTile.innerText = key;
            if (key == "Enter") {
                keyTile.id = "Enter";
            }
            else if (key == "⌫") {
                keyTile.id = "Backspace";
            }
            else if ("A" <= key && key <= "Z") {
                keyTile.id = "Key" + key; // "Chave" + "A";
            } 

            keyTile.addEventListener("click", processKey);

            if (key == "Enter") {
                keyTile.classList.add("enter-key-tile");
            } else {
                keyTile.classList.add("key-tile");
            }
            keyboardRow.appendChild(keyTile);
        }
        document.body.appendChild(keyboardRow);
    }
    

    // "Ouça" a tecla pressionada
    document.addEventListener("keyup", (e) => {
        processInput(e);
    })
}

function processKey(e) {
    e = { "code" : this.id };
    processInput(e);
}

function processInput(e) {
    if (gameOver) return; 

    // alert(e.code);
    if ("KeyA" <= e.code && e.code <= "KeyZ") {
        if (col < width) {
            let currTile = document.getElementById(row.toString() + '-' + col.toString());
            if (currTile.innerText == "") {
                currTile.innerText = e.code[3];
                col += 1;
            }
        }
    }
    else if (e.code == "Backspace") {
        if (0 < col && col <= width) {
            col -=1;
        }
        let currTile = document.getElementById(row.toString() + '-' + col.toString());
        currTile.innerText = "";
    }

    else if (e.code == "Enter") {
        update();
    }

    if (!gameOver && row == height) {
        gameOver = true;
        document.getElementById("answer").innerText = word;
    }
}

function update() {
    let guess = "";
    document.getElementById("answer").innerText = "";

    //suposições na palavra
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;
        guess += letter;
    }

    guess = guess.toLowerCase(); //maiúsculas e minúsculas


    if (!guessList.includes(guess)) {
        document.getElementById("answer").innerText = "Essa palavra não existe na nossa lista";
        return;
    }

    
    //começar a processar palpite
    let correct = 0;

    let letterCount = {}; //acompanhe a frequência das letras
    for (let i = 0; i < word.length; i++) {
        let letter = word[i];

        if (letterCount[letter]) {
        letterCount[letter] += 1;
        } 
        else {
        letterCount[letter] = 1;
        }
    }
    console.log(letterCount);

    //primeira iteração, verifique todas as corretas primeiro
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        //está na posição correta?
        if (word[c] == letter) {
            currTile.classList.add("correct");

            let keyTile = document.getElementById("Key" + letter);
            keyTile.classList.remove("present");
            keyTile.classList.add("correct");

            correct += 1;
            letterCount[letter] -= 1; //contagem de letras
        }

        if (correct == width) {
            gameOver = true;
            startConfetti()
        }
    }

    console.log(letterCount);
    // marque quais estão certas, mas na posição errada
    for (let c = 0; c < width; c++) {
        let currTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currTile.innerText;

        // pule a letra se estiver marcada como correta
        if (!currTile.classList.contains("correct")) {
            //essa é a palavra?         //ver se nao está duas vezes
            if (word.includes(letter) && letterCount[letter] > 0) {
                currTile.classList.add("present");
                
                let keyTile = document.getElementById("Key" + letter);
                if (!keyTile.classList.contains("correct")) {
                    keyTile.classList.add("present");
                }
                letterCount[letter] -= 1;
            } // Não na palavra ou (estava na palavra, mas todas as letras foram usadas para evitar excesso de contagem)
            else {
                currTile.classList.add("absent");
                let keyTile = document.getElementById("Key" + letter);
                keyTile.classList.add("absent")
            }
        }
    }

    row += 1; // inicia nova linha 
    col = 0; //comece em 0 para nova linha
}