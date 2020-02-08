//This project is decoupled into GUI | MODEL | DATA
//This is the GUI class
class ProjectGUI
{
    //This contains any object that is of type GuiObject
    objectsGUI = [];

    //This contains the sprites of GUI/model objects
    containerBackground;
    containerGUI;
    containerMain;

    mouse;

    constructor(app)
    {
        this.containerBackground = new Container();
        this.containerGUI = new Container();
        this.containerMain = new Container();
        this._addParentContainer(app.stage);
        this.mouse = new MouseHandler(app.stage, this.containerMain);
    }

    getBackground(scene, width, height)
    {
        let id = "background-1";

        if(scene === "menu") id = "background-2";

        let background = new Tile(width, height, 0, 0, id),
            sprite = this._createSprite(background);

        return sprite;
    }

    getGuiObjectById(id)
    {
        let object = this.objectsGUI.find(element => {
            return element.id === id;
        });

        return object;
    }

    _addParentContainer(parent)
    {
        parent.addChild(this.containerBackground);
        parent.addChild(this.containerMain);
        parent.addChild(this.containerGUI);
    }

    _removeAllChildrenFromContainer(container)
    {
        for(let i = container.children.length - 1; i >= 0; i--)
        {
            container.removeChild(container.children[i]);
        }
    }

    _expandContainer(container, width, height)
    {
        let tile = new Tile(width, height, 0, 0, "null"),
            sprite = this._createSprite(tile);

        container.addChild(sprite);
    }

    _reset()
    {
        this.objectsGUI = [];
        this._removeAllChildrenFromContainer(this.containerMain);
        this._removeAllChildrenFromContainer(this.containerGUI);
    }

    _centraliseContainer(object)
    {
        if(object.parent === app.stage)
        {
            object.x = app.screen.width/2;
            object.y = app.screen.height/2;
        } else
        {
            object.x = object.parent.width/2;
            object.y = object.parent.height/2;
        }

        object.pivot.x = object.width/2;
        object.pivot.y = object.height/2;
    }

    _createSprite(object)
    {
        let sprite = new Sprite(resources[object.img].texture);
        this._updateSpriteVariables(sprite, object);

        return sprite;
    }

    _updateSpriteVariables(sprite, object)
    {
        sprite.width = object.width;
        sprite.height = object.height;
        sprite.x = object.position.x;
        sprite.y = object.position.y;
        sprite.alpha = object.alpha;
    }

    _reinitializeContainerMain(sceneManager)
    {
        this._removeAllChildrenFromContainer(this.containerMain);

        sceneManager.objectsOnScreen.forEach(object => {
            let sprite = this._createSprite(object);
            this.containerMain.addChild(sprite);
        });

        this._centraliseContainer(this.containerMain);
    }

    _createButtons(buttonIds, buttonWidth, buttonHeight, panelId)
    {
        let x = 0,
            y = 0,
            offset = buttonHeight * 1.8;

        let panel = new Panel(0, panelId);

        this.objectsGUI.push(panel);

        buttonIds.forEach(id => {
            let button = new Button(buttonWidth, buttonHeight, x, y, id);
            this.objectsGUI.push(button);
            panel.addChild(button.sprite);

            y += offset;
        });

        panel.update();

        this.containerGUI.addChild(panel.container);
        this._centraliseContainer(panel.container);

    }

    _initScene(model)
    {
        this._reset();

        let sceneManager = model.activeScene;

        this.containerBackground.addChild(
            this.getBackground(model.scene, sceneManager.width, sceneManager.height)
        );

        this._expandContainer(this.containerGUI, sceneManager.width, sceneManager.height);

        this._reinitializeContainerMain(sceneManager);
        this._centraliseContainer(this.containerBackground);
        this._centraliseContainer(this.containerGUI);
    }

    _initMenu(model)
    {
        //Create and add stuff into the main container
        let sceneManager = model.MENU;
        this._initScene(model);

        //Create and add stuff into the GUI container
        let width = sceneManager.buttonWidth*model.scale,
            height = sceneManager.buttonHeight*model.scale

        this._createButtons(sceneManager.mainButtons, width, height, "main-buttons");
        this._createButtons(sceneManager.simulatorButtons, width, height, "simulator-buttons");

        //Instructions
        let panelInstructions = new Panel(0, "instructions-panel"),
            instructions = new GuiObject(sceneManager.width, sceneManager.height, 0, 0, "instructions"),
            buttonMenu = new Button(model.scale*4, model.scale*4, 0, 0, "menu-2"),
            buttonLink = new Button(model.scale*4, model.scale*4, 0, 0, "link-tutorial");

        this.objectsGUI.push(panelInstructions, instructions, buttonMenu, buttonLink);

        this.containerGUI.addChild(panelInstructions.container);
        panelInstructions.addChild(instructions.sprite);
        panelInstructions.addChild(buttonMenu.sprite);
        panelInstructions.addChild(buttonLink.sprite);
        panelInstructions.update();

        buttonMenu.positionRelativeToObject("bottom", "right", model.activeScene, -model.scale, -model.scale);
        buttonLink.positionRelativeToObject("bottom", "right", model.activeScene, -model.scale*6, -model.scale);

        this._updateMenu(sceneManager);
    }

    _initWorld(model)
    {
        this._initScene(model);

        //Create and add stuff into the GUI container
        let buttonMenu = new Button(model.scale*4, model.scale*4, 0, 0, "menu-2");
        this.objectsGUI.push(buttonMenu);

        buttonMenu.positionRelativeToObject("top", "right", model.activeScene, -model.scale, model.scale);

        this.containerGUI.addChild(buttonMenu.sprite);
    }

    _initGame(model)
    {
        this._initWorld(model);

        let panelSummary = new Panel(model.scale*14, "player-summary", "background-3"),
            message = new WritableObject(0, 0, "Error", TEXT_STYLE[0], "summary-text"),
            buttonMenu = new Button(model.scale*4, model.scale*4, 0, 0, "menu-4"),
            buttonDownload = new Button(model.scale*4, model.scale*4, 0, 0, "download");

        this.objectsGUI.push(panelSummary, message, buttonMenu, buttonDownload);

        //Add sprites to container
        this.containerGUI.addChild(panelSummary.container);
        panelSummary.addChild(message.sprite);
        panelSummary.addChild(buttonMenu.sprite);
        panelSummary.addChild(buttonDownload.sprite);

        //Final updates and repositioning
        panelSummary.update();
        message.positionRelativeToObject("top", "centre", panelSummary, 0, model.scale);
        buttonMenu.positionRelativeToObject("bottom", "centre", panelSummary, -model.scale*4, -model.scale);
        buttonDownload.positionRelativeToObject("bottom", "centre", panelSummary, model.scale*4, -model.scale);
        this._centraliseContainer(panelSummary.container);

        panelSummary.setVisibility(false);
    }

    _initSimulation(model)
    {
        this._initWorld(model);

        let sceneManager = model.activeScene,
            width = sceneManager.buttonWidth*model.scale,
            height = sceneManager.buttonHeight*model.scale;

        this._createButtons(sceneManager.optionsButtons, width, height, "simulation-options");
        this._createButtons(sceneManager.intervalButtons, width, height, "simulation-interval");
        this._createButtons(sceneManager.summaryButtons, width, height, "simulation-summary");

        let panelSlideshow = new Panel(0, "simulation-slideshow"),
            slideshow = new Slideshow(sceneManager.width, sceneManager.height, 0, 0, sceneManager.slideshowSlides),
            panelStats = new Panel(0, "simulation-stats"),
            stats = new WritableObject(0, 0, "Error", TEXT_STYLE[1], "stats-text");

        this.objectsGUI.push(panelSlideshow, slideshow, panelStats, stats);

        this.containerGUI.addChild(panelSlideshow.container);
        panelSlideshow.addChild(slideshow.sprite);
        panelSlideshow.update();

        this.containerGUI.addChild(panelStats.container);
        panelStats.addChild(stats.sprite);
        panelStats.update();
        stats.positionRelativeToObject("top", "left", panelStats, model.scale*2, model.scale);

        this._updateSimulation(sceneManager);
    }

    _initReplay(model)
    {
        this._initWorld(model);

        let sceneManager = model.activeScene,
            width = sceneManager.buttonWidth*model.scale,
            height = sceneManager.buttonHeight*model.scale;

        this._createButtons(sceneManager.summaryButtons, width, height, "replay-summary");

        this._updateReplay(sceneManager);
    }

    _updateMenu(menu)
    {
        let mainPanel = this.getGuiObjectById("main-buttons"),
            simulatorPanel = this.getGuiObjectById("simulator-buttons"),
            instructionsPanel = this.getGuiObjectById("instructions-panel");

        if(menu.state === "main-menu")
        {
            mainPanel.setVisibility(true);
            simulatorPanel.setVisibility(false);
            instructionsPanel.setVisibility(false);
        }

        if(menu.state === "simulator-menu")
        {
            mainPanel.setVisibility(false);
            simulatorPanel.setVisibility(true);
            instructionsPanel.setVisibility(false);
        }

        if(menu.state === "instructions")
        {
            mainPanel.setVisibility(false);
            simulatorPanel.setVisibility(false);
            instructionsPanel.setVisibility(true);
        }
    }

    _updateGame(game)
    {
        if(game.state === "summary")
        {
            let panel = this.getGuiObjectById("player-summary");

            if(!panel.isVisible)
            {
                let message = this.getGuiObjectById("summary-text");
                message.setText(game.summaryText);
                panel.setVisibility(true);
            }
        }
    }

    _updateSimulation(simulation)
    {
        let panelOptions = this.getGuiObjectById("simulation-options"),
            panelInterval = this.getGuiObjectById("simulation-interval"),
            panelSlideshow = this.getGuiObjectById("simulation-slideshow"),
            panelSummary = this.getGuiObjectById("simulation-summary"),
            panelStats = this.getGuiObjectById("simulation-stats");

        if(panelOptions == undefined) return; //First tick: GUI objects have not been initialised.

        panelOptions.setVisibility(false);
        panelInterval.setVisibility(false);
        panelSummary.setVisibility(false);
        panelSlideshow.setVisibility(false);
        panelStats.setVisibility(false);

        if(simulation.state === "options") panelOptions.setVisibility(true);
        if(simulation.state === "interval") panelInterval.setVisibility(true);
        if(simulation.state === "slideshow") panelSlideshow.setVisibility(true);
        if(simulation.state === "summary") panelSummary.setVisibility(true);
        if(simulation.state === "simulation")
        {
            panelStats.setVisibility(true);

            let stats = this.getGuiObjectById("stats-text");
            stats.setText(simulation.statsText);
        }
    }

    _updateReplay(replay)
    {
        let panel = this.getGuiObjectById("replay-summary");

        if(panel == undefined) return; //First tick: GUI objects have not been initialised.

        if(replay.state === "summary")
        {
            panel.setVisibility(true);
        } else
        {
            panel.setVisibility(false);
        }
    }

    tick(model)
    {

        if(model.sceneChanged)
        {
            switch(model.scene)
            {
                case "menu":
                    this._initMenu(model);
                    break;
                case "game":
                    this._initGame(model);
                    break;
                case "simulation":
                    this._initSimulation(model);
                    break;
                case "replay":
                    this._initReplay(model);
                    break;
            }
            
        } else
        {
            //Tick main container
            if(model.activeScene.objectsOnScreenUpdated)
            {
                this._reinitializeContainerMain(model.activeScene);
                model.activeScene.objectsOnScreenUpdated = false;   
            }

            let objects = model.activeScene.objectsOnScreen;

            this.containerMain.children.forEach((child, i) => {
                this._updateSpriteVariables(child, objects[i]);
            });

            //Tick GUI container
            this.objectsGUI.forEach(child => {
                if(child instanceof Button)
                {
                    if(child.isClicked(this.mouse) && child.sprite.parent.visible)
                    {
                        model.activeScene.buttonClicked(child.id, model);
                        this.mouse.isClicked = false;
                    }
                }

                if(child instanceof Slideshow)
                {
                    if(child.isClicked(this.mouse) && child.sprite.parent.visible)
                    {
                        if(child.respond() == "end") model.activeScene.endOfSlideshow();
                        this.mouse.isClicked = false;
                    }
                }
            });

            //Check for any other changes
            if(model.scene === "menu") this._updateMenu(model.activeScene);
            if(model.scene === "game") this._updateGame(model.activeScene);
            if(model.scene === "replay") this._updateReplay(model.activeScene);
            if(model.scene === "simulation") this._updateSimulation(model.activeScene);
        }

        this.mouse.tick();
    }
}