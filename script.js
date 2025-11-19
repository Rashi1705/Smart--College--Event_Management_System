function showSection(sectionId) {
            // Hide all sections
            const sections = document.querySelectorAll('.content-section');
            sections.forEach(section => section.classList.remove('active'));
            
            // Remove active class from all tabs
            const tabs = document.querySelectorAll('.nav-tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            
            // Show selected section
            document.getElementById(sectionId).classList.add('active');
            
            // Add active class to clicked tab
            event.target.classList.add('active');
        }

        function registerForEvent(eventId) {
            alert(`Successfully registered for event: ${eventId}`);
            // In a real application, this would make an API call
        }

        function startScanner() {
            alert('QR Scanner activated! In a real app, this would open the camera.');
            // In a real application, this would activate the QR scanner
        }

        function markAttendance() {
            const studentId = document.getElementById('studentId').value;
            const eventId = document.getElementById('eventSelect').value;
            
            if (!studentId || !eventId) {
                alert('Please enter student ID and select an event.');
                return;
            }
            
            alert(`Attendance marked for Student ID: ${studentId} at event: ${eventId}`);
            
            // Clear form
            document.getElementById('studentId').value = '';
            document.getElementById('eventSelect').value = '';
        }

        // Handle event creation form submission
        document.getElementById('eventForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Event created successfully! Waiting for admin approval.');
            this.reset();
        });

        // Simulate real-time updates
        setInterval(() => {
            // In a real application, this would fetch new data from the server
            console.log('Checking for updates...');
        }, 30000);