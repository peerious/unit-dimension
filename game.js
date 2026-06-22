/* =====================================
   GAME.JS
   Space Mission v6
   PART 1
===================================== */

/* =====================================
   GLOBAL VARIABLES
===================================== */

let resultSaved = false;
const GOOGLE_SCRIPT_URL ="https://script.google.com/macros/s/AKfycbwDQUoIkpo_SPR3jen_o8AJV1vZtWHzoTs5Gf3BKge_bbAJ9MYuaRZOGeLKkoW4OulB/exec";

let studentId = "";
let studentEmail = "";

let mode = "mixed";

let currentQuestion = 0;

let totalQuestions = 20;

let score = 0;

let combo = 0;

let hp = 5;

let correctAnswers = 0;

let totalAnswered = 0;

let currentData = null;

let questionPool = [];

let wrongTopics = [];

let questionLog = [];

let questionStartTime = 0;

/* =====================================
   QUESTION DATABASE
===================================== */
const DATABASE = [

{
name:"Velocity",
thai:"ความเร็ว",
unit:"m/s",
dimension:"[L T⁻¹]",
formula:"v = dx/dt",
meaning:"อัตราการเปลี่ยนตำแหน่งต่อเวลา"
},

{
name:"Acceleration",
thai:"ความเร่ง",
unit:"m/s²",
dimension:"[L T⁻²]",
formula:"a = dv/dt",
meaning:"อัตราการเปลี่ยนความเร็วต่อเวลา"
},

{
name:"Force",
thai:"แรง",
unit:"N",
dimension:"[M L T⁻²]",
formula:"F = ma",
meaning:"สาเหตุที่ทำให้วัตถุเปลี่ยนสภาพการเคลื่อนที่"
},

{
name:"Momentum",
thai:"โมเมนตัม",
unit:"kg·m/s",
dimension:"[M L T⁻¹]",
formula:"p = mv",
meaning:"ผลคูณของมวลและความเร็ว"
},

{
name:"Impulse",
thai:"อิมพัลส์",
unit:"N·s",
dimension:"[M L T⁻¹]",
formula:"J = Δp",
meaning:"การเปลี่ยนแปลงโมเมนตัม"
},

{
name:"Work",
thai:"งาน",
unit:"J",
dimension:"[M L² T⁻²]",
formula:"W = Fd",
meaning:"พลังงานที่ถ่ายโอนโดยแรง"
},

{
name:"Kinetic Energy",
thai:"พลังงานจลน์",
unit:"J",
dimension:"[M L² T⁻²]",
formula:"K = ½mv²",
meaning:"พลังงานเนื่องจากการเคลื่อนที่"
},

{
name:"Potential Energy",
thai:"พลังงานศักย์โน้มถ่วง",
unit:"J",
dimension:"[M L² T⁻²]",
formula:"U = mgh",
meaning:"พลังงานเนื่องจากตำแหน่ง"
},

{
name:"Power",
thai:"กำลัง",
unit:"W",
dimension:"[M L² T⁻³]",
formula:"P = W/t",
meaning:"อัตราการทำงาน"
},

{
name:"Pressure",
thai:"ความดัน",
unit:"Pa",
dimension:"[M L⁻¹ T⁻²]",
formula:"P = F/A",
meaning:"แรงต่อหนึ่งหน่วยพื้นที่"
},

{
name:"Density",
thai:"ความหนาแน่น",
unit:"kg/m³",
dimension:"[M L⁻³]",
formula:"ρ = m/V",
meaning:"มวลต่อหนึ่งหน่วยปริมาตร"
},

{
name:"Frequency",
thai:"ความถี่",
unit:"Hz",
dimension:"[T⁻¹]",
formula:"f = 1/T",
meaning:"จำนวนรอบต่อวินาที"
},

{
name:"Angular Velocity",
thai:"อัตราเร็วเชิงมุม",
unit:"rad/s",
dimension:"[T⁻¹]",
formula:"ω = dθ/dt",
meaning:"อัตราการเปลี่ยนมุมต่อเวลา"
},

{
name:"Torque",
thai:"แรงบิด",
unit:"N·m",
dimension:"[M L² T⁻²]",
formula:"τ = rF",
meaning:"แนวโน้มที่ทำให้เกิดการหมุน"
},

{
name:"Angular Momentum",
thai:"โมเมนตัมเชิงมุม",
unit:"kg·m²/s",
dimension:"[M L² T⁻¹]",
formula:"L = r × p",
meaning:"โมเมนตัมของการเคลื่อนที่แบบหมุน"
}

];

const ALL_FORMULAS =

DATABASE.map(
x => x.formula
);

const ALL_MEANINGS =

DATABASE.map(
x => x.meaning
);

/* =====================================
   SHORT LISTS
===================================== */

const ALL_UNITS = [

"m",
"m/s",
"m/s²",
"N",
"J",
"W",
"Pa",
"kg·m/s",
"kg/m³",
"Hz",

];

const ALL_DIMENSIONS = [

"[L]",
"[L T⁻¹]",
"[L T⁻²]",
"[M L T⁻²]",
"[M L² T⁻²]",
"[M L² T⁻³]",
"[M L⁻¹ T⁻²]",
"[M L T⁻¹]",
"[M L⁻³]",
"[T⁻¹]"

];

/* =====================================
   START GAME
===================================== */

window.addEventListener(

    "load",

    ()=>{

        document
        .getElementById(
            "startBtn"
        )
        .addEventListener(

            "click",

            startGame

        );

        document
        .getElementById(
            "restartBtn"
        )
        .addEventListener(

            "click",

            ()=>{

                location.reload();

            }

        );

        createStars();

    }

);

function startGame(){

studentId =
document
.getElementById(
    "studentId"
)
.value
.trim();

studentEmail =
document
.getElementById(
    "studentEmail"
)
.value
.trim();

if(
    studentId === "" ||
    studentEmail === ""
){

    alert(
        "กรุณากรอก Student ID และ Email"
    );

    return;
}

if(
    !studentEmail.endsWith(
        "@ku.ac.th"
    )
){

    alert(
        "กรุณาใช้ Email KU"
    );

    return;
}

if(
    studentId.length !== 10
){

    alert(
        "Student ID ไม่ถูกต้อง"
    );

    return;
}

    playClick();

    mode =

        document
        .getElementById(
            "mode"
        )
        .value;

    totalQuestions = Number(

        document
        .getElementById(
            "questionCount"
        )
        .value

    );

    hp = Number(

        document
        .getElementById(
            "energyCount"
        )
        .value

    );

    document
    .getElementById(
        "startScreen"
    )
    .classList.add(
        "hidden"
    );

    document
    .getElementById(
        "gameScreen"
    )
    .classList.remove(
        "hidden"
    );

    document
    .getElementById(
        "totalQ"
    )
    .textContent =
    totalQuestions;

    updateEnergy();
   

questionPool = [];

DATABASE.forEach(q=>{

    if(mode === "mixed"){

        questionPool.push({data:q,type:"unit"});
        questionPool.push({data:q,type:"dimension"});
        questionPool.push({data:q,type:"formula"});
        questionPool.push({data:q,type:"meaning"});

    }
    else{

        questionPool.push({
            data:q,
            type:mode
        });

    }

});

questionPool =
shuffle(questionPool);

if(
totalQuestions >
questionPool.length
){
totalQuestions =
questionPool.length;
}

nextQuestion();

}
/* =====================================
   HELPERS
===================================== */

function shuffle(arr){

    return arr
    .sort(
        ()=>Math.random()-0.5
    );

}

function randomItem(arr){

    return arr[

        Math.floor(

            Math.random()
            *
            arr.length

        )

    ];

}

/* =====================================
   STARFIELD
===================================== */

function createStars(){

    const cv =

        document
        .getElementById(
            "stars"
        );

    const ctx =
        cv.getContext("2d");

    function resize(){

        cv.width =
            window.innerWidth;

        cv.height =
            window.innerHeight;

    }

    resize();

    window.addEventListener(
        "resize",
        resize
    );

    const stars = [];

    for(

        let i=0;

        i<250;

        i++

    ){

        stars.push({

            x:
            Math.random()
            *
            cv.width,

            y:
            Math.random()
            *
            cv.height,

            r:
            Math.random()*2+1,

            speed:
            Math.random()*2+0.5

        });

    }

    function animate(){

        ctx.clearRect(
            0,
            0,
            cv.width,
            cv.height
        );

        ctx.fillStyle =
            "white";

        stars.forEach(

            s=>{

                ctx.fillRect(

                    s.x,
                    s.y,
                    s.r,
                    s.r

                );

                s.x -=
                    s.speed;

                if(
                    s.x < 0
                ){

                    s.x =
                        cv.width;

                }

            }

        );

        requestAnimationFrame(
            animate
        );

    }

    animate();

}
/* =====================================
   GAME.JS
   Space Mission v6
   PART 2
===================================== */

/* =====================================
   NEXT QUESTION
===================================== */

function nextQuestion(){

    if(
        currentQuestion >=
        totalQuestions
    ){

        finishMission();

        return;
    }

    currentQuestion++;

    document
    .getElementById(
        "currentQ"
    )
    .textContent =
    currentQuestion;

const question =
questionPool.pop();

currentData =
question.data;

generateQuestion(
question.type
);

    updateProgress();

}

/* =====================================
   QUESTION GENERATOR
===================================== */

function generateQuestion(
questionType
){

const q = currentData;

let questionText = "";
let correctAnswer = "";
let options = [];

if(questionType === "unit"){

    questionText =

    `${q.thai}
    (${q.name})

    <br><br>

    หน่วย SI คืออะไร ?`;

    correctAnswer =
    q.unit;

    options =
    buildChoices(
        q.unit,
        ALL_UNITS
    );

}

else if(questionType === "dimension"){

    questionText =

    `${q.thai}
    (${q.name})

    <br><br>

    มิติ คืออะไร ?`;

    correctAnswer =
    q.dimension;

    options =
    buildChoices(
        q.dimension,
        ALL_DIMENSIONS
    );

}

else if(questionType === "formula"){

    questionText =

    `${q.thai}
    (${q.name})

    <br><br>

    สูตรใดถูกต้อง ?`;

    correctAnswer =
    q.formula;

    options =
    buildChoices(
        q.formula,
        ALL_FORMULAS
    );

}

else if(questionType === "meaning"){

    questionText =

    `${q.thai}
    (${q.name})

    <br><br>

    มีความหมายว่าอะไร ?`;

    correctAnswer =
    q.meaning;

    options =
    buildChoices(
        q.meaning,
        ALL_MEANINGS
    );

}

questionStartTime =
Date.now();

document
.getElementById(
    "questionText"
)
.innerHTML =
questionText;

createButtons(
    options,
    correctAnswer,
    q
);

}


/* =====================================
   BUILD CHOICES
===================================== */

function buildChoices(

    answer,

    source

){

    let choices = [

        answer

    ];

    let pool =

        source.filter(

            x =>

            x !== answer

        );

    pool =

        shuffle(
            pool
        );

    choices.push(
        pool[0]
    );

    choices.push(
        pool[1]
    );

    choices.push(
        pool[2]
    );

    return shuffle(
        choices
    );

}

/* =====================================
   BUTTONS
===================================== */

function createButtons(

    options,

    correct,

    q

){

    const box =

        document
        .getElementById(
            "choices"
        );

    box.innerHTML = "";

    options.forEach(

        item => {

            const btn =

                document
                .createElement(
                    "button"
                );

            btn.className =
                "choiceBtn";

            btn.textContent =
                item;

            btn.onclick =
                ()=>{

                    answerQuestion(

                        item,

                        correct,

                        q

                    );

                };

            box.appendChild(
                btn
            );

        }

    );

}

/* =====================================
   ANSWER
===================================== */

function answerQuestion(

    choice,

    correct,

    q

){

    totalAnswered++;
    
    const responseTime =

(
    Date.now()
    -
    questionStartTime
)
/1000;


    if(
        choice ===
        correct
    ){

        correctAnswers++;
        
        questionLog.push({

    topic:
    q.name,

    correct:
    true,

    responseTime:
    responseTime

});

        combo++;

        score +=

            100

            +

            combo * 10;

        playCorrect();

        if(
            combo >= 3
        ){

            playCombo();

        }

        showMentor(

            "🤖",

            "Astro Bot",

            "ยอดเยี่ยม!",

            q.meaning

        );

        moveShip();

    }
    else{

        combo = 0;

        hp--;
        
        wrongTopics.push(
    q.name
);

questionLog.push({

    topic:
    q.name,

    correct:
    false,

    responseTime:
    responseTime

});

        playWrong();

        showMentor(

            "👩‍🚀",

            "ผู้บัญชาการโนวา",

            "ยังไม่ถูก",

            `คำตอบที่ถูกคือ

            ${correct}`

        );

        updateEnergy();

        if(
            hp <= 0
        ){

            missionFailed();

            return;
        }

    }

    updateHUD();

    setTimeout(

        ()=>{

            nextQuestion();

        },

        1200

    );

}

/* =====================================
   MENTOR
===================================== */

function showMentor(

    avatar,

    name,

    message,

    fact

){

    document
    .getElementById(
        "avatar"
    )
    .innerHTML =
    avatar;

    document
    .getElementById(
        "mentor"
    )
    .textContent =
    name;

    document
    .getElementById(
        "feedback"
    )
    .textContent =
    message;

    document
    .getElementById(
        "fact"
    )
    .innerHTML =

        "💡 " +

        fact;

}

/* =====================================
   HUD
===================================== */

function updateHUD(){

    document
    .getElementById(
        "score"
    )
    .textContent =
    score;

    document
    .getElementById(
        "combo"
    )
    .textContent =
    combo;

}

/* =====================================
   ENERGY
===================================== */

function updateEnergy(){

    let txt = "";

    for(
        let i=0;
        i<hp;
        i++
    ){

        txt += "🔋";

    }

    document
    .getElementById(
        "energyBar"
    )
    .innerHTML = txt;

}

/* =====================================
   SHIP
===================================== */

function moveShip(){

    const ship =

        document
        .getElementById(
            "ship"
        );

    const path =

        document
        .getElementById(
            "path"
        );

    const progress =

        document
        .getElementById(
            "progress"
        );

    const fraction =

        currentQuestion
        /
        totalQuestions;

    const maxDistance =

        path.offsetWidth-120;

    ship.style.left =

        (
            100 +

            maxDistance *

            fraction

        )

        + "px";

    progress.style.width =

        (
            fraction
            *
            100
        )

        + "%";

}

/* =====================================
   PROGRESS
===================================== */

function updateProgress(){

    moveShip();

}

/* =====================================
   FAILURE
===================================== */

function missionFailed(){

	saveResult();
    playMissionFailed();

    document
    .getElementById(
        "gameScreen"
    )
    .classList.add(
        "hidden"
    );

    document
    .getElementById(
        "finishScreen"
    )
    .classList.remove(
        "hidden"
    );

    document
    .querySelector(
        ".certificate h2"
    )
    .textContent =

        "ภารกิจล้มเหลว";

    document
    .getElementById(
        "finalScore"
    )
    .textContent =
    score;

    document
    .getElementById(
        "accuracy"
    )
    .textContent =

        (
            correctAnswers
            /
            totalAnswered
            *
            100
        )
        .toFixed(1)

        + "%";

}

/* =====================================
   SUCCESS
===================================== */

function finishMission(){

    saveResult();

    playMissionComplete();

    document
    .getElementById(
        "gameScreen"
    )
    .classList.add(
        "hidden"
    );

    document
    .getElementById(
        "finishScreen"
    )
    .classList.remove(
        "hidden"
    );

    document
    .getElementById(
        "finalScore"
    )
    .textContent =
    score;

    document
    .getElementById(
        "accuracy"
    )
    .textContent =

        (
            correctAnswers
            /
            totalAnswered
            *
            100
        )
        .toFixed(1)

        + "%";

}

function saveResult(){

    // ป้องกันส่งซ้ำ

    if(resultSaved){

        return;

    }

    resultSaved = true;

   fetch(
    GOOGLE_SCRIPT_URL,
    {
        method:"POST",

        mode:"no-cors",

        headers:{
            "Content-Type":"text/plain"
        },

        body:JSON.stringify({

            studentId:
            studentId,

            email:
            studentEmail,

            score:
            score,

            accuracy:
            (
                correctAnswers
                /
                totalAnswered
                *
                100
            ).toFixed(1),

            correct:
            correctAnswers,

            total:
            totalAnswered,

            mode:
            mode,
            
            wrongTopics:
wrongTopics.join(","),

questionLog:
JSON.stringify(
    questionLog
),

            date:
            new Date()
            .toISOString()

        })

    }
)
.then(()=>{

    console.log(
        "sent"
    );

})
.catch(err=>{

    console.error(err);

});
}
