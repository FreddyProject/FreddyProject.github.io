class Slideshow extends GuiObject
{
	#data;
	slides;

	constructor(width, height, x, y, imgs)
	{
		super(width, height, x, y);
		this.#data = imgs;
		this._initSlides();
	}

	_initSlides()
	{
		this.slides = new Queue(this.#data.length);
		this.#data.forEach(img => {
			this.slides.enQueue(img);
		});

		this.nextSlide();
	}

	nextSlide()
	{
		this.img = this.slides.deQueue();
		this.sprite.texture = resources[this.img].texture;
	}

	respond()
	{
		if(this.slides.isEmpty)
		{
			this._initSlides(); //Reinitialises slideshow if slideshow is shown again
			return "end";
		} else
		{
			this.nextSlide();
		}
	}
}