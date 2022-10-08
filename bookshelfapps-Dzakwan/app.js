const book = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";




function addBook() {
  const textBook = document.getElementById("inputBookTitle").value;
  const textAuthor = document.getElementById("inputBookAuthor").value;
  const textYear = document.getElementById("inputBookYear").value;
  const textComplate = document.getElementById("inputBookIsComplete").checked;

  const generatedID = generateId();
  const objectBook = generateBookObject(
    generatedID,
    textBook,
    textAuthor,
    textYear,
    textComplate
  );
  book.push(objectBook);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitBook = document.getElementById("inputBook");
  submitBook.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function generateId() {
  return +new Date();
}

const textComplate = document.getElementById("inputBookIsComplete");
textComplate.addEventListener("change", function () {
  const completed = document.getElementById("done");
  if (textComplate.checked) {
    completed.innerText = "Sudah Selesai Dibaca";
  } else {
    completed.innerText = "Belum Selesai Dibaca";
  }
});

function checked() {
  if (textComplate.checked) {
    return true;
  }
  return false;
}

function generateBookObject(id, textBook, textAuthor, textYear, textComplate) {
  return {
    id,
    textBook,
    textAuthor,
    textYear,
    textComplate,
  };
}

function findBookIndex(bookId) {
  for (const index in book) {
    if (book[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function findBook(bookid) {
  for (const bookItem of book) {
    if (bookItem.id === bookid) {
      return bookItem;
    }
  }
  return null;
}



function makeBook(objectBook) {
  const textJudul = document.createElement("h3");
  textJudul.innerText = objectBook.textBook;

  const textPenulis = document.createElement("p");
  textPenulis.innerText = "Penulis : " + objectBook.textAuthor;

  const textYear = document.createElement("p");
  textYear.innerText = "Tahun terbit : " + objectBook.textYear;
  //========================================================
  const textContainer = document.createElement("div");
  textContainer.classList.add("book_item");
  textContainer.append(textJudul, textPenulis, textYear);

  const container = document.createElement("div");
  container.classList.add("this_book");
  container.append(textContainer);
  container.setAttribute("id", `book-${objectBook.id}`);

  if (objectBook.textComplate) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("green");
    undoButton.innerHTML = "belum selesai";

    undoButton.addEventListener("click", function () {
      undoBookFromCompleted(objectBook.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.innerHTML = "hapus";

    deleteButton.addEventListener("click", function () {
      removeBookFromCompleted(objectBook.id);
    });

    container.append(undoButton, deleteButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("green");
    checkButton.innerHTML = "selesai dibaca";

    checkButton.addEventListener("click", function () {
      addBookToCompleted(objectBook.id);
    });

    const hapusButton = document.createElement("button");
    hapusButton.classList.add("red");
    hapusButton.innerHTML = "hapus";

    hapusButton.addEventListener("click", function () {
      removeBookFromCompleted(objectBook.id);
    });

    container.append(checkButton, hapusButton);
  }
  return container;
}

function addBookToCompleted(bookid) {
  const bookTarget = findBook(bookid);

  if (bookTarget == null) return;

  bookTarget.textComplate = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  book.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;
  bookTarget.textComplate = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

const isStorageExist = () => {
  if (typeof Storage === "undefined") {
    alert("Browser Anda Tidak Mendukung Web Storage");
    return false;
  }
  return true;
};


function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(book);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

 function loadDataFromStorage() {
        const serializedData = localStorage.getItem(STORAGE_KEY);
        let dataBook = JSON.parse(serializedData);
           
            if (dataBook !== null) {
              for (const objectBook of dataBook) {
                book.push(objectBook);
              }
            }
           
            document.dispatchEvent(new Event(RENDER_EVENT));
          }

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKList = document.getElementById(
    "incompleteBookshelfList"
  );
  uncompletedBOOKList.innerHTML = "";

  const listCompleted = document.getElementById("completeBookshelfList");
  listCompleted.innerHTML = "";

  for (const bookItem of book) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.textComplate) {
      uncompletedBOOKList.append(bookElement);
    } else {
      listCompleted.append(bookElement);
    }
  }
});
