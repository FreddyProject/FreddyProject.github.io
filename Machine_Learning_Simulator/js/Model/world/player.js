class Player extends Tile
{
    #resistance = 0.02;
    #velocity = new Vector2D(0, 0);
    #acceleration = new Vector2D(0, 0);
    #normalHeight; //Stores height of player so after player finishes compresses, it can pop back to normal height
    /*
        When player compresses, bottom left vertex remains stationary
        but top left vertex moves
        In my project, all position refers to the top left vertex
        So we store the position offset when the player compresses.
    */
    #positionOffset = new Vector2D(0, 0);
    #maxJumpMagnitude = 20;

    jumpMagnitude = 0;
    state;
    //Highly unlikely that a player will jump more than 100 times in 1 level
    jumpHistory = new Queue(100);
    id;
    //Reference to the scene, which includes the unit property for resizing the app
    World;

    constructor(width, world)
    {
        super(width, width, 0, 0, "player"); //Calls parent constructor
        this.#normalHeight = this.height;
        this.World = world;
    }

    get power()
    {
        return this.#maxJumpMagnitude;
    }

    get minSpeed()
    {
        return 0.01 * this.World.unit;
    }

    //The wiggle unit is a very important unit
    /*
        It prevents any glitches involving player getting stuck in walls
        For example:
        When a player falls and collides with the ground underneath,
        the player is moving more than 1 pixel in 1 frame
        so the player would've sunk into the ground a bit.

        The program will move the player up 1 wiggle unit at a time
        until the player rests at the surface of the ground,
        then switch the sign of the player's velocity so it bounces back up.
    */
    get wiggleUnit()
    {
        return 0.025 * this.World.unit;
    }

    //Minimum width of player. We don't want the width to reach 0, otherwise the player becomes invisible.
    get compressLimit()
    {
        return this.#normalHeight/2;
    }

    get noOfJumps()
    {
        return this.jumpHistory.size;
    }

    //Resets player to normal height after it has been compressed
    _reset()
    {
        this.height = this.#normalHeight;
        this.jumpMagnitude = 0;
        this.position.subtract(this.#positionOffset);
        this.#positionOffset.set(new Vector2D(0, 0));
    }

    //Loops through entire tilemap and checks if player is touching any block with a 'solid' property
    _isTouchingAnyBlock()
    {
        let isTouching = false;

        this.World.tilemap.blocks.forEach(block => {
            if(block.isSolid && this.isCollideWithTile(block))
            {
                isTouching = true;
                return; //This just returns out of the forEach loop and saves some processing time
            }
        });

        return isTouching;
    }

    //Checks if player is touching the left/right edge of the app.
    _isTouchingBorder()
    {
        return this.position.x < 0 || this.position.x > this.World.width - this.width;
    }

    //Returns true if player is not moving and not in free fall, or if player has reached finish flag
    isStationary()
    {
        return (
            (
                this._isTouchingAnyBlock() &&
                this.#velocity.isZero() &&
                this.#acceleration.isZero()
            ) || (this.state === "finish")

            );
    }

    //Moves player to start flag
    _goToStart()
    {
        let start = this.World.tilemap.blocks.find(block => {
            return block.id == "start"
        });

        this.position.set(start.position);
    }

    //See explanation of wiggle unit at its getter: get wiggleUnit()
    _doWiggleX()
    {
        //We need to check if player is hitting the left or right wall
        //For example, if x velocity > 0 then player is moving right, hence it must hit the left edge of the wall.
        if(this.#velocity.x > 0)
        {
            this.position.addX(-this.wiggleUnit);
        } else
        {
            this.position.addX(this.wiggleUnit);
        }
    }

    //Part of the update subroutine which is called every frame
    //Updates player properties relating to the y-axis
    _updateY()
    {
        this.#acceleration.addY(this.World.gravity);
        this.#velocity.addY(this.#acceleration.y);
        this.position.addY(this.#velocity.y);

        this._checkCollisionY();
    }

    /*
        See Pseudocode in Documented Design for further explanation on the following subroutines:

        _updateY()
        _checkCollisionY()
        _updateX()
        _checkCollisionX()
    */

    //Checks any vertical collisions
    _checkCollisionY()
    {
        this.World.tilemap.blocks.forEach(block => {
            if(block.isSolid)
            {
                while(this.isCollideWithTile(block))
                {
                    /*
                        In the level, the player can only collide with the lower surface of the ground
                        It is obvious that it is impossible to hit any ceiling
                        So we assume all collisions to be with the lower surface of the ground.
                    */
                    this.position.addY(-this.wiggleUnit); //See explanation of wiggle unit at its getter: get wiggleUnit()

                    if(!this.isCollideWithTile(block))
                    {
                        this.#acceleration.setY(0);
                        this.#velocity.setY(-this.#velocity.y * block.elasticity);
                        //We don't want tiny bounces taking lots of time for player to become stationary
                        //before user can jump again. So we set the velocity to 0 for small values.
                        if(Math.abs(this.#velocity.y) < this.minSpeed) this.#velocity.setY(0);
                    }
                }
            }
        });
    }

    //Part of the update subroutine which is called every frame
    //Updates player properties relating to the x-axis
    _updateX()
    {
        this.#velocity.addX(this.#acceleration.x);
        this.position.addX(this.#velocity.x);

        this._checkCollisionX();
        this.#velocity.setX(this.#velocity.x * (1 - this.#resistance));
        if(Math.abs(this.#velocity.x) < this.minSpeed) this.#velocity.setX(0);
    }

    //Checks any horizontal collisions
    _checkCollisionX()
    {
        this.World.tilemap.blocks.forEach(block => {

            if(block.isSolid)
            {
                while((this.isCollideWithTile(block)))
                {
                    this._doWiggleX(); //See explanation of wiggle unit at its getter: get wiggleUnit()

                    if(!(this.isCollideWithTile(block)))
                    {
                        //I don't think acceleration has an X component
                        //But I include this for completeness and maintainability
                        this.#acceleration.setX(0);
                        this.#velocity.setX(-this.#velocity.x * block.elasticity);
                    }
                }
            }
        });

        //Same as checking for block collision, but this checks the left/right edge of the app.
        //Prevents player from falling off the screen
        while(this._isTouchingBorder())
        {
            this._doWiggleX();

            if(!this._isTouchingBorder())
            {
                this.#acceleration.setX(0);
                this.#velocity.setX(-this.#velocity.x * this.World.borderElasticity);
            }
        }
    }

    //Checks if player has reached end flag
    _hasReachedFinish()
    {
        let end = this.World.tilemap.blocks.find(block => {
            return block.id === "end";
        });

        return this.isCollideWithTile(end);
    }

    //Private method: player jumps
    _jump(xPower, yPower, record = true)
    {
        this.#velocity = new Vector2D(xPower * this.World.unit/100, yPower * this.World.unit/100);
        if(record) this.jumpHistory.enQueue(new Vector2D(xPower, yPower)); //Add the jump to the queue
        this._reset();
        this.state = "moving";
    }

    //Public method: player jumps
    //With polar coordinates parameters, as it is a lot more accessible for the AIs,
    //since the AI genes have a magnitude and direction property
    jump(magnitude, angle)
    {
        //Converts magnitude and angle to x and y components
        let xMagnitude = magnitude * Math.cos(angle),
            yMagnitude = -magnitude * Math.sin(angle);

        let xVel = (angle >= 0) ? xMagnitude : -xMagnitude,
            yVel = (angle >= 0) ? yMagnitude : -yMagnitude,
            jumpVector = new Vector2D(xVel, yVel);
        
        jumpVector.round();

        //Forwards to the private jump method to execute the jump
        this._jump(jumpVector.x, jumpVector.y);
    }

    //This will be appended into the tick method which is called every frame
    update()
    {
        switch(this.state)
        {
            case "moving":
                /* See Pseudocode in Documented Design for further explanation */
                this._updateY();
                //Once updateY finishes, if the block is touching ground, it is 1 wiggle unit above the block.
                //Hence it is not touching the bottom of block.
                //Hence if it is touching block, it must be touching the sides of the block. This is checked in updateX.
                this._updateX();
                //Stops the jittering, as this pushes the block back to the solid block
                //Also increases gravity strength slightly (unintended)
                this.position.addY(this.wiggleUnit);

                //Update the player state machine
                if(this.isStationary()) this.state = "resting";
                if(this._hasReachedFinish()) this.state = "finish";
                break;

            case "compressing":
                if(this.jumpMagnitude < this.#maxJumpMagnitude)
                {
                    //Compresses the player
                    this.height -= this.wiggleUnit;
                    this.jumpMagnitude++;
                    this.position.addY(this.wiggleUnit);
                    this.#positionOffset.addY(this.wiggleUnit);
                }

            //There are more player states, e.g. "finish"
            //But the player doesn't do anything in these states, so the cases are not considered here.
            //Other objects will check the player states from time to time,
            //for example, the Game and Simulation class will check if the player has finished.
                break;
        }
    }
}