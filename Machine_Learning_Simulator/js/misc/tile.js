////User-defined library class: Tile
//Represents a rectangular shape.
//Very useful framework as its attrubtes are similar to PIXI.Sprite
class Tile
{
    #width;
    #height;
    position; //Coordinates of bottom left corner
    img;
    alpha = 1; //Transparency of image: 0 is completely transparent and 1 is not transparent at all

    constructor(width, height, x, y, img = "null")
    {
        this.#width = width;
        this.#height = height;
        this.position = new Vector2D(x, y);

        this.img = img;
    }

    //Getters and setters
    get width() { return this.#width; }
    get height() { return this.#height; }
    set width(width) { this.#width = width; }
    set height(height) { this.#height = height; }

    //Returns coordinates of centre of tile
    get positionCentre()
    {
        return new Vector2D(
            this.position.x + this.#width/2,
            this.position.y + this.#height/2
            );
    }

    //Distance between this tile and specified 'tile'
    getDistFromTile(tile)
    {
        let pos = this.position.copy();
        pos.subtract(tile.position);

        return pos.magnitude;
    }

    //Only works for squares with same dimensions
    //In the project, the only tiles that require collision detection are squares
    //If rectangles need to use the collision function, this method will be updated
    isCollideWithTile(tile)
    {
        let position = this.position.copy();
        position.subtract(tile.position);
        let deltaPosition = position;

        return (Math.abs(deltaPosition.x) < this.#width
            &&  Math.abs(deltaPosition.y) < this.#height);
    }
}