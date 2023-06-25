const form = document.getElementById("item-form");
const list = document.querySelector("ul");
const clean = document.getElementById("clear");
const filter = document.querySelector(".filter");
const btn = form.querySelector("button");
const input = document.querySelector("#item-input");
let editMode = false;

function addItem(e) {
  e.preventDefault();
  const inputField = document.getElementById("item-input");
  const value = inputField.value;

  if (value === "") {
    alert("Enter Item");
    return;
  }

  if (editMode) {
    const newItem = list.querySelector(".edit-class");
    deleteItemLocal(newItem.textContent);
    newItem.classList.remove("edit-class");
    newItem.remove();
    setEditState = false;
  } else {
    if (checkDuplicate(value.toLowerCase()) === true) {
      alert("Item already in list");
      inputField.value = "";
      return;
    }
  }

  addItemToDOM(value);
  addItemToLocal(value);

  removeExcess();
  inputField.value = "";
}

function addItemToDOM(item) {
  const text = document.createTextNode(item);
  const li = document.createElement("li");
  li.appendChild(text);

  const button = createBtn("remove-item btn-link text-red");
  li.appendChild(button);

  list.appendChild(li);
}

function addItemFromLocal() {
  const itemArray = getLocalItems();
  itemArray.forEach((item) => addItemToDOM(item));
  removeExcess();
}

function createBtn(classes) {
  const button = document.createElement("button");
  button.className = classes;

  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);

  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

function addItemToLocal(item) {
  let itemArray = getLocalItems();
  itemArray.push(item);

  localStorage.setItem("items", JSON.stringify(itemArray));
}

function getLocalItems() {
  let itemArray;

  if (localStorage.getItem("items") === null) {
    itemArray = [];
  } else {
    itemArray = JSON.parse(localStorage.getItem("items"));
  }
  return itemArray;
}

function deleteItem(e) {
  if (e.target.tagName === "I") {
    const btn = e.target.parentElement;
    const li = btn.parentElement;
    const text = li.textContent;
    if (confirm("Do you wish to delete item?")) {
      li.remove();
      deleteItemLocal(text);
    }
    removeExcess();
  } else {
    setEditState(e.target);
  }
}

function setEditState(item) {
  editMode = true;

  list
    .querySelectorAll("li")
    .forEach((li) => li.classList.remove("edit-class"));

  item.classList.add("edit-class");
  btn.innerHTML = `<i class = "fa-solid fa-pen"></i>Update item`;
  btn.style.backgroundColor = "#228B22";
  input.value = item.textContent;
}

function deleteItemLocal(text) {
  let itemArray = getLocalItems();
  itemArray = itemArray.filter((item) => item !== text);
  localStorage.setItem("items", JSON.stringify(itemArray));
}

function clearAll(e) {
  const lis = document.querySelectorAll("li");
  if (confirm("Do you wish to delete all items?")) {
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
    localStorage.removeItem("items");
  }

  removeExcess();
}

function filterList(e) {
  const text = e.target.value.toLowerCase();
  const lis = list.querySelectorAll("li");

  lis.forEach((item) => {
    const itemText = item.textContent.toLowerCase();

    if (itemText.indexOf(text) != -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

function removeExcess() {
  input.value = "";

  const ul = document.querySelectorAll("li");
  if (ul.length === 0) {
    document.getElementById("filter").style.display = "none";
    document.getElementById("clear").style.display = "none";
  } else {
    document.getElementById("filter").style.display = "block";
    document.getElementById("clear").style.display = "block";
  }

  btn.innerHTML = `<i class = "fa-solid fa-plus"></i>Add Item`;
  btn.style.backgroundColor = "#333";
  editMode = false;
}

function checkDuplicate(item) {
  const itemArray = getLocalItems();
  itemArray.forEach((item) => item.toLowerCase());
  if (itemArray.includes(item)) {
    return true;
  } else {
    return false;
  }
}

function init() {
  form.addEventListener("submit", addItem);
  list.addEventListener("click", deleteItem);
  clean.addEventListener("click", clearAll);
  filter.addEventListener("input", filterList);
  document.addEventListener("DOMContentLoaded", addItemFromLocal);

  removeExcess();
}
init();
