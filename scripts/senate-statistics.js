let members = data.results[0].members;

let statistics = {
    democrats: {
        numberOfDemocrats: 0,
        democratVotes: 0
    },
    republicans: {
        numberOfRepublicans: 0,
        republicanVotes: 0
    },
    independents: {
        numberOfIndependents: 0,
        independentVotes: 0
    },
    total: {
        totalMembers: 0,
        totalVotes: 0
    }
};

calculateStatistics(members);
fillTable();

function calculateStatistics(senateData) {

    senateData.forEach(senator => {

        if (senator.party == 'R') {
            statistics.republicans.numberOfRepublicans++;
            statistics.republicans.republicanVotes += senator.votes_with_party_pct;
        } else if (senator.party == 'D') {
            statistics.democrats.numberOfDemocrats++;
            statistics.democrats.democratVotes += senator.votes_with_party_pct;
        } else if (senator.party == 'I') {
            statistics.independents.numberOfIndependents++;
            statistics.independents.independentVotes += senator.votes_with_party_pct;
        }

        statistics.total.totalMembers++;
        statistics.total.totalVotes += senator.votes_with_party_pct;
    })

    //statistics.total.totalMembers = statistics.numberOfDemocrats + statistics.numberOfIndependents + statistics.numberOfRepublicans;
    statistics.republicans.republicanVotes /= statistics.republicans.numberOfRepublicans.toFixed(2);
    statistics.democrats.democratVotes /= statistics.democrats.numberOfDemocrats.toFixed(2);
    statistics.independents.independentVotes /= statistics.independents.numberOfIndependents.toFixed(2);
    statistics.total.totalVotes /= statistics.total.totalMembers.toFixed(2);

}

function fillTable() {

    let senateStatistics = document.getElementById('senate-statistics');

    for (let key in statistics) {
        let row = document.createElement("tr");
        console.log(key);
    }

    template = '';

    for (let i = 0; i < 4; i++) {

        template += `
        <tr>
        <td>${statistics.numberOfDemocrats}</td>
        <td>${statistics.numberOfIndependents}</td>
        <td>${statistics.numberOfRepublicans}</td>
        <td>${statistics.total}</td>
        <td>${statistics.republicanVotes}</td>
        <td>${statistics.democratVotes}</td>
        <td>${statistics.independentVotes}</td>
        </tr>`
    }

    senateStatistics.innerHTML = template;

}