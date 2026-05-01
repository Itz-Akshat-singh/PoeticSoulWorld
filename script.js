const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRFlLwYKhgpIqAemxfviSv17fJD1LrY2aEp-sgCo7qaEKb7HzM6ZYs5rx8G8sVR28cZU38EO3gcKUyM/pub?gid=0&single=true&output=csv&t=' + new Date().getTime();

// CSV Parser jo multi-line shayri ko handle karega
function parseCSV(text) {
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"' && inQuotes && nextChar === '"') {
            currentField += '"';
            i++;
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            currentRow.push(currentField);
            currentField = '';
        } else if ((char === '\r' || char === '\n') && !inQuotes) {
            if (currentField || currentRow.length > 0) {
                currentRow.push(currentField);
                rows.push(currentRow);
                currentField = '';
                currentRow = [];
            }
        } else {
            currentField += char;
        }
    }
    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField);
        rows.push(currentRow);
    }
    return rows;
}

async function buildFeed() {
    try {
        const response = await fetch(sheetURL, { cache: "no-cache" });
        const csvRaw = await response.text();
        
        const data = parseCSV(csvRaw);
        const feed = document.getElementById('shayri-feed');
        
        if (!feed) return;
        feed.innerHTML = ''; 

        if (data.length <= 1) {
            feed.innerHTML = '<p class="meta-data">NO DATA TRANSMITTED YET...</p>';
            return;
        }

        // Data processing
        data.slice(1).reverse().forEach(cols => {
            if (cols.length >= 1) {
                let shayriText = cols[0].trim();
                let dateValue = cols[1] ? cols[1].trim() : "";

                if (shayriText.length > 2 && !shayriText.includes("_bootstrap")) {
                    // Quotes hatana aur New Lines ko <br> mein badalna
                    const cleanText = shayriText.replace(/^"|"$/g, '');
                    const formattedText = cleanText.replace(/\n/g, '<br>');

                    const card = document.createElement('div');
                    card.className = 'intel-card';
                    card.innerHTML = `
                        <p class="shayri-content">${formattedText}</p>
                        <div class="meta-data">${formatDate(dateValue)}</div>
                    `;
                    feed.appendChild(card);
                }
            }
        });

        setupScrollAnimation();
    } catch (err) {
        console.error("Transmission Error:", err);
    }
}

function formatDate(dStr) {
    const d = new Date(dStr);
    return isNaN(d) ? "RECENT_LOG" : d.toLocaleDateString('en-GB', {day:'2-digit', month:'short'}).toUpperCase();
}

function setupScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.intel-card').forEach(c => {
        c.style.opacity = "0";
        c.style.transform = "translateY(20px)";
        c.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
        observer.observe(c);
    });
}

// Contact Logic
const trigger = document.getElementById('contact-trigger');
if(trigger) {
    trigger.onclick = (e) => {
        if(!['INPUT','TEXTAREA','BUTTON'].includes(e.target.tagName)) {
            document.getElementById('contact-text').style.display='none';
            document.getElementById('contact-form-container').style.display='block';
        }
    };
}

async function transmitData() {
    const status = document.getElementById('transmitting-status');
    const container = document.getElementById('contact-form-container');
    if(!container || !status) return;
    
    container.style.display = 'none';
    status.style.display = 'block';
    
    setTimeout(() => {
        status.innerText = "TRANSMISSION SUCCESSFUL";
        setTimeout(() => location.reload(), 2000);
    }, 2000);
}

document.addEventListener('DOMContentLoaded', buildFeed);
document.getElementById('shayri-feed').innerHTML = '<div class="intel-card">System Test: Data Node Active</div>';
function setupScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.intel-card').forEach(c => {
        observer.observe(c);
    });
}
// BuildFeed ke andar:
const cleanText = shayriText.replace(/^"|"$/g, '');
const formattedText = cleanText.replace(/\n/g, '<br>');

// Automatic Social Redirection
const finalDisplay = formattedText.replace(/@poeticsoulworld/g, 
    `<a href="https://www.instagram.com/poeticsoulworld/" target="_blank" style="color:var(--neon-green); text-decoration:none; font-weight:bold;">@poeticsoulworld</a>`
);

card.innerHTML = `
    <p class="shayri-content">${finalDisplay}</p>
    <div class="meta-data">${formatDate(dateValue)}</div>
`;
