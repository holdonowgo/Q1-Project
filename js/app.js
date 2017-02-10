let _name;
let _battleTag;
let _apiKey;

if(!localStorage.name) {
  _name = NAME;
}else {
  _name = localStorage.name;
}
if(!localStorage.battleTag) {
  _battleTag = BATTLETAG;
}else {
  _battleTag = localStorage.battleTag;
}
if(!localStorage.apiKey) {
  _apiKey = APIKEY;
}else {
  _apiKey = localStorage.apiKey;
}

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

            let id = trigger[0].id;
            let itemHead = $('#modalItemName')[0];
            let priHead = $('#modalPriHead')[0];
            let priTxt = $('#modalPriTxt')[0];
            let secHead = $('#modalSecHead')[0];
            let secTxt = $('#modalSecTxt')[0];
            let modalCardContent = $('#modalCardContent')[0];

            let itemParams = JSON.parse(localStorage.tooltipParams)[id];

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
            $('#card-image').attr('src', `http://media.blizzard.com/d3/icons/items/large/${itemParams.icon}.png?locale=en_US&apikey=${APIKEY}`);
        },
    });
});

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

let statHighlightLookup = {
    // "life": 'LIFE',
    // "damage": 'DAMAGE',
    // "toughness": 'TOUGHNESS',
    // "healing": 'HEALING',
    // "attackSpeed": 'ATTACK SPEED',
    // "armor": 'ARMOR',
    // "strength": 'STRENGTH',
    // "dexterity": 'DEXTERITY',
    // "vitality": 'VITALITY',
    "intelligence": 'Intelligence',
    // "physicalResist": 'PHYSICAL RESISTANCE',
    // "fireResist": 'FIRE RESISTANCE',
    // "coldResist": 'COLD RESISTANCE',
    // "lightningResist": 'LIGHTNING RESISTANCE',
    // "poisonResist": 'POISON RESISTANCE',
    // "arcaneResist": 'ARCANE RESISTANCE',
    "critDamage": 'Critical Hit Damage',
    // "blockChance": 'BLOCK %',
    // "blockAmountMin": 'BLOCK MIN',
    // "blockAmountMax": 'BLOCK MAX',
    // "damageIncrease": 'DAMAGE INCREASE',
    "critChance": 'Critical Hit Chance'
    // "damageReduction": 'DAMAGE REDUCTION',
    // "thorns": 'THORNS',
    // "lifeSteal": 'LIFE STEAL',
    // "lifePerKill": 'LIFE PER KILL',
    // "goldFind": 'GOLD FIND',
    // "magicFind": 'MGK FIND',
    // "lifeOnHit": 'LIFE ON HIT',
    // "primaryResource": 'PRIMARY RESOURCE',
    // "secondaryResource": 'SECONDARY RESOURCE'
};

loadGear();

function loadGear() {
    let url = `https://us.api.battle.net/d3/profile/${_name}-${_battleTag}/?locale=en_US&apikey=${_apiKey}`;
    return fetch(url)
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

            // $("#tblStats").find('tbody').empty();
            localStorage.heroId = evt.target.name;
            bindHeroData(evt.target.name);
        });
        carouselItem.setAttribute("class", "carousel-item active");
        divCarousel.appendChild(carouselItem);
        let carouselImage = document.createElement('img');
        carouselImage.setAttribute("id", `${heroObj.id}`)
        carouselImage.setAttribute("name", `${heroObj.id}`)
        let gender = heroObj.gender === 0 ? 'male' : 'female';
        let heroClass = heroObj.class;
        carouselImage.setAttribute('src', `avatars/${heroClass}_${gender}.png`);
        carouselItem.appendChild(carouselImage);


        // .append($('<td>')
        //     .text(statLookup[key])
        let p1 = document.createElement('h5');
        p1.textContent = `${heroObj.name}`;
        let p2 = document.createElement('h6');
        p2.textContent = `Level: ${heroObj.level}`;

        carouselItem.appendChild(p1);
        carouselItem.appendChild(p2);

        // let heroText = document.createTextNode(`${heroObj.name} Level: ${heroObj.level}`);
        // carouselItem.appendChild(heroText);
    }

    //init carousel
    // let slider = $('.carousel');
    // slider.carousel();
    $('.carousel').carousel({
        distribution: -50,
        indicators: true,
        padding: 200,
        shift: 50
    });

    // //add a new item
    // slider.append('<a class="carousel-item active" href="#three!"><img src="http://lorempixel.com/250/250/nature/3"></a>');

    //remove the 'initialized' class which prevents slider from initializing itself again when it's not needed
    if ($('.carousel').hasClass('initialized')) {
        $('.carousel').removeClass('initialized');
    }

    //just reinit the carousel
    // $('.carousel').carousel();
    $('.carousel').carousel({
        distribution: -50,
        indicators: true,
        padding: 200,
        shift: 50
    });

    // console.log(slider.children()[0].id);
    // bindHeroData(slider.children()[0].id);
}

function getCareerProfile() {
    return fetch(`https://us.api.battle.net/d3/profile/${_name}-${_battleTag}/?locale=en_US&apikey=${_apiKey}`)
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
    let url = `https://us.api.battle.net/d3/profile/${_name}-${_battleTag}/hero/${heroId}?locale=en_US&apikey=${_apiKey}`;
    // console.log(url);
    return fetch(url)
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

function populateStatsTable(heroJson) {

    $("#tblStats").find('tbody').empty();
    let stats = heroJson.stats;
    let statsArray = [];
    for (let key in stats) { // bind stats table
        $("#tblStats").find('tbody')
            .append($(`<tr name='${key}' id='${key}'>`)
                .hover(function(event) {
                        // $( this ).fadeOut( 100 );
                        // $( this ).fadeIn( 500 );
                        // console.log($(this).closest('tr')[0].id);
                        let lookupText = statHighlightLookup[$(this).closest('tr')[0].id];
                        let itemJson = JSON.parse(localStorage.tooltipParams);
                        for (let key in itemJson) {
                            // console.log(itemJson);
                            // console.log(key);
                            let item = itemJson[key];
                            // console.log(item);
                            for (let attr of item.attributes.primary) {
                                if (attr.text.includes(lookupText)) {
                                    if ($(`[name="${item.id}"]`)[0]) {
                                        $(`[name="${item.id}"]`).addClass("z-depth-5");
                                    }
                                }
                            }
                        }
                    },
                    function() {
                        // remove class
                        let itemJson = JSON.parse(localStorage.tooltipParams);
                        for (let key in itemJson) {
                            let item = itemJson[key];
                            for (let attr of item.attributes.primary) {
                                if ($(`[name="${item.id}"]`)[0]) {
                                    $(`[name="${item.id}"]`).removeClass("z-depth-5");
                                }
                            }
                        }
                    })
                .append($('<td>')
                    .text(statLookup[key])
                )
                .append($("<td class='stat-num'>")
                    .text(parseFloat(stats[key]).toFixed(2))
                )
            );
        $(`#${key}`).hover(function(event) {
            // console.log(event.target);
            // console.log($(this)[0].id);
            // highlightGear(event.target.id);
        }, function(event) {
            // console.log('mouseout', $(this));
        });
    }
    localStorage['heroItems'] = JSON.stringify(heroJson.items);
    localStorage['heroSkills'] = JSON.stringify(heroJson.skills);
}

function populateGearCards(heroJson) {
    localStorage.tooltipParams = JSON.stringify({});
    for (let key in heroJson.items) {
        let flavorText;
        let url = `https://us.api.battle.net/d3/data/${heroJson.items[key].tooltipParams}?locale=en_US&apikey=${_apiKey}`;
        fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function(itemJson) {
                let tooltipParams = JSON.parse(localStorage.tooltipParams);
                tooltipParams[itemJson.id] = itemJson;
                localStorage.tooltipParams = JSON.stringify(tooltipParams);
                // console.log($(`#${key}`));
                $(`#${key}`).empty();
                // console.log($(`#${key}`));

                let width = key === 'leftFinger' || key === 'rightFinger' || key === 'waist' || key === 'neck' ? '64px' : '64px';
                let height = key === 'leftFinger' || key === 'rightFinger' || key === 'waist' || key === 'neck' ? '64px' : '128px';
                let src = `http://media.blizzard.com/d3/icons/items/large/${heroJson.items[key].icon}.png?locale=en_US&apikey=${APIKEY}`;
                $(`#${key}`).attr('name', `${itemJson.id}`);
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
    // console.log(heroId);
    getHeroProfile(heroId)
        .then(function(heroJson) {
            // console.log(heroJson);
            // localStorage.tooltipParams = JSON.stringify({});
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
                if (!('skill' in skillObj)) {
                    continue;
                }
                let iconSkill = skillObj.skill.icon;
                let srcSkill = `http://media.blizzard.com/d3/icons/skills/64/${iconSkill}.png?locale=en_US&apikey=${APIKEY}`;

                let skillToolTipText = skillObj.skill.description;
                if (skillObj.skill.flavor) {
                    skillToolTipText += skillObj.skill.flavor;
                }
                let card = $('<div />', {
                        "class": 'card blue-grey darken-1'
                    })
                    .append($('<div />', {
                            "class": 'card-content white-text'
                        })
                        .append($('<span />', {
                                "class": 'card-title',
                                text: "Card Title"
                            })
                            .append($('<p />', {
                                text: `${skillObj.skill.description}`
                            }))
                        )
                    ).append($('<div />', {
                        "class": 'card-action',
                        text: `${skillObj.skill.flavor}`
                    }));
                card = card.prop('outerHTML');

                // $('#tblRowActiveSkills').append(`<td>`).append(`<a class="img tooltipped" data-position="top" data-delay="50" data-tooltip="<div style='width:200px'><i>${skillToolTipText}</i>"></div><img src=${srcSkill}>`);
                $('#tblRowActiveSkills')
                  .append($("<td style='width: 64px'>")
                    .append($(`<a class="img tooltipped" data-position="top" data-delay="50" data-tooltip="<div style='width:200px'>${skillToolTipText})</div>"></a>`)
                      .append($(`<img src=${srcSkill}>`))));
            }

            $('#tblRowPassiveSkills').empty();

            for (let skillObj of heroJson.skills.passive) {
                // console.log(JSON.stringify(heroJson));
                // console.log(heroJson.skills);
                // console.log(skillObj);
                // console.log(skillObj.skill);
                // console.log(skillObj.skill.icon);
                if (!('skill' in skillObj)) {
                    continue;
                }
                // console.log(skillObj);
                let iconSkill = skillObj.skill.icon;
                let srcSkill = `http://media.blizzard.com/d3/icons/skills/64/${iconSkill}.png?locale=en_US&apikey=${APIKEY}`;
                let skillToolTipText = skillObj.skill.description;
                if (skillObj.skill.flavor) {
                    // console.log(skillObj.skill.flavor);
                    // skillToolTipText += skillObj.skill.flavor;
                    // skillToolTipText += skillObj.skill.flavor;
                }
                // console.log(srcSkill);
                // $('#tblRowPassiveSkills').append($("<td>")).append(`<a class="img tooltipped" data-position="top" data-delay="50" data-tooltip="<div style='width:200px'><i>${skillToolTipText}</i></div><img src=${srcSkill}></a>`);
                                $('#tblRowPassiveSkills')
                                  .append($("<td style='width: 100px'>")
                                    .append($(`<a class="img tooltipped" data-position="top" data-delay="50" data-tooltip="<div style='width:200px'>${skillToolTipText})</div>"></a>`)
                                      .append($(`<img src=${srcSkill}>`))));
                $(document).ready(function() {
                    $('.tooltipped').tooltip({
                        delay: 50,
                        html: true
                    });
                });
            }
            // console.log("\"Power begets power. The excess energy from one spell is absorbed by the other, and so the effect is sustained.\" —Excerpt from Grand Master Clavaught's Lecture on Synergistic Effects in Esoteric Arcane Spheres");
            return heroJson;
        })
        .then(function(heroJson) {
            // let promises = [];
            // for(item of heroJson.items) {
            //   let url =
            //   promises.push(fetch())
            // }
            // console.log(heroJson);
        });
}
