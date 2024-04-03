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





// sidebar

const menuButton = document.getElementById("menu");
const sidebar = document.querySelector(".sidebar");

function openNav() {
    const sidebarWidth = "200px";
    document.getElementById("mySidebar").style.width = sidebarWidth;
    document.getElementById("content").style.paddingLeft = sidebarWidth;
}
  
function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("content").style.paddingLeft= "0";
}

var divs = document.querySelectorAll(".main-container > :not(.sidebar)");

divs.forEach((div) => {
    div.addEventListener("click", () => {
        if (screen.width < 500 && sidebar.classList.contains("open")) {
            closeNav();
            sidebar.classList.remove("open");
            console.log("close");
        }
    });
});

function addOpen() {
    sidebar.classList.add("open");
}

menuButton.addEventListener("click", () => {
    if (!sidebar.classList.contains("open")) {
        openNav();
        setTimeout(addOpen, 100);
        console.log("open");
    } else {
        closeNav();
        sidebar.classList.remove("open");
    }
});

const today = document.getElementById("today");
// const addTag = document.getElementById("add-tag");

today.addEventListener("click", () => {
    content.classList.remove("bg");
    content.classList.add("bg-none");
    content.innerHTML = "";
    content.appendChild(home());
    addTodayListeners();
    addAddTaskListeners();
})

const week = document.getElementById("week");
week.addEventListener("click", () => {
    content.classList.remove("bg-none");
    content.classList.add("bg");
    content.innerHTML = "";
    content.appendChild(weekView());
    addWeekListeners();
})

// function displayTags() {
//     const tagsContainer = document.createElement("div")
//     tagsContainer.classList.add("tags-container")
//     TagsList.list.forEach((tag) => {
//         const tagButton = document.createElement("button")
//         tagButton.style.backgroundColor = tag.color
//         tagButton.innerHTML = tag.name
//         tagsContainer.appendChild(tagButton)
//     })
//     return tagsContainer
// }

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
    newTaskButton.addEventListener("click", () => {
        newTaskPopup.style.visibility = "visible";
        newTitle.value = "";
        newDesc.value = "";
        newDue.value = ""; 
        newTitle.focus();
    })
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

function createWeekCardTask(taskName, taskDue, done) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-name", taskName);
    card.setAttribute("data-due", taskDue);
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
    const del = document.createElement("i");
    del.classList.add("fa-trash-o");
    del.classList.add("fa");
    del.classList.add("del");
    del.setAttribute("data-name", taskName);
    card.appendChild(check);
    card.appendChild(name);
    card.appendChild(due);
    card.appendChild(del);

    return card;
}

function displayToday() {
    const tasksContainer = document.createElement("div");
    tasksContainer.classList.add("tasks-container");
    const curDate = new Date();
    const todayTasks = TasksList.list.filter((task) => {
        return new Date(task.due) <= curDate;
    })
    todayTasks.forEach((task) => {
        tasksContainer.appendChild(createWeekCardTask(task.name, task.due, task.done))
    })
    return tasksContainer;
}

function displayWeek() {
    const tasksContainer = document.createElement("div");
    tasksContainer.classList.add("tasks-container");
    const nextWeek = addDays(new Date(), 7)
    const todayTasks = TasksList.list.filter((task) => {
        return new Date(task.due) <= nextWeek && new Date(task.due) > new Date();
    })
    todayTasks.forEach((task) => {
        tasksContainer.appendChild(createWeekCardTask(task.name, task.due, task.done))
    })
    return tasksContainer;
}

function displayLater() {
    const tasksContainer = document.createElement("div");
    tasksContainer.classList.add("tasks-container");
    const nextWeek = addDays(new Date(), 7)
    const todayTasks = TasksList.list.filter((task) => {
        return new Date(task.due) > nextWeek;
    })
    todayTasks.forEach((task) => {
        tasksContainer.appendChild(createWeekCardTask(task.name, task.due, task.done))
    })
    return tasksContainer;
}

function weekView() {
    const weekViewContainer = document.createElement("div");
    weekViewContainer.classList.add("week");
    weekViewContainer.classList.add("container");
    const todayHeading = document.createElement("h1")
    todayHeading.innerHTML = "Due Today"
    const todayContainer = document.createElement("div");
    todayContainer.classList.add("today-container");
    todayContainer.appendChild(displayToday());
    const weekHeading = document.createElement("h1")
    weekHeading.innerHTML = "Due this Week"
    const weekContainer = document.createElement("div");
    weekContainer.classList.add("week-container");
    weekContainer.appendChild(displayWeek());
    const laterHeading = document.createElement("h1")
    laterHeading.innerHTML = "Due Later"
    const laterContainer = document.createElement("div");
    laterContainer.classList.add("later-container");
    laterContainer.appendChild(displayLater());
    const newTaskButton = document.createElement("button");
    newTaskButton.classList.add("week-new-task");
    newTaskButton.innerHTML = "+";
    newTaskButton.addEventListener("click", () => {
        newTaskPopup.style.visibility = "visible";
        newTitle.value = "";
        newDesc.value = "";
        newDue.value = ""; 
        newTitle.focus();
    })
    weekViewContainer.append(todayHeading)
    weekViewContainer.append(todayContainer)
    weekViewContainer.append(weekHeading)
    weekViewContainer.append(weekContainer)
    weekViewContainer.append(laterHeading)
    weekViewContainer.append(laterContainer)
    weekViewContainer.appendChild(newTaskButton)
    return weekViewContainer;
};







//　entry

if (window.localStorage.getItem("tasksList")) {
    TasksList.list = JSON.parse(window.localStorage.getItem("tasksList"));
} else {
    TasksList.list.push(new Task("Add me to today's list", "Press the plus button next to me", format(new Date(), "yyyy-MM-dd", false)));
    updateStorage();
}
content.appendChild(home());

// TagsList.list.push(new Tag("Priority", "#ce1e1e"))
// TagsList.list.push(new Tag("Top", "#c2ce1e"))
// TagsList.list.push(new Tag("Homework", "#1e2cce"))

// function updateTagsSidebar() {
//     const tagsSidebar = document.querySelector(".tags-list")
//     tagsSidebar.innerHTML = ""
//     tagsSidebar.appendChild(displayTags())
// }

// updateTagsSidebar()








// Others
const tagPopup = document.querySelector(".tag-popup");
const tagForm = document.querySelector(".tag-popup > form");
const cancelTag = document.querySelector(".tag-popup > form > .tag-buttons > .cancel");

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

const newForm = document.querySelector(".new-task-popup > form");
newForm.addEventListener("submit", (e) => {
    e.preventDefault();
    TasksList.list.push(new Task(newTitle.value, newDesc.value, newDue.value, false));
    updateStorage();
    if (document.querySelector(".home")) {
        updateAddTasks();
    } else {
        updateWeekTasks(newDue.value);
    }
    newTaskPopup.style.visibility = "hidden";
})

// function handleEnter(event) {
//     if (event.key==="Enter") {
//        const form = document.getElementById('form')
//        const index = [...form].indexOf(event.target);
//        form.elements[index + 1].focus();
//        //event.preventDefault();
//      }
//  }

const cancel = document.querySelector(".new-task-popup > form > .buttons-container > .cancel");
cancel.addEventListener("click", () => {
    newTaskPopup.style.visibility = "hidden";
})

function updateTodayTasks() {
    const todayTasksContainer1 = document.querySelector(".today-tasks-container-1");
    todayTasksContainer1.innerHTML = "";
    todayTasksContainer1.appendChild(displayTodayTasks());
    addTodayListeners()
}

function addTodayListeners() {
    addRemoveListener();
    addDoneListener();
    addCardListenerTodayTasks()
}

function addWeekListeners() {
    addDelListener();
    addDoneListener();
    addCardListenerWeek()
}

function updateAddTasks() {
    const addTasksContainer = document.querySelector(".add-tasks");
    addTasksContainer.innerHTML = "";
    addTasksContainer.appendChild(addTasks());
    addAddTaskListeners()
}

function updateWeekTasks(due) {
    if (new Date(due) <= new Date()) {
        const todayContainer = document.querySelector(".today-container");
        todayContainer.innerHTML = "";
        todayContainer.appendChild(displayToday());
        console.log("update today")
    } else if (new Date(due) > new Date() && new Date(due) <= addDays(new Date(), 7)) {
        const weekContainer = document.querySelector(".week-container");
        weekContainer.innerHTML = "";
        weekContainer.appendChild(displayWeek());
        console.log("update week")
    } else {
        const laterContainer = document.querySelector(".later-container");
        laterContainer.innerHTML = "";
        laterContainer.appendChild(displayLater());
        console.log("update later")
    }
    addWeekListeners();
}

function addAddTaskListeners() {
    addAddListener();
    addDelListener();
    addCardListenerAddTasks();
}

function addRemoveListener() {
    const removeButtons = document.querySelectorAll(".remove");
    removeButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.stopImmediatePropagation();
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
            e.stopImmediatePropagation();
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
            e.stopImmediatePropagation();
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
            e.stopImmediatePropagation();
            TasksList.list = TasksList.list.filter((task) => {
                return task.name !== button.dataset.name;
            })
            updateStorage();
            if (document.querySelector(".home")) {
                updateAddTasks();
            } else {
                updateWeekTasks(button.dataset.date);
            }
            console.log("Deleted")
        })
    })    
}

addDelListener();

function updateStorage() {
    localStorage.setItem("tasksList", JSON.stringify(TasksList.list));
}

const cardPopup = document.querySelector(".card-popup");

function addCardListenerAddTasks() {
    const cards = document.querySelectorAll(".add-tasks .card");
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
            console.log("card clicked")
        }, {once: true})
    })
}

function addCardListenerTodayTasks() {
    const cards = document.querySelectorAll(".today-tasks-container-1 .tasks-container .card");
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
            console.log("card clicked")
        }, {once: true})
    })
}

function addCardListenerWeek() {
    const cards = document.querySelectorAll(".week .card");
    cards.forEach((card) => {
        card.addEventListener("click", (e) => {
            e.stopImmediatePropagation();
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
            console.log("card clicked")
        }, {once: true})
    })
}


addCardListenerAddTasks();
addCardListenerTodayTasks();

const editTaskPopup = document.querySelector(".edit-task-popup");
const editForm = document.querySelector(".edit-task-popup > form");
const editTitle = document.getElementById("edit-title");
const editDesc = document.getElementById("edit-desc");
const editDue = document.getElementById("edit-due");
let editName;

const cancelEdit = document.querySelector(".edit-task-popup > form > .buttons-container > .cancel");
cancelEdit.addEventListener("click", () => {
    editTaskPopup.style.visibility = "hidden";
})

editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const tasks = TasksList.list.filter((task) => {
        return task.name === editName;
    })
    tasks[0].name = editTitle.value;
    tasks[0].notes = editDesc.value;
    tasks[0].due = editDue.value;
    if (document.querySelector(".home")) {
        updateTodayTasks();
        updateAddTasks();
    } else {
        updateWeekTasks(editDue.value);
    }
    updateStorage();
    editTaskPopup.style.visibility = "hidden";
})

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
    editName = editButton.dataset.name;
})