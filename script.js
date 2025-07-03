document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const textInput = document.getElementById('textInput');
    const textDisplay = document.getElementById('textDisplay');
    const timeDisplay = document.getElementById('timeDisplay');
    const wpmDisplay = document.getElementById('wpmDisplay');
    const accuracyDisplay = document.getElementById('accuracyDisplay');
    const charsDisplay = document.getElementById('charsDisplay');
    const progressBar = document.getElementById('progressBar');
    const testButtons = document.querySelectorAll('.test-btn');
    const startCustomTest = document.getElementById('startCustomTest');
    const customText = document.getElementById('customText');
    const estimatedTime = document.getElementById('estimatedTime');
    const restartTest = document.getElementById('restartTest');
    const backToTests = document.getElementById('backToTests');
    const typingContainer = document.querySelector('.typing-container');
    const testSelection = document.querySelector('.test-selection');
    const resultsContainer = document.querySelector('.results-container');
    const resultsContent = document.querySelector('.results-content');
    const resultsPlaceholder = document.querySelector('.results-placeholder');
    const finalWPM = document.getElementById('finalWPM');
    const finalAccuracy = document.getElementById('finalAccuracy');
    const finalTime = document.getElementById('finalTime');
    const newTest = document.getElementById('newTest');
    const printCert = document.getElementById('printCert');
    const soundToggle = document.getElementById('soundToggle');
    const themeToggle = document.getElementById('themeToggle');
    const blueLightToggle = document.getElementById('blueLightToggle');
    const blueLightFilter = document.getElementById('blueLightFilter');
    const keySound = document.getElementById('keySound');
    const keySound2 = document.getElementById('keySound2');
    const keySound3 = document.getElementById('keySound3');
    const completeSound = document.getElementById('completeSound');
    const confettiContainer = document.getElementById('confettiContainer');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const footerLinks = document.querySelectorAll('.footer-link');
    const startPracticeBtn = document.querySelector('.start-practice');
    
    // Variables
    let testText = '';
    let timer;
    let timeLeft = 60;
    let isTestRunning = false;
    let startTime;
    let endTime;
    let correctChars = 0;
    let incorrectChars = 0;
    let totalTyped = 0;
    let wpmHistory = [];
    let soundEnabled = true;
    let darkMode = false;
    let blueLightFilterEnabled = false;
    let idleTimer;
    let lastTypedTime = 0;
    
    // Sample texts for different test durations
    const sampleTexts = {
        60: "The quick brown fox jumps over the lazy dog. This sentence contains all the letters in the English alphabet. Typing is a skill that improves with practice. Regular practice can significantly increase your typing speed and accuracy. Focus on hitting the right keys without looking at your keyboard. Over time, your fingers will learn the positions automatically, making you a faster and more efficient typist.",
        120: "The ability to type quickly and accurately is an essential skill in today's digital world. Whether you're a student, professional, or casual computer user, improving your typing speed can save you time and increase productivity. The average typing speed is around 40 words per minute, but with practice, many people can reach speeds of 70 WPM or higher. Remember that accuracy is just as important as speed. It's better to type slower with fewer mistakes than to type quickly with many errors that need to be corrected later.",
        180: "Typing is a fundamental skill that has become increasingly important in our technology-driven society. From writing emails to coding software, efficient typing can make many tasks easier and faster. The history of typing dates back to the 19th century with the invention of the typewriter. Today, we use computer keyboards, but the basic QWERTY layout remains largely unchanged. While some argue that alternative keyboard layouts may be more efficient, QWERTY is still the most widely used. To improve your typing, practice regularly, maintain good posture, and try to avoid looking at the keyboard. Over time, you'll develop muscle memory that will allow you to type without conscious thought, freeing your mind to focus on the content rather than the mechanics of typing."
    };
    
    const pageTexts = {
        1: "The journey to becoming a proficient typist begins with understanding the keyboard layout. The QWERTY design was originally created for mechanical typewriters to prevent jamming by separating commonly used letter pairs. Despite technological advancements, this layout has persisted. When practicing, start slowly and focus on accuracy. Use all ten fingers, with each finger responsible for specific keys. The 'home row' keys (ASDF for the left hand and JKL; for the right hand) serve as the base position. With consistent practice, your fingers will automatically find the correct keys without conscious effort.",
        2: "Touch typing, the method of typing without looking at the keyboard, is the most efficient way to type. It was developed by Frank Edward McGurrin in the late 1880s. The technique involves memorizing the keyboard layout and using muscle memory to locate keys. To practice touch typing, begin with simple exercises focusing on the home row, then gradually incorporate other rows. Online typing tutors and games can make practice more engaging. Regular, short practice sessions are more effective than occasional long ones. Track your progress by periodically testing your words per minute (WPM) and accuracy. Remember that speed will naturally increase as your accuracy improves. Don't get discouraged by slow progress; typing is a skill that develops over time with persistent effort.",
        3: "Advanced typing techniques can help you break through plateaus in your typing speed. One method is to focus on difficult key combinations that slow you down. Practice these combinations repeatedly until they become comfortable. Another technique is to type rhythmically, maintaining a steady pace rather than speeding up and slowing down. This helps develop consistency. Pay attention to common mistakes and analyze why they occur. Are you consistently mistaking certain letters? Do you struggle with particular finger movements? Targeted practice can address these issues. Additionally, consider your typing environment. An ergonomic keyboard and proper posture can reduce fatigue and increase comfort during long typing sessions. Finally, challenge yourself with different types of content - technical terms, numbers, and symbols require different skills than regular prose. Diversifying your practice material will make you a more versatile typist capable of handling any typing task with ease and confidence."
    };
    
    // Initialize
    init();
    
    function init() {
        // Load preferences from localStorage
        loadPreferences();
        
        // Set up event listeners
        setupEventListeners();
        
        // Calculate estimated time for custom text
        customText.addEventListener('input', updateEstimatedTime);
        
        // Show home section by default
        showSection('home');
    }
    
    function loadPreferences() {
        // Load sound preference
        if (localStorage.getItem('soundEnabled') !== null) {
            soundEnabled = localStorage.getItem('soundEnabled') === 'true';
            updateSoundButton();
        }
        
        // Load theme preference
        if (localStorage.getItem('darkMode') !== null) {
            darkMode = localStorage.getItem('darkMode') === 'true';
            updateTheme();
        }
        
        // Load blue light filter preference
        if (localStorage.getItem('blueLightFilterEnabled') !== null) {
            blueLightFilterEnabled = localStorage.getItem('blueLightFilterEnabled') === 'true';
            updateBlueLightFilter();
        }
    }
    
    function setupEventListeners() {
        // Test selection buttons
        testButtons.forEach(button => {
            button.addEventListener('click', function() {
                const time = this.getAttribute('data-time');
                const pages = this.getAttribute('data-pages');
                
                if (time) {
                    startTest(parseInt(time), sampleTexts[time]);
                } else if (pages) {
                    startTest(null, pageTexts[pages], parseInt(pages));
                }
                
                showSection('practice');
            });
        });
        
        // Custom test button
        startCustomTest.addEventListener('click', function() {
            if (customText.value.trim().length > 0) {
                startTest(null, customText.value.trim());
                showSection('practice');
            } else {
                alert('Please enter some text for your custom test.');
            }
        });
        
        // Restart test button
        restartTest.addEventListener('click', restartCurrentTest);
        
        // Back to tests button
        backToTests.addEventListener('click', function() {
            showSection('practice');
            testSelection.classList.remove('hidden');
            typingContainer.classList.add('hidden');
        });
        
        // New test button
        newTest.addEventListener('click', function() {
            showSection('practice');
            testSelection.classList.remove('hidden');
            typingContainer.classList.add('hidden');
            resultsContent.classList.remove('active');
            resultsPlaceholder.classList.remove('hidden');
        });
        
        // Print certificate button
        printCert.addEventListener('click', printCertificate);
        
        // Sound toggle
        soundToggle.addEventListener('click', toggleSound);
        
        // Theme toggle
        themeToggle.addEventListener('click', toggleTheme);
        
        // Blue light filter toggle
        blueLightToggle.addEventListener('click', toggleBlueLightFilter);
        
        // Text input events
        textInput.addEventListener('input', checkTyping);
        textInput.addEventListener('keydown', handleKeyDown);
        
        // Navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const section = this.getAttribute('data-section');
                showSection(section);
            });
        });
        
        // Footer links
        footerLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const section = this.getAttribute('data-section');
                showSection(section);
            });
        });
        
        // Start practice button
        startPracticeBtn.addEventListener('click', function() {
            showSection('practice');
        });
    }
    
    function showSection(sectionId) {
        // Hide all sections
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        document.getElementById(sectionId).classList.add('active');
        
        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });
        
        // Scroll to top
        window.scrollTo(0, 0);
    }
    
    function startTest(timeLimit, text, pages = null) {
        testText = text;
        timeLeft = timeLimit || Math.ceil(text.length / 5); // Estimate 5 chars per word, 1 min per 40 words
        
        // Initialize test variables
        isTestRunning = false;
        correctChars = 0;
        incorrectChars = 0;
        totalTyped = 0;
        wpmHistory = [];
        lastTypedTime = 0;
        
        // Display the text
        displayText();
        
        // Set up timer display
        updateTimerDisplay();
        
        // Reset progress bar
        progressBar.style.width = '0%';
        
        // Show typing interface
        testSelection.classList.add('hidden');
        typingContainer.classList.remove('hidden');
        resultsContainer.classList.add('hidden');
        
        // Focus on input field
        setTimeout(() => {
            textInput.value = '';
            textInput.focus();
        }, 100);
    }
    
    function displayText() {
        textDisplay.innerHTML = '';
        
        // Split text into characters and create spans for each
        testText.split('').forEach(char => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? ' ' : char;
            if (char === ' ') span.classList.add('space');
            textDisplay.appendChild(span);
        });
        
        // Highlight first character
        if (textDisplay.firstChild) {
            textDisplay.firstChild.classList.add('current');
        }
    }
    
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    function startTimer() {
        if (timer) clearInterval(timer);
        
        startTime = new Date();
        isTestRunning = true;
        lastTypedTime = Date.now();
        
        timer = setInterval(() => {
            // Check if user has been idle for more than 5 seconds
            const now = Date.now();
            if (now - lastTypedTime > 5000) {
                isTestRunning = false;
                return;
            }
            
            // Only decrement time if test is running and user is actively typing
            if (isTestRunning) {
                timeLeft--;
                updateTimerDisplay();
                
                // Record WPM every 5 seconds
                if (timeLeft % 5 === 0 && totalTyped > 0) {
                    const elapsedMinutes = (60 - timeLeft) / 60;
                    const currentWPM = Math.round((correctChars / 5) / elapsedMinutes);
                    wpmHistory.push(currentWPM);
                }
                
                if (timeLeft <= 0) {
                    endTest();
                }
            }
        }, 1000);
    }
    
    function checkTyping(e) {
        const inputText = e.target.value;
        const lastCharTyped = inputText[inputText.length - 1];
        const currentCharIndex = inputText.length - 1;
        
        // Update last typed time
        lastTypedTime = Date.now();
        
        // Start timer on first keystroke if not already running
        if (!isTestRunning && inputText.length === 1) {
            startTimer();
        } else if (!isTestRunning) {
            // Resume timer if user was idle
            isTestRunning = true;
        }
        
        // Play random key sound if enabled
        if (soundEnabled && inputText.length > 0) {
            const sounds = [keySound, keySound2, keySound3];
            const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
            randomSound.currentTime = 0;
            randomSound.play().catch(e => console.log("Sound playback prevented:", e));
        }
        
        // Haptic feedback for incorrect key (if supported)
        if (lastCharTyped !== testText[currentCharIndex] && navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        // Update character highlighting
        updateCharacterHighlighting(inputText);
        
        // Update stats
        updateStats();
        
        // Update progress
        const progress = (inputText.length / testText.length) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
        
        // Check if test is complete
        if (inputText.length === testText.length) {
            endTest();
        }
    }
    
    function handleKeyDown(e) {
        // Prevent backspace from going beyond the current typed length
        if (e.key === 'Backspace' && textInput.selectionStart === textInput.selectionEnd && textInput.selectionStart === 0) {
            e.preventDefault();
        }
    }
    
    function updateCharacterHighlighting(inputText) {
        const chars = textDisplay.querySelectorAll('.char');
        let correctCount = 0;
        let incorrectCount = 0;
        
        chars.forEach((char, index) => {
            char.classList.remove('correct', 'incorrect', 'current');
            
            if (index < inputText.length) {
                if (inputText[index] === testText[index]) {
                    char.classList.add('correct');
                    correctCount++;
                } else {
                    char.classList.add('incorrect');
                    incorrectCount++;
                }
            }
            
            if (index === inputText.length) {
                char.classList.add('current');
            }
        });
        
        correctChars = correctCount;
        incorrectChars = incorrectCount;
        totalTyped = inputText.length;
    }
    
    function updateStats() {
        if (totalTyped === 0) return;
        
        // Calculate elapsed time in minutes
        const elapsedTime = (60 - timeLeft) / 60;
        
        // Calculate WPM (5 characters = 1 word)
        const wpm = Math.round((correctChars / 5) / elapsedTime);
        wpmDisplay.textContent = wpm;
        
        // Calculate accuracy
        const accuracy = Math.round((correctChars / totalTyped) * 100);
        accuracyDisplay.textContent = `${accuracy}%`;
        
        // Update characters display
        charsDisplay.textContent = `${totalTyped}/${testText.length}`;
    }
    
    function endTest() {
        clearInterval(timer);
        isTestRunning = false;
        endTime = new Date();
        
        // Calculate final stats
        const totalTime = (endTime - startTime) / 1000; // in seconds
        const minutes = totalTime / 60;
        const finalWPMVal = Math.round((correctChars / 5) / minutes);
        const finalAccuracyVal = Math.round((correctChars / totalTyped) * 100);
        
        // Display final stats
        finalWPM.textContent = finalWPMVal;
        finalAccuracy.textContent = `${finalAccuracyVal}%`;
        
        // Format time
        const mins = Math.floor(totalTime / 60);
        const secs = Math.floor(totalTime % 60);
        finalTime.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        
        // Show results
        typingContainer.classList.add('hidden');
        resultsContainer.classList.remove('hidden');
        resultsContent.classList.add('active');
        resultsPlaceholder.classList.add('hidden');
        
        // Create chart
        createChart();
        
        // Play completion sound if enabled
        if (soundEnabled) {
            completeSound.play().catch(e => console.log("Sound playback prevented:", e));
        }
        
        // Show confetti
        showConfetti();
        
        // Show results section
        showSection('results');
    }
    
    function createChart() {
        const ctx = document.getElementById('speedChart').getContext('2d');
        
        // Fill WPM history if empty (for short tests)
        if (wpmHistory.length === 0 && totalTyped > 0) {
            const finalWPM = parseInt(wpmDisplay.textContent);
            wpmHistory = Array(12).fill(0).map((_, i) => Math.round(finalWPM * (i + 1) / 12));
        }
        
        // Add final WPM if not already included
        const finalWPMVal = parseInt(finalWPM.textContent);
        if (wpmHistory.length === 0 || wpmHistory[wpmHistory.length - 1] !== finalWPMVal) {
            wpmHistory.push(finalWPMVal);
        }
        
        const labels = wpmHistory.map((_, i) => `${i + 1}`);
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Words Per Minute',
                    data: wpmHistory,
                    borderColor: 'rgba(74, 107, 255, 1)',
                    backgroundColor: 'rgba(74, 107, 255, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `WPM: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Words Per Minute'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Time Intervals'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                }
            }
        });
    }
    
    function showConfetti() {
        confettiContainer.classList.remove('hidden');
        confettiContainer.innerHTML = '';
        
        // Create confetti elements
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = getRandomColor();
            confetti.style.animationDelay = `${Math.random() * 3}s`;
            confettiContainer.appendChild(confetti);
        }
        
        // Remove confetti after animation
        setTimeout(() => {
            confettiContainer.classList.add('hidden');
        }, 5000);
    }
    
    function getRandomColor() {
        const colors = ['#4a6bff', '#ff6b6b', '#4ecdc4', '#f7fff7', '#ffd166'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    function restartCurrentTest() {
        if (testText) {
            startTest(timeLeft, testText);
        }
    }
    
    function printCertificate() {
        const wpm = finalWPM.textContent;
        const accuracy = finalAccuracy.textContent;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Typing Certificate</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 40px; }
                    .certificate { border: 20px solid #4a6bff; padding: 40px; max-width: 800px; margin: 0 auto; }
                    h1 { color: #4a6bff; font-size: 36px; }
                    .stats { display: flex; justify-content: center; gap: 40px; margin: 30px 0; }
                    .stat { font-size: 24px; }
                    .date { margin-top: 40px; }
                </style>
            </head>
            <body>
                <div class="certificate">
                    <h1>Typing Achievement Certificate</h1>
                    <p>This certifies that you have completed the typing test with the following results:</p>
                    <div class="stats">
                        <div class="stat">
                            <div>Speed</div>
                            <div><strong>${wpm} WPM</strong></div>
                        </div>
                        <div class="stat">
                            <div>Accuracy</div>
                            <div><strong>${accuracy}</strong></div>
                        </div>
                    </div>
                    <div class="date">
                        ${new Date().toLocaleDateString()}
                    </div>
                </div>
                <script>
                    setTimeout(() => { window.print(); window.close(); }, 200);
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }
    
    function updateEstimatedTime() {
        const text = customText.value.trim();
        if (text.length === 0) {
            estimatedTime.textContent = 'Estimated time: --';
            return;
        }
        
        // Estimate 40 WPM (200 characters per minute)
        const estimatedMinutes = Math.ceil(text.length / 200);
        estimatedTime.textContent = `Estimated time: ${estimatedMinutes} min`;
    }
    
    function toggleSound() {
        soundEnabled = !soundEnabled;
        localStorage.setItem('soundEnabled', soundEnabled);
        updateSoundButton();
    }
    
    function updateSoundButton() {
        const icon = soundToggle.querySelector('i');
        if (soundEnabled) {
            icon.classList.remove('fa-volume-mute');
            icon.classList.add('fa-volume-up');
            soundToggle.title = "Sound On";
        } else {
            icon.classList.remove('fa-volume-up');
            icon.classList.add('fa-volume-mute');
            soundToggle.title = "Sound Off";
        }
    }
    
    function toggleTheme() {
        darkMode = !darkMode;
        localStorage.setItem('darkMode', darkMode);
        updateTheme();
    }
    
    function updateTheme() {
        if (darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.querySelector('i').classList.remove('fa-moon');
            themeToggle.querySelector('i').classList.add('fa-sun');
            themeToggle.title = "Light Mode";
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeToggle.querySelector('i').classList.remove('fa-sun');
            themeToggle.querySelector('i').classList.add('fa-moon');
            themeToggle.title = "Dark Mode";
        }
    }
    
    function toggleBlueLightFilter() {
        blueLightFilterEnabled = !blueLightFilterEnabled;
        localStorage.setItem('blueLightFilterEnabled', blueLightFilterEnabled);
        updateBlueLightFilter();
    }
    
    function updateBlueLightFilter() {
        if (blueLightFilterEnabled) {
            blueLightFilter.classList.add('active');
            blueLightToggle.querySelector('i').style.color = 'orange';
            blueLightToggle.title = "Blue Light Filter On";
        } else {
            blueLightFilter.classList.remove('active');
            blueLightToggle.querySelector('i').style.color = '';
            blueLightToggle.title = "Blue Light Filter Off";
        }
    }
});