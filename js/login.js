(() => {
  let role = "admin";
  const adminBtn = document.getElementById("adminRole");
  const orgBtn = document.getElementById("orgRole");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const error = document.getElementById("error");

  function selectRole(next) {
    role = next;
    const admin = next === "admin";
    adminBtn.className = `role-btn rounded-lg px-4 py-2.5 text-sm font-bold ${admin ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"}`;
    orgBtn.className = `role-btn rounded-lg px-4 py-2.5 text-sm font-bold ${!admin ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500"}`;
    error.classList.add("hidden");
  }

  adminBtn.addEventListener("click", () => selectRole("admin"));
  orgBtn.addEventListener("click", () => selectRole("organization"));

  document.getElementById("loginForm").addEventListener("submit", e => {
    e.preventDefault();
    const ok = role === "admin"
      ? username.value === "admin" && password.value === "admin123"
      : username.value === "organization" && password.value === "org123";
    if (!ok) {
      error.textContent = "Invalid demo credentials.";
      error.classList.remove("hidden");
      return;
    }
    sessionStorage.setItem("rg_logged_in", "true");
    sessionStorage.setItem("rg_role", role);
    location.href = role === "admin" ? "admin.html" : "organization.html";
  });
})();
