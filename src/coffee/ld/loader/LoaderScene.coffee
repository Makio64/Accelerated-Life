# Loader visually "done" 

class LoaderScene extends Scene

	percent : 0
	points : null
	loaded : false

	constructor:()->
		super()

		@points = []
		for i in [0...100] by 1
			p = new VisualPoint()
			@points.push(p)
			@addChild(p)
		@resize()

		loader = new PIXI.AssetLoader([
			'./textures/01.json'
		], false )
		loader.addEventListener('onComplete',@onTextureLoaded)
		loader.load()

		TweenLite.to(@,30,{percent:.5,ease:Quad.easeInOut,onUpdate:@onUpdatePercent})

		window.setTimeout(()->
			$('.credit').addClass('activate') 
		, 200
		)

		return

	onTextureLoaded:()=>
		TweenLite.to(@,1,{percent:1,ease:Quad.easeInOut,onUpdate:@onUpdatePercent})
		return

	resize:()->
		if !@loaded
			for i in [0...@points.length] by 1
				p = @points[i]
				p.position.x = window.innerWidth*(i/@points.length)
				p.position.y = window.innerHeight/2
		return

	update:(dt)->
		return

	onUpdatePercent:()=>
		max = Math.floor(@percent*100)
		for i in [0...max] by 1
			@points[i].show()
		if max == 100
			for i in [0...99] by 1
				@points[i].migrateToCenter()
			@points[99].migrateToCenter(@onLoadingFinish)
		return

	onLoadingFinish:()=>
		SceneTraveler.to(new ArrowsScene())
		return


# Stupid point
class VisualPoint extends PIXI.Graphics

	showed : false

	constructor:()->
		super()
		@showed = false
		@draw()
		@alpha = 0
		@scale.x = .8
		@scale.y = .8
		return

	draw:()->
		@clear()
		@beginFill(0xFFFFFF,1)
		@drawRect(0,-window.innerHeight/2,1,window.innerHeight)
		@endFill()
		return

	show:()->
		if !@showed
			TweenLite.to(@,.4,{alpha:1})
			TweenLite.to(@scale,.4,{x:1,y:1,ease:Back.easeOut})
			@showed = true
		return

	migrateToCenter:(callback=null)->
		TweenLite.to(@scale,.15,{x:1,y:1/window.innerHeight,ease:Expo.easeOut})

		if callback	== null	
			TweenLite.to(@,.3,{delay:.1,x:Math.floor(window.innerWidth/2),y:Math.floor(window.innerHeight/2),ease:Quad.easeOut})
		else 	
			TweenLite.to(@,.3,{delay:.1,onComplete:callback,x:Math.floor(window.innerWidth/2),y:Math.floor(window.innerHeight/2),ease:Quad.easeOut})
		return
