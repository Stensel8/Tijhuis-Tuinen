/**
* PHP Email Form Validation - v3.11
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      
      // Custom validation
      let name = thisForm.querySelector('[name="name"]').value.trim();
      let email = thisForm.querySelector('[name="email"]').value.trim();
      let subject = thisForm.querySelector('[name="subject"]').value.trim();
      let message = thisForm.querySelector('[name="message"]').value.trim();
      
      if (!name) {
        displayError(thisForm, 'Vul uw naam in.');
        return;
      }
      if (!email) {
        displayError(thisForm, 'Vul uw e-mailadres in.');
        return;
      }
      if (!isValidEmail(email)) {
        displayError(thisForm, 'Vul een geldig e-mailadres in.');
        return;
      }
      if (!subject) {
        displayError(thisForm, 'Vul een onderwerp in.');
        return;
      }
      if (!message || message.length < 10) {
        displayError(thisForm, 'Uw bericht moet minstens 10 karakters bevatten.');
        return;
      }
      // Anti-spam: Check time on page (min 3 seconds)
      const timeOnPage = Date.now() - window.pageLoadTime;
      if (timeOnPage < 3000) {
        displayError(thisForm, 'Uw bericht is te snel verzonden. Wacht even en probeer het opnieuw.');
        return;
      }
      
      if( ! action ) {
        displayError(thisForm, 'Er is een technisch probleem met het formulier. Neem contact op via <a href="mailto:info@tijhuis-tuinen.nl">info@tijhuis-tuinen.nl</a>.');
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData( thisForm );

      if ( recaptcha ) {
        if(typeof grecaptcha !== "undefined" ) {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
              .then(token => {
                formData.set('recaptcha-response', token);
                php_email_form_submit(thisForm, action, formData);
              })
            } catch(error) {
              displayError(thisForm, error);
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
        }
      } else {
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    })
    .then(response => {
      if( response.ok ) {
        return response.json();
      } else {
        throw new Error(`${response.status} ${response.statusText} ${response.url}`); 
      }
    })
    .then(data => {
      thisForm.querySelector('.loading').classList.remove('d-block');
      if (data.success) {
        thisForm.querySelector('.sent-message').classList.add('d-block');
        thisForm.reset(); 
      } else {
        throw new Error(data.message || 'Form submission failed and no error message returned from: ' + action); 
      }
    })
    .catch((error) => {
      displayError(thisForm, error);
    });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    
    // Translate common errors to Dutch and add mailto link
    let translatedError = error;
    if (error.includes('The form action property is not set!')) {
      translatedError = 'Er is een technisch probleem met het formulier. Neem contact op via <a href="mailto:info@tijhuis-tuinen.nl">info@tijhuis-tuinen.nl</a>.';
    } else if (error.includes('The reCaptcha javascript API url is not loaded!')) {
      translatedError = 'Er is een probleem met de beveiliging. Probeer het later opnieuw of neem contact op via <a href="mailto:info@tijhuis-tuinen.nl">info@tijhuis-tuinen.nl</a>.';
    } else if (error.includes('Mailer Error:')) {
      translatedError = 'Er is een fout opgetreden bij het verzenden van de e-mail. Probeer het later opnieuw of neem contact op via <a href="mailto:info@tijhuis-tuinen.nl">info@tijhuis-tuinen.nl</a>.';
    } else if (error.match(/^\d+ \w+ /)) { // HTTP status errors
      translatedError = 'Er is een fout opgetreden bij het verzenden. Controleer uw internetverbinding en probeer het opnieuw. Als het probleem aanhoudt, neem contact op via <a href="mailto:info@tijhuis-tuinen.nl">info@tijhuis-tuinen.nl</a>.';
    } else {
      // For server-side errors (already in Dutch from PHP), add mailto if not present
      if (!translatedError.includes('info@tijhuis-tuinen.nl')) {
        translatedError += ' Neem contact op via <a href="mailto:info@tijhuis-tuinen.nl">info@tijhuis-tuinen.nl</a> als het probleem aanhoudt.';
      }
    }
    
    thisForm.querySelector('.error-message').innerHTML = translatedError;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();
