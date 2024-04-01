import './styles.css';
import { addDays, format, compareAsc } from "date-fns";

// Classes and others

class Task {
    tags = [];
    constructor(name, notes, due, today) {
        this.name = name;
        this.notes = notes;
        this.due = due;
        this.today = today;
        this.done = false;
    }

    addTag(tag) {
        this.tags.push(tag)
    }
}

class Tag {
    constructor(name, color) {
        this.name = name;
        this.color = color
    }
}

const TasksList = (function() {
    let list = [];
    const addTask = (name, notes, due, today) => {
        let task1 = new Task(name, notes, due, today);
        list.push(task1);
    }

    return {
        list, addTask
    };
})();

const TagsList = (function() {
    let list = [];
    return {
        list
    };
})();



function capitalize(s)
{
    return s[0].toUpperCase() + s.slice(1);
}






// Sidebar

// const menuButton = document.getElementById("menu");
// const sidebar = document.querySelector(".sidebar");

// function openNav() {
//     const sidebarWidth = "200px";
//     document.getElementById("mySidebar").style.width = sidebarWidth;
//     document.getElementById("content").style.paddingLeft = sidebarWidth;
// }
  
// function closeNav() {
//     document.getElementById("mySidebar").style.width = "0";
//     document.getElementById("content").style.paddingLeft= "0";
// }

// var divs = document.querySelectorAll(".main-container > :not(.sidebar)");

// divs.forEach((div) => {
//     div.addEventListener("click", () => {
//         if (screen.width < 500 && sidebar.classList.contains("open")) {
//             closeNav();
//             sidebar.classList.remove("open");
//             console.log("close");
//         }
//     });
// });

// function addOpen() {
//     sidebar.classList.add("open");
// }

// menuButton.addEventListener("click", () => {
//     if (!sidebar.classList.contains("open")) {
//         openNav();
//         setTimeout(addOpen, 100);
//         console.log("open");
//     } else {
//         closeNav();
//         sidebar.classList.remove("open");
//     }
// });

// const today = document.getElementById("today");
// const addTag = document.getElementById("add-tag");

// today.addEventListener("click", () => {
//     content.classList.remove("bg");
//     content.classList.add("bg-none");
//     content.innerHTML = "";
//     content.appendChild(home());
// })

// // const week = document.getElementById("week");
// // week.addEventListener("click", () => {
// //     content.classList.remove("bg-none");
// //     content.classList.add("bg");
// //     content.innerHTML = "";
// //     content.appendChild(weekView());
// // })

// addTag.addEventListener("click", () => {
//     tagPopup.style.visibility = "visible";
// })




// Username Popup

const usernamePopup = document.querySelector(".username-popup");
const usernameForm = document.querySelector(".username-popup > .container > form");
const usernameInput = document.querySelector("#username-input");
// const usernameSidebar = document.querySelector(".sidebar h3:first-child");

if (!localStorage["username"]) {
    usernamePopup.style.visibility = "visible";
    usernameForm.addEventListener("submit", (e) => {
        e.preventDefault;
        const trimmed = usernameInput.value.trim();
        if (trimmed !== "") {
            localStorage.setItem("username", trimmed);
            usernamePopup.style.visibility = "hidden";
        } else {
            alert("Please enter a valid username.");
        }
    })
}

// usernameSidebar.innerHTML = localStorage["username"];



// main functions
const content = document.querySelector("#content");

function homeHeading() {
    const headingContainer = document.createElement("div");
    headingContainer.classList.add("heading-container");
    const heading1 = document.createElement("h1");
    heading1.innerHTML =`Welcome, ${capitalize(localStorage["username"])}`;
    const heading2 = document.createElement("h3");
    heading2.innerHTML =`Here are your tasks for the day`;
    headingContainer.appendChild(heading1);
    headingContainer.appendChild(heading2);
    return headingContainer;
}


// "Add me to today's list", "Press the plus button next to me", format(new Date(), "yyyy-MM-dd", false)
{/* <div class="card">
        <div class="status done"></div>
        <div class="name"></div>
        <div class="due"></div>
        <i class="fa fa-trash-o"></i>
    </div> */}

function createTodayCardTask(taskName, taskDue, done) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-name", taskName);
    const check = document.createElement("div");
    check.classList.add("check");
    check.setAttribute("data-name", taskName);
    if (done) {
        card.classList.add("done");
        check.classList.add("check-done");
        check.innerHTML = "&#10003;";
    }
    const name = document.createElement("div");
    name.classList.add("name");
    name.innerHTML = taskName;
    const due = document.createElement("div");
    due.classList.add("due");
    due.innerHTML = format(taskDue, "MMM dd");
    const remove = document.createElement("div");
    remove.innerHTML = "&#x2715;";
    remove.classList.add("remove");
    remove.setAttribute("data-name", taskName);
    card.appendChild(check);
    card.appendChild(name);
    card.appendChild(due);
    card.appendChild(remove);

    return card;
}



function createAddCardTask(taskName, taskDue) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-name", taskName);
    const add = document.createElement("div");
    add.classList.add("add");
    add.innerHTML = "+";
    add.setAttribute("data-name", taskName);
    const name = document.createElement("div");
    name.classList.add("name");
    name.innerHTML = taskName;
    const due = document.createElement("div");
    due.classList.add("due");
    due.innerHTML = format(taskDue, "MMM dd");
    const del = document.createElement("i");
    del.classList.add("fa-trash-o");
    del.classList.add("fa");
    del.classList.add("del");
    del.setAttribute("data-name", taskName);
    card.appendChild(add);
    card.appendChild(name);
    card.appendChild(due);
    card.appendChild(del);

    return card;
}

function displayTodayTasks() {
    const tasksContainer = document.createElement("div");
    tasksContainer.classList.add("tasks-container");
    const todayTasks = TasksList.list.filter((task) => {
        return task.today;
    })
    todayTasks.forEach((task) => {
        tasksContainer.appendChild(createTodayCardTask(task.name, task.due, task.done))
    })
    return tasksContainer;
}

function addTasks() {
    const addTasks = document.createElement("div");
    addTasks.classList.add("add-tasks");
    const laterTasks = TasksList.list.filter((task) => {
        return !task.today;
    })
    laterTasks.forEach((task) => {
        addTasks.appendChild(createAddCardTask(task.name, task.due))
    })
    return addTasks;
}


function home() {
    const homeContainer = document.createElement("div");
    homeContainer.classList.add("container");
    if (screen.width < 500) {
        homeContainer.classList.add("phone");
    } else {
        homeContainer.classList.add("home");
    }
    const todayTasksContainer = document.createElement("div");
    todayTasksContainer.classList.add("today-tasks-container");
    const todayTasksContainer1 = document.createElement("div");
    todayTasksContainer1.classList.add("today-tasks-container-1");
    homeContainer.appendChild(homeHeading());
    const newTaskButton = document.createElement("button");
    newTaskButton.classList.add("new-task");
    newTaskButton.innerHTML = "New Task";
    todayTasksContainer1.appendChild(displayTodayTasks());
    todayTasksContainer.appendChild(todayTasksContainer1);
    homeContainer.appendChild(todayTasksContainer);
    const addTasksContainer = document.createElement("div");
    addTasksContainer.classList.add("add-tasks-container");
    addTasksContainer.appendChild(addTasks());
    addTasksContainer.appendChild(newTaskButton);
    homeContainer.appendChild(addTasksContainer);
    return homeContainer;
};

function weekView() {
    const weekContainer = document.createElement("div");
    weekContainer.classList.add("week");
    weekContainer.classList.add("container");
    return weekContainer;
};







//　entry

if (window.localStorage.getItem("tasksList")) {
    TasksList.list = JSON.parse(window.localStorage.getItem("tasksList"));
} else {
    TasksList.list.push(new Task("Add me to today's list", "Press the plus button next to me", format(new Date(), "yyyy-MM-dd", false)));
    updateStorage();
}
content.appendChild(home());









// Others
const tagPopup = document.querySelector(".tag-popup");
const tagForm = document.querySelector(".tag-popup > form");
const cancelTag = document.querySelector(".tag-popup > form > .cancel");

tagForm.addEventListener("submit", (e) => {
    e.preventDefault();
})

cancelTag.addEventListener("click", () => {
    tagPopup.style.visibility = "hidden";
})

const newTitle = document.getElementById("new-title");
const newDesc = document.getElementById("new-desc");
const newDue = document.getElementById("new-due");
const newTaskPopup = document.querySelector(".new-task-popup");

const newTaskButton = document.querySelector(".new-task");
newTaskButton.addEventListener("click", () => {
    newTaskPopup.style.visibility = "visible";
    newTitle.value = "";
    newDesc.value = "";
    newDue.value = ""; 
})

const newForm = document.querySelector(".new-task-popup > form");
newForm.addEventListener("submit", (e) => {
    e.preventDefault();
    TasksList.list.push(new Task(newTitle.value, newDesc.value, newDue.value, false));
    updateStorage();
    updateAddTasks();
    newTaskPopup.style.visibility = "hidden";
})

const cancel = document.querySelector(".new-task-popup > form > .buttons-container > .cancel");
cancel.addEventListener("click", () => {
    newTaskPopup.style.visibility = "hidden";
})

function updateTodayTasks() {
    const todayTasksContainer1 = document.querySelector(".today-tasks-container-1");
    todayTasksContainer1.innerHTML = "";
    todayTasksContainer1.appendChild(displayTodayTasks());
    addRemoveListener();
    addDoneListener();
    addCardListener()
}

function updateAddTasks() {
    const addTasksContainer = document.querySelector(".add-tasks");
    addTasksContainer.innerHTML = "";
    addTasksContainer.appendChild(addTasks());
    addAddListener();
    addDelListener();
    addCardListener();
}

function addRemoveListener() {
    const removeButtons = document.querySelectorAll(".remove");
    removeButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.stopPropagation();
            if (button.parentElement.classList.contains("done")) {
                TasksList.list = TasksList.list.filter((task) => {
                    return task.name !== button.dataset.name;
                })
            } else {
                const tasks = TasksList.list.filter((task) => {
                    return task.name === button.dataset.name;
                })
                tasks[0].today = false;
            }
            updateStorage();
            updateTodayTasks();
            updateAddTasks();
        })
    })
}

addRemoveListener();

function addAddListener() {
    const addButtons = document.querySelectorAll(".add");
    addButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.stopPropagation();
            const tasks = TasksList.list.filter((task) => {
                return task.name === button.dataset.name;
            })
            tasks[0].today = true;
            updateStorage();
            updateTodayTasks();
            updateAddTasks();
        })
    })
}

addAddListener();


function addDoneListener() {
    const doneButtons = document.querySelectorAll(".check");
    doneButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.stopPropagation();
            const tasks = TasksList.list.filter((task) => {
                return task.name === button.dataset.name;
            })
            if (!tasks[0].done) {
                tasks[0].done = true;
                button.parentElement.classList.add("done");
                button.classList.add("check-done");
                button.innerHTML = "&#10003;";
            } else {
                tasks[0].done = false;
                button.parentElement.classList.remove("done");
                button.classList.remove("check-done");
                button.innerHTML = "";
            }
            updateStorage();
        })
    })
}

addDoneListener();


function addDelListener() {
    const delButtons = document.querySelectorAll(".del");
    delButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.stopPropagation();
            TasksList.list = TasksList.list.filter((task) => {
                return task.name !== button.dataset.name;
            })
            updateStorage();
            updateAddTasks();
        })
    })    
}

addDelListener();

function updateStorage() {
    localStorage.setItem("tasksList", JSON.stringify(TasksList.list));
}

const cardPopup = document.querySelector(".card-popup");

function addCardListener() {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            cardPopup.style.visibility = "visible";
            const edit = document.querySelector(".edit");
            edit.dataset.name = card.dataset.name;
            const title = document.getElementById("card-title");
            const desc = document.getElementById("card-desc");
            const due = document.getElementById("card-due");
            const tasks = TasksList.list.filter((task) => {
                return task.name === card.dataset.name;
            })
            title.innerHTML = tasks[0].name;
            desc.innerHTML = tasks[0].notes;
            due.innerHTML = format(tasks[0].due, "MMM dd yyyy");
        })
    })
}

addCardListener();

const editTaskPopup = document.querySelector(".edit-task-popup");
const editForm = document.querySelector(".edit-task-popup > form");
const editTitle = document.getElementById("edit-title");
const editDesc = document.getElementById("edit-desc");
const editDue = document.getElementById("edit-due");

const cancelEdit = document.querySelector(".edit-task-popup > form > .buttons-container > .cancel");
cancelEdit.addEventListener("click", () => {
    editTaskPopup.style.visibility = "hidden";
})

function addEditListener(name) {
    editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const tasks = TasksList.list.filter((task) => {
            return task.name === name;
        })
        tasks[0].name = editTitle.value;
        tasks[0].notes = editDesc.value;
        tasks[0].due = editDue.value;
        updateStorage();
        updateTodayTasks();
        updateAddTasks();
        editTaskPopup.style.visibility = "hidden";
    })
}

const closeButton = document.querySelector(".close");
closeButton.addEventListener("click", () => {
    cardPopup.style.visibility = "hidden";
}) 

const editButton = document.querySelector(".edit");
editButton.addEventListener("click", () => {
    cardPopup.style.visibility = "hidden";
    editTaskPopup.style.visibility = "visible";
    const tasks = TasksList.list.filter((task) => {
        return task.name === editButton.dataset.name;
    })
    editTitle.value = tasks[0].name;
    editDesc.value = tasks[0].notes;
    editDue.value = tasks[0].due;
    addEditListener(editButton.dataset.name);
})