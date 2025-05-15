const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const clearBtn = document.getElementById("clear");
const itemFilter = document.getElementById("filter");

function addItem(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    // Validate input
    if (newItem === "") {
        alert("Please enter an item");
        return;
    }

    // Create list item
    const listItem = document.createElement("li");
    listItem.appendChild(document.createTextNode(newItem));

    const button = createButton("remove-item btn-link text-red");
    listItem.appendChild(button);

    // Add li to DOM
    itemList.appendChild(listItem);

    setUiState();

    itemInput.value = "";
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

function removeItem(e) {
    if (e.target.parentElement.classList.contains("remove-item")) {
        if (confirm("Are you sure?")) {
            e.target.parentElement.parentElement.remove();
            setUiState();
        }
    }
}

function removeAllItems() {
    if (confirm("Are you sure?")) {
        while (itemList.firstChild) {
            itemList.removeChild(itemList.firstChild);
        }

        setUiState();
    }
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

// Event listeners
itemForm.addEventListener("submit", addItem);
itemList.addEventListener("click", removeItem);
clearBtn.addEventListener("click", removeAllItems);

setUiState();
