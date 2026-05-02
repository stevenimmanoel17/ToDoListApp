document.addEventListener('DOMContentLoaded', () => {
    const dropdownBtn = document.getElementById('dropdownBtn')
    const dropdownMenu = document.getElementById('dropdownMenu')
    
    dropdownBtn.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show')
    })

    document.addEventListener('click', (event) => {
        if (!dropdownBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove('show')
        }
    })

    const emptyState = document.getElementById('emptyState')
    const taskList = document.getElementById('taskList')
    const taskInput = document.getElementById('taskInput')
    
    const addTaskBtn = document.getElementById('addTaskBtn')
    const addModal = document.getElementById('addTaskModal')
    const addSuccessNotif = document.getElementById('addTaskSuccess')
    const confirmAddBtn = document.getElementById('confirmAddBtn')
    const cancelAddBtn = document.getElementById('cancelAddBtn')
    const newTaskName = document.getElementById('newTaskName')
    const newTaskDate = document.getElementById('newTaskDate')

    const editModal = document.getElementById('editTaskModal')
    const editSuccessNotif = document.getElementById('editTaskSuccess')
    const confirmEditBtn = document.getElementById('confirmEditBtn')
    const cancelEditBtn = document.getElementById('cancelEditBtn')
    const editTaskName = document.getElementById('editTaskName')
    const editTaskDate = document.getElementById('editTaskDate')
    const editStatusRadios = document.getElementsByName('taskStatus')

    const deleteModal = document.getElementById('deleteTaskModal')
    const deleteSuccessNotif = document.getElementById('deleteTaskSuccess')
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn')
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn')

    const calendarGrid = document.querySelector('.calendar-grid')
    const currentMonthYear = document.querySelector('.calendar-header span')
    const prevBtn = document.querySelectorAll('.calendar-nav svg')[0]
    const nextBtn = document.querySelectorAll('.calendar-nav svg')[1]

    let tasks = JSON.parse(localStorage.getItem('tasks')) || []
    let currentEditIndex = -1
    let currentDeleteIndex = -1
    let displayDate = new Date()
    let selectedFilterDate = null
    let selectedStatusFilter = 'all'
    let searchQuery = ''

    function formatDate(dateString) {
        const date = new Date(dateString)
        const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
        return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear()
    }

    function renderCalendar() {
        const year = displayDate.getFullYear()
        const month = displayDate.getMonth()
        
        const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
        currentMonthYear.textContent = `${months[month]} ${year}`
        
        let gridHTML = `
            <div class="day-name">Min</div><div class="day-name">Sen</div><div class="day-name">Sel</div><div class="day-name">Rab</div><div class="day-name">Kam</div><div class="day-name">Jum</div><div class="day-name">Sab</div>
        `
        
        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        
        for (let i = 0; i < firstDay; i++) {
            gridHTML += `<div></div>`
        }
        
        for (let i = 1; i <= daysInMonth; i++) {
            const checkDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
            let statusClass = ''
            
            const taskForDay = tasks.find(t => t.date === checkDateStr)
            if (taskForDay) {
                if (taskForDay.status === 'progress') statusClass = 'date-progress'
                if (taskForDay.status === 'notfinished') statusClass = 'date-notfinished'
                if (taskForDay.status === 'finished') statusClass = 'date-finished'
            }
            
            let highlightClass = selectedFilterDate === checkDateStr ? 'selected-date' : ''
            
            gridHTML += `<div class="calendar-day ${statusClass} ${highlightClass}" data-date="${checkDateStr}">${i}</div>`
        }
        
        calendarGrid.innerHTML = gridHTML
    }

    function renderTasks() {
        taskList.innerHTML = ''
        let filteredTasks = tasks

        if (selectedFilterDate) {
            filteredTasks = filteredTasks.filter(t => t.date === selectedFilterDate)
        }

        if (selectedStatusFilter !== 'all') {
            filteredTasks = filteredTasks.filter(t => t.status === selectedStatusFilter)
        }

        if (searchQuery) {
            filteredTasks = filteredTasks.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
        }

        if (filteredTasks.length === 0) {
            emptyState.classList.remove('hidden')
            taskList.classList.add('hidden')
        } else {
            emptyState.classList.add('hidden')
            taskList.classList.remove('hidden')
        }

        filteredTasks.forEach((task) => {
            const originalIndex = tasks.indexOf(task)
            const formattedDate = formatDate(task.date)
            let dotClass = 'dot-progress'
            if (task.status === 'notfinished') dotClass = 'dot-notfinished'
            if (task.status === 'finished') dotClass = 'dot-finished'

            const taskHTML = `
                <div class="task-item">
                    <div class="task-info">
                        <span class="dot ${dotClass}"></span>
                        <span class="task-name">${task.name}</span>
                        <span class="task-date">| ${formattedDate}</span>
                    </div>
                    <div class="task-actions">
                        <button class="action-btn edit-btn" data-index="${originalIndex}">
                            <svg viewBox="0 0 24 24" fill="none" style="pointer-events: none;"><path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </button>
                        <button class="action-btn delete-btn" data-index="${originalIndex}">
                            <svg viewBox="0 0 24 24" fill="none" style="pointer-events: none;"><path d="M3 6H5H21M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M10 11V17M14 11V17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </button>
                    </div>
                </div>
            `
            taskList.insertAdjacentHTML('beforeend', taskHTML)
        })

        const editButtons = document.querySelectorAll('.edit-btn')
        const deleteButtons = document.querySelectorAll('.delete-btn')

        editButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                currentEditIndex = this.getAttribute('data-index')
                const task = tasks[currentEditIndex]
                editTaskName.value = task.name
                editTaskDate.value = task.date
                
                for (let i = 0; i < editStatusRadios.length; i++) {
                    const radio = editStatusRadios[i]
                    radio.checked = (radio.value === (task.status || 'progress'))
                }
                
                editModal.classList.remove('hidden')
            })
        })

        deleteButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                currentDeleteIndex = this.getAttribute('data-index')
                deleteModal.classList.remove('hidden')
            })
        })

        renderCalendar()
    }

    taskInput.addEventListener('input', (e) => {
        searchQuery = e.target.value
        renderTasks()
    })

    calendarGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('calendar-day')) {
            const clickedDate = e.target.getAttribute('data-date')
            if (selectedFilterDate === clickedDate) {
                selectedFilterDate = null
            } else {
                selectedFilterDate = clickedDate
            }
            renderTasks()
        }
    })

    dropdownMenu.addEventListener('click', (e) => {
        if (e.target.classList.contains('dropdown-item')) {
            document.querySelectorAll('.dropdown-item').forEach(item => {
                item.classList.remove('active')
            })
            
            e.target.classList.add('active')

            const text = e.target.textContent
            dropdownBtn.innerHTML = `${text} <svg viewBox="0 0 24 24" fill="none"><path d="M6 9L12 15L18 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`

            if (text === 'All Progress') selectedStatusFilter = 'all'
            if (text === 'In Progress') selectedStatusFilter = 'progress'
            if (text === 'Not Finished') selectedStatusFilter = 'notfinished'
            if (text === 'Finished') selectedStatusFilter = 'finished'

            dropdownMenu.classList.remove('show')
            renderTasks()
        }
    })

    prevBtn.addEventListener('click', () => {
        displayDate.setMonth(displayDate.getMonth() - 1)
        renderCalendar()
    })

    nextBtn.addEventListener('click', () => {
        displayDate.setMonth(displayDate.getMonth() + 1)
        renderCalendar()
    })

    addTaskBtn.addEventListener('click', () => {
        addModal.classList.remove('hidden')
    })

    cancelAddBtn.addEventListener('click', () => {
        addModal.classList.add('hidden')
    })

    confirmAddBtn.addEventListener('click', () => {
        const name = newTaskName.value
        const date = newTaskDate.value

        if (name && date) {
            addModal.classList.add('hidden')
            addSuccessNotif.classList.remove('hidden')

            setTimeout(() => {
                addSuccessNotif.classList.add('hidden')
                tasks.push({ name: name, date: date, status: 'progress' })
                localStorage.setItem('tasks', JSON.stringify(tasks))
                renderTasks()
                newTaskName.value = ''
                newTaskDate.value = ''
            }, 2000)
        }
    })

    cancelEditBtn.addEventListener('click', () => {
        editModal.classList.add('hidden')
    })

    confirmEditBtn.addEventListener('click', () => {
        const name = editTaskName.value
        const date = editTaskDate.value
        let status = 'progress'
        
        for (let i = 0; i < editStatusRadios.length; i++) {
            if (editStatusRadios[i].checked) {
                status = editStatusRadios[i].value
                break
            }
        }

        if (name && date) {
            editModal.classList.add('hidden')
            editSuccessNotif.classList.remove('hidden')

            setTimeout(() => {
                editSuccessNotif.classList.add('hidden')
                tasks[currentEditIndex] = { name: name, date: date, status: status }
                localStorage.setItem('tasks', JSON.stringify(tasks))
                renderTasks()
            }, 2000)
        }
    })

    cancelDeleteBtn.addEventListener('click', () => {
        deleteModal.classList.add('hidden')
    })

    confirmDeleteBtn.addEventListener('click', () => {
        deleteModal.classList.add('hidden')
        deleteSuccessNotif.classList.remove('hidden')

        setTimeout(() => {
            deleteSuccessNotif.classList.add('hidden')
            tasks.splice(currentDeleteIndex, 1)
            localStorage.setItem('tasks', JSON.stringify(tasks))
            selectedFilterDate = null
            renderTasks()
        }, 2000)
    })

    renderTasks()
})

const logoutIconBtn = document.getElementById('logoutIconBtn')
const logoutModal = document.getElementById('logoutModal')
const logoutSuccess = document.getElementById('logoutSuccess')
const confirmLogoutBtn = document.getElementById('confirmLogoutBtn')
const cancelLogoutBtn = document.getElementById('cancelLogoutBtn')

logoutIconBtn.addEventListener('click', () => {
    logoutModal.classList.remove('hidden')
})

cancelLogoutBtn.addEventListener('click', () => {
    logoutModal.classList.add('hidden')
})

confirmLogoutBtn.addEventListener('click', () => {
    logoutModal.classList.add('hidden')
    logoutSuccess.classList.remove('hidden')
    
    setTimeout(() => {
        sessionStorage.removeItem('loginSuccess')
        window.location.href = 'index.html'
    }, 2000)
})