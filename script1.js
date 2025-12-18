let score = 0;
let timeLeft = 20;
let timerInterval = null;
let gameRunning = false;
let currentItem = null;

// 10 Questions for the Quiz
// ---------------- QUIZ DATA ----------------
const questions = [
    {
        q: "What does recycling mean?",
        options: [
            "Throwing things in the trash forever",
            "Turning old things into new things",
            "Burning everything to make energy",
            "Buying more new stuff"
        ],
        correct: [1],
        explanation: "Recycling turns used items into new products to save resources and reduce waste."
    },
    {
        q: "What percentage of aluminum cans are recyclable?",
        options: [
            "20%",
            "50%",
            "100%",
            "Aluminum cans aren’t recyclable"
        ],
        correct: [2],
        explanation: "Aluminum can be recycled repeatedly without losing quality."
    },
    {
        q: "Which of these are usually recyclable?",
        options: [
            "Dirty food wrappers",
            "Empty plastic bottles",
            "Broken glass toys",
            "Used tissues"
        ],
        correct: [1],
        explanation: "Clean, empty plastic bottles are commonly accepted in recycling programs."
    },
    {
        q: "Which of these items is generally NOT accepted in curbside recycling programs?",
        options: [
            "Cardboard boxes",
            "Glass bottles",
            "Non-degradable plastic bags",
            "Aluminum foil"
        ],
        correct: [2],
        explanation: "Plastic bags can jam recycling machines and usually need special drop-off locations."
    },
    {
        q: "Which energy source is environmentally friendly?",
        options: ["Coal", "Oil", "Wind", "Diesel"],
        correct: [2],
        explanation: "Wind energy is renewable and produces no air pollution."
    },
    {
        q: "Which of the following actions helps reduce air pollution?",
        options: [
            "Burning waste",
            "Using private cars daily",
            "Using public transportation",
            "Cutting down trees"
        ],
        correct: [2],
        explanation: "Public transportation reduces the number of vehicles and emissions."
    },
    {
        q: "True or False: You should leave the caps on plastic bottles when recycling them.",
        options: [
            "False (caps were removed historically)",
            "True (modern technology can process bottle and cap together)"
        ],
        correct: [1],
        explanation: "Modern recycling systems can process caps together with bottles."
    },
    {
        q: "When is World Environment Day celebrated?",
        options: ["April 22", "May 5", "June 5", "July 1"],
        correct: [2],
        explanation: "World Environment Day is celebrated every year on June 5."
    },
    {
        q: "Choose TWO correct statements about student roles in sustainability at Taman Tasik Cyber.",
        options: [
            "Students can help sustainability by maintaining cleanliness",
            "Student actions have no impact on public behavior",
            "Responsible use of public spaces supports sustainability",
            "Environmental care is solely the responsibility of authorities"
        ],
        correct: [0, 2],
        explanation: "Students play a key role by maintaining cleanliness and using public spaces responsibly."
    },
    {
        q: "How does Taman Tasik Cyber MOST contribute to sustainability beyond environmental benefits? (Choose TWO)",
        options: [
            "It supports social sustainability by providing shared spaces",
            "It weakens sustainability by prioritizing leisure",
            "It promotes responsibility among students and the public",
            "It has limited value because sustainability must be taught formally"
        ],
        correct: [0, 2],
        explanation: "Shared spaces and community responsibility strengthen social sustainability."
    }
];

// ---------------- GENERATE QUIZ ----------------
const container = document.getElementById("quiz-container");

questions.forEach((item, index) => {
    const box = document.createElement("div");
    box.className = "question-box";

    let html = `<h3>${index + 1}. ${item.q}</h3>`;

    item.options.forEach((opt, i) => {
        const type = item.correct.length > 1 ? "checkbox" : "radio";
        html += `
            <label class="option">
                <input type="${type}" name="q${index}" value="${i}">
                ${String.fromCharCode(65 + i)}. ${opt}
            </label>
        `;
    });

    html += `<p class="feedback" id="feedback${index}"></p>`;
    box.innerHTML = html;
    container.appendChild(box);
});

// ---------------- SUBMIT QUIZ ----------------
document.getElementById("submitBtn").addEventListener("click", () => {
    let score = 0;

    questions.forEach((item, index) => {
        const selected = [...document.querySelectorAll(`input[name="q${index}"]:checked`)]
            .map(input => parseInt(input.value));

        const feedback = document.getElementById(`feedback${index}`);

        if (
            selected.length === item.correct.length &&
            selected.every(v => item.correct.includes(v))
        ) {
            score++;
            feedback.innerHTML = "✅ Correct! " + item.explanation;
            feedback.style.color = "green";
        } else {
            feedback.innerHTML = "❌ Incorrect. " + item.explanation;
            feedback.style.color = "red";
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


