$(document).bind("mobileinit", function(evt) {
  return true;
});
$(function() {
  var $canvas, canvas, canvas_height, canvas_pos, canvas_width, clear_drawing, ctx, draw_on, draw_points, redraw, save_drawing;
  $canvas = $("#paint_canvas");
  canvas_width = $canvas.attr("width");
  canvas_height = $canvas.attr("height");
  canvas = document.getElementById("paint_canvas");
  ctx = canvas.getContext("2d");
  draw_points = [];
  draw_on = false;
  $canvas.bind("mouseup mouseleave touchend", function(evt) {
    evt.preventDefault();
    return draw_on = false;
  });
  canvas_pos = function(evt, dragging) {
    var pageX, pageY, target_touches;
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
    return {
      'x': pageX - canvas.offsetLeft,
      'y': pageY - canvas.offsetTop,
      'dragging': dragging
    };
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
  save_drawing = $("#save_drawing").bind("click", function(evt) {
    evt.preventDefault();
    return $.post("submit.php", {
      'data': canvas.toDataURL()
    }, function(data) {
      var image_url;
      image_url = data.image_url;
      if (image_url != null) {
        return $("#image_url").text(image_url);
      }
    }, "json");
  });
  clear_drawing = $("#clear_drawing").bind("click", function(evt) {
    evt.preventDefault();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas_width, canvas_height);
    draw_points = [];
    return canvas.width = canvas.width;
  });
  return redraw = function() {
    var last_p, p, _i, _len, _results;
    ctx.strokeStyle = "#df4b26";
    ctx.lineJoin = "round";
    ctx.lineWidth = 5;
    last_p = null;
    _results = [];
    for (_i = 0, _len = draw_points.length; _i < _len; _i++) {
      p = draw_points[_i];
      ctx.beginPath();
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
});