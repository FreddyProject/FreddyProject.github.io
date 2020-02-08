//Player which acts as a replay cube
class PlayerPassive extends Player
{
    constructor(width, world, history)
    {
        super(width, world);
        this.jumpHistory = new Queue(history.length);

        //Initialises the jump history
        history.forEach(jump => {
            this.jumpHistory.enQueue(jump);
        });

        this._init();
    }

    _init()
    {
        this._reset();
        this._goToStart();
        //this.state = "moving" as player may start by falling through thin air
        this.state = "moving";
    }

    performJump()
    {
        //Jump if this replay has not ended
        if(this.jumpHistory.isEmpty) 
        {
            this.state = "finish";
        } else
        {
            let nextJump = this.jumpHistory.deQueue();
            this._jump(nextJump.x, nextJump.y, false);
        }
    }

    //Tick called every frame
    tick()
    {
        this.update();
    }
}