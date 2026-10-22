import { addMember, deleteMember, getMemberById, updateMember } from "../api/memberApi.js"
import { cancelEditMember, editMemberForm, editMemberModal, memberForm,
     membersTableBody, searchMembersInput } from "../dom/memberDom.js"
import { closeMemberEditModal, openMemberEditModal } from "../ui/memberUi.js"


export const setupMemberEvents =  (applyMemberFilters , refresh) => {
    // Search members
    searchMembersInput.addEventListener('input' , async () =>{
        const searchValue = searchMembersInput.value.trim()

        await applyMemberFilters(searchValue)
    })

    // Add members
    memberForm.addEventListener('submit' , async (event) => {
        event.preventDefault()

        const formData = new FormData(memberForm)

        const userName = formData.get('user_name').trim()
        const userEmail = formData.get('email').trim()
        const phoneNumber = formData.get('phone_number').trim()

        try {
            await addMember({userName , userEmail , phoneNumber})

            memberForm.reset()

            await refresh()
        }
        catch (err) {
            console.log(err.message)

            document.getElementById('member-error').textContent = err.message

            setTimeout(() => {
                document.getElementById('member-error').textContent = ""
            } , 5000)
        }
    })

    // Edit members

    membersTableBody.addEventListener('click' , async(event) => {
        const editButton = event.target.closest('.btn-edit')

        if (!editButton) return

        const id = editButton.dataset.id

        try {
            const member = await getMemberById(id)

            openMemberEditModal(member , editMemberModal , editMemberForm)

        }
        catch (err) {
            console.log(err)
            alert(err.message)
        }
    })

    // Save members
    editMemberForm.addEventListener('submit' , async(event) => {
        event.preventDefault()

        const formData = new FormData(editMemberForm)

        const member_id = formData.get("user_id")

        const memberData = {
            userName : formData.get('user_name').trim(),
            userEmail : formData.get('email').trim(),
            phoneNumber : formData.get('phone_number').trim()
        }

        try {
            await updateMember(member_id , memberData)

            closeMemberEditModal(editMemberModal , editMemberForm)
            await refresh()
        }
        catch (err) {
            console.log(err)
            document.getElementById('edit-member-error').textContent = err.message

            setTimeout(() => {
                document.getElementById('edit-member-error').textContent = ""
            } , 5000)
        }
    })

    // Cancel btn
    cancelEditMember.addEventListener('click' , () => {
        closeMemberEditModal(editMemberModal , editMemberForm)
    })


    // Delete members

    membersTableBody.addEventListener('click' , async(event) => {
        const deleteButton = event.target.closest('.btn-delete')

        if (!deleteButton) return

        const id = deleteButton.dataset.id

        try {
            await deleteMember(id)
            await refresh()

        }
        catch (err) {
            console.log(err)
            alert(err.message)
        }
    })
}