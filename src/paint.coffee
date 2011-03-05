$(document).bind "mobileinit", (evt) ->
	$.mobile.loadingMessage = "Sending your drawing."
	
$ ->
	$.mobile.silentScroll 0
	
	$canvas = $("#paint_canvas")
	canvas_width = $canvas.attr("width")
	canvas_height = $canvas.attr("height")
	
	canvas = document.getElementById("paint_canvas")
	ctx = canvas.getContext("2d")
	draw_points = []
	draw_on = false
	
	
	COLORS = "red": "#cf3333", "green": "#33cf33", "blue": "#3333cf"
	color_set = $("input[name='color']")
	
	#width_slider = null
	
	linejoin_set = $("input[name='linejoin']")
	
	linecap_set = $("input[name='linecap']")
	
	
	color_val = (pct) -> parseInt(pct * 255 / 100)
	
	
	supports_to_data_url = ->
		canvas.toDataURL("image/png").indexOf("data:image/png") is 0
	
	if not supports_to_data_url()
		$(".send_drawing").hide()
		$("#save_drawing}").hide()

	
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
			
		red_val = color_val($("#slider_red").val())
		green_val = color_val($("#slider_green").val())
		blue_val = color_val($("#slider_blue").val())
		alpha_val = (100 - $("#transparency_slider").val())/100
			
		props =
			'x': pageX - canvas.offsetLeft,
			'y': pageY - canvas.offsetTop,
			'dragging': dragging,
			'color': "rgba(#{red_val}, #{green_val}, #{blue_val}, #{alpha_val})"
			'width': $("#width_slider").val(),
			'linejoin': linejoin_set.filter(":checked").val()
			'linecap': linecap_set.filter(":checked").val()
		
		return props
	
	
	$canvas.bind "mousedown mousemove touchstart touchmove", (evt) ->
		evt.preventDefault()
		
		start_draw = evt.type.indexOf("move") is -1
		draw_on = draw_on or start_draw
		
		if draw_on
			draw_points.push(canvas_pos(evt, not start_draw))
			redraw()
	
	
	image_data_field = $("input#image_data")
	email_field = $("input#email")
	$("#save_drawing").click (evt) ->
		$.mobile.pageLoading(false)

		$.post "submit.php",
			{'image_data': canvas.toDataURL(), 'email': email_field.val()},
			(data) ->
				image_url = data.image_url
				if image_url?
					$("#image_url").text(image_url)
					
				$.mobile.pageLoading(true)

			, "json"
	
	
	clear_drawing = $("#clear_drawing").click (evt) ->
		evt.preventDefault()
	
		ctx.fillStyle = "#ffffff"
		ctx.fillRect 0, 0, canvas_width, canvas_height
		draw_points = []
	
	random_color = -> Math.floor(Math.random() * 101)
	
	random_color_picker = $("a#random_color").click (evt) ->
		evt.preventDefault()
		$(".color_slider").each (i, el) ->
			$(el).val(random_color()).trigger("change")
	
	$(window).load (evt) ->
		random_color_picker.trigger("click")
	
	redraw = ->
		last_p = null
		for p in draw_points
			ctx.beginPath()
			
			ctx.strokeStyle = p['color']
			ctx.lineWidth = p['width']
			ctx.lineJoin = p['linejoin']
			ctx.lineCap = p['linecap']
			
			if p['dragging'] and last_p?
				ctx.moveTo(last_p.x, last_p.y)
			else
				ctx.moveTo(p.x - 1, p.y - 1)
			ctx.lineTo(p.x, p.y)
			ctx.closePath()
			ctx.stroke()
			
			last_p = p
			

	$("a#settings_back_button").click (evt) ->
		evt.preventDefault()
		$.mobile.changePage("#home", "slide", true, true)