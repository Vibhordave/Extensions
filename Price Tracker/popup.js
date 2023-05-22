// DOM elements
let productList,addButton;

let problemListKey = 'item';
window.onload=function(){
    productList = document.getElementById('productList');
    addButton = document.getElementById('addButton');
    addButton.addEventListener('click', addProduct);
}
const productURL = window.location.href;
document.addEventListener("DOMContentLoaded", async () => {
    chrome.storage.sync.get([problemListKey], (data) => {
        const currentBookmarks = data[problemListKey] ? JSON.parse(data[problemListKey]) : [];
        viewBookmarks(currentBookmarks);
    });
});

const productItem = document.createElement('div.productItem');
const viewBookmarks = (currentBookmarks = []) => {
    if (currentBookmarks.length > 0) {
        for (let i = 0; i < currentBookmarks.length; i++) {
            const bookmark = currentBookmarks[i];
            productItem.innerHTML = `
                <span class="productName">${bookmark.desc}</span>
                <span class="productPrice">${bookmark.pricing}</span>
                <a class="links" href=${bookmark.url}>Link</a>
            `;
            productList.appendChild(productItem);
        }
    } else {
        productList.innerHTML = '<i class="row">No bookmarks to show</i>';
    }
    return;
};

// Add a product to the tracker
function addProduct() {
  const productName = prompt('Enter product name:');
  
  
  console.log(productName);
  if (productName && productURL) {
    const productItem = document.createElement('div');
    productItem.className = 'productItem';
    productItem.innerHTML += `
      <span class="productName">${productName}</span>
      <span class="productPrice">Loading...</span>
      <a class="links" href=${productURL}>Link</a>
    `;
    productList.appendChild(productItem);

    // Send a message to the background script to track the product
    chrome.runtime.sendMessage({ type: 'trackProduct', url: productURL }, (response) => {
      if (response.success) {
        productItem.querySelector('.productPrice').textContent = response.price;
        addButton.addEventListener('click',() =>{
            addNewBookmarkEventHandler(response.price,productName);
        });
      } else {
        productItem.querySelector('.productPrice').textContent = 'Error fetching price';
      }
    });
  }
}

// add to storage,get actual price,style it up,add link



const addNewBookmarkEventHandler = async (price,product) => {
	currentProblemBookmarks = await fetchBookmarks();
	
	let addNewToBookmark = true;
	for (let i = 0; i < currentProblemBookmarks.length; i++) {
		if (currentProblemBookmarks[i].url == productURL) {
			addNewToBookmark = false;
		}
	}
    const newBookmarkObj={
        url:productURL,
        desc : product,
        pricing : price,
    }
	if (addNewToBookmark) {
		chrome.storage.sync.set({
			[problemListKey]: JSON.stringify([
				...currentProblemBookmarks,
				newBookmarkObj,
			]),
		});
	}
};



const fetchBookmarks = () => {
	return new Promise((resolve) => {
		chrome.storage.sync.get([problemListKey], (obj) => {
			resolve(obj[problemListKey] ? JSON.parse(obj[problemListKey]) : []);
		});
	});
};