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

async function changeRole(uid) {
    await fetch (`http://localhost:8080/api/users/premium/${uid}`, {method: 'GET'})
    .then((res) => {
        if (res.ok) return location.reload()
    })
}

async function removeInactiveUsers() {
    await fetch (`http://localhost:8080/api/users/`, {method: 'DELETE'})
    .then( (res) => {
        if (res.ok) return location.reload()
    })
}