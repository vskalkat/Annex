$(document).ready(function(){

<<<<<<< HEAD
  var email = window.localStorage.getItem("email");
  var favTeacher = window.localStorage.getItem("fav_teacher");
  console.log("retrieved");
  console.log(email);
  console.log(favTeacher);

  $('.profileUsername').text(email);
  $('.description').text(favTeacher);
  $('#profileUsername').text(email);
  $('#description').text(favTeacher);
=======
  var request = $.ajax({
       url: "/projects/user/" + window.localStorage.getItem('user'),
       type: "GET",
       dataType: "json",
       contentType: 'application/json; charset=utf-8',
       data: {}
     }).done(function(data) {
       console.log("data got");
       console.log(data);
       for (var i = data.length - 1; i >= 0; i--) {
         $('#projectslist').append("<li class='list-group-item'><h6 class='myProjectName'>"+data[i].title+"</h6><p class='myProjectDescription secondaryText'>"+data[i].description+"</p><i class='fa fa-minus-circle myIcon'></i></li>");
       }
     }).fail(function( data ) {
       console.log("faaiiluuure");
     });
>>>>>>> 5ed06e4f5976bbbb68b4bfae5e8e369e98674e34


  $('.fa-minus-circle').on('click', function(){
    $(this).parent().fadeTo( "normal", 0, function(){
      $(this).remove();
    });
  });


  $('.addSkillBtn').click(function(){
    var newSkillText = $('#addSkillField').val();
    $.trim(newSkillText);
    if(newSkillText != "") {
      $('.mySkillsList').append("<li class='list-group-item secondaryText'>"+ newSkillText +"<i class='fa fa-minus-circle myIcon'></i></li>");
    }
    $('.fa-minus-circle').on('click', function(){
      $(this).parent().fadeTo( "normal", 0, function(){
        $(this).remove();
      });
    });
    $('#addSkillField').val('');
  });


  $('.newProjectButton').click(function(){
    $('.newProjectBox').toggleClass('collapse');
  });


  //Create project
  $("#submitBtn").click(function(){
    console.log("submitBtn button clicked!" );

    var projectName = $("#addProjectNameField").val();
    var projectDescription = $("#addProjectDescriptionField").val();
    var programSelect = $("#programSelect option:selected").text();

    var softwareSkill = $('#softwareSkill').prop( "checked" );
    var firmwareSkills = $('#firmwareSkills').prop( "checked" );
    var mechanicalSkills = $('#mechanicalSkills').prop( "checked" );
    var electricalSkills = $('#electricalSkills').prop( "checked" );
    var dataSkills = $('#dataSkills').prop( "checked" );
    var designSkills = $('#designSkills').prop( "checked" );

    project = {
      "projectName" : projectName,
      "projectDescription" : projectDescription,
      "programSelect" : programSelect,
      "softwareSkill" : softwareSkill,
      "firmwareSkills" : firmwareSkills,
      "mechanicalSkills" : mechanicalSkills,
      "electricalSkills" : electricalSkills,
      "dataSkills" : dataSkills,
      "designSkills" : designSkills
    };

    console.log(project);

     var request = $.ajax({
        url: "/project",
        type: "POST",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
          project : project,
          userId : window.localStorage.getItem('user')})
      }).done(function(data) {
           console.log("project posted!" );
           window.location.href = 'http://localhost:8042/manageProfileView.html';
      }).fail(function( data ) {
           console.log("project up failed" );
      });
  });

  $("#favTeacherField").click(function(){
    $(this).val('Professor Igor Ivkovic');
  });




//get user info from db

});
