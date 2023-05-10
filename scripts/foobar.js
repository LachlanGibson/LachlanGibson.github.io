const preElements = document.querySelectorAll("pre");

preElements.forEach((p) => {
  p.addEventListener("click", () => {
    p.classList.add("no-before");
  });
});
