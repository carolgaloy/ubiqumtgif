let members;
let URL;
let pct = 0.1;

let repCheckbox = document.getElementById("rep-checkbox");
let demCheckbox = document.getElementById("dem-checkbox");
let indCheckbox = document.getElementById("ind-checkbox");
let stateDropdown = document.getElementById("states");
let readMoreButton = document.getElementById("more-button");
let parties = [];

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

if (document.URL.indexOf("senate") >= 0) {
  URL = "https://api.propublica.org/congress/v1/113/senate/members.json";
}

if (document.URL.indexOf("house") >= 0) {
  URL = "https://api.propublica.org/congress/v1/113/house/members.json";
}

if (document.URL.indexOf("index") < 0) {
  fetch(URL, {
    method: "GET",
    headers: {
      "X-API-key": "jd6SrdiFxFUh4Cw333Mbi2QSlHDnTxAcEB7tyHS1"
    }
  })
    .then(function(response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function(json) {
      members = json.results[0].members;

      if (
        document.URL.indexOf("/house.html") >= 0 ||
        document.URL.indexOf("/senate.html") >= 0
      ) {
        createTable(members);
        fillDropdown();
      }

      if (document.URL.indexOf("attendance") >= 0) {
        calculateStatistics(members);
        atAGlance();
        attendance();
      }

      if (document.URL.indexOf("loyalty") >= 0) {
        calculateStatistics(members);
        atAGlance();
        loyalty();
      }
    })
    .catch(function(error) {
      console.log("Request failed: " + error.message);
    });
}

if (
  document.URL.indexOf("/house.html") >= 0 ||
  document.URL.indexOf("/senate.html") >= 0
) {
  repCheckbox.addEventListener("click", filterMembers);
  demCheckbox.addEventListener("click", filterMembers);
  indCheckbox.addEventListener("click", filterMembers);
  stateDropdown.addEventListener("change", filterMembers);
}

function createTable(data) {
  let senatedata = document.getElementById("data");
  let template = "";

  for (let i = 0; i < data.length; i++) {
    template += `<tr>
    <td><a target="_blank" href='${data[i].url}'>${data[i].last_name}, ${
      data[i].first_name
    } ${data[i].middle_name || ""}</a></td>
    <td>${data[i].party}</td>
    <td>${data[i].state}</td>
    <td>${data[i].seniority}</td>
    <td>${data[i].votes_with_party_pct} %</td>
    </tr>`;
  }

  if (data.length == 0) {
    template += `<tr>
    <td colspan=5>No data matching your search criteria</td>
    </tr>`;
  }

  senatedata.innerHTML = template;
}

function filterMembers() {
  let checkboxes = Array.from(
    document.querySelectorAll("input[type=checkbox]:checked")
  ).map(c => c.value);
  let filteredMembers = members.filter(m => {
    let partyFilter = checkboxes.includes(m.party) || checkboxes.length == 0;
    let stateFilter =
      stateDropdown.value == m.state || stateDropdown.value == "All";
    return partyFilter && stateFilter;
  });
  createTable(filteredMembers);
}

function fillDropdown() {
  let statesId = document.getElementById("states");
  let states = Array.from(new Set(members.map(m => m.state).sort()));

  let stateDropdown = "";

  for (let i = 0; i < states.length; i++) {
    stateDropdown += `<option value="${states[i]}">${states[i]}</option>`;
  }

  statesId.innerHTML += stateDropdown;
}

function calculateStatistics(data) {
  data.forEach(senator => {
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
  let statisticsId = document.getElementById("statistics");
  let statisticsTable = "";

  for (let party in statistics) {
    if (statistics[party].members != 0) {
      let partyCap = party.charAt(0).toUpperCase() + party.slice(1);

      statisticsTable += `
      <tr>
      <td>${partyCap}</td>
      <td>${statistics[party].members}</td>
      <td>${statistics[party].votes.toFixed(2)} %</td>
      </tr>`;
    }
  }

  statisticsId.innerHTML = statisticsTable;
}

function attendance() {
  let orderedMembers = members.sort(function(a, b) {
    return a.missed_votes_pct - b.missed_votes_pct;
  });
  let tenPercent = Math.round(members.length * pct);

  let mostEngaged = document.getElementById("most-engaged");
  let leastEngaged = document.getElementById("least-engaged");

  let mostEngagedArray = [];
  let leastEngagedArray = [];

  for (let i = 0; i < tenPercent; i++) {
    mostEngagedArray.push(orderedMembers[i]);
  }

  let cutPercentage = orderedMembers[tenPercent - 1].missed_votes_pct;

  while (orderedMembers[tenPercent].missed_votes_pct == cutPercentage) {
    mostEngagedArray.push(orderedMembers[tenPercent]);
    tenPercent++;
  }

  mostEngaged.innerHTML = printAttendanceTable(mostEngagedArray);

  orderedMembers.reverse();
  tenPercent = Math.round(members.length * pct);

  for (let i = 0; i < tenPercent; i++) {
    leastEngagedArray.push(orderedMembers[i]);
  }

  cutPercentage = orderedMembers[tenPercent - 1].missed_votes_pct;

  while (orderedMembers[tenPercent].missed_votes_pct == cutPercentage) {
    leastEngagedArray.push(orderedMembers[tenPercent]);
    tenPercent++;
  }

  leastEngaged.innerHTML = printAttendanceTable(leastEngagedArray);
}

function loyalty() {
  let orderedMembers = members.sort(function(a, b) {
    return a.votes_with_party_pct - b.votes_with_party_pct;
  });

  let tenPercent = Math.round(members.length * pct);

  let mostLoyal = document.getElementById("most-loyal");
  let leastLoyal = document.getElementById("least-loyal");

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
  let template = "";

  for (let i = 0; i < array.length; i++) {
    template += `
      <tr>
      <td><a target="_blank" href='${members[i].url}'>${
      members[i].last_name
    }, ${members[i].first_name} ${members[i].middle_name || ""}</a></td>
      <td>${members[i].missed_votes}</td>
      <td>${members[i].missed_votes_pct} %</td>
      </tr>`;
  }

  return template;
}

function printLoyaltyTable(array) {
  let template = "";

  for (let i = 0; i < array.length; i++) {
    template += `
      <tr>
      <td><a target="_blank" href='${members[i].url}'>${
      members[i].last_name
    }, ${members[i].first_name} ${members[i].middle_name || ""}</a></td>
      <td>${members[i].total_votes}</td>
      <td>${members[i].votes_with_party_pct} %</td>
      </tr>`;
  }

  return template;
}

if (document.URL.indexOf("index") >= 0) {
  readMoreButton.addEventListener("click", readMore);
}

function readMore() {
  var moreText = document.getElementById("more-text");
  var buttonMore = document.getElementById("more-button");

  if (moreText.style.display === "none") {
    buttonMore.innerHTML = "Read Less";
    moreText.style.display = "inline";
  } else {
    buttonMore.innerHTML = "Read More";
    moreText.style.display = "none";
  }
}
