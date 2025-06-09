const isURLSuspicious = (url: string): boolean => {
  /// TODO: Determine suspicious URLs through API request
  const suspects = [
    "nytimes.com",
    "theguardian.com",
    "cnn.com",
  ];
  return suspects.some((suspect: string) => url.includes(suspect));
};

const anchors : NodeListOf<HTMLElement> = document.querySelectorAll("a");

const makeWarningText = (doc: Document): HTMLElement => {
  const element: HTMLElement = doc.createElement("span");
  element.innerText = "⚠️";
  element.classList.add("safeweb-warningText");
  return element;
};

const render = () => {
    anchors.forEach((anchor: HTMLElement) => {
    const href: string = anchor.getAttribute("href") ?? "";
    const shouldWarn: boolean = isURLSuspicious(href);
    if (shouldWarn) {
        anchor.classList.add("safeweb-warning");
        const warningText: HTMLElement = makeWarningText(document);
        anchor.parentNode?.insertBefore(warningText, anchor.nextSibling);
    }
    });
}

render();