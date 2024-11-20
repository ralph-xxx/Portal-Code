document.addEventListener('DOMContentLoaded', () => {
    // DOM Element References
    const courseHeader = document.getElementById('course-header');
    const dropdownButton = document.querySelector('.dropdown13-button > a');
    const dropdownMenu = document.querySelector('.dropdown13-menu');
    const dropdownItems = document.querySelectorAll('.dropdown13-links li a');
    const modulesContainer = document.querySelector('.modules');
    const papersContainer = document.querySelector('.papers');
    const viewButton = document.getElementById('viewButton');
    const uploadButton = document.getElementById('uploadButton');
    const uploadArea = document.getElementById('uploadArea');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const uploadStatus = document.getElementById('uploadStatus');
    const fileDetailsForm = document.getElementById('fileDetailsForm');
    const uploadDetailsForm = document.getElementById('uploadDetailsForm');

    // Initial Setup
    let currentMode = 'view';
    let selectedFile = null;
    modulesContainer.style.display = 'none';
    papersContainer.classList.add('empty');

    // Mode Toggle Function
    function toggleMode(mode) {
        currentMode = mode;
        if (mode === 'view') {
            viewButton.classList.add('active');
            uploadButton.classList.remove('active');
            uploadArea.style.display = 'none';
            modulesContainer.style.display = 'block';
            papersContainer.style.display = 'block';
            fileDetailsForm.style.display = 'none';
        } else {
            uploadButton.classList.add('active');
            viewButton.classList.remove('active');
            uploadArea.style.display = 'block';
            modulesContainer.style.display = 'block';
            papersContainer.style.display = 'none';
            fileDetailsForm.style.display = 'none';
        }
    }

    // Event Listeners for Mode Buttons
    viewButton?.addEventListener('click', () => toggleMode('view'));
    uploadButton?.addEventListener('click', () => toggleMode('upload'));

    // Dropdown Menu Handler
    dropdownItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const selectedText = item.textContent;

            courseHeader.textContent = selectedText;
            dropdownButton.innerHTML = `${selectedText} <span class="arrow-down"></span>`;

            let modules = [];
            switch (selectedText) {
                case "FIRST YEAR":
                    modules = [
                        "APPLICATIONS DEVELOPMENT FOUNDATIONS",
                        "INFORMATION SYSTEMS",
                        "BUSINESS PRACTICE",
                        "PROGRAMMING 1",
                        "COMMUNICATION NETWORK FOUNDATION",
                        "PROFESSIONAL COMMUNICATION",
                        "ICT FUNDAMENTALS",
                        "MULTIMEDIA FOUNDATIONS"
                    ];
                    break;
                case "SECOND YEAR":
                    modules = [
                        "APPLICATION DEVELOPMENT 2A",
                        "COMMUNICATIONS NETWORK FUNDAMENTALS",
                        "MULTIMEDIA FUNDAMENTALS",
                        "IT ELECTIVES",
                        "PROFESSIONAL COMMUNICATION 2",
                        "APPLICATION DEVELOPMENT 2B"
                    ];
                    break;
                case "THIRD YEAR":
                    modules = [
                        "APPLICATION DEVELOPMENT 3A",
                        "INFORMATION SYSTEMS 3A",
                        "PROFESSIONAL PRACTICE",
                        "PROFESSIONAL COMMUNICATION 3",
                        "INFORMATION SYSTEMS 3B",
                        "IT ELECTIVES"
                    ];
                    break;
                case "FOURTH YEAR":
                case "ADVANCED":
                    modules = [
                        "ADVANCED DATABASE",
                        "HUMAN COMPUTER INTERACTION",
                        "ADVANCED APD",
                        "EMERGING TECHNOLOGY : IoT",
                        "CYBER SECURITY"
                    ];
                    break;
                default:
                    modulesContainer.style.display = 'none';
                    return;
            }

            // Clear and populate modules container
            modulesContainer.innerHTML = '';
            modules.forEach(module => {
                const moduleDiv = document.createElement('div');
                moduleDiv.classList.add('module');
                moduleDiv.innerHTML = `
                    <input type="button" class="modulebutton" value="${module}">
                `;
                modulesContainer.appendChild(moduleDiv);
            });

            modulesContainer.style.display = 'block';
            dropdownMenu.style.display = 'none';
        });
    });

    // Module Button Click Handler
    modulesContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('modulebutton')) {
            const moduleButtons = document.querySelectorAll('.modulebutton');
            moduleButtons.forEach(button => button.classList.remove('highlighted'));
            event.target.classList.add('highlighted');

            const selectedModule = event.target.value;
            
            if (currentMode === 'view') {
                fetchPapers(selectedModule);
            } else {
                uploadStatus.innerHTML = `Ready to upload to: ${selectedModule}`;
            }
        }
    });

    // File Upload Handlers
    if (dropZone) {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            handleFiles(e.dataTransfer.files);
        });

        dropZone.addEventListener('click', () => {
            fileInput.click();
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });
    }

    function handleFiles(files) {
        if (files.length > 0) {
            selectedFile = files[0];
            showFileDetailsForm();
        }
    }

    function showFileDetailsForm() {
        const selectedModule = document.querySelector('.modulebutton.highlighted')?.value;
        
        if (!selectedModule) {
            uploadStatus.innerHTML = '<p>Please select a module before uploading.</p>';
            return;
        }

        fileDetailsForm.style.display = 'block';
        uploadArea.style.display = 'none';
        document.getElementById('fileName').value = selectedFile.name;
    }

    // Upload Form Handler
    if (uploadDetailsForm) {
        uploadDetailsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const selectedModule = document.querySelector('.modulebutton.highlighted')?.value;
            if (!selectedModule || !selectedFile) {
                alert('Please select a module and a file before submitting.');
                return;
            }

            const formData = new FormData(this);
            formData.append('file', selectedFile);

            fetch(`http://localhost:3000/upload/${encodeURIComponent(selectedModule)}`, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(result => {
                alert(result.message);
                fileDetailsForm.style.display = 'none';
                uploadArea.style.display = 'block';
                this.reset();
                selectedFile = null;
                fetchPapers(selectedModule);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error uploading file. Please try again.');
            });
        });
    }

    // Fetch and Display Papers
    function fetchPapers(module) {
        fetch(`http://localhost:3000/papers/${encodeURIComponent(module)}`)
            .then(response => response.json())
            .then(papers => {
                displayPapers(papers, module);
            })
            .catch(error => {
                console.error('Error fetching papers:', error);
                papersContainer.innerHTML = '<p>No papers available for this module.</p>';
            });
    }

    function displayPapers(papers, module) {
        papersContainer.innerHTML = '';
        if (papers.length === 0) {
            papersContainer.classList.add('empty');
            papersContainer.innerHTML = '<p>No papers available for this module.</p>';
        } else {
            papersContainer.classList.remove('empty');
            papers.forEach(paper => {
                const mainDiv = document.createElement('div');
                mainDiv.classList.add('main');
        
                mainDiv.innerHTML = `
                    <div class="filename">
                        <input type="button" id="file" value="${paper.displayName || paper.filename}${paper.year ? ` (${paper.year})` : ''}">
                    </div>
                    <div class="preview">
                        <input type="button" value="Preview" id="tabbutton" onclick="previewFile('${module}', '${paper.filename}')">
                    </div>
                    <div class="download">
                        <input type="button" value="Download" id="tabbutton" onclick="downloadFile('${module}', '${paper.filename}')">
                    </div>
                    <div class="delete">
                        <input type="button" value="Delete" id="tabbutton" onclick="deleteFile('${module}', '${paper.filename}')">
                    </div>
                `;
        
                papersContainer.appendChild(mainDiv);
            });
        }
    }

    // Initial mode setup
    toggleMode('view');
});

// Global Functions for File Operations
function previewFile(module, filename) {
    const previewUrl = `http://localhost:3000/preview/${encodeURIComponent(module)}/${encodeURIComponent(filename)}`;
    window.open(previewUrl, '_blank');
}

function downloadFile(module, filename) {
    const downloadUrl = `http://localhost:3000/download/${encodeURIComponent(module)}/${encodeURIComponent(filename)}`;
    window.location.href = downloadUrl;
}

function deleteFile(module, filename) {
    if (confirm(`Are you sure you want to delete ${filename}?`)) {
        fetch(`http://localhost:3000/delete/${encodeURIComponent(module)}/${encodeURIComponent(filename)}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('File deleted successfully');
                // Refresh the papers list
                fetch(`http://localhost:3000/papers/${encodeURIComponent(module)}`)
                    .then(response => response.json())
                    .then(papers => {
                        const papersContainer = document.querySelector('.papers');
                        if (papersContainer) {
                            if (papers.length === 0) {
                                papersContainer.classList.add('empty');
                                papersContainer.innerHTML = '<p>No papers available for this module.</p>';
                            } else {
                                const event = new CustomEvent('paperDeleted', { detail: { module, papers } });
                                document.dispatchEvent(event);
                            }
                        }
                    });
            } else {
                alert('Error deleting file');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting file');
        });
    }
}