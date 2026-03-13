// Noor — Islamic Faith Companion
// Chat application JavaScript

const chatMessages = document.getElementById('chatMessages');
const messagesContainer = document.getElementById('messagesContainer');
const welcomeScreen = document.getElementById('welcomeScreen');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const newChatBtn = document.getElementById('newChatBtn');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');

let conversationHistory = [];
let isStreaming = false;

// ============================================================
// Sidebar / mobile menu
// ============================================================
const overlay = document.createElement('div');
overlay.className = 'sidebar-overlay';
document.body.appendChild(overlay);

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
});

overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
});

// ============================================================
// Textarea auto-resize
// ============================================================
userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 160) + 'px';
    sendBtn.disabled = userInput.value.trim() === '' || isStreaming;
});

userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!sendBtn.disabled) sendMessage();
    }
});

// ============================================================
// Suggested questions
// ============================================================
document.querySelectorAll('.suggestion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        userInput.value = btn.dataset.question;
        userInput.dispatchEvent(new Event('input'));
        sendMessage();
    });
});

// ============================================================
// New chat
// ============================================================
newChatBtn.addEventListener('click', () => {
    conversationHistory = [];
    messagesContainer.innerHTML = '';
    welcomeScreen.style.display = '';
    userInput.value = '';
    userInput.style.height = 'auto';
    sendBtn.disabled = true;
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
});

// ============================================================
// Send button
// ============================================================
sendBtn.addEventListener('click', sendMessage);

// ============================================================
// Core message function
// ============================================================
async function sendMessage() {
    const text = userInput.value.trim();
    if (!text || isStreaming) return;

    // Hide welcome screen on first message
    if (welcomeScreen.style.display !== 'none') {
        welcomeScreen.style.display = 'none';
    }

    // Clear input
    userInput.value = '';
    userInput.style.height = 'auto';
    sendBtn.disabled = true;

    // Add user message to history and UI
    conversationHistory.push({ role: 'user', content: text });
    appendUserMessage(text);
    scrollToBottom();

    // Show loading indicator
    const loadingEl = appendLoadingMessage();
    isStreaming = true;

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: conversationHistory }),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        // Stream the response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantText = '';
        let assistantBubble = null;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                const data = line.slice(6);
                if (data === '[DONE]') break;

                try {
                    const parsed = JSON.parse(data);
                    if (parsed.text) {
                        // Remove loading indicator on first token
                        if (assistantBubble === null) {
                            loadingEl.remove();
                            assistantBubble = appendAssistantMessage('');
                        }
                        assistantText += parsed.text;
                        renderMessage(assistantBubble, assistantText);
                        scrollToBottom();
                    }
                } catch {
                    // Ignore malformed chunks
                }
            }
        }

        // Add complete response to history
        if (assistantText) {
            conversationHistory.push({ role: 'assistant', content: assistantText });
        }

    } catch (err) {
        loadingEl.remove();
        appendErrorMessage('Something went wrong. Please try again.');
        console.error('Chat error:', err);
    } finally {
        isStreaming = false;
        sendBtn.disabled = userInput.value.trim() === '';
        userInput.focus();
    }
}

// ============================================================
// DOM helpers
// ============================================================

function appendUserMessage(text) {
    const time = formatTime(new Date());
    const div = document.createElement('div');
    div.className = 'message user';
    div.innerHTML = `
        <div class="message-avatar">You</div>
        <div class="message-body">
            <div class="message-bubble">${escapeHtml(text)}</div>
            <div class="message-timestamp">${time}</div>
        </div>
    `;
    messagesContainer.appendChild(div);
    return div;
}

function appendAssistantMessage(text) {
    const time = formatTime(new Date());
    const div = document.createElement('div');
    div.className = 'message assistant';
    div.innerHTML = `
        <div class="message-avatar">ن</div>
        <div class="message-body">
            <div class="message-bubble"></div>
            <div class="message-timestamp">${time}</div>
        </div>
    `;
    messagesContainer.appendChild(div);
    return div;
}

function renderMessage(messageEl, rawText) {
    const bubble = messageEl.querySelector('.message-bubble');
    bubble.innerHTML = formatMarkdown(rawText);
}

function appendLoadingMessage() {
    const div = document.createElement('div');
    div.className = 'message assistant';
    div.innerHTML = `
        <div class="message-avatar">ن</div>
        <div class="message-body">
            <div class="message-bubble">
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            </div>
        </div>
    `;
    messagesContainer.appendChild(div);
    return div;
}

function appendErrorMessage(text) {
    const div = document.createElement('div');
    div.className = 'message assistant';
    div.innerHTML = `
        <div class="message-avatar" style="background:#7a3a3a">!</div>
        <div class="message-body">
            <div class="message-bubble" style="border-color: #7a3a3a; color: #ff9999;">
                ${escapeHtml(text)}
            </div>
        </div>
    `;
    messagesContainer.appendChild(div);
}

// ============================================================
// Markdown renderer (lightweight, no external deps)
// ============================================================
function formatMarkdown(text) {
    // Escape HTML first (except we'll add back our own tags)
    let html = escapeHtml(text);

    // Bold: **text** or __text__
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // Italic: *text* or _text_ (not inside words)
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr>');

    // Blockquote
    html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

    // Headers (h3, h2, h1)
    html = html.replace(/^### (.+)$/gm, '<h3 style="font-size:0.95rem;font-weight:600;color:var(--accent-gold-light);margin:10px 0 6px">$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 style="font-size:1.05rem;font-weight:600;color:var(--accent-gold-light);margin:12px 0 6px">$1</h2>');

    // Bullet lists
    html = html.replace(/^\* (.+)$/gm, '<li>$1</li>');
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

    // Wrap consecutive <li> in <ul>
    html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul style="margin:8px 0;padding-left:20px;display:flex;flex-direction:column;gap:4px">${match}</ul>`);

    // Newlines to <br> (but not inside block elements)
    html = html.replace(/\n{2,}/g, '</p><p style="margin:8px 0">');
    html = html.replace(/\n/g, '<br>');

    // Wrap in paragraph
    html = `<p style="margin:0">${html}</p>`;

    // Style the source section specifically
    html = html.replace(
        /(&lt;!--.*?--&gt;)?(<p[^>]*>)?<strong>Source:<\/strong>(.*?)(<\/p>)?/g,
        (match, comment, pOpen, content, pClose) =>
            `<div class="source-section"><div class="source-label">Source</div><strong>${content}</strong></div>`
    );

    return html;
}

// ============================================================
// Utilities
// ============================================================
function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
