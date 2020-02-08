//Parent class for all scenes
//Which includes Game scene, Simulation scene, etc.
class SceneManager
{
    #width;
    #height;
    #buttonWidth = 14;

    state; //Each scene has a state machine

    //For the GUI
    objectsOnScreen = [];
    objectsOnScreenUpdated = false;

    constructor(width, height)
    {
        this.#width = width;
        this.#height = height;

        //Using null image, but I need this for the GUI to resize the container to 600x600
        this.backdrop = new Tile(this.#width, this.#height, 0, 0, "null");
    }

    get width()
    {
        return this.#width;
    }

    get height()
    {
        return this.#height;
    }

    get buttonWidth()
    {
        return this.#buttonWidth;
    }

    get buttonHeight()
    {
        return this.#buttonWidth / 3;
    }

    //Polymorphic method
    /*
        Depends on the scene.
        For example, the Game scene:

        You want to draw the player and the tiles in the level.
        So you also push the player and tiles to 'this.objectsOnScreen'

        The GUI has a reference to the model, and will loop through this array,
        create a sprite for each object in this array and display the sprite on the screen.
    */
    _addObjectsToArray()
    {
        this.objectsOnScreen.push(this.backdrop);
    }

    //Creates a file and downloads it to local repository
    download(filename, text)
    {
        let element = document.createElement('a'); //'a' element is a link element in HTML
        /*
            "The encodeURIComponent() function encodes a URI by replacing each instance of certain characters
            by one, two, three, or four escape sequences representing the UTF-8 encoding of the character"

            https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
        */
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        //If we add the element to the DOM it gets attached with a 'click' method
        //We call the 'click' event manually to force download the file.
        //Once this action is done, we don't need the element anymore and we can remove it from the DOM.
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    //Polymorphic method
    tick() { }

}