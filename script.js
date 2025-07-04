const API_URL = 'http://localhost:3000/books';
const container = document.getElementById('bookContainer');
const searchBar = document.getElementById('searchBar');
const genreFilter = document.getElementById('genreFilter');
const themeToggle = document.getElementById('themeToggle');

async function fetchBooks() {
  const res = await fetch(API_URL);
  const books = await res.json();
  displayBooks(books);
}


// LOGIN
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      document.getElementById("authMessage").innerText = "Logged in successfully!";
    })
    .catch(error => {
      document.getElementById("authMessage").innerText = error.message;
    });
}

// SIGN UP
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      document.getElementById("authMessage").innerText = "Account created successfully!";
    })
    .catch(error => {
      document.getElementById("authMessage").innerText = error.message;
    });
}

// LOGOUT
function logout() {
  firebase.auth().signOut().then(() => {
    document.getElementById("authMessage").innerText = "Logged out.";
  });
}

// Listen to auth state changes
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    document.getElementById("authMessage").innerText = `Welcome, ${user.email}`;
  } else {
    console.log("No user signed in.");
  }
});
// Render books
function displayBooks(books) {
  container.innerHTML = '';
  if (books.length === 0) {
    container.innerHTML = '<p>No books found.</p>';
    return;
  }

  books.forEach(book => {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';

    bookCard.innerHTML = `
      <img src="${book.cover}" alt="${book.title}" />
      <h2>${book.title}</h2>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Genre:</strong> ${book.genre}</p>
      <p>${book.description}</p>
    `;
    container.appendChild(bookCard);
  });
}

// Search by title
searchBar.addEventListener('input', async (e) => {
  const query = e.target.value.toLowerCase();
  const res = await fetch(API_URL);
  const books = await res.json();
  const filtered = books.filter(book =>
    book.title.toLowerCase().includes(query)
  );
  displayBooks(filtered);
});

// Filter by genre
genreFilter.addEventListener('change', async (e) => {
  const selected = e.target.value;
  const res = await fetch(API_URL);
  let books = await res.json();

  if (selected !== 'all') {
    books = books.filter(book => book.genre === selected);
  }

  displayBooks(books);
});

// Toggle light/dark mode
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
// Function to render a book card
function renderBook(book) {
  const bookCard = document.createElement('div');
  bookCard.className = 'book-card';

  bookCard.innerHTML = `
    <img src="${book.cover}" alt="${book.title}" class="book-cover" />
    <h3>${book.title}</h3>
    <p>by ${book.author}</p>
    <p><strong>Genre:</strong> ${book.genre}</p>
    <p><strong>Price:</strong> $${book.price.toFixed(2)}</p>
  `;

  document.querySelector('#book-list').appendChild(bookCard);
}

fetchBooks();
