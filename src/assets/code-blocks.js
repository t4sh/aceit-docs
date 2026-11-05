(() => {
  const groups = [];
  const preferenceKey = (name) => `docs-code-tab:${name}`;

  function setCopied(button, copied) {
    button.classList.toggle("is-copied", copied);
    button.title = copied ? "Copied" : "Copy code";
  }

  function selectPanel(group, value) {
    const selected = group.panels.find((panel) => panel.dataset.value === value);
    if (!selected) return;
    for (const panel of group.panels) panel.hidden = panel !== selected;
    for (const tab of group.tabs) {
      const active = tab.dataset.value === value;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    }
    group.block.querySelector("[data-code-status]").textContent = "";
    group.block.classList.remove("has-copy-error");
    setCopied(group.block.querySelector("[data-code-copy]"), false);
  }

  for (const block of document.querySelectorAll(".code-block")) {
    const panels = [...block.children].filter((child) => child.matches("[data-code-panel]"));
    if (!panels.length) continue;
    const copy = block.querySelector("[data-code-copy]");
    const status = block.querySelector("[data-code-status]");
    let feedbackTimer;
    copy.hidden = false;
    copy.addEventListener("click", async () => {
      const panel = panels.find((item) => !item.hidden);
      const source = panel.querySelector("[data-code-source]").content.textContent;
      clearTimeout(feedbackTimer);
      setCopied(copy, false);
      copy.disabled = true;
      status.textContent = "";
      block.classList.remove("has-copy-error");
      try {
        await navigator.clipboard.writeText(source);
        setCopied(copy, true);
        status.textContent = "Code copied to clipboard.";
      } catch {
        block.classList.add("has-copy-error");
        status.textContent = "Could not copy. Select the code and copy it manually.";
      } finally {
        copy.disabled = false;
        feedbackTimer = setTimeout(() => { setCopied(copy, false); }, 2000);
      }
    });

    if (block.hasAttribute("data-code-group")) {
      const tablist = block.querySelector("[data-code-tabs]");
      const tabs = [...tablist.querySelectorAll("[data-code-tab]")];
      if (tabs.length !== panels.length) continue;
      const group = { block, panels, tabs, sync: block.dataset.codeSync };
      tablist.setAttribute("role", "tablist");
      tablist.setAttribute("aria-label", group.sync === "package-manager" ? "Package manager" : "Code examples");
      for (const [index, tab] of tabs.entries()) {
        tab.id = `${panels[index].id}-tab`;
        tab.setAttribute("role", "tab");
        tab.setAttribute("aria-controls", panels[index].id);
        panels[index].setAttribute("role", "tabpanel");
        panels[index].setAttribute("aria-labelledby", tab.id);
        tab.addEventListener("click", () => {
          selectPanel(group, tab.dataset.value);
          if (group.sync) {
            for (const other of groups) {
              if (other !== group && other.sync === group.sync) selectPanel(other, tab.dataset.value);
            }
            try { localStorage.setItem(preferenceKey(group.sync), tab.dataset.value); }
            catch { /* Preferences are optional when browser storage is unavailable. */ }
          }
        });
        tab.addEventListener("keydown", (event) => {
          let next;
          if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
          else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
          else if (event.key === "Home") next = 0;
          else if (event.key === "End") next = tabs.length - 1;
          else return;
          event.preventDefault();
          tabs[next].focus();
          tabs[next].click();
        });
      }
      let preferred;
      try { if (group.sync) preferred = localStorage.getItem(preferenceKey(group.sync)); }
      catch { /* All examples remain usable without storage. */ }
      selectPanel(group, panels.some((panel) => panel.dataset.value === preferred) ? preferred : panels[0].dataset.value);
      tablist.hidden = false;
      groups.push(group);
    }
    block.classList.add("is-enhanced");
  }
})();
