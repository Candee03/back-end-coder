async function purchase (cid) {
    await fetch (`http://localhost:8080/api/carts/${cid}/purchase`, {method: 'POST'})
    .then((res) => {
        if (res.ok) location.replace('http://localhost:8080/products')
    })
    .catch((error) => {
        console.log(error);
    })
}