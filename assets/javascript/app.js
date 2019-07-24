// * You'll create a trivia game that shows only one question
//      until the player answers it or their time runs out.
//      
//      - PICK A THEME
//      - establish variables
//          - questions, answers, correct answer, correct number, incorrect number, unanswered
//          - prevent duplicate questions per round
//          - shuffle order of answers each time
//      - nextQuestion function, called when time runs out, or after question answered

// * If the player selects the correct answer
//      show a screen congratulating them for choosing the right option.

//      - if answer matches correct variable
//          - load "Correct" page w/ graphics

// * After a few seconds, display the next question -- do this without user input.

//      - after timer, load next question

// * The scenario is similar for wrong answers and time-outs.

// * If the player runs out of time
//      tell the player that time's up and display the correct answer.

//      Wait a few seconds, then show the next question.

// * If the player chooses the wrong answer,
//      tell the player they selected the wrong option and then display the correct answer.

//      - if answer does NOT match correct variable
//          - load "Incorrect" page w/ correct answer listed and graphics

// * Wait a few seconds, then show the next question.

// * On the final screen,
//      show the number of correct answers, incorrect answers,
//      and an option to restart the game (without reloading the page).

//Start screen

//  Variable that will hold our setInterval that runs the stopwatch
// This code will run as soon as the page loads

// Query OpenTDB for questions




window.onload = function() {
    //Establish counter variables
    var rightAnswers = 0;
    var wrongAnswers = 0;
    var timeOuts = 0;
    var maxNumberOfQuestions = 10;
    var running = false;
    var timer = 20;

    //
    var resetGame = function() {
            rightAnswers = 0;
            wrongAnswers = 0;
            timeOuts = 0;
            maxNumberOfQuestions = 10;
        }
        //

    var start = function() {
        resetGame();
        $(".timer").empty();
        $("p.card-text").html("Welcome!");
        $(".buttons").append("<button>" + "Start!");
        $("button").attr("class", "btn-primary");
        $("button").attr("type", "button");

    }

    var endGame = function() {
        $(".timer").empty();
        $(".buttons").empty();
        $("p.card-text").html("GAME OVER!");
        $(".buttons").append("<button>" + "ReStart!");
    }

    var checkAnswer = function() {
            total = rightAnswers + wrongAnswers + timeOuts;
            if (total === maxNumberOfQuestions) {
                endGame();
            };
        }
        //
    function runTimer() {
        if (!running) {
            intervalId = setInterval(decrement, 1000);
            running = true;
        }
    }
    //timer countdown
    function decrement() {
        $(".timer").html(timer);
        timer--;

        //stop timer if reach 0
        if (timer === 0) {
            timeOuts++;
            stop();
            $(".buttons").empty;
            $("p.card-text").html("OOPS! Ran out of time!");
            $(".buttons").text("The answer was" + nextQuestion.correct)
        }
    }

    //timer stop
    function stop() {
        running = false;
        clearInterval(intervalId);
    }
    //Execute start function
    start();
    //Create onClick event and define the nextQuestion function
    $(".buttons>button").on("click", nextQuestion = function() {
        timer = 20;
        $(".buttons").empty();
        $.ajax({
            url: "https://opentdb.com/api.php?amount=1&difficulty=easy&type=multiple",
            method: "GET"
        }).then(function(response) {
            //
            runTimer();
            //
            for (let i = 0; i < response.results.length; i++) {

                // console.log(response.results[i]);
                // Populate text on page according to query results
                // var currentCategory = "Category: " + response.results[i].category;
                var currentQuestion = "Question: " + response.results[i].question;
                //Establish empty array for answers
                var theAnswers = [];
                //Populate theAnswers array with all incorrect answer results
                for (let j = 0; j < response.results[i].incorrect_answers.length; j++) {
                    theAnswers.push(response.results[i].incorrect_answers[j])
                }
                ////Populate theAnswers array with the correct answer
                theAnswers.push(response.results[i].correct_answer);
                var correct = response.results[i].correct_answer;
                //
                // console.log(correct);
            }
            //
            // console.log(currentCategory + " : " + currentQuestion);
            // Console log answers array pre-shuffle
            // console.log(theAnswers);
            //Implement Fisher-Yates shuffle on theAnswers array
            function shuffle(arr) {
                var m = arr.length,
                    t, i;
                // While there remain elements to shuffle…
                while (m) {
                    // Pick a remaining element…
                    i = Math.floor(Math.random() * m--);
                    // And swap it with the current element.
                    t = arr[m];
                    arr[m] = arr[i];
                    arr[i] = t;
                }
                return arr;
            }
            shuffle(theAnswers);

            //Console log array after shuffle
            // console.log(theAnswers);
            //Push category, question and answers to the DOM
            // $("h4.card-title").html(currentCategory);
            $("p.card-text").html(currentQuestion);
            //
            for (let i = 0; i < theAnswers.length; i++) {
                // Create variable to store aattributes of buttons
                var buttonVar = $("<button>");
                buttonVar.attr("value", theAnswers[i]);
                buttonVar.text(theAnswers[i]);
                // Append buttons to page
                $(".buttons").append(buttonVar);
            }


            $(".buttons>button").click(correctOrNot = function() {
                // console.log(this.value);
                if (this.value === correct) {
                    rightAnswers++;
                    nextQuestion();
                    console.log("CORRECT!", rightAnswers);
                    checkAnswer();
                } else {
                    wrongAnswers++;
                    nextQuestion();
                    console.log("NOT CORRECT", wrongAnswers);
                    checkAnswer();
                };
            });
        });

    });

}

//If correct answer is clicked, add 1 to rightAnswers
//If incorrect answer is clicked, add 1 to wrongAnswers
//On each click or timeout event, subtract 1 from maxNumber of Questions