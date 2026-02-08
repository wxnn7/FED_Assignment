// paymentMethods.js
// Persists "removed" payment methods using localStorage

const STORAGE_KEY = "dh_removed_payment_methods";

function getRemoved() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function saveRemoved(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

function applyRemovedToPage() {
  const removed = getRemoved();

  document.querySelectorAll("[data-method]").forEach((row) => {
    const method = row.getAttribute("data-method");
    if (removed.has(method)) {
      row.remove(); // remove it from the DOM
    }
  });
}

function enableRemoveButtons() {
  const removed = getRemoved();

  document.querySelectorAll(".remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest("[data-method]");
      if (!row) return;

      const method = row.getAttribute("data-method");
      removed.add(method);
      saveRemoved(removed);

      row.remove(); // instantly hide from edit page too
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyRemovedToPage();
  enableRemoveButtons();
});
