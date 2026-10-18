import { createBook , getBookById , updateBook , deleteBook } from "../api/bookApi.js";
import { openEditModal , closeEditModal } from "../ui/bookUi.js"
import { bookForm, editBookModal , editBookForm , booksTableBody, 
     searchInput , availabilityFilter } from "../dom/bookDom.js";

let search = ''
let availability = ''

export function setupBookEvents(applyBookFilters , refresh) {

    // add book
    bookForm.addEventListener("submit", async event => {
        event.preventDefault();

        const formData = new FormData(bookForm);

        const bookData = {
            bookName: formData.get("book_name")?.trim(),
            author: formData.get("author")?.trim(),
            isbn: formData.get("isbn")?.trim(),
            totalCopies: Number(formData.get("total_copies"))
        };

        try {
            await createBook(bookData);

            bookForm.reset()

            await refresh();

        } catch (err) {
            console.error("Failed to add book:", err.message);
            document.querySelector('#add-book-form #error').textContent = err.message;

            setTimeout(() => {
                document.querySelector('#add-book-form #error').textContent = ""
            } , 5000)
        }
    });

    // Edit book
    booksTableBody.addEventListener('click' , async (event) => {
        const editButton = event.target.closest('.btn-edit')

        if (!editButton) return;

        const id = editButton.dataset.id

        try {
            const book = await getBookById(id)

            openEditModal(book , editBookModal , editBookForm)
        }
        catch (err) {
            console.error("Failed to fetch book:", err.message);
            document.querySelector('.modal-content #error').textContent = err.message;

            setTimeout(() => {
                document.querySelector('.modal-content #error').textContent = ""
            } , 5000)
        }
    })

    // Save book
    editBookForm.addEventListener('submit' , async (event) => {
        event.preventDefault()

        const formData = new FormData(editBookForm);
        const id = formData.get("book_id");

        const bookData = {
            bookName: formData.get("book_name").trim(),
            author: formData.get("author").trim(),
            isbn: formData.get("isbn").trim(),
            totalCopies: Number(formData.get("total_copies"))
        };

        try {
            await updateBook(bookData , id)

            closeEditModal(editBookModal, editBookForm);
            await refresh()
        }
        catch (err) {
            console.error("Failed to update book:", err.message);
            document.querySelector('.modal-content #error').textContent = err.message;

            setTimeout(() => {
                document.querySelector('.modal-content #error').textContent = ""
            } , 5000)
        }
    })


    // Cancel book
    document.getElementById('cancel-edit')
    .addEventListener('click' , () => {
        closeEditModal(editBookModal, editBookForm);
    })

    // delete book

    booksTableBody.addEventListener('click' , async (event) => {
        const deleteButton = event.target.closest('.btn-delete')

        if (!deleteButton) return

        const id = deleteButton.dataset.id

        try {
            await deleteBook(id)

            await refresh()
        }
        catch (err) {
            console.error(err.message)
            alert(err.message)
        }
    })


    // Search books

    searchInput.addEventListener('input' , async() => {
        search = searchInput.value.trim()

        await applyBookFilters(search , availability)
    })

    // Apply Filters

    availabilityFilter.addEventListener('change' , async() => {
        availability = availabilityFilter.value

        await applyBookFilters(search , availability)
    })
}
