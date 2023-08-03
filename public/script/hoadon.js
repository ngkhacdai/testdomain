$(document).ready(function(){ $("table").DataTable({ order:[0,'desc'] });
      });

const orderDetails = (id) => {
    location.href = '/orderdetails/' + id;
}
