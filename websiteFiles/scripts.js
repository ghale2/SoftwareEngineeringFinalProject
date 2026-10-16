pantry = [];
ingredient = {name: "", quantity: 0, expiration: "", category: "", notes: "", isOpened: false};
date = new Date();
//ingredients = [];
//ingredients.push("chicken");
//ingredients.push("rice");

window.searchRecipes = function() {
  searchTerm = ("site:allrecipes.com "+pantry.get(0).name);
  var searchUrl = "https://www.google.com/search?q=" + encodeURIComponent(searchTerm);
  window.open(searchUrl, "_blank");
}
sortbyDate = function(a,b) {
  var dateA = new Date(a.expiration);
  var dateB = new Date(b.expiration);
  return dateA - dateB;
}
window.addToPantry = function() {
  ingredient.name = document.getElementById("name").value;
  ingredient.quantity = document.getElementById("quantity").value;
  ingredient.expiration = document.getElementById("expiration").value;
  ingredient.category = document.getElementById("category").value;
  ingredient.notes = document.getElementById("notes").value;
  ingredient.isOpened = document.getElementById("isOpened").checked;
  pantry.push(ingredient);
  pantry.sort(sortbyDate);
  document.getElementById("itemForm").reset();
  document.getElementById("confirmation").classList.remove("hidden");
  setTimeout(() => {
    document.getElementById("confirmation").classList.add("hidden");
  }, 3000); 
  console.log(ingredient);
}
const btn = document.getElementById("addButton");
btn.addEventListener("click", addToPantry);
window.removeItem = function() {
  var item = document.getElementById("itemName").value;
  var index = pantry.findIndex(function(pantryItem) {
    return pantryItem.name === item;
  });
  if (index !== -1) {
    pantry.splice(index, 1);
  }
}
window.showPantry = function() {
  var pantryList = document.getElementById("pantryList");
  pantryList.innerHTML = "";
  for (var i = 0; i < pantry.length; i++) {
    var li = document.createElement("li");
    li.textContent = pantry[i].name + " - " + pantry[i].quantity;
    pantryList.appendChild(li);
  }
}
const btn2 = document.getElementById("show");
btn2.addEventListener("click", showPantry);
// each user's pantry is going to be stored as a list/array of objects,
//  where each object has keys for the item name, quantity, expiration date, category, notes, and opened status.
//  The list will be stored in a cookie, and the cookie will be updated whenever
//  the user adds or removes an item from their pantry. This will allow the user to have a persistent pantry across sessions,
//  so that the user's pantry is saved for future visits to the website.
//document.cookie
