//Player which the user controls
class PlayerUser extends Player
{
    constructor(width, world)
    {
        super(width, world);
        this._init();
        this.id = "user";
    }

    //Returns in radians, the angle between mouse and player
    _getMouseDirection(mouse)
    {

        let deltaPosition = mouse.position.copy()
        deltaPosition.subtract(this.positionCentre);

        //For the purpose of the game, but technically no longer 'mouse direction'
        //Wiggle unit is a negligible unit. We still set y to something so angle doesn't return 0.
        //Otherwise we can't work out whether cube goes left or right.
        if(deltaPosition.y > 0) deltaPosition.setY(-this.wiggleUnit);

        if(deltaPosition.x === 0)
        {
            return Math.PI/2;
        } else
        {
            return Math.atan(-deltaPosition.y / deltaPosition.x);
        }
    }

    _init()
    {
        this._reset();
        this._goToStart();
        //this.state = "moving" as player may start by falling through thin air
        this.state = "moving";
    }

    //Calls this.update() and checks the state machine
    tick(mouse)
    {
        this.update();

        if(this.state == "resting")
        {
            //When mouse is clicked, start preparing the jump
            if(mouse.isClicked)
            {
                this.state = "compressing";
            }
        }

        if(this.state == "compressing")
        {
            //When mouse is released, jump
            if(!mouse.isClicked)
            {
                this.jump(this.jumpMagnitude, this._getMouseDirection(mouse));
            }
        }
    }
}