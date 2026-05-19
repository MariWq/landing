/**
 * Скопируйте в lead-config.js.
 * Рекомендуется указать web3formsProxyUrl (через Cloudflare Worker) —
 * это работает стабильнее в сетях, где api.web3forms.com может блокироваться.
 */
window.CONTENTPULSE_LEAD = {
  web3formsProxyUrl: "https://YOUR-WORKER.workers.dev",
  // web3formsAccessKey: "YOUR_WEB3FORMS_ACCESS_KEY",
};

window.CONTENTPULSE_METRIKA_ID = 109303033;
