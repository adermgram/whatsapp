// Imported FIRST by the scenario runner (module load order = import order), so these defaults are in place
// before the app reads its settings. A real quiet period lets a burst of short messages be answered once.
process.env.MESSAGE_DEBOUNCE_MS ??= '1500';
process.env.WHATSAPP_ADAPTER = 'simulator';
// Scenarios pay with the fake provider ("/pay"). Never let a real PAYMENT_DRIVER from .env turn them into live Paystack calls.
process.env.PAYMENT_DRIVER = 'fake';
// Never run the background jobs from a test tool: they act on every shop in the database, not just the test one.
process.env.DISABLE_JOBS = 'true';
