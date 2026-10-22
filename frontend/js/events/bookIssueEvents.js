import { issueBook } from '../api/bookIssueApi.js'
import { issueForm } from '../dom/bookIssueDom.js'

export const setupBookIssueEvents = (refresh) => {
    issueForm.addEventListener('submit' , async(event) => {
        event.preventDefault()

        const formData = new FormData(issueForm)

        const bookIssueData = {
            bookId : formData.get('bookId').trim(),
            userId : formData.get('memberId').trim(),
            issueDate : formData.get('issueDate'),
            dueDate : formData.get('dueDate')
        }

        try {
            await issueBook(bookIssueData)

            issueForm.reset()

            await refresh()
        }
        catch (err) {
            console.error(err.message)
            document.getElementById('issue-form-error').textContent = err.message

            setTimeout(() => {
                document.getElementById('issue-form-error').textContent = ""
            } , 5000)
        }
    })
}