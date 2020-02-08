class Panel extends GuiObject
{
    #padding;

    #container;

    constructor(padding, id, img = null)
    {
        super();
        this.#container = new Container();
        this.#padding = padding;
        this.id = id;
        this.img = img;
        this.position.set(new Vector2D(0, 0));
        this._initSprite();

        this.addChild(this.sprite);
    }

    get container()
    {
        return this.#container;
    }

    get isVisible()
    {
        return this.#container.visible;
    }

    _inheritParentSize()
    {
        this.width = this.#container.width;
        this.height = this.#container.height;
    }

    setVisibility(visibility)
    {
        this.#container.visible = visibility;
    }

    addChild(child)
    {
        this.#container.addChild(child);
    }

    update()
    {
        this._inheritParentSize();
        this.width += this.#padding;
        this.height += this.#padding;

        this._setSpriteConstants();
    }

}