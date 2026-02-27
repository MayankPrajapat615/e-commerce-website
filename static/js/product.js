// Accordion for FAQ section
function toggleAccordion(header) {
  const item = header.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) {
    item.classList.add('open');
  }
}