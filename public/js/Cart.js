async function vaciarCarrito (cid) {
    await fetch (`/api/carts/${cid}`, {method: 'DELETE'})
    .then((res) => {
        if (res.ok) return location.reload()
    })
}
function goToPurchase (cid) {
    return location.replace(`/purchase/${cid}`)
}