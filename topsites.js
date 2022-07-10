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

// show the grid
for(const site in conf) {
  if(!localStorage.getItem(conf[site])) {
    // display a placeholder
    createErrorView(site, conf[site]);
  } else {
    // display the screenshot
    createSiteView(site, conf[site], localStorage.getItem(conf[site]));
  }
}

// refresh sites screenshots
for(const site in conf) {
  // check site screenshot expiration date
  expiry = parseInt(localStorage.getItem(conf[site] + '_exp'))
  expired = new Date() > new Date(isNaN(expiry) ? 0 : expiry)

  if(!localStorage.getItem(conf[site]) || expired) { // no cached snapshot for this site or expired
    fetch('http://bonetti.io:3032/websnap/img/?url=https://' + conf[site]
      + '&width=' + Math.round(window.innerWidth*1.3) + '&height=' + Math.round(window.innerHeight*1.3))
    .then(function(response) {
      if(response.ok)
        return response.blob();
      else
        return {error_type: "request"};
    }).then(function(picture) {
      if(!('error_type' in picture)) {
        storePic(site, picture);
      }
    });
  }
}
