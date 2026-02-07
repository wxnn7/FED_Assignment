const urgentSection = document.getElementById("urgentSection");
const urgentTitleEl = document.querySelector(".urgent-title");
const urgentSubEl = document.querySelector(".urgent-sub");

const recentListEl = document.querySelector(".recent-list");
const viewAllBtn = document.getElementById("viewAllBtn");

const badgeEl = document.querySelector(".notification-badge");

function timeAgo(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);

  if (mins < 1) return "Updated just now";
  if (mins < 60) return `Updated ${mins} minutes ago`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Updated ${hrs} hour${hrs > 1 ? "s" : ""} ago`;

  const days = Math.floor(hrs / 24);
  return `Updated ${days} day${days > 1 ? "s" : ""} ago`;
}

function escapeHtml(str = "") {
  return str.replace(/[&<>"']/g, (m) => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[m]));
}

function badgeClassFromTag(tagText = "") {
  const t = tagText.toLowerCase();
  if (t.includes("expire") || t.includes("soon") || t.includes("due")) return "danger";
  if (t.includes("low") || t.includes("running")) return "warn";
  return "warn";
}

function renderUrgent(notif) {
  if (!notif) {
    urgentSection.style.display = "none";
    return;
  }

  urgentSection.style.display = "block";
  urgentTitleEl.textContent = notif.title || "Urgent notification";
  urgentSubEl.textContent = notif.message || "";
}

function renderRecent(notifs) {
  if (!recentListEl) return;

  // this is to remove the "Loading..." placeholder if it exists
  const placeholder = recentListEl.querySelector(".recent-empty");
  if (placeholder) placeholder.remove();

  // remove all existing cards
  recentListEl.querySelectorAll(".ncard").forEach(el => el.remove());

  if (!notifs || notifs.length === 0) {
    const empty = document.createElement("div");
    empty.className = "recent-empty";
    empty.style.padding = "12px";
    empty.style.color = "#444";
    empty.style.fontSize = "13px";
    empty.textContent = "No recent notifications.";
    recentListEl.insertBefore(empty, viewAllBtn);
    viewAllBtn.style.display = "none";
    return;
  }

  notifs.forEach(n => {
    const tagHtml = n.tagText ? `
      <div class="badge-row">
        <span class="badge ${badgeClassFromTag(n.tagText)}">${escapeHtml(n.tagText)}</span>
      </div>
    ` : "";

    const card = document.createElement("a");
    card.className = "ncard";
    card.href = "#";
    card.dataset.id = n.id;

    card.innerHTML = `
      <div class="ncard-body">
        <div class="ncard-title">${escapeHtml(n.title || "")}</div>
        <div class="ncard-sub">${escapeHtml(n.message || "")}</div>
        ${tagHtml}
        <div class="ncard-time">${escapeHtml(timeAgo(n.createdAt))}</div>
      </div>
    `;

    recentListEl.insertBefore(card, viewAllBtn);
  });

  viewAllBtn.style.display = "block";
}

auth.onAuthStateChanged((user) => {
  if (!user) {
    console.log("Not logged in — notifications won't load.");
    return;
  }

  const col = db.collection("users")
    .doc(user.uid)
    .collection("notifications");

  // shows the most recent top 3s
  col.orderBy("createdAt", "desc").limit(3).onSnapshot((snap) => {
    const notifs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderRecent(notifs);
  });

  col.where("priority", "==", "high")
    .orderBy("createdAt", "desc")
    .limit(1)
    .onSnapshot((snap) => {
      const doc = snap.docs[0];
      renderUrgent(doc ? { id: doc.id, ...doc.data() } : null);
    });

  // Badge count
  col.where("isRead", "==", false).onSnapshot((snap) => {
    const count = snap.size;
    if (badgeEl) {
      badgeEl.textContent = count;
      badgeEl.style.display = count > 0 ? "inline-flex" : "none";
    }
  });
});
