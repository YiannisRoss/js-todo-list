
import { tasksArray, newTask } from "./task-creation";




    
let parent = document.getElementById('container')

let newTaskButton = document.createElement('button')

let tasksDiv = document.createElement('div')

let tasksList = document.createElement('ul')

export function initialBuild() {

        newTaskButton.innerHTML = 'Create a new task'
        newTaskButton.setAttribute('id', 'new-task-button')

        newTaskButton.addEventListener('click', function() {newTask(prompt("What is the task's name?"))})
        parent.appendChild(newTaskButton)

        parent.appendChild(tasksDiv)

        tasksDiv.setAttribute('id', 'tasks-div')
        



    updateTasksDiv()
    

    tasksDiv.appendChild(tasksList)
    

}

export function updateTasksDiv() {
    tasksList.innerHTML = ''
    if ( tasksArray == null || tasksArray.length == 0) {
        tasksList.innerHTML = 'Nothing on your to-do list yet'
    }
    else {
        let i = 0
        while (i < tasksArray.length) {
            let taskElement = document.createElement('div')
                taskElement.innerHTML = `${tasksArray[i].name}`
                tasksList.appendChild(taskElement)
                taskElement.task = tasksArray[i]
                taskElement.isExpanded = false;
                taskElement.setAttribute('class', 'task-element')

                taskElement.addEventListener('click', function() { expandView(taskElement) })
                
                i++

        }
    }
}
 
function expandView(taskElement){
    console.log(`clicked task ${taskElement.task.name}, id ${taskElement.task.id}`)
    if (!taskElement.isExpanded) {
        taskElement.style.height = '50vh'


        buildDescription(taskElement)

            
        taskElement.isExpanded = true

        let dueDateField = document.createElement('input')
            dueDateField.setAttribute('type','date')
            dueDateField.setAttribute('class','due-date-field')

            dueDateField.defaultValue = taskElement.task.dueDate
            taskElement.appendChild(dueDateField) 

            dueDateField.addEventListener('input', e => {
                taskElement.task.dueDate = dueDateField.value
            })
        
        let priorityDropdown = document.createElement('select')
        priorityDropdown.setAttribute('class','priority-dropdown')

            let highPriority = document.createElement('option')
            
                highPriority.value = 'High'
                highPriority.innerHTML = 'High'
                priorityDropdown.appendChild(highPriority)
                let lowPriority = document.createElement('option')
                priorityDropdown.appendChild(lowPriority)
                lowPriority.value = 'Low'
                lowPriority.innerHTML = 'Low'

                priorityDropdown.defaultValue = taskElement.task.priority
                if (taskElement.task.priority == 'High') {
                    highPriority.selected = 'selected'
                }
                else {lowPriority.selected = 'selected'}
                taskElement.appendChild(priorityDropdown)

                priorityDropdown.addEventListener('input', e => {
                    taskElement.task.priority = priorityDropdown.value

                })
        
        let hideButton = document.createElement('button')
            hideButton.innerHTML = 'hide'
            hideButton.setAttribute('class', 'hide-button')
            taskElement.appendChild(hideButton)
            hideButton.setAttribute('onclick',"event.stopPropagation()")
            hideButton.addEventListener('click', function() { minimizeView(taskElement) })

        let deleteButton = document.createElement('button')
            deleteButton.innerHTML = 'delete'
            deleteButton.setAttribute('class', 'delete-button')
            taskElement.appendChild(deleteButton)
            deleteButton.addEventListener('click',e => { 
                let taskToDelete = tasksArray.find(element => element.id == taskElement.task.id)
                console.log(`deleting task ${taskToDelete.name}, id: ${taskToDelete.id}`)
                let index = tasksArray.indexOf(taskToDelete)
                
                 if (index > -1) {
                     tasksArray.splice(index, 1)
                     updateTasksDiv()
                 }
                 localStorage.setItem("tasks", JSON.stringify(tasksArray));

             })
    } 
}

function minimizeView(taskElement) {

    if (taskElement.isExpanded) {
        taskElement.style.height = ''
        taskElement.innerHTML = taskElement.task.name

        taskElement.isExpanded = false
    }
}

function buildDescription(taskElement){


    let taskDescriptionDiv = document.createElement('div')
    taskDescriptionDiv.setAttribute('class','description-div') 
    taskDescriptionDiv.innerHTML = taskElement.task.description
    taskDescriptionDiv.addEventListener('click', function(){clickTaskDescription(taskDescriptionDiv, taskElement)})
    taskElement.appendChild(taskDescriptionDiv) 



   
    taskElement.isExpanded = true

}


function clickTaskDescription(taskDescriptionDiv, taskElement){

    console.log('task description clicked')
    let clickedTaskDescription = document.createElement('div')
        clickedTaskDescription.setAttribute('class', 'clicked-task-description')

        let taskDescriptionField = document.createElement('input')
        taskDescriptionField.setAttribute('type','text') 
        taskDescriptionField.defaultValue = taskElement.task.description

        let descriptionUpdateButton = document.createElement('button')
        descriptionUpdateButton.innerHTML = 'Update description'
        descriptionUpdateButton.addEventListener('click', function() { updateTaskDescription(taskElement, taskDescriptionDiv, taskDescriptionField) })
        
        clickedTaskDescription.appendChild(taskDescriptionField)
        clickedTaskDescription.appendChild(descriptionUpdateButton)
        taskDescriptionDiv.replaceWith(clickedTaskDescription)

}

function updateTaskDescription(taskElement, taskDescriptionDiv, taskDescriptionField) {

    console.log('update description clicked: ' + taskDescriptionField.value)

    console.log(taskDescriptionDiv.innerHTML)

    taskElement.task.description = taskDescriptionField.value
    console.log(taskElement.task.description)
    document.getElementsByClassName('clicked-task-description').innerHTML = ''

    minimizeView(taskElement)
    updateTasksDiv()
}

