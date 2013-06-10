<?php
try {
	$q = $_SERVER['QUERY_STRING'];
	$q = str_replace("-eq-", "=", $q);
	$qa = explode("/", $q);
} catch(Exception $e) {
	die(json_encode(array("500")));
}
if($qa[0] == 'prefs') {
	$t = "Prefs";
	$c = "There are no prefs!";
}
else $c = "404";

die(json_encode(array("title" => $t, "data" => $c)));