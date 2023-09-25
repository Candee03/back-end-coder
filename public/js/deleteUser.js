async function deleteUser (uid, cid){
    await fetch(`http://localhost:8080/api/users/${uid}`, { method: 'DELETE' })
    .then(async(res) => {
        await fetch(`http://localhost:8080/api/carts/delete/${cid}`, { method: 'DELETE' })
        .catch(error => {
            console.log(`Error: ${error.message}`);
        })
        if (res.ok) return location.reload()
    })
    .catch(error => {
        console.error(`Error: ${error.message}`);
    });
}