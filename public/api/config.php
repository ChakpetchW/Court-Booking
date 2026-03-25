<?php
/**
 * Config — edit these values in DirectAdmin / your environment
 * DO NOT commit real credentials to Git
 */

// ---- Database ----
define('DB_HOST', 'localhost');
define('DB_NAME', 'scaleupc_court');
define('DB_USER', 'scaleupc_court');
define('DB_PASS', 'ZmcpPgKGccdxtefU5MtD');

// ---- Omise ----
// Get keys from: https://dashboard.omise.co/settings/keys
define('OMISE_PUBLIC_KEY',      'pkey_test_YOUR_PUBLIC_KEY_HERE');
define('OMISE_SECRET_KEY',      'skey_test_YOUR_SECRET_KEY_HERE');
define('OMISE_WEBHOOK_SECRET',  'whsec_YOUR_WEBHOOK_SECRET_HERE');

// ---- Thaibulksms ----  
// Get from: https://app.thaibulksms.com/setting/key
define('SMS_API_KEY',    'YOUR_THAIBULKSMS_API_KEY');
define('SMS_API_SECRET', 'YOUR_THAIBULKSMS_API_SECRET');

// ---- 2C2P ----
define('C2P2_MERCHANT_ID', 'YOUR_MERCHANT_ID');
define('C2P2_SECRET_KEY',  'YOUR_2C2P_SECRET');
define('C2P2_API_URL',     'https://sandbox-pgw.2c2p.com/payment/4.3/paymentToken');

// ---- Site ----
define('SITE_URL', 'https://scaleup.co.th/court');
