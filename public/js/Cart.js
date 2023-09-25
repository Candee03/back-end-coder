async function vaciarCarrito (cid) {
    await fetch (`http://localhost:8080/api/carts/${cid}`, {method: 'DELETE'})
    .then((res) => {
        if (res.ok) return location.reload()
    })
}
async function purchase (cid) {
    await fetch (`http://localhost:8080/api/carts/${cid}/purchase`, {method: 'POST'})
    .then((res) => {
        if (res.ok) return location.reload()
    })
}