// Zero CRM push notifications: shows them on this phone or laptop, and opens the right page when tapped.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { title: "Zero CRM", body: e.data ? e.data.text() : "" }; }
  const base = self.registration.scope;
  e.waitUntil(self.registration.showNotification(d.title || "Zero CRM", {
    body: d.body || "",
    icon: base + "icon-192.png",
    badge: base + "badge-72.png",
    tag: d.tag || undefined,
    renotify: !!d.tag,
    requireInteraction: !!d.urgent,
    data: { link: d.link || "" },
  }));
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const link = (e.notification.data && e.notification.data.link) || "";
  const url = new URL("index.html" + (link.startsWith("#") ? link : ""), self.registration.scope).href;
  e.waitUntil((async () => {
    const list = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of list) {
      if (c.url.startsWith(self.registration.scope)) {
        await c.focus();
        try { await c.navigate(url); } catch (_) { c.postMessage({ zeroOpen: link }); }
        return;
      }
    }
    await self.clients.openWindow(url);
  })());
});
