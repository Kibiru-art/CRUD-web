<?php
$host = "localhost";
$dbname = "my_library";
$username = "root";
$password = "";

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
  exit();
}
?>
