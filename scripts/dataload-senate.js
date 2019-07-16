let members = data.results[0].members;

createTable(members);

let repCheckbox = document.getElementById('rep-checkbox');
let demCheckbox = document.getElementById('dem-checkbox');
let indCheckbox = document.getElementById('ind-checkbox');
let parties = [];

repCheckbox.addEventListener('click', function () {
    if (repCheckbox.checked) {
        parties.push('R');
        filterByParty(members, parties);
    } else {
        let index = parties.indexOf('R');
        parties.splice(index, 1);
        filterByParty(members, parties);
    }
});

demCheckbox.addEventListener('click', function () {
    if (demCheckbox.checked) {
        parties.push('D');
        filterByParty(members, parties);
    } else {
        let index = parties.indexOf('D');
        parties.splice(index, 1);
        filterByParty(members, parties);
    }
});

indCheckbox.addEventListener('click', function () {
    if (indCheckbox.checked) {
        parties.push('I');
        filterByParty(members, parties);
    } else {
        let index = parties.indexOf('D');
        parties.splice(index, 1);
        filterByParty(members, parties);
    }
});

function createTable(senateData) {

    let senatedata = document.getElementById('senate-data');
    let template = '';

    for (let i = 0; i < senateData.length; i++) {

        template += addRow(i);
    }

    senatedata.innerHTML = template;

}

function filterByParty(senateData, parties) {

    let senatedata = document.getElementById('senate-data');
    let template = '';

    for (let i = 0; i < senateData.length; i++) {

        if (parties.length == 0) {
            template += addRow(i);
        } else if (parties.includes(members[i].party)) {
            template += addRow(i);
        }
    }

    senatedata.innerHTML = template;
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