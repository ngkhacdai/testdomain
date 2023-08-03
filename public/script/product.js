const dialog = document.getElementById('upDialog');
const formAddAndUpdate = document.getElementById('formAddAndUpdate');
const blah = document.getElementById('blah');
let action = '/addProduct';

const addDialog = () => {
    action = '/addProduct';
    dialog.showModal();
}
const closeDialog = () => {
    document.getElementById("formAddAndUpdate").reset();
    blah.src = "";
    dialog.close();
}
const editDialog = (id,name,brand,price,quantyti,descaption,contentType,data) => {
    action = '/updateProduct/'+id;
    document.getElementById('name').value = name;
    document.getElementById('brand').value = brand;
    document.getElementById('price').value = price;
    document.getElementById('quantyti').value = quantyti;
    document.getElementById('descaption').value = descaption;
    let srcImgage = "data:" + contentType + ";base64," + data;
    blah.src = srcImgage;
    dialog.showModal();
}
const deleteAlert = (id) => {
    const check = confirm('Bạn có muốn xóa?')
    if(check){
        location.href = '/deleteProduct/'+id;
    }
}
const save = () => {
        formAddAndUpdate.action = action;
        formAddAndUpdate.submit();
}
imgInp.onchange = evt => {
    const [file] = imgInp.files
    if (file) {
        blah.src = URL.createObjectURL(file)
    }
}
$(document).ready(function(){ $("table").DataTable({ order:[0,'desc'] });
});