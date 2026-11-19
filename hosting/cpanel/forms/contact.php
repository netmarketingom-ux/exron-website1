<?php
/** Receives the general inquiry form on the Contact page and emails it to the team. */
declare(strict_types=1);
define('EXRON_FORMS', true);
require __DIR__ . '/lib.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') redirect_to('/contact/');
if (looks_automated()) redirect_to('/contact/sent/');
if (rate_limited('contact')) {
    fail_page(429, 'Too many messages', ['Several messages were sent from your connection in the last hour. Please wait a little, or email us.'], '/contact/');
}

$name = field_line('name', 120);
$email = field_line('email', 200);
$subject = field_line('subject', 200);
$message = field_text('message', 5000);

$errors = [];
if ($name === '') $errors[] = 'Enter your name.';
if (!valid_email($email)) $errors[] = 'Enter a valid email address.';
if ($subject === '') $errors[] = 'Enter a subject.';
if ($message === '') $errors[] = 'Enter your message.';
if (empty($_POST['privacy_consent'])) $errors[] = 'Agree to the Privacy Policy.';
if ($errors) fail_page(400, 'Please check your message', $errors, '/contact/');

$rows = [['Name', $name], ['Email', $email], ['Subject', $subject], ['Message', $message]];
$received = received_at();
$id = 'contact-' . gmdate('Ymd-His') . '-' . bin2hex(random_bytes(3));
$stored = save_copy($id, ['received' => $received, 'fields' => array_column($rows, 1, 0)]);

$sent = send_mail(
    inbox('contact_inbox'),
    "Website inquiry: $subject",
    email_wrap('<p><strong>General inquiry through exronglobal.com</strong><br>Received ' . esc($received) . '</p>' . email_table($rows)),
    "General inquiry through exronglobal.com\nReceived $received\n\n" . email_text($rows),
    $email
);

if (!$sent && !$stored) {
    error_log('exron contact: message could not be emailed or stored');
    fail_page(500, 'Your message could not be sent', ['Our server could not deliver your message.'], '/contact/');
}

redirect_to('/contact/sent/');
