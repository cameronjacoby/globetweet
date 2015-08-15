$(function() {

  // form validation
  $('.validate-fields').each(function() {
    $(this).validate();
  });

  // signup modal
  $('#signup-modal').on('shown.bs.modal', function () {
    $(this).find('form input:first').focus();
  });

  $('#show-login').on('click', function() {
    $('#signup-modal').modal('toggle');
    $('#login-modal').modal('toggle');
  });

  // login modal
  $('#login-modal').on('shown.bs.modal', function () {
    $(this).find('form input:first').focus();
  });

  $('#show-signup').on('click', function() {
    $('#login-modal').modal('toggle');
    $('#signup-modal').modal('toggle');
  });

});