function createSiteView(siteid, site, picurl) {
  document.getElementById(siteid).innerHTML = `
    <a href="https://${site}">
      <img class="sitepic" src="${picurl}">
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

for(const site in conf) {
  if(!localStorage.getItem(conf[site])) { // no cached snapshot for this site
    fetch('https://api.apiflash.com/v1/urltoimage?access_key=' + apiflashKey + '&url=https://' + conf[site]
      + '&width=' + Math.round(window.innerWidth*1.8) + '&height=' + Math.round(window.innerHeight*1.8) + '&response_type=json')
    .then(function(response) {
      if(response.ok)
        return response.json();
      else
        return {error_type: "request"};
    }).then(function(picjson) {
      if(!('error_type' in picjson) && 'url' in picjson) {
        createSiteView(site, conf[site], picjson.url);
        localStorage.setItem(conf[site], picjson.url);
      } else {
        console.log(picjson);
        createErrorView(site, conf[site]);
      }
    });
  } else {
    createSiteView(site, conf[site], localStorage.getItem(conf[site]));
  }
}
