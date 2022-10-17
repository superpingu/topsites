function createSiteView(siteid, site) {
  document.getElementById(siteid).innerHTML = `
    <a href="#" onclick="triggerScreenshot('${siteid}', '${site}');return false;">
      <img class="sitepic" src="${sitepics[siteid]}">
    </a>
    <br>
    <span class="url">${site.split('/')[0]}</span>
  `;
}

function createErrorView(siteid, site) {
  document.getElementById(siteid).innerHTML = `
    <a href="#" onclick="triggerScreenshot('${siteid}', '${site}');return false;">
      <div class="sitepic errorpic"></div>
    </a>
    <span class="url">${site.split('/')[0]}</span>
  `;
}

// tell the background service to take a screenshot of the site to be loaded
function triggerScreenshot(siteid, site) {
  fetch('http://localhost:3232/site/' + siteid + '/').then(function(response) {
    return false;
  }).then(function() {});
  window.location.replace('https://' + site);
}

// show the grid
for(const site in conf) {
  if(site in sitepics) {
    // display the screenshot
    createSiteView(site, conf[site]);
  } else {
    // display a placeholder
    createErrorView(site, conf[site]);
  }
}
