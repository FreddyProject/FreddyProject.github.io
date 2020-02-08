//Base class for Game, Simulation, Replay which requires a level and player
class World extends SceneManager
{
    #borderElasticity = 0.45;
    level = 1; //Allows some flexibility if I decide to create multiple levels

    constructor(width, height)
    {
        super(width, height);
        this.tilemap = new Tilemap(this);
    }

    get unit()
    {
        return this.width / LEVELS[this.level - 1][0].length;
    }

    //Gravity acts on the players
    get gravity()
    {
        return 0.0005*this.unit;
    }

    get borderElasticity()
    {
        return this.#borderElasticity;
    }

    _addWorldObjectsToArray()
    {
        this.objectsOnScreen.push(this.backdrop);

        this.tilemap.blocks.forEach(block => {
            this.objectsOnScreen.push(block);
        });
    }

    //Handles the event of downloading jump history
    _performDownload(player)
    {
        let confirm = prompt("Confirm download jump history", "YES / NO");
        if(confirm != null) confirm = confirm.toUpperCase();

        if(confirm !== "YES") return; //If user enters 'no' or anything else, cancel download

        let filename = player.id + "_jump_history" + ".txt",
            history = player.jumpHistory.data;

        //Get text
        let text = "";
        history.forEach((jump, i) => {
            text += jump.x + ", " + jump.y;
            if(i !== history.length - 1) text += "\n"; //Converts array to string; \n creates a new line
        });

        this.download(filename, text);
    }

    //Base method for handling what happens when a button is clicked
    //Polymorphic depending on different scenes with different buttons
    buttonClicked(buttonId, model)
    {
        switch(buttonId)
        {
            case "menu-2":
            case "menu-3":
            case "menu-4":
                model.changeScene("menu");
                break;

            case "download":
                this._performDownload(this.player);
                break;
        }
    }
}