// TODO: "Play again" animation

var selectedOperation, fact_tri, availableFacts, correctAnswer, fact, timerStart, resultTextTimeout, missedProblems;
var missedShowing = false;
var score = 0;

$(".option").click(function(){
    selectedOperation = $(this).attr('data-operationType');
    
    animateOutOptions($(this).attr('data-animationDist'), function(){
        animateStartTimer();
    });
});

function animateInPage() {
    $(".operationSelect").animate({
        "margin-top": "0vw",
        "opacity": "1"
    }, 200);
}

window.onload = animateInPage;

function animateOutPage() {
    $("#missedList").addClass("hidden");
    $(".scoreCounter").animate({
        "opacity": "0"
    }, 200);
    $("#playAgainButton, #viewMissedButton").animate({
        "bottom": "-8vw"
    }, 400, "easeInBack", function(){
        document.location.reload(true);
    });
}

function getCursorPosition(jqueryItem) {
    var input = jqueryItem.get(0);
    if (!input) return; // No (input) element found
    if ('selectionStart' in input) {
        // Standard-compliant browsers
        return input.selectionStart;
    } else if (document.selection) {
        // IE
        input.focus();
        var sel = document.selection.createRange();
        var selLen = document.selection.createRange().text.length;
        sel.moveStart('character', -input.value.length);
        $("#sel").html(sel);
        $("#selLen").html(selLen);
        return sel.text.length - selLen;
    }
}

function animateOutOptions(selectedNum, callback) {
    $(".operationSelect .header").animate({
        "bottom": "50px",
        "opacity": "0"
    }, 100, function(){
        $(".operationSelect").remove();
        callback();
    });
    $(".option").each(function(){
        $(this).css("cursor", "default").animate({
            "right": ($( this ).attr('data-animationDist') - selectedNum) * -20 + "px",
            "opacity": "0"
        }, 100);
    });
}

function animateStartTimer() {
    console.log("animation begin");
    var textElem = $(".startTimer");
    var animText = function(text, callback) {
        textElem.css({
            "opacity": "0",
            "margin-left": "50px"
        })
        .text(text)
        .animate({
            "opacity": "1",
            "margin-left": "0"
        }, 400, "easeOutExpo")
        .animate({
            "opacity": "0",
            "margin-left": "-50px"
        }, 400, "easeInExpo", callback);
    }
    
    animText("3", function(){
        animText("2", function(){
            animText("1", function(){
                animText("Begin!", function(){
                    textElem.remove();
                    initGame();
                });
            });
        });
    });
}

function resetFactTris() {
    fact_tri = {
        add: [],
        mult: []
    };

    for (i = 0; i <= 9; i++) {
        for (n = 0; n <= 9; n++) {
            fact_tri.add.push([i, n, i + n]);
            fact_tri.mult.push([i, n, i * n]);
        }
    }
    
    availableFacts = {
        add: [],
        sub: [],
        mult: [],
        div: []
    };
    
    for(i = 0; i <= 100; i++) {
        availableFacts.add[i] = i;
        availableFacts.sub[i] = i;
        availableFacts.mult[i] = i;
        if(i >= 10) {availableFacts.div.push(i); }
    }
}

function initGame() {
    resetFactTris();
    missedProblems = [];
    setProblem();
    timerStart = new Date().getTime();
    $(".problemWrapper").css({
        "display": "block",
        "opacity": "0"
    }).animate({
        "opacity": "1"
    }, 100);
    $(".scoreCounter, .timeDisp").animate({
        "top": "1vw"
    }, 800, "easeOutElastic");
    $("#answerInput").focus();
    $("#answerInput").blur(function(){
        $(this).focus();
    });
    function checkInput() {
        var val = $("#answerInput").val();
        if(val.slice(-1) == "e" || val.length > 2) {
            $("#answerInput").val(val.substring(0, val.length - 1));
        }
    }
    $("#answerInput").keydown(function(e) {
        var key = e.keyCode;
        if(key >= 96 && key <= 105) {
            key -= 48;
            console.log("numpad pressed");
        }
        var keepKeys = [8, 37, 38, 39, 40, 46]
        if(keepKeys.indexOf(key) > -1) { return; } // Keys we want to keep normal
        e.preventDefault();
        if(key === 13) {
            submitAnswer();
            return;
        } // Enter
        var allowedChars = "0123456789";
        var pos = getCursorPosition($(this));
        var string = $(this).val();
        string = string.slice(0, pos) + String.fromCharCode(key) + string.slice(pos);
        string = string.slice(0, 2); // Max out length
        var newString = "";
        for(i = 0; i < string.length; i++) {
            if(allowedChars.indexOf(string.charAt(i)) > -1) {
                newString += string.charAt(i);
            }
        }
        $(this).val(newString);
    });
    
    timerInterval = window.setInterval(timerDisplay, 200);
}

function pickFact() {
    var selectedOperationTmp;
    switch(selectedOperation) {
        case "addition":
            selectedOperationTmp = 0;
            break;
        case "subtraction":
            selectedOperationTmp = 1;
            break;
        case "multiplication":
            selectedOperationTmp = 2;
            break;
        case "division":
            selectedOperationTmp = 3;
            break;
        case "mixed":
            selectedOperationTmp = 4;
            break;
    }
    
    if(selectedOperationTmp == 4) {
        selectedOperationTmp = Math.floor(Math.random()*4);
    }
    
    var selectedProblem;
    switch(selectedOperationTmp) {
        case 0:
            var problemNumber = Math.floor(Math.random()*availableFacts.add.length);
            selectedProblem = fact_tri.add[availableFacts.add[problemNumber]];
            availableFacts.add.splice(problemNumber, 1);
            break;
        case 1:
            var problemNumber = Math.floor(Math.random()*availableFacts.sub.length);
            selectedProblem = fact_tri.add[availableFacts.sub[problemNumber]];
            availableFacts.sub.splice(problemNumber, 1);
            break;
        case 2:
            var problemNumber = Math.floor(Math.random()*availableFacts.mult.length);
            selectedProblem = fact_tri.mult[availableFacts.mult[problemNumber]];
            availableFacts.mult.splice(problemNumber, 1);
            break;
        case 3:
            var problemNumber = Math.floor(Math.random()*availableFacts.div.length);
            selectedProblem = fact_tri.mult[availableFacts.div[problemNumber]];
            availableFacts.div.splice(problemNumber, 1);
            break;
        default:
            console.log("Error: Selected Operation not valid");
            break;
    }
    
    if(selectedProblem === undefined) {
        return pickFact(); // I have no shame
    }
    
    if(availableFacts.add.length == 0 ||
       availableFacts.sub.length == 0 ||
       availableFacts.mult.length == 0 ||
       availableFacts.div.length == 0) {
        resetFactTris();
    }
    
    return {
        fact_tri: selectedProblem,
        operation: selectedOperationTmp
    };
}

function setProblem() {
    fact = pickFact();
    console.log(fact);
    
    // Set operation class for #problemIcon
    $("#problemIcon").removeClass("operation-1").removeClass("operation-2").removeClass("operation-3").removeClass("operation-4").addClass("operation-" + String(fact.operation + 1));
    
    if(fact.operation == 1 || fact.operation == 3) {
        $("#firstNum").text(fact.fact_tri[2]);
        $("#secondNum").text(fact.fact_tri[0]);
        correctAnswer = fact.fact_tri[1];
    } else {
        $("#firstNum").text(fact.fact_tri[0]);
        $("#secondNum").text(fact.fact_tri[1]);
        correctAnswer = fact.fact_tri[2];
    }
    
    $("#answerInput").val("");
    
    // 100% hack solution to strange and uncommon bug
    window.setTimeout(function(){
        if($("#answerInput").val() !== "") {
            setProblem();
        }
    }, 10);
    // I deserve to be hung
}

function submitAnswer() {
    if($("#answerInput").val() !== "") {
        if(parseInt($("#answerInput").val()) == parseInt(correctAnswer)) {
            score++;
            $("#answerResult").addClass("correct").addClass("showing");
            window.clearTimeout(resultTextTimeout);
            resultTextTimeout = window.setTimeout(function(){
                $("#answerResult").removeClass("showing");
            }, 1000);
        } else {
            //console.log(correctionString(fact));
            missedProblems.push({
                fact: fact,
                incorrectAnswer: $("#answerInput").val()
            });
            score -= 3;
            $("#answerResult").removeClass("correct").addClass("showing");
            window.clearTimeout(resultTextTimeout);
            resultTextTimeout = window.setTimeout(function(){
                $("#answerResult").removeClass("showing");
            }, 2000);
        }
        $(".scoreNum").text(score);
        setProblem();
    }
}

function correctionString(fact_obj, incorrect) {
    var operationSymbols = ['<div class="icon icon-text"><div class="addition-1"></div><div class="addition-2"></div></div>',
                            '<div class="icon icon-text"><div class="subtraction-1"></div></div>',
                            '<div class="icon icon-text"><div class="multiplication-1"></div><div class="multiplication-2"></div></div>',
                            '<div class="icon icon-text"><div class="division-1"></div><div class="division-2"></div><div class="division-3"></div></div>'];
    
    if(fact_obj.operation == 1 || fact_obj.operation == 3) {
        return("<tr><td>" + String(fact_obj.fact_tri[2]) + operationSymbols[fact_obj.operation] + String(fact_obj.fact_tri[0]) + " = <span>" + String(fact_obj.fact_tri[1]) + "</span></td><td><span>" + String(incorrect) + "</span></td></tr>");
    } else {
        return("<tr><td>" + String(fact_obj.fact_tri[0]) + operationSymbols[fact_obj.operation] + String(fact_obj.fact_tri[1]) + " = <span>" + String(fact_obj.fact_tri[2]) + "</span></td><td><span>" + String(incorrect) + "</span></td></tr>");
    }
}

function timerDisplay() {
    var elapsedMilli = new Date().getTime() - timerStart;
    if(elapsedMilli > 5 * 60 * 1000) {
        endGameAnimation();
        return;
    }
    var elapsedSec = elapsedMilli / 1000;
    var elapsedMin = Math.ceil(Math.floor(elapsedSec) / 60);
    elapsedSec = elapsedSec % 60;
    
    var dispMin = String(5 - Math.ceil(elapsedMin));
    var dispSec = String((60 - Math.floor(elapsedSec)) % 60);
    if(dispSec.length < 2) {
        dispSec = "0" + dispSec;
    }
    
    $(".timeDisp").text(dispMin + ":" + dispSec);
}

function endGameAnimation() {
    clearInterval(timerInterval);
    $(".timeDisp").text("0:00").animate({
        "top": "-8vw"
    }, 400, "easeInBack");
    $(".problemWrapper").animate({
        "opacity": "0"
    }, 200, "", function(){
        $(this).css("display", "none");
    });
    $(".scoreCounter").removeClass("noHighlight").animate({
        "top": "50%",
        "right": "50%",
        "font-size": "6vw"
    }, 400).css({
        "transform": "translate(50%, -50%)"
    });
    var animateInString = "#playAgainButton";
    if(missedProblems.length > 0) {
        animateInString = "#playAgainButton, #viewMissedButton";
    }
    $(animateInString).animate({
        "bottom": "2vw"
    }, 1000, "easeOutElastic");
    $("#playAgainButton").click(function(){
        animateOutPage();
    });
    setMissedProblemsTable();
    $("#viewMissedButton").click(function(){
        $("#missedList").toggleClass("hidden");
        missedShowing = !missedShowing;
        if(missedShowing) {
            $("#viewMissedButton").text("Hide Missed Problems");
        } else {
            $("#viewMissedButton").text("Show Missed Problems");
        }
    });
}

function setMissedProblemsTable() {
    var html = "<tr><td>Correct Answer</td><td>Your Answer</td></tr>";
    for(i = 0; i < missedProblems.length; i++) {
        console.log("<-- that many missed problems")
        html += correctionString(missedProblems[i].fact, missedProblems[i].incorrectAnswer);
    }
    $("#missedList table").html(html);
}