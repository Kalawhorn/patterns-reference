(function(){
  /* ---- syntax highlighting ---- */
  var KW = /\b(def|return|if|elif|else|for|while|in|not|and|or|None|True|False|import|from|class|lambda|break|continue|pass|is|yield|with|as|try|except|global)\b/g;
  var BUILT = /\b(len|range|enumerate|sorted|reversed|set|dict|list|tuple|str|int|max|min|sum|abs|zip|any|all|ord|chr|print|frozenset|deque|defaultdict|Counter)\b/g;

  function highlight(el){
    var raw = el.innerHTML;
    var out = '';
    var i = 0;
    while(i < raw.length){
      var rest = raw.slice(i);
      var cm = rest.match(/^#[^\n]*/);
      if(cm){ out += '<span class="c">' + cm[0] + '</span>'; i += cm[0].length; continue; }
      var sm = rest.match(/^("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')/);
      if(sm){ out += '<span class="s">' + sm[0] + '</span>'; i += sm[0].length; continue; }
      var em = rest.match(/^&[a-z]+;/);
      if(em){ out += em[0]; i += em[0].length; continue; }
      var wm = rest.match(/^[A-Za-z_][A-Za-z0-9_]*/);
      if(wm){
        var w = wm[0];
        KW.lastIndex = 0; BUILT.lastIndex = 0;
        if(new RegExp('^(' + KW.source.replace(/\\b/g,'') + ')$').test(w)) out += '<span class="k">' + w + '</span>';
        else if(new RegExp('^(' + BUILT.source.replace(/\\b/g,'') + ')$').test(w)) out += '<span class="b">' + w + '</span>';
        else out += w;
        i += w.length; continue;
      }
      var nm = rest.match(/^\d+/);
      if(nm){ out += '<span class="n">' + nm[0] + '</span>'; i += nm[0].length; continue; }
      out += raw[i]; i++;
    }
    el.innerHTML = out;
  }
  document.querySelectorAll('pre code').forEach(highlight);

  /* ---- copy buttons ---- */
  document.querySelectorAll('.copy').forEach(function(btn){
    btn.addEventListener('click', function(){
      var code = btn.closest('.code').querySelector('code');
      navigator.clipboard.writeText(code.textContent).then(function(){
        btn.textContent = 'Copied';
        btn.classList.add('done');
        setTimeout(function(){ btn.textContent = 'Copy'; btn.classList.remove('done'); }, 1400);
      });
    });
  });

  /* ---- per-day notes panel ---- */
  (function(){
    var panel = document.getElementById('notes');
    if(!panel) return;                        // only the plan page has days

    var scrim   = document.getElementById('notes-scrim'),
        dayEl   = document.getElementById('notes-day'),
        titleEl = document.getElementById('notes-title'),
        body    = document.getElementById('notes-body'),
        closeB  = document.getElementById('notes-x'),
        prevB   = document.getElementById('notes-prev'),
        nextB   = document.getElementById('notes-next'),
        buttons = Array.prototype.slice.call(document.querySelectorAll('.note-btn')),
        index   = -1;

    function show(i){
      var btn = buttons[i];
      if(!btn) return;
      var src = document.getElementById('note-' + btn.dataset.day);
      buttons.forEach(function(b){ b.classList.remove('on'); });
      btn.classList.add('on');
      dayEl.textContent   = btn.dataset.label;
      titleEl.textContent = btn.dataset.title;
      body.innerHTML      = src ? src.innerHTML : '<p>No notes for this day yet.</p>';
      body.scrollTop      = 0;
      prevB.disabled = i === 0;
      nextB.disabled = i === buttons.length - 1;
      index = i;
    }

    function open(i){
      show(i);
      panel.hidden = false; scrim.hidden = false;
      document.body.classList.add('notes-open');
      requestAnimationFrame(function(){
        panel.classList.add('open'); scrim.classList.add('open');
        closeB.focus();
      });
    }

    function close(){
      panel.classList.remove('open'); scrim.classList.remove('open');
      document.body.classList.remove('notes-open');
      setTimeout(function(){ panel.hidden = true; scrim.hidden = true; }, 220);
      if(buttons[index]) buttons[index].focus();
      buttons.forEach(function(b){ b.classList.remove('on'); });
      index = -1;
    }

    buttons.forEach(function(btn, i){
      btn.addEventListener('click', function(){ open(i); });
    });
    closeB.addEventListener('click', close);
    scrim.addEventListener('click', close);
    prevB.addEventListener('click', function(){ if(index > 0) show(index - 1); });
    nextB.addEventListener('click', function(){ if(index < buttons.length - 1) show(index + 1); });

    document.addEventListener('keydown', function(e){
      if(index < 0) return;
      if(e.key === 'Escape')     { close(); }
      if(e.key === 'ArrowLeft'  && index > 0) show(index - 1);
      if(e.key === 'ArrowRight' && index < buttons.length - 1) show(index + 1);
    });
  })();

  /* ---- any external link opens in a new tab ---- */
  document.querySelectorAll('a[href^="http"]').forEach(function(a){
    if(a.host !== location.host){ a.target = '_blank'; a.rel = 'noopener'; }
  });

  /* ---- scrollspy ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.rail a')).filter(function(a){
    return a.getAttribute('href').charAt(0) === '#';
  });
  var targets = links.map(function(a){ return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  function spy(){
    var pos = window.scrollY + 90, cur = null;
    targets.forEach(function(t){ if(t.offsetTop <= pos) cur = t.id; });
    links.forEach(function(a){ a.classList.toggle('on', a.getAttribute('href') === '#' + cur); });
  }
  window.addEventListener('scroll', spy, {passive:true});
  spy();
})();
