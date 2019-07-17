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

    let mostEngagedArray = [];
    let leastEngagedArray = [];

    for (let i = 0; i < tenPercent; i++) {

        leastEngagedArray.push(orderedMembers[i]);
    }

    let cutPercentage = orderedMembers[tenPercent - 1].missed_votes_pct;

    while (orderedMembers[tenPercent].missed_votes_pct == cutPercentage) {

        leastEngagedArray.push(orderedMembers[tenPercent]);
        tenPercent++;
    }

    leastEngaged.innerHTML = printAttendanceTable(leastEngagedArray);

    orderedMembers.reverse();
    tenPercent = Math.round(members.length * pct);

    for (let i = 0; i < tenPercent; i++) {

        mostEngagedArray.push(orderedMembers[i]);
    }

    cutPercentage = orderedMembers[tenPercent - 1].missed_votes_pct;

    while (orderedMembers[tenPercent].missed_votes_pct == cutPercentage) {

        mostEngagedArray.push(orderedMembers[tenPercent]);
        tenPercent++;
    }

    mostEngaged.innerHTML = printAttendanceTable(mostEngagedArray);
}

function loyalty() {

    let orderedMembers = members.sort(function (a, b) {
        return a.votes_with_party_pct - b.votes_with_party_pct;
    });
    let tenPercent = Math.round(members.length * pct);

    let mostLoyal = document.getElementById("senate-most-loyal");
    let leastLoyal = document.getElementById("senate-least-loyal");

    let leastLoyalArray = [];
    let mostLoyalArray = [];

    for (let i = 0; i < tenPercent; i++) {

        leastLoyalArray.push(orderedMembers[i]);
    }

    let cutPercentage = orderedMembers[tenPercent - 1].votes_with_party_pct;

    while (orderedMembers[tenPercent].votes_with_party_pct == cutPercentage) {

        leastLoyalArray.push(orderedMembers[tenPercent]);
        tenPercent++;
    }

    leastLoyal.innerHTML = printLoyaltyTable(leastLoyalArray);

    orderedMembers.reverse();
    tenPercent = Math.round(members.length * pct);

    for (let i = 0; i < tenPercent; i++) {

        mostLoyalArray.push(orderedMembers[i]);
    }

    cutPercentage = orderedMembers[tenPercent - 1].votes_with_party_pct;

    while (orderedMembers[tenPercent].votes_with_party_pct == cutPercentage) {

        mostLoyalArray.push(orderedMembers[tenPercent]);
        tenPercent++;
    }

    mostLoyal.innerHTML = printLoyaltyTable(mostLoyalArray);

}

function printAttendanceTable(array) {

    let template = '';

    for (let i = 0; i < array.length; i++) {

        template += `
        <tr>
        <td><a href='${members[i].url}'>${members[i].last_name}, ${members[i].first_name} ${members[i].middle_name || ''}</a></td>
        <td>${members[i].missed_votes}</td>
        <td>${members[i].missed_votes_pct}</td>
        </tr>`
    }

    return template;
}

function printLoyaltyTable(array) {

    let template = '';

    for (let i = 0; i < array.length; i++) {

        template += `
        <tr>
        <td><a href='${members[i].url}'>${members[i].last_name}, ${members[i].first_name} ${members[i].middle_name || ''}</a></td>
        <td>${members[i].total_votes}</td>
        <td>${members[i].votes_with_party_pct}</td>
        </tr>`
    }

    return template;
}