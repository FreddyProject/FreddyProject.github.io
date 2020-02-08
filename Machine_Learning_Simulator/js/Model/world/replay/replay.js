//Represents the Replay scene
class Replay extends World
{
    #summaryButtons = ["menu-3"];

    players = [];
    //Pause functionality, although this currently isn't supported
    paused = false;

    constructor(width, height)
    {
        super(width, height);
        this._createPlayers();
        this._addObjectsToArray();
        this.state = "replay";
    }

    get summaryButtons() { return this.#summaryButtons; }

    //Fetches the file data from Data section and create the replay players
    _createPlayers()
    {
        FILE_DATA.forEach(data => {
            let history = [];

            data.forEach(jump => {
                history.push(new Vector2D(jump[0], jump[1]));
            });

            //Each file corresponds to a replay
            //Create a replay player for each file
            this.players.push(new PlayerPassive(this.unit, this, history));
        });
    }

    _addObjectsToArray()
    {
        this._addWorldObjectsToArray();


        this.players.forEach(player => {
            this.objectsOnScreen.push(player);
        });
    }

    //Modified from population.js
    //See comments from population.js
    isStationary()
    {
        let stationary = true;

        this.players.forEach(player => {
            if(!player.isStationary())
            {
                stationary = false;
                return;
            }
        });

        return stationary;
    }

    //Modified from population.js
    //See comments from population.js
    isFinished()
    {
        let finished = true;

        this.players.forEach(player => {
            if(player.state !== "finish")
            {
                finished = false;
                return;
            }
        });

        return finished;
    }

    //Modified from population.js
    //See comments from population.js
    replayJump()
    {
        this.players.forEach(player => {
            if(player.state !== "finish") player.performJump();
        });
    }

    //Tick called each frame
    tick()
    {
        if(this.state === "replay")
        {
            //Update the scene if not paused
            if(!this.paused)
            {
                this.players.forEach(player => {
                    if(!(player.state === "finish"))
                    {
                        player.tick();
                    }
                });

                if(this.isStationary()) this.replayJump(); //Next jump if AIs are all stationary
                if(this.isFinished()) this.state = "summary";
            }
        }
    }
}