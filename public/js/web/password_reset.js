$(document).ready(function()
{
    
    var spawnAlert = function(type, message)
    {
        $('.alert-container').html(
            $('<div />', {
                html: message
            })
            .addClass('alert')
            .addClass(type)
        );
    }
    
   // password / plaintext toggle
   $('i.icon-lock').click(function()
   {
      var elm = $(this).parent().parent().find('input');
      
      if ($(elm).prop('type') === 'password') {
          $(elm).prop('type', 'text').css('color', '#999');
      } else {
          $(elm).prop('type', 'password').css('color', '#000');
      }
   });
   
   // define a state, whether form is valid
   var requiredFields = [false, false, false];
   var passwordMatch = false;
   var checksum = false;
   
   // bind submit action
   $('form').on('submit', function()
   {
       if (requiredFields.indexOf(false) !== -1) {
           spawnAlert('warning', 'Please fill in all fields!');
           return false;
       } else if (false === passwordMatch) {
           spawnAlert('error', 'Passwords entered do not match!');
           return false;
       } else if (false === checksum) {
           spawnAlert('error', '<strong>New password is too simple!</strong><br>Please add some complexity to your chosen password.<br>This can be done by adding in a mix of upper-case and lower-case characters, digits and symbols.');
           return false;
       }
       
       return true;
   });
   
   // current password
   $('input#current').keyup(function()
   {
       if ($(this).val().length > 0) {
           $('input').prop('disabled', false);
           requiredFields[0] = true;
           return;
       }
       
       requiredFields[0] = false;
       $('input:not(#current)').prop('disabled', true);
   });
   
   // checks whether passwords match
   var checkPasswordMatch = function()
   {
       if ($('input#new').val() == $('input#confirm').val()) {
           passwordMatch = true;
           return;
       }
       
       passwordMatch = false;
   };
   
   // checks the strength of the password by use of a predefined algorithm
   var checkPasswordStrength = function()
   {
       var p = $('input#new').val();
       
       var tests = [
           /\d/.test(p),
           /[a-z]/.test(p) && /[A-Z]/.test(p),
           /\W/.test(p),
           /.{8,}/.test(p),
           /.{10,}/.test(p)         
       ];
       
       // update strength meter, with...
       var colours = {
           1: {
               'class': 'error',
               text: 'Very Weak'
           },
           2: {
               'class': 'error',
               text: 'Weak'
           },
           3: {
               'class': 'warning',
               text: 'Moderate'
           },
           4: {
               'class': 'info',
               text: 'Strong'
           },
           5: {
               'class': 'success',
               text: 'Very Strong'
           }
       };
       
       // determine strength
       var strength = (function(n)
       {
           var c = 0;
           for (var i in n) {
               c += +n[i];
           }
           return c || 1;
       })(tests);
       
       console.log('Strength:' + strength);
       
       $('.strength-indicator')
       .find('div')
       .removeClass()
       .addClass(colours[strength]['class'])
       .text(colours[strength].text)
       .css({
           width: (strength*20) + '%'
       });
       
       if (strength >= 4) {
           checksum = true;
           return;
       }
       
       checksum = false;
   };
   
   $('input#new').keyup(function()
   {
       if ($(this).val().length > 0) {
           requiredFields[1] = true;
       } else {
           requiredFields[1] = false;
       }       
       
       checkPasswordMatch();
       checkPasswordStrength();
   });
   
   $('input#confirm').keyup(function()
   {
       if ($(this).val().length > 0) {
           requiredFields[2] = true;
       } else {
           requiredFields[2] = false;
       }       
       
       checkPasswordMatch();
       checkPasswordStrength();
   });
});