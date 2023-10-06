async function deleteUser (uid, cid){
    await fetch(`/api/users/${uid}`, { method: 'DELETE' })
    .then(async(res) => {
        await fetch(`/api/carts/delete/${cid}`, { method: 'DELETE' })
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
    await fetch (`/api/users/premium/${uid}`, {method: 'GET'})
    .then((res) => {
        if (res.ok) return location.reload()
    })
}

async function removeInactiveUsers() {
    await fetch (`/api/users/`, {method: 'DELETE'})
    .then( (res) => {
        if (res.ok) return location.reload()
    })
}


async function register () {
    const first_name = document.getElementById('first_name')
    const last_name = document.getElementById('last_name')
    const email = document.getElementById('email')
    const age = document.getElementById('age')
    const img = document.getElementById('img')
    const password = document.getElementById('password')

    const formData = {
        first_name:first_name.value,
        last_name:last_name.value,
        email:email.value,
        age:age.value,
        img:img.value,
        password:password.value,
    }
    console.log(formData);

    await fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify(formData),
    })
    .then((res) => {
        if(res.ok) return location.replace('/')
    })
    .catch((error) => {
        console.error(`Error: ${error.message}`);
    })
}