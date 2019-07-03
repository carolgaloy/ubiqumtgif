let members = data.results[0].members;

function createTable (houseData) {

    let housedata = document.getElementById("house-data");

    for (let i = 0; i < houseData.length; i++) {
        
        let tr = document.createElement("tr");

        let name = document.createElement("td");
        name = houseData[i].first_name;
        if (houseData[i].middle_name != null) {
            name = name + " " + houseData[i].middle_name;
        }
        name = name + " " + houseData[i].last_name;
        name.textContent = name;

        let party = document.createElement("td");
        party.textContent = houseData[i].party;

        let state = document.createElement("td");
        state.textContent = houseData[i].state;

        let yearsInOffice = document.createElement("td");
        yearsInOffice.textContent = houseData[i].seniority;

        let votes = document.createElement("td");
        votes.textContent = houseData[i].votes_with_party_pct;

        tr.append(name, party, state, yearsInOffice, votes);
        housedata.appendChild(tr);
        
    }
}

createTable(members);