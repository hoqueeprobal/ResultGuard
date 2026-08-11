(() => {
  let resultText = null;
  let signatureText = null;

  function bindDrop(dropId, inputId) {
    const drop = document.getElementById(dropId);
    const input = document.getElementById(inputId);
    drop.addEventListener("click", () => input.click());
    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (!file) return;
      const nameEl = document.getElementById(
        inputId === "resultFile" ? "resultFileName" : "signatureFileName",
      );
      const statusEl = document.getElementById(
        inputId === "resultFile" ? "resultFileStatus" : "signatureFileStatus",
      );
      nameEl.textContent = file.name;
      statusEl.textContent = "File selected successfully";
      statusEl.className = "mt-1 text-xs font-semibold text-emerald-700";
      const reader = new FileReader();
      reader.onload = () => {
        if (inputId === "resultFile") resultText = reader.result;
        else signatureText = String(reader.result).trim();
      };
      reader.readAsText(file);
    });
  }

  bindDrop("resultDrop", "resultFile");
  bindDrop("signatureDrop", "signatureFile");

  document.getElementById("verify").addEventListener("click", async () => {
    if (!resultText || !signatureText) {
      alert("Please upload both the result and signature files.");
      return;
    }

    const section = document.getElementById("verificationSection");
    section.classList.remove("hidden");

    let valid = false;
    try {
      valid = await verifyResult(resultText, signatureText);
    } catch (e) {
      console.error(e);
      valid = false;
    }

    const card = document.getElementById("verificationCard");
    const title = document.getElementById("verificationTitle");
    const lines = document.getElementById("verificationLines");
    const status = document.getElementById("verificationStatus");
    const meaning = document.getElementById("meaning");

    if (valid) {
      card.className =
        "mt-4 rounded-xl border border-emerald-200 bg-emerald-50/50 p-6";
      title.textContent = "SIGNATURE VALID";
      title.className = "font-black tracking-wide text-emerald-700";
      lines.textContent = "INTEGRITY VERIFIED";
      lines.className = "font-black tracking-wide text-emerald-700";
      status.textContent = "AUTHENTIC";
      status.className = "mt-1 text-2xl font-black text-emerald-700";

      meaning.className =
        "mt-4 rounded-xl border border-blue-100 bg-blue-50 p-5 text-sm text-blue-900";
      meaning.innerHTML =
        "<b>What does this mean?</b><p class='mt-2'>The digital signature is valid and the uploaded result has not been modified since it was signed with the trusted University key.</p>";

      const text = String(resultText);

      const getLineValue = (labels, fallback) => {
        const labelPattern = labels.join("|");
        const match = text.match(
          new RegExp(
            `^[\\t ]*(?:${labelPattern})[\\t ]*[:\\-][\\t ]*([^\\r\\n]*)[\\t ]*$`,
            "im",
          ),
        );
        return match && match[1].trim() ? match[1].trim() : fallback;
      };

      document.getElementById("verifiedUniversity").textContent = getLineValue(
        ["University"],
        "Dhaka International University",
      );
      document.getElementById("verifiedStudentId").textContent = getLineValue(
        ["Student\\s+ID"],
        "2025001",
      );
      document.getElementById("verifiedStudentName").textContent = getLineValue(
        ["Student\\s+Name"],
        "Rahim Ahmed",
      );
      document.getElementById("verifiedDepartment").textContent = getLineValue(
        ["Department"],
        "CSE",
      );
      document.getElementById("verifiedCgpa").textContent = getLineValue(
        ["Overall\\s+CGPA"],
        "3.83",
      );
      document.getElementById("verifiedGrade").textContent = getLineValue(
        ["Grade"],
        "A+",
      );

      const resultMatch =
        text.match(/^\\s*Result\\s*[:\\-]\\s*(PASS|FAIL)\\s*$/im) ||
        text.match(/^\\s*Final\\s+Result\\s*[:\\-]\\s*(PASS|FAIL)\\s*$/im) ||
        text.match(/^\\s*Status\\s*[:\\-]\\s*(PASS|FAIL)\\s*$/im);
      document.getElementById("verifiedResult").textContent = resultMatch
        ? resultMatch[1].toUpperCase()
        : "PASS";
    } else {
      card.className = "mt-4 rounded-xl border border-red-200 bg-red-50 p-6";
      title.textContent = "SIGNATURE INVALID";
      title.className = "font-black tracking-wide text-red-700";
      lines.textContent = "INTEGRITY CHECK FAILED";
      lines.className = "font-black tracking-wide text-red-700";
      status.textContent = "POSSIBLE TAMPERING";
      status.className = "mt-1 text-2xl font-black text-red-700";

      meaning.className =
        "mt-4 rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-900";
      meaning.innerHTML =
        "<b>What does this mean?</b><p class='mt-2'>The signature does not match the uploaded result. The file may have been modified, or it may not have been signed by the trusted University key.</p>";
    }

    if (window.lucide) lucide.createIcons();
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();