const listOfAllDice = document.querySelectorAll(".die");
const scoreInputs = document.querySelectorAll("#score-options input");
const scoreSpans = document.querySelectorAll("#score-options span");
const currentRound = document.getElementById("current-round");
const currentRoundRolls = document.getElementById("current-round-rolls");
const totalScore = document.getElementById("total-score");
const scoreHistory = document.getElementById("score-history");
const rollDiceBtn = document.getElementById("roll-dice-btn");
const keepScoreBtn = document.getElementById("keep-score-btn");
const rulesContainer = document.querySelector(".rules-container");
const rulesBtn = document.getElementById("rules-btn");

let diceValuesArr = [];
let isModalIsShowing = false;
let score = 0;
let total = 0;
let round = 1;
let rolls = 0;

/* TO SHOW / HIDE RULES */
rulesBtn.addEventListener("click", () => {
    isModalIsShowing = !isModalIsShowing;

    if (isModalIsShowing) {
        rulesBtn.textContent = "Hide rules";
        rulesContainer.style.display = "block";
    } else {
        rulesBtn.textContent = "Show rules";
        rulesContainer.style.display = "none";  
    }
});

/* ROLL DICE - GENERATE RANDOM NUMBER 1 - 6 (inclusive) */
const rollDice = () => {
    diceValuesArr = [];

    for (let i = 0; i < 5; i++) {
        const randomDice = Math.floor(Math.random() * 6) + 1;
        diceValuesArr.push(randomDice)
    };
    /* TO DISPLAY NUMBER */
    listOfAllDice.forEach((dice, index) => {
        dice.textContent = diceValuesArr[index]
    })
};

 /* TO UPDATE STATS */
 const updateStats = () => {
    currentRoundRolls.textContent = rolls;
    currentRound.textContent = round;
 };

 /* TO UPDATE RADIO OPTION */
 const updateRadioOption = (index, score) => {
    scoreInputs[index].disabled = false;
    scoreInputs[index].value = score;
    scoreSpans[index].textContent = `, score =${score}`

 };
  
/* TO ROLL THE DICE */
rollDiceBtn.addEventListener("click", () => {
    if (rolls === 3) {
        alert("You have maade three rolls this round. Please select a score")
    } else {
        rolls++
        rollDice();
        updateStats();
        getHighestDuplicates(diceValuesArr);
    }

})

/* TO ASSIGN OPTION BASED ON CONDITION */
/******************************************/

/* OPTION 1: THREE OF A KIND - THE SAME THREE NUMBER */
/* OPTION 2: FOUR OF A KIND - THE SAME FOUR NUMBER */
const getHighestDuplicates = (arr) => {
    const counts = {};

    for (const num of arr) {
        if (counts[num]) {
            counts[num]++;
        } else {
            counts[num] = 1;
        }
    };

    let highestCount = 0;
    
    for (const num of arr) {
        const count = counts[num];
        if (count >= 3 && count > highestCount) {
            highestCount = count;
        }
        if (count >= 4 && count > highestCount) {
            highestCount = count;
        }
    };

    const sumofAllDice = arr.reduce((a, b) => a + b, 0);

    if (highestCount >= 4) {
        updateRadioOption(1, sumofAllDice);
    }
    if (highestCount >= 3 ) {
        updateRadioOption(0, sumofAllDice);
    }

    updateRadioOption(5, 0);
};

/* OPTION 3: FULL HOUSE */
const detectFullHouse = (arr) => {
    const counts =  {};

    for (const num of arr) {
        counts[num] = counts[num] ? counts[num] + 1 : 1;
    }
    const hasThreeOfAKind = Object.values(counts).includes(3);
    const hasPair = KeyObject.values(counts).includes(2);

    if (hasThreeOfAKind && hasPair) {
        updateRadioOption(2, 25);
    }
    updateRadioOption(5, 0);

};

/* OPTION 4: SMALL STRAIGHT */
/* OPTION 5: LARGE STARIGHT */
const checkForStraights = (arr) => {
    const sorted = arr.slice().sort((a, b) => a - b);
    const isConsecutive = (numbers) => {
        for (let i = 1; i < numbers.length; i++) {
            if (numbers[i] !== numbers[i - 1] + 1) {
                return false;
            }
        }
        return true;
    };
    if (sorted.length === 5 && isConsecutive(sorted)) {
        updateRadioOption(4, 40);
        updateRadioOption(3, 30);
    } else {
        const smallStraightPatterns = [
            [1, 2, 3, 4],
            [2, 3, 4, 5],
            [3, 4, 5, 6]
        ];
        let isSmallStraight = false;
        for (const pattern of smallStraightPatterns) {
            if (pattern.every(num => sorted.includes(num))) {
                isSmallStraight = true;
                break;
            }
        }
        if (isSmallStraight) {
            updateRadioOption(3, 30);
        } else {
            updateRadioOption(5, 0)
        }
        updateRadioOption(5, 0)
    }

};

/* TO UPDATE SCORE */
const updateScore = (selectedValue, achived ) => {
    score += parseInt(selectedValue);
    totalScore.textContent = score;

    scoreHistory.innerHTML += `<li>${achived} : ${selectedValue}</li>`
};
   
/* TO KEEP SELECTED SCORE */
keepScoreBtn.addEventListener("click", () => {
    let selectedValue;
    let achieved;

    for (const radioButton of scoreInputs) {
        if (radioButton.checked) {
            selectedValue = radioButton.value;
            achieved = radioButton.id;
            break;
        }
    }

    if (selectedValue) {
        rolls = 0;
        round++;
        updateStats();
        resetRadioOptions();
        updateScore(selectedValue, achieved);
        if (round > 6) {
            setTimeout(() =>{
                alert(`"Game Over! Your total score is ${score}"`)
                resetGame();
            }, 500)
        }
    } else {
        alert("Please select an option or roll the dice")
    }
});

/* TO RESET RADIO OPTION */
const resetRadioOptions = () => {
    scoreInputs.forEach((input) => {
        input.disabled = true;
        input.checked = false;
    });

    scoreSpans.forEach((span) => {
        span.textContent = "";
    });
}

/* TO RESET GAME */
const resetGame = () => {
    diceValuesArr = [0, 0, 0, 0, 0, 0];
    score = 0;
    round = 1;
    rolls = 0;

    listOfAllDice.forEach((dice, index) => {
        dice.textContent = diceValuesArr[index]
    });

    totalScore.textContent = score;
    scoreHistory.innerHTML = "";

    currentRoundRolls.textContent = rolls;
    currentRound.textContent = round;

    resetRadioOptions();
}