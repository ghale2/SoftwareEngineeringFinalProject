pantry = [];
const protoItem = {name: "", quantity: 0, expiration: "", category: "", notes: "", isOpened: false, dateOpened: ""};
date = new Date();
//ingredients = [];
//ingredients.push("chicken");
//ingredients.push("rice");

function searchRecipes() {
  if (pantry.length === 0) {
    alert("Your pantry is empty. Add some items first.");
    return;
  }
  var searchUrl = "https://www.allrecipes.com/search?q=" + pantry[0].name;
  if (pantry.length > 1) {
    searchUrl += (" " + pantry[1].name);
  }
  if (pantry.length > 2) {
    searchUrl += (" " + pantry[2].name);
  }
  //searchTerm = ("site:allrecipes.com "+pantry[0].name);
  //var searchUrl = "https://www.google.com/search?q=" + encodeURIComponent(searchTerm);
  window.open(searchUrl, "_blank");
}
function sortbyDate(a,b) {
  if (!a.expiration) return 1;
  if (!b.expiration) return -1;
  var dateA = new Date(a.expiration);
  var dateB = new Date(b.expiration);
  return dateA - dateB;
}

function addToPantry() {
  item1 = Object.create(protoItem);
  item1.name = document.getElementById("name").value;
  item1.quantity = document.getElementById("quantity").value;
  item1.expiration = document.getElementById("expiration").value;
  item1.category = document.getElementById("category").value;
  item1.notes = document.getElementById("notes").value;
  item1.isOpened = document.getElementById("isOpened").checked;
  item1.dateOpened = document.getElementById("dateOpened").value;

  console.log(item1);
  pantry.push(item1);
  pantry.sort(sortbyDate);
  form.reset();
  showPantry();
  savePantryToCookie();
  document.getElementById("itemConf").classList.remove("hidden");
  setTimeout(() => {
    document.getElementById("itemConf").classList.add("hidden");
  }, 3000); 
}


// Edit item in pantry when the "Edit" button is clicked
document.addEventListener('click', function(event) {
  if (event.target.className === 'edit') {
    let li = event.target.parentNode;
    let index = Array.from(ul.children).indexOf(li);
    let ul = li.parentNode;
    
  }
});
// Remove item from pantry when the "Remove" button is clicked
document.addEventListener('click', function(event) {
  let li = event.target.parentNode;
  let ul = li.parentNode;
  let index = Array.from(ul.children).indexOf(li);
  if (event.target.className === 'edit') {
    if (index !== -1) {
      var item = pantry[index];
      // Open a form or modal to edit the item
      document.getElementById("name").value = item.name;
      document.getElementById("quantity").value = item.quantity;
      document.getElementById("expiration").value = item.expiration;
      document.getElementById("category").value = item.category;
      document.getElementById("notes").value = item.notes;
      document.getElementById("isOpened").checked = item.isOpened;
      document.getElementById("dateOpened").value = item.dateOpened;
      // Store the index of the item being edited
      form.dataset.editIndex = index;
    }
  }
  if (event.target.className === 'remove' || event.target.className === 'edit') {
    if (index !== -1) {
      pantry.splice(index, 1); 
      savePantryToCookie();
      showPantry();
    }
  }
});

function showPantry() {
  var pantryList = document.getElementById("pantryList");
  pantryList.innerHTML = "";
  for (var i = 0; i < pantry.length; i++) {
    var li = document.createElement("li");
    currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "addItem.html") {
      li.innerHTML = pantry[i].name + " - " + pantry[i].quantity + " - " + pantry[i].expiration + " <button class='remove'>Remove</button> <button class='edit'>Edit</button>";
    }
    else{
      li.innerHTML = pantry[i].name + " - " + pantry[i].quantity + " - " + pantry[i].expiration;
    }
    if (pantry[i].isOpened) {
      li.classList.add("opened");
    }
    if (pantry[i].expiration - new Date() < 0 || pantry[i].dateOpened - new Date() < 0){
      li.classList.add("expired");
    }
    pantryList.appendChild(li);
  }
  console.log("Pantry displayed: " + JSON.stringify(pantry));
}
function savePantryToCookie() {
  var pantryString = JSON.stringify(pantry);
  console.log("Saving pantry to cookie: " + pantryString);
  document.cookie = "pantry=" + pantryString + "; path=/;";
  console.log("Cookie saved: " + document.cookie);
  document.getElementById("cookieSaveConf").classList.remove("hidden");
  setTimeout(() => {
    document.getElementById("cookieSaveConf").classList.add("hidden");
  }, 3000); 
}
function loadPantryFromCookie() {
  if(document.cookie.length === 0) {
    console.log("No cookies found, starting with an empty pantry.");
    return;
  }
  else{
    var cookies = document.cookie.split("; ");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.indexOf("pantry=") === 0) {
        var pantryString = cookie.substring(7);
        pantry = JSON.parse(pantryString);
        break;
    
      }
    }
  }
  document.getElementById("cookieLoadConf").classList.remove("hidden");
  setTimeout(() => {
    document.getElementById("cookieLoadConf").classList.add("hidden");
  }, 3000); 
}
function remindExpired() {
  var today = new Date();
  var expiredItems = pantry.filter(item => item.expiration && new Date(item.expiration) < today);
  if (expiredItems.length > 0) {
    alert("The following items have expired:\n" + expiredItems.map(item => item.name).join("\n"));
  }
}
function remindExpiringSoon() {
  var today = new Date();
  var expiringSoonItems = pantry.filter(item => item.expiration && (today - new Date(item.expiration)) / (7 * 24 * 60 * 60 * 1000) < 30 && new Date(item.expiration) < today); 
  if (expiringSoonItems.length > 0) {
    alert("The following items are expiring soon:\n" + expiringSoonItems.map(item => item.name).join("\n"));
  }
}
// STARTUP FUNCTIONS
document.addEventListener("DOMContentLoaded", function() {
  loadPantryFromCookie();
  showPantry();
  remindExpired();
  remindExpiringSoon();
  try {
    form = document.getElementById("itemForm");
    form.addEventListener('submit', function(event) {
      // Now this is completely standard and safe from deprecation warnings
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      addToPantry();
      });
    }
  catch (error) {
    console.log("No form found on this page, skipping form event listener setup.");
  }
});




    // each user's pantry is going to be stored as a list/array of objects,
   //  where each object has keys for the item name, quantity, expiration date, category, notes, and opened status.
  //  The list will be stored in a cookie, and the cookie will be updated whenever
 //  the user adds or removes an item from their pantry. This will allow the user to have a persistent pantry across sessions,
//  so that the user's pantry is saved for future visits to the website.
