document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = {
      home: document.getElementById('homeSection'),
      library: document.getElementById('librarySection'),
      add: document.getElementById('addBookSection')
    };

    document.getElementById("bookForm").addEventListener("submit", function(event) {
        event.preventDefault();
      
        const book = {
          title: document.getElementById("bookTitle").value,
          author: document.getElementById("bookAuthor").value,
          genre: document.getElementById("bookGenre").value,
          status: document.getElementById("bookStatus").value,
          cover: document.getElementById("bookCover").value || "https://via.placeholder.com/150x200"
        };
      
        fetch("http://localhost/my_library/books.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(book)
        })
        .then(response => response.json())
        .then(data => {
          console.log("Add Book Response:", data); // Debug log
      
          if (data.success) {
            alert("Book added successfully!");
            document.getElementById("bookForm").reset();
            fetchBooks(); // Refresh library
            showSection("librarySection"); // Optional: switch to library view
          } else {
            alert("Failed to add book.");
          }
        })
        .catch(error => {
          console.error("Error adding book:", error);
          alert("Error adding book. Check console.");
        });
      });
      
  
    const bookForm = document.getElementById('bookForm');
    const bookList = document.getElementById('bookList');
    const emptyLibraryMessage = document.getElementById('emptyLibraryMessage');
    let books = [];
  
    function showSection(selected) {
      for (let key in sections) {
        sections[key].style.display = key === selected ? 'block' : 'none';
      }
  
      navLinks.forEach(link => link.classList.remove('active'));
      document.getElementById(`nav-${selected}`).classList.add('active');
    }
  
    function updateCounters() {
      const total = books.length;
      const read = books.filter(book => book.status === "Read").length;
      const unread = total - read;
  
      document.getElementById("totalBooks").innerText = total;
      document.getElementById("readBooks").innerText = read;
      document.getElementById("unreadBooks").innerText = unread;
    }
  
    function updateEmptyLibraryMessage() {
      emptyLibraryMessage.style.display = books.length === 0 ? 'block' : 'none';
    }
  
    function createBookCard(book) {
      const col = document.createElement('div');
      col.className = 'col-sm-6 col-md-4 col-lg-3 mb-3';
  
      col.innerHTML = `
        <div class="card h-100">
          <img src="${book.cover}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="Book Cover" />
          <div class="card-body">
            <h5 class="card-title">${book.title}</h5>
            <p class="card-text">Author: ${book.author}</p>
            <p class="card-text">Genre: ${book.genre}</p>
            <span class="badge bg-${book.status === "Read" ? "success" : "warning"}">${book.status}</span>
          </div>
        </div>
      `;
  
      return col;
    }
  
    function showAlert(alertId) {
      const alert = document.getElementById(alertId);
      alert.style.display = 'block';
      setTimeout(() => {
        alert.style.display = 'none';
      }, 3000);
    }
  
    function loadBooks() {
      fetch('http://localhost/my_library/books.php')
        .then(response => response.json())
        .then(data => {
          books = data;
          bookList.innerHTML = '';
          books.forEach(book => {
            bookList.appendChild(createBookCard(book));
          });
          updateCounters();
          updateEmptyLibraryMessage();
        })
        .catch(error => console.error('Error loading books:', error));
    }
  
    bookForm.addEventListener('submit', e => {
      e.preventDefault();
  
      const title = document.getElementById('title').value.trim();
      const author = document.getElementById('author').value.trim();
      const genre = document.getElementById('genre').value.trim();
      const status = document.getElementById('status').value;
      const cover = document.getElementById('cover').value.trim() || 'https://via.placeholder.com/150x200';
  
      const book = { title, author, genre, status, cover };
  
      fetch('http://localhost/my_library/books.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(book)
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          showAlert('addAlert');
          bookForm.reset();
          loadBooks();
          showSection('library');
        } else {
          console.error(data.error);
        }
      });
    });

    function fetchBooks() {
        fetch('http://localhost/my_library/books.php')
          .then(response => response.json())
          .then(data => {
            console.log("Fetched books:", data); // Debugging log
      
            const bookList = document.getElementById("bookList");
            const emptyMessage = document.getElementById("emptyLibraryMessage");
      
            bookList.innerHTML = "";
      
            if (data.length === 0) {
              emptyMessage.style.display = "block";
              return;
            }
      
            emptyMessage.style.display = "none";
      
            data.forEach(book => {
              const col = document.createElement("div");
              col.className = "col-md-4";
              col.innerHTML = `
                <div class="card mb-4">
                  <img src="${book.cover}" class="card-img-top" alt="Cover Image" />
                  <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <p class="card-text">Author: ${book.author}</p>
                    <p class="card-text">Genre: ${book.genre}</p>
                    <p class="card-text">Status: ${book.status}</p>
                  </div>
                </div>
              `;
              bookList.appendChild(col);
            });
          })
          .catch(error => {
            console.error("Error fetching books:", error);
          });
      }
      
  
    // Navigation button listeners
    document.getElementById('nav-home').addEventListener('click', e => {
      e.preventDefault();
      showSection('home');
    });
  
    document.getElementById('nav-library').addEventListener('click', e => {
      e.preventDefault();
      showSection('library');
      loadBooks();
    });
  
    document.getElementById('nav-add').addEventListener('click', e => {
      e.preventDefault();
      showSection('add');
    });
  
    // Initial load
    showSection('home');
    loadBooks();
  });
  