/*
    STAIRS | MACHINE LEARNING SIMULATOR
    by Freddy Jiang

    This is the main script that holds everything together
    It creates a PIXI application
    It creates the Model
    It creates the GUI
    It includes the main tick function that ticks the Model and the GUI
    etc.
*/

/*
    Credits:

    Official PIXI.js documentation
    http://pixijs.download/release/docs/index.html

    KittyKatAttack tutorial on PIXI.js
    https://github.com/kittykatattack/learningPixi



    Thanks to above sources to help me get started with using the Pixi.js framework
*/

/* -------------------------SETTING UP PIXI.JS---------------------------------------- */
//Use WebGL on default as it is better than the default HTML5 canvas
let type = "WebGL";
if(!PIXI.utils.isWebGLSupported())
{
    //Use canvas if WebGL is not supported on the user's browser
    //Most (relatively) modern browsers will support WebGL
    type = "canvas";
}

//Debug test: makes sure that PIXI has loaded
PIXI.utils.sayHello(type);
/* -------------------------END OF SETTING UP PIXI.JS---------------------------------------- */

/* -------------------------CREATE APPLICATION---------------------------------------- */
//Create web application
const app = new Application(
{
    antialias: true,
    transparent: false,
    resolution: 1,
    //resizeTo: window
});

//Some styling
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
app.renderer.backgroundColor = 0x161616;
app.stage.interactive = true; //User can interact with app (e.g. app can process when user clicks on the app)

//Add application to view
document.body.appendChild(app.view);
/* -------------------------END OF CREATING APPLICATION---------------------------------------- */

/* -------------------------LOADING IMAGES---------------------------------------- */
loader
    .add("null", "img/null.png")

    //Background
    .add("background-1", "img/background/background-1.svg")
    .add("background-2", "img/background/background-2.svg")
    .add("background-3", "img/background/background-3.svg")

    //Blocks
    .add("block-ground", "img/world/blocks/ground.svg")
    .add("block-start", "img/world/blocks/start.svg")
    .add("block-end", "img/world/blocks/end.svg")

    //Player
    .add("player", "img/world/cube-1.svg")
    .add("clone-leader", "img/world/cube-2.svg")

    //Button
    .add("button-menu", "img/button/button-menu-black.svg")
    .add("button-play", "img/button/button-play.svg")
    .add("button-instructions", "img/button/button-instructions.svg")
    .add("button-simulation", "img/button/button-simulation.svg")

    .add("button-default-sim", "img/button/button-default-sim.svg")
    .add("button-preset-sim", "img/button/button-preset-sim.svg")
    .add("button-replay", "img/button/button-replay.svg")
    .add("button-start", "img/button/button-start.svg")

    .add("button-next-generation", "img/button/button-next-generation.svg")
    .add("button-slideshow", "img/button/button-slideshow.svg")
    .add("button-fast-forward", "img/button/button-fast-forward.svg")

    .add("button-sim-download", "img/button/button-sim-download.svg")
    .add("button-menu-3", "img/button/button-menu-white.svg")

    .add("button-menu-2", "img/button/home-solid.svg")
    .add("button-menu-4", "img/button/home-solid-dark.svg")
    .add("button-download", "img/button/download-solid.svg")
    .add("button-question", "img/button/question-solid.svg")

    //Instructions
    .add("instructions", "img/instructions/instructions.svg")

    //Slideshow
    .add("slide-purge", "img/sim-slideshow/slide-1.svg")
    .add("slide-crossover", "img/sim-slideshow/slide-2.svg")
    .add("slide-mutation", "img/sim-slideshow/slide-3.svg")
    .add("slide-updates", "img/sim-slideshow/slide-4.svg")
    .add("slide-general", "img/sim-slideshow/slide-5.svg")

    .load(setup);
/* -------------------------END OF LOADING IMAGES---------------------------------------- */


/* PixiJS set up. We're ready to go! */

//Technically, GUI and MODEL should be constants
//However, I want to initialise them in the setup() function (so all other files get loaded before initialising)
//At the same time, they must be Global so I can access them in the gameloop()
//As a compromise, I use the 'let' keyword instead of the 'const' keyword.
let GUI, MODEL;

const UPLOAD_BUTTON = document.querySelector("input[type='file']"); //Upload button
const CLEAR_BUTTON = document.getElementById("clear"); //Clear button

//PIXI.js function: called when window.onload event is captured
function setup()
{
    MODEL = new ProjectModel(SCREEN_WIDTH, SCREEN_HEIGHT, UPLOAD_BUTTON);
    MODEL.init();

    GUI = new ProjectGUI(app);

    setEventHandlers();

    app.ticker.add(delta => gameLoop(delta));
}

function setEventHandlers()
{
    //When input is changed (i.e. user has uploaded a file)
    UPLOAD_BUTTON.addEventListener("change", e => {
        MODEL.validateFiles(false);
        MODEL.readFiles();
    });

    //When clear button is clicked
    CLEAR_BUTTON.addEventListener("click", e => {
        MODEL.clearFiles();
    });
}

//Main project function: this is a PIXI.js subroutine that is called 60 times a second
//delta time is a built in parameter that ensures app runs smoothly during frame drops
function gameLoop(delta)
{
    MODEL.tick(GUI.mouse); //Update model
    GUI.tick(MODEL); //Update GUI according to the model
}