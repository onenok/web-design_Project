// Extracted scripts from showFormValue.html

console.log('showFormValue page script loaded.');

(function () {
console.log('showFormValue page script loaded Double Check.');

console.log('Show Form Values page script loaded');
    const items = sessionStorage.getItem("submittedItems").split(','); // a list of items []
    console.log(items);
    document.getElementById("value-display").innerHTML = `<h3>The items you submitted are: ${items.toString()}</h3><br>`;

    for (let item of items) {
        const value = sessionStorage.getItem(item);
        document.getElementById("value-display").innerHTML += `<p><strong>${item}:</strong> ${value}</p>`;
    }

})();
