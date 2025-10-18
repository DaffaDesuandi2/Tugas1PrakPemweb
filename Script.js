const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar')
const openSidebar = document.getElementById('openSidebar');
const addCourse = document.getElementById('addCourse');
const courseList = document.getElementById('courseList');


const taskContainer = document.getElementById('taskContainer');
const mainTitle = document.getElementById('mainTitle');
const taskContent = document.getElementById('taskContent');
const addTaskBtn = document.getElementById('addTaskBtn');

const searchTaskInput = document.getElementById('searchTaskInput');
const filterStatusDropdown = document.getElementById('filterStatusDropdown');

let activeCourse = null; 
let allTasks = {};

// --- Fungsi Sidebar ---
openSidebar.addEventListener('click', () => {
      sidebar.classList.remove('-ml-64');
      openSidebar.classList.add('hidden');
    });

closeSidebar.addEventListener('click', () => {
      sidebar.classList.add('-ml-64');
      openSidebar.classList.remove('hidden');
});

function getAllTasksArray() {
    const allTasksArray = [];
    for (const courseName in allTasks) {
        allTasks[courseName].forEach(task => {
            allTasksArray.push({
                ...task,
                course: courseName // Tambahkan nama mata kuliah ke objek tugas
            });
        });
    }
    return allTasksArray;
}
/**
 * Menampilkan tugas untuk mata kuliah yang dipilih.
 * @param {string} courseName Nama mata kuliah yang dipilih.
 */

/**
 * Menampilkan tugas untuk mata kuliah yang dipilih.
 * @param {string} courseName Nama mata kuliah yang dipilih.
 */

function displayTasks(courseName) {
    searchTaskInput.value = '';
    filterStatusDropdown.value = 'all';

    mainTitle.textContent = `Tugas Mata Kuliah: ${courseName}`;
    activeCourse = courseName;
    addTaskBtn.classList.remove('hidden');
    
    // 3. Highlight tombol mata kuliah yang aktif (Kode ini tetap sama)
    document.querySelectorAll('#courseList div').forEach(item => {
        item.classList.remove('bg-blue-200', 'hover:bg-blue-300');
        item.classList.add('bg-gray-300', 'hover:bg-gray-200');
    });

    const activeItem = document.querySelector(`[data-course-name="${courseName}"]`);
    if (activeItem) {
        activeItem.classList.add('bg-blue-200', 'hover:bg-blue-300');
        activeItem.classList.remove('bg-gray-300', 'hover:bg-gray-200');
    }

    const tasks = allTasks[courseName] || [];
    let taskHtml = '';

    if (tasks.length === 0) {
        taskHtml = `<p class="text-gray-500 col-span-full">Belum ada tugas untuk mata kuliah ini. Klik "Tambah Tugas Baru" untuk memulai!</p>`;
    } else {
        tasks.forEach(task => {
            // Tentukan status
            const isDone = task.status === 'done'; 
            const statusClass = isDone ? 'border-green-500' : 'border-red-500';
            const badgeClass = isDone ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';
            const statusText = isDone ? 'Selesai' : 'Belum Selesai';
            const nextAction = isDone ? 'undone' : 'done'; 
            
            taskHtml += `
                <div class="bg-white p-6 rounded-lg shadow-lg border-l-4 ${statusClass} flex justify-between items-start relative">
                    
                    <div class="absolute top-2 right-2 z-10">
                        <button class="task-options-btn p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100" data-task-id="${task.id}">
                            <i data-lucide="more-vertical" class="w-5 h-5"></i>
                        </button>
                        
                        <div class="task-dropdown-menu absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded shadow-lg z-20 hidden" data-task-id="${task.id}">
                            <button class="delete-task-btn block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50" data-task-id="${task.id}">
                                🗑️ Hapus
                            </button>
                        </div>
                    </div>

                    <div class="flex-grow">
                        <h3 class="text-xl font-semibold mb-2">${task.name}</h3>
                        <p class="text-gray-600 mb-2">Deadline: 📅 ${task.deadline}</p>
                        
                        <button 
                            class="toggle-status-btn inline-block mt-3 px-3 py-1 text-sm font-medium text-white ${badgeClass} rounded-full transition duration-150 shadow-md"
                            data-task-id="${task.id}"
                            data-action="${nextAction}"
                        >
                            ${statusText}
                        </button>
                    </div>
                    
                    <div class="ml-4 flex-shrink-0">
                        </div>
                </div>
            `;
        });
    }

    taskContent.innerHTML = taskHtml;
    
    // Ikon hanya untuk tombol tambah tugas (yang ada ikon Lucide-nya)
    lucide.createIcons({
        'container': addTaskBtn
    });
    
    // === PENTING: Tambahkan event listener untuk tombol aksi (status badge) ===
    document.querySelectorAll('.toggle-status-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const taskId = parseInt(e.currentTarget.dataset.taskId);
            const action = e.currentTarget.dataset.action;
            toggleTaskStatus(taskId, action);
        });
    });
    document.querySelectorAll('.task-options-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const taskId = e.currentTarget.dataset.taskId;
            
            document.querySelectorAll('.task-dropdown-menu').forEach(menu => {
                if (menu.dataset.taskId !== taskId) {
                    menu.classList.add('hidden');
                }
            });

            const menu = document.querySelector(`.task-dropdown-menu[data-task-id="${taskId}"]`);
            menu.classList.toggle('hidden');
        });
    });
    document.querySelectorAll('.delete-task-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            const taskId = parseInt(e.currentTarget.dataset.taskId);
            document.querySelector(`.task-dropdown-menu[data-task-id="${taskId}"]`).classList.add('hidden');
            deleteTask(taskId);
        });
    });
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.task-options-btn') && !e.target.closest('.task-dropdown-menu')) {
            document.querySelectorAll('.task-dropdown-menu').forEach(menu => {
                menu.classList.add('hidden');
            });
        }
    });
    lucide.createIcons({ 'container': addTaskBtn });
}
function renderGlobalTasks() {
    const searchTerm = searchTaskInput.value.toLowerCase();
    const filterStatus = filterStatusDropdown.value;

    // Reset state aktif saat filter global digunakan
    activeCourse = null;
    document.querySelectorAll('#courseList div').forEach(item => {
        item.classList.remove('bg-blue-200', 'hover:bg-blue-300');
        item.classList.add('bg-gray-300', 'hover:bg-gray-200');
    });

    const tasks = getAllTasksArray();

    // Aplikasikan filter
    const filteredTasks = tasks.filter(task => {
        // 1. Filter Status
        const statusMatch = filterStatus === 'all' || task.status === filterStatus;

        // 2. Filter Pencarian (Nama, Deadline, atau Mata Kuliah)
        const searchMatch = !searchTerm || 
                            task.name.toLowerCase().includes(searchTerm) ||
                            task.deadline.toLowerCase().includes(searchTerm) ||
                            task.course.toLowerCase().includes(searchTerm);
        
        return statusMatch && searchMatch;
    });
    const pendingCount = filteredTasks.filter(task => task.status === 'pending').length;
    let titleText = "🔍 Hasil Pencarian Tugas Global";
    
    if (filteredTasks.length > 0) {
         if (filterStatus === 'pending') {
            titleText = `⚠️ ${filteredTasks.length} Tugas Belum Selesai ditemukan`;
        } else {
            titleText = `🔍 ${filteredTasks.length} Tugas ditemukan (${pendingCount} Belum Selesai)`;
        }
    }
    // Update UI Utama
    mainTitle.textContent = titleText;
    addTaskBtn.classList.add('hidden'); // Sembunyikan tombol tambah tugas di tampilan global

    let taskHtml = '';
    if (filteredTasks.length === 0) {
        taskHtml = `<p class="text-gray-500 col-span-full">Tidak ada tugas yang cocok dengan kriteria pencarian.</p>`;
    } else {
        filteredTasks.forEach(task => {
            const isDone = task.status === 'done'; 
            
            const statusClass = isDone ? 'border-green-500' : 'border-red-500';
            const badgeClass = isDone ? 'bg-green-500' : 'bg-red-500';
            const statusText = isDone ? 'Selesai' : 'Belum Selesai';
            
            // Di tampilan global, tombol toggle diubah menjadi tombol link ke mata kuliah aslinya
            taskHtml += `
                <div class="bg-white p-6 rounded-lg shadow-lg border-l-4 ${statusClass} flex justify-between items-start relative">
                    
                    <div class="absolute top-2 right-2 z-10">
                        <span class="text-gray-500 text-sm font-semibold">Matkul: ${task.course}</span>
                    </div>

                    <div class="flex-grow">
                        <h3 class="text-xl font-semibold mb-2">${task.name}</h3>
                        <p class="text-gray-600 mb-2">Deadline: 📅 ${task.deadline}</p>
                        
                        <button 
                            class="inline-block mt-3 px-3 py-1 text-sm font-medium text-white ${badgeClass} rounded-full transition duration-150 shadow-md hover:shadow-lg"
                            onclick="displayTasks('${task.course}')" 
                            title="Klik untuk melihat dan mengubah tugas ini"
                        >
                            ${statusText} (Lihat di ${task.course})
                        </button>
                    </div>
                </div>
            `;
        });
    }
    
    taskContent.innerHTML = taskHtml;
    // Panggil lucide.createIcons untuk memastikan ikon di tombol matkul sudah di-render
    lucide.createIcons(); 
}
searchTaskInput.addEventListener('input', renderGlobalTasks);
filterStatusDropdown.addEventListener('change', renderGlobalTasks)

function deleteTask(taskId) {
    if (!activeCourse) return;

    if (confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
        const taskArray = allTasks[activeCourse];
        
        // Cari index tugas
        const taskIndex = taskArray.findIndex(t => parseInt(t.id) === taskId);

        if (taskIndex !== -1) {
            // Hapus tugas dari array
            taskArray.splice(taskIndex, 1); 
            
            saveCourses(); // Simpan perubahan
            displayTasks(activeCourse); // Muat ulang tampilan
        }
    }
}
// Fungsi untuk mengubah status tugas
function toggleTaskStatus(taskId, action) {
    if (!activeCourse) return;

    // Array tugas untuk mata kuliah yang aktif
    const taskArray = allTasks[activeCourse];
    
    // PENTING: Gunakan parseInt(t.id) agar tipe data (string dari localStorage) 
    // sesuai dengan tipe data taskId (number dari event listener)
    const taskIndex = taskArray.findIndex(t => parseInt(t.id) === taskId);

    if (taskIndex !== -1) {
        // Ubah status: Jika aksi berikutnya 'done', set status ke 'done', jika tidak ke 'pending'
        taskArray[taskIndex].status = (action === 'done' ? 'done' : 'pending');
        
        saveCourses(); // Simpan perubahan
        displayTasks(activeCourse); // Muat ulang tampilan untuk update warna/teks
    }
}

// ... (lanjutan Script.js lainnya, termasuk fungsi toggleTaskStatus)
addTaskBtn.addEventListener('click', () => {
    if (!activeCourse) return; // Pastikan ada mata kuliah aktif

    const taskName = prompt(`Masukkan Nama Tugas untuk ${activeCourse}:`);
    if (!taskName || taskName.trim() === "") {
        alert("Nama tugas tidak boleh kosong!");
        return;
    }
    
    const taskDeadline = prompt(`Masukkan Deadline Tugas (Contoh: 2025-12-31):`);
    // Untuk saat ini, kita biarkan validasi deadline sederhana.

    const newTask = {
        id: Date.now(), // ID unik untuk tugas
        name: taskName,
        deadline: taskDeadline || 'Belum ditentukan',
        status: 'pending' // Default status
    };

    // Inisialisasi array jika belum ada tugas untuk matkul ini
    if (!allTasks[activeCourse]) {
        allTasks[activeCourse] = [];
    }

    // Tambahkan tugas baru
    allTasks[activeCourse].push(newTask);
    saveCourses();

    // Perbarui tampilan tugas
    displayTasks(activeCourse);
});
// --- Fungsionalitas Mata Kuliah ---

/**
 * Membuat elemen tombol mata kuliah dengan menu opsi (edit/hapus).
 * @param {string} courseName Nama mata kuliah.
 */
function createCourseElement(courseName) {
    // Container untuk tombol nama matkul dan tombol opsi
    const courseItem = document.createElement("div");
    courseItem.className = "flex items-center justify-between bg-gray-300 rounded mb-2 hover:bg-gray-200";
    courseItem.dataset.courseName = courseName; 

    // Tombol Nama Mata Kuliah
    const courseBtn = document.createElement("button");
    courseBtn.textContent = courseName;
    courseBtn.className = "flex-grow text-left px-3 py-2 text-lg font-semibold truncate";
    
    // === PENTING: Tambahkan event listener untuk menampilkan tugas ===
    courseBtn.addEventListener('click', () => {
        displayTasks(courseName);
    });
    // =============================================================

    // Tombol Opsi (Titik Tiga)
    const optionsBtn = document.createElement("button");
    optionsBtn.className = "p-2 hover:bg-gray-400 rounded-r relative";
    optionsBtn.innerHTML = '<i data-lucide="more-vertical" class="w-6 h-6"></i>';

    // Menu Dropdown
    const dropdownMenu = document.createElement("div");
    dropdownMenu.className = "absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded shadow-lg z-20 hidden";
    dropdownMenu.style.minWidth = '150px'; 
    
    // Tombol Edit
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️ Edit";
    editBtn.className = "block w-full text-left px-4 py-2 text-sm hover:bg-gray-100";
    
    // Tombol Hapus
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️ Hapus";
    deleteBtn.className = "block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50";

    dropdownMenu.appendChild(editBtn);
    dropdownMenu.appendChild(deleteBtn);
    optionsBtn.appendChild(dropdownMenu);
    
    courseItem.appendChild(courseBtn);
    courseItem.appendChild(optionsBtn);

    // Event Listener untuk menampilkan/menyembunyikan menu
    optionsBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        document.querySelectorAll('.dropdown-open').forEach(menu => {
            if (menu !== dropdownMenu) {
                menu.classList.add('hidden');
                menu.classList.remove('dropdown-open');
            }
        });

        dropdownMenu.classList.toggle('hidden');
        dropdownMenu.classList.toggle('dropdown-open');
    });

    // Menutup dropdown saat mengklik di luar
    document.addEventListener('click', (e) => {
        if (!optionsBtn.contains(e.target)) {
            dropdownMenu.classList.add('hidden');
            dropdownMenu.classList.remove('dropdown-open');
        }
    });

    // Event Listener untuk Edit
    editBtn.addEventListener('click', () => {
        dropdownMenu.classList.add('hidden');
        editCourse(courseItem, courseBtn);
    });

    // Event Listener untuk Hapus
    deleteBtn.addEventListener('click', () => {
        dropdownMenu.classList.add('hidden');
        deleteCourse(courseItem);
    });

    return courseItem;
}

// Tambah Mata Kuliah baru
addCourse.addEventListener('click', () => {
      const courseName = prompt("Masukkan nama mata kuliah:");

      if (!courseName || courseName.trim() === "") {
        alert("Nama mata kuliah tidak boleh kosong!");
        return;
      }
      
      if (Array.from(courseList.children).some(item => item.dataset.courseName === courseName.trim())) {
        alert("Mata kuliah dengan nama tersebut sudah ada!");
        return;
      }

      const courseItem = createCourseElement(courseName);
      courseList.appendChild(courseItem);
      
      lucide.createIcons({
          'container': courseItem 
      });

      saveCourses();
});

// Fungsi Edit
function editCourse(courseItem, courseBtn) {
    const oldName = courseItem.dataset.courseName;
    const newName = prompt(`Ubah nama mata kuliah: ${oldName}`, oldName);

    if (newName && newName.trim() !== "" && newName.trim() !== oldName) {
        if (Array.from(courseList.children).some(item => item.dataset.courseName === newName.trim())) {
            alert("Mata kuliah dengan nama tersebut sudah ada!");
            return;
        }

        courseBtn.textContent = newName;
        courseItem.dataset.courseName = newName;
        
        // PENTING: Jika matkul yang diedit sedang aktif, update judul utama
        if (activeCourse === oldName) {
            displayTasks(newName);
        }

        saveCourses();
    } else if (newName === null) {
        return;
    } else if (newName.trim() === "") {
        alert("Nama mata kuliah tidak boleh kosong!");
    }
}

// Fungsi Hapus
function deleteCourse(courseItem) {
    const courseName = courseItem.dataset.courseName;
    if (confirm(`Apakah Anda yakin ingin menghapus mata kuliah "${courseName}"?`)) {
        courseList.removeChild(courseItem);
        
        if (activeCourse === courseName) {
            mainTitle.textContent = "Pilih Mata Kuliah di Menu Samping";
            taskContent.innerHTML = "";
            addTaskBtn.classList.add('hidden');
            activeCourse = null;
        }

        saveCourses();
    }
}


// Fungsi Simpan ke Local Storage
function saveCourses() {
    const courses = Array.from(courseList.children).map(item => item.dataset.courseName);
    localStorage.setItem("courses", JSON.stringify(courses));
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
}

// Fungsi Muat dari Local Storage
function loadCourses() {
    const saved = JSON.parse(localStorage.getItem("courses")) || [];
    saved.forEach(name => {
        const courseItem = createCourseElement(name);
        courseList.appendChild(courseItem);
    });
    allTasks = JSON.parse(localStorage.getItem("allTasks")) || {};
    lucide.createIcons();
}

loadCourses();