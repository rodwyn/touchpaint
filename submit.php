<?php
header("Content-type: application/json");

$data = $_POST['image_data'];

$resp = array("image_url" => null);
if (empty($data) === false) {
	$uri = substr($data, strpos($data,",") + 1);

	// put the data to a file
	$t = time();
	$img_loc = "images/img_$t.png";
	$r = file_put_contents($img_loc, base64_decode($uri));
	
	$host = $_SERVER['HTTP_HOST'];
	$path = str_replace('submit.php', '', $_SERVER['REQUEST_URI']);
	$resp['image_url'] = $image_url = "http://$host$path$img_loc";
	
	$email = $_POST['email'];
	if (empty($email) === false) {
		$body = "<p>Your image: <a href=\"$image_url\">$image_url</a></p>\n<p><img src=\"$image_url\" /></p>\n";
		$headers  = 'MIME-Version: 1.0' . "\r\n";
		$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
		$headers .= "From: mshafrir@millennialmedia.com\r\nReply-To: mshafrir@millennialmedia.com";
		@mail($email, "Your picture", $body, $headers);
	}
}

echo json_encode($resp);
?>