async function deleteProduct (pid){

    const url = `http://localhost:8080/api/products/${pid}`

    console.log(url);

    await fetch(url, { 
        method: 'DELETE'
    })
    .then(res => {
        if (res.ok) return location.reload()
    })
    .catch(error => {
        console.error(`Error: ${error.message}`);
    });
}