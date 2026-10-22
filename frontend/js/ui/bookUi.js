
export const renderTotalNoBooks = (totalBooks , totalBookEl) => {
    totalBookEl.textContent = totalBooks
}

export function renderBooks(books, booksTableBody) {
    booksTableBody.replaceChildren();

    books.forEach(book => {
        const row = document.createElement("tr");

        const values = [
            book.book_id,
            book.book_name,
            book.author,
            book.isbn,
            book.total_copies,
            book.available_books
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value ?? "";
            row.appendChild(cell);
        });

        const actions = document.createElement("td");
        actions.className = "actions";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "btn-edit";
        editButton.dataset.id = book.book_id;
        editButton.textContent = "Edit";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "btn-delete";
        deleteButton.dataset.id = book.book_id;
        deleteButton.textContent = "Delete";

        actions.append(editButton, deleteButton);
        row.appendChild(actions);
        booksTableBody.appendChild(row);
    });
}



// Modals

export const openEditModal = (book , modal , form) => {
    form.elements.book_id.value = book.book_id;
    form.elements.book_name.value = book.book_name;
    form.elements.author.value = book.author;
    form.elements.isbn.value = book.isbn;
    form.elements.total_copies.value = book.total_copies;

    modal.hidden = false
}

export const closeEditModal = (model , form) => {
    form.reset()

    model.hidden = true
}