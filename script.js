function showTab(id) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  document.querySelector(`.tab[onclick*="${id}"]`).classList.add('active');
  document.getElementById(id).classList.add('active');
}
