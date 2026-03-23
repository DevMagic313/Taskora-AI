// Minimal service worker for push notifications
self.addEventListener("push", (event) => {
    const data = event.data?.json() ?? {};
    const title = data.title || "Taskora";
    const options = {
        body: data.body || "You have a new notification",
        icon: "/taskora-favicon.svg",
        badge: "/taskora-favicon.svg",
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow("/"));
});
