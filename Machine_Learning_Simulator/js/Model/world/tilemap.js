//This class manages all the blocks in the level
class Tilemap
{
    #data = LEVELS; //Gets a reference to the level matrix data from Data section
    blocks = [];

    Game; //Reference to the Game scene manager

    constructor(game)
    {
        this.Game = game;
        this._createBlocks();
    }

    //Creates the blocks for the level
    _createBlocks()
    {
        this.blocks = [];

        //Loops through the level data and creates the blocks
        this.#data[this.Game.level - 1].forEach((row, j) => {
            row.forEach((slot, i) => {
                let position = new Vector2D(i * this.Game.unit, j * this.Game.unit);

                if(slot === 1) this.blocks.push(new Block(this.Game.unit, position.x, position.y, "normal"));
                if(slot === 2) this.blocks.push(new BlockStart(this.Game.unit, position.x, position.y, "start"));
                if(slot === 3) this.blocks.push(new BlockEnd(this.Game.unit, position.x, position.y, "end"));
            });
        });
    }
}