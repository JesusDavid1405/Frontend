const URL = 'https://localhost:7279/api/Person/';
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

let firstName
let lastName
let documentType
let Documents
let dateBorn
let phoneNumber
let eps
let genero
let relatedPerson


async function getPerson() {
    const response = await fetch(URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            displayGet.innerHTML += `
            <div class="list">
                <div class="row">
                    <h5 class="col-md ms-2">${element.id}</h5>
                    <p class="col-md">${element.firstName} ${element.lastName}</p>
                    <p class="col-md">${element.documentType}</p>
                    <p class="col-md">${element.document}</p>
                    <p class="col-md">${element.dateBorn}</p>
                    <p class="col-md">${element.phoneNumber}</p>
                    <p class="col-md">${element.eps}</p>
                    <p class="col-md">${element.genero}</p>
                    <p class="col-md">${element.relatedPerson}</p>
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

async function getPersonById(id) {
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
                <p class="col-md">${data.firstName} ${data.lastName}</p>
                <p class="col-md">${data.documentType}</p>
                <p class="col-md">${data.document}</p>
                <p class="col-md">${data.dateBorn}</p>
                <p class="col-md">${data.phoneNumber}</p>
                <p class="col-md">${data.eps}</p>
                <p class="col-md">${data.genero}</p>
                <p class="col-md">${data.relatedPerson}</p>
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

async function createPerson(firstName, lastName, documentType, document, dateBorn, phoneNumber, eps, genero, relatedPerson) {
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                FirstName: firstName,
                LastName: lastName,
                DocumentType: documentType,
                Document: document,
                DateBorn: dateBorn,
                PhoneNumber: phoneNumber,
                Eps: eps,
                Genero: genero,
                RelatedPerson: relatedPerson
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Se ha agregado exitosamente');
            ModalCrear.hide(); // Opcional: cierra el modal después de guardar
            displayGet.innerHTML='';
            getPerson(); // Opcional: refresca la lista
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

async function updatePerson(id, firstName, lastName, documentType, document, dateBorn, phoneNumber, eps, genero, relatedPerson) {
    try{
        const response = await fetch(URL ,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Id: id,
                FirstName: firstName,
                LastName: lastName,
                DocumentType: documentType,
                Document: document,
                DateBorn: dateBorn,
                PhoneNumber: phoneNumber,
                Eps: eps,
                Genero: genero,
                RelatedPerson: relatedPerson
            })
        });

        if (response.ok) {
            alert('Registro actualizado con éxito.');
            ModalUpdate.hide();
            displayGet.innerHTML = '';
            getPerson(); // volver a renderizar la lista
        } else {
            alert('Error al actualizar.');
        }
    }
    catch{
        console.error('Error al actualizar:', error);
    }
}

async function openEditModalById(personId) {
    try {
        const response = await fetch(URL + personId, {
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
            document.getElementById('EditFirstName').value = data.firstName;
            document.getElementById('EditLastName').value = data.lastName;
            document.getElementById('EditDocumentType').value = data.documentType;
            document.getElementById('EditDocument').value = data.document;
            document.getElementById('EditDateBorn').value = data.dateBorn.split('T')[0]; // para formato YYYY-MM-DD
            document.getElementById('EditPhoneNumber').value = data.phoneNumber;
            document.getElementById('EditEps').value = data.eps;
            document.getElementById('EditGenero').value = data.genero;
            document.getElementById('EditRelatedPerson').value = data.relatedPerson ? 'Si' : 'No';

            ModalUpdate.show();
        } else {
            console.error('Error al obtener los datos para editar');
        }
    } catch (error) {
        console.error('Error al obtener persona por ID:', error);
    }
}

async function DeletePerson(id) {
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
        getPerson();
    }else{
        ModalHead.innerText = 'Error';
        ModalContent.innerHTML= `<h4>Error al eliminar el registro</h4>`;
    }

    Modal.show();
}


let btnGetId = document.getElementById('btnGetId');
window.addEventListener('DOMContentLoaded', () => {
    if (id.value === '') {
        getPerson();
    }
});

btnGetId.addEventListener('click', function(){
    if(id.value === ''){
        ModalContent.innerHTML= '<h4>Please insert a value</h4>';
        Modal.show();
        return;
    }else{
        getPersonById(id.value);
    }
});

btnGuardar.addEventListener('click', function () {
    firstName = document.getElementById('FirstName');
    lastName = document.getElementById('LastName');
    documentType = document.getElementById('DocumentType');
    Documents = document.getElementById('Document');
    dateBorn = document.getElementById('DateBorn');
    phoneNumber = document.getElementById('PhoneNumber');
    eps = document.getElementById('Eps');
    genero = document.getElementById('genero');
    relatedPerson = document.getElementById('RelatedPerson');

    // Validación general
    if (
        !firstName.value.trim() ||
        !lastName.value.trim() ||
        !documentType.value.trim() ||
        !Documents.value.trim() ||
        !dateBorn.value.trim() ||
        !phoneNumber.value.trim() ||
        !eps.value.trim() ||
        !genero.value.trim() ||
        !relatedPerson.value.trim()
    ) {
        alert("Por favor, complete todos los campos antes de guardar.");
        return;
    }

    // Convertir "Si" o "No" a booleano
    const isRelated = relatedPerson.value.trim().toLowerCase() === "si";

    // Llamar a la función solo si todo está completo
    createPerson(
        firstName.value,
        lastName.value,
        documentType.value,
        Documents.value,
        dateBorn.value,
        phoneNumber.value,
        eps.value,
        genero.value,
        isRelated
    );
});

displayGet.addEventListener('click', function(event) {
    const btn = event.target.closest('.editar');
    if (btn) {
        const personId = btn.getAttribute('data-id');
        openEditModalById(personId);
        ModalUpdate.show();
    }
});

btnGuardarCambios.addEventListener('click', function(){
    let idPerson = document.getElementById('EditId')
    firstName = document.getElementById('EditFirstName')
    lastName = document.getElementById('EditLastName')
    documentType = document.getElementById('EditDocumentType')
    Documents = document.getElementById('EditDocument')
    dateBorn = document.getElementById('EditDateBorn')
    phoneNumber = document.getElementById('EditPhoneNumber')
    eps = document.getElementById('EditEps')
    genero = document.getElementById('EditGenero')
    relatedPerson = document.getElementById('EditRelatedPerson')

    if (
        !idPerson.value.trim() ||
        !firstName.value.trim() ||
        !lastName.value.trim() ||
        !documentType.value.trim() ||
        !Documents.value.trim() ||
        !dateBorn.value.trim() ||
        !phoneNumber.value.trim() ||
        !eps.value.trim() ||
        !genero.value.trim() ||
        !relatedPerson.value.trim()
    ) {
        alert("Por favor, complete todos los campos antes de guardar.");
        return;
    }

    // Convertir "Si" o "No" a booleano
    const isRelated = relatedPerson.value.trim().toLowerCase() === "si";

    updatePerson(
        idPerson.value,
        firstName.value,
        lastName.value,
        documentType.value,
        Documents.value,
        dateBorn.value,
        phoneNumber.value,
        eps.value,
        genero.value,
        isRelated
    )

});

displayGet.addEventListener('click', function(event){
    const btn = event.target.closest('.borrar');
    if(btn){
        const personId = btn.getAttribute('data-id');
        DeletePerson(personId);
    }
})