  const burger = document.getElementById('burgerBtn');
  const menu = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.1});
  revealEls.forEach(el => io.observe(el));

  const tabs = document.querySelectorAll('.tab');
  const cards = document.querySelectorAll('#projGrid > *');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const f = tab.dataset.filter;
      cards.forEach(card => {
        card.style.display = (f === 'all' || card.dataset.cat === f) ? 'flex' : 'none';
      });
    });
  });

  document.querySelectorAll('.contact-item').forEach(item => {
    item.addEventListener('click', async () => {
      const text = item.dataset.copy;
      try{
        await navigator.clipboard.writeText(text);
        item.classList.add('copied');
        const hint = item.querySelector('.copy-hint');
        const original = hint.textContent;
        hint.textContent = 'copied';
        setTimeout(() => { hint.textContent = original; item.classList.remove('copied'); }, 1600);
      }catch(e){}
    });
  });

  const posWords = ['good','great','works','reliable','reliably','love','excellent','improved','clear','finally','success','trust','strong','honest','clean','accurate','robust','validated','transparent'];
  const negWords = ['broken','bad','fail','bug','leak','wrong','silently','dropping','error','flawed','biased','mislead','worst','overfit','crash','stale','corrupted'];
  function escapeHtml(str){
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  function classify(text){
    const t = text.toLowerCase();
    let matches = [];
    posWords.forEach(w => { if(t.includes(w)) matches.push({word:w, type:'pos'}); });
    negWords.forEach(w => { if(t.includes(w)) matches.push({word:w, type:'neg'}); });
    const posCount = matches.filter(m => m.type === 'pos').length;
    const negCount = matches.filter(m => m.type === 'neg').length;
    let cls = 'neu';
    if(posCount > negCount) cls = 'pos';
    else if(negCount > posCount) cls = 'neg';
    return { cls, matches, posCount, negCount };
  }
  function highlightText(text, matches){
    let escaped = escapeHtml(text);
    matches.forEach(m => {
      const safe = m.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp('(' + safe + '\\w*)', 'gi');
      escaped = escaped.replace(re, '<mark class="hl-' + m.type + '">$1</mark>');
    });
    return escaped;
  }
  function runDemo(text){
    const result = document.getElementById('demoResult');
    if(!text.trim()){ result.innerHTML = ''; return; }
    const { cls, matches, posCount, negCount } = classify(text);
    const map = { pos: ['badge-pos','Positive'], neg: ['badge-neg','Negative'], neu: ['badge-neu','Neutral'] };
    const [badgeClass, label] = map[cls];
    const highlighted = highlightText(text, matches);
    result.innerHTML =
      '<div class="demo-verdict"><span class="badge ' + badgeClass + '">' + label + '</span>' +
      '<span class="demo-signal-count">' + posCount + ' positive signal' + (posCount===1?'':'s') + ', ' + negCount + ' negative signal' + (negCount===1?'':'s') + '</span></div>' +
      '<p class="demo-highlighted">' + highlighted + '</p>' +
      '<span class="demo-note">keyword heuristic demo, highlighted words are what drove this label, full model lives in the repo</span>';
  }
  document.getElementById('demoBtn').addEventListener('click', () => runDemo(document.getElementById('demoInput').value));
  document.getElementById('demoInput').addEventListener('keydown', (e) => { if(e.key === 'Enter') runDemo(e.target.value); });
  document.querySelectorAll('.demo-examples button').forEach(b => {
    b.addEventListener('click', () => { document.getElementById('demoInput').value = b.dataset.ex; runDemo(b.dataset.ex); });
  });

document.querySelectorAll('.case-toggle').forEach(btn => {
  const label = btn.textContent.replace('View ', '').replace(' \u2193', '').trim();
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    if (target.hasAttribute('hidden')) {
      target.removeAttribute('hidden');
      btn.textContent = 'Close ' + label + ' \u2191';
    } else {
      target.setAttribute('hidden', '');
      btn.textContent = 'View ' + label + ' \u2193';
    }
  });
});





document.querySelectorAll('.nav-cta[data-copy]').forEach(btn => {
  btn.addEventListener('click', async () => {
    const text = btn.dataset.copy;
    const original = btn.textContent;
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = original; }, 1600);
    } catch (e) {}
  });
});
