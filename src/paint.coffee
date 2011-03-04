$(document).bind "mobileinit", (evt) ->
	true
	
$ ->
	$canvas = $("#paint_canvas")
	canvas_width = $canvas.attr("width")
	canvas_height = $canvas.attr("height")
	
	canvas = document.getElementById("paint_canvas")
	ctx = canvas.getContext("2d")
	draw_points = []
	draw_on = false
	
	
	$canvas.bind "mouseup mouseleave touchend", (evt) ->
		evt.preventDefault()
		draw_on = false
		
	
	canvas_pos = (evt, dragging = false) ->
		target_touches = evt.originalEvent.targetTouches
		if target_touches?
			pageX = target_touches[0].pageX
			pageY = target_touches[0].pageY
		else
			pageX = evt.pageX
			pageY = evt.pageY
			
		{'x': pageX - canvas.offsetLeft, 'y': pageY - canvas.offsetTop, 'dragging': dragging}
	
	
	$canvas.bind "mousedown mousemove touchstart touchmove", (evt) ->
		evt.preventDefault()
		
		start_draw = evt.type.indexOf("move") is -1
		draw_on = draw_on or start_draw
		
		if draw_on
			draw_points.push(canvas_pos(evt, not start_draw))
			redraw()
	
	
	save_drawing = $("#save_drawing").bind "click", (evt) ->
		evt.preventDefault()
		$.post "submit.php",
			{'data': canvas.toDataURL()},
			(data) ->
				image_url = data.image_url
				if image_url?
					$("#image_url").text(image_url)
			, "json"
	
	clear_drawing = $("#clear_drawing").bind "click", (evt) ->
		evt.preventDefault()
	
		ctx.fillStyle = "#ffffff"
		ctx.fillRect 0, 0, canvas_width, canvas_height
		draw_points = []
		canvas.width = canvas.width
	
		
	redraw = ->
		ctx.strokeStyle = "#df4b26"
		ctx.lineJoin = "round"
		ctx.lineWidth = 5
	
		last_p = null
		for p in draw_points
			ctx.beginPath()
			if p['dragging'] and last_p?
				ctx.moveTo(last_p.x, last_p.y)
			else
				ctx.moveTo(p.x - 1, p.y - 1)
			ctx.lineTo(p.x, p.y)
			ctx.closePath()
			ctx.stroke()
			
			last_p = p