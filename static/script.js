// Pregnancy Risk Predictor
const pregnancyForm = document.getElementById("pregnancyForm");
const riskResult = document.getElementById("riskResult");

pregnancyForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const age = parseInt(document.getElementById("age").value);
  const bmi = parseFloat(document.getElementById("bmi").value);
  const pregCount = parseInt(document.getElementById("pregCount").value);
  const smoking = document.getElementById("smoking").value;

  let riskScore = 0;
  if (age < 18 || age > 35) riskScore++;
  if (bmi < 18.5 || bmi > 30) riskScore++;
  if (pregCount >= 3) riskScore++;
  if (smoking === "yes") riskScore++;

  let riskLevel;
  if (riskScore >= 3) {
    riskLevel = "⚠️ High Pregnancy Risk. Please consult a doctor.";
  } else if (riskScore === 2) {
    riskLevel = "⚠️ Moderate Risk. Monitor health closely.";
  } else {
    riskLevel = "✅ Low Risk. Keep following healthy habits.";
  }

  riskResult.textContent = riskLevel;
  riskResult.style.fontWeight = "bold";
});

// Menstrual Cycle Phase Tracker
const calculateBtn = document.getElementById('calculateCycleBtn');
const lastPeriodDateInput = document.getElementById('lastPeriodDate');
const cycleLengthInput = document.getElementById('cycleLength');
const cycleInfoDiv = document.getElementById('cycleInfo');

calculateBtn.addEventListener('click', () => {
  const lastPeriodDate = new Date(lastPeriodDateInput.value);
  const cycleLength = parseInt(cycleLengthInput.value);

  if (isNaN(lastPeriodDate.getTime()) || isNaN(cycleLength)) {
    cycleInfoDiv.textContent = "Please enter valid date and cycle length.";
    return;
  }

  const nextPeriod = new Date(lastPeriodDate);
  nextPeriod.setDate(nextPeriod.getDate() + cycleLength);

  const ovulation = new Date(lastPeriodDate);
  ovulation.setDate(ovulation.getDate() + (cycleLength - 14)); // approx

  const fertileStart = new Date(ovulation);
  fertileStart.setDate(fertileStart.getDate() - 4);

  const fertileEnd = new Date(ovulation);
  fertileEnd.setDate(fertileEnd.getDate() + 1);

  cycleInfoDiv.innerHTML = `
    📅 <strong>Next Period:</strong> ${nextPeriod.toDateString()}<br/>
    🟢 <strong>Fertile Window:</strong> ${fertileStart.toDateString()} – ${fertileEnd.toDateString()}<br/>
    💧 <strong>Ovulation Day:</strong> ${ovulation.toDateString()}
  `;
});

// Chatbot functionality
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

function appendMessage(text, sender = 'bot') {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}`;
  msgDiv.textContent = text;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message bot typing';
  typingDiv.id = 'typing';
  typingDiv.textContent = 'AI is typing...';
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  const typingDiv = document.getElementById('typing');
  if (typingDiv) typingDiv.remove();
}

async function sendMessageToBot(message) {
  showTyping();

  try {
    const response = await fetch("/chat", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    removeTyping();

    if (!response.ok) {
      appendMessage("⚠️ Error: AI server failed to respond.", 'bot');
      return;
    }

    const data = await response.json();
    appendMessage("AI: " + data.reply, 'bot');

  } catch (error) {
    console.error("Error:", error);
    removeTyping();
    appendMessage("⚠️ Connection error. Try again.", 'bot');
  }
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const userText = chatInput.value.trim();
  if (!userText) return;

  appendMessage("You: " + userText, 'user');
  chatInput.value = '';

  await sendMessageToBot(userText);
});
