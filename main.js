const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';
 
function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById('incompleteBookList');
    uncompletedBookList.innerHTML = '';

    const completedBookList = document.getElementById('completeBookList');
    completedBookList.innerHTML = '';
    
    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) 
            uncompletedBookList.append(bookElement);
        else 
          completedBookList.append(bookElement);
  }
});

document.addEventListener('DOMContentLoaded', function () {
    const submitBookForm = document.getElementById('bookForm');
    submitBookForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    })

    if (isStorageExist()) {
      loadDataFromStorage();
    }
});

function addBook() {
    const bookTitle = document.getElementById('bookFormTitle').value;
    const bookAuthor = document.getElementById('bookFormAuthor').value;
    const bookYear = document.getElementById('bookFormYear').value;
    const bookIsComplete = document.getElementById('bookFormIsComplete').checked

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, bookIsComplete);
    books.push(bookObject);
       
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
    window.alert("Kamu menambahkan buku");
};

function generateId() {
    return +new Date();
};
   
function generateBookObject(id, book, author, year, isCompleted) {
    return {
        id,
        book,
        author,
        year,
        isCompleted
    }
};

function makeBook(bookObject) {
    const textBookTitle = document.createElement('h3');
    textBookTitle.innerText = bookObject.book;
    textBookTitle.dataset.testid = 'bookItemTitle';
   
    const textBookAuthor = document.createElement('p');
    textBookAuthor.innerText = `Penulis: ${bookObject.author}`;
    textBookAuthor.dataset.testid = 'bookItemAuthor';

    const textBookYear = document.createElement('p');
    textBookYear.innerText = `Tahun: ${bookObject.year}`;
    textBookYear.dataset.testid = `bookItemYear`

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textBookTitle, textBookAuthor, textBookYear);
    container.setAttribute('data-bookid', bookObject.id);
    container.dataset.testid = 'bookItem';

    if (bookObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.innerText = 'Belum selesai dibaca';
        undoButton.dataset.testid = 'bookItemIsCompleteButton';
     
        undoButton.addEventListener('click', function () {
          undoBookFromCompleted(bookObject.id);
        });
     
        const trashButton = document.createElement('button');
        trashButton.innerText = 'Hapus Buku';
        trashButton.dataset.testid = 'bookItemDeleteButton';
     
        trashButton.addEventListener('click', function () {
          removeBookFromCompleted(bookObject.id);
        });
     
        container.append(undoButton, trashButton);
    } 
    else {
        const checkButton = document.createElement('button');
        checkButton.innerText = 'Selesai dibaca';
        checkButton.dataset.testid = 'bookItemIsCompleteButton';
        
        checkButton.addEventListener('click', function () {
          addBookToCompleted(bookObject.id);
        });
        
        const trashButton = document.createElement('button');
        trashButton.innerText = 'Hapus Buku';
        trashButton.dataset.testid = 'bookItemDeleteButton';
     
        trashButton.addEventListener('click', function () {
          removeBookFromCompleted(bookObject.id);
        });

        container.append(checkButton, trashButton);
      }
   
    return container;
};

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget == null) return;
   
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
    window.alert("Kamu menyelesaikan buku");
};

function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
};

function findBookIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }
   
    return -1;
};

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
   
    if (bookTarget === -1) return;
   
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    window.alert("Kamu menghapus buku");
};
   
   
function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget == null) return;
   
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    window.alert("Kamu belum menyelesaikan buku");
};

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
};

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}