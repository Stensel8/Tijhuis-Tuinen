<?php
  /**
  * Requires the "PHP Email Form" library
  * The "PHP Email Form" library is available only in the pro version of the template
  * The library should be uploaded to: vendor/php-email-form/php-email-form.php
  * For more info and help: https://bootstrapmade.com/php-email-form/
  */

  // Replace contact@example.com with your real receiving email address
  $receiving_email_address = 'info@tijhuis-tuinen.nl';

  if( file_exists($php_email_form = '../assets/vendor/php-email-form/php-email-form.php' )) {
    include( $php_email_form );
  } else {
    die( 'Unable to load the "PHP Email Form" Library!');
  }

  $contact = new PHP_Email_Form;
  $contact->ajax = true;
  
  $contact->to = $receiving_email_address;
  $contact->from_name = $_POST['name'];
  $contact->from_email = $_POST['email'];
  $contact->subject = $_POST['subject'];

  // Honeypot for bot protection
  $contact->honeypot = $_POST['honeypot'];

  // SMTP configuration for reliable email delivery
  // Uncomment and configure with your SMTP credentials (Gmail, Outlook, or hosting SMTP)
  /*
  $contact->smtp = array(
    'host' => 'smtp.gmail.com',        // Or smtp.office365.com for Outlook
    'username' => 'your-email@gmail.com',
    'password' => 'your-app-password', // For Gmail: use App Password!
    'port' => '587'                    // 587 for TLS, 465 for SSL
  );
  */

  // Uncomment and set your reCaptcha secret key for additional bot protection
  // $contact->recaptcha_secret_key = 'YOUR_RECAPTCHA_SECRET_KEY';

  echo $contact->send();
?>
