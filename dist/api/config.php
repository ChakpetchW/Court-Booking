<?php
/**
 * Config — edit these values in DirectAdmin / your environment
 * DO NOT commit real credentials to Git
 */
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


// ---- Database ----
define('DB_HOST', 'localhost');
define('DB_NAME', 'scaleupc_court');
define('DB_USER', 'scaleupc_court');
define('DB_PASS', 'ZmcpPgKGccdxtefU5MtD');

// ---- Omise ----
// Get keys from: https://dashboard.omise.co/settings/keys
define('OMISE_PUBLIC_KEY',      'pkey_test_6756z7gvq2rmken4hpu');
define('OMISE_SECRET_KEY',      'skey_test_6756z7hfdu17gxgmyge');
define('OMISE_WEBHOOK_SECRET',  '+CqlcRC29VdqcsvwQyTWSs6jYY7POzaXTWv6X0yYvLs==');

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
