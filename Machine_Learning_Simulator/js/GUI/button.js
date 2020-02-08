//Button clicked events are managed in the parent class
class Button extends GuiObject
{
    constructor(width, height, x, y, id)
    {
        super(width, height, x, y, null, id);
        this.img = this._getImage(this.id);
        this._initSprite();
    }

    _getImage(id)
    {
        if(id === "start-simulation") return "button-start";
        if(id === "link-tutorial") return "button-question";

        return "button-" + id;
    }
}