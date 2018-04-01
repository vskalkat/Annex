$(document).ready(function(){

  $("#submitBtn").click(function(){
    console.log("submitBtn button clicked!" );

    var projectName = $("#projectName").val();
    var projectDescription = $("#projectDescription").val();
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
        data: JSON.stringify({ project : project })
      }).done(function(data) {
           console.log("project posted!" );
           window.location.href = 'http://localhost:8042/projects';
      }).fail(function( data ) {
           console.log("project up failed" );
      });
  });

  $("#favTeacherField").click(function(){
    $(this).val('Professor Igor Ivkovic');
  });


});
