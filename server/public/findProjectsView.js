$(document).ready(function(){

   var request = $.ajax({
        url: "/projects",
        type: "GET",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        data: {}
      }).done(function(data) {
      	console.log("data got");
      	console.log(data);
        for (var i = data.length - 1; i >= 0; i--) {
          
          $('.projectsList').append("<a style='text-decoration:none;' href='#projectModal' rel='modal:open'><li class='list-group-item projectItem'><h3 class='projectTitle'>"+  data[i].title +"</h3><p class='projectDescription'>"+ data[i].description +"</p></li></a>");
        }
      }).fail(function( data ) {
      	console.log("faaiiluuure");
      });



      


});
