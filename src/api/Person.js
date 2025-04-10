const URL = 'https://localhost:7279/api/Person/';
let displayGet = document.getElementById('result');

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
            </div>
        </div>
        `;

        return data;
    })
    .catch(error => console.error('Error:', error));
}

async function createPerson(firstName, lastName, documentType, document, dateBorn, phoneNumber, eps, genero, relatedPerson) {
    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            documentType: documentType,
            document: document,
            dateBorn: dateBorn,
            phoneNumber: phoneNumber,
            eps: eps,
            genero: genero,
            relatedPerson: relatedPerson
        })
    })
    .then(response => response.json())
    .then(data => {
        if (response.ok){
            alert('se ha agregado exitosamente')
        }else{
            alert('Error al agregar');
        }
    });
}


let btnGetId = document.getElementById('btnGetId');
window.addEventListener('DOMContentLoaded', () => {
    if (id.value === '') {
        getPerson();
    }
});

btnGetId.addEventListener('click', function(){
    if(id.value === ''){
        alert('Please insert a value');
        return;
    }else{
        getPersonById(id.value);
    }
});
