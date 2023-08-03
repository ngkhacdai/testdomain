const giaoHang = async (id) => {
    await fetch('/giaoHang/'+id,{method: 'GET'}).then(() =>{
        location.reload();
    })
}

const nhanHang = async (id) => {
    await fetch('/nhanHang/'+id,{method: 'GET'}).then(() =>{
        location.reload();
    })
}
