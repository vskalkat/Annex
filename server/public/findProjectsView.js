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

                    console.log("try2");

    $(document).keyup(function(event) {
        if (event.key == "Enter") { //$(".searchField").is(":focus") && 

            console.log("try");
          var endPoint = "/projects";
          if($("#searchField").val().length > 0) {
              endPoint = "/search/project/" + $("#searchField").val();
          }


           var request = $.ajax({
              url: endPoint,
              type: "GET",
              dataType: "json",
              contentType: 'application/json; charset=utf-8',
              data: {}
            }).done(function(data) {
              console.log("data got");
                $('.projectsList').empty(); 
              console.log(data);
              for (var i = data.length - 1; i >= 0; i--) {
                
                $('.projectsList').append("<a style='text-decoration:none;' href='#projectModal' rel='modal:open'><li class='list-group-item projectItem'><h3 class='projectTitle'>"+  data[i].title +"</h3><p class='projectDescription'>"+ data[i].description +"</p></li></a>");
              }
            }).fail(function( data ) {
              console.log("faaiiluuure");
            });

          //   var request = $.ajax({
          //       url: endPoint,
          //       type: "GET",
          //       dataType: "json",
          //       contentType: 'application/json; charset=utf-8',
          //       data: {}
          //     }).done(function(data) {
          //       console.log("data got");
          //       console.log(data);
          //       $('.projectsList').empty(); 

          //       for (var i = data.length - 1; i >= 0; i--) {
                  
          //         $('.projectsList').append("<a style='text-decoration:none;' href='#projectModal' rel='modal:open'><li class='list-group-item projectItem'><h3 class='projectTitle'>"+  data[i].title +"</h3><p class='projectDescription'>"+ data[i].description +"</p></li></a>");
          //       }
          //     }).fail(function( data ) {
          //       console.log("faaiiluuure");
          //     });
          // }

        }
    });




});
