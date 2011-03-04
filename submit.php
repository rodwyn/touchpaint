<?php
header("Content-type: application/json");

$data = $_POST['data'];

$resp = array("image_url" => null);
if (empty($data) === false) {
	$uri = substr($data, strpos($data,",") + 1);

	// put the data to a file
	$t = time();
	$img_loc = "images/img_$t.png";
	$r = file_put_contents($img_loc, base64_decode($uri));
	
	$host = $_SERVER['HTTP_HOST'];
	$path = str_replace('submit.php', '', $_SERVER['REQUEST_URI']);
	$resp['image_url'] = "http://$host$path$img_loc";
}

echo json_encode($resp);
?>