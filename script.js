// initial configurations
const newTaskInput = document.querySelector("#new-task input");
const tasksDiv = document.querySelector("#tasks");
let deleteTasks, editTasks, tasks;
let updateNote = "";
let count;

// function on window load
window.onload = () => {
    updateNote = "";
    count = Object.keys(localStorage).length;
    displayTasks();
}

// function to display tasks
const displayTasks = () => {
    if(Object.keys(localStorage).length > 0){
        tasksDiv.style.display = "inline-block";
    }else{
        tasksDiv.style.display = "none";
    }

    // clear the tasks
    tasksDiv.innerHTML = "";

    // fetch all the keys in local storage
    let tasks = Object.keys(localStorage);
    tasks = tasks.sort();
    for(let key of tasks){

        // get all values
        let value = localStorage.getItem(key);
        let taskInnerDiv = document.createElement("div");
        taskInnerDiv.classList.add("task");
        taskInnerDiv.setAttribute("id", key);
        taskInnerDiv.innerHTML = `<span id="taskname">${key.split("_")[1]}</span>`;

        // edit button
        let editButton = document.createElement("button");
        editButton.classList.add("edit");
        editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;

        // local storage would store boolean as string so we parse it back to boolean
        if(!JSON.parse(value)){
            editButton.style.visibility = "visible";
        }else{
            editButton.style.visibility = "hidden";
            taskInnerDiv.classList.add("completed");
        }
        taskInnerDiv.appendChild(editButton);
        taskInnerDiv.innerHTML += `<button class="delete"><i class="fa-solid fa-trash"></i></button>`;
        tasksDiv.appendChild(taskInnerDiv);
    }

    // task completed
    tasks = document.querySelectorAll(".task");
    tasks.forEach((element, index) => {
        element.onclick = () => {
            // local storage update
            if(element.classList.contains("completed")){
                updateStorage(element.id.split("_")[0], element.innerText, false);
            }else{
                updateStorage(element.id.split("_")[0], element.innerText, true);
            }
        }
    });

    // edit tasks
    editTasks = document.getElementsByClassName("edit");
    Array.from(editTasks).forEach((element, index) => {
        element.addEventListener("click", (e) => {
            // stoping propogation to outer elements
            e.stopPropagation();
            // disable other edit buttons when one task is being edited
            disableButtons(true);
            // update input values and remove div
            let parent = element.parentElement;
            newTaskInput.value = parent.querySelector("#taskname").innerText;
            // set updateNote to the task that is being edited
            updateNote = parent.id;
            // remove task
            parent.remove(); 
        });
    });

    // delete tasks
    deleteTasks = document.getElementsByClassName("delete");
    Array.from(deleteTasks).forEach((element, index) => {
        element.addEventListener("click", (e) => {
            e.stopPropagation();
            // delete from local storage and remove div
            let parent = element.parentElement;
            removeTask(parent.id);
            parent.remove();
            count -= 1;
        });
    });
}

// disable edit button
const disableButtons = (bool) => {
    let editButtons = document.getElementsByClassName("edit");
    Array.from(editButtons).forEach((element) => {
        element.disabled = bool;
    });
}

// remove task from local storage
const removeTask = (taskValue) => {
    localStorage.removeItem(taskValue);
    displayTasks();
}

// add tasks to local storage
const updateStorage = (index, taskValue, completed) => {
    localStorage.setItem(`${index}_${taskValue}`, completed);
    displayTasks();
}

// function to add new task
document.querySelector("#push").addEventListener("click", () => {
    // enable the edit button
    disableButtons(false);
    if(newTaskInput.value.length == 0){
        alert("Please enter a task")
    }else{
        // store locally and display from local storage
        if(updateNote == ""){
            // new task
            updateStorage(count, newTaskInput.value, false);
        }else{
            // update task
            let existingCount = updateNote.split("_")[0];
            removeTask(updateNote);
            updateStorage(existingCount, newTaskInput.value, false);
            updateNote = "";
        }
        count += 1;
        newTaskInput.value = "";
    }
});