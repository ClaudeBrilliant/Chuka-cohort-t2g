// console.log(document);
window.onload = function() {
    loadProjects();
}
function handleNewProject(){
    let container = document.createElement('div');
    container.style.display = 'flex';

    let form = document.createElement('form');

    form.innerHTML = `
        <input type="text" id="projectName" placeholder="Enter Project Name" style="display:block; margin-bottom: 10px; padding:5px;">
        <input type="text" id="projectDetails" placeholder="Enter Project Details" style="display:block; margin-bottom: 10px; padding:5px;">
        <input type="text" id="client" placeholder="Enter Project Client" style="display:block; margin-bottom: 10px; padding:5px;">
        <input type="text" id="developer" placeholder="Enter Developer Name" style="display:block; margin-bottom: 10px; padding:5px;">
        <input type="date" id="startDate"  style="display:block; margin-bottom: 10px; padding:5px;">
        <input type="date" id="endDate"  style="display:block; margin-bottom: 10px; padding:5px;">

        <button type="submit" id="submitForm" style="display:block; padding:5px; background-color:blue; color:white;">Submit</button>
        <button type="button" id="cancelForm" style="display:block; padding:5px; background-color:red; color:white; margin-top:10px;">Cancel</button>



    `;

    container.appendChild(form);

    document.body.appendChild(container);

    document.getElementById('submitForm').addEventListener('click', submitForm);
    document.getElementById('cancelForm').addEventListener('click', 
        function(){
            container.removeChild(form);
            // if(!container)
        }
    )

}

function submitForm(e){
    e.preventDefault();

    let project ={
        name: document.getElementById('projectName').value,
        details: document.getElementById('projectDetails').value,
        client: document.getElementById('client').value,
        developer: document.getElementById('developer').value,
        startDate:document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value
    }

    let projects = JSON.parse(localStorage.getItem('projects')) || [];
    projects.push(project);
    localStorage.setItem('projects', JSON.stringify(projects));

    loadProjects();
}


function loadProjects(){
    let projects= JSON.parse(localStorage.getItem('projects')) || [];
    let table = document.querySelector('tbody');
    table.innerHTML = ``

    projects.forEach((project, index) => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${project.name}</td>
            <td>${project.details}</td>
            <td>${project.client}</td>
            <td>${project.developer}</td>
            <td>${project.startDate}</td>
            <td>${project.endDate}</td>

            <td>
                 <button class="edit-button"> Edit</button>
                 <button onClick="handleDelete(${index})" class="delete-button"> Delete</button>
                 </td>

        `;

        table.appendChild(row)
    }

    )

}

function handleDelete(index){
    let projects =JSON.parse(localStorage.getItem('projects')) || [];
    projects.splice(index, 1);
    localStorage.setItem('projects', JSON.stringify(projects));

    loadProjects();

}


