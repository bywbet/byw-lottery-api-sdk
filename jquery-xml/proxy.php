<?php
$src=$_GET['src'];
$str = file_get_contents(urldecode($src));
echo $str;
?>