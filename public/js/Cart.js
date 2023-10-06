async function vaciarCarrito (cid) {
    await fetch (`http://localhost:8080/api/carts/${cid}`, {method: 'DELETE'})
    .then((res) => {
        if (res.ok) return location.reload()
    })
}
function goToPurchase (cid) {
    return location.replace(`/purchase/${cid}`)
}