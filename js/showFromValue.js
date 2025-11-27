// Extracted scripts from showFromValue.html

const items = sessionStorage.getItem("submittedItems").split(','); // a list of items []
    console.log(items);
    document.getElementById("value-display").innerHTML = `<h3>您提交的項目有: ${items.toString()}</h3>`;

    for (let item of items) {
        const value = sessionStorage.getItem(item);
        document.getElementById("value-display").innerHTML += `<p><strong>${item}:</strong> ${value}</p>`;
    }

