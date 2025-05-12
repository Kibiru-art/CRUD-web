document.addEventListener('DOMContentLoaded', () => {
  let books = [];
  let editingBookId = null;

  const navLinks = document.querySelectorAll('.nav-link');
  const sections = {
    home: document.getElementById('homeSection'),
    library: document.getElementById('librarySection'),
    add: document.getElementById('addBookSection')
  };

  const bookForm = document.getElementById('bookForm');
  const bookList = document.getElementById('bookList');
  const emptyLibraryMessage = document.getElementById('emptyLibraryMessage');

  const bookInputs = {
    title: document.getElementById('title'),
    author: document.getElementById('author'),
    genre: document.getElementById('genre'),
    status: document.getElementById('status'),
    cover: document.getElementById('cover')
  };

  document.getElementById("filterAll").addEventListener("click", () => {
    displayBooksByStatus("All");
    setActiveFilter("filterAll");
  });
  document.getElementById("filterRead").addEventListener("click", () => {
    displayBooksByStatus("Read");
    setActiveFilter("filterRead");
  });
  document.getElementById("filterUnread").addEventListener("click", () => {
    displayBooksByStatus("Unread");
    setActiveFilter("filterUnread");
  });

  function setActiveFilter(activeId) {
    ["filterAll", "filterRead", "filterUnread"].forEach(id => {
      document.getElementById(id).classList.remove("active");
    });
    document.getElementById(activeId).classList.add("active");
  }

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

  function showAlert(id) {
    const alert = document.getElementById(id);
    alert.style.display = 'block';
    setTimeout(() => alert.style.display = 'none', 3000);
  }

  function createBookCard(book) {
    const col = document.createElement('div');
    col.className = 'col-sm-6 col-md-4 col-lg-3 mb-3';
    col.dataset.id = book.id;

    col.innerHTML = `
      <div class="card h-100">
        <img src="${book.cover}" class="card-img-top img-fluid" style="max-height: 200px; object-fit: contain;" />
        <div class="card-body">
          <h5 class="card-title">${book.title}</h5>
          <p class="card-text">Author: ${book.author}</p>
          <p class="card-text">Genre: ${book.genre}</p>
          <span class="badge bg-${book.status === "Read" ? "success" : "warning"}">${book.status}</span>
        </div>
        <div class="card-footer d-flex justify-content-between">
          <button class="btn btn-sm btn-outline-primary edit-btn">Edit</button>
          <button class="btn btn-sm btn-outline-danger delete-btn">Delete</button>
        </div>
      </div>
    `;
    return col;
  }

  function displayBooksByStatus(status) {
    const filtered = status === "All" ? books : books.filter(book => book.status === status);
    bookList.innerHTML = '';
    filtered.forEach(book => bookList.appendChild(createBookCard(book)));
    updateEmptyLibraryMessage();
  }

  function loadBooks() {
    fetch('http://localhost/my_library/books.php')
      .then(res => res.json())
      .then(data => {
        books = data;
        updateCounters();
        displayBooksByStatus("All");
      })
      .catch(err => console.error('Fetch error:', err));
  }

  // Navigation
  ['home', 'library', 'add'].forEach(section => {
    document.getElementById(`nav-${section}`).addEventListener('click', e => {
      e.preventDefault();
      showSection(section);
      if (section === 'library') loadBooks();
    });
  });

  // Filter cards
  const filterMapping = {
    cardTotal: "All",
    cardRead: "Read",
    cardUnread: "Unread"
  };

  Object.keys(filterMapping).forEach(cardId => {
    document.getElementById(cardId).addEventListener('click', () => {
      displayBooksByStatus(filterMapping[cardId]);
      showSection("library");
    });
  });

  // Book form submit
  bookForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const book = {
      title: bookInputs.title.value.trim(),
      author: bookInputs.author.value.trim(),
      genre: bookInputs.genre.value.trim(),
      status: bookInputs.status.value,
      cover: bookInputs.cover.value.trim() || 'https://via.placeholder.com/150x200'
    };

    if (editingBookId) book.id = editingBookId;

    fetch(editingBookId ? 'http://localhost/my_library/update_book.php' : 'http://localhost/my_library/books.php', {
      method: editingBookId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showAlert(editingBookId ? 'editAlert' : 'addAlert');
        bookForm.reset();
        editingBookId = null;
        loadBooks();
        showSection('library');
      } else {
        alert(data.message || 'Failed to save book.');
      }
    })
    .catch(err => {
      console.error('Error:', err);
      alert('Could not connect to the server.');
    });
  });

  // Edit/Delete actions with confirmation
  bookList.addEventListener('click', function (e) {
    const btn = e.target;
    const col = btn.closest('[data-id]');
    const bookId = col.dataset.id;

    if (btn.classList.contains('delete-btn')) {
      const confirmDelete = confirm("Are you sure you want to delete this book?");
      if (confirmDelete) {
        fetch('http://localhost/my_library/delete_book.php', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: bookId })
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            col.remove();
            books = books.filter(b => b.id !== bookId);
            updateCounters();
            updateEmptyLibraryMessage();
            showAlert('deleteAlert');
          } else {
            alert(data.message || 'Deletion failed.');
          }
        });
      }
    }

    if (btn.classList.contains('edit-btn')) {
      const card = col.querySelector('.card');
      editingBookId = bookId;
      bookInputs.title.value = card.querySelector('.card-title').innerText;
      bookInputs.author.value = card.querySelectorAll('.card-text')[0].innerText.replace('Author: ', '');
      bookInputs.genre.value = card.querySelectorAll('.card-text')[1].innerText.replace('Genre: ', '');
      bookInputs.status.value = card.querySelector('.badge').innerText;
      bookInputs.cover.value = card.querySelector('img').src;
      showSection('add');
    }
  });

  // Initial setup
  showSection('home');
  loadBooks();
});
