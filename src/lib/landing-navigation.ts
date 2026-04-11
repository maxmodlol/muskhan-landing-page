export function scrollToSection(id: string, offset = 120) {
  const el = document.getElementById(id);
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top,
    behavior: "smooth",
  });
}

export function getBookingTarget(hasItems: boolean) {
  return hasItems ? "booking" : "menu";
}
