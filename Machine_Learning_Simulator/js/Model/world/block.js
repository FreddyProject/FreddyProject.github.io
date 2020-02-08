//This represents a block which makes up part of the level
class Block extends Tile
{
    id;
    isSolid = true;
    elasticity = 0.45; //How much player rebounds with block

    constructor(width, x, y, id)
    {
        super(width, width, x, y);
        this.id = id;
        this.img = this._getImage(this.id);
    }

    _getImage(id)
    {
        if(id === "normal") return "block-ground";
        if(id === "start") return "block-start";
        if(id === "end") return "block-end";
    }

    //Use polymorphism for this method
    getInteraction(player)
    {

    }
}

class BlockStart extends Block
{
    isSolid = false;

    constructor(width, x, y, id = "start")
    {
        super(width, x, y, id);
    }
}

class BlockEnd extends Block
{
    isSolid = false;

    constructor(width, x, y, id = "end")
    {
        super(width, x, y, id);
    }
}