<?php
/**
 * Receives the Submit an RFQ form: checks it, emails procurement with the documents attached,
 * sends the requester an acknowledgment, keeps a private copy, then shows the confirmation page.
 */
declare(strict_types=1);
define('EXRON_FORMS', true);
require __DIR__ . '/lib.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') redirect_to('/submit-rfq/');
// Automated submissions are dropped quietly so the sender learns nothing.
if (looks_automated()) redirect_to('/submit-rfq/received/');
if (rate_limited('rfq')) {
    fail_page(429, 'Too many requests', ['Several RFQs were sent from your connection in the last hour. Please wait a little, or email your request.'], '/submit-rfq/');
}

$divisions = [
    'government' => 'Government / military installation',
    'contractor' => 'Prime or defense support contractor',
    'commercial' => 'Commercial / industrial',
];
$f = [
    'division'     => field_line('division', 20),
    'organization' => field_line('organization', 200),
    'contact_name' => field_line('contact_name', 120),
    'email'        => field_line('email', 200),
    'phone'        => field_line('phone', 40),
    'solicitation' => field_line('solicitation_number', 100),
    'quote_due'    => field_line('quote_due', 20),
    'description'  => field_text('description', 5000),
    'line_items'   => field_text('line_items', 20000),
    'quantities'   => field_text('quantities', 5000),
    'destination'  => field_line('destination', 300),
    'delivery'     => field_line('delivery_date', 20),
    'instructions' => field_text('instructions', 5000),
];

$errors = [];
if (!isset($divisions[$f['division']])) $errors[] = 'Choose a division.';
if ($f['organization'] === '') $errors[] = 'Enter the organization name.';
if ($f['contact_name'] === '') $errors[] = 'Enter the contact person.';
if (!valid_email($f['email'])) $errors[] = 'Enter a valid official email address.';
if ($f['description'] === '') $errors[] = 'Enter the product or service description.';
if ($f['quantities'] === '' && $f['line_items'] === '') $errors[] = 'Enter the required quantities, or add line items.';
if ($f['destination'] === '') $errors[] = 'Enter the delivery destination.';
if (empty($_POST['no_controlled_info'])) $errors[] = 'Confirm that the submission contains no classified, CUI or export-controlled information.';
if (empty($_POST['privacy_consent'])) $errors[] = 'Agree to the Privacy Policy.';
if ($errors) fail_page(400, 'Please check your RFQ', $errors, '/submit-rfq/');

$posted = field_line('reference', 30);
$ref = preg_match(REFERENCE_RE, $posted) ? $posted : make_reference();
[$files, $rejected] = collect_uploads();

$rows = [
    ['Reference', $ref],
    ['Division', $divisions[$f['division']]],
    ['Organization', $f['organization']],
    ['Contact person', $f['contact_name']],
    ['Email', $f['email']],
    ['Phone', $f['phone']],
    ['RFQ / solicitation no.', $f['solicitation']],
    ['Quotation due', $f['quote_due']],
    ['Description', $f['description']],
    ['Line items', $f['line_items']],
    ['Quantities', $f['quantities']],
    ['Delivery destination', $f['destination']],
    ['Requested delivery date', $f['delivery']],
    ['Additional instructions', $f['instructions']],
];
$received = received_at();

// Private copy first, so the RFQ is kept even if email delivery fails.
$stored = save_copy($ref, [
    'reference' => $ref,
    'received' => $received,
    'fields' => array_column($rows, 1, 0),
    'documents' => array_column($files, 'name'),
    'rejected_documents' => $rejected,
], $files);

// Procurement team: every field, documents attached, reply goes straight to the requester.
$docHtml = $files ? '<ul>' . implode('', array_map(fn($a) => '<li>' . esc($a['name']) . ' <span style="color:#5C6070">(attached)</span></li>', $files)) . '</ul>' : '<p>None</p>';
if ($rejected) $docHtml .= '<p style="color:#B22234">Not accepted: ' . esc(implode('; ', $rejected)) . '</p>';
$internalSent = send_mail(
    inbox('rfq_inbox'),
    "[$ref] New RFQ: {$f['organization']}" . ($f['solicitation'] !== '' ? " / {$f['solicitation']}" : ''),
    email_wrap('<p><strong>New RFQ submitted through exronglobal.com</strong><br>Received ' . esc($received) . '</p>' . email_table($rows)
        . '<p><strong>Documents</strong></p>' . $docHtml
        . '<p style="font-size:12px;color:#5C6070">Reply to this email to answer the requester directly.'
        . ($stored ? ' A copy is saved on the hosting account under exron-submissions.' : '') . '</p>'),
    "New RFQ submitted through exronglobal.com\nReceived $received\n\n" . email_text($rows)
        . "\n\nDocuments:\n" . (implode("\n", array_map(fn($a) => $a['name'] . ' (attached)', $files)) ?: 'None')
        . ($rejected ? "\nNot accepted: " . implode('; ', $rejected) : ''),
    $f['email'],
    $files
);

if (!$internalSent && !$stored) {
    error_log("exron rfq: $ref could not be emailed or stored");
    fail_page(500, 'Your RFQ could not be sent', ['Our server could not deliver your RFQ. Nothing was lost on your side.'], '/submit-rfq/');
}
if (!$internalSent) error_log("exron rfq: $ref stored but procurement email failed");

// Acknowledgment to the requester.
$ack = site('rfqAcknowledgment');
$responseTime = is_set_value($ack) ? $ack : 'as soon as possible';
$intro = "We have received your request and logged it under reference $ref. A member of our procurement team will contact you $responseTime to confirm the response deadline and any points we need to clarify, then prepare an itemized quotation.";
$summary = [
    ['Reference', $ref],
    ['RFQ / solicitation no.', $f['solicitation']],
    ['Organization', $f['organization']],
    ['Delivery destination', $f['destination']],
    ['Requested delivery date', $f['delivery']],
    ['Quotation due', $f['quote_due']],
    ['Documents received', implode(', ', array_column($files, 'name'))],
];
$replyTo = is_set_value(site('procurementEmail')) ? site('procurementEmail') : (site('email') ?: null);
send_mail(
    [$f['email']],
    "RFQ received: $ref" . ($f['solicitation'] !== '' ? " ({$f['solicitation']})" : ''),
    email_wrap('<p>Dear ' . esc($f['contact_name']) . ',</p><p>' . esc($intro) . '</p>' . email_table($summary)
        . '<p>Please quote the reference in any correspondence about this request.</p><p style="font-size:13px;color:#5C6070">'
        . esc(SECURE_NOTICE) . '</p><p>Exron Global Procurement</p>'),
    "Dear {$f['contact_name']},\n\n$intro\n\n" . email_text($summary)
        . "\n\nPlease quote the reference in any correspondence about this request.\n\n" . SECURE_NOTICE
        . "\n\nExron Global Procurement\n\n" . site('disclaimer'),
    $replyTo
);

redirect_to('/submit-rfq/received/?ref=' . rawurlencode($ref));
