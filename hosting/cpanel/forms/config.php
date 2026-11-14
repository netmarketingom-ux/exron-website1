<?php
/**
 * Exron Global: form settings for cPanel hosting (Namecheap).
 * Edit this file in cPanel → File Manager → public_html/forms/config.php.
 * Company details (procurement email, acknowledgment time, disclaimer) come from site.json,
 * which is generated from the website's own data when the site is built.
 */
return [
    // The mailbox the website sends from. Create it first in cPanel → Email Accounts,
    // otherwise many mail servers will reject the messages.
    'from_email' => 'rfq@exronglobal.com',
    'from_name'  => 'Exron Global Procurement',

    // Who receives RFQs and contact messages. Several addresses are allowed, e.g.
    // ['procurement@exronglobal.com', 'rami@exronglobal.com'].
    // Left empty, the procurement email from site.json is used, then info@exronglobal.com.
    'rfq_inbox'     => [],
    'contact_inbox' => [],

    // Keep a private copy of every RFQ (fields and documents) outside the public website folder,
    // so nothing is lost if an email does not arrive. Download them in cPanel → File Manager.
    'save_copies' => true,
    // Folder for the copies. Empty means one level above public_html: /home/<account>/exron-submissions
    'storage_dir' => '',

    // Upload and spam limits.
    'max_files'           => 3,
    'max_total_bytes'     => 8 * 1024 * 1024,
    'rate_limit_per_hour' => 10,   // submissions per visitor (IP address) per hour
    'min_seconds'         => 3,    // forms sent faster than this after opening are treated as automated
];
