async function purchase (cid) {
    await fetch (`/api/carts/${cid}/purchase`, {method: 'POST'})
    .then((res) => {
        if (res.ok) location.replace('/products')
    })
    .catch((error) => {
        console.log(error);
    })
}