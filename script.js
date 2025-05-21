document.addEventListener('DOMContentLoaded', function() {
    // Morse code dictionary
    const morseCode = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..',
        '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
        '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
        ',': '--..--', '.': '.-.-.-', '?': '..--..', '/': '-..-.', '-': '-....-',
        '(': '-.--.', ')': '-.--.-', ' ': '/'
    };

    // Reverse dictionary for decoding
    const reverseMorse = {};
    for (const key in morseCode) {
        reverseMorse[morseCode[key]] = key;
    }

    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Text to Morse conversion
    document.getElementById('convert-to-morse').addEventListener('click', function() {
        const textInput = document.getElementById('text-input').value.toUpperCase();
        let morseOutput = '';
        
        for (let char of textInput) {
            if (morseCode[char]) {
                morseOutput += morseCode[char] + ' ';
            }
        }
        
        document.getElementById('morse-output').value = morseOutput.trim();
    });

    // Morse to Text conversion
    document.getElementById('convert-to-text').addEventListener('click', function() {
        const morseInput = document.getElementById('morse-input').value.trim();
        const morseWords = morseInput.split(' / ');
        let textOutput = '';
        
        for (let word of morseWords) {
            const morseChars = word.split(' ');
            for (let code of morseChars) {
                if (reverseMorse[code]) {
                    textOutput += reverseMorse[code];
                }
            }
            textOutput += ' ';
        }
        
        document.getElementById('text-output').value = textOutput.trim();
    });

    // Play Morse code sound
    document.getElementById('play-morse').addEventListener('click', function() {
        const morseOutput = document.getElementById('morse-output').value;
        playMorseSound(morseOutput);
    });

    function playMorseSound(morseCode) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        const dot = 1.2 / 15;
        
        let time = audioCtx.currentTime;
        
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = 600;
        
        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0, time);
        
        for (let i = 0; i < morseCode.length; i++) {
            const code = morseCode[i];
            if (code === '.') {
                gainNode.gain.setValueAtTime(1, time);
                time += dot;
                gainNode.gain.setValueAtTime(0, time);
                time += dot;
            } else if (code === '-') {
                gainNode.gain.setValueAtTime(1, time);
                time += 3 * dot;
                gainNode.gain.setValueAtTime(0, time);
                time += dot;
            } else if (code === ' ') {
                time += 2 * dot;
            } else if (code === '/') {
                time += 4 * dot;
            }
        }
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(time);
    }

    // Copy buttons functionality
    document.getElementById('copy-morse').addEventListener('click', function() {
        copyToClipboard('morse-output');
    });

    document.getElementById('copy-text').addEventListener('click', function() {
        copyToClipboard('text-output');
    });

    document.getElementById('copy-encrypted').addEventListener('click', function() {
        copyToClipboard('encrypted-output');
    });

    document.getElementById('copy-decrypted').addEventListener('click', function() {
        copyToClipboard('decrypted-output');
    });

    function copyToClipboard(elementId) {
        const element = document.getElementById(elementId);
        element.select();
        document.execCommand('copy');
        
        // Show feedback
        const originalText = element.placeholder;
        element.placeholder = 'Copied to clipboard!';
        setTimeout(() => {
            element.placeholder = originalText;
        }, 2000);
    }

    // Encryption functions
    document.getElementById('encrypt-btn').addEventListener('click', function() {
        const plainText = document.getElementById('plain-text').value;
        const key = document.getElementById('encryption-key').value;
        
        if (!key) {
            alert('Please enter an encryption key');
            return;
        }
        
        // Simple XOR encryption (for demonstration)
        const encryptedText = xorEncrypt(plainText, key);
        
        // Convert encrypted text to Morse
        let morseOutput = '';
        for (let char of encryptedText.toUpperCase()) {
            if (morseCode[char]) {
                morseOutput += morseCode[char] + ' ';
            }
        }
        
        document.getElementById('encrypted-output').value = morseOutput.trim();
    });

    document.getElementById('decrypt-btn').addEventListener('click', function() {
        const encryptedMorse = document.getElementById('encrypted-morse').value.trim();
        const key = document.getElementById('decryption-key').value;
        
        if (!key) {
            alert('Please enter a decryption key');
            return;
        }
        
        // Convert Morse to text first
        const morseWords = encryptedMorse.split(' / ');
        let encryptedText = '';
        
        for (let word of morseWords) {
            const morseChars = word.split(' ');
            for (let code of morseChars) {
                if (reverseMorse[code]) {
                    encryptedText += reverseMorse[code];
                }
            }
            encryptedText += ' ';
        }
        
        // Decrypt the text
        const decryptedText = xorDecrypt(encryptedText.trim(), key);
        document.getElementById('decrypted-output').value = decryptedText;
    });

    // Simple XOR encryption/decryption (not secure for real use)
    function xorEncrypt(text, key) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            result += String.fromCharCode(charCode);
        }
        return result;
    }

    function xorDecrypt(text, key) {
        return xorEncrypt(text, key); // XOR encryption is symmetric
    }

    // Generate Morse code chart
    function generateMorseChart() {
        const chartContainer = document.getElementById('morse-chart');
        
        // Sort characters alphabetically
        const sortedChars = Object.keys(morseCode).sort();
        
        sortedChars.forEach(char => {
            const chartItem = document.createElement('div');
            chartItem.className = 'chart-item';
            
            const chartChar = document.createElement('div');
            chartChar.className = 'chart-char';
            chartChar.textContent = char;
            
            const chartCode = document.createElement('div');
            chartCode.className = 'chart-code';
            chartCode.textContent = morseCode[char];
            
            chartItem.appendChild(chartChar);
            chartItem.appendChild(chartCode);
            chartContainer.appendChild(chartItem);
        });
    }
    
    generateMorseChart();

    // Scroll animations
    function checkVisibility() {
        const sections = document.querySelectorAll('.converter-section, .info-section, .morse-chart, .footer');
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight - 100) {
                section.classList.add('visible');
            }
        });
    }
    
    // Initial check
    checkVisibility();
    
    // Check on scroll
    window.addEventListener('scroll', checkVisibility);
    
    // Header animation
    const title = document.querySelector('.title');
    const subtitle = document.querySelector('.subtitle');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    title.style.animationDelay = '0.2s';
    subtitle.style.animationDelay = '0.4s';
    scrollIndicator.style.animationDelay = '0.8s';
});