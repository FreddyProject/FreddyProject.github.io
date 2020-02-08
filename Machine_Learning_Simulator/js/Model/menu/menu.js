//This maintains the main menu, the simulator menu, and the instructions panel
class Menu extends SceneManager
{
    #mainButtons = ["play", "instructions", "simulation"];
    #simulatorButtons = ["default-sim", "preset-sim", "replay", "menu"];

    #tutorialAddress = "https://www.youtube.com/watch?v=0qgpeFQIrR4";

    constructor(width, height)
    {
        super(width, height); //super() calls the parent constructor, i.e. SceneManager
        this._addObjectsToArray();

        this.state = "main-menu";
    }

    //We only define getters and not setters
    //Which makes these properties 'read only' outside of this class
    get mainButtons()
    {
        return this.#mainButtons;
    }

    get simulatorButtons()
    {
        return this.#simulatorButtons;
    }

    //Handles what happens when a button is clicked
    buttonClicked(buttonId, model)
    {
        switch(buttonId)
        {
            case "play":
                model.changeScene("game");
                break;
            case "instructions":
                this.state = "instructions";
                break;
            case "link-tutorial":
                window.open(this.#tutorialAddress); //Opens the tutorial in a new tab/window
                break;
            case "simulation":
                this.state = "simulator-menu";
                break;

            case "default-sim":
                model.changeScene("simulation");
                break;
            case "preset-sim":
                if(model.validateFiles(true)) model.changeScene("simulation-preset");
                break;
            case "replay":
                if(model.validateFiles(true)) model.changeScene("replay");
                break;
            case "menu":
            case "menu-2":
                this.state = "main-menu";
            default:
                //Object isn't a button
                break;
        }
    }
}