<?php
$value = $_POST['alarm'];

$settings = fopen('settings.json', 'w+') or die("can't open file");

fwrite($settings, '{"alarm": "' . $value . '"}');
 
header("Location: instellingen.php");