

export const renderTotalNoBooksIssue = 
(noIssuedBooks , noOverdueBooks , noIssuedBooksEl , noOverdueBooksEl) => {
    noIssuedBooksEl.textContent = noIssuedBooks
    noOverdueBooksEl.textContent = noOverdueBooks
}

export const renderIssuedBooks = (issuedBooks , issuedTableBody) => {
    issuedTableBody.replaceChildren();

    issuedBooks.forEach(issue => {
        const row = document.createElement("tr");

        const values = [
            issue.issue_id,
            issue.book_id,
            issue.user_id,
            issue.issue_date,
            issue.due_date
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value ?? "";
            row.appendChild(cell);
        });

        // Status column
        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");

        statusBadge.className = "badge badge-blue";
        statusBadge.textContent = "Issued";

        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        issuedTableBody.appendChild(row);
    });
}
export const renderOverdueBooks = (overdueBooks , overdueTableBody) => {
    overdueTableBody.replaceChildren();

    overdueBooks.forEach(issue => {
        const row = document.createElement("tr");

        const values = [
            issue.issue_id,
            issue.book_id,
            issue.user_id,
            issue.issue_date
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value ?? "";
            row.appendChild(cell);
        });

        // Status column
        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");

        statusBadge.className = "badge badge-red";
        statusBadge.textContent = "Overdue";

        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        overdueTableBody.appendChild(row);
    });
}


export const renderRecentIssuedBooks = (allBooks, recentIssuedTableBody) => {
    recentIssuedTableBody.replaceChildren();

    allBooks.forEach(issue => {
        const row = document.createElement("tr");

        const values = [
            issue.book_name,
            issue.user_name,
            issue.issue_date,
            issue.due_date
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value ?? "";
            row.appendChild(cell);
        });

        // Status column
        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dueDate = new Date(issue.due_date);
        dueDate.setHours(0, 0, 0, 0);

        if (issue.status === "returned") {
            statusBadge.className = "badge badge-green";
            statusBadge.textContent = "Returned";
        } else if (dueDate < today) {
            statusBadge.className = "badge badge-red";
            statusBadge.textContent = "Overdue";
        } else {
            statusBadge.className = "badge badge-blue";
            statusBadge.textContent = "Issued";
        }

        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        recentIssuedTableBody.appendChild(row);
    });
};
