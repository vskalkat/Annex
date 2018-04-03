$(document).ready(function(){


  $('.fa-minus-circle').click(function(){
    $(this).parent().remove();
  });

  $('.addSkillBtn').click(function(){
    var newSkillText = $('#addSkillField').val();
    $('.mySkillsList').append("<li class='list-group-item secondaryText'>"+ newSkillText +"<i class='fa fa-minus-circle myIcon'></i></li>");

  });









});
