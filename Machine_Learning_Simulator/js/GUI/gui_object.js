class GuiObject extends Tile
{
    id;
    #sprite;

    constructor(width, height, x, y, img = null, id = null)
    {
        super(width, height, x, y, img);
        this.id = id;
        this._initSprite();
    }

    get sprite()
    {
        return this.#sprite;
    }

    set sprite(sprite)
    {
        //Needed for WritableObject class which resets sprite as Text class
        this.#sprite = sprite;
    }

    getGlobalPosition(mouse)
    {
        let positionOnScreen = this.#sprite.getGlobalPosition(),
            position = new Vector2D(positionOnScreen.x, positionOnScreen.y),
            mouseOffset = new Vector2D(mouse.offsetX, mouse.offsetY);

        position.subtract(mouseOffset);
        return position;
    }

    _initSprite()
    {
        this.#sprite = new Sprite(resources[this.img].texture);
        this._setSpriteConstants();
        this._updateSpriteVariables();
    }

    _setSpriteConstants()
    {
        this.#sprite.width = this.width;
        this.#sprite.height = this.height;
    }

    _updateSpriteVariables()
    {
        this.#sprite.x = this.position.x;
        this.#sprite.y = this.position.y;
    }

    positionRelativeToObject(yDescription, xDescription, object, xOffset = 0, yOffset = 0)
    {
        if(xDescription === "left")
        {
            this.#sprite.anchor.x = 0;
            this.position.setX(0);
        }

        if(xDescription === "centre")
        {
            this.#sprite.anchor.x = 0.5;
            this.position.setX(object.width/2);
        }

        if(xDescription === "right")
        {
            this.#sprite.anchor.x = 1;
            this.position.setX(object.width);
        }

        if(yDescription === "top")
        {
            this.#sprite.anchor.y = 0;
            this.position.setY(0);
        }

        if(yDescription === "centre")
        {
            this.#sprite.anchor.y = 0.5;
            this.position.setY(object.height/2);
        }

        if(yDescription === "bottom")
        {
            this.#sprite.anchor.y = 1;
            this.position.setY(object.height);
        }

        this.position.add(new Vector2D(xOffset, yOffset));

        this._updateSpriteVariables();
    }

    isClicked(mouse)
    {
        if(mouse.isClicked)
        {
            let position = this.getGlobalPosition(mouse);

            let anchor = this.sprite.anchor,
                x = position.x - anchor.x * this.width,
                y = position.y - anchor.y * this.height;

            if( mouse.x > x && mouse.x < x + this.width &&
                mouse.y > y && mouse.y < y + this.height)
            {
                return true;
            }
        }

        return false;
    }

}