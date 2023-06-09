const addToCartButtons = document.querySelectorAll(".add");
const cartId = document.getElementById("cartId").textContent;

addToCartButtons.forEach((element) => {
  element.addEventListener("click", (evt) => {
    console.log("click");
    const idAttr = element.getAttribute("id");
    const productId = idAttr.split("_").pop();
    fetch("/api/carts", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then((resp) => {
      resp.json().then((respDeserilize) => {
        console.log(respDeserilize);
        fetch(`/api/carts/${respDeserilize.payload._id}/product/${productId}`, {
          method: "PUT", // *GET, POST, PUT, DELETE, etc.
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify({
            quantity: 1,
          }),
        }).then((resp2) => {
          console.log(resp2);
        });
      });
    });
  });
});
