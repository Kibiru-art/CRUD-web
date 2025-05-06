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

if ($_SERVER["REQUEST_METHOD"] === "PUT") {
  $data = json_decode(file_get_contents("php://input"), true);

  $id = intval($data["id"]);
  $title = $conn->real_escape_string($data["title"]);
  $author = $conn->real_escape_string($data["author"]);
  $genre = $conn->real_escape_string($data["genre"]);
  $status = $conn->real_escape_string($data["status"]);
  $cover = $conn->real_escape_string($data["cover"]);

  $sql = "UPDATE books SET 
            title = '$title', 
            author = '$author', 
            genre = '$genre', 
            status = '$status', 
            cover = '$cover' 
          WHERE id = $id";

  if ($conn->query($sql)) {
    echo json_encode(["success" => true]);
  } else {
    echo json_encode(["success" => false, "message" => $conn->error]);
  }
}
?>
