let gameID = localStorage.getItem("gameKey");

const games = [
    {
        gamekey: "111",
        title: "➕ Addition Practice ➕",
        script: "1-addition.js",
        type1: "2 digit + 2 digit",
        type2: "3 digit + 3 digit"
    },
    {
        gamekey: "222",
        title: "➖ Subtraction Practice ➖",
        script: "2-subtraction.js",
        type1: "2 digit - 2 digit",
        type2: "3 digit - 3 digit"
    },
    {
        gamekey: "333",
        title: "✖️ Multiplication Practice ✖️",
        script: "3-multiplication.js",
        type1: "3 digit × 1 digit",
        type2: "2 digit × 2 digit"
    },
    {
        gamekey: "444",
        title: "Lightning Sum",
        script: "4-lightning-sum.js",
        type1: "1 to 9",
        type2: "10 to 20"
    },
    {
        gamekey: "555",
        title: "Table Practice",
        script: "5-table-practice.js",
        type1: "1 digit",
        type2: "2 digit"
    },
    {
        gamekey: "666",
        title: "Roman to Number",
        script: "6-number←roman.js",
        type1: "1 to 99",
        type2: "More than 99"
    },
    {
        gamekey: "777",
        title: "Word to Number",
        script: "7-number←word.js",
        type1: "1 to 99",
        type2: "more than 99"
    }
];

// Automatically load the game if gameID matches gamekey
games.forEach((game) => {
    if (gameID === game.gamekey) {
        document.getElementById("game").style.display = "flex";
        document.getElementById("title").innerHTML = game.title;
        document.getElementById("type11").innerHTML = game.type1;
        document.getElementById("type12").innerHTML = game.type2;
        const script = document.createElement("script");
        script.src = `gameJS/${game.script}`;
        document.body.appendChild(script);
    }
});