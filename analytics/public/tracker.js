/*!
 * plaq tracker v1.0
 * Usage: <script src="https://your-domain.com/tracker.js" data-client-id="YOUR_ID" async></script>
 */
(function () {
  'use strict';

  // ── Bootstrap ──────────────────────────────────────────────────────────────

  var script = document.currentScript;
  var clientId = script && script.getAttribute('data-client-id');

  if (!clientId) {
    console.warn('[plaq] Missing data-client-id on tracker script.');
    return;
  }

  // Derive the analytics host from the script src so the snippet works
  // regardless of where the Next.js app is deployed.
  var host;
  try {
    host = new URL(script.src).origin;
  } catch (_) {
    host = location.origin;
  }

  // ── Session ID ─────────────────────────────────────────────────────────────
  // Scoped to the browser tab; resets on a new tab/window.

  function getSessionId() {
    var KEY = '_plaq_sid';
    var id = sessionStorage.getItem(KEY);
    if (!id) {
      id = Date.now().toString(36) + Math.random().toString(36).slice(2);
      sessionStorage.setItem(KEY, id);
    }
    return id;
  }

  // ── Send ───────────────────────────────────────────────────────────────────
  // sendBeacon with a plain string = text/plain content-type = simple CORS
  // request (no preflight). request.json() on the server still parses it.
  // Falls back to fetch with keepalive for browsers without sendBeacon.

  function send(endpoint, payload) {
    var body = JSON.stringify(
      Object.assign({ client_id: clientId, session_id: getSessionId() }, payload)
    );
    var url = host + '/api/track/' + endpoint;

    if (typeof navigator.sendBeacon === 'function') {
      if (navigator.sendBeacon(url, body)) return;
    }

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
      keepalive: true,
    }).catch(function () {});
  }

  // ── Pageview ───────────────────────────────────────────────────────────────

  function sendPageview() {
    send('pageview', {
      url: location.href,
      referrer: document.referrer || null,
    });
  }

  // SPA support: intercept history.pushState so navigations are tracked.
  var _pushState = history.pushState;
  history.pushState = function () {
    _pushState.apply(history, arguments);
    sendPageview();
  };
  window.addEventListener('popstate', sendPageview);
  window.addEventListener('hashchange', sendPageview);

  // Fire the initial pageview after the page title is available.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sendPageview);
  } else {
    sendPageview();
  }

  // ── Auto form tracking ─────────────────────────────────────────────────────
  // Listens on all <form> submits. Add data-plaq-ignore to opt a form out.
  // Sensitive field names (password, token, …) are stripped automatically.
  //
  // If the form contains an email or phone field, a lead record is also saved.

  var SENSITIVE = /password|passwd|secret|token|card|cvv|cvc|ssn|pin/i;

  document.addEventListener(
    'submit',
    function (e) {
      var form = e.target;
      if (!(form instanceof HTMLFormElement)) return;
      if ('plaqIgnore' in (form.dataset || {})) return;

      var formName =
        (form.dataset && form.dataset.plaqForm) ||
        form.getAttribute('name') ||
        form.id ||
        'form';

      // Collect non-sensitive form values
      var data = {};
      new FormData(form).forEach(function (val, key) {
        if (SENSITIVE.test(key)) return;
        data[key] = val;
      });

      send('form', { form_name: formName, data: data });

      // Auto-lead: fire when email or phone is present
      var email = data.email || data.Email || data.EMAIL;
      var phone = data.phone || data.Phone || data.tel || data.Tel;
      if (email || phone) {
        send('lead', {
          name: data.name || data.Name || data.fullname || data.full_name || null,
          email: email || null,
          phone: phone || null,
          source_url: location.href,
          form_name: formName,
        });
      }
    },
    true // capture phase so it runs before form's own submit handler
  );

  // ── Public API ─────────────────────────────────────────────────────────────
  //
  //   plaq.track('video_play', { video: 'intro.mp4' })
  //   plaq.track('scroll_depth', { percent: 75 })
  //   plaq.track('button_click', { label: 'CTA hero' })
  //
  //   plaq.lead({ name: 'Jan', email: 'jan@example.com', source_url: location.href })
  //
  //   plaq.form('contact', { message: '...' })
  //
  //   plaq.pageview()  // manual SPA pageview if auto-detection misses

  window.plaq = {
    track: function (eventName, properties) {
      if (!eventName) return;
      send('event', {
        event_name: String(eventName),
        properties: properties || null,
      });
    },

    lead: function (data) {
      if (!data || (!data.email && !data.phone)) {
        console.warn('[plaq] lead() requires at least email or phone.');
        return;
      }
      send('lead', {
        name: data.name || null,
        email: data.email || null,
        phone: data.phone || null,
        source_url: data.source_url || location.href,
        form_name: data.form_name || null,
      });
    },

    form: function (formName, data) {
      if (!formName) return;
      send('form', { form_name: String(formName), data: data || null });
    },

    pageview: sendPageview,
  };
})();
