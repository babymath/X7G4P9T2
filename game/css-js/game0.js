let gameID = localStorage.getItem("gameKey");
const cardContainer = document.querySelector(".card-container");
const messageBox = document.getElementById("messageBox");
const dotsContainer = document.getElementById("dotsContainer");

const games = [
    {
        gamekey:"111",
        title: "➕ Addition Practice ➕",
        script: "1-addition.js",
        type1: "2 digit + 2 digit",
        type2: "3 digit + 3 digit"
    },
    {
        gamekey:"222",
        title: "➖ Subtraction Practice ➖",
        script: "2-subtraction.js",
        type1: "2 digit - 2 digit",
        type2: "3 digit - 3 digit"
    },
    {
        gamekey:"333",
        title: "✖️ Multiplication Practice ✖️",
        script: "3-multiplication.js",
        type1: "3 digit × 1 digit",
        type2: "2 digit × 2 digit"
    },
    {
        gamekey:"444",
        title: "Lightning Sum",
        script: "5-lightning-sum.js",
        type1: "1 to 9",
        type2: "10 to 20"
    },
    {
        gamekey:"555",
        title: "Table Practice",
        script: "4-table-practice.js",
        type1: "1 digit",
        type2: "2 digit"
    },
    {
        gamekey:"666",
        title: "Roman to Number",
        script: "6-number←roman.js",
        type1: "1 to 99",
        type2: "More than 99"
    },
    {
        gamekey:"777",
        title: "Word to Number",
        script: "7-number←word.js",
        type1: "1 to 99",
        type2: "more than 99"
    }
];

let index = 0;
let isPortrait = window.innerHeight > window.innerWidth;

games.forEach((game, i) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.gamekey = game.gamekey; // Add gamekey as a data attribute
    card.style.background = `linear-gradient(135deg, hsl(${i * 60}, 80%, 60%), hsl(${(i * 60) + 30}, 80%, 40%))`;
    card.style.transition = "transform 0.5s ease, opacity 0.5s ease"; // Add smooth transition
    card.innerHTML = game.title.replace(/ /g, "<br>");
    card.addEventListener("click", () => {
        if (card.classList.contains("active")) {
            document.getElementById("game-menu").style.display = "none";  
            document.getElementById("game").style.display = "flex";  
            document.getElementById("title").innerHTML = game.title;
            document.getElementById("type11").innerHTML = game.type1;
            document.getElementById("type12").innerHTML = game.type2;
            const script = document.createElement("script");
            script.src = `gameJS/${game.script}`;
            document.body.appendChild(script);
        }
    });
    cardContainer.appendChild(card);

    const dot = document.createElement("div");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);

    // Automatically load the game if gameID matches gamekey
    if (gameID === game.gamekey) {
        document.getElementById("game-menu").style.display = "none";  
        document.getElementById("game").style.display = "flex";  
        document.getElementById("title").innerHTML = game.title;
        document.getElementById("type11").innerHTML = game.type1;
        document.getElementById("type12").innerHTML = game.type2;
        const script = document.createElement("script");
        script.src = `gameJS/${game.script}`;
        document.body.appendChild(script);
    }
});

const cards = document.querySelectorAll(".card");
const dots = document.querySelectorAll(".dot");

function updateCards() {
    isPortrait = window.innerHeight > window.innerWidth;
    messageBox.textContent = isPortrait ? "Swipe Up or Down" : "Swipe Left or Right Arrow Keys";
    
    cards.forEach((card, i) => {
        let position = (i - index + cards.length) % cards.length;
        if (isPortrait) {
            let translate = position * 80;
            card.style.transform = `translateY(${translate}px) scale(${1 - Math.abs(position * 0.1)})`;
        } else {
            let translate = position * 50;
            card.style.transform = `translateX(${translate}px) scale(${1 - Math.abs(position * 0.1)})`;
        }
        card.style.opacity = position === 0 ? "1" : "0.6";
        card.style.zIndex = cards.length - Math.abs(position);
        card.classList.toggle("active", position === 0);
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
    });
}

function swipePrev() {
    index = (index - 1 + cards.length) % cards.length;
    updateCards();
}

function swipeNext() {
    index = (index + 1) % cards.length;
    updateCards();
}

let startX = 0, startY = 0;
document.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener("touchend", (e) => {
    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;
    let diffX = startX - endX;
    let diffY = startY - endY;
    
    if (isPortrait) {
        if (Math.abs(diffY) > 50) diffY > 0 ? swipeNext() : swipePrev();
    } else {
        if (Math.abs(diffX) > 50) diffX > 0 ? swipeNext() : swipePrev();
    }
});

document.addEventListener("keydown", (event) => {
    if (isPortrait) {
        if (event.key === "ArrowUp") swipePrev();
        if (event.key === "ArrowDown") swipeNext();
    } else {
        if (event.key === "ArrowLeft") swipePrev();
        if (event.key === "ArrowRight") swipeNext();
    }
});

window.addEventListener("resize", updateCards);
updateCards();
