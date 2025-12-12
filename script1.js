let score = 0;
let timeLeft = 20;
let timerInterval = null;
let gameRunning = false;
let currentItem = null;

// 10 Questions for the Quiz
const questions = [
    {
        q: "Which of the following items can be recycled?",
        a: ["Plastic bottle", "Food waste", "Ceramic plate", "Tissue paper"],
        correct: 0
    },
    {
        q: "What bin should paper go into?",
        a: ["Plastic Bin", "Metal Bin", "Paper Bin", "Glass Bin"],
        correct: 2
    },
    {
        q: "Which action is BEST for the environment?",
        a: ["Reuse items", "Throw everything", "Burn waste", "Use only plastic"],
        correct: 0
    },
    {
        q: "Recycling helps reduce:",
        a: ["Air pollution", "Noise", "Earthquakes", "Tides"],
        correct: 0
    },
    {
        q: "Metal cans are usually made from:",
        a: ["Gold", "Aluminium", "Wood", "Rubber"],
        correct: 1
    },
    {
        q: "Glass can be recycled:",
        a: ["Only once", "Many times", "Never", "Only if broken"],
        correct: 1
    },
    {
        q: "Which is a recyclable paper item?",
        a: ["Greasy pizza box", "Newspaper", "Wet tissue", "Used napkin"],
        correct: 1
    },
    {
        q: "Recycling saves:",
        a: ["Energy", "Nothing", "Water only", "Trees only"],
        correct: 0
    },
    {
        q: "Which symbol represents recycling?",
        a: ["⚠️", "♻️", "❌", "⭐"],
        correct: 1
    },
    {
        q: "Plastic bottles should be recycled after:",
        a: ["Burning them", "Crushing them", "Throwing in nature", "Throwing into the ocean"],
        correct: 1
    }
];

// Generate Quiz Using Loop
const container = document.getElementById("quiz-container");

questions.forEach((item, index) => {
    let qBox = document.createElement("div");
    qBox.classList.add("question-box");

    let questionHTML = `<h3>${index + 1}. ${item.q}</h3>`;

    item.a.forEach((option, i) => {
        questionHTML += `
            <label class="option">
                <input type="radio" name="q${index}" value="${i}">
                ${String.fromCharCode(65 + i)}. ${option}
            </label>
        `;
    });

    qBox.innerHTML = questionHTML;
    container.appendChild(qBox);
});

// Submit Quiz
document.getElementById("submitBtn").addEventListener("click", () => {
    let score = 0;

    questions.forEach((item, index) => {
        let selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (selected && parseInt(selected.value) === item.correct) {
            score++;
        }
    });

    document.getElementById("result").innerHTML = `Your Score: ${score} / 10`;
});



/* -------------------------------
   RECYCLING GAME
--------------------------------*/
function startGame() {
    if (gameRunning) return;

    score = 0;
    timeLeft = 20;
    document.getElementById("score").textContent = score;
    document.getElementById("time").textContent = timeLeft;

    gameRunning = true;

    startTimer();
    spawnItem();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("time").textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame("⏳ Time's Up!");
        }
    }, 1000);
}

function endGame(message) {
    gameRunning = false;
    clearInterval(timerInterval);

    // Remove remaining item
    if (currentItem) currentItem.remove();

    alert(`${message}\nYour Score: ${score}`);
}

function spawnItem() {
    if (!gameRunning) return;

    const gameArea = document.getElementById("gameArea");
    const items = [
        { type: "metal", img: "./Pictures/metal.jpg" },
        { type: "paper", img: "./Pictures/paper.jpg" },
        { type: "glass", img: "./Pictures/glass.jpg" }
    ];

    const itemData = items[Math.floor(Math.random() * items.length)];

    const item = document.createElement("div");
    item.className = "item";
    item.dataset.type = itemData.type;

    item.style.backgroundImage = `url(${itemData.img})`;
    item.style.backgroundSize = "cover";
    item.style.backgroundPosition = "center";

    item.style.left = Math.random() * (gameArea.clientWidth - 60) + "px";
    item.style.top = Math.random() * 150 + "px";

    gameArea.appendChild(item);
    currentItem = item;

    enableDrag(item);
}

function enableDrag(el) {
    let offsetX = 0, offsetY = 0;

    el.addEventListener("touchstart", dragStart);
    el.addEventListener("touchmove", dragMove);
    el.addEventListener("touchend", dragEnd);

    el.addEventListener("mousedown", dragStart);

    function dragStart(e) {
        let pos = e.touches ? e.touches[0] : e;
        offsetX = pos.clientX - el.offsetLeft;
        offsetY = pos.clientY - el.offsetTop;

        document.addEventListener("mousemove", dragMove);
        document.addEventListener("mouseup", dragEnd);
    }

    function dragMove(e) {
        let pos = e.touches ? e.touches[0] : e;
        el.style.left = (pos.clientX - offsetX) + "px";
        el.style.top = (pos.clientY - offsetY) + "px";
    }

    function dragEnd() {
        checkDrop(el);
        document.removeEventListener("mousemove", dragMove);
        document.removeEventListener("mouseup", dragEnd);
    }
}

function checkDrop(item) {
    const bins = document.querySelectorAll(".bin");

    bins.forEach(bin => {
        const rect1 = item.getBoundingClientRect();
        const rect2 = bin.getBoundingClientRect();

        const overlap =
            rect1.left < rect2.right &&
            rect1.right > rect2.left &&
            rect1.top < rect2.bottom &&
            rect1.bottom > rect2.top;

        if (overlap) {
            if (!gameRunning) return;

            if (bin.dataset.type === item.dataset.type) {
                score++;
                document.getElementById("score").textContent = score;
                item.remove();
                spawnItem();
            } else {
                // Wrong bin: Game Over
                endGame("❌ Wrong Bin!");
            }
        }
    });
}
