const state = {
  selectedDans: new Set([2, 3, 4, 5]),
  mode: 10,
  total: 0,
  correct: 0,
  wrong: 0,
  currentA: 0,
  currentB: 0,
  answered: false,
};

const danContainer = document.getElementById('dan-buttons');
for (let i = 2; i <= 9; i++) {
  const btn = document.createElement('button');
  btn.className = 'dan-btn' + (state.selectedDans.has(i) ? ' active' : '');
  btn.textContent = i;
  btn.dataset.dan = i;
  btn.addEventListener('click', () => toggleDan(i, btn));
  danContainer.appendChild(btn);
}

function toggleDan(n, btn) {
  if (state.selectedDans.has(n)) {
    if (state.selectedDans.size === 1) return;
    state.selectedDans.delete(n);
    btn.classList.remove('active');
  } else {
    state.selectedDans.add(n);
    btn.classList.add('active');
  }
  resetStats();
  nextQuestion();
}

document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.mode = parseInt(btn.dataset.mode);
    document.getElementById('progress-wrap').style.display = state.mode > 0 ? 'block' : 'none';
    resetStats();
    nextQuestion();
  });
});

function resetStats() {
  state.total = 0;
  state.correct = 0;
  state.wrong = 0;
  updateStats();
  document.getElementById('progress-bar').style.width = '0%';
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'feedback';
}

function nextQuestion() {
  state.answered = false;
  const dans = [...state.selectedDans];
  state.currentA = dans[Math.floor(Math.random() * dans.length)];
  state.currentB = Math.floor(Math.random() * 9) + 1;

  document.getElementById('q-a').textContent = state.currentA;
  document.getElementById('q-b').textContent = state.currentB;
  document.getElementById('q-ans').textContent = '?';

  const input = document.getElementById('answer-input');
  input.value = '';
  input.className = '';
  input.focus();
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = 'feedback';
}

function updateStats() {
  document.getElementById('correct-count').textContent = state.correct;
  document.getElementById('wrong-count').textContent = state.wrong;
  const pct = state.total === 0 ? '-' : Math.round(state.correct / state.total * 100) + '%';
  document.getElementById('score-pct').textContent = pct;
}

function showResult() {
  const pct = state.total === 0 ? 0 : Math.round(state.correct / state.total * 100);
  const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '😊' : '💪';
  const title = pct >= 90 ? '완벽해요!' : pct >= 70 ? '잘했어요!' : pct >= 50 ? '괜찮아요!' : '더 연습해요!';

  document.getElementById('result-emoji').textContent = emoji;
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-score').textContent =
    `${state.total}문제 중 ${state.correct}개 정답 (${pct}%)`;

  document.getElementById('quiz-screen').style.display = 'none';
  document.getElementById('result-screen').style.display = 'block';
}

function submitAnswer() {
  if (state.answered) { nextQuestion(); return; }

  const input = document.getElementById('answer-input');
  const val = parseInt(input.value);
  if (isNaN(val)) { input.focus(); return; }

  const correct = state.currentA * state.currentB;
  const fb = document.getElementById('feedback');
  state.total++;
  state.answered = true;

  document.getElementById('q-ans').textContent = correct;

  if (val === correct) {
    state.correct++;
    input.className = 'correct';
    fb.textContent = '✅ 정답!';
    fb.className = 'feedback correct';
  } else {
    state.wrong++;
    input.className = 'wrong';
    fb.textContent = `❌ 틀렸어요! 정답은 ${correct}`;
    fb.className = 'feedback wrong';
  }

  updateStats();

  if (state.mode > 0) {
    document.getElementById('progress-bar').style.width =
      (state.total / state.mode * 100) + '%';
    if (state.total >= state.mode) {
      setTimeout(showResult, 900);
      return;
    }
  }

  setTimeout(nextQuestion, 900);
}

document.getElementById('submit-btn').addEventListener('click', submitAnswer);
document.getElementById('answer-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') submitAnswer();
});

document.getElementById('restart-btn').addEventListener('click', () => {
  document.getElementById('result-screen').style.display = 'none';
  document.getElementById('quiz-screen').style.display = 'block';
  resetStats();
  nextQuestion();
});

document.getElementById('progress-wrap').style.display = state.mode > 0 ? 'block' : 'none';
nextQuestion();
