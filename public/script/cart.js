const removeItemInCart = (id) => {
    location.href = '/deleteItemInCart/' + id;
}

const total = document.getElementById('total');
const quantity = document.getElementsByName('quantity');
const price = document.getElementsByName('price');

const tangQuantity = (gia,index) => {
    quantity[index].stepUp()
    tinhTien(gia,index)
}

const giamQuantity = (gia,index) => {
    quantity[index].stepDown()
    tinhTien(gia,index)
}

const tinhTien = (gia,index) => {
    var tinh = Number(quantity[index].value) * gia;
    price[index].innerHTML = tinh + 'đ';

    var tong = 0;
    for (let i = 0; i < price.length; i++) {
        tong += Number(price[i].innerHTML.substring(0, price[i].innerHTML.length-1));
    }
    total.innerHTML = tong.toString();
}

const thanhToan = async () => {
    if(total.innerHTML == '0'){
        alert('Không có sản phẩm trong giỏ hàng')
    }else{ 
        var listQ = [];
    for (let i = 0; i < quantity.length; i++) {
        listQ.push(Number(quantity[i].value));
    }
    await fetch('/thanhToan',{method: 'POST',headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({listQ: listQ,total: Number(total.innerHTML)})
    }).then(()=> {
        location.reload()
    })
    }
    
}
