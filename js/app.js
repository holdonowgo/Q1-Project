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

loadGear();

function loadGear() {
  fetch(`https://us.api.battle.net/d3/profile/holdonowgo-1262/?locale=en_US&apikey=pehfddzk4stg5bpze69bf537vytge2u4`)
  .then(function(response) {
    return response.json();
  })
  .then(function(jsonObj) {
    bindCareerData(jsonObj);
  });
  // $.getJSON('../careerProfile.json', function(json) {
  //   bindCareerData(json); // this will show the info it in firebug console
  // });
};

function bindCareerData(jsonData) {
  let heroObjs = jsonData.heroes;

  for(let heroObj of heroObjs) {
    bindHero(heroObj);
  };
  // bindHero(heroObjs[0]);
  // console.log(heroObjs[0].class);
}

function bindHero(heroObj) {
  let divCarousel = document.getElementById('heroesCarosuel');
  let carouselItem = document.createElement('a');
  carouselItem.setAttribute("class", "carousel-item active");
  divCarousel.appendChild(carouselItem);
  let carouselImage = document.createElement('img');
  let gender = heroObj.gender === 0 ? 'male' : 'female';
  console.log(heroObj);
  let heroClass = heroObj.class;
  carouselImage.setAttribute('src', `avatars/${heroClass}_${gender}.png`);
  carouselItem.appendChild(carouselImage);

  //init carousel
  var slider = $('.carousel');
  slider.carousel();

  // //add a new item
  // slider.append('<a class="carousel-item active" href="#three!"><img src="http://lorempixel.com/250/250/nature/3"></a>');

  //remove the 'initialized' class which prevents slider from initializing itself again when it's not needed
  if (slider.hasClass('initialized')){
      slider.removeClass('initialized')
  }

  //just reinit the carousel
  slider.carousel();
}

function getCareerProfile() {
  fetch(`https://us.api.battle.net/d3/profile/holdonowgo-1262/?locale=en_US&apikey=pehfddzk4stg5bpze69bf537vytge2u4`)
  // fetch('https://us.api.battle.net/d3/profile/holdonowgo-1262/?locale=en_US&apikey=pehfddzk4stg5bpze69bf537vytge2u4')
  .then(function(response) {
    if(response.ok) {
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
