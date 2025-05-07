<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// DB connection
$host = "localhost";
$dbname = "my_library";
$username = "root"; // or your DB user
$password = "";     // your DB password

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
  exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $sql = "SELECT * FROM books ORDER BY id DESC";
  $result = $conn->query($sql);

  $books = [];
  while ($row = $result->fetch_assoc()) {
    $books[] = $row;
  }

  echo json_encode($books);
  exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $data = json_decode(file_get_contents("php://input"));

  if (
    !isset($data->title) ||
    !isset($data->author) ||
    !isset($data->genre) ||
    !isset($data->status)
  ) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid input"]);
    exit();
  }

  $title = $conn->real_escape_string($data->title);
  $author = $conn->real_escape_string($data->author);
  $genre = $conn->real_escape_string($data->genre);
  $status = $conn->real_escape_string($data->status);
  $cover = $conn->real_escape_string($data->cover ?? 'https://via.placeholder.com/150x200');

  $sql = "INSERT INTO books (title, author, genre, status, cover) VALUES ('$title', '$author', '$genre', '$status', '$cover')";

  if ($conn->query($sql)) {
    echo json_encode(["success" => true]);
  } else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to insert book"]);
  }

  exit();
}
?>
