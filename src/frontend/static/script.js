const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chatMessages');

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

sendBtn.addEventListener('click', sendMessage);

function setQuery(query) {
    messageInput.value = query;
    messageInput.focus();
}

function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message) {
        return;
    }
    
    addMessage(message, 'user');
    messageInput.value = '';
    messageInput.focus();
    
    sendBtn.disabled = true;
    
    showLoadingIndicator();
    
    fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: message
        })
    })
    .then(response => response.json())
    .then(data => {
        removeLoadingIndicator();
        
        if (data.success) {
            addMessage(data.response, 'bot');
        } else {
            addMessage(`Error: ${data.error}`, 'error');
        }
        sendBtn.disabled = false;
    })
    .catch(error => {
        removeLoadingIndicator();
        addMessage(`Connection error: ${error.message}`, 'error');
        sendBtn.disabled = false;
    });
}

function addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = `message-avatar ${sender}-avatar`;
    avatar.textContent = sender === 'user' ? '👤' : (sender === 'error' ? '⚠️' : '🎓');
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (sender === 'error') {
        contentDiv.className = 'message-content error-message';
    }
    
    contentDiv.innerHTML = formatMessage(content);
    
    if (sender === 'user') {
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(avatar);
    } else {
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(contentDiv);
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatMessage(content) {
    let formatted = content;
    
    formatted = escapeHtml(formatted);
    
    formatted = formatted.replace(/\n/g, '\n');
    
    formatted = formatted.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    formatted = formatted.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    formatted = formatted.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/__(.*?)__/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    formatted = formatted.replace(/_([^_]+)_/g, '<em>$1</em>');
    
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    const lines = formatted.split('\n');
    let result = [];
    let inUL = false;
    let inOL = false;
    let inParagraph = false;
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let trimmedLine = line.trim();
        
        if (!trimmedLine) {
            if (inUL) {
                result[result.length - 1] += '</ul>';
                inUL = false;
            }
            if (inOL) {
                result[result.length - 1] += '</ol>';
                inOL = false;
            }
            if (inParagraph) {
                result[result.length - 1] += '</p>';
                inParagraph = false;
            }
            if (result.length === 0 || result[result.length - 1] !== '') {
                result.push('');
            }
            continue;
        }
        
        if (trimmedLine.match(/^<h[1-3]>/) || trimmedLine.match(/^<ul>/) || trimmedLine.match(/^<ol>/)) {
            if (inUL) {
                result[result.length - 1] += '</ul>';
                inUL = false;
            }
            if (inOL) {
                result[result.length - 1] += '</ol>';
                inOL = false;
            }
            if (inParagraph) {
                result[result.length - 1] += '</p>';
                inParagraph = false;
            }
            result.push(line);
            continue;
        }
        
        if (trimmedLine.match(/^\d+\.\s+/)) {
            if (inUL) {
                result[result.length - 1] += '</ul>';
                inUL = false;
            }
            if (inParagraph) {
                result[result.length - 1] += '</p>';
                inParagraph = false;
            }
            
            if (!inOL) {
                result.push('<ol>');
                inOL = true;
            }
            
            const itemText = trimmedLine.replace(/^\d+\.\s+/, '');
            result.push(`<li>${itemText}</li>`);
            continue;
        }
        
        if (trimmedLine.match(/^[-*]\s+/)) {
            if (inOL) {
                result[result.length - 1] += '</ol>';
                inOL = false;
            }
            if (inParagraph) {
                result[result.length - 1] += '</p>';
                inParagraph = false;
            }
            
            if (!inUL) {
                result.push('<ul>');
                inUL = true;
            }
            
            const itemText = trimmedLine.replace(/^[-*]\s+/, '');
            result.push(`<li>${itemText}</li>`);
            continue;
        }
        
        if (inUL) {
            result[result.length - 1] += '</ul>';
            inUL = false;
        }
        if (inOL) {
            result[result.length - 1] += '</ol>';
            inOL = false;
        }
        
        if (!inParagraph) {
            result.push(`<p>${trimmedLine}`);
            inParagraph = true;
        } else {
            result[result.length - 1] += ' ' + trimmedLine;
        }
    }
    
    if (inUL) {
        result[result.length - 1] += '</ul>';
    }
    if (inOL) {
        result[result.length - 1] += '</ol>';
    }
    if (inParagraph) {
        result[result.length - 1] += '</p>';
    }
    
    return result.join('');
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function showLoadingIndicator() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messageDiv.id = 'loadingIndicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar bot-avatar';
    avatar.textContent = '🎓';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'loading-indicator';
    
    contentDiv.innerHTML = `
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
    `;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeLoadingIndicator() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
}
