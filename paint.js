$(document).bind("mobileinit", function(evt) {
  return $.mobile.loadingMessage = "Sending your drawing.";
});
$(function() {
  var $canvas, COLORS, canvas, canvas_height, canvas_pos, canvas_width, clear_drawing, color_set, color_val, ctx, draw_on, draw_points, email_field, image_data_field, linecap_set, linejoin_set, random_color, random_color_picker, redraw, supports_to_data_url;
  $.mobile.silentScroll(0);
  $canvas = $("#paint_canvas");
  canvas_width = $canvas.attr("width");
  canvas_height = $canvas.attr("height");
  image_data_field = $("input#image_data");
  email_field = $("input#email");
  canvas = document.getElementById("paint_canvas");
  ctx = canvas.getContext("2d");
  draw_points = [];
  draw_on = false;
  COLORS = {
    "red": "#cf3333",
    "green": "#33cf33",
    "blue": "#3333cf"
  };
  color_set = $("input[name='color']");
  linejoin_set = $("input[name='linejoin']");
  linecap_set = $("input[name='linecap']");
  color_val = function(pct) {
    return parseInt(pct * 255 / 100);
  };
  supports_to_data_url = function() {
    return canvas.toDataURL("image/png").indexOf("data:image/png") === 0;
  };
  if (!supports_to_data_url()) {
    $(".send_drawing").hide();
    $("#save_drawing}").hide();
  }
  $canvas.bind("mouseup mouseleave touchend", function(evt) {
    evt.preventDefault();
    return draw_on = false;
  });
  canvas_pos = function(evt, dragging) {
    var alpha_val, blue_val, green_val, pageX, pageY, props, red_val, target_touches;
    if (dragging == null) {
      dragging = false;
    }
    target_touches = evt.originalEvent.targetTouches;
    if (target_touches != null) {
      pageX = target_touches[0].pageX;
      pageY = target_touches[0].pageY;
    } else {
      pageX = evt.pageX;
      pageY = evt.pageY;
    }
    red_val = color_val($("#slider_red").val());
    green_val = color_val($("#slider_green").val());
    blue_val = color_val($("#slider_blue").val());
    alpha_val = (100 - $("#transparency_slider").val()) / 100;
    props = {
      'x': pageX - canvas.offsetLeft,
      'y': pageY - canvas.offsetTop,
      'dragging': dragging,
      'color': "rgba(" + red_val + ", " + green_val + ", " + blue_val + ", " + alpha_val + ")",
      'width': $("#width_slider").val(),
      'linejoin': linejoin_set.filter(":checked").val(),
      'linecap': linecap_set.filter(":checked").val()
    };
    return props;
  };
  $canvas.bind("mousedown mousemove touchstart touchmove", function(evt) {
    var start_draw;
    evt.preventDefault();
    start_draw = evt.type.indexOf("move") === -1;
    draw_on = draw_on || start_draw;
    if (draw_on) {
      draw_points.push(canvas_pos(evt, !start_draw));
      return redraw();
    }
  });
  $("#save_drawing").click(function(evt) {
    $.mobile.pageLoading(false);
    return $.post("submit.php", {
      'image_data': canvas.toDataURL(),
      'email': email_field.val()
    }, function(data) {
      var image_url;
      image_url = data.image_url;
      if (image_url != null) {
        $("#image_url").text(image_url);
      }
      return $.mobile.pageLoading(true);
    }, "json");
  });
  clear_drawing = $("#clear_drawing").click(function(evt) {
    evt.preventDefault();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas_width, canvas_height);
    return draw_points = [];
  });
  random_color = function() {
    return Math.floor(Math.random() * 101);
  };
  random_color_picker = $("a#random_color").click(function(evt) {
    evt.preventDefault();
    return $(".color_slider").each(function(i, el) {
      return $(el).val(random_color()).trigger("change");
    });
  });
  $(window).load(function(evt) {
    return random_color_picker.trigger("click");
  });
  redraw = function() {
    var last_p, p, _i, _len, _results;
    last_p = null;
    _results = [];
    for (_i = 0, _len = draw_points.length; _i < _len; _i++) {
      p = draw_points[_i];
      ctx.beginPath();
      ctx.strokeStyle = p['color'];
      ctx.lineWidth = p['width'];
      ctx.lineJoin = p['linejoin'];
      ctx.lineCap = p['linecap'];
      if (p['dragging'] && (last_p != null)) {
        ctx.moveTo(last_p.x, last_p.y);
      } else {
        ctx.moveTo(p.x - 1, p.y - 1);
      }
      ctx.lineTo(p.x, p.y);
      ctx.closePath();
      ctx.stroke();
      _results.push(last_p = p);
    }
    return _results;
  };
  $("a#settings_back_button").click(function(evt) {
    evt.preventDefault();
    return $.mobile.changePage("#home", "slide", true, true);
  });
  if (window.localStorage != null) {
    return email_field.val(window.localStorage['email'] || '').bind("click keyup blur focus", function(evt) {
      return window.localStorage['email'] = email_field.val();
    });
  }
});