// Load all menu items for this stall (e.g. Golden Grain Chicken Rice)
// Use ?stall=01 in URL if coming from browse-stalls; default '01'
function getStallIdFromUrl() {
  var params = new URLSearchParams(window.location.search);
  return params.get('stall') || '01';
}
const STALL_ID = getStallIdFromUrl();

// Load stall name and description from StallsDB for banner
if (typeof StallsDB !== 'undefined') {
  StallsDB.getByStallId(STALL_ID)
    .then(function (stall) {
      var nameEl = document.getElementById('stallName');
      var descEl = document.getElementById('stallDesc');
      if (nameEl) nameEl.textContent = stall ? (stall.stallName || 'Stall') : 'Stall';
      if (descEl) descEl.textContent = stall ? (stall.stallDesc || '') : '';
    })
    .catch(function () {
      var nameEl = document.getElementById('stallName');
      var descEl = document.getElementById('stallDesc');
      if (nameEl) nameEl.textContent = 'Stall';
      if (descEl) descEl.textContent = '';
    });
}

function formatPrice(value) {
  var n = Number(value);
  if (!Number.isFinite(n)) return '$0.00';
  return '$' + (n % 1 === 0 ? n : n.toFixed(2));
}

function renderMenu(items) {
  var container = document.querySelector('.stalls');
  if (!container) return;
  container.innerHTML = '';
  if (!Array.isArray(items) || items.length === 0) {
    container.innerHTML = '<p class="menu-empty">Menu coming soon!</p>';
    return;
  }

  items.forEach(function (item) {
    var name = item.itemName || 'Menu Item';
    var desc = item.itemDesc || '';
    var price = item.itemPrice != null ? item.itemPrice : 0;
    var imgSrc = item.image || '';

    var card = document.createElement('div');
    card.className = 'stall-card';
    card.innerHTML =
      '<img src="' + (imgSrc || '').replace(/"/g, '&quot;') + '" alt="' + (name.replace(/</g, '&lt;').replace(/"/g, '&quot;')) + '">' +
      '<div class="stall-info">' +
      '<h4>' + (name.replace(/</g, '&lt;')) + '</h4>' +
      '<p>' + (desc.replace(/</g, '&lt;')) + '</p>' +
      '<div class="stall-price"><p>' + formatPrice(price) + '</p></div>' +
      '<button class="add" type="button">+</button>' +
      '</div>';

    var addBtn = card.querySelector('.add');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        var payload = {
          name: name,
          desc: desc,
          unitPrice: price,
          imageSrc: imgSrc,
          imageAlt: name
        };
        try {
          sessionStorage.setItem('pendingCustomisationItem', JSON.stringify(payload));
        } catch (e) {}
        window.location.href = 'order-customisation.html';
      });
    }

    container.appendChild(card);
  });
}

MenuDB.onSnapshotByStall(STALL_ID, function (items) {
  renderMenu(items);
});
