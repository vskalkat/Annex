$(document).ready(function(){

  $("#signUpBtn").click(function(){
    console.log("signUp button clicked!" );

    var email = $("#emailField").val();
    var password = $("#passwordField").val();
    var favTeacher = $("#favTeacherField").val();

    var isPremiumRegistration = $('#premiumOption').prop( "checked" );

    userCredentials = {
      "email" : email,
      "password" : password,
      "isPremiumRegistration" : isPremiumRegistration,
      "fav_teacher" : favTeacher
    };

    console.log(userCredentials);

     var request = $.ajax({
        url: "/signUp",
        type: "POST",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ userCredentials : userCredentials })
      }).done(function(data) {
           console.log("login responsed!" );
           window.location.href = 'http://localhost:8042/findProjects';
           document.cookie = data.token;
           console.log("document.cookie after /signup: " + document.cookie);

      }).fail(function( data ) {
           console.log("sign up failed" );

      });
  });

  $("#favTeacherField").click(function(){
    $(this).val('Professor Igor Ivkovic');
  });


});
