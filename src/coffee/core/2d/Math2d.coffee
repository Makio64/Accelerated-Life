class Math2d

	# The distance optimized formula wihout square, use it for comparaison
	@distance = (v1, v2)->
		dx = (v2.x-v1.x)
		dy = (v2.y-v1.y)
		return dx*dx + dy*dy
	
	# The real 2d distance
	@distanceSqrt = (v1, v2)->
		dx = (v2.x-v1.x)
		dy = (v2.y-v1.y)
		return Math.sqrt(dx*dx + dy*dy)