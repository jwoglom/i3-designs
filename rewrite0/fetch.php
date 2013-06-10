<?php
$u = $_SERVER['QUERY_STRING'];
echo file_get_contents($u);
?>