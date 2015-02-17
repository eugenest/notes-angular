<?php

$filename = $_FILES['file']['name'];
$uploadPath = '/var/www/notes/upload/';
$filePath = $uploadPath . $filename;
move_uploaded_file( $_FILES['file']['tmp_name'] , $filePath );