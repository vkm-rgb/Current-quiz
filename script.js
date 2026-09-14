const questions = [

{
    question:
    "भारत में वित्तीय वर्ष किस अवधि को कहा जाता है?",

    options: [
        "1 जनवरी से 31 दिसंबर",
        "1 अप्रैल से 31 मार्च",
        "1 जुलाई से 30 जून",
        "1 अक्टूबर से 30 सितंबर"
    ],

    answer: 1,

    explanation:
    "भारत में वित्तीय वर्ष 1 अप्रैल से 31 मार्च तक होता है।"
},

{
    question:
    "भारत का सर्वोच्च न्यायालय कहाँ स्थित है?",

    options: [
        "मुंबई",
        "नई दिल्ली",
        "कोलकाता",
        "चेन्नई"
    ],

    answer: 1,

    explanation:
    "भारत का सर्वोच्च न्यायालय नई दिल्ली में स्थित है।"
},

{
    question:
    "भारतीय संविधान में मौलिक अधिकार किस भाग में हैं?",

    options: [
        "भाग I",
        "भाग II",
        "भाग III",
        "भाग IV"
    ],

    answer: 2,

    explanation:
    "मौलिक अधिकार संविधान के भाग III में दिए गए हैं।"
},

{
    question:
    "भारत की संसद के कितने सदन हैं?",

    options: [
        "एक",
        "दो",
        "तीन",
        "चार"
    ],

    answer: 1,

    explanation:
    "भारतीय संसद राष्ट्रपति तथा दो सदनों—लोकसभा और राज्यसभा—से मिलकर बनती है।"
},

{
    question:
    "नीति आयोग की स्थापना किस वर्ष हुई?",

    options: [
        "2012",
        "2013",
        "2015",
        "2017"
    ],

    answer: 2,

    explanation:
    "नीति आयोग की स्थापना 1 जनवरी 2015 को हुई थी।"
}

];


let currentQuestion = 0;

let selectedAnswers =
    Array(questions.length).fill(null);

let reviewStatus =
    Array(questions.length).fill(false);

let timeLeft = 15 * 60;

let timer;


function startQuiz() {

    const name =
        document.getElementById("userName")
        .value.trim();

    if (!name) {

        alert("कृपया अपना नाम लिखें।");

        return;
    }

    localStorage.setItem(
        "quizUserName",
        name
    );

    document
        .getElementById("startScreen")
        .classList.add("hidden");

    document
        .getElementById("quizScreen")
        .classList.remove("hidden");

    loadQuestion();

    createPalette();

    timer = setInterval(updateTimer, 1000);
}


function updateTimer() {

    let minutes =
        Math.floor(timeLeft / 60);

    let seconds =
        timeLeft % 60;

    document.getElementById("timer")
        .innerText =
        `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;

    timeLeft--;

    if (timeLeft < 0) {

        clearInterval(timer);

        submitQuiz();
    }
}


function loadQuestion() {

    const q =
        questions[currentQuestion];

    document.getElementById(
        "questionNumber"
    ).innerText =
        `प्रश्न ${currentQuestion + 1} / ${questions.length}`;

    document.getElementById(
        "question"
    ).innerText = q.question;

    const options =
        document.getElementById("options");

    options.innerHTML = "";

    q.options.forEach(
        (option, index) => {

            const button =
                document.createElement("button");

            button.className = "option";

            button.innerText =
                `${String.fromCharCode(65 + index)}. ${option}`;

            if (
                selectedAnswers[currentQuestion]
                === index
            ) {

                button.classList.add(
                    "selected"
                );
            }

            button.onclick =
                function () {

                    selectAnswer(index);
                };

            options.appendChild(button);
        }
    );

    updatePalette();
}


function selectAnswer(index) {

    selectedAnswers[currentQuestion] =
        index;

    loadQuestion();
}


function nextQuestion() {

    if (
        currentQuestion <
        questions.length - 1
    ) {

        currentQuestion++;

        loadQuestion();

    } else {

        alert("यह आखिरी प्रश्न है।");
    }
}


function previousQuestion() {

    if (currentQuestion > 0) {

        currentQuestion--;

        loadQuestion();
    }
}


function clearAnswer() {

    selectedAnswers[currentQuestion] =
        null;

    loadQuestion();
}


function markReview() {

    reviewStatus[currentQuestion] =
        !reviewStatus[currentQuestion];

    updatePalette();
}


function createPalette() {

    const palette =
        document.getElementById("palette");

    palette.innerHTML = "";

    questions.forEach(
        (_, index) => {

            const button =
                document.createElement("button");

            button.className =
                "paletteBtn";

            button.innerText =
                index + 1;

            button.onclick =
                function () {

                    currentQuestion =
                        index;

                    loadQuestion();
                };

            palette.appendChild(button);
        }
    );

    updatePalette();
}


function updatePalette() {

    const buttons =
        document.querySelectorAll(
            ".paletteBtn"
        );

    buttons.forEach(
        (button, index) => {

            button.classList.remove(
                "answered",
                "review"
            );

            if (
                selectedAnswers[index]
                !== null
            ) {

                button.classList.add(
                    "answered"
                );
            }

            if (
                reviewStatus[index]
            ) {

                button.classList.add(
                    "review"
                );
            }
        }
    );
}


function submitQuiz() {

    clearInterval(timer);

    let correct = 0;

    let wrong = 0;

    let attempted = 0;

    questions.forEach(
        (q, index) => {

            if (
                selectedAnswers[index]
                !== null
            ) {

                attempted++;

                if (
                    selectedAnswers[index]
                    === q.answer
                ) {

                    correct++;

                } else {

                    wrong++;
                }
            }
        }
    );


    const score =
        (correct * 2)
        -
        (wrong * 0.66);

    const accuracy =
        attempted > 0
        ?
        (correct / attempted) * 100
        :
        0;


    document
        .getElementById("quizScreen")
        .classList.add("hidden");

    document
        .getElementById("resultScreen")
        .classList.remove("hidden");


    document.getElementById(
        "resultName"
    ).innerText =
        localStorage.getItem(
            "quizUserName"
        );


    document.getElementById(
        "score"
    ).innerText =
        score.toFixed(2);


    document.getElementById(
        "attempted"
    ).innerText =
        attempted;


    document.getElementById(
        "correct"
    ).innerText =
        correct;


    document.getElementById(
        "wrong"
    ).innerText =
        wrong;


    document.getElementById(
        "accuracy"
    ).innerText =
        `Accuracy: ${accuracy.toFixed(2)}%`;


    showReview();
}


function showReview() {

    const container =
        document.getElementById(
            "reviewResult"
        );

    container.innerHTML =
        "<h3>Detailed Explanation</h3>";


    questions.forEach(
        (q, index) => {

            const div =
                document.createElement("div");

            div.className =
                "resultQuestion";


            const userAnswer =
                selectedAnswers[index];


            div.innerHTML = `

                <b>
                प्रश्न ${index + 1}
                </b>

                <p>
                ${q.question}
                </p>

                <p>
                आपका उत्तर:
                ${
                    userAnswer === null
                    ?
                    "Attempt नहीं किया"
                    :
                    q.options[userAnswer]
                }
                </p>

                <p>
                सही उत्तर:
                ${q.options[q.answer]}
                </p>

                <p>
                <b>Explanation:</b>
                ${q.explanation}
                </p>
            `;

            container.appendChild(div);
        }
    );
}
