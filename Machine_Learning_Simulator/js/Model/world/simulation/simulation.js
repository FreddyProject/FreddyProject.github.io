//Represents the Simulation scene
class Simulation extends World
{
    /*----------CONSTANTS-----------*/
    #minPopulation = 4;
    #maxPopulation = 100;
    #minGenerations = 2;
    #maxGenerations = 100;

    #purgePercentage = 0.8;
    #mutateChance = 0.05;
    /*----------END OF CONSTANTS-----------*/

    #maxJumps = 10; //Possibly make this configurable?
    #jumpPointer = 0;
    #currentGen = 1;
    #noOfGenerations;
    #avgFitness = 0;

    #isPreset;
    #fastForward = false;
    #animationPlayed = false;

    #optionsButtons = ["start-simulation"];
    #intervalButtons = ["next-generation", "slideshow", "fast-forward"];
    #summaryButtons = ["sim-download", "menu-3"];
    #slideshowSlides = ["slide-purge", "slide-crossover", "slide-mutation", "slide-updates", "slide-general"];

    population;
    //Pause functionality, although this currently isn't supported
    paused = false;

    constructor(width, height, isPreset = false)
    {
        super(width, height);
        this.#isPreset = isPreset;
        this.state = "options"; //User must first configure the settings of the simulation
    }

    get maxJumps() { return this.#maxJumps; }
    get currentGen() { return this.#currentGen; }
    get noOfGenerations() { return this.#noOfGenerations; }

    get optionsButtons() { return this.#optionsButtons; }
    get intervalButtons() { return this.#intervalButtons; }
    get summaryButtons() { return this.#summaryButtons; }
    get slideshowSlides() { return this.#slideshowSlides; }

    get statsText()
    {
        return "Generation: " + this.#currentGen + "/" + this.#noOfGenerations + "\n" +
            "Current Jump: " + this.#jumpPointer + "/" + this.#maxJumps + "\n" +
            "No. of AIs: " + this.population.size + "\n" +
            "Avg. fitness of prev. generation: " + this.#avgFitness;
    }

    _addObjectsToArray()
    {
        this._addWorldObjectsToArray();

        this.population.AIs.forEach(ai => {
            this.objectsOnScreen.push(ai);
        });
    }

    //Resets simulation to prepare for the next generation
    _reset()
    {
        this.#jumpPointer = 0;
        this.objectsOnScreen = [];
        this._addObjectsToArray();
        this.objectsOnScreenUpdated = true;
    }

    //Creates a new population; only called during the initialisation of the simulation
    _initNewPopulation(size)
    {
        this.population = new Population(size, this, this.#isPreset);
        
        if(this.#isPreset) this.population.mutate(this.#mutateChance);

        this._reset();
    }

    //Ensures user input is valid for population size
    _validatePopulationSize(size)
    {
        return (size >= this.#minPopulation && size <= this.#maxPopulation);
    }

    //Ensures user input is valid for generation size
    _validateGenerationSize(size)
    {
        return (size >= this.#minGenerations && size <= this.#maxGenerations);
    }

    //Returns average fitness of population for current generation
    _calcAvgFitness()
    {
        let totalFitness = 0, average;

        this.population.AIs.forEach(ai => {
            totalFitness += ai.fitness;
        });

        average = totalFitness/this.population.size;

        return Math.round(average * 100) / 100; //rounds to 2 decimal places
    }

    //Transition from current generation to next generation: see Pseudocode
    _prepareNewGeneration()
    {
        this.population.AIs = this.population.sortByFitness(this.population.AIs);

        this.population.purge(this.#purgePercentage);
        this.population.crossover();
        this.population.mutate(this.#mutateChance);

        this._reset();
        this.#currentGen++;
    }

    //Animation: fade away purged AIs
    playAnimation()
    {
        //Animation can only be played once in each generation,
        //as the purged AIs have already faded away if it were to be played again.
        this.#animationPlayed = true;

        //Wait 1 second before animation begins so it doesn't start too abruptly
        setTimeout(() => {
            let p = this.population; //Alias

            p.AIs = p.sortByFitness(p.AIs);

            let cutoff = Math.ceil(p.size * (1 - this.#purgePercentage)),
                playersToPurge = p.AIs.slice(cutoff, p.AIs.length);

            //Fade animation
            let fadeout = setInterval(() => {
                playersToPurge.forEach(ai => {
                    ai.alpha -= 0.01;

                    if(ai.alpha < 0) clearInterval(fadeout);
                });
            }, 1000/60); //60 frames per second

        }, 1000); //1000ms = 1 second wait time
    }

    //Update state machine when slideshow ends
    endOfSlideshow()
    {
        this.state = "interval";
    }

    //Tick called every frame
    tick()
    {
        switch(this.state)
        {
            case "options":
                //Do nothing
                break;

            case "simulation":
                //If not paused, tick the population
                if(!this.paused)
                {
                    this.population.tick();

                    //Make an action if all AIs are not moving
                    if(this.population.isStationary())
                    {
                        if((this.#jumpPointer === this.#maxJumps) || this.population.isFinished())
                        {
                            //End of generation
                            this.population.calcFitness();
                            this.#avgFitness = this._calcAvgFitness();

                            if(this.#currentGen == this.#noOfGenerations)
                            {
                                //End of generation, End of simulation
                                this.state = "summary";
                            } else
                            {
                                //End of generation, Not end of simulation
                                if(this.#fastForward)
                                {
                                    //Move straight on to next generation if 'fast forwarded'
                                    this._prepareNewGeneration();
                                    this.state = "simulation";
                                } else
                                {
                                    //Present interval menu for some interactive features, including the slideshow
                                    this.#animationPlayed = false;
                                    this.state = "interval";
                                }
                            }
                        } else
                        {
                            //End of current jump so make the next jump!
                            this.population.jump(this.#jumpPointer);
                            this.#jumpPointer++;
                        }
                    }
                }

                break;

            case "slideshow":
                if(!this.#animationPlayed) this.playAnimation();
                this.population.tick();

            case "summary":
                //Do nothing
                break;
        }
    }

    //Handles what happens when a button is clicked
    buttonClicked(buttonId, model)
    {
        switch(buttonId)
        {
            case "menu-2":
            case "menu-3":
                model.changeScene("menu");
                break;
            case "start-simulation":
                let size;

                //Asks user to input a population size until user enters a valid input
                do
                {
                    size = prompt(
                        "Enter no. of AI clones " +
                        "(between " + this.#minPopulation + " and " + this.#maxPopulation + ")"
                        , 50);
                } while(!(this._validatePopulationSize(size)));

                //Asks user to input no. of generations until user enters a valid input
                do
                {
                    this.#noOfGenerations = prompt(
                        "Enter no. of generations " +
                        "(between " + this.#minGenerations + " and " + this.#maxGenerations + ")"
                        , 20);
                } while(!(this._validateGenerationSize(this.#noOfGenerations)));

                size = parseInt(size);

                this._initNewPopulation(size); //Initialises population, ready to start simulation
                this.state = "simulation"; //Updates state machine. The simulation will begin the next frame (in the 'tick' method)
                break;
            case "next-generation":
                this._prepareNewGeneration();
                this.state = "simulation";
                break;
            case "slideshow":
                this.state = "slideshow";
                break;
            case "fast-forward":
                this.#fastForward = true;
                this._prepareNewGeneration();
                this.state = "simulation";
                break;

            case "sim-download":
                //Download jump history of best AI
                this._performDownload(this.population.leader);
                break;
        }
    }

}