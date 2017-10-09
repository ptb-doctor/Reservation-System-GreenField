window.onload = function() {
console.log('hii')
var profile;
$.ajax({
                url: '/patientprofile',
                dataType: 'json',
                async: false,
                success: function(data) {
                    console.log(data)
                    document.getElementById("image").src=data[0].image;
                    document.getElementById("name").textContent=data[0].name;
                    document.getElementById("phone").textContent=data[0].phone;

                }
        });
}
       //when the document is finished loading, replace everything
       //between the <a ...> </a> tags with the value of splitText
