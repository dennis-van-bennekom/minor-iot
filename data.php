<?php
$value = $_POST['alarm'];
$date = date("D M d Y H:i:s 0");
$file = "sound.txt";
$content = file_get_contents($file);
file_put_contents($file, $date . "-" . $value . "\n" . $content);