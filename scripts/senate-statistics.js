let members = data.results[0].members;

let statistics = {
    democrats: {
        members: 0,
        votes: 0
    },
    republicans: {
        members: 0,
        votes: 0
    },
    independents: {
        members: 0,
        votes: 0
    },
    total: {
        members: 0,
        votes: 0
    }
};

calculateStatistics(members);
atAGlance();
attendance();

function calculateStatistics(senateData) {

    senateData.forEach(senator => {

        if (senator.party == 'R') {
            statistics.republicans.members++;
            statistics.republicans.votes += senator.votes_with_party_pct;
        } else if (senator.party == 'D') {
            statistics.democrats.members++;
            statistics.democrats.votes += senator.votes_with_party_pct;
        } else if (senator.party == 'I') {
            statistics.independents.members++;
            statistics.independents.votes += senator.votes_with_party_pct;
        }

        statistics.total.members++;
        statistics.total.votes += senator.votes_with_party_pct;
    })

    statistics.republicans.votes /= statistics.republicans.members;
    statistics.democrats.votes /= statistics.democrats.members;
    statistics.independents.votes /= statistics.independents.members;
    statistics.total.votes /= statistics.total.members;
}

function atAGlance() {

    let senateStatistics = document.getElementById('senate-statistics');
    let statisticsTable = '';

    for (let party in statistics) {
    
        let partyCap = party.charAt(0).toUpperCase() + party.slice(1);

        statisticsTable += `
        <tr>
        <td>${partyCap}</td>
        <td>${statistics[party].members}</td>
        <td>${statistics[party].votes.toFixed(2)} %</td>
        </tr>`
    }

    senateStatistics.innerHTML = statisticsTable;
}

function attendance() {

    let orderedMembers = members.sort(function (a,b){return (a.missed_votes_pct - b.missed_votes_pct)});    
    let tenPercent = Math.round(members.length / 10);

    let mostEngaged = document.getElementById('senate-most-engaged');
    let leastEngaged = document.getElementById('senate-least-engaged');

    let mostEngagedTable = '';
    let leastEngagedTable = '';
    
    for (let i = 0; i < tenPercent; i++) {

        mostEngagedTable += `
        <tr>
        <td>${orderedMembers[i].first_name}</td>
        <td>${orderedMembers[i].missed_votes}</td>
        <td>${orderedMembers[i].missed_votes_pct} %</td>
        </tr>`        
    }

    for (let i = orderedMembers.length-1; i > orderedMembers.length-1-tenPercent; i--) {
        
        leastEngagedTable += `
        <tr>
        <td>${orderedMembers[i].first_name}</td>
        <td>${orderedMembers[i].missed_votes}</td>
        <td>${orderedMembers[i].missed_votes_pct} %</td>
        </tr>`
    }

    mostEngaged.innerHTML = mostEngagedTable;
    leastEngaged.innerHTML = leastEngagedTable;
}