<?php

header("Access-Control-Allow-Origin: *");

$data = file_get_contents("digaaiDataSheet.csv");

echo $data;