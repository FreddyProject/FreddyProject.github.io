class WritableObject extends GuiObject
{
    constructor(x, y, text, style, id)
    {
        super(0, 0, x, y, null, id);
        this.sprite = new Text(text, style);
        this._updateSpriteVariables();
    }

    setText(text)
    {
        this.sprite.text = text;
    }
}