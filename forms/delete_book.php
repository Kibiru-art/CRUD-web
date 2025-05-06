<?php
// Ensure the request method is DELETE
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
  // Get the raw POST data
  $data = json_decode(file_get_contents('php://input'), true);
  
  // Check if 'id' exists in the decoded data
  if (isset($data['id'])) {
    $bookId = $data['id'];
    
    // Establish connection to the database
    $servername = "localhost";
    $username = "root";  // Change to your database username
    $password = "";      // Change to your database password
    $dbname = "my_library";  // Change to your database name

    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check if connection is successful
    if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
    }

    // Prepare and execute the delete query
    $sql = "DELETE FROM books WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $bookId); // 'i' means integer
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
      // Return success response
      echo json_encode(['success' => true, 'message' => 'Book deleted successfully!']);
    } else {
      // Return error if no rows were affected (book not found or already deleted)
      echo json_encode(['success' => false, 'message' => 'Failed to delete book.']);
    }

    $stmt->close();
    $conn->close();
  } else {
    // Return error if no ID is provided
    echo json_encode(['success' => false, 'message' => 'Book ID not provided']);
  }
} else {
  echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
