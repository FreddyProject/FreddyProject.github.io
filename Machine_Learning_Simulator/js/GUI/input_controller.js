class MouseHandler
{
    stage;
    container;
    isClicked = false;
    isMoving = false;
    timeHeldDown = 0;

    interaction = app.renderer.plugins.interaction;

    constructor(stage, container)
    {
        this.container = container;
        this.stage = stage;
        this._setEventHandlers();
    }

    get localPosition()
    {
        return this.interaction.mouse.global;
    }

    get offsetX()
    {
        return this.container.x - this.container.width/2;
    }

    get offsetY()
    {
        return this.container.y - this.container.height/2;
    }

    get x()
    {
        return this.localPosition.x - this.offsetX;
    }

    get y()
    {
        return this.localPosition.y - this.offsetY;
    }

    get position()
    {
        return new Vector2D(this.x, this.y);
    }

    tick()
    {
        if(this.isClicked) this.timeHeldDown++;
    }

    _setEventHandlers()
    {
        this.stage.pointerdown = (e) => {
            this.isClicked = true;
        }
        
        this.stage.pointerup = (e) => {
            this.isClicked = false;
            this.timeHeldDown = 0;
        }

        this.stage.mousemove = (e) => {
            this.isMoving = true;
        }
    }
}