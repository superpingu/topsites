function createSiteView(siteid, site, pic) {
  document.getElementById(siteid).innerHTML = `
    <a href="https://${site}">
      <img class="sitepic" src="${pic}">
    </a>
    <br>
    <span class="url">${site.split('/')[0]}</span>
  `;
}

function createErrorView(siteid, site) {
  document.getElementById(siteid).innerHTML = `
    <a href="https://${site}">
      <div class="sitepic errorpic"></div>
    </a>
    <span class="url">${site.split('/')[0]}</span>
  `;
}

function storePic(site, blob) {
  var reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onloadend = function() {
    localStorage.setItem(conf[site], reader.result);
    date = new Date();
    if(conf[site] === 'apod.nasa.gov') // daily update for NASA's picture of the day
      localStorage.setItem(conf[site] + '_exp', date.setDate(date.getDate() + 1));
    else
      localStorage.setItem(conf[site] + '_exp', date.setDate(date.getDate() + 10));

    createSiteView(site, conf[site], localStorage.getItem(conf[site]));
  }
}

for(const site in conf) {
  if(localStorage.getItem(conf[site] + '_exp')) {
    today = new Date();
    expiry = new Date(parseInt(localStorage.getItem(conf[site] + '_exp')));
    if(today > expiry) {
      localStorage.removeItem(conf[site]);
      console.log(conf[site]);
    }
  }

  if(!localStorage.getItem(conf[site])) { // no cached snapshot for this site
    fetch('https://api.apiflash.com/v1/urltoimage?access_key=' + localStorage.getItem('apiflashKey') + '&url=https://' + conf[site]
      + '&width=' + Math.round(window.innerWidth*1.4) + '&height=' + Math.round(window.innerHeight*1.4))
    .then(function(response) {
      if(response.ok)
        return response.blob();
      else
        return {error_type: "request"};
    }).then(function(picture) {
      if(!('error_type' in picture)) {
        storePic(site, picture);
      } else {
        console.log(picture);
        createErrorView(site, conf[site]);
      }
    });
  } else {
    createSiteView(site, conf[site], localStorage.getItem(conf[site]));
  }
}
