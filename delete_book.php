<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include 'db.php'; // ✅ Include shared DB connection

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  $data = json_decode(file_get_contents('php://input'), true);

  if (isset($data['id'])) {
    $bookId = $data['id'];

    $sql = "DELETE FROM books WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $bookId);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
      echo json_encode(['success' => true, 'message' => 'Book deleted successfully!']);
    } else {
      echo json_encode(['success' => false, 'message' => 'Failed to delete book.']);
    }

    $stmt->close();
    $conn->close();
  } else {
    echo json_encode(['success' => false, 'message' => 'Book ID not provided']);
  }
} else {
  echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
