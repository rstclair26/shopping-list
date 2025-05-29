const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
const itemInputButton = itemForm.querySelector("button");
let isEditMode = false;

function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach((item) => addItemToDOM(item));

    setUiState();
}

function onItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    // Validate input
    if (newItem === "") {
        alert("Please enter an item.");
        return;
    }

    if (isEditMode) {
        const itemToEdit = itemList.querySelector(".edit-mode");
        updateItem(itemToEdit, newItem);
        isEditMode = false;
    } else {
        if (checkIfItemExists(newItem)) {
            alert("This item already exists - try again.");
            return;
        }
        // Create item DOM element
        addItemToDOM(newItem);

        // Add item to storage
        addItemToStorage(newItem);

        setUiState();
    }
}

function addItemToDOM(item) {
    // Create list item
    const listItem = document.createElement("li");
    listItem.appendChild(document.createTextNode(item));

    const button = createButton("remove-item btn-link text-red");
    listItem.appendChild(button);

    // Add li to DOM
    itemList.appendChild(listItem);
}

function createButton(classes) {
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

function updateItem(item, newValue) {
    let itemsFromStorage = getItemsFromStorage();
    const oldValue = item.firstChild.textContent;

    // Update item in storage
    itemsFromStorage.forEach((value, index, array) => {
        if (array[index] === oldValue) array[index] = newValue;
    });

    localStorage.setItem("items", JSON.stringify(itemsFromStorage));

    // Update item in DOM
    item.firstChild.textContent = newValue;
    item.classList.remove("edit-mode");

    setUiState();
}

function addItemToStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.push(item);

    // Convert to JSON string and set to storage
    localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
    let itemsFromStorage;

    if (localStorage.getItem("items") === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem("items"));
    }

    return itemsFromStorage;
}

function onItemClick(e) {
    // Check whether item name or delete button was clicked
    if (e.target.parentElement.classList.contains("remove-item")) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
    isEditMode = true;

    // Reset all items to non-edit display mode
    itemList
        .querySelectorAll("li")
        .forEach((i) => i.classList.remove("edit-mode"));

    // Set selected item to edit display mode and put the value into the input field
    item.classList.add("edit-mode");
    itemInputButton.innerHTML = "<i class='fa-solid fa-pen'></i> Update Item";
    itemInputButton.style.backgroundColor = "green";
    itemInput.value = item.textContent;
    itemInput.focus();
}

function removeItem(item) {
    if (confirm("Are you sure?")) {
        // Remove item from DOM
        item.remove();

        // Remove item from storage
        removeItemFromStorage(item.textContent);

        setUiState();
    }
}

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    // Filter out the selected item
    itemsFromStorage = itemsFromStorage.filter(
        (filteredItem) => filteredItem !== item
    );

    // Set updated items to storage
    localStorage.setItem("items", JSON.stringify(itemsFromStorage));
}

function removeAllItems() {
    if (confirm("Are you sure?")) {
        while (itemList.firstChild) {
            itemList.removeChild(itemList.firstChild);
        }

        // Clear from storage
        localStorage.removeItem("items");

        setUiState();
    }
}

function filterItems() {
    const filterText = itemFilter.value.toLowerCase();
    const items = itemList.querySelectorAll("li");

    items.forEach((item) => {
        item.style.display = item.textContent.toLowerCase().includes(filterText)
            ? "flex"
            : "none";
    });
}

function setUiState() {
    const items = itemList.querySelectorAll("li");

    if (items.length === 0) {
        clearBtn.style.display = "none";
        itemFilter.style.display = "none";
    } else {
        clearBtn.style.display = "block";
        itemFilter.style.display = "block";
    }

    itemInputButton.innerHTML = "<i class='fa-solid fa-plus'></i> Add Item";
    itemInputButton.style.backgroundColor = "#333";

    itemInput.value = "";

    isEditMode = false;
}

function init() {
    // Event listeners
    itemForm.addEventListener("submit", onItemSubmit);
    itemList.addEventListener("click", onItemClick);
    clearBtn.addEventListener("click", removeAllItems);
    itemFilter.addEventListener("input", filterItems);
    document.addEventListener("DOMContentLoaded", displayItems);

    setUiState();
}

init();
