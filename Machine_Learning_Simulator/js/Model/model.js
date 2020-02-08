//This project is decoupled into GUI | MODEL | DATA
//This is the Model class
class ProjectModel
{
    #width;
    #height;
    #previousScene; //Stores scene of previous frame
    #scene; //Stores scene of current frame
    #sceneChanged; //Determined from comparing this.#previousScene to this.#scene
    #uploader; //Stores the HTML5 form element

    //References current scene object: MENU or GAME or REPLAY or SIMULATION
    activeScene;

    MENU;
    GAME;
    REPLAY;
    SIMULATION;

    constructor(width, height, uploader)
    {
        this.#width = width;
        this.#height = height;
        this.#uploader = uploader;
    }

    get scene()
    {
        return this.#scene;
    }

    get sceneChanged()
    {
        return this.#sceneChanged;
    }

    get scale()
    {
        //1 unit = 12 pixels for a 600x600 screen, for example
        return this.#width * 0.02;
    }

    get files()
    {
        return this.#uploader.files;
    }

    //This is used to set the scene from outside this object
    changeScene(scene)
    {
        this.#scene = scene;
    }

    //Ignores scene change
    ignoreSceneChange()
    {
        this.#previousScene = this.#scene;
    }

    //Saves RAM
    _resetScenes()
    {
        this.MENU = null;
        this.GAME = null;
        this.REPLAY = null;
        this.SIMULATION = null;
    }

    //Initialises scene-related attributes
    //Called when scene is changed
    _initScene()
    {
        this._resetScenes();
        switch(this.scene)
        {
            case "menu":
                this.MENU = new Menu(this.#width, this.#height);
                this.activeScene = this.MENU;
                break;
            case "game":
                this.GAME = new Game(this.#width, this.#height);
                this.activeScene = this.GAME;
                break;
            case "simulation":
                this.SIMULATION = new Simulation(this.#width, this.#height);
                this.activeScene = this.SIMULATION;
                break;
            case "simulation-preset":
                this.SIMULATION = new Simulation(this.#width, this.#height, true);
                this.activeScene = this.SIMULATION;

                //Forwards project back to 'simulation'.
                //We (Model on next tick, and the GUI) can ignore this scene change.
                this.changeScene("simulation");
                this.ignoreSceneChange();
                break;
            case "replay":
                this.REPLAY = new Replay(this.#width, this.#height);
                this.activeScene = this.REPLAY;
                break;
        }
    }

    //Returns the file type
    _getExtension(filename)
    {
        let parts = filename.split(".");
        return parts[parts.length - 1];
    }

    //Jump history is stored as a '.txt' file.
    //Any other files, including text files of other type (e.g. '.rtf') are ignored
    _isTextFile(filename)
    {
        return this._getExtension(filename) === "txt";
    }

    //When user uploads a file, we want to validate the file
    /*
        validateFiles(strict = false)
        This is called when user uploads a file. Warning messages are given if required

        validateFiles(strict = true)
        This is called when user starts the replay / simulation with presets. Error messages are given if required
    */
    validateFiles(strict)
    {
        let filesAreValid = true;

        /*
            Bug from Test 47:
            When ‘Clear files’ button is pressed, data in FILE_DATA is removed
            but files remain in the HTML Uploader element.

            This is fixed by also validating that FILE_DATA is not an empty array
            when trying to replay or start simulation with presets. The retest worked as expected.
        */
        if((this.files.length === 0) || (FILE_DATA.length === 0))
        {
            if(strict) alert("Error: no file selected");
            filesAreValid = false; //Invalid if no files are selected
        }

        for(let i = 0; i < this.files.length; i++)
        {
            let file = this.files[i];

            if(!this._isTextFile(file.name))
            {
                let message = "at least 1 file is not a text file";

                if(strict)
                {
                    alert("Error: " + message);
                } else
                {
                    alert("Warning: " + message);
                }

                filesAreValid = false; //Invalid if file type is not .txt file
                break; //Break from for loop if at least 1 file is not valid. Saves some processing time.
            }
        }

        return filesAreValid;
    }

    //When user uploads a file, the contents are stored in the DOM (Document Object Model)
    //We read and parse data from all uploaded files, and store them in FILE_DATA in the Data section
    readFiles()
    {
        for(let i = 0; i < this.files.length; i++)
        {
            /*
                We create a new FileReader for each file
                This is because fileReader.readAsText takes a bit of time to process each file
                Hence it is an asynchronous routine.

                If we only created 1 FileReader to read all files, the program may instruct
                FileReader to read the next file before it has finished reading the current file
                which returns an error.
            */
            let fileReader = new FileReader(),
                file = this.files[i];

            fileReader.readAsText(file); //Asynchronous

            //Since readAsText() is asynchronous, we wait until the file has been read,
            //and we capture this event with the eventHandler 'fileReader.onload'
            fileReader.onload = () => {
                //Some basic parsing which maps each line to a new element in an array
                let content = fileReader.result.split("\n").map(line => {
                    return line.split(",");
                });

                content.forEach((jump) => {
                    jump.forEach((value, i) => {
                        //All elements in the array are currently strings.
                        //We convert the strings to float values.
                        jump[i] = parseFloat(value);
                    });
                });

                //Finally, we store the contents of the file in the Data section.
                FILE_DATA.push(content);
            }
        }
    }

    //Removes all previous file data in the Data section.
    //Does not refresh the data in the HTML Uploader element (Bug Test #47)
    clearFiles()
    {
        FILE_DATA = [];
    }

    //Initialises the model
    //When user starts the application, they are presented with the menu.
    init()
    {
        this.changeScene("menu");
    }

    //tick function: called 60 times every second
    tick(mouse)
    {
        this.#sceneChanged = false; //Default

        //If current scene is not the same as the scene in the last frame,
        //the scene has been changed. We must update the model (and also the GUI)
        if(this.scene !== this.#previousScene)
        {
            this._initScene(this.scene);
            this.#sceneChanged = true;
            mouse.isClicked = false;
        }
        this.#previousScene = this.scene;
        
        //tick the active scene, e.g. game, simulation, menu, replay
        this.activeScene.tick(mouse);
    }
}