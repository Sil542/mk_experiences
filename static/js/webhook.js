// edits an json file if its true or false to enable webhook discord
async function updateButton() {
  const res = await fetch("../static/Php/webhook_config.json");
  const data = await res.json();
  document.getElementById("toggleWebhookBtn").textContent =
    data.enabled ? "Webhook: AAN" : "Webhook: UIT";
}

document.getElementById("toggleWebhookBtn").addEventListener("click", async () => {
  const res = await fetch("../static/Php/toggle_webhook.php");
  const data = await res.json();
  document.getElementById("toggleWebhookBtn").textContent =
    data.enabled ? "Webhook: AAN" : "Webhook: UIT";
});

updateButton();
