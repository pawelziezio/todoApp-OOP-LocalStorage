class Task{
    constructor(taskText,deadline){
        this.taskText = taskText;
        this.deadline = deadline;
        const date = new Date();
        const addZero = (z) => {
            return (parseInt(z) < 10 ? `0${z}` : z );
        }
        this.dateText = addZero(date.getDate()) + '-' + addZero(date.getMonth()+1) + '-' + date.getFullYear() + ' godz.: ' + addZero(date.getHours()) + ':' + addZero(date.getMinutes());
    }

    static updateList(item){
        let tempTaskText = `
            <div class="task">
                <div class="task-toolbar">
                    <h3 class="task-date">${item.dateText} >>> ${item.deadline}</h3>
                    <button class="task-delete" title="delete task">
                        <i class="fas fa-times-circle"></i>
                    </button>
                </div>
                <p class="task-text">
                    ${item.taskText}
                </p>
            </div> `;
        const todoList = document.getElementById('todoList');
        todoList.innerHTML += tempTaskText;
    }

    static updateLocalStorage(task){
        const tasksListArray = [];
        tasksListArray.push(task);

        if (localStorage.getItem('tasksList')){
            let tempArray = JSON.parse(localStorage.getItem('tasksList'));
            tempArray.push(task);
            localStorage.setItem('tasksList', JSON.stringify(tempArray));
        } else {
            localStorage.setItem('tasksList', JSON.stringify(tasksListArray));
        }
    }

    static loadOnEnter(){

        if (localStorage.getItem('tasksList')){
            let tempArray = JSON.parse(localStorage.getItem('tasksList'));
            tempArray.forEach(item => {
                Task.updateList(item)
            });
        }
    }

    static removeTask(e){

        if (e.target.closest('.task-delete')) {
            let tempArray = [];
            let textTemp = e.target.closest('.task-toolbar').nextElementSibling.innerText;

            if (localStorage.getItem('tasksList')){
                tempArray = JSON.parse(localStorage.getItem('tasksList'));
            }
            tempArray = tempArray.filter(task=>(task.taskText.trim() !== textTemp.trim()));
            localStorage.setItem('tasksList', JSON.stringify(tempArray));
            e.target.closest('.task').remove();
            tempArray = null;
        }
    }

    static submitTask(){

        const messageText = message.value;
        const deadlineText = deadline.value;
        if (messageText !== '') {
            const task = new Task(messageText, deadlineText);
            Task.updateList(task);
            Task.updateLocalStorage(task);

            message.value = '';
            deadline.value = '';
        }
    }

    static search(e){

        const inputVal = e.target.value;
        const tasks = todoList.querySelectorAll('.task');

        [...tasks].forEach((task)=>{
            const textTemp = task.lastElementChild.innerText;
            if (textTemp.indexOf(inputVal) !== -1) {
                task.style.display = 'block';
            } else {
                task.style.display = 'none';
            }
        });

    }
}

document.addEventListener('DOMContentLoaded', function() {
    const message = document.querySelector('#message')
    const deadline = document.querySelector('#deadline');
    const form = document.querySelector('#form');
    const search = document.getElementById('todoSearch');
    const todoList = document.getElementById('todoList');

    Task.loadOnEnter();

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        Task.submitTask(e);
    })

    todoList.addEventListener('click', function(e) {
        e.preventDefault();
        Task.removeTask(e);
    });

    search.addEventListener('input', function(e){
        e.preventDefault();
        Task.search(e);

    })
})