//Represents the Game scene
class Game extends World
{
    player;
    //Pause functionality, although this currently isn't supported
    paused = false;

    constructor(width, height)
    {
        super(width, height);
        this.player = new PlayerUser(this.unit, this);

        //Default state: playing
        this.state = "playing";
        this._addObjectsToArray();
    }

    //For the GUI
    get summaryText()
    {
        return "Level complete!\nJumps: " + this.player.noOfJumps;
    }

    _addObjectsToArray()
    {
        this._addWorldObjectsToArray();
        this.objectsOnScreen.push(this.player);
    }

    //Tick function is called each frame
    tick(mouse)
    {
        if(this.player.state !== "finish")
        {
            //Pause functionality if it's ever used
            if(!this.paused) this.player.tick(mouse);
        } else
        {
            this.state = "summary";
        }
    }
}