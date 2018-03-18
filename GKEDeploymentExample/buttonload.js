$('#likebtn').click(function() {
    $.ajax({
        type: 'GET',
 	    dataType: 'jsonp',
        url: 'http://35.190.128.32:3000/like',
		  success: function(text){
		    $("#likelabel").text(text);
		  }
    });

});