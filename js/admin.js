(() => {
  const rows = document.getElementById("semesterRows");
  let semesterCount = 0;
  let lastResult = "";
  let lastSignature = "";
  let lastHash = "";

  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.remove("hidden");
    clearTimeout(window.__toast);
    window.__toast = setTimeout(() => t.classList.add("hidden"), 2600);
  }

  function addSemester(value = "") {
    semesterCount++;
    const tr = document.createElement("tr");
    tr.className = "border-t border-slate-100";
    tr.innerHTML = `
      <td class="px-4 py-3 font-semibold">${semesterCount}${semesterCount === 1 ? "st" : semesterCount === 2 ? "nd" : semesterCount === 3 ? "rd" : "th"} Semester</td>
      <td class="px-4 py-3"><input type="number" min="0" max="4" step="0.01" value="${value}" class="cgpa-input w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-600"></td>
      <td class="px-4 py-3 text-right"><button class="delete-semester rounded-lg bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100">🗑</button></td>`;
    tr.querySelector(".cgpa-input").addEventListener("input", updateSummary);
    tr.querySelector(".delete-semester").addEventListener("click", () => {
      tr.remove();
      renumber();
      updateSummary();
    });
    rows.appendChild(tr);
    if (window.lucide) lucide.createIcons();
    updateSummary();
  }

  function renumber() {
    [...rows.children].forEach((tr, i) => {
      const n = i + 1;
      tr.children[0].textContent = `${n}${n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"} Semester`;
    });
    semesterCount = rows.children.length;
  }

  function getCGPAs() {
    return [...document.querySelectorAll(".cgpa-input")]
      .map((x) => Number(x.value))
      .filter((x) => Number.isFinite(x) && x >= 0 && x <= 4);
  }

  function gradeFor(cgpa) {
    if (cgpa >= 3.75) return ["A+", "Excellent"];
    if (cgpa >= 3.5) return ["A", "Very Good"];
    if (cgpa >= 3.25) return ["A-", "Good"];
    if (cgpa >= 3.0) return ["B+", "Good"];
    if (cgpa >= 2.75) return ["B", "Satisfactory"];
    if (cgpa >= 2.5) return ["B-", "Satisfactory"];
    if (cgpa >= 2.25) return ["C", "Average"];
    if (cgpa >= 2.0) return ["D", "Pass"];
    return ["F", "Fail"];
  }

  function updateSummary() {
    const values = getCGPAs();
    const overall = values.length
      ? values.reduce((a, b) => a + b, 0) / values.length
      : 0;
    document.getElementById("overallCgpa").textContent = overall.toFixed(2);
    const [grade, text] = values.length
      ? gradeFor(overall)
      : ["—", "Waiting for CGPA"];
    document.getElementById("overallGrade").textContent = grade;
    document.getElementById("gradeText").textContent = text;
    const result = values.length ? (overall >= 2 ? "PASS" : "FAIL") : "—";
    document.getElementById("overallResult").textContent = result;
    document.getElementById("overallResult").className =
      `mt-2 text-4xl font-black ${result === "PASS" ? "text-emerald-600" : result === "FAIL" ? "text-red-600" : "text-slate-700"}`;
  }

  function buildResultText() {
    const studentId = document.getElementById("studentId").value.trim();
    const studentName = document.getElementById("studentName").value.trim();
    const department = document.getElementById("department").value;
    const values = getCGPAs();
    const overall = values.reduce((a, b) => a + b, 0) / values.length;
    const [grade] = gradeFor(overall);
    const result = overall >= 2 ? "PASS" : "FAIL";
    const now = new Date().toISOString();

    const semesterLines = values
      .map(
        (v, i) =>
          `${i + 1}${i === 0 ? "st" : i === 1 ? "nd" : i === 2 ? "rd" : "th"} Semester : ${v.toFixed(2)}`,
      )
      .join("\n");
    return [
      "RESULTGUARD",
      "ACADEMIC EXAMINATION RESULT",
      "----------------------------------------",
      `Student ID   : ${studentId}`,
      `Student Name : ${studentName}`,
      `Department   : ${department}`,
      "----------------------------------------",
      "Semester-wise CGPA",
      semesterLines,
      "----------------------------------------",
      `Overall CGPA : ${overall.toFixed(2)}`,
      `Grade        : ${grade}`,
      `Result       : ${result}`,
      "----------------------------------------",
      `Issued At    : ${now}`,
      "Signature Algorithm : RSA-2048 / RSA-PSS / SHA-256",
    ].join("\n");
  }

  document
    .getElementById("addSemester")
    .addEventListener("click", () => addSemester());
  document.getElementById("generate").addEventListener("click", async () => {
    const studentId = document.getElementById("studentId").value.trim();
    const studentName = document.getElementById("studentName").value.trim();
    const values = getCGPAs();
    if (
      !studentId ||
      !studentName ||
      !values.length ||
      values.length !== document.querySelectorAll(".cgpa-input").length
    ) {
      toast("Please complete Student Information and all CGPA fields.");
      return;
    }
    if (values.some((v) => v < 0 || v > 4)) {
      toast("CGPA must be between 0.00 and 4.00.");
      return;
    }
    try {
      lastResult = buildResultText();
      lastHash = await sha256Hex(lastResult);
      lastSignature = await signResult(lastResult);

      document.getElementById("previewSection").classList.remove("hidden");
      document.getElementById("resultPreview").textContent = lastResult;
      document.getElementById("hash").textContent = lastHash;
      document.getElementById("signaturePreview").textContent = lastSignature;
      toast("Result generated and digitally signed.");
      document
        .getElementById("previewSection")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {
      console.error(e);
      toast(
        "Cryptographic signing failed. Run the project through a local server.",
      );
    }
  });

  function download(content, filename, type) {
    const blob = new Blob([content], { type });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  document.getElementById("downloadResult").addEventListener("click", () => {
    const id = document.getElementById("studentId").value.trim() || "result";
    download(lastResult, `result_${id}.txt`, "text/plain");
  });
  document.getElementById("downloadSignature").addEventListener("click", () => {
    const id = document.getElementById("studentId").value.trim() || "signature";
    download(lastSignature, `signature_${id}.sig`, "text/plain");
  });
  document.getElementById("copyHash").addEventListener("click", async () => {
    await navigator.clipboard.writeText(lastHash);
    toast("SHA-256 hash copied.");
  });

  addSemester(3.75);
  addSemester(3.8);
  addSemester(3.85);
  addSemester(3.9);
})();
