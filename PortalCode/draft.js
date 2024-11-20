document.addEventListener('DOMContentLoaded', () => {
    // Define the papers for each module
    const allPapers = {
        "INTRODUCTION TO PROGRAMMING": [
            { filename: "IP 101 June 2021", preview: "Preview", download: "Download" },
            { filename: "IP 101 June 2022", preview: "Preview", download: "Download" },
            { filename: "IP 101 June 2023", preview: "Preview", download: "Download" },
            { filename: "IP 101 June 2024", preview: "Preview", download: "Download" }
        ],
        "WEB DEVELOPMENT FUNDAMENTALS": [
            { filename: "WDF 201 June 2021", preview: "Preview", download: "Download" },
            { filename: "WDF 201 June 2022", preview: "Preview", download: "Download" },
            { filename: "WDF 201 June 2023", preview: "Preview", download: "Download" },
            { filename: "WDF 201 June 2024", preview: "Preview", download: "Download" }
        ],
        "DATABASE MANAGEMENT": [document.addEventListener('DOMContentLoaded', () => {
            // Handle dropdown selection
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
        
            let currentMode = 'view';
        
            modulesContainer.style.display = 'none';
            papersContainer.classList.add('empty'); // Initial state is empty
        
            function toggleMode(mode) {
                currentMode = mode;
                if (mode === 'view') {
                    viewButton.classList.add('active');
                    uploadButton.classList.remove('active');
                    uploadArea.style.display = 'none';
                    modulesContainer.style.display = 'block';
                    papersContainer.style.display = 'block';
                } else {
                    uploadButton.classList.add('active');
                    viewButton.classList.remove('active');
                    uploadArea.style.display = 'block';
                    modulesContainer.style.display = 'block';
                    papersContainer.style.display = 'none';
                }
            }
        
            viewButton.addEventListener('click', () => toggleMode('view'));
            uploadButton.addEventListener('click', () => toggleMode('upload'));
        
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
                                "INTRODUCTION TO PROGRAMMING",
                                "WEB DEVELOPMENT FUNDAMENTALS",
                                "DATABASE MANAGEMENT",
                                "COMPUTER SCIENCE BASICS"
                            ];
                            break;
                        case "SECOND YEAR":
                            modules = [
                                "ADVANCED PROGRAMMING",
                                "NETWORKING PRINCIPLES",
                                "SOFTWARE ENGINEERING",
                                "OPERATING SYSTEMS"
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
                        case "ADVANCED DIP":
                            modules = [
                                "PROJECT MANAGEMENT",
                                "INTERNET OF THINGS",
                                "DATA ANALYSIS",
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
        
            // Handle module button click
            modulesContainer.addEventListener('click', (event) => {
                if (event.target.classList.contains('modulebutton')) {
                    const moduleButtons = document.querySelectorAll('.modulebutton');
                    moduleButtons.forEach(button => button.classList.remove('highlighted'));
                    event.target.classList.add('highlighted');
        
                    const selectedModule = event.target.value;
                    
                    if (currentMode === 'view') {
                        fetchPapers(selectedModule);
                    } else {
                        // In upload mode, display the current module name
                        uploadStatus.innerHTML = `Ready to upload to: ${selectedModule}`;
                    }
                }
            });
        
            // Drag and drop functionality
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
                const files = e.dataTransfer.files;
                handleFiles(files);
            });
        
            dropZone.addEventListener('click', () => {
                fileInput.click();
            });
        
            fileInput.addEventListener('change', (e) => {
                const files = e.target.files;
                handleFiles(files);
            });
        
            function handleFiles(files) {
                const formData = new FormData();
                formData.append('file', files[0]);
              
                const selectedModule = document.querySelector('.modulebutton.highlighted')?.value;
              
                if (!selectedModule) {
                  uploadStatus.innerHTML = '<p>Please select a module before uploading.</p>';
                  return;
                }
              
                fetch(`http://localhost:3000/upload/${encodeURIComponent(selectedModule)}`, {
                  method: 'POST',
                  body: formData
                })
                .then(response => response.json())
                .then(result => {
                  uploadStatus.innerHTML = `<p>${result.message}</p>`;
                  // Refresh the paper list after successful upload
                  fetchPapers(selectedModule);
                })
                .catch(error => {
                  console.error('Error:', error);
                  uploadStatus.innerHTML = '<p>Upload failed. Please try again.</p>';
                });
            }
              
            function fetchPapers(module) {
                fetch(`http://localhost:3000/papers/${encodeURIComponent(module)}`)
                  .then(response => response.json())
                  .then(papers => {
                    displayPapers(papers, module);
                  })
                  .catch(error => {
                    console.error('Error fetching papers:', error);
                    papersContainer.innerHTML = '<p>Error loading papers. Please try again.</p>';
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
                        <input type="button" id="file" value="${paper.filename}">
                      </div>
                      <div class="preview">
                        <input type="button" value="Preview" onclick="previewFile('${module}', '${paper.filename}')">
                      </div>
                      <div class="download">
                        <input type="button" value="Download" onclick="downloadFile('${module}', '${paper.filename}')">
                      </div>
                      <div class="delete">
                        <input type="button" value="Delete" onclick="deleteFile('${module}', '${paper.filename}')">
                      </div>
                    `;
              
                    papersContainer.appendChild(mainDiv);
                  });
                }
            }
        
            // Start in view mode
            toggleMode('view');
        });
        
        // These functions need to be global to be accessible from inline onclick handlers
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
                  // Refresh the paper list after successful deletion
                  fetchPapers(module);
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
            { filename: "DBM 301 June 2021", preview: "Preview", download: "Download" },
            { filename: "DBM 301 June 2022", preview: "Preview", download: "Download" },
            { filename: "DBM 301 June 2023", preview: "Preview", download: "Download" },
            { filename: "DBM 301 June 2024", preview: "Preview", download: "Download" }
        ],
        "COMPUTER SCIENCE BASICS": [
            { filename: "CSB 401 June 2021", preview: "Preview", download: "Download" },
            { filename: "CSB 401 June 2022", preview: "Preview", download: "Download" },
            { filename: "CSB 401 June 2023", preview: "Preview", download: "Download" },
            { filename: "CSB 401 June 2024", preview: "Preview", download: "Download" }
        ],
        "ADVANCED PROGRAMMING": [
            { filename: "AP 501 June 2021", preview: "Preview", download: "Download" },
            { filename: "AP 501 June 2022", preview: "Preview", download: "Download" },
            { filename: "AP 501 June 2023", preview: "Preview", download: "Download" },
            { filename: "AP 501 June 2024", preview: "Preview", download: "Download" }
        ],
        "NETWORKING PRINCIPLES": [
            { filename: "NP 601 June 2021", preview: "Preview", download: "Download" },
            { filename: "NP 601 June 2022", preview: "Preview", download: "Download" },
            { filename: "NP 601 June 2023", preview: "Preview", download: "Download" },
            { filename: "NP 601 June 2024", preview: "Preview", download: "Download" }
        ],
        "SOFTWARE ENGINEERING": [
            { filename: "SE 701 June 2021", preview: "Preview", download: "Download" },
            { filename: "SE 701 June 2022", preview: "Preview", download: "Download" },
            { filename: "SE 701 June 2023", preview: "Preview", download: "Download" },
            { filename: "SE 701 June 2024", preview: "Preview", download: "Download" }
        ],
        "OPERATING SYSTEMS": [
            { filename: "OS 801 June 2021", preview: "Preview", download: "Download" },
            { filename: "OS 801 June 2022", preview: "Preview", download: "Download" },
            { filename: "OS 801 June 2023", preview: "Preview", download: "Download" },
            { filename: "OS 801 June 2024", preview: "Preview", download: "Download" }
        ],
        "APPLICATION DEVELOPMENT 3A": [
            { filename: "AD 901 June 2021", preview: "Preview", download: "Download" },
            { filename: "AD 901 June 2022", preview: "Preview", download: "Download" },
            { filename: "AD 901 June 2023", preview: "Preview", download: "Download" },
            { filename: "AD 901 June 2024", preview: "Preview", download: "Download" }
        ],
        "INFORMATION SYSTEMS 3A": [
            { filename: "IS 1001 June 2021", preview: "Preview", download: "Download" },
            { filename: "IS 1001 June 2022", preview: "Preview", download: "Download" },
            { filename: "IS 1001 June 2023", preview: "Preview", download: "Download" },
            { filename: "IS 1001 June 2024", preview: "Preview", download: "Download" }
        ],
        "PROFESSIONAL PRACTICE": [
            { filename: "PP 1101 June 2021", preview: "Preview", download: "Download" },
            { filename: "PP 1101 June 2022", preview: "Preview", download: "Download" },
            { filename: "PP 1101 June 2023", preview: "Preview", download: "Download" },
            { filename: "PP 1101 June 2024", preview: "Preview", download: "Download" }
        ],
        "PROFESSIONAL COMMUNICATION 3": [
            { filename: "PC 1201 June 2021", preview: "Preview", download: "Download" },
            { filename: "PC 1201 June 2022", preview: "Preview", download: "Download" },
            { filename: "PC 1201 June 2023", preview: "Preview", download: "Download" },
            { filename: "PC 1201 June 2024", preview: "Preview", download: "Download" }
        ],
        "INFORMATION SYSTEMS 3B": [
            { filename: "IS 1301 June 2021", preview: "Preview", download: "Download" },
            { filename: "IS 1301 June 2022", preview: "Preview", download: "Download" },
            { filename: "IS 1301 June 2023", preview: "Preview", download: "Download" },
            { filename: "IS 1301 June 2024", preview: "Preview", download: "Download" }
        ],
        "IT ELECTIVES": [
            { filename: "ITE 1401 June 2021", preview: "Preview", download: "Download" },
            { filename: "ITE 1401 June 2022", preview: "Preview", download: "Download" },
            { filename: "ITE 1401 June 2023", preview: "Preview", download: "Download" },
            { filename: "ITE 1401 June 2024", preview: "Preview", download: "Download" }
        ],
        "PROJECT MANAGEMENT": [
            { filename: "PM 1501 June 2021", preview: "Preview", download: "Download" },
            { filename: "PM 1501 June 2022", preview: "Preview", download: "Download" },
            { filename: "PM 1501 June 2023", preview: "Preview", download: "Download" },
            { filename: "PM 1501 June 2024", preview: "Preview", download: "Download" }
        ],
        "INTERNET OF THINGS": [
            { filename: "IoT 1601 June 2021", preview: "Preview", download: "Download" },
            { filename: "IoT 1601 June 2022", preview: "Preview", download: "Download" },
            { filename: "IoT 1601 June 2023", preview: "Preview", download: "Download" },
            { filename: "IoT 1601 June 2024", preview: "Preview", download: "Download" }
        ],
        "DATA ANALYSIS": [
            { filename: "DA 1701 June 2021", preview: "Preview", download: "Download" },
            { filename: "DA 1701 June 2022", preview: "Preview", download: "Download" },
            { filename: "DA 1701 June 2023", preview: "Preview", download: "Download" },
            { filename: "DA 1701 June 2024", preview: "Preview", download: "Download" }
        ],
        "CYBER SECURITY": [
            { filename: "CS 1801 June 2021", preview: "Preview", download: "Download" },
            { filename: "CS 1801 June 2022", preview: "Preview", download: "Download" },
            { filename: "CS 1801 June 2023", preview: "Preview", download: "Download" },
            { filename: "CS 1801 June 2024", preview: "Preview", download: "Download" }
        ]
    };

    // Handle dropdown selection
    const courseHeader = document.getElementById('course-header');
    const dropdownButton = document.querySelector('.dropdown13-button > a');
    const dropdownMenu = document.querySelector('.dropdown13-menu');
    const dropdownItems = document.querySelectorAll('.dropdown13-links li a');
    const modulesContainer = document.querySelector('.modules');
    const papersContainer = document.querySelector('.papers');

    modulesContainer.style.display = 'none';
    papersContainer.classList.add('empty'); // Initial state is empty

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
                        "INTRODUCTION TO PROGRAMMING",
                        "WEB DEVELOPMENT FUNDAMENTALS",
                        "DATABASE MANAGEMENT",
                        "COMPUTER SCIENCE BASICS"
                    ];
                    break;
                case "SECOND YEAR":
                    modules = [
                        "ADVANCED PROGRAMMING",
                        "NETWORKING PRINCIPLES",
                        "SOFTWARE ENGINEERING",
                        "OPERATING SYSTEMS"
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
                    modules = [
                        "PROJECT MANAGEMENT",
                        "INTERNET OF THINGS",
                        "DATA ANALYSIS",
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

    // Handle module button click
    modulesContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('modulebutton')) {
            const moduleButtons = document.querySelectorAll('.modulebutton');
            moduleButtons.forEach(button => button.classList.remove('highlighted'));
            event.target.classList.add('highlighted');

            const selectedModule = event.target.value;
            const selectedPapers = allPapers[selectedModule] || [];

            papersContainer.innerHTML = '';
            if (selectedPapers.length === 0) {
                papersContainer.classList.add('empty');
            } else {
                papersContainer.classList.remove('empty');
                selectedPapers.forEach(paper => {
                    const mainDiv = document.createElement('div');
                    mainDiv.classList.add('main');

                    mainDiv.innerHTML = `
                        <div class="filename">
                            <input type="button" id="file" value="${paper.filename}">
                        </div>
                        <div class="preview">
                            <input type="previewbutton" value="${paper.preview}">
                        </div>
                        <div class="download">
                            <input type="downloadbutton" value="${paper.download}">
                        </div>
                        <div class="checkbutton">
                            <label class="checkbox1">
                                <input type="checkbox" />
                                <span></span>
                            </label>
                        </div>
                    `;

                    papersContainer.appendChild(mainDiv);
                });
            }
        }
    });
});

