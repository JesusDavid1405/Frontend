const URL = 'https://localhost:7279/api/RolUser/';
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

//==============================================================
//Mapper in the Select
const URL_USER = 'https://localhost:7279/api/User';
const URL_ROL = 'https://localhost:7279/api/Rol';

async function cargarRolsEnSelect() {
    try {
        const response = await fetch(URL_ROL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        const selectRolEdit = document.getElementById('EditRol');
        const selectRol = document.getElementById('Rol');

        selectRol.innerHTML='';
        selectRolEdit.innerHTML='';


        data.forEach(rol => {
            
            const option1 = document.createElement('option');
            option1.value = rol.id; 
            option1.text = rol.name;            
            
            const option2 = document.createElement('option');
            option2.value = rol.id;
            option2.text = rol.name;
        
            selectRol.appendChild(option1);
            selectRolEdit.appendChild(option2);
        });
        

    } catch (error) {
        console.error('Error al cargar rols:', error);
    }
}

async function cargarUsersEnSelect() {
    try {
        const response = await fetch(URL_USER, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        const selectUserEdit = document.getElementById('EditUser');
        const selectUser = document.getElementById('User');

        selectUser.innerHTML='';
        selectUserEdit.innerHTML='';


        data.forEach(rol => {
            
            const option1 = document.createElement('option');
            option1.value = rol.id; 
            option1.text = rol.id;            
            
            const option2 = document.createElement('option');
            option2.value = rol.id; 
            option2.text = rol.id;
        
            selectUser.appendChild(option1);
            selectUserEdit.appendChild(option2);
        });
        

    } catch (error) {
        console.error('Error al cargar rols:', error);
    }
}


//===============================================================
//Ejecutando el modal por medio de escuchar un click en el boton
btnCrear.addEventListener('click', function(){
    cargarRolsEnSelect();   
    cargarUsersEnSelect();
    ModalCrear.show();
})

let RolId
let UserId

async function getUser() {
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
                    <p class="col-md">${element.rolId}</p>
                    <p class="col-md">${element.userId}</p>
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

async function getUserById(id) {
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
                <p class="col-md">${data.rolId}</p>
                <p class="col-md">${data.userId}</p>
                <div class="col-md">
                    <button class="editar btnLittle" data-id="${data.id}"><i class="fas fa-edit icon"></i></button>
                </div>
                <div class="col-md">
                    <button class="borrar btnLittle" data-id="${data.id}"><i class="fas fa-trash-alt icon"></i></button>
                </div>
            </div>
        </div>
        `;

        return data;
    })
    .catch(error => console.error('Error:', error));
}   

async function createUser(rolId, UserId) {
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                RolId: rolId,
                UserId: UserId,
                IsDeleted: false
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Se ha agregado exitosamente');
            ModalCrear.hide(); // Opcional: cierra el modal después de guardar
            displayGet.innerHTML='';
            getUser(); // Opcional: refresca la lista
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

async function updateUser(id, rolId, userId) {
    try {
        const response = await fetch(URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Id: id,
                RolId: rolId,
                UserId: userId
            })
        });

        if (response.ok) {
            alert('Registro actualizado con éxito.');
            ModalUpdate.hide();
            displayGet.innerHTML = '';
            getUser(); // refresca la lista
        } else {
            const errorData = await response.json();
            alert('Error al actualizar: ' + (errorData.message || 'Error desconocido'));
        }
    } catch (error) {
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
            // Rellenar los campos del formulario
            document.getElementById('EditId').value = data.id;            
            document.getElementById('EditRol').value = data.rolId;

            cargarRolsEnSelect();
            cargarUsersEnSelect();
            ModalUpdate.show();

        } else {
            console.error('Error al obtener los datos para editar');
        }
    } catch (error) {
        console.error('Error al obtener persona por ID:', error);
    }
}

async function DeleteUser(id) {
    const response = await fetch(URL+'persistent/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if(response.ok){
        ModalHead.innerText = 'Ok';
        ModalContent.innerHTML = `<h4>Registro Eliminado correctamente</h4>`;
        displayGet.innerHTML = '';
        getUser();
    }else{
        ModalHead.innerText = 'Error';
        ModalContent.innerHTML= `<h4>Error al eliminar el registro</h4>`;
    }

    Modal.show();
}


let btnGetId = document.getElementById('btnGetId');
window.addEventListener('DOMContentLoaded', () => {
    if (id.value === '') {
        getUser();
    }
});

btnGetId.addEventListener('click', function(){
    if(id.value === ''){
        ModalContent.innerHTML= '<h4>Please insert a value</h4>';
        Modal.show();
        return;
    }else{
        getUserById(id.value);
    }
});

btnGuardar.addEventListener('click', function () {
    RolId = document.getElementById('Rol');
    UserId = document.getElementById('User');

    // Validación general
    if (    
        !RolId.value.trim() ||
        !UserId.value.trim() 
    ) {
        alert("Por favor, complete todos los campos antes de guardar.");
        return;
    }

    // Llamar a la función solo si todo está completo
    createUser(
        RolId.value,
        UserId.value
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
    let idUser = document.getElementById('EditId')
    RolId = document.getElementById('EditRol')
    UserId = document.getElementById('EditUser')

    if (
        !idUser.value.trim() ||
        !RolId.value.trim() ||
        !UserId.value.trim() 
    ) {
        alert("Por favor, complete todos los campos antes de guardar.");
        return;
    }

    
    updateUser(
        idUser.value,
        RolId.value,
        UserId.value
    )

});

displayGet.addEventListener('click', function(event){
    const btn = event.target.closest('.borrar');
    if(btn){
        const personId = btn.getAttribute('data-id');
        DeleteUser(personId);
    }
})


