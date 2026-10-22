

export const renderMembers = (members , membersTableBody) => {
    membersTableBody.replaceChildren();

    members.forEach(member => {
        const row = document.createElement("tr");

        const values = [
            member.user_id,
            member.user_name,
            member.email,
            member.phone_number,
            member.book_issued,
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
        editButton.dataset.id = member.user_id;
        editButton.textContent = "Edit";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "btn-delete";
        deleteButton.dataset.id = member.user_id;
        deleteButton.textContent = "Delete";

        actions.append(editButton, deleteButton);
        row.appendChild(actions);
        membersTableBody.appendChild(row);
    });
}

export const renderTotalNoMembers = (totalMembers , totalNoMembersEl) => {
    totalNoMembersEl.textContent = totalMembers
}

export const openMemberEditModal = (member , modal , form) => {
    form.elements.user_id.value = member.user_id
    form.elements.user_name.value = member.user_name
    form.elements.phone_number.value = member.phone_number
    form.elements.email.value = member.email

    modal.hidden = false
}

export const closeMemberEditModal = (modal , form) => {
    form.reset()
    modal.hidden = true
}