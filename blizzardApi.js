let fetch = require('node-fetch');

let jsonResults = [];

const mediaUrl = `http://media.blizzard.com/d3/icons/${type}/${size}/${icon}.png`;
// The type can be "items" or "skills" based on the type of icon
// For items size can be "small" or "large" and for skills size can be 21, 42 or 64.

function getCareerProfile(name, tag, key) {
  fetch(`https://us.api.battle.net/d3/profile/holdonowgo-1262/?locale=en_US&apikey=pehfddzk4stg5bpze69bf537vytge2u4`)
  // fetch('https://us.api.battle.net/d3/profile/holdonowgo-1262/?locale=en_US&apikey=pehfddzk4stg5bpze69bf537vytge2u4')
  .then(function(response) {
    if(response.ok) {
      return response.json();
    }
    throw new Error('Network response was not ok.');
  })
  .then(function(json) {
    console.log(json);
    let result = JSON.stringify(json);

    var fs = require('fs');
    var stream = fs.createWriteStream("careerProfile.json");
    stream.once('open', function(fd) {
      stream.write(result);
      stream.end();
    });
  })
  .catch(function(error) {
    console.log('There has been a problem with your fetch operation: ' + error.message);
  });
}

function getHeroProfile() {
  fetch('https://us.api.battle.net/d3/profile/holdonowgo-1262/hero/5518795?locale=en_US&apikey=pehfddzk4stg5bpze69bf537vytge2u4')
  .then(function(response) {
    if(response.ok) {
      return response.json();
    }
    throw new Error('Network response was not ok.');
  })
  .then(function(json) {
    console.log(json);
    let result = JSON.stringify(json);

    var fs = require('fs');
    var stream = fs.createWriteStream("heroProfile.json");
    stream.once('open', function(fd) {
      stream.write(result);
      stream.end();
    });
  })
  .catch(function(error) {// be able to respond to the error
    console.log('There has been a problem with your fetch operation: ' + error.message);
  });
}

getHeroProfile();
getCareerProfile();
