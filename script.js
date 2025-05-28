const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter = document.getElementById("filter");

function displayItems() {
    const itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.forEach((item) => addItemToDOM(item));

    setUiState();
}

function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    // Validate input
    if (newItem === "") {
        alert("Please enter an item");
        return;
    }

    // Create item DOM element
    addItemToDOM(newItem);

    // Add item to storage
    addItemToStorage(newItem);

    setUiState();

    itemInput.value = "";
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
    // Check if delete button was clicked
    if (e.target.parentElement.classList.contains("remove-item")) {
        removeItem(e.target.parentElement.parentElement);
    }
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
}

function init() {
    // Event listeners
    itemForm.addEventListener("submit", onAddItemSubmit);
    itemList.addEventListener("click", onItemClick);
    clearBtn.addEventListener("click", removeAllItems);
    itemFilter.addEventListener("input", filterItems);
    document.addEventListener("DOMContentLoaded", displayItems);

    setUiState();
}

init();
