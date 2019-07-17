let members = data.results[0].members;

createTable(members);
fillDropdown(members);

let repCheckbox = document.getElementById('rep-checkbox');
let demCheckbox = document.getElementById('dem-checkbox');
let indCheckbox = document.getElementById('ind-checkbox');
let parties = [];

repCheckbox.addEventListener('click', filterByParty);
demCheckbox.addEventListener('click', filterByParty);
indCheckbox.addEventListener('click', filterByParty);

function createTable(senateData) {

    let senatedata = document.getElementById('senate-data');
    let template = '';

    for (let i = 0; i < senateData.length; i++) {

        template += addRow(i);
    }

    senatedata.innerHTML = template;

}

function filterByParty() {

    let senateData = document.getElementById('senate-data');
    let template = '';
    let parties = [];

    if (repCheckbox.checked) {
        parties.push('R');
    }
    if (demCheckbox.checked) {
        parties.push('D');
    }
    if (indCheckbox.checked) {
        parties.push('I');
    }

    for (let i = 0; i < members.length; i++) {

        if (parties.length == 0 || parties.includes(members[i].party)) {
            template += addRow(i);
        }
    }

    senateData.innerHTML = template;
}

function addRow(i) {

    let row = '';

    row += `
            <tr>
            <td><a href='${members[i].url}'>${members[i].last_name}, ${members[i].first_name} ${members[i].middle_name || ''}</a></td>
            <td>${members[i].party}</td>
            <td>${members[i].state}</td>
            <td>${members[i].seniority}</td>
            <td>${members[i].votes_with_party_pct}</td>
            </tr>`
    return row;
}

function fillDropdown(members) {

    let senateStates = document.getElementById('senate-states');
    let states = [];

    for (let i = 0; i < members.length; i++) {
        if (states.indexOf(members[i].state) < 0) {
            states.push(members[i].state);
        }
    }

    states.sort();
    let stateDropdown = `<option>All States</option>`;

    for (let i = 0; i < states.length; i++) {
        stateDropdown += `
        <option>${states[i]}</option>`
    }

    senateStates.innerHTML = stateDropdown;
}