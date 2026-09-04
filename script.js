let productName = document.getElementById("productName"),
    productPrice = document.getElementById("productPrice"),
    productQuantity = document.getElementById("productQuantity"),
    saveBtn = document.getElementById("saveBtn"),
    message = document.getElementById("message"),
    productList = document.getElementById("productList"),
    total = document.getElementById("total");

let products = [],
    editIndex = null;

let savedProducts = localStorage.getItem("products");

if (savedProducts !== null) {
    products = JSON.parse(savedProducts);
}

let msgTimeout;

function showMsg(msg, isError) {
    clearTimeout(msgTimeout);

    message.textContent = msg;
    message.style.color = isError ? "#ff4d4d" : "#facc15";

    msgTimeout = setTimeout(() => {
        message.textContent = "";
        message.style.color = "";
    }, 5000);
    }

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

function displayProducts() {
    productList.innerHTML = "";

    products.forEach(function (product, index) {
        productList.innerHTML += `
            <div class="product-card">
                <h3>${product.name}</h3>

                <p>Price: ${product.price}</p>
                <p>Quantity: ${product.quantity}</p>
                <p>Total: ${(product.price * product.quantity).toFixed(2)}</p>

                <div class="buttons">
                    <button onclick="editProduct(${index})" class="edit-btn">Edit</button>
                    <button onclick="deleteProduct(${index})" class="delete-btn">Delete</button>
                </div>
            </div>
            `;
    });
    
    total.textContent = products.length;
}

saveBtn.addEventListener("click", function () {
    let product = {
        name: productName.value.trim(),
        price: parseFloat(productPrice.value),
        quantity: parseInt(productQuantity.value)
    };

    if (
        product.name === "" ||
        isNaN(product.price) ||
        isNaN(product.quantity)
    ) {
        showMsg("Please fill all fields with valid data", true);
        return;
    }

    if (product.price <= 0 || product.quantity <= 0) {
        showMsg("Price and quantity must be greater than 0", true);
        return;
    }

    if (editIndex === null) {
        products.push(product);
        showMsg("Product Added Successfully", false);
    } else {
        products[editIndex] = product;
        editIndex = null;
        saveBtn.textContent = "Save Product";
        showMsg("Product Updated Successfully", false);
    }

    saveProducts();
    displayProducts();

    if (!Number.isInteger(parseFloat(productQuantity.value))) {
        showMsg(
            `Fraction removed. Quantity saved as ${product.quantity}`,
            true
        );
    }

    productName.value = "";
    productPrice.value = "";
    productQuantity.value = "";
});

function editProduct(index) {
    productName.value = products[index].name;
    productPrice.value = products[index].price;
    productQuantity.value = products[index].quantity;

    editIndex = index;
    saveBtn.textContent = "Update Product";
}

function deleteProduct(index) {
    products.splice(index, 1);

    saveProducts();
    displayProducts();

    showMsg("Product Deleted Successfully", false);
}

function deleteAll() {
    if (products.length === 0) {
        showMsg("No products to delete", true);
        return;
    }

    products = [];

    saveProducts();
    displayProducts();

    showMsg("All Products Deleted Successfully", false);
}

displayProducts();
