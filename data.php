<?php
$value = $_POST['value'];

$file = 'sound.txt';
$content = file_get_contents($file);
$file_put_contents($file, $value . '.' . $content);