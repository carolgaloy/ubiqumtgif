let members = data.results[0].members;
let pct = 0.1;

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

if (document.URL.indexOf("senate-attendance.html") >= 0) {
    attendance();
}

if (document.URL.indexOf("senate-loyalty.html") >= 0) {
    loyalty();
}

function calculateStatistics(senateData) {
    senateData.forEach(senator => {
        if (senator.party == "R") {
            statistics.republicans.members++;
            statistics.republicans.votes += senator.votes_with_party_pct;
        } else if (senator.party == "D") {
            statistics.democrats.members++;
            statistics.democrats.votes += senator.votes_with_party_pct;
        } else if (senator.party == "I") {
            statistics.independents.members++;
            statistics.independents.votes += senator.votes_with_party_pct;
        }

        statistics.total.members++;
        statistics.total.votes += senator.votes_with_party_pct;
    });

    if (statistics.republicans.members != 0) {
        statistics.republicans.votes /= statistics.republicans.members;
    }

    if (statistics.democrats.members != 0) {
        statistics.democrats.votes /= statistics.democrats.members;
    }

    if (statistics.independents.members != 0) {
        statistics.independents.votes /= statistics.independents.members;
    }

    if (statistics.total.members != 0) {
        statistics.total.votes /= statistics.total.members;
    }
}

function atAGlance() {
    let senateStatistics = document.getElementById("senate-statistics");
    let statisticsTable = "";

    for (let party in statistics) {
        let partyCap = party.charAt(0).toUpperCase() + party.slice(1);

        statisticsTable += `
        <tr>
        <td>${partyCap}</td>
        <td>${statistics[party].members}</td>
        <td>${statistics[party].votes.toFixed(2)} %</td>
        </tr>`;
    }

    senateStatistics.innerHTML = statisticsTable;
}

function attendance() {
    let orderedMembers = members.sort(function (a, b) {
        return a.missed_votes_pct - b.missed_votes_pct;
    });
    let tenPercent = Math.round(members.length * pct);

    let mostEngaged = document.getElementById("senate-most-engaged");
    let leastEngaged = document.getElementById("senate-least-engaged");

    let mostEngagedTable = "";
    let leastEngagedTable = "";

    for (let i = 0; i < tenPercent; i++) {
        mostEngagedTable += `
        <tr>
        <td><a href='${orderedMembers[i].url}'>${orderedMembers[i].last_name}, ${orderedMembers[i].first_name} ${orderedMembers[i].middle_name || ''}</a></td>
        <td>${orderedMembers[i].missed_votes}</td>
        <td>${orderedMembers[i].missed_votes_pct} %</td>
        </tr>`;
    }

    for (
        let i = orderedMembers.length - 1; i > orderedMembers.length - 1 - tenPercent; i--
    ) {
        leastEngagedTable += `
        <tr>
        <td><a href='${orderedMembers[i].url}'>${orderedMembers[i].last_name}, ${orderedMembers[i].first_name} ${orderedMembers[i].middle_name || ''}</a></td>
        <td>${orderedMembers[i].missed_votes}</td>
        <td>${orderedMembers[i].missed_votes_pct} %</td>
        </tr>`;
    }

    while (
        orderedMembers[tenPercent - 1].missed_votes_pct ==
        orderedMembers[tenPercent].missed_votes_pct
    ) {
        mostEngagedTable += `
        <tr>
        <td><a href='${orderedMembers[tenPercent].url}'>${orderedMembers[tenPercent].last_name}, ${orderedMembers[tenPercent].first_name} ${orderedMembers[tenPercent].middle_name || ''}</a></td>
        <td>${orderedMembers[tenPercent].missed_votes}</td>
        <td>${orderedMembers[tenPercent].missed_votes_pct} %</td>
        </tr>`;

        tenPercent++;
    }

    tenPercent = Math.round(members.length * pct);

    while (
        orderedMembers[orderedMembers.length - 1 - tenPercent].missed_votes_pct ==
        orderedMembers[orderedMembers.length - tenPercent].missed_votes_pct
    ) {
        leastEngagedTable += `
        <tr>
        <td>${
          orderedMembers[orderedMembers.length - 1 - tenPercent].first_name
        }</td>
        <td><a href='${orderedMembers[orderedMembers.length - 1 - tenPercent].url}'>${orderedMembers[orderedMembers.length - 1 - tenPercent].last_name}, ${orderedMembers[orderedMembers.length - 1 - tenPercent].first_name} ${orderedMembers[orderedMembers.length - 1 - tenPercent].middle_name || ''}</a></td>
        <td>${
          orderedMembers[orderedMembers.length - 1 - tenPercent].missed_votes
        }</td>
        <td>${
          orderedMembers[orderedMembers.length - 1 - tenPercent]
            .missed_votes_pct
        } %</td>
        </tr>`;
    }

    mostEngaged.innerHTML = mostEngagedTable;
    leastEngaged.innerHTML = leastEngagedTable;
}

function loyalty() {

    let orderedMembers = members.sort(function (a, b) {
        return a.votes_with_party_pct - b.votes_with_party_pct;
    });
    let tenPercent = Math.round(members.length * pct);

    let mostLoyal = document.getElementById("senate-most-loyal");
    let leastLoyal = document.getElementById("senate-least-loyal");

    let mostLoyalTable = "";
    let leastLoyalTable = "";

    for (let i = 0; i < tenPercent; i++) {
        leastLoyalTable += `
        <tr>
        <td>${orderedMembers[i].first_name}</td>
        <td>${orderedMembers[i].total_votes}</td>
        <td>${orderedMembers[i].votes_with_party_pct} %</td>
        </tr>`;
    }

    for (
        let i = orderedMembers.length - 1; i > orderedMembers.length - 1 - tenPercent; i--
    ) {
        mostLoyalTable += `
        <tr>
        <td>${orderedMembers[i].first_name}</td>
        <td>${orderedMembers[i].total_votes}</td>
        <td>${orderedMembers[i].votes_with_party_pct} %</td>
        </tr>`;
    }

    while (
        orderedMembers[tenPercent - 1].votes_with_party_pct ==
        orderedMembers[tenPercent].votes_with_party_pct
    ) {
        leastLoyalTable += `
        <tr>
        <td>${orderedMembers[tenPercent].first_name}</td>
        <td>${orderedMembers[tenPercent].total_votes}</td>
        <td>${orderedMembers[tenPercent].votes_with_party_pct} %</td>
        </tr>`;

        tenPercent++;
    }

    while (
        orderedMembers[orderedMembers.length - 1 - tenPercent].missed_votes_pct ==
        orderedMembers[orderedMembers.length - tenPercent].missed_votes_pct
    ) {
        mostLoyalTable += `
        <tr>
        <td>${
          orderedMembers[orderedMembers.length - 1 - tenPercent].first_name
        }</td>
        <td>${
          orderedMembers[orderedMembers.length - 1 - tenPercent].total_votes
        }</td>
        <td>${
          orderedMembers[orderedMembers.length - 1 - tenPercent]
            .votes_with_party_pct
        } %</td>
        </tr>`;

        tenPercent++;
    }

    mostLoyal.innerHTML = mostLoyalTable;
    leastLoyal.innerHTML = leastLoyalTable;

}