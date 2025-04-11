const URL = 'https://localhost:7279/api/User/';
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
const URL_PERSON = 'https://localhost:7279/api/Person';

async function cargarPersonasEnSelect() {
    try {
        const response = await fetch(URL_PERSON, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        const selectPersonEdit = document.getElementById('EditPerson');
        const selectPerson = document.getElementById('Person');

        selectPerson.innerHTML='';
        selectPersonEdit.innerHTML='';

        data.forEach(persona => {
            
            const option1 = document.createElement('option');
            option1.value = persona.id; 
            option1.text = persona.firstName;            
        
            const option2 = document.createElement('option');
            option2.value = persona.id;
            option2.text = persona.firstName;
        
            selectPerson.appendChild(option1);
            selectPersonEdit.appendChild(option2);
        });
        

    } catch (error) {
        console.error('Error al cargar personas:', error);
    }
}


//===============================================================
//Ejecutando el modal por medio de escuchar un click en el boton
btnCrear.addEventListener('click', function(){
    cargarPersonasEnSelect();   
    ModalCrear.show();
})

let Email
let Password
let Active
let PersonId
let Name
let RegistrationDate

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
                    <p class="col-md">${element.email}</p>
                    <p class="col-md">${element.active}</p>
                    <p class="col-md">${element.registrationDate}</p>
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
                <p class="col-md">${data.email}</p>
                <p class="col-md">${data.active}</p>
                <p class="col-md">${data.registrationDate}</p>
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

async function createUser(email, password, registrationDate, personId) {
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Email: email,
                Password: password,
                Active: true,
                IsDeleted: false, 
                RegistrationDate: registrationDate,
                PersonId: personId
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

async function updateUser(id, email, password, active, registrationDate, personId) {
    try {
        const response = await fetch(URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Id: id,
                Email: email,
                Password: password,
                Active: active,
                IsDeleted: false, 
                RegistrationDate: registrationDate,
                PersonId: personId
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
            document.getElementById('EditEmail').value = data.email;
            document.getElementById('EditPassword').value = data.password;
            document.getElementById('EditRegistrationDate').value = data.registrationDate;
            document.getElementById('EditActive').value = data.active;
            document.getElementById('EditPerson').value = data.personId;

            cargarPersonasEnSelect();
            ModalUpdate.show();

        } else {
            console.error('Error al obtener los datos para editar');
        }
    } catch (error) {
        console.error('Error al obtener persona por ID:', error);
    }
}

async function DeleteUser(id) {
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
    Email = document.getElementById('Email')
    Password = document.getElementById('Password')
    RegistrationDate = new Date().toISOString();
    PersonId = document.getElementById('Person')

    // Validación general
    if (    
        !Email.value.trim() ||
        !Password.value.trim() ||
        !PersonId.value.trim() 
    ) {
        alert("Por favor, complete todos los campos antes de guardar.");
        return;
    }


    // Llamar a la función solo si todo está completo
    createUser(
        Email.value,
        Password.value,
        RegistrationDate,
        PersonId.value
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
    Email = document.getElementById('EditEmail')
    Password = document.getElementById('EditPassword')
    Active = document.getElementById('EditActive')
    RegistrationDate = document.getElementById('EditRegistrationDate')
    PersonId = document.getElementById('EditPerson')

    if (
        !idUser.value.trim() ||
        !Email.value.trim() ||
        !Password.value.trim() ||
        !Active.value.trim() ||
        !RegistrationDate.value.trim() ||
        !PersonId.value.trim() 
    ) {
        alert("Por favor, complete todos los campos antes de guardar.");
        return;
    }

    const isActive = Active.value.trim().toLowerCase() === "si";

    
    updateUser(
        idUser.value,
        Email.value,
        Password.value,
        isActive.value,
        RegistrationDate.value,
        PersonId.value
    )

});

displayGet.addEventListener('click', function(event){
    const btn = event.target.closest('.borrar');
    if(btn){
        const personId = btn.getAttribute('data-id');
        DeleteUser(personId);
    }
})


