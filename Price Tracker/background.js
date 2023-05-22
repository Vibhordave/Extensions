// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'trackProduct') {
      fetchProductPrice(message.url)
        .then((price) => sendResponse({ success: true, price }))
        .catch(() => sendResponse({ success: false }));
      
      return true; // Indicates that we will send a response asynchronously
    }
  });
  
  // Fetch the price of the product from the provided URL (replace this with your own logic)
  function fetchProductPrice(url) {
    return new Promise((resolve, reject) => {
      // Simulate an asynchronous call to fetch the price
      setTimeout(() => {
        const randomPrice = (Math.random() * 100).toFixed(2);
        resolve('$' + randomPrice);
      }, 2000);
    });
  }
  