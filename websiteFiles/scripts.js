pantry = [];
const protoItem = {name: "", quantity: 0, expiration: "", category: "", notes: "", isOpened: false};
date = new Date();
//ingredients = [];
//ingredients.push("chicken");
//ingredients.push("rice");

function searchRecipes() {
  searchTerm = ("site:allrecipes.com "+pantry.get(0).name);
  var searchUrl = "https://www.google.com/search?q=" + encodeURIComponent(searchTerm);
  window.open(searchUrl, "_blank");
}
function sortbyDate(a,b) {
  var dateA = new Date(a.expiration);
  var dateB = new Date(b.expiration);
  return dateA - dateB;
}
form = document.getElementById("itemForm");
function addToPantry() {
  item1 = Object.create(protoItem);
  item1.name = document.getElementById("name").value;
  item1.quantity = document.getElementById("quantity").value;
  item1.expiration = document.getElementById("expiration").value;
  item1.category = document.getElementById("category").value;
  item1.notes = document.getElementById("notes").value;
  item1.isOpened = document.getElementById("isOpened").checked;
  console.log(item1);
  pantry.push(item1);
  pantry.sort(sortbyDate);
  form.reset();
  document.getElementById("itemConf").classList.remove("hidden");
  setTimeout(() => {
    document.getElementById("itemConf").classList.add("hidden");
  }, 3000); 
}
form.addEventListener('submit', function(event) {
  // Now this is completely standard and safe from deprecation warnings
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  addToPantry();
});

function removeItem() {
  var item = document.getElementById("itemName").value;
  var index = pantry.findIndex(function(pantryItem) {
    return pantryItem.name === item;
  });
  if (index !== -1) {
    pantry.splice(index, 1);
  }
}
function showPantry() {
  var pantryList = document.getElementById("pantryList");
  pantryList.innerHTML = "";
  for (var i = 0; i < pantry.length; i++) {
    var li = document.createElement("li");
    li.textContent = pantry[i].name + " - " + pantry[i].quantity;
    pantryList.appendChild(li);
  }
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
  var cookies = document.cookie.split("; ");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.indexOf("pantry=") === 0) {
      var pantryString = cookie.substring(7);
      pantry = JSON.parse(pantryString);
      break;
    }
  }
  document.getElementById("cookieLoadConf").classList.remove("hidden");
  setTimeout(() => {
    document.getElementById("cookieLoadConf").classList.add("hidden");
  }, 3000); 
}
// each user's pantry is going to be stored as a list/array of objects,
//  where each object has keys for the item name, quantity, expiration date, category, notes, and opened status.
//  The list will be stored in a cookie, and the cookie will be updated whenever
//  the user adds or removes an item from their pantry. This will allow the user to have a persistent pantry across sessions,
//  so that the user's pantry is saved for future visits to the website.
//document.cookie
