// let Promise;

// Initialize collapse button
$(".button-collapse").sideNav();
$(document).ready(function() {
    $('.scrollspy').scrollSpy();
    // $('.modal').modal();
    $('.modal').modal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '4%', // Starting top style attribute
        endingTop: '10%', // Ending top style attribute
        ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
            // alert("Ready");
            let id = trigger[0].id;
            let itemHead = $('#modalItemName')[0];
            let priHead = $('#modalPriHead')[0];
            let priTxt = $('#modalPriTxt')[0];
            let secHead = $('#modalSecHead')[0];
            let secTxt = $('#modalSecTxt')[0];
            let modalCardContent = $('#modalCardContent')[0];

            let itemParams = JSON.parse(localStorage.tooltipParams)[id];
            console.log(itemParams);
            // itemHead.innerText = itemParams.name;
            // priTxt.innerText = '';
            // secTxt.innerText = '';
            $("#modalCardContent").empty();
            // $("#modalCardContent").attr('style',  `background-color:${itemParams.displayColor}`);
            $("#modalCardContent").append($(`<h5>${itemParams.name}</h5>`));
            $("#modalCardContent").append($(`<span style='color:${itemParams.displayColor}'><h6>${itemParams.typeName}</h6></span>`));
            $("#modalCardContent").append($(`<b>Primary</b><br/>`));
            for (let primAttr of itemParams.attributes.primary) {
                // priTxt.innerText += primAttr.text + ' ' + primAttr.color + '\n\r';
                $("#modalCardContent").append($(`<i class="tiny material-icons">label</i><span style="color:${primAttr.color}">${primAttr.text}</span><br/>`));
            }

            $("#modalCardContent").append($(`<br/><b>Secondary</b><br/>`));
            for (let secAttr of itemParams.attributes.secondary) {
                // secTxt.innerText += secAttr.text + ' ' + secAttr.color + '\n\r';
                $("#modalCardContent").append($(`<i class="tiny material-icons">label_outline</i><span style="color:${secAttr.color}">${secAttr.text}</span><br/>`));
            }

            if (itemParams.attributes.passive.length) {
                $("#modalCardContent").append($(`<br/><b>Passive</b><br/>`));
                for (let pasAttr of itemParams.attributes.passive) {
                    // secTxt.innerText += secAttr.text + ' ' + secAttr.color + '\n\r';
                    $("#modalCardContent").append($(`<p style="color:${pasAttr.color}">${pasAttr.text}</p>`));
                }
            }

            $("#modalCardContent").append($(`<br/><i>${itemParams.flavorText}</i>`));
            $('#card-image').attr('src', `http://media.blizzard.com/d3/icons/items/large/${itemParams.icon}.png?locale=en_US&apikey=${localStorage.apiKey}`);
        },
        // complete: function() { alert('Closed'); } // Callback for Modal close
    });

    // $('.tooltipped').tooltip({delay: 50});
});
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
// let heroId = localStorage.heroId;
let statLookup = {
    "life": 'LIFE',
    "damage": 'DAMAGE',
    "toughness": 'TOUGHNESS',
    "healing": 'HEALING',
    "attackSpeed": 'ATTACK SPEED',
    "armor": 'ARMOR',
    "strength": 'STRENGTH',
    "dexterity": 'DEXTERITY',
    "vitality": 'VITALITY',
    "intelligence": 'INTELLIGENCE',
    "physicalResist": 'PHYSICAL RESISTANCE',
    "fireResist": 'FIRE RESISTANCE',
    "coldResist": 'COLD RESISTANCE',
    "lightningResist": 'LIGHTNING RESISTANCE',
    "poisonResist": 'POISON RESISTANCE',
    "arcaneResist": 'ARCANE RESISTANCE',
    "critDamage": 'CRITICAL DAMAGE',
    "blockChance": 'BLOCK %',
    "blockAmountMin": 'BLOCK MIN',
    "blockAmountMax": 'BLOCK MAX',
    "damageIncrease": 'DAMAGE INCREASE',
    "critChance": 'CRITICAL HIT %',
    "damageReduction": 'DAMAGE REDUCTION',
    "thorns": 'THORNS',
    "lifeSteal": 'LIFE STEAL',
    "lifePerKill": 'LIFE PER KILL',
    "goldFind": 'GOLD FIND',
    "magicFind": 'MGK FIND',
    "lifeOnHit": 'LIFE ON HIT',
    "primaryResource": 'PRIMARY RESOURCE',
    "secondaryResource": 'SECONDARY RESOURCE'
};

loadGear(name, tag, key);
// getHeroProfile(name, tag, heroId, key);
// bindHeroData(heroId);

function loadGear(name, tag, key) {
    return fetch(`https://us.api.battle.net/d3/profile/${name}-${tag}/?locale=en_US&apikey=${key}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonObj) {
            bindCareerData(jsonObj);
        });
}

function bindCareerData(jsonData) {
    let heroObjs = jsonData.heroes;
    bindHeros(heroObjs);
}

function bindHeros(heroObjs) {
    for (let heroObj of heroObjs) {
        let divCarousel = document.getElementById('heroesCarosuel');
        let carouselItem = document.createElement('a');
        carouselItem.addEventListener('click', function(evt) {

            $("#tblStats").find('tbody').empty();
            localStorage.heroId = evt.target.name;
            bindHeroData(evt.target.name);
        });
        carouselItem.setAttribute("class", "carousel-item active");
        divCarousel.appendChild(carouselItem);
        let carouselImage = document.createElement('img');
        carouselImage.setAttribute("name", `${heroObj.id}`)
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
        slider.removeClass('initialized');
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

function highlightGear(attribute) {
    let itemsJson = JSON.parse(localStorage.heroItems);
    console.log(itemsJson);
}

function populateStatsTable(heroJson) {
    let stats = heroJson.stats;
    let statsArray = [];
    for (let key in stats) { // bind stats table
        $("#tblStats").find('tbody')
            .append($(`<tr name='${key}' id='${key}'>`)
                .append($('<td>')
                    .text(statLookup[key])
                )
                .append($("<td class='stat-num'>")
                    .text(parseFloat(stats[key]).toFixed(2))
                )
            );
        $(`#${key}`).hover(function(event) {
            console.log(event.target);
            console.log($(this)[0].id);
            // highlightGear(event.target.id);
        }, function(event) {
            // console.log('mouseout', $(this));
        });
    }
    localStorage['heroItems'] = JSON.stringify(heroJson.items);
    localStorage['heroSkills'] = JSON.stringify(heroJson.skills);
}

function populateGearCards(heroJson) {
    for (let key in heroJson.items) {
        let flavorText;
        let url = `https://us.api.battle.net/d3/data/${heroJson.items[key].tooltipParams}?locale=en_US&apikey=${localStorage.apiKey}`;
        fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(itemJson) {
                let tooltipParams = JSON.parse(localStorage.tooltipParams);
                tooltipParams[itemJson.id] = itemJson;
                localStorage.tooltipParams = JSON.stringify(tooltipParams);
                $(`#${key}`).empty();

                let width = key === 'leftFinger' || key === 'rightFinger' || key === 'waist' || key === 'neck' ? '64px' : '64px';
                let height = key === 'leftFinger' || key === 'rightFinger' || key === 'waist' || key === 'neck' ? '64px' : '128px';
                let src = `http://media.blizzard.com/d3/icons/items/large/${heroJson.items[key].icon}.png?locale=en_US&apikey=${localStorage.apiKey}`;
                $(`#${key}`)
                    .append($('<div class="card-image waves-effect waves-block waves-light">')
                        .append($(`<img class="activator" style="width:${width};height:${height};margin:0px auto;display:block;border:solid;border-color:${heroJson.items[key].displayColor};vertical-align:text-bottom" src=${src}>`))
                    )
                    .append($('<div class="card-content center">')
                        .append($('<span class="card-title activator grey-text text-darken-4" style="text-align:center; font-size:medium">')
                            .text(itemJson.name)
                        )
                        .append($(`<a class="waves-effect waves-light btn blue-grey" href="#modalStats" valign-wrapper id="${itemJson.id}"><i class="tiny material-icons valign">chat_bubble_outline</i></a>`))
                    )
                    .append($('<div class="card-reveal">')
                        .append($(`<span class="card-title grey-text text-darken-4" style="text-align:center; font-size:medium;">`)
                            .text(itemJson.typeName)
                        )
                        .append($('<p>')
                            .text(itemJson.flavorText)
                        )
                    );
            })
    }
}

function bindHeroData(heroId) {
    getHeroProfile(heroId)
        .then(function(heroJson) {

            populateStatsTable(heroJson);

            return heroJson;
        })
        .then(function(heroJson) {
            populateGearCards(heroJson);

            return heroJson;
        })
        .then(function(heroJson) {
            let skillToolTipText;
            $('#tblRowActiveSkills').empty();
            for (let skillObj of heroJson.skills.active) {
                let iconSkill = skillObj.skill.icon;
                let srcSkill = `http://media.blizzard.com/d3/icons/skills/64/${iconSkill}.png?locale=en_US&apikey=${localStorage.apiKey}`;

                let skillToolTipText = skillObj.skill.description;
                if (skillObj.skill.flavor) {
                  // console.log(skillObj.skill.flavor);
                    skillToolTipText += skillObj.skill.flavor;
                }
                $('#tblRowActiveSkills').append(`<td>`).append(`<a class="img tooltipped" data-position="top" data-delay="50" data-tooltip="<div style='width:200px'><i>${skillToolTipText}</i>"></div><img src=${srcSkill}>`);
            }

            $('#tblRowPassiveSkills').empty();
            for (let skillObj of heroJson.skills.passive) {
                let iconSkill = skillObj.skill.icon;
                let srcSkill = `http://media.blizzard.com/d3/icons/skills/64/${iconSkill}.png?locale=en_US&apikey=${localStorage.apiKey}`;
                let skillToolTipText = skillObj.skill.description;
                if (skillObj.skill.flavor) {
                  // console.log(skillObj.skill.flavor);
                    // skillToolTipText += skillObj.skill.flavor;
                    skillToolTipText += skillObj.skill.flavor;
                }
                let y = "\"Power begets power. The excess energy from one spell is absorbed by the other, and so the effect is sustained.\" —Excerpt from Grand Master Clavaught's Lecture on Synergistic Effects in Esoteric Arcane Spheres";
                // $('#tblRowPassiveSkills').append(`<td>`).append(`<a class="img tooltipped" data-position="top" data-delay="50" data-tooltip="<div style='width:200px'><i>${skillToolTipText}</i>"></div><img src=${srcSkill}>`);
                $('#tblRowPassiveSkills').append($("<td>")).append(`<a class="img tooltipped" data-position="top" data-delay="50" data-tooltip="<div style='width:200px'><i>${skillToolTipText}</i></div><img src=${srcSkill}></a>`);
                $(document).ready(function() {
                    $('.tooltipped').tooltip({
                        delay: 50,
                        html: true
                    });
                });
            }
            // console.log("\"Power begets power. The excess energy from one spell is absorbed by the other, and so the effect is sustained.\" —Excerpt from Grand Master Clavaught's Lecture on Synergistic Effects in Esoteric Arcane Spheres");
        });
}
