#---------------------------------------------------------- Global var

main = null

#---------------------------------------------------------- Class Main

class Main

	dt 				: 0
	lastTime 		: 0
	pause 			: false

	constructor:()->
		@pause = false
		@meter = new FPSMeter()
		@lastTime = Date.now()
		window.focus()
		requestAnimationFrame( @update )
		Stage2d.init()
		SceneTraveler.to(new LoaderScene())
		return

	update:()=>
		@meter.tickStart()
		t = Date.now()
		dt = t - @lastTime
		@lastTime = t

		if @pause then return

		#update logic here
		if SceneTraveler.currentScene		
			SceneTraveler.currentScene.update(dt)

		Stage2d.render()

		requestAnimationFrame( @update )
		@meter.tick()
		return

	resize:()=>
		width 	= window.innerWidth
		height 	= window.innerHeight
		Stage2d.resize()
		SceneTraveler.currentScene.resize()
		return


#---------------------------------------------------------- on Document Ready

document.addEventListener('DOMContentLoaded', ()->
	main = new Main()
	
	window.onblur = (e)->
		main.pause = true
		cancelAnimationFrame(main.update)
		return

	window.onfocus = ()->
		requestAnimationFrame(main.update)
		main.lastTime = Date.now()
		main.pause = false
		return

	window.onresize = ()->
		main.resize()
		return

	return
)