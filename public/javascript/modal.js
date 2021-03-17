document.getElementById('transBtn').addEventListener("click", function(e){
  // event.preventDefault();
  var balance=Number(e.target.getAttribute("balance"))
var amount=Number(document.getElementById("amt").value);
if (amount<balance){
  balance=balance-amount;
  document.getElementById("modal-title").innerHTML = 'Success!';
  document.getElementById("modalText").innerHTML ='Amount of Rs.'+ amount +' has been transfered.' ;
}
else{
  document.getElementById("modal-title").innerHTML = 'Failed!';
  document.getElementById("modalText").innerHTML ='Amount requested to transfer is more than balance in account.' ;
}
document.querySelector('#transModal').style.display = "block";
document.querySelector(".modalClose").addEventListener("click", function() {
document.querySelector('#transModal').style.display = "none";

});
})
