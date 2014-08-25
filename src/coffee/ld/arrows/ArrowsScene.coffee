# First world


class ArrowsScene extends Scene

	arrows : null
	globuls : null
	exit : null
	hero : null
	worldContainer : null
	starsEmitters : null
	indicators : null
	triangles : null
	isCredit : true
	observers : null
	vx : 0
	vy : 0
	maxSpeed : 20

	rTarget : 0
	gTarget : 0
	bTarget : 0
	intensityTarget : 0

	level : 0

	ax : 0
	ay : 0 

	left:false
	right:false
	top:false
	bottom:false


	constructor:()->
		super()
		
		# Logic to extract TODO
		# @worldContainer = new DisplayObjectContainer()

		Arrow.poolInit()
		StarArrow.poolInit()
		ExitPoint.poolInit()

		@starsEmitters = []
		@triangles = []
		@arrows = []
		@globuls = []
		@indicators = []
		@observers = []

		@background = new BG()
		@addChild( @background )

		jizz = 400

		for x in [0...20] by 1
			for y in [0...20] by 1
				a = new AnimatedArrow()
				a.position.x = x*600 + jizz*Math.random()-jizz/2
				a.position.y = y*600 + jizz*Math.random()-jizz/2
				@addChild(a)
				@arrows.push(a)

		@exit = new Exit()
		@exit.position.x = 3000
		@exit.position.y = 2000
		@hero = new Hero()

		# @hero.addArms()
		# @hero.addArms()
		# @hero.addArms()

		@hero.position.x = window.innerWidth/2
		@hero.position.y = 5000#window.innerHeight/2

		@addChild @hero
		@addChild @exit

		@colorFilter = new PIXI.ColorFilter()
		@colorFilter.intensity = @intensityTarget
		@colorFilter.r = @rTarget
		@colorFilter.g = @gTarget
		@colorFilter.b = @bTarget

		@filters = [@colorFilter]

		# @hero.morphToAngel()
		
		# Logic to extract too TODO
		document.body.addEventListener('keydown',@onKeydown)
		document.body.addEventListener('keyup',@onKeyup)
		return

# -------------------------------------------------------------------------- KEYBOARD EVENTS

	onKeydown:(e)=>
		if @isCredit
			if e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 37 || e.keyCode == 39
				$('.credit').removeClass('activate') 
				@isCredit = false

		switch e.keyCode 
			when 38
				@top = true
			when 40
				@bottom = true
			when 37
				@left = true
			when 39
				@right = true
		return

	onKeyup:(e)=>
		switch e.keyCode 
			when 38
				@top = false
			when 40
				@bottom = false
			when 37
				@left = false
			when 39
				@right = false
		return

	resize:()->
		return


# -------------------------------------------------------------------------- UPDATE


	update:(dt)->

		@hero.update(dt)

		@ax = 0
		@ay = 0
		if @left then @ax-=1
		if @right then @ax+=1 
		if @top then @ay-=1
		if @bottom then @ay+=1 
		
		@vx += @ax
		@vy += @ay

		@vx *= .95
		@vy *= .95

		if @vx > @maxSpeed
			@vx = @maxSpeed
		else if @vx < -@maxSpeed
			@vx = -@maxSpeed
		if @vy > @maxSpeed
			@vy = @maxSpeed
		else if @vy < -@maxSpeed
			@vy = -@maxSpeed

		@hero.position.x += @vx
		@hero.position.y += @vy

		@hero.rotation = Math.atan2(@vy,@vx)+Constant.MPI2

		@exit.update(dt)

		@position.x = -@hero.position.x+window.innerWidth/2
		@position.y = -@hero.position.y+window.innerHeight/2

		@background.position.x = @hero.position.x-Math.ceil(window.innerWidth/2)
		@background.position.y = @hero.position.y-Math.ceil(window.innerHeight/2)
		
		dx = @exit.position.x - @hero.position.x
		dy = @exit.position.y - @hero.position.y
		rotation = Math.atan2(dy,dx)-Constant.MPI2

		@colorFilter.intensity += (@intensityTarget-@colorFilter.intensity)*0.05
		@colorFilter.r += (@rTarget-@colorFilter.r)*0.05
		@colorFilter.g += (@gTarget-@colorFilter.g)*0.05
		@colorFilter.b += (@bTarget-@colorFilter.b)*0.05

		for i in [@arrows.length-1..0] by -1
			if !@arrows[i].destroying
				@arrows[i].lookAt(@exit.position.x,@exit.position.y)
			@arrows[i].update(dt)
			# @arrows[i].rotation = rotation 

		distance = Math2d.distanceSqrt(@hero.position,@exit.position)
		if distance < 70
			@levelUp()

		if @level == 7 || @level == 8 
			GlobulManager.update(dt,@,rotation,@hero,@exit,distance,@level==8)

		if @level == 9 ||  @level == 10 #||  @level == 11
			StarManager.update(dt,@,rotation,@hero,@exit,distance,false)

		for i in [@triangles.length-1..0] by -1
			@triangles[i].update(dt,@exit)

		for i in [@starsEmitters.length-1..0] by -1
			@starsEmitters[i].update(dt)
		
		for i in [@observers.length-1..0] by -1
			@observers[i].update(dt)
						
		@background.update(dt)

		return

	levelUp:()->
		@level++
		@exit.destroy()
		for i in [@observers.length-1..0] by -1
			if @observers[i].target == @exit
				@observers[i].dispose()
			
		
		@exit = new Exit()
		@addChild(@exit)

		# Destroy arrow in a beautifull way :)
		for i in [0...@arrows.length] by 1
			if !@arrows[i].destroying
				@arrows[i].destroy()

		for i in [0...@triangles.length] by 1
			if !@triangles[i].destroying
				@triangles[i].destroy()

		# And add new one
		if @level < 7 || @level > 16 && @level < 19
			jizz = 400
			for x in [0...20] by 1
				for y in [0...20] by 1
					a = new AnimatedArrow()
					a.position.x = x*600 + jizz*Math.random()-jizz/2
					a.position.y = y*600 + jizz*Math.random()-jizz/2
					@addChild(a)
					@arrows.push(a)

		if (@level >= 11 && @level <= 16)
			jizz = 200
			for x in [0...30] by 1
				for y in [0...30] by 1
					a = new Triangle()
					a.position.x = x*400 + jizz*Math.random()-jizz/2
					a.position.y = y*400 + jizz*Math.random()-jizz/2
					@addChild(a)
					@triangles.push(a)

		

		switch(@level)
			when 1 
				@hero.addEye()
				@exit.position.x = 300
				@exit.position.y = 3000
				@rTarget = 1
				@intensityTarget = .6
				@hero.grow()
				break
			when 2
				@hero.addBear()
				@hero.grow()
				@bTarget = .3
				@intensityTarget = .4
				@exit.position.x = 1500
				@exit.position.y = 500
				@filter = [new PIXI.InvertFilter(1), new PIXI.ColorMatrixFilter([0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1])]
				break
			when 3
				@hero.addArms()
				@hero.grow()
				@gTarget = .7
				@intensityTarget = .45
				@exit.position.x = 2000
				@exit.position.y = 4000
				break
			when 4
				@gTarget = .2
				@rTarget = .1
				@bTarget = .7
				@hero.grow()
				@hero.addArms()
				@intensityTarget = .5
				@exit.position.x = 4000
				@exit.position.y = 4500
				break
			when 5
				@hero.small()
				@hero.addArms()
				@gTarget = .2
				@rTarget = .4
				@bTarget = .1
				@exit.position.x = 6000
				@exit.position.y = 6000
				@intensityTarget = .2
				break
			when 6
				@hero.small()
				@hero.addArms()
				@gTarget = .7
				@rTarget = .7
				@bTarget = .2
				@exit.position.x = 3000
				@exit.position.y = 6500
				@intensityTarget = .3
				break
			when 7
				@hero.small()
				@hero.addBear()
				@hero.addBear()
				@hero.addBear()
				@hero.addBear()
				@hero.removeArms()
				@gTarget = .2
				@rTarget = .9
				@bTarget = .1
				@exit.position.x = 1000
				@exit.position.y = 1000
				@intensityTarget = .6
				break
			when 8
				@hero.grow()
				@hero.addBear()
				@hero.addBear()
				@intensityTarget = .7
				@exit.position.x = 6000
				@exit.position.y = 2000
				break

			when 9
				@hero.small()
				@hero.addBear()
				@hero.addBear()
				@gTarget = .12
				@rTarget = .12
				@bTarget = .5
				@intensityTarget = .5
				@exit.position.x = 4000
				@exit.position.y = 4000

				e = new StarArrowEmitter(@exit,150,.6)
				@addChild(e)
				@starsEmitters.push(e)
				e = new StarArrowEmitter(@exit,1300,7)
				@addChild(e)
				@starsEmitters.push(e)
				break

			when 10
				# @hero.small()
				@gTarget = .12
				@rTarget = .12
				@bTarget = .5
				@intensityTarget = .6
				@exit.position.x = 6000
				@exit.position.y = 2000
				for i in [@starsEmitters.length-1..0] by -1
					@starsEmitters[i].dispose()
				e = new StarArrowEmitter(@hero,100,.4)
				@addChild(e)
				@starsEmitters.push(e)
				e = new StarArrowEmitter(@exit,150,.6)
				@addChild(e)
				@starsEmitters.push(e)
				e = new StarArrowEmitter(@exit,1300,7)
				@addChild(e)
				@starsEmitters.push(e)
				break
			when 11
				@hero.morphToSquare()
				@hero.grow()
				@gTarget = .7
				@rTarget = .7
				@bTarget = .1
				@intensityTarget = .55
				@exit.position.x = 500
				@exit.position.y = 1000
				for i in [@starsEmitters.length-1..0] by -1
					@starsEmitters[i].dispose()
				break
			when 12
				@gTarget = .4
				@rTarget = .7
				@bTarget = .2
				@hero.addBear()
				# @hero.grow()
				# @gTarget = .2
				# @rTarget = .6
				# @bTarget = .6
				@intensityTarget = .5
				@exit.position.x = 2000
				@exit.position.y = 1000
				break
			when 13
				@gTarget = .8
				@rTarget = .5
				@bTarget = .3
				@hero.addTentacle()
				@hero.addBear()
				# @hero.grow()
				@intensityTarget = .45
				@exit.position.x = 3500
				@exit.position.y = 4000
				break
			when 14
				@hero.addBear()
				@hero.addBear()
				@hero.addMiniEye()
				@hero.addMiniEye()
				@hero.addMiniEye()
				# @hero.grow()
				@intensityTarget = .4
				@gTarget = .7
				@rTarget = .9
				@bTarget = .5
				@exit.position.x = 4900
				@exit.position.y = 6000
				o = new Observer(@exit)
				@observers.push o 
				@addChild o
				break
			when 15
				@gTarget = .7
				@rTarget = .9
				@bTarget = .5
				@hero.addMiniEye()
				@hero.addMiniEye()
				@intensityTarget = .35
				@exit.position.x = 3500
				@exit.position.y = 2500

				o = new Observer(@hero)
				@observers.push o 
				@addChild o
				for i in [0..10] by 1
					o = new Observer(@exit)
					@observers.push o 
					@addChild o
				break
			when 16
				@hero.addMiniEye()
				@hero.addMiniEye()
				@hero.addMiniEye()
				@hero.addArms()
				@hero.small()
				for i in [0..3] by 1
					o = new Observer(@hero)
					@observers.push o 
					@addChild o
				for i in [0..15] by 1
					o = new Observer(@exit)
					@observers.push o 
					@addChild o
				@intensityTarget = .3
				@exit.position.x = 1500
				@exit.position.y = 5000
				break
			# when 17
			# 	@hero.addMiniEye()
			# 	@hero.addMiniEye()
			# 	@hero.addMiniEye()
			# 	for i in [0..15] by 1
			# 		o = new Observer(@exit)
			# 		@observers.push o 
			# 		@addChild o
			# 	for i in [0..3] by 1
			# 		o = new Observer(@hero)
			# 		@observers.push o 
			# 		@addChild o
			# 	@intensityTarget = .2
			# 	@exit.position.x = 1000
			# 	@exit.position.y = 2000
			# 	break
			when 17
				for i in [0..4] by 1
					o = new Observer(@hero)
					@observers.push o 
					@addChild o
				@hero.addMiniEye()
				@hero.addArms()
				@hero.addMiniEye()
				o = new Observer(@hero)
				@observers.push o 
				@addChild o
				o = new Observer(@hero)
				@observers.push o 
				@addChild o
				@gTarget = .1
				@rTarget = .2
				@bTarget = .1
				@intensityTarget = .1
				@exit.position.x = 5500
				@exit.position.y = 1500
				break
			
			when 18
				@gTarget = .8
				@rTarget = .8
				@bTarget = .8
				for i in [@observers.length-1..0] by -1
					@observers[i].dispose()
				@hero.morphToAngel()
				@hero.small()
				@intensityTarget = .6
				@exit.position.x = 2500
				@exit.position.y = 2500
				break

			when 19
				$('.credit').addClass('activate')
				@hero.morphToPoint()
				@hero.small()
				@exit.position.x = 3500
				@exit.position.y = 1500
				# Make the infinite loop
				@level = 0
				@levelUp()
				break
		return


# -------------------------------------------------------------------------- ARROW


# arrow Animation
class StarArrowEmitter extends PIXI.DisplayObjectContainer

	target : null
	time : 0
	tick : 700
	startTime : 0.0
	power : 300
	angle : 0.0
	destroying : false

	constructor:(@target,@tick=700,@power)->
		super()
		@pivot.x = .5
		@pivot.y = .5
		@alpha = .3
		@startTime = 600 + Math.floor(Math.random()*200)
		return

	update:(dt)->
		@position.x = @target.position.x
		@position.y = @target.position.y
		if @started && !@destroying
			@time += dt 
			if @time>@tick
				@time -= @tick
				@angle += .2
				angle = @angle
				steps = Constant.M2PI/10
				for i in [0...10] by 1
					angle += steps
					vx = Math.cos(angle)*@power
					vy = Math.sin(angle)*@power
					a = StarArrow.pool.checkOut()
					a.show(vx,vy)
					@addChild(a)

		if !@started
			@time += dt 
			if @time>@startTime
				@started = true
				@time = 0
		return

	dispose:()->
		if @destroying
			return

		@destroying = true
		
		TweenLite.to(@,.5,{alpha:0})
		TweenLite.to(@scale,.5,{x:4,y:4,ease:Quad.easeOut,onComplete:()=>
			idx = @parent.starsEmitters.indexOf(@)
			@parent.starsEmitters.splice(idx,1)
			@parent.removeChild @ 
		})
		return



# arrow Animation
class StarArrow extends PIXI.Sprite

	vx : 0.0
	vy : 1.0

	@pool = null
	@poolInit = ()->
		StarArrow.pool = new ObjectPool(()->
			return new StarArrow()
		,100,1000
		)

	constructor:(vx,vy)->
		super(PIXI.Texture.fromFrame('arrow.png'))
		return

	show:(vx,vy)->
		@initValue()
		@scale.x = .3
		@scale.y = .3
		@vx = vx
		@vy = vy
		@rotation = Math.atan2(@vy,@vx)-Constant.MPI2
		TweenLite.to(@,.2,{alpha:1})
		TweenLite.to(@position,1,{x:vx*80,y:vy*80})
		TweenLite.to(@scale,1,{x:1,y:1})
		TweenLite.to(@,.2,{delay:.8,alpha:0,onComplete:@dispose})
		return

	initValue:()=>
		@rotation = 0
		@alpha = 0
		@position.y = 0
		@position.x = 0
		@scale.x = 1.0
		@scale.y = 1.0
		return

	dispose:()=>
		# @initValue()
		@parent.removeChild(@)
		StarArrow.pool.checkIn(@)
		return

# arrow Animation
class AnimatedArrow extends PIXI.DisplayObjectContainer

	time : 0
	tick : 350
	arrows : null
	@started : null
	destroying : false
	startTime : 0.0

	constructor:()->
		super()
		@pivot.x = .5
		@pivot.y = .5
		@arrows = []
		@startTime = 600 + Math.floor(Math.random()*200)
		return

	update:(dt)->
		if !@destroying && @started
			@time += dt 
			if @time>@tick
				@time -= @tick
				a = Arrow.pool.checkOut()
				a.show()
				@addChild(a)
				@arrows.push(a)

		if !@started
			@time += dt 
			if @time>@startTime
				@started = true
				@time = 0
		
		for i in [@arrows.length-1..0] by -1
			@arrows[i].update(dt)
		return

	destroy:()->
		@destroying = true
		for i in [@arrows.length-1..0] by -1
			@angle = (Constant.M2PI*.3-.15)*((i+1)/@arrows.length)
			x = Math.cos(@angle)*6
			y = Math.sin(@angle)*3
			@arrows[i].destroy(x,y)
		return

	lookAt:(x,y)->
		dx = x - @position.x
		dy = y - @position.y
		@rotation = Math.atan2(dy,dx)-Constant.MPI2
		return

	remove:(a)->
		@arrows.splice(@arrows.indexOf(a),1)
		@removeChild(a)
		Arrow.pool.checkIn(a)
		if @destroying && @arrows.length == 0
			idx = @parent.arrows.indexOf(@)
			@parent.arrows.splice(idx,1)
			@parent.removeChild(@)
		
		return


# arrow Animation
class Arrow extends PIXI.Sprite

	hidding : false
	destroying : false
	vx : 0.0
	vy : 1.0

	@pool = null
	@poolInit = ()->
		Arrow.pool = new ObjectPool(()->
			return new Arrow()
		,100,1000
		)

	constructor:()->
		super(PIXI.Texture.fromFrame('arrow.png'))
		return

	show:()->
		@initValue()
		TweenLite.to(@,.7,{alpha:1})
		return

	destroy:(vx,vy)->
		# if !@hidding
		TweenLite.killTweensOf(@)
		@destroying = true
		@vx=vx
		@vy=vy
		return

	update:(dt)->
		speed = Math.ceil(dt/16)
		@position.y += speed*@vy
		@position.x += speed*@vx

		if @destroying
			@rotation = Math.atan2(@vy,@vx)-Constant.MPI2#( - @rotation)*.15
			@alpha -= speed*0.007
			if @alpha <= 0.02
				@dispose()
			return

		else if !@hidding && @position.y > 300
			@hidding = true
			TweenLite.to(@scale,.3,{x:0.8,y:0.8})
			TweenLite.to(@,.3,{alpha:0,onComplete:@dispose})

		return

	initValue:()=>
		@hidding = false
		@destroying = false
		@rotation = 0
		@alpha = 0
		@position.y = 0
		@position.x = 0
		@scale.x = 1.0
		@scale.y = 1.0
		@vx = 0.0
		@vy = 3.0
		return

	dispose:()=>
		@initValue()
		@parent.remove(@)
		return


# Background

class BG extends PIXI.Graphics

	constructor:()->
		super()
		@alpha = 0
		@noiseFilter = new PIXI.NoiseFilter()
		@noiseFilter.intensity = -.2
		@filters = [@noiseFilter]
		@resize()
		TweenLite.to(@,2,{alpha:.1})
		return

	resize:()->
		@clear()
		@beginFill(0xCCCCCC)
		@drawRect(0,0,Math.ceil(window.innerWidth),Math.ceil(window.innerHeight))
		@endFill()
		return

	update:(dt)->
		@noiseFilter.time += dt*0.01
		return


# -------------------------------------------------------------------------- HERO



# Another stupid creature evolving
class Hero extends PIXI.DisplayObjectContainer

	currentForm : null
	bears : null
	lefts : null
	eyes : null
	rights : null
	time : 0

	constructor:()->
		super()
		@bears = []
		@lefts = []
		@rightsWing = []
		@leftsWing = []
		@eyes = []
		@rights = []
		@scale.x = 0.2
		@scale.y = 0.2
		@morphToPoint()
		return

	getPointForm:(radius)->
		g = new PIXI.Graphics()
		g.clear()
		g.beginFill(0xFFFFFF,1)
		g.drawCircle(0,0,radius)
		g.endFill()
		return g

	morphToPoint:()->
		@removeForm()
		@currentForm = @getPointForm(10)
		@addChild @currentForm
		return

	morphToSquare:()->
		@removeForm()
		@isSquare = true
		base = new PIXI.Sprite(PIXI.Texture.fromFrame('heroS-bg.png'))
		base.pivot.x = base.width/2
		base.pivot.y = base.height/2
		TweenLite.from(base.scale,1.1,{x:0,y:0,ease:Back.easeOut})
		@addChild(base)
		puppils = new PIXI.Sprite(PIXI.Texture.fromFrame('eyeSquare.png'))
		# puppils.position.y = -30
		puppils.pivot.x = puppils.width/2
		puppils.pivot.y = puppils.height/2
		TweenLite.from(puppils.scale,1.1,{x:0,y:0,ease:Back.easeOut})
		@addChild(puppils)
		return

	morphToAngel:()->
		@removeForm()
		@addEye()
		right = new PIXI.Sprite(PIXI.Texture.fromFrame('wings.png'))
		right.pivot.x = 53
		right.pivot.y = 101
		angle = @rights.length*.4-.2
		right.position.x = 110
		right.position.y = 0
		@rightsWing.push right
		TweenLite.from(right.scale,1.1,{x:0,y:0,ease:Back.easeOut})
		@addChild(right)
		left = new PIXI.Sprite(PIXI.Texture.fromFrame('wingsLeft.png'))
		left.pivot.x = 144
		left.pivot.y = 101
		angle = @lefts.length*.4-.2
		left.position.x = -110
		left.position.y = 0
		@leftsWing.push left
		TweenLite.from(left.scale,1.1,{x:0,y:0,ease:Back.easeOut})
		@addChild(left)
		return

	addTentacle:()->
		tentacle = new PIXI.Sprite(PIXI.Texture.fromFrame('heroS-tentacles.png'))
		tentacle.pivot.x = 95
		tentacle.pivot.y = 0
		tentacle.scale.x = 0
		tentacle.scale.y = 0
		tentacle.position.x = 30
		tentacle.position.y = 20
		TweenLite.to(tentacle.scale,1.1,{x:1,y:1,ease:Quad.easeOut})
		@tentacle = tentacle
		@addChild(tentacle)
		return

	addMiniEye:()->
		eye = new PIXI.Sprite(PIXI.Texture.fromFrame('eyeSquare.png'))
		eye.pivot.x = eye.width/2
		eye.pivot.y = eye.height/2
		eye.scale.x = 0
		eye.scale.y = 0
		# switch(@eyes.length)
		# 	when 0
		# 		eye.position.x = 30
		# 		eye.position.y = 20

		eye.rotation = Constant.M2PI*Math.random()
		radius = 50 + Math.random()*30
		angle = Constant.M2PI*Math.random()

		eye.position.x = Math.cos(angle)*radius
		eye.position.y = Math.sin(angle)*radius
		@eyes.push eye
		TweenLite.to(eye.scale,1.1,{x:.5,y:.5,ease:Quad.easeOut})
		@addChild(eye)

		angle = -Constant.MPI2
		steps = Constant.M2PI/@eyes.length
		radius = 60 + Math.random()*50
		for i in [0...@eyes.length] by 1
			angle += steps
			e = @eyes[i]
			TweenLite.to(e,.5,{rotation : Constant.M2PI*Math.random() })
			x = Math.cos(angle)*radius
			y = Math.sin(angle)*radius
			TweenLite.to(e.position,.5,{x:x, y:y})
		
		return

	addEye:()->
		@removeForm()
		eye = new PIXI.Sprite(PIXI.Texture.fromFrame('hero-bg.png'))
		eye.pivot.x = eye.width/2
		eye.pivot.y = eye.height/2
		TweenLite.from(eye.scale,1.1,{x:0,y:0,ease:Back.easeOut})
		@addChild(eye)
		puppils = new PIXI.Sprite(PIXI.Texture.fromFrame('hero-pupils.png'))
		puppils.position.y = -30
		puppils.pivot.x = puppils.width/2
		puppils.pivot.y = puppils.height/2
		TweenLite.from(puppils.scale,1.1,{x:0,y:0,ease:Back.easeOut})
		@addChild(puppils)
		return


	addBear:()->
		if @isSquare
			bear = new PIXI.Sprite(PIXI.Texture.fromFrame('bearSquare.png'))
		else
			bear = new PIXI.Sprite(PIXI.Texture.fromFrame('hero-bear.png'))
		bear.pivot.x = bear.width/2
		bear.pivot.y = bear.height/2
		bear.scale.x = 0
		bear.scale.y = 0
		bear.alpha = 1/(@bears.length+1)
		TweenLite.to(bear.scale,1.1,{x:1+@bears.length*.25,y:1+@bears.length*.25,ease:Quad.easeOut})
		@bears.push bear
		@addChildAt(bear,0)

	addArms:()->
		left = new PIXI.Sprite(PIXI.Texture.fromFrame('hero-leftarms.png'))
		left.pivot.x = 9
		left.pivot.y = 125
		angle = @lefts.length*.4-.2
		left.position.x = Math.cos(angle)*98
		left.position.y = Math.sin(angle)*98
		@lefts.push left
		TweenLite.from(left.scale,1.1,{x:0,y:0,ease:Back.easeOut})
		@addChild(left)

		right = new PIXI.Sprite(PIXI.Texture.fromFrame('hero-rightarms.png'))
		right.pivot.x = 66
		right.position.x = -98
		right.pivot.y = 125
		angle = @rights.length*.4-.2
		right.position.x = -Math.cos(angle)*98
		right.position.y = Math.sin(angle)*98
		@rights.push right
		TweenLite.from(right.scale,1.1,{x:0,y:0,ease:Back.easeOut})
		@addChild(right)

	removeArms:()->
		for i in [0...@lefts.length] by 1
			l = @lefts[i]
			r = @rights[i]
			scope = @
			do (l,r,scope) ->
				TweenLite.to(l.scale,.4,{delay:i*0.05,x:0,y:0,ease:Expo.easeOut,onComplete:()->
					scope.removeChild(l)
				})
				TweenLite.to(r.scale,.4,{delay:i*0.05+0.02,x:0,y:0,ease:Expo.easeOut,onComplete:()->
					scope.removeChild(r)
				})
		@lefts = []
		@rights = []
		return

	update:(dt)->
		@time += dt
		if @tentacle
			@tentacle.rotation = Math.sin(@time/400)*.2-.1
		for i in [0...@bears.length] by 1
			@bears[i].rotation = Math.random()*Constant.M2PI
		l = @lefts.length
		for i in [0...l] by 1
			@lefts[i].rotation = Math.sin(@time/100+((i+1)/l))*.3
			@rights[i].rotation = -Math.sin(@time/100+((i+1)/l))*.3
		l = @rightsWing.length
		for i in [0...l] by 1
			@leftsWing[i].rotation = -Math.sin(@time/100+((i+1)/l))*.3-.75
			@rightsWing[i].rotation = Math.sin(@time/100+((i+1)/l))*.3+.75
		

 
	removeForm:()->
		@bears = []
		@eyes = []
		@lefts = []
		@rights = []
		@tentacle = null
		@isSquare = false
		if @currentForm == null
			if @children.length >= 0
				for i in [@children.length-1..0] by -1
					c = @children[i]
					scope = @
					do(c,scope)->
						TweenLite.to(c.scale, .5, {x:0,y:0,onComplete:()->
							scope.removeChild(c)
						})
			return
		else
			c = @currentForm
			TweenLite.to(@currentForm.scale, .5, {x:0,y:0,onComplete:()=>
				@removeChild(c)
			})
			@currentForm = null
		return

	grow:()->
		TweenLite.to(@scale, 1.2, {x:@scale.x+.2,y:@scale.y+.2, ease:Back.easeOut})
		return

	small:()->
		TweenLite.to(@scale, 1.2, {x:@scale.y-.2,y:@scale.x-.2, ease:Back.easeOut})
		return


# -------------------------------------------------------------------------- EXIT

class Exit extends PIXI.DisplayObjectContainer

	time : 0
	tick : 750
	points : null
	destroying : false

	constructor:()->
		super()
		@pivot.x = .5
		@pivot.y = .5
		@points = []
		return

	update:(dt)->
		if @destroying then return
		
		@time += dt 
		if @time>@tick
			@time -= @tick
			a = ExitPoint.pool.checkOut()
			a.show()
			@addChild(a)
			@points.push(a)
		# for i in [@points.length-1..0] by -1
		# 	@points[i].update(dt)
		return

	remove:(a)->
		@points.splice(0,1)
		@removeChild(a)
		ExitPoint.pool.checkIn(a)
		return

	destroy:()->
		@destroying = true
		TweenLite.to(@,1.4,alpha:0)
		TweenLite.to(@scale,1.4,{ease:Expo.easeIn,x:10,y:10,onComplete:@dispose})
		return

	dispose:()=>
		@parent.removeChild(@)
		return

# Stupid point
class ExitPoint extends PIXI.Graphics

	@pool = null
	@poolInit = ()->
		ExitPoint.pool = new ObjectPool(()->
			return new ExitPoint()
		,20,100
		)


	constructor:()->
		super()
		@draw()
		@scale.x = 0
		@scale.y = 0
		return

	show:()->
		@alpha = 1
		TweenLite.to(@scale,1.6,{x:1,y:1,ease:Quad.easeOut,onComplete:@dispose})
		TweenLite.to(@,1.6,{alpha:0,ease:Quad.easeOut})
		return

	dispose:()=>
		@parent.remove(@)
		@scale.x = 0
		@scale.y = 0
		@alpha = 1
		return

	draw:()->
		@clear()
		@beginFill(0xFFFFFF,1)
		@drawCircle(0,0,70)
		@endFill()
		return

# GlobulManager

class GlobulManager

	@time = 0
	@tick = 75

	@update:(dt,stage,angle,hero,exit,distance,move)->
		@time += dt
		if @time > @tick
			@time -= @tick
			g = new Globul()
			stage.addChild(g)
			if distance > 300		
				dist = 100+500*Math.random()
				angle+=Math.random()*.2-.1+Constant.MPI2
				if !move
					g.position.x = hero.position.x + Math.cos(angle)*dist
					g.position.y = hero.position.y + Math.sin(angle)*dist
				else 
					g.position.x = exit.position.x
					g.position.y = exit.position.y
					TweenLite.to(g,.8,{ease:Quad.easeOut,x:hero.position.x,y:hero.position.y})

			else
				dist = 300*Math.random()
				angle=Math.random()*Constant.M2PI
				g.position.x = exit.position.x + Math.cos(angle)*dist
				g.position.y = exit.position.y + Math.sin(angle)*dist
		return

class Globul extends PIXI.Sprite

	constructor:()->
		r = Math.floor(Math.random()*4)
		texture = PIXI.Texture.fromFrame('globul'+r+'.png')
		super(texture)
		@alpha = 0
		@pivot.x = @width/2
		@pivot.y = @height/2
		@scale.x = .2
		@scale.y = .2
		@rotation=Constant.M2PI*Math.random()*4
		TweenLite.to(@,.2,{alpha:1})
		TweenLite.to(@,.4,{delay:.4,alpha:0,onComplete:@dispose})
		TweenLite.to(@,.8,{rotation:@rotation+Math.random()*.3-.15})
		TweenLite.to(@scale,.8,{x:.5,y:.5,ease:Quad.easeOut})
		return

	dispose:()=>
		@parent.removeChild(@)
		return

# TriangleManager
# class TriangleManager

# 	@time = 0
# 	@tick = 75

# 	@update:(dt,stage,angle,hero,exit,distance,move)->
# 		@time += dt
# 		if @time > @tick
# 			@time -= @tick
# 			g = new Globul()
# 			stage.addChild(g)
# 			if distance > 300		
# 				dist = 100+500*Math.random()
# 				angle+=Math.random()*.2-.1+Constant.MPI2
# 				if !move
# 					g.position.x = hero.position.x + Math.cos(angle)*dist
# 					g.position.y = hero.position.y + Math.sin(angle)*dist
# 				else 
# 					g.position.x = exit.position.x
# 					g.position.y = exit.position.y
# 					TweenLite.to(g,.8,{ease:Quad.easeOut,x:hero.position.x,y:hero.position.y})

# 			else
# 				dist = 300*Math.random()
# 				angle=Math.random()*Constant.M2PI
# 				g.position.x = exit.position.x + Math.cos(angle)*dist
# 				g.position.y = exit.position.y + Math.sin(angle)*dist
# 		return

class Triangle extends PIXI.Sprite

	time : 0
	destroying : false

	constructor:()->
		texture = PIXI.Texture.fromFrame('indicator.png')
		super(texture)
		@time = Math.floor(Math.random()*1000)
		@alpha = 0
		@pivot.x = @width/2
		@pivot.y = @height/2
		@scale.x = .2
		@scale.y = .2
		TweenLite.to(@,.2,{alpha:1})
		scale = .2+Math.random()*.4
		TweenLite.to(@scale,.8,{x:scale,y:scale,ease:Quad.easeOut})
		return

	update:(dt,target)->
		@time += dt
		angle = Math.atan2(@position.y-target.position.y,@position.x-target.position.x)-Constant.MPI2
		@rotation = angle+Math.sin(@time/200)*.3#-@rotation)*.15
		return

	destroy:()->
		@destroying = true
		x = @position.x+Math.cos(@rotation)*100
		y = @position.y+Math.sin(@rotation)*100
		duration = .5+Math.random()*.3
		TweenLite.to(@position,duration,{x:x,y:y})
		TweenLite.to(@,duration,{alpha:0,onComplete:@dispose})
		return

	dispose:()=>
		@parent.triangles.splice(@parent.triangles.indexOf(@),1)
		@parent.removeChild(@)
		return


# StarManager

class StarManager

	@time = 0
	@tick = 200

	@update:(dt,stage,angle,hero,exit,distance,move)->
		@time += dt
		if @time > @tick
			@time -= @tick
			g = new Star()
			stage.addChild(g)
			if distance > 300		
				dist = 100+500*Math.random()
				angle+=Math.random()*.6-.3+Constant.MPI2
				if !move
					g.position.x = hero.position.x + Math.cos(angle)*dist
					g.position.y = hero.position.y + Math.sin(angle)*dist
				else 
					g.position.x = exit.position.x
					g.position.y = exit.position.y
					TweenLite.to(g,.8,{ease:Quad.easeOut,x:hero.position.x,y:hero.position.y})

			else
				dist = 300*Math.random()
				angle=Math.random()*Constant.M2PI
				g.position.x = exit.position.x + Math.cos(angle)*dist
				g.position.y = exit.position.y + Math.sin(angle)*dist
		return

class Star extends PIXI.Sprite

	constructor:()->
		r = Math.floor(Math.random()*4)
		texture = PIXI.Texture.fromFrame('star.png')
		super(texture)
		@alpha = 0
		@pivot.x = @width/2
		@pivot.y = @height/2
		@scale.x = .2
		@scale.y = .2
		@rotation = Constant.M2PI*Math.random()*4
		TweenLite.to(@,.2,{alpha:1})
		TweenLite.to(@,.4,{delay:.4,alpha:0,onComplete:@dispose})
		TweenLite.to(@,.8,{rotation:@rotation+Math.random()*.3-.15})
		TweenLite.to(@scale,.8,{x:.5,y:.5,ease:Quad.easeOut})
		return

	dispose:()=>
		@parent.removeChild(@)
		return


class Observer extends PIXI.Sprite

	angle : 0.0
	time : 0.0
	tick : 0.0
	timer : 0.0
	target : null
	baseRadius : 200
	destroying : false

	constructor:(@target)->
		time = Math.random()*1000.0
		r = Math.floor(Math.random()*3)
		texture = PIXI.Texture.fromFrame('weirdEye0'+r+'.png')
		super(texture)
		@alpha = 0
		@pivot.x = @width/2
		@pivot.y = @height/2
		@scale.x = .8
		@scale.y = .8
		@rotation = Constant.M2PI*Math.random()
		@angle = Constant.M2PI*Math.random()

		TweenLite.to(@,.5,{alpha:1})
		TweenLite.to(@scale,.5,{x:.5,y:.5})
		return

	update:(dt)->
		@time += dt
		radius = @baseRadius + Math.cos(@time/600)*70
		angle = @angle + Math.sin(@time/300)*.35

		@position.x += (@target.position.x + Math.cos(angle)*radius - @position.x )*.05
		@position.y += (@target.position.y + Math.sin(angle)*radius - @position.y )*.05

		@scale.x += (Math.sin(@time/400)*.05+.45-@scale.x)
		@scale.y += (Math.sin(@time/400)*.05+.45-@scale.y)

		dx = @target.position.x - @position.x
		dy = @target.position.y - @position.y
		@rotation += (Math.atan2(dy,dx)+Constant.MPI2-@rotation)*0.15
		return

	dispose:()=>
		if !@destroying
			@destroying = true
			TweenLite.to(@,.5,{alpha:0,onComplete:()=>
				idx = @parent.observers.indexOf(@)
				@parent.observers.splice(idx,1)
				@parent.removeChild(@)
			})
			return
