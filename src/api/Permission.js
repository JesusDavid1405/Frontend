const URL = 'https://localhost:7279/api/Permission/';
let displayGet = document.getElementById('result');

//================================================================
//Variables que instancia un modal y obtiene el id del cuerpo para 
//mostrar el contenido deseado
let Modal = new bootstrap.Modal(document.getElementById('ModalAlert'));
let ModalCrear = new bootstrap.Modal(document.getElementById('ModalCreate'));
let ModalUpdate = new bootstrap.Modal(document.getElementById('ModalUpdate'));
let ModalContent = document.getElementById('modal-content');
let ModalHead = document.getElementById('modalHead');

//===============================================================
//Obteniendo el Id del Boton AgregarPersona para mostrar el modal
let btnCrear = document.getElementById('btnCrear');
let btnGuardar = document.getElementById('btnGuardar');
let btnGuardarCambios = document.getElementById('btnGuardarCambios');

//===============================================================
//Ejecutando el modal por medio de escuchar un click en el boton
btnCrear.addEventListener('click', function(){
    ModalCrear.show();
})

let name
let description



async function getPermission() {
    const response = await fetch(URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        let contador = 0;
        data.forEach(element => {
            contador ++
            displayGet.innerHTML += `
            <div class="list">
                <div class="row">
                    <h5 class="col-md ms-2">${contador}</h5>
                    <p class="col-md">${element.name}</p>
                    <p class="col-md">${element.description}</p>
                    <div class="col-md">
                        <button class="editar btnLittle" data-id="${element.id}"><i class="fas fa-edit icon"></i></button>
                    </div>
                    <div class="col-md">
                        <button class="borrar btnLittle" data-id="${element.id}"><i class="fas fa-trash-alt icon"></i></button>
                    </div>
                </div>
            </div>
            `;
        });

        return data;
    })
    .catch(error => console.error('Error:', error));
}

let id = document.getElementById('id');

async function getPermissionById(id) {
    displayGet.innerHTML = ''; 

    const response = await fetch(URL + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        displayGet.innerHTML += `
        <div class="list">
            <div class="row">
                <h5 class="col-md ms-2">${data.id}</h5>
                <p class="col-md">${data.name}</p>
                <p class="col-md">${data.description}</p>
                <div class="col-md">
                    <button class="editar btnLittle" data-id="${data.id}"><i class="fas fa-edit icon"></i></button>
                </div>
                <p id="Delete" class="col-md btnLittle" onclick="editPerson(${data.id})">
                    <i class="fas fa-trash-alt icon"></i>
                </p>
            </div>
        </div>
        `;

        return data;
    })
    .catch(error => console.error('Error:', error));
}   

async function createPermission(name, description) {
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Name: name,
                Description: description
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Se ha agregado exitosamente');
            ModalCrear.hide(); // Opcional: cierra el modal después de guardar
            displayGet.innerHTML='';
            getPermission(); // Opcional: refresca la lista
        } else {
            ModalContent.innerHTML = `<h4>Error: ${data.message || 'No se ha podido agregar el registro'}</h4>`;
            Modal.show();
        }
    } catch (error) {
        console.error('Error al crear persona:', error);
        ModalContent.innerHTML = `<h4>Error inesperado</h4>`;
        Modal.show();
    }
}

async function updatePermission(id, name, description) {
    try{
        const response = await fetch(URL ,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Id: id,
                Name: name,
                Description: description
            })
        });

        if (response.ok) {
            alert('Registro actualizado con éxito.');
            ModalUpdate.hide();
            displayGet.innerHTML = '';
            getPermission(); // volver a renderizar la lista
        } else {
            alert('Error al actualizar.');
        }
    }
    catch{
        console.error('Error al actualizar:', error);
    }
}

async function openEditModalById(RolId) {
    try {
        const response = await fetch(URL + RolId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            console.log(data)
            // Rellenar los campos del formulario
            document.getElementById('EditId').value = data.id;
            document.getElementById('EditName').value = data.name;
            document.getElementById('EditDescription').value = data.description;

            ModalUpdate.show();
        } else {
            console.error('Error al obtener los datos para editar');
        }
    } catch (error) {
        console.error('Error al obtener persona por ID:', error);
    }
}

async function DeletePermission(id) {
    const response = await fetch(URL+'permanent/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if(response.ok){
        ModalHead.innerText = 'Ok';
        ModalContent.innerHTML = `<h4>Registro Eliminado correctamente</h4>`;
        displayGet.innerHTML = '';
        getPermission();
    }else{
        ModalHead.innerText = 'Error';
        ModalContent.innerHTML= `<h4>Error al eliminar el registro</h4>`;
    }

    Modal.show();
}


let btnGetId = document.getElementById('btnGetId');
window.addEventListener('DOMContentLoaded', () => {
    if (id.value === '') {
        getPermission();
    }
});

btnGetId.addEventListener('click', function(){
    if(id.value === ''){
        ModalContent.innerHTML= '<h4>Please insert a value</h4>';
        Modal.show();
        return;
    }else{
        getPermissionById(id.value);
    }
});

btnGuardar.addEventListener('click', function () {
    name = document.getElementById('Name');
    description = document.getElementById('Description');

    // Validación general
    if (
        !name.value.trim() ||
        !description.value.trim() 
    ) {
        alert("Por favor, complete todos los campos antes de guardar.");
        return;
    }

    // Llamar a la función solo si todo está completo
    createPermission(
        name.value,
        description.value
    );
});

displayGet.addEventListener('click', function(event) {
    const btn = event.target.closest('.editar');
    if (btn) {
        const RolId = btn.getAttribute('data-id');
        openEditModalById(RolId);
        ModalUpdate.show();
    }
});

btnGuardarCambios.addEventListener('click', function(){
    let idRol = document.getElementById('EditId')
    name = document.getElementById('EditName')
    description = document.getElementById('EditDescription')
    if (
        !idRol.value.trim() ||
        !name.value.trim() ||
        !description.value.trim() 
    ) {
        alert("Por favor, complete todos los campos antes de guardar.");
        return;
    }

    updatePermission(
        idRol.value,
        name.value,
        description.value
    )

});

displayGet.addEventListener('click', function(event){
    const btn = event.target.closest('.borrar');
    if(btn){
        const personId = btn.getAttribute('data-id');
        DeletePermission(personId);
    }
})