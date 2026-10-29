(() => {
  const PHONE = '+33768214304';
  document.documentElement.classList.add('js');
  document.getElementById('y').textContent = new Date().getFullYear();

  // Menu mobile
  const burger = document.querySelector('.burger');
  const nav = document.getElementById('nav');
  const setMenu = open => {
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    nav.classList.toggle('is-open', open);
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // Registre : un carton par déménagement
  document.querySelectorAll('.ledger__row').forEach(row => {
    const n = parseInt(getComputedStyle(row).getPropertyValue('--n'), 10) || 1;
    row.querySelector('.ledger__boxes').innerHTML = '<i></i>'.repeat(n);
  });

  // Marquee : on double chaque rangée pour une boucle continue
  document.querySelectorAll('.marquee__row').forEach(row => {
    [...row.children].forEach(li => {
      const c = li.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      row.appendChild(c);
    });
  });

  // Registre : les cartons s'empilent quand la ligne entre à l'écran
  const targets = document.querySelectorAll('.ledger__row');
  const showAll = () => targets.forEach(el => el.classList.add('is-in'));
  setTimeout(showAll, 4000);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(el => io.observe(el));
  } else {
    showAll();
  }

  // Estimateur de volume
  const VOL = {
    studio: { label: 'Studio', vol: '10 à 15 m³', box: '15 à 25', n: 3 },
    t2:     { label: 'T2', vol: '20 à 30 m³', box: '30 à 45', n: 5 },
    t3:     { label: 'T3', vol: '30 à 40 m³', box: '45 à 65', n: 7 },
    t4:     { label: 'T4', vol: '40 à 55 m³', box: '65 à 90', n: 9 },
    maison: { label: 'Maison 5 pièces et plus', vol: '55 à 80 m³', box: '90 à 130', n: 12 }
  };
  const estim = document.getElementById('estim');
  const stack = estim.querySelector('.estim__stack');
  const renderEstim = () => {
    const d = VOL[estim.home.value];
    document.getElementById('e-vol').textContent = d.vol;
    document.getElementById('e-box').textContent = d.box;
    stack.innerHTML = Array.from({ length: d.n }, (_, i) => `<i style="animation-delay:${i * 35}ms"></i>`).join('');
  };
  estim.addEventListener('change', renderEstim);
  renderEstim();

  document.getElementById('e-send').addEventListener('click', () => {
    const d = VOL[estim.home.value];
    const opts = [...estim.querySelectorAll('input[name="opt"]:checked')].map(i => i.value);
    const lines = [`Logement : ${d.label} (environ ${d.vol}, ${d.box} cartons)`, ...opts.map(o => `• ${o}`)];
    const msg = document.getElementById('msg');
    msg.value = lines.join('\n') + (msg.value.trim() ? '\n\n' + msg.value.trim() : '\n');
    if (opts.includes('Besoin de garde-meubles')) document.getElementById('type').value = 'Déménagement + garde-meubles';
    const nom = document.getElementById('nom');
    nom.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    setTimeout(() => nom.focus({ preventScroll: true }), 350);
  });

  // Formulaire de devis
  const form = document.getElementById('quoteForm');
  const done = document.getElementById('done');
  const showErr = (id, text) => {
    const input = document.getElementById(id);
    document.getElementById(id + '-err').textContent = text;
    input.setAttribute('aria-invalid', text ? 'true' : 'false');
    if (text) input.setAttribute('aria-describedby', id + '-err'); else input.removeAttribute('aria-describedby');
    return !text;
  };
  const validate = () => {
    const okNom = showErr('nom', form.nom.value.trim() ? '' : 'Indiquez votre nom.');
    const digits = form.telephone.value.replace(/\D/g, '');
    const okTel = showErr('tel', digits.length >= 10 ? '' : 'Indiquez un numéro à 10 chiffres pour que l\'on vous rappelle.');
    return okNom && okTel;
  };
  ['nom', 'tel'].forEach(id => document.getElementById(id).addEventListener('blur', () => {
    if (document.getElementById(id).getAttribute('aria-invalid') === 'true') validate();
  }));

  const smsFallback = data => {
    const body = `Demande de devis Zen-Move\n${data.nom} · ${data.telephone}\n${data.ville || ''}\n${data.type_demande}\n${data.message || ''}`;
    window.location.href = `sms:${PHONE}?&body=${encodeURIComponent(body.trim())}`;
  };
  const finish = () => {
    form.hidden = true;
    done.hidden = false;
    done.focus();
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate()) {
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }
    const data = Object.fromEntries(new FormData(form));
    const endpoint = form.dataset.endpoint;
    const btn = form.querySelector('button[type="submit"]');
    if (!endpoint) { smsFallback(data); finish(); return; }
    btn.setAttribute('aria-busy', 'true');
    btn.textContent = 'Envoi en cours…';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, _subject: 'Demande de devis Zen-Move', _template: 'table' })
      });
      if (!res.ok) throw new Error(res.status);
    } catch {
      smsFallback(data);
    }
    finish();
  });
})();
