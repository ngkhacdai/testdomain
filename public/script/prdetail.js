const addTocart = async (id) => {
    alert('Sản phẩm đã thêm vào giỏ hàng');
    fetch('/addToCart/'+ id,{method: 'GET'})
}