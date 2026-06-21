/* =====================================
   AUDIO.JS
   Space Mission v6
===================================== */

let audioContext = null;

/* =====================================
   INIT
===================================== */

function initAudio(){

    if(!audioContext){

        audioContext =

            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();
    }

}

/* =====================================
   BEEP
===================================== */

function beep(

    frequency,
    duration,
    type = "sine",
    volume = 0.08

){

    initAudio();

    const osc =

        audioContext
        .createOscillator();

    const gain =

        audioContext
        .createGain();

    osc.type =
        type;

    osc.frequency.value =
        frequency;

    gain.gain.value =
        volume;

    osc.connect(gain);

    gain.connect(
        audioContext.destination
    );

    osc.start();

    gain.gain.exponentialRampToValueAtTime(

        0.0001,

        audioContext.currentTime +
        duration

    );

    osc.stop(

        audioContext.currentTime +
        duration

    );
}

/* =====================================
   CLICK
===================================== */

function playClick(){

    beep(
        700,
        0.05,
        "square",
        0.04
    );
}

/* =====================================
   CORRECT
===================================== */

function playCorrect(){

    beep(
        900,
        0.08,
        "triangle"
    );

    setTimeout(

        ()=>{

            beep(
                1300,
                0.10,
                "triangle"
            );

        },

        80

    );
}

/* =====================================
   WRONG
===================================== */

function playWrong(){

    beep(
        250,
        0.20,
        "sawtooth"
    );

    setTimeout(

        ()=>{

            beep(
                180,
                0.25,
                "sawtooth"
            );

        },

        120

    );
}

/* =====================================
   COMBO
===================================== */

function playCombo(){

    beep(
        1000,
        0.08,
        "triangle"
    );

    setTimeout(

        ()=>{

            beep(
                1400,
                0.10,
                "triangle"
            );

        },

        90

    );
}

/* =====================================
   SUCCESS
===================================== */

function playMissionComplete(){

    const notes = [

        523,
        659,
        784,
        1046

    ];

    notes.forEach(

        (f,i)=>{

            setTimeout(

                ()=>{

                    beep(
                        f,
                        0.18,
                        "triangle"
                    );

                },

                i*180

            );

        }

    );
}

/* =====================================
   FAILURE
===================================== */

function playMissionFailed(){

    const notes = [

        440,
        392,
        349,
        262

    ];

    notes.forEach(

        (f,i)=>{

            setTimeout(

                ()=>{

                    beep(
                        f,
                        0.22,
                        "sawtooth"
                    );

                },

                i*220

            );

        }

    );
}

/* =====================================
   STARTUP
===================================== */

document.addEventListener(

    "click",

    ()=>{

        initAudio();

    },

    {

        once:true

    }

);
