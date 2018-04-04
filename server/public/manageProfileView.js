$(document).ready(function(){


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
          user_id : window.localStorage.getItem('user')})
      }).done(function(data) {
           console.log("project posted!" );
           window.location.href = 'http://localhost:8042/project';
      }).fail(function( data ) {
           console.log("project up failed" );
      });
  });

  $("#favTeacherField").click(function(){
    $(this).val('Professor Igor Ivkovic');
  });









});
