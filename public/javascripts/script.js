/** Registration Page Script**/

// is current hackathon an attribute? how do we make it persist

console.log('Client-side code running');

var currentHackathonParticipants = [];

var modal = document.getElementById('update-modal');



/** Binding event for on forms and loading table **/
//bindSubmitButton();

//document.addEventListener("DONContentLoaded", bindSubmitButton);
//document.addEventListener('DOMContentLoaded', bindModalElements);

//document.addEventListener('DOMContentLoaded', bindButtons);

class Participant {
    constructor(fName, lName, email) {
        this.firstName = fName;
        this.lastName = lName;
        this.email = email;
    }
}

/** Button for adding new participant to databas and table **/
// code inspired by https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

function bindSubmitButton() {

    console.log("and me?")

}
const button = document.getElementById("submit-participant-button");
console.log("binding button");
button.addEventListener('click', function(event) {
    console.log('add participant button was clicked');
    event.preventDefault();
    //validate name
    if (document.getElementById("participantFirstName").value === "") {
        alert("Please include the first name of the participant");
        return false;
    }
    if (document.getElementById("participantLastName").value === "") {
        alert("Please include the last name of the participant");
        return false;
    }
    if (document.getElementById("participantEmail").value === "") {
        alert("Please provide a valid email");
        return false;
    }

    var payload = new Headers();
    payload.append("fName", document.getElementById("participantFirstName").value);
    payload.append("lName", document.getElementById("participantLastName").value);
    payload.append("email", document.getElementById("participantEmail").value);

    console.log("ready for request");
    fetch('/insert', {method: 'GET', headers: payload})
        .then(function(response) {
            if(response.ok) {
                console.log('data was loaded to database');

                return response.json();

            }
            throw new Error('Request failed.');
        }).then(function (jsonObject) {
        console.log(jsonObject);
        //add to table
        //createRow(jsonObject['response']);
        displayNewParticpant(jsonObject['response'])


    }).catch(function(error) {
        console.log(error);
    });
})

/** Dislay participant after response from the datbase**/

function displayNewParticpant(jsonObject) {
    addParticipant(jsonObject['response']);

}

function addParticipant(formData) {
    console.log("adding participant button clicked");
    let table = document.getElementById('participant-table-body');
    let newIndex = table.rows.length;
    const participant = new Participant(formData.firstName, formData.lastName, formData.email);
    createRow(participant, newIndex);
    //return false;
}


/** Code for loading current hackathon **/

function configureCurrentHackathon(currentHackathon) {
    let list = document.getElementById('participant-list');
    let title = list.childNodes[1];
    title.textContent = "Participants for " + currentHackathon + " Hackathon";
    currentHackathonParticipants = getParticipants();
    console.log("populating");
    populateParticipantTable(currentHackathonParticipants);
}


/** Initial loading of data to participant table **/
function populateParticipantTable(participantsList) {
    let table = document.getElementById('participant-table-body');
    let count = table.rows.length;
    participantsList.forEach( function (participant) {
        createRow(participant, count);
        count++;
    });
}


/** create row for table **/
function createRow(participant, index) {
    let table = document.getElementById('participant-table-body');
    let row = document.createElement('tr');
    row.id = 'participant-row-' + index;

    //create cells
    let idCell =  document.createElement('td');
    idCell.textContent = participant.id;
    idCell.setAttribute('class', 'id-hidden');
    row.appendChild(idCell);

    let firstNameCell =  document.createElement('td');
    firstNameCell.textContent = participant.firstName;
    row.appendChild(firstNameCell);

    let lastNameCell = document.createElement('td');
    lastNameCell.textContent = participant.lastName;
    row.appendChild(lastNameCell);

    let emailCell = document.createElement('td');
    emailCell.textContent = participant.email;
    row.appendChild(emailCell);

    let updateCell = document.createElement('td');
    let updateButton = document.createElement('button');
    updateButton.innerText = "Update";
    updateButton.addEventListener('click', function (event) {
        console.log(event.target);
        openUpdateModal(event.target);
    });
    row.appendChild(updateButton);

    let deleteCell = document.createElement('td');
    let deleteButton = document.createElement('button');
    deleteButton.innerText = "Delete";
    //deleteButton.addEventListener('click', deleteRelationship);
    row.appendChild(deleteButton);

    table.appendChild(row);

}


function deleteRelationship(id) {
    console.log("delete relationship of participant: " + id);
}


/** Modal view for updating participant **/

function openUpdateModal(target) {
    // Get the modal
    let id = target.parentNode.firstChild.textContent;
    modal.style.display = "block";
    populateUpdateForm(id);
}


// When the user clicks the button, open the modal
function bindModalElements() {
    var span = document.getElementsByClassName("close")[0];
    span.addEventListener('click', closeUpdateView);
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            closeUpdateView();
        }
    }
}


function parseDataFromParticipantForm(formId) {
    event.preventDefault();
    let formData = document.getElementById(formId);

    var participantData = [];
    for(let i = 0; i <= 4; i++) {
        participantData.push(formData[i].value);
    }

    return participantData;
}


function getFormData() {
    //addToParticipanTable("participant-update-form");
    var participantData = parseDataFromParticipantForm("participant-update-form")
    /*
    let formData = document.getElementById("participant-update-form");

    var participantData = [];
    for(let i = 0; i <= 4; i++) {
        participantData.push(formData[i].value);
    }


    //updateRow(id, firstName, lastName, email);
    updateRow(participantData);
    event.preventDefault();
    */
    updateRow(participantData);
    closeUpdateView();
}

function updateRow(data) {

    let table = document.getElementById('participant-table-body');
    let row = table.children[data[0]-1];
    let cells = row.getElementsByTagName('td');

    for(let i = 0; i < cells.length; i++) {
        cells[i].textContent = data[i];
    }
}


function closeUpdateView() {
    modal.style.display = "none";
}

function updateParticipantData(formData) {
    let inputs = formData.getElementsByTagName('input');
    let firstName = inputs[0].textContent;
    let lastName = inputs[1].textContent;
    let email = inputs[2].textContent;
    console.log(inputs[0]);
    console.log(firstName);
    console.log(lastName);
    console.log(email);
}


function populateUpdateForm(id) {
    let participant = getParticipants()[id-1];

    let updateId = document.getElementById('update-participant-id');
    updateId.value = id;

    let updateFirstName = document.getElementById('update-firstname');
    updateFirstName.value = participant.firstName;

    let updateLastName = document.getElementById('update-lastname');
    updateLastName.value = participant.lastName;

    let updateEmail = document.getElementById('update-email');
    updateEmail.value = participant.email;

}


function getParticipants() {

    let participants = [
        {   id: 1,
            firstName: "John",
            lastName: "Hoffman",
            email: "hoofjo@oregonstate.edu"
        },
        {   id: 2,
            firstName: "Laura",
            lastName: "McKinney",
            email: "mckinnel@oregonstate.edu"
        },
        {   id: 3,
            firstName: "Steve",
            lastName: "Garcia",
            email: "garciast@oregonstate.edu"
        },
        {   id: 4,
            firstName: "Mo",
            lastName: "Adlouni",
            email: "adlouinimo@oregonstate.edu"
        },
        {   id: 5,
            firstName: "Tome",
            lastName: "Lee",
            email: "leetom@oregonstate.edu"
        },
        {   id: 6,
            firstName: "Sue",
            lastName: "Taylor",
            email: "taylors@oregonstate.edu"
        }
    ]
    console.log(participants[0].firstName);
    return participants;
}





/*

$(document).ready(function() {
    var maxAdded = 3; //maximum input boxes allowed
    var wrapper = $("#items"); //Fields wrapper
    var addFieldButton = $(".addParticipantFieldButton"); //Add button ID

    var x = 1; //initlal text box count
    $(addFieldButton).click(function(e) { //on add input button click
        e.preventDefault();
        if (x < maxAdded) { //max input box allowed
            x++; //text box increment
            $(wrapper).append(
                '<select name="participant" id="participant">' +
                '<option value="">choose participant</option>' +
                '<option value="1">Panther Bear</option>' +
                '<option value="2">Moco Loco</option>' +
                '</select>');
        }
    }

    */