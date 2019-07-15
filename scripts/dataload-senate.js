let members = data.results[0].members;

function createTable (senateData) {

    let housedata = document.getElementById("senate-data");

    for (let i = 0; i < senateData.length; i++) {
        
        let tr = document.createElement("tr");

        let fullName = document.createElement("td");
        let name = senateData[i].first_name;
        if (senateData[i].middle_name != null) {
            name = name + " " + senateData[i].middle_name;
        }
        name = name + " " + senateData[i].last_name;
        fullName.textContent = name;

        let party = document.createElement("td");
        party.textContent = senateData[i].party;

        let state = document.createElement("td");
        state.textContent = senateData[i].state;

        let yearsInOffice = document.createElement("td");
        yearsInOffice.textContent = senateData[i].seniority;

        let votes = document.createElement("td");
        votes.textContent = senateData[i].votes_with_party_pct;

        tr.append(name, party, state, yearsInOffice, votes);
        housedata.appendChild(tr);
        
    }
}

createTable(members);