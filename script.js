const notebook = document.getElementById("notebook");

// Загружаем сохранённые заметки
notebook.value = localStorage.getItem("notes") || "";

// Сохраняем заметки при изменении
notebook.addEventListener("input", () => {
    localStorage.setItem("notes", notebook.value);
}); 