// Cookie Consent Banner - LGPD Compliance
(function() {
  const CONSENT_KEY = 'natan-motos-consent';
  const CONSENT_VERSION = '1.0';

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  function setCookie(name, value, days = 365) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
  }

  function showConsentBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.innerHTML = `
      <div style="
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #111;
        border-top: 2px solid #e8161b;
        padding: 20px;
        z-index: 9999;
        font-family: Arial, sans-serif;
        box-shadow: 0 -4px 16px rgba(0,0,0,0.6);
      ">
        <div style="
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        ">
          <div style="flex: 1; min-width: 250px; color: rgba(255,255,255,0.8); font-size: 14px;">
            <strong>🍪 Consentimento de Cookies (LGPD)</strong><br>
            Usamos cookies e Google Analytics para melhorar sua experiência.
            <a href="/privacy.html" style="color: #c9a84c; text-decoration: none;">Leia nossa política de privacidade</a>
          </div>
          <div style="display: flex; gap: 12px;">
            <button id="consent-decline" style="
              background: transparent;
              border: 1px solid rgba(255,255,255,0.3);
              color: rgba(255,255,255,0.7);
              padding: 10px 20px;
              border-radius: 6px;
              cursor: pointer;
              font-weight: 600;
              transition: all 0.2s;
            ">Recusar</button>
            <button id="consent-accept" style="
              background: #e8161b;
              border: none;
              color: white;
              padding: 10px 20px;
              border-radius: 6px;
              cursor: pointer;
              font-weight: 600;
              transition: all 0.2s;
            ">Aceitar</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    document.getElementById('consent-accept').addEventListener('click', function() {
      setCookie(CONSENT_KEY, CONSENT_VERSION);
      banner.remove();
      loadGoogleAnalytics();
    });

    document.getElementById('consent-decline').addEventListener('click', function() {
      setCookie(CONSENT_KEY, 'declined');
      banner.remove();
      // Google Analytics não será carregado
    });
  }

  function loadGoogleAnalytics() {
    // Carregar Google Tag Manager
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-8RBGN12QKJ';
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-8RBGN12QKJ');
  }

  // Verificar consentimento ao carregar a página
  window.addEventListener('DOMContentLoaded', function() {
    const consent = getCookie(CONSENT_KEY);

    if (!consent) {
      // Nenhum consentimento registrado - mostrar banner
      showConsentBanner();
    } else if (consent === CONSENT_VERSION) {
      // Consentimento aceito - carregar GA
      loadGoogleAnalytics();
    }
    // Se recusado (consent === 'declined'), não fazer nada
  });
})();
