export function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = "toast";

  const icon = document.createElement("span");
  icon.className = "toast-icon";

  // Choose icon based on type
  if (type === "success") icon.textContent = "✔️";
  else if (type === "error") icon.textContent = "❌";
  else icon.textContent = "ℹ️";

  const text = document.createElement("span");
  text.textContent = message;

  toast.appendChild(icon);
  toast.appendChild(text);

  document.getElementById("toast-container").appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}
