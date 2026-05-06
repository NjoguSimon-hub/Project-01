const container = document.getElementById('bookContainer');
const searchBar = document.getElementById('searchBar');
const genreFilter = document.getElementById('genreFilter');
const themeToggle = document.getElementById('themeToggle');

const BOOKS_DATA = [
  { id: 1, title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', description: "A fantasy novel about Bilbo Baggins' journey.", cover: 'https://covers.openlibrary.org/b/id/6979861-L.jpg', price: 10.99 },
  { id: 2, title: '1984', author: 'George Orwell', genre: 'Dystopian', description: 'A novel about surveillance and totalitarianism.', cover: 'https://covers.openlibrary.org/b/id/153541-L.jpg', price: 8.99 },
  { id: 3, title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Romance', description: 'A romantic novel of manners and marriage.', cover: 'https://covers.openlibrary.org/b/id/8226191-L.jpg', price: 9.99 },
  { id: 4, title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Classic', description: 'A story of racial injustice in the Deep South.', cover: 'https://covers.openlibrary.org/b/id/8228691-L.jpg', price: 7.99 },
  { id: 5, title: 'Brave New World', author: 'Aldous Huxley', genre: 'Dystopian', description: 'A futuristic society of engineered stability.', cover: 'https://covers.openlibrary.org/b/id/8771620-L.jpg', price: 8.99 }
];

let allBooks = BOOKS_DATA;

function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function fetchBooks() {
  displayBooks(allBooks);
}

function displayBooks(books) {
  container.innerHTML = '';
  if (!books.length) {
    container.innerHTML = '<p>No books found.</p>';
    return;
  }

  books.forEach(book => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
      <img src="${sanitize(book.cover)}" alt="${sanitize(book.title)}" class="book-cover" />
      <h3>${sanitize(book.title)}</h3>
      <p>by ${sanitize(book.author)}</p>
      <p><strong>Genre:</strong> ${sanitize(book.genre)}</p>
      <p><strong>Price:</strong> $${parseFloat(book.price).toFixed(2)}</p>
      <p>${sanitize(book.description)}</p>
    `;
    container.appendChild(card);
  });
}

function applyFilters() {
  const query = searchBar.value.toLowerCase();
  const genre = genreFilter.value;

  const filtered = allBooks.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query);
    const matchesGenre = genre === 'all' || book.genre === genre;
    return matchesSearch && matchesGenre;
  });

  displayBooks(filtered);
}

searchBar.addEventListener('input', applyFilters);
genreFilter.addEventListener('change', applyFilters);

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// Firebase Auth
function setAuthMessage(msg) {
  const el = document.getElementById('authMessage');
  if (el) el.innerText = msg;
}

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => setAuthMessage('Logged in successfully!'))
    .catch(err => setAuthMessage(err.message));
}

function signup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => setAuthMessage('Account created successfully!'))
    .catch(err => setAuthMessage(err.message));
}

function logout() {
  firebase.auth().signOut()
    .then(() => setAuthMessage('Logged out.'))
    .catch(err => setAuthMessage(err.message));
}

firebase.auth().onAuthStateChanged(user => {
  setAuthMessage(user ? `Welcome, ${user.email}` : '');
});

// Expose auth functions to HTML onclick handlers
window.login = login;
window.signup = signup;
window.logout = logout;

fetchBooks();
