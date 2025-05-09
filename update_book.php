<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include 'db.php'; // ✅ Include shared DB connection

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
  $data = json_decode(file_get_contents("php://input"));

  if (
    !isset($data->id) ||
    !isset($data->title) ||
    !isset($data->author) ||
    !isset($data->genre) ||
    !isset($data->status)
  ) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit();
  }

  $id = (int)$data->id;
  $title = $conn->real_escape_string($data->title);
  $author = $conn->real_escape_string($data->author);
  $genre = $conn->real_escape_string($data->genre);
  $status = $conn->real_escape_string($data->status);
  $cover = $conn->real_escape_string($data->cover ?? 'https://via.placeholder.com/150x200');

  $sql = "UPDATE books SET title='$title', author='$author', genre='$genre', status='$status', cover='$cover' WHERE id=$id";

  if ($conn->query($sql)) {
    echo json_encode(["success" => true, "message" => "Book updated successfully"]);
  } else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to update book"]);
  }

  exit();
}

http_response_code(405);
echo json_encode(["success" => false, "message" => "Invalid request method"]);
?>
