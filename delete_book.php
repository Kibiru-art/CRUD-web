<?php
header("Content-Type: application/json");
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "my_library";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
  parse_str(file_get_contents("php://input"), $data);
  $id = intval($data["id"]);

  $sql = "DELETE FROM books WHERE id = $id";
  if ($conn->query($sql)) {
    echo json_encode(["success" => true]);
  } else {
    echo json_encode(["success" => false, "message" => $conn->error]);
  }
}
?>
