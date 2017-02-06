// let Promise;

// Initialize collapse button
$(".button-collapse").sideNav();
// Initialize collapsible (uncomment the line below if you use the dropdown variation)
//$('.collapsible').collapsible();

// $(document).ready(function(){
//       // Promise = require('bluebird');
//       $('.carousel').carousel();
//       loadGear();
//     });

let name = localStorage.name;
let tag = localStorage.tag;
let key = localStorage.apiKey;
let heroId = localStorage.heroId;
let statLookup = {
    "life": 'LIFE',
    "damage": 'DMG',
    "toughness": 'TOUGH',
    "healing": 'HEAL',
    "attackSpeed": 'ATK SPD',
    "armor": 'ARM',
    "strength": 'STR',
    "dexterity": 'DEX',
    "vitality": 'VIT',
    "intelligence": 'INT',
    "physicalResist": 'PHYS RES',
    "fireResist": 'FIRE RES',
    "coldResist": 'COLD RES',
    "lightningResist": 'LIT RES',
    "poisonResist": 'POIS RES',
    "arcaneResist": 'ARC RES',
    "critDamage": 'CRIT DMG',
    "blockChance": 'BLK %',
    "blockAmountMin": 'BLK MIN',
    "blockAmountMax": 'BLK MAX',
    "damageIncrease": 'DMG INC',
    "critChance": 'CRIT %',
    "damageReduction": 'DMG RED',
    "thorns": 'THORN',
    "lifeSteal": 'LSTEAL',
    "lifePerKill": 'LPK',
    "goldFind": 'GOLD FND',
    "magicFind": 'MGK FND',
    "lifeOnHit": 'LOH',
    "primaryResource": 'PRI RESOURCE',
    "secondaryResource": 'SEC RESOURCE'
}

loadGear(name, tag, key);
// getHeroProfile(name, tag, heroId, key);
bindHeroData(heroId);

function loadGear(name, tag, key) {
    return fetch(`https://us.api.battle.net/d3/profile/${name}-${tag}/?locale=en_US&apikey=${key}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonObj) {
            bindCareerData(jsonObj);
        });
};

function bindCareerData(jsonData) {
    let heroObjs = jsonData.heroes;
    bindHeros(heroObjs);
}

function bindHeros(heroObjs) {
    for (let heroObj of heroObjs) {

        let divCarousel = document.getElementById('heroesCarosuel');
        let carouselItem = document.createElement('a');
        carouselItem.addEventListener('click', function(evt) {
            console.log(evt);
        });
        carouselItem.setAttribute("class", "carousel-item active hoverable");
        divCarousel.appendChild(carouselItem);
        let carouselImage = document.createElement('img');
        let gender = heroObj.gender === 0 ? 'male' : 'female';
        let heroClass = heroObj.class;
        carouselImage.setAttribute('src', `avatars/${heroClass}_${gender}.png`);
        carouselItem.appendChild(carouselImage);

        let heroText = document.createTextNode(`${heroObj.name} Level: ${heroObj.level}`);
        carouselItem.appendChild(heroText);
    }

    //init carousel
    var slider = $('.carousel');
    slider.carousel();

    // //add a new item
    // slider.append('<a class="carousel-item active" href="#three!"><img src="http://lorempixel.com/250/250/nature/3"></a>');

    //remove the 'initialized' class which prevents slider from initializing itself again when it's not needed
    if (slider.hasClass('initialized')) {
        slider.removeClass('initialized')
    }

    //just reinit the carousel
    slider.carousel();
}

function getCareerProfile(name, tag, key) {
    return fetch(`https://us.api.battle.net/d3/profile/${name}-${tag}/?locale=en_US&apikey=${key}`)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(function(json) {
            return json;
        })
        .catch(function(error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });
}

// function getHeroProfile(name, battleTag, heroId, apiKey) {
//   return fetch(`https://us.api.battle.net/d3/profile/${name}-${battleTag}/hero/${heroId}?locale=en_US&apikey=${apiKey}`)
//   .then(function(response) {
//     if(response.ok) {
//       return response.json();
//     }
//     throw new Error('Network response was not ok.');
//   })
//   .then(function(json) {
//     // bindHeroData(json);
//     return json;
//   })
//   .catch(function(error) {// be able to respond to the error
//     console.log('There has been a problem with your fetch operation: ' + error.message);
//   });
// }

function getHeroProfile(heroId) {
    return fetch(`https://us.api.battle.net/d3/profile/${localStorage.name}-${localStorage.battleTag}/hero/${heroId}?locale=en_US&apikey=${localStorage.apiKey}`)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        })
        .then(function(json) {
            return json;
        })
        .catch(function(error) { // be able to respond to the error
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });
}

function bindHeroData(name) {
    getHeroProfile(heroId)
        .then(function(heroJson) {
            let stats = heroJson.stats;
            let statsArray = [];
            for (let key in stats) { // bind stats table
                $("#tblStats").find('tbody')
                    .append($('<tr>')
                        .append($('<td>')
                            .text(statLookup[key])
                        )
                        .append($("<td class='stat-num'>")
                            // .attr('class', 'stat-num')
                            .text(parseFloat(stats[key]).toFixed(2))
                        )
                    );
            }
            return heroJson.items;
        })
        .then(function(itemsJson) {
            for (let key in itemsJson) {
              // let apiKey = localStorage.key;
              let flavorText;
              let url = `https://us.api.battle.net/d3/data/${itemsJson[key].tooltipParams}?locale=en_US&apikey=${localStorage.apiKey}`;
              // console.log(url);
              fetch(url)
              .then(function(response) {
                // console.log(response);
                return response.json();
              })
              .then(function(itemJson) {
                flavorText = itemJson.flavorText;
                // console.log(itemJson);
                // console.log(flavorText);
                return flavorText;
              })
              .then(function(flavorText) {
                console.log(key);
                $(`#${key}`)
                    .append($('<div class="card-image waves-effect waves-block waves-light">')
                        .append($(`<img class="activator" style="width:100px;height:175px;margin:0px auto;display:block;border:solid;border-color:orange;vertical-align:text-bottom" src="gear/placeholder_${key}.png">`))
                    )
                    .append($('<div class="card-content">')
                        .append($('<span class="card-title activator grey-text text-darken-4">')
                            .text(itemsJson[key].name)
                        )
                    )
                    .append($('<div class="card-reveal">')
                        .append($('<span class="card-title grey-text text-darken-4">')
                            .text(itemsJson[key].name)
                        )
                        .append($('<p>')
                            .text(flavorText)
                        )
                    );
              })
            }
            // let head = itemsJson.head;
            // $("#shoulders")
            //     .append($('<div class="card-image waves-effect waves-block waves-light">')
            //         .append($('<img class="activator" style="width:100px;height:175px;margin:0px auto;display:block;border:solid;border-color:orange;vertical-align:text-bottom" src="gear/placeholder_shoulders.png">'))
            //     )
            //     .append($('<div class="card-content">')
            //         .append($('<span class="card-title activator grey-text text-darken-4">')
            //             .text(head.name)
            //         )
            //     )
            //     .append($('<div class="card-reveal">')
            //         .append($('<span class="card-title grey-text text-darken-4">')
            //             .text('SOMETHING')
            //         )
            //         .append($('<p>')
            //             .text('"When the sky was torn from the sea, Storm Crow appeared from within the thundering clouds to grant mankind dominion over the living flame." —Legends of the Forgotten World')
            //         )
            //     );
        });
}

// function bindHeroData(heroJson) {
//   let stats = heroJson.stats;
//   let statsArray = [];
//   for(let key in stats) {
//     // console.log(statLookup[key], ':', stats[key]);
//     // statsArray.push(statLookup[key] + ': ' + parseFloat(stats[key]).toFixed(2));
//     $("#tblStats").find('tbody')
//       .append($('<tr>')
//           .append($('<td>')
//               .text(statLookup[key])
//         )
//           .append($("<td class='stat-num'>")
//               // .attr('class', 'stat-num')
//               .text(parseFloat(stats[key]).toFixed(2))
//         )
//     );
//   }
//   // populateStatsTable(statsArray);
// }

function populateStatsTable(stats) {
    for (let stat of stats) {
        $("#tblStats").find('tbody')
            .append($('<tr>')
                .append($('<td>')
                    .text(stat)
                )
            );
    }
}
