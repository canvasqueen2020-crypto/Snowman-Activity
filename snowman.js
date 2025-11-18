
const defaultConfig = {
  activity_title: "Dress Up Your Snowman!",
  instruction_text: "Click on items to dress your snowman",
  primary_color: "#4A90E2",
  background_color: "#87CEEB",
  text_color: "#FFFFFF",
  surface_color: "#F0F8FF",
  accent_color: "#E3F2FD"
};

let currentSelections = {
  face: 'happy',
  hat: 'none',
  scarf: 'none',
  buttons: 'none',
  arms: 'none',
  background: 'frozen-lake'
};

async function onConfigChange(config) {
  const titleElement = document.getElementById('activity-title');
  const instructionElement = document.getElementById('instruction-text');
  
  titleElement.textContent = config.activity_title || defaultConfig.activity_title;
  instructionElement.textContent = config.instruction_text || defaultConfig.instruction_text;

  const primaryColor = config.primary_color || defaultConfig.primary_color;
  const backgroundColor = config.background_color || defaultConfig.background_color;
  const textColor = config.text_color || defaultConfig.text_color;
  const surfaceColor = config.surface_color || defaultConfig.surface_color;
  const accentColor = config.accent_color || defaultConfig.accent_color;

  titleElement.style.color = textColor;
  instructionElement.style.color = textColor;

  const categoryTitles = document.querySelectorAll('.category-title');
  categoryTitles.forEach(title => {
    title.style.color = primaryColor;
    title.style.borderBottomColor = backgroundColor;
  });

  const optionBtns = document.querySelectorAll('.option-btn, .bg-option');
  optionBtns.forEach(btn => {
    btn.style.backgroundColor = surfaceColor;
    if (btn.classList.contains('selected')) {
      btn.style.borderColor = primaryColor;
      btn.style.backgroundColor = accentColor;
    } else {
      btn.style.borderColor = 'transparent';
    }
  });

  const sidebar = document.querySelector('.sidebar');
  sidebar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
}

function selectItem(category, item) {
  currentSelections[category] = item;
  
  // Update button states
  document.querySelectorAll(`[data-category="${category}"]`).forEach(btn => {
    btn.classList.remove('selected');
    if (btn.dataset.item === item) {
      btn.classList.add('selected');
    }
  });

  // Show/hide items
  if (category === 'background') {
    document.querySelectorAll('.scene').forEach(scene => {
      scene.style.opacity = '0';
    });
    const scene = document.getElementById(item);
    if (scene) {
      scene.style.opacity = '1';
    }
  } else {
    document.querySelectorAll(`.snowman-item[id^="${category}-"]`).forEach(el => {
      el.style.display = 'none';
    });
    
    if (item !== 'none') {
      const element = document.getElementById(`${category}-${item}`);
      if (element) {
        element.style.display = 'block';
      }
    }
  }
}

// Text-to-speech functionality
let currentSpeech = null;

function speakText() {
  const titleText = document.getElementById('activity-title').textContent;
  const instructionText = document.getElementById('instruction-text').textContent;
  const speakerBtn = document.getElementById('speaker-btn');

  // Cancel any ongoing speech
  if (currentSpeech) {
    window.speechSynthesis.cancel();
    speakerBtn.classList.remove('speaking');
    currentSpeech = null;
    return;
  }

  // Create new speech
  const textToSpeak = `${titleText}. ${instructionText}`;
  currentSpeech = new SpeechSynthesisUtterance(textToSpeak);
  
  // Configure speech
  currentSpeech.rate = 0.9;
  currentSpeech.pitch = 1.1;
  currentSpeech.volume = 1;

  // Add animation while speaking
  speakerBtn.classList.add('speaking');

  // Remove animation when done
  currentSpeech.onend = () => {
    speakerBtn.classList.remove('speaking');
    currentSpeech = null;
  };

  currentSpeech.onerror = () => {
    speakerBtn.classList.remove('speaking');
    currentSpeech = null;
  };

  // Speak
  window.speechSynthesis.speak(currentSpeech);
}

// Download image functionality
async function downloadSnowmanImage() {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 900;
  const ctx = canvas.getContext('2d');
  
  // Get active background scene
  const activeScene = document.querySelector('.scene[style*="opacity: 1"]') || document.getElementById('frozen-lake');
  const bgId = activeScene ? activeScene.id : 'frozen-lake';
  
  // Draw background based on scene
  const bgGradients = {
    'frozen-lake': ['#87CEEB', '#E0F6FF', '#B0E0E6'],
    'log-cabin': ['#4A90E2', '#87CEEB', '#FFFFFF'],
    'pine-forest': ['#2C5F7C', '#5A9FB5', '#FFFFFF'],
    'sunny-beach': ['#FFD700', '#87CEEB', '#F4A460'],
    'starry-night': ['#000428', '#004e92'],
    'school': ['#87CEEB', '#B0E0E6']
  };
  
  const colors = bgGradients[bgId] || ['#87CEEB', '#E0F6FF'];
  const gradient = ctx.createLinearGradient(0, 0, 0, 900);
  colors.forEach((color, i) => {
    gradient.addColorStop(i / (colors.length - 1), color);
  });
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 900);
  
  // Draw ground
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(0, 600);
  ctx.quadraticCurveTo(300, 580, 600, 600);
  ctx.quadraticCurveTo(900, 620, 1200, 600);
  ctx.lineTo(1200, 900);
  ctx.lineTo(0, 900);
  ctx.closePath();
  ctx.fill();
  
  // Draw snowman body
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#E0E0E0';
  ctx.lineWidth = 2;
  
  // Bottom ball
  ctx.beginPath();
  ctx.arc(600, 670, 100, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  // Middle ball
  ctx.beginPath();
  ctx.arc(600, 520, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  // Top ball (head)
  ctx.beginPath();
  ctx.arc(600, 380, 70, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  // Draw face (always happy in download for now)
  ctx.fillStyle = '#000000';
  // Left eye
  ctx.beginPath();
  ctx.arc(575, 365, 7, 0, Math.PI * 2);
  ctx.fill();
  // Right eye
  ctx.beginPath();
  ctx.arc(625, 365, 7, 0, Math.PI * 2);
  ctx.fill();
  // Smile
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(600, 385, 25, 0.2, Math.PI - 0.2);
  ctx.stroke();
  
  // Draw selected accessories
  if (currentSelections.buttons === 'coal') {
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(600, 500, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(600, 540, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(600, 580, 10, 0, Math.PI * 2);
    ctx.fill();
  } else if (currentSelections.buttons === 'colorful') {
    ctx.beginPath();
    ctx.fillStyle = '#FF0000';
    ctx.arc(600, 500, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = '#00FF00';
    ctx.arc(600, 540, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = '#0000FF';
    ctx.arc(600, 580, 10, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Draw arms (simple stick arms if any selected)
  if (currentSelections.arms !== 'none') {
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    // Left arm
    ctx.beginPath();
    ctx.moveTo(530, 520);
    ctx.lineTo(420, 480);
    ctx.stroke();
    // Right arm
    ctx.beginPath();
    ctx.moveTo(670, 520);
    ctx.lineTo(780, 480);
    ctx.stroke();
  }
  
  // Add title
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.font = 'bold 52px Arial';
  ctx.textAlign = 'center';
  ctx.strokeText('My Snowman! ☃️', 600, 120);
  ctx.fillText('My Snowman! ☃️', 600, 120);
  
  // Download as PNG
  canvas.toBlob(function(blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-snowman.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

function initSnowmanDressUp() {
  // Event listeners for all option buttons
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectItem(btn.dataset.category, btn.dataset.item);
    });
  });

  // Background buttons
  document.querySelectorAll('.bg-option').forEach(btn => {
    btn.addEventListener('click', () => {
      selectItem('background', btn.dataset.bg);
      
      // Update background button states
      document.querySelectorAll('.bg-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // Speaker button listener
  const speakerBtn = document.getElementById('speaker-btn');
  if (speakerBtn) {
    speakerBtn.addEventListener('click', speakText);
  }

  // Download button
  const downloadBtn = document.getElementById('download-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', downloadSnowmanImage);
  }

  // Initialize Element SDK if available
  if (window.elementSdk) {
    window.elementSdk.init({
      defaultConfig,
      onConfigChange,
      mapToCapabilities: (config) => ({
        recolorables: [
          {
            get: () => config.primary_color || defaultConfig.primary_color,
            set: (value) => {
              config.primary_color = value;
              window.elementSdk.setConfig({ primary_color: value });
            }
          },
          {
            get: () => config.background_color || defaultConfig.background_color,
            set: (value) => {
              config.background_color = value;
              window.elementSdk.setConfig({ background_color: value });
            }
          },
          {
            get: () => config.text_color || defaultConfig.text_color,
            set: (value) => {
              config.text_color = value;
              window.elementSdk.setConfig({ text_color: value });
            }
          },
          {
            get: () => config.surface_color || defaultConfig.surface_color,
            set: (value) => {
              config.surface_color = value;
              window.elementSdk.setConfig({ surface_color: value });
            }
          },
          {
            get: () => config.accent_color || defaultConfig.accent_color,
            set: (value) => {
              config.accent_color = value;
              window.elementSdk.setConfig({ accent_color: value });
            }
          }
        ],
        borderables: [],
        fontEditable: undefined,
        fontSizeable: undefined
      }),
      mapToEditPanelValues: (config) => new Map([
        ["activity_title", config.activity_title || defaultConfig.activity_title],
        ["instruction_text", config.instruction_text || defaultConfig.instruction_text]
      ])
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSnowmanDressUp);
} else {
  initSnowmanDressUp();
}
