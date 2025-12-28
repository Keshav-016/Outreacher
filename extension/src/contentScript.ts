chrome.runtime.onMessage.addListener((req, _sender, sendResponse) => {
  if (req.type === "GET_PROFILE") {
    const fullName =
      (document.querySelector("h1") as HTMLElement | null)?.innerText || ""

    const role =
      (document.querySelector(".text-body-medium") as HTMLElement | null)?.innerText || "";

    const company =
      (document.querySelector(".pv-text-details__right-panel-item-text") as HTMLElement | null)?.innerText || "";

    sendResponse({
      fullName,
      role,
      company,
      url: window.location.href
    });
  }
});
