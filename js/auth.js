(() => {
  const path = location.pathname.toLowerCase();
  const role = sessionStorage.getItem("rg_role");
  const loggedIn = sessionStorage.getItem("rg_logged_in") === "true";
  const isAdmin = path.endsWith("admin.html");
  const isOrg = path.endsWith("organization.html");

  if (
    (isAdmin || isOrg) &&
    (!loggedIn ||
      (isAdmin && role !== "admin") ||
      (isOrg && role !== "organization"))
  ) {
    location.href = "login.html";
    return;
  }

  const logout = document.getElementById("logout");
  if (logout)
    logout.addEventListener("click", () => {
      sessionStorage.clear();
      location.href = "login.html";
    });
})();
