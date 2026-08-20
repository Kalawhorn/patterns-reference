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
