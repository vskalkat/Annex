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

      }).fail(function( data ) {
      	console.log("faaiiluuure");
      });


});
