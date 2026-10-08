// =====================================================
// MINI GROCERY POS SYSTEM
// =====================================================


// =====================================================
// DATA
// =====================================================

let products =
    JSON.parse(
        localStorage.getItem("products")
    ) || [

        {
            id: 1,
            name: "น้ำดื่ม",
            category: "เครื่องดื่ม",
            cost: 5,
            price: 10,
            stock: 30,
            minStock: 5
        },

        {
            id: 2,
            name: "น้ำอัดลม",
            category: "เครื่องดื่ม",
            cost: 12,
            price: 20,
            stock: 20,
            minStock: 5
        },

        {
            id: 3,
            name: "อกไก่สด",
            category: "อาหารสด",
            cost: 40,
            price: 50,
            stock: 15,
            minStock: 5
        },

        {
            id: 4,
            name: "ไข่ไก่",
            category: "อาหารสด",
            cost: 3,
            price: 4,
            stock: 50,
            minStock: 10
        },

        {
            id: 5,
            name: "มันฝรั่งทอด",
            category: "ขนม",
            cost: 15,
            price: 20,
            stock: 20,
            minStock: 5
        },

        {
            id: 6,
            name: "น้ำปลา",
            category: "เครื่องปรุง",
            cost: 25,
            price: 35,
            stock: 15,
            minStock: 5
        },

        {
            id: 7,
            name: "ถุงขยะ",
            category: "ของใช้",
            cost: 25,
            price: 35,
            stock: 10,
            minStock: 3
        }

    ];


let categories =
    JSON.parse(
        localStorage.getItem("categories")
    ) || [

        "เครื่องดื่ม",
        "อาหารสด",
        "ขนม",
        "เครื่องปรุง",
        "ของใช้",
        "อื่น ๆ"

    ];


let sales =
    JSON.parse(
        localStorage.getItem("sales")
    ) || [];


let cart = [];


let selectedCategory = "ทั้งหมด";


let paymentMethod = "cash";


// =====================================================
// SAVE DATA
// =====================================================

function saveProducts() {

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

}


function saveCategories() {

    localStorage.setItem(
        "categories",
        JSON.stringify(categories)
    );

}


function saveSales() {

    localStorage.setItem(
        "sales",
        JSON.stringify(sales)
    );

}


// =====================================================
// PAGE
// =====================================================

function showPage(pageName) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.add("hidden");

        });


    document
        .getElementById(pageName)
        .classList.remove("hidden");


    if (pageName === "dashboard") {

        updateDashboard();

    }


    if (pageName === "pos") {

        displayCategoryButtons();

        displayPOSProducts();

        displayCart();

    }


    if (pageName === "products") {

        updateProductCategorySelect();

        displayCategories();

        displayProducts();

    }


    if (pageName === "reports") {

        displayReport();

    }

}


// =====================================================
// CATEGORY ICON
// =====================================================

function getCategoryIcon(category) {

    const icons = {

        "เครื่องดื่ม": "🥤",

        "อาหารสด": "🥩",

        "ขนม": "🍪",

        "เครื่องปรุง": "🧂",

        "ของใช้": "🧴",

        "อาหารแห้ง": "🍚",

        "เครื่องเขียน": "✏️",

        "ของใช้ส่วนตัว": "🧼",

        "อื่น ๆ": "📦"

    };


    return icons[category] || "📦";

}


// =====================================================
// CATEGORY MANAGEMENT
// =====================================================

function addCategory() {

    const input =
        document.getElementById(
            "newCategory"
        );


    const category =
        input.value.trim();


    if (category === "") {

        alert(
            "กรุณากรอกชื่อหมวดหมู่"
        );

        return;

    }


    if (
        categories.includes(category)
    ) {

        alert(
            "หมวดหมู่นี้มีอยู่แล้ว"
        );

        return;

    }


    categories.push(category);


    saveCategories();


    input.value = "";


    displayCategories();


    updateProductCategorySelect();


    displayCategoryButtons();


    alert(
        `เพิ่มหมวด "${category}" สำเร็จ`
    );

}


// =====================================================
// DISPLAY CATEGORY
// =====================================================

function displayCategories() {

    const container =
        document.getElementById(
            "categoryList"
        );


    container.innerHTML = "";


    categories.forEach(category => {

        const count =
            products.filter(
                product =>
                    product.category ===
                    category
            ).length;


        const div =
            document.createElement(
                "div"
            );


        div.className =
            "category-item";


        div.innerHTML = `

            <div>

                <strong>
                    ${getCategoryIcon(category)}
                    ${category}
                </strong>

                <span>
                    ${count} สินค้า
                </span>

            </div>


            <button
                class="danger"
                onclick="
                    deleteCategory(
                        '${escapeQuotes(category)}'
                    )
                "
            >
                🗑 ลบ
            </button>

        `;


        container.appendChild(div);

    });

}


// =====================================================
// DELETE CATEGORY
// =====================================================

function deleteCategory(category) {

    const productsInCategory =
        products.filter(
            product =>
                product.category ===
                category
        );


    if (
        productsInCategory.length > 0
    ) {

        alert(
            `ไม่สามารถลบหมวด "${category}" ได้\n\n` +
            `มีสินค้าอยู่ ${productsInCategory.length} รายการ\n\n` +
            `กรุณาเปลี่ยนหมวดหมู่สินค้าก่อน`
        );

        return;

    }


    if (
        !confirm(
            `ต้องการลบหมวด "${category}" หรือไม่?`
        )
    ) {

        return;

    }


    categories =
        categories.filter(
            item =>
                item !== category
        );


    saveCategories();


    displayCategories();

    updateProductCategorySelect();

    displayCategoryButtons();

}


// =====================================================
// CATEGORY SELECT
// =====================================================

function updateProductCategorySelect() {

    const select =
        document.getElementById(
            "productCategory"
        );


    select.innerHTML = "";


    categories.forEach(category => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            category;


        option.textContent =
            `${getCategoryIcon(category)} ${category}`;


        select.appendChild(
            option
        );

    });

}


// =====================================================
// POS CATEGORY BUTTONS
// =====================================================

function displayCategoryButtons() {

    const container =
        document.getElementById(
            "categoryButtons"
        );


    if (!container) return;


    container.innerHTML = "";


    const allButton =
        document.createElement(
            "button"
        );


    allButton.className =
        "category-button";


    if (
        selectedCategory ===
        "ทั้งหมด"
    ) {

        allButton.classList.add(
            "active"
        );

    }


    allButton.innerHTML =
        "📦 ทั้งหมด";


    allButton.onclick =
        function() {

            selectedCategory =
                "ทั้งหมด";


            displayCategoryButtons();


            displayPOSProducts();

        };


    container.appendChild(
        allButton
    );


    categories.forEach(category => {

        const button =
            document.createElement(
                "button"
            );


        button.className =
            "category-button";


        if (
            selectedCategory ===
            category
        ) {

            button.classList.add(
                "active"
            );

        }


        button.innerHTML =
            `${getCategoryIcon(category)} ${category}`;


        button.onclick =
            function() {

                selectedCategory =
                    category;


                displayCategoryButtons();


                displayPOSProducts();

            };


        container.appendChild(
            button
        );

    });

}


// =====================================================
// PRODUCT CRUD
// =====================================================

function saveProduct() {

    const id =
        document.getElementById(
            "productId"
        ).value;


    const name =
        document.getElementById(
            "productName"
        ).value.trim();


    const category =
        document.getElementById(
            "productCategory"
        ).value;


    const cost =
        Number(
            document.getElementById(
                "productCost"
            ).value
        );


    const price =
        Number(
            document.getElementById(
                "productPrice"
            ).value
        );


    const stock =
        Number(
            document.getElementById(
                "productStock"
            ).value
        );


    const minStock =
        Number(
            document.getElementById(
                "productMinStock"
            ).value
        );


    if (
        name === "" ||
        category === ""
    ) {

        alert(
            "กรุณากรอกข้อมูลสินค้าให้ครบ"
        );

        return;

    }


    if (
        cost < 0 ||
        price < 0 ||
        stock < 0 ||
        minStock < 0
    ) {

        alert(
            "ตัวเลขต้องไม่ติดลบ"
        );

        return;

    }


    if (id === "") {

        const newProduct = {

            id:
                Date.now(),

            name:
                name,

            category:
                category,

            cost:
                cost,

            price:
                price,

            stock:
                stock,

            minStock:
                minStock

        };


        products.push(
            newProduct
        );


        alert(
            "เพิ่มสินค้าเรียบร้อย"
        );

    }

    else {

        const product =
            products.find(
                item =>
                    item.id ==
                    Number(id)
            );


        if (product) {

            product.name =
                name;

            product.category =
                category;

            product.cost =
                cost;

            product.price =
                price;

            product.stock =
                stock;

            product.minStock =
                minStock;


            alert(
                "แก้ไขสินค้าเรียบร้อย"
            );

        }

    }


    saveProducts();


    clearProductForm();


    displayProducts();


    displayPOSProducts();


    displayCategories();


    updateDashboard();

}


// =====================================================
// CLEAR PRODUCT FORM
// =====================================================

function clearProductForm() {

    document.getElementById(
        "productId"
    ).value = "";


    document.getElementById(
        "productName"
    ).value = "";


    document.getElementById(
        "productCost"
    ).value = "";


    document.getElementById(
        "productPrice"
    ).value = "";


    document.getElementById(
        "productStock"
    ).value = "";


    document.getElementById(
        "productMinStock"
    ).value = "5";

}


// =====================================================
// DISPLAY PRODUCTS
// =====================================================

function displayProducts() {

    const table =
        document.getElementById(
            "productTable"
        );


    const search =
        document.getElementById(
            "productSearch"
        ).value
        .toLowerCase();


    table.innerHTML = "";


    const filtered =
        products.filter(
            product =>
                product.name
                    .toLowerCase()
                    .includes(search)
        );


    filtered.forEach(product => {

        const lowStock =
            product.stock <=
            product.minStock;


        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `

            <td>
                ${product.name}
            </td>

            <td>
                ${getCategoryIcon(product.category)}
                ${product.category}
            </td>

            <td>
                ฿${product.cost.toFixed(2)}
            </td>

            <td>
                ฿${product.price.toFixed(2)}
            </td>

            <td>
                ${product.stock}
            </td>

            <td>

                ${
                    lowStock

                    ?

                    `<span class="low-stock">
                        ⚠️ ใกล้หมด
                    </span>`

                    :

                    `<span class="normal-stock">
                        ✓ ปกติ
                    </span>`
                }

            </td>


            <td>

                <button
                    class="table-button edit-button"
                    onclick="
                        editProduct(
                            ${product.id}
                        )
                    "
                >
                    ✏️ แก้ไข
                </button>


                <button
                    class="table-button delete-button"
                    onclick="
                        deleteProduct(
                            ${product.id}
                        )
                    "
                >
                    🗑 ลบ
                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


// =====================================================
// EDIT PRODUCT
// =====================================================

function editProduct(id) {

    const product =
        products.find(
            item =>
                item.id === id
        );


    if (!product) return;


    document.getElementById(
        "productId"
    ).value =
        product.id;


    document.getElementById(
        "productName"
    ).value =
        product.name;


    document.getElementById(
        "productCategory"
    ).value =
        product.category;


    document.getElementById(
        "productCost"
    ).value =
        product.cost;


    document.getElementById(
        "productPrice"
    ).value =
        product.price;


    document.getElementById(
        "productStock"
    ).value =
        product.stock;


    document.getElementById(
        "productMinStock"
    ).value =
        product.minStock;


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// =====================================================
// DELETE PRODUCT
// =====================================================

function deleteProduct(id) {

    const product =
        products.find(
            item =>
                item.id === id
        );


    if (!product) return;


    if (
        !confirm(
            `ต้องการลบ "${product.name}" หรือไม่?`
        )
    ) {

        return;

    }


    products =
        products.filter(
            item =>
                item.id !== id
        );


    saveProducts();


    displayProducts();


    displayPOSProducts();


    displayCategories();


    updateDashboard();

}


// =====================================================
// POS PRODUCTS
// =====================================================

function displayPOSProducts() {

    const container =
        document.getElementById(
            "posProducts"
        );


    if (!container) return;


    const search =
        document.getElementById(
            "searchProduct"
        ).value
        .toLowerCase();


    container.innerHTML = "";


    const filtered =
        products.filter(product => {

            const matchCategory =
                selectedCategory ===
                "ทั้งหมด"

                ?

                true

                :

                product.category ===
                selectedCategory;


            const matchSearch =
                product.name
                    .toLowerCase()
                    .includes(search);


            return (
                matchCategory &&
                matchSearch
            );

        });


    if (
        filtered.length === 0
    ) {

        container.innerHTML = `

            <div class="box">

                ไม่พบสินค้า

            </div>

        `;

        return;

    }


    filtered.forEach(product => {

        const div =
            document.createElement(
                "div"
            );


        div.className =
            "product-card";


        div.innerHTML = `

            <h3>
                ${getCategoryIcon(product.category)}
                ${product.name}
            </h3>


            <div class="price">

                ฿${product.price.toFixed(2)}

            </div>


            <div class="stock">

                เหลือ ${product.stock} ชิ้น

            </div>


            <button
                class="success"
                onclick="
                    addToCart(
                        ${product.id}
                    )
                "
                ${
                    product.stock <= 0
                    ?
                    "disabled"
                    :
                    ""
                }
            >

                ${
                    product.stock <= 0
                    ?
                    "❌ สินค้าหมด"
                    :
                    "➕ เพิ่มลงตะกร้า"
                }

            </button>

        `;


        container.appendChild(div);

    });

}


// =====================================================
// CART
// =====================================================

function addToCart(id) {

    const product =
        products.find(
            item =>
                item.id === id
        );


    if (!product) return;


    if (
        product.stock <= 0
    ) {

        alert(
            "สินค้าหมด"
        );

        return;

    }


    const item =
        cart.find(
            item =>
                item.id === id
        );


    if (item) {

        if (
            item.quantity >=
            product.stock
        ) {

            alert(
                "สินค้าในสต็อกไม่เพียงพอ"
            );

            return;

        }


        item.quantity++;

    }

    else {

        cart.push({

            id:
                id,

            quantity:
                1

        });

    }


    displayCart();

}


// =====================================================
// DISPLAY CART
// =====================================================

function displayCart() {

    const container =
        document.getElementById(
            "cartItems"
        );


    container.innerHTML = "";


    if (
        cart.length === 0
    ) {

        container.innerHTML =
            "ยังไม่มีสินค้า";

        calculateTotal();

        return;

    }


    cart.forEach(item => {

        const product =
            products.find(
                product =>
                    product.id ===
                    item.id
            );


        if (!product) return;


        const div =
            document.createElement(
                "div"
            );


        div.className =
            "cart-item";


        const total =
            product.price *
            item.quantity;


        div.innerHTML = `

            <div>

                <div class="cart-item-name">

                    ${product.name}

                </div>


                <small>

                    ฿${product.price.toFixed(2)}
                    ×
                    ${item.quantity}

                </small>


                <div class="quantity-buttons">

                    <button
                        onclick="
                            changeQuantity(
                                ${product.id},
                                -1
                            )
                        "
                    >
                        −
                    </button>


                    <strong>
                        ${item.quantity}
                    </strong>


                    <button
                        onclick="
                            changeQuantity(
                                ${product.id},
                                1
                            )
                        "
                    >
                        +
                    </button>


                    <button
                        onclick="
                            removeFromCart(
                                ${product.id}
                            )
                        "
                    >
                        🗑
                    </button>

                </div>

            </div>


            <strong>

                ฿${total.toFixed(2)}

            </strong>

        `;


        container.appendChild(div);

    });


    calculateTotal();

}


// =====================================================
// CHANGE QUANTITY
// =====================================================

function changeQuantity(
    id,
    amount
) {

    const item =
        cart.find(
            item =>
                item.id === id
        );


    const product =
        products.find(
            product =>
                product.id === id
        );


    if (!item || !product)
        return;


    item.quantity += amount;


    if (
        item.quantity <= 0
    ) {

        cart =
            cart.filter(
                item =>
                    item.id !== id
            );

    }


    if (
        item.quantity >
        product.stock
    ) {

        item.quantity =
            product.stock;

        alert(
            "สินค้าในสต็อกไม่เพียงพอ"
        );

    }


    displayCart();

}


// =====================================================
// REMOVE CART
// =====================================================

function removeFromCart(id) {

    cart =
        cart.filter(
            item =>
                item.id !== id
        );


    displayCart();

}


// =====================================================
// CALCULATE TOTAL
// =====================================================

function calculateTotal() {

    let subtotal = 0;


    cart.forEach(item => {

        const product =
            products.find(
                product =>
                    product.id ===
                    item.id
            );


        if (product) {

            subtotal +=
                product.price *
                item.quantity;

        }

    });


    const discount =
        Number(
            document.getElementById(
                "discount"
            ).value
        ) || 0;


    const total =
        Math.max(
            0,
            subtotal - discount
        );


    document.getElementById(
        "cartSubtotal"
    ).textContent =
        `฿${subtotal.toFixed(2)}`;


    document.getElementById(
        "cartTotal"
    ).textContent =
        `฿${total.toFixed(2)}`;


    calculateChange();


    if (
        paymentMethod ===
        "transfer"
    ) {

        generateQR();

    }


    return {
        subtotal,
        discount,
        total
    };

}


// =====================================================
// CASH PAYMENT
// =====================================================

function calculateChange() {

    const total =
        calculateSimpleTotal();


    const payment =
        Number(
            document.getElementById(
                "payment"
            ).value
        ) || 0;


    const change =
        payment - total;


    document.getElementById(
        "change"
    ).textContent =
        `฿${Math.max(
            0,
            change
        ).toFixed(2)}`;

}


// =====================================================
// SIMPLE TOTAL
// =====================================================

function calculateSimpleTotal() {

    let subtotal = 0;


    cart.forEach(item => {

        const product =
            products.find(
                product =>
                    product.id ===
                    item.id
            );


        if (product) {

            subtotal +=
                product.price *
                item.quantity;

        }

    });


    const discount =
        Number(
            document.getElementById(
                "discount"
            ).value
        ) || 0;


    return Math.max(
        0,
        subtotal - discount
    );

}


// =====================================================
// PAYMENT METHOD
// =====================================================

function selectPayment(method) {

    paymentMethod =
        method;


    const cashButton =
        document.getElementById(
            "cashButton"
        );


    const transferButton =
        document.getElementById(
            "transferButton"
        );


    const cashPayment =
        document.getElementById(
            "cashPayment"
        );


    const transferPayment =
        document.getElementById(
            "transferPayment"
        );


    if (
        method ===
        "cash"
    ) {

        cashButton.classList.add(
            "active"
        );


        transferButton.classList.remove(
            "active"
        );


        cashPayment.classList.remove(
            "hidden"
        );


        transferPayment.classList.add(
            "hidden"
        );

    }

    else {

        transferButton.classList.add(
            "active"
        );


        cashButton.classList.remove(
            "active"
        );


        cashPayment.classList.add(
            "hidden"
        );


        transferPayment.classList.remove(
            "hidden"
        );


        generateQR();

    }

}


// =====================================================
// PROMPTPAY
// =====================================================

function savePromptPay() {

    const id =
        document.getElementById(
            "promptpayId"
        ).value.trim();


    if (id === "") {

        alert(
            "กรุณากรอกเบอร์ PromptPay"
        );

        return;

    }


    localStorage.setItem(
        "promptpayId",
        id
    );


    generateQR();


    alert(
        "บันทึก PromptPay เรียบร้อย"
    );

}


// =====================================================
// GENERATE QR
// =====================================================

function generateQR() {

    const qrArea =
        document.getElementById(
            "qrArea"
        );


    if (!qrArea) return;


    const promptpayId =
        document.getElementById(
            "promptpayId"
        ).value.trim();


    const total =
        calculateSimpleTotal();


    if (
        promptpayId === ""
    ) {

        qrArea.innerHTML = `

            <p>
                กรุณากรอกหมายเลข PromptPay
            </p>

        `;

        return;

    }


    /*
        QR นี้เป็น QR สำหรับเปิดหน้า QR
        โดยส่งยอดเงินไปด้วย

        หมายเหตุ:
        หากร้านต้องการ PromptPay QR
        ที่รองรับธนาคารโดยตรง
        ให้ใช้หมายเลข PromptPay จริง
    */


    const qrData =
        `PromptPay: ${promptpayId} | Amount: ${total.toFixed(2)}`;


    const qrUrl =
        "https://api.qrserver.com/v1/create-qr-code/?" +
        "size=250x250&data=" +
        encodeURIComponent(qrData);


    qrArea.innerHTML = `

        <p>
            <strong>
                ยอดชำระ
            </strong>
        </p>

        <h2>
            ฿${total.toFixed(2)}
        </h2>


        <img
            src="${qrUrl}"
            alt="QR Code"
        >


        <p>
            PromptPay:
            ${promptpayId}
        </p>

    `;

}


// =====================================================
// CHECKOUT
// =====================================================

function checkout() {

    if (
        cart.length === 0
    ) {

        alert(
            "กรุณาเพิ่มสินค้าลงตะกร้าก่อน"
        );

        return;

    }


    const totals =
        calculateTotal();


    let payment = 0;

    let change = 0;


    if (
        paymentMethod ===
        "cash"
    ) {

        payment =
            Number(
                document.getElementById(
                    "payment"
                ).value
            ) || 0;


        if (
            payment <
            totals.total
        ) {

            alert(
                "จำนวนเงินที่รับมาไม่เพียงพอ"
            );

            return;

        }


        change =
            payment -
            totals.total;

    }

    else {

        payment =
            totals.total;

        change =
            0;

    }


    // ตรวจสอบสต็อก

    for (
        const item of cart
    ) {

        const product =
            products.find(
                product =>
                    product.id ===
                    item.id
            );


        if (
            !product ||
            item.quantity >
            product.stock
        ) {

            alert(
                `สินค้า ${product.name} มีไม่เพียงพอ`
            );

            return;

        }

    }


    // ลดสต็อก

    cart.forEach(item => {

        const product =
            products.find(
                product =>
                    product.id ===
                    item.id
            );


        product.stock -=
            item.quantity;

    });


    // สร้างเลขบิล

    const receiptNumber =
        "INV-" +
        Date.now();


    // รายการสินค้า

    const saleItems =
        cart.map(item => {

            const product =
                products.find(
                    product =>
                        product.id ===
                        item.id
                );


            return {

                id:
                    product.id,

                name:
                    product.name,

                category:
                    product.category,

                cost:
                    product.cost,

                price:
                    product.price,

                quantity:
                    item.quantity,

                total:
                    product.price *
                    item.quantity

            };

        });


    // คำนวณกำไร

    let profit = 0;


    saleItems.forEach(item => {

        profit +=
            (
                item.price -
                item.cost
            ) *
            item.quantity;

    });


    const sale = {

        receiptNumber:
            receiptNumber,

        date:
            new Date().toISOString(),

        items:
            saleItems,

        subtotal:
            totals.subtotal,

        discount:
            totals.discount,

        total:
            totals.total,

        payment:
            payment,

        change:
            change,

        paymentMethod:
            paymentMethod,

        profit:
            profit

    };


    sales.push(sale);


    saveSales();


    saveProducts();


    // พิมพ์ใบเสร็จ

    createReceipt(sale);


    // ล้างข้อมูล

    cart = [];


    document.getElementById(
        "payment"
    ).value = "";


    document.getElementById(
        "discount"
    ).value = "0";


    displayCart();


    displayPOSProducts();


    updateDashboard();


    alert(
        `ชำระเงินสำเร็จ\n\nเลขที่บิล: ${receiptNumber}`
    );


    // เปิดหน้าพิมพ์

    printReceipt();

}


// =====================================================
// CLEAR CART
// =====================================================

function clearCart() {

    if (
        cart.length === 0
    ) return;


    if (
        !confirm(
            "ต้องการล้างสินค้าในตะกร้าหรือไม่?"
        )
    ) {

        return;

    }


    cart = [];


    document.getElementById(
        "discount"
    ).value = "0";


    document.getElementById(
        "payment"
    ).value = "";


    displayCart();

}


// =====================================================
// RECEIPT
// =====================================================

function createReceipt(sale) {

    const receipt =
        document.getElementById(
            "printReceipt"
        );


    const date =
        new Date(
            sale.date
        );


    let html = `

        <h2>
            ร้านขายของชำ
        </h2>


        <div class="receipt-center">

            Mini Grocery POS

            <br>

            ${date.toLocaleString("th-TH")}

            <br>

            ${sale.receiptNumber}

        </div>


        <div class="receipt-line"></div>

    `;


    sale.items.forEach(item => {

        html += `

            <div class="receipt-item">

                <span>

                    ${item.name}

                    x${item.quantity}

                </span>


                <span>

                    ฿${item.total.toFixed(2)}

                </span>

            </div>

        `;

    });


    html += `

        <div class="receipt-line"></div>


        <div class="receipt-item">

            <span>
                รวม
            </span>

            <span>
                ฿${sale.subtotal.toFixed(2)}
            </span>

        </div>


        <div class="receipt-item">

            <span>
                ส่วนลด
            </span>

            <span>
                ฿${sale.discount.toFixed(2)}
            </span>

        </div>


        <div class="receipt-item receipt-total">

            <span>
                ยอดสุทธิ
            </span>

            <span>
                ฿${sale.total.toFixed(2)}
            </span>

        </div>


        <div class="receipt-item">

            <span>
                ชำระโดย
            </span>

            <span>

                ${
                    sale.paymentMethod ===
                    "cash"
                    ?
                    "เงินสด"
                    :
                    "เงินโอน"
                }

            </span>

        </div>


        <div class="receipt-item">

            <span>
                รับเงิน
            </span>

            <span>
                ฿${sale.payment.toFixed(2)}
            </span>

        </div>


        <div class="receipt-item">

            <span>
                เงินทอน
            </span>

            <span>
                ฿${sale.change.toFixed(2)}
            </span>

        </div>


        <div class="receipt-line"></div>


        <div class="receipt-center">

            ขอบคุณที่ใช้บริการ

            <br>

            ❤️ ขอบคุณครับ ❤️

        </div>

    `;


    receipt.innerHTML =
        html;

}


// =====================================================
// PRINT
// =====================================================

function printReceipt() {

    setTimeout(
        () => {

            window.print();

        },
        300
    );

}


// =====================================================
// DASHBOARD
// =====================================================

function updateDashboard() {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const todaySales =
        sales.filter(
            sale =>
                sale.date
                    .startsWith(today)
        );


    let salesAmount = 0;

    let itemAmount = 0;

    let profit = 0;


    todaySales.forEach(sale => {

        salesAmount +=
            sale.total;


        profit +=
            sale.profit;


        sale.items.forEach(item => {

            itemAmount +=
                item.quantity;

        });

    });


    document.getElementById(
        "todaySales"
    ).textContent =
        `฿${salesAmount.toFixed(2)}`;


    document.getElementById(
        "todayBills"
    ).textContent =
        todaySales.length;


    document.getElementById(
        "todayItems"
    ).textContent =
        itemAmount;


    document.getElementById(
        "todayProfit"
    ).textContent =
        `฿${profit.toFixed(2)}`;


    displayTopProducts(
        todaySales
    );


    displayLowStock();


    displayTodaySales(
        todaySales
    );

}


// =====================================================
// TOP PRODUCTS
// =====================================================

function displayTopProducts(
    todaySales
) {

    const container =
        document.getElementById(
            "topProducts"
        );


    const productMap = {};


    todaySales.forEach(sale => {

        sale.items.forEach(item => {

            if (
                !productMap[item.name]
            ) {

                productMap[item.name] =
                    0;

            }


            productMap[item.name] +=
                item.quantity;

        });

    });


    const result =
        Object.entries(
            productMap
        )
        .sort(
            (a, b) =>
                b[1] - a[1]
        )
        .slice(0, 10);


    if (
        result.length === 0
    ) {

        container.innerHTML =
            "ยังไม่มีข้อมูลการขาย";

        return;

    }


    container.innerHTML =
        result.map(
            ([name, quantity]) => `

                <div class="report-item">

                    <span>
                        🏆 ${name}
                    </span>

                    <strong>
                        ${quantity} ชิ้น
                    </strong>

                </div>

            `
        )
        .join("");

}


// =====================================================
// LOW STOCK
// =====================================================

function displayLowStock() {

    const container =
        document.getElementById(
            "lowStockProducts"
        );


    const low =
        products.filter(
            product =>
                product.stock <=
                product.minStock
        );


    if (
        low.length === 0
    ) {

        container.innerHTML =
            "✅ ไม่มีสินค้าใกล้หมด";

        return;

    }


    container.innerHTML =
        low.map(
            product => `

                <div class="report-item">

                    <span>
                        ⚠️ ${product.name}
                    </span>

                    <strong class="low-stock">

                        เหลือ ${product.stock}

                    </strong>

                </div>

            `
        )
        .join("");

}


// =====================================================
// TODAY SALES
// =====================================================

function displayTodaySales(
    todaySales
) {

    const container =
        document.getElementById(
            "todaySalesList"
        );


    if (
        todaySales.length === 0
    ) {

        container.innerHTML =
            "ยังไม่มีรายการขายวันนี้";

        return;

    }


    container.innerHTML =
        todaySales
            .slice()
            .reverse()
            .map(
                sale => `

                    <div class="report-bill">

                        <strong>
                            ${sale.receiptNumber}
                        </strong>

                        <br>

                        ${new Date(
                            sale.date
                        ).toLocaleTimeString(
                            "th-TH"
                        )}

                        <br>

                        ยอดขาย:
                        <strong>
                            ฿${sale.total.toFixed(2)}
                        </strong>

                        <br>

                        ชำระ:
                        ${
                            sale.paymentMethod ===
                            "cash"
                            ?
                            "💵 เงินสด"
                            :
                            "📱 เงินโอน"
                        }

                    </div>

                `
            )
            .join("");

}


// =====================================================
// REPORT
// =====================================================

function displayReport() {

    const date =
        document.getElementById(
            "reportDate"
        ).value;


    if (!date) return;


    const reportSales =
        sales.filter(
            sale =>
                sale.date.startsWith(
                    date
                )
        );


    let totalSales = 0;

    let totalItems = 0;

    let totalProfit = 0;


    const productMap = {};


    reportSales.forEach(sale => {

        totalSales +=
            sale.total;


        totalProfit +=
            sale.profit;


        sale.items.forEach(item => {

            totalItems +=
                item.quantity;


            if (
                !productMap[item.name]
            ) {

                productMap[item.name] = {

                    quantity: 0,

                    total: 0

                };

            }


            productMap[item.name]
                .quantity +=
                item.quantity;


            productMap[item.name]
                .total +=
                item.total;

        });

    });


    document.getElementById(
        "reportSales"
    ).textContent =
        `฿${totalSales.toFixed(2)}`;


    document.getElementById(
        "reportBills"
    ).textContent =
        reportSales.length;


    document.getElementById(
        "reportItems"
    ).textContent =
        totalItems;


    document.getElementById(
        "reportProfit"
    ).textContent =
        `฿${totalProfit.toFixed(2)}`;


    // สินค้า

    const productContainer =
        document.getElementById(
            "reportProducts"
        );


    const productsReport =
        Object.entries(
            productMap
        );


    if (
        productsReport.length === 0
    ) {

        productContainer.innerHTML =
            "ยังไม่มีข้อมูล";

    }

    else {

        productContainer.innerHTML =
            productsReport
                .sort(
                    (a, b) =>
                        b[1].quantity -
                        a[1].quantity
                )
                .map(
                    ([name, data]) => `

                        <div class="report-item">

                            <span>
                                📦 ${name}
                            </span>

                            <strong>

                                ${data.quantity}
                                ชิ้น

                                <br>

                                ฿${data.total.toFixed(2)}

                            </strong>

                        </div>

                    `
                )
                .join("");

    }


    // บิล

    const billContainer =
        document.getElementById(
            "reportBillsList"
        );


    if (
        reportSales.length === 0
    ) {

        billContainer.innerHTML =
            "ยังไม่มีข้อมูล";

    }

    else {

        billContainer.innerHTML =
            reportSales
                .slice()
                .reverse()
                .map(
                    sale => `

                        <div class="report-bill">

                            <strong>
                                ${sale.receiptNumber}
                            </strong>

                            <br>

                            เวลา:
                            ${new Date(
                                sale.date
                            ).toLocaleTimeString(
                                "th-TH"
                            )}

                            <br>

                            จำนวนสินค้า:
                            ${sale.items.reduce(
                                (sum, item) =>
                                    sum +
                                    item.quantity,
                                0
                            )}

                            ชิ้น

                            <br>

                            ยอดขาย:
                            <strong>
                                ฿${sale.total.toFixed(2)}
                            </strong>

                            <br>

                            ชำระโดย:

                            ${
                                sale.paymentMethod ===
                                "cash"
                                ?
                                "💵 เงินสด"
                                :
                                "📱 เงินโอน"
                            }

                        </div>

                    `
                )
                .join("");

    }

}


// =====================================================
// LOAD PROMPTPAY
// =====================================================

function loadPromptPay() {

    const saved =
        localStorage.getItem(
            "promptpayId"
        );


    if (saved) {

        document.getElementById(
            "promptpayId"
        ).value =
            saved;

    }

}


// =====================================================
// ESCAPE QUOTES
// =====================================================

function escapeQuotes(text) {

    return text
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

}


// =====================================================
// INITIALIZE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateProductCategorySelect();

        displayCategories();

        displayCategoryButtons();

        displayProducts();

        displayPOSProducts();

        displayCart();

        updateDashboard();

        loadPromptPay();


        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        document.getElementById(
            "reportDate"
        ).value =
            today;


        displayReport();

    }
);