/* ============================================
   HET PAREKH — DATA NOTEBOOK PORTFOLIO
   Interactive Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initTypingEffect();
  initNavigation();
  initSkillChipStagger();
});

/* ============================================
   SCROLL-TRIGGERED FADE-IN ANIMATIONS
   ============================================ */
function initScrollAnimations() {
  const cells = document.querySelectorAll('.cell');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  cells.forEach((cell) => observer.observe(cell));
}

/* ============================================
   TYPING EFFECT FOR HERO CODE
   ============================================ */
function initTypingEffect() {
  const codeEl = document.getElementById('hero-code');
  if (!codeEl) return;

  const lines = codeEl.querySelectorAll('.type-line');
  let lineIndex = 0;

  function typeLine() {
    if (lineIndex >= lines.length) {
      // Add blinking cursor to last line
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      lines[lines.length - 1].appendChild(cursor);
      return;
    }

    const line = lines[lineIndex];
    const fullHTML = line.dataset.content;
    line.innerHTML = '';
    line.style.visibility = 'visible';

    // Type character by character (respecting HTML tags)
    typeHTMLContent(line, fullHTML, 0, () => {
      lineIndex++;
      setTimeout(typeLine, 300);
    });
  }

  // Start typing after a short delay
  setTimeout(typeLine, 600);
}

function typeHTMLContent(element, html, index, callback) {
  if (index >= html.length) {
    callback();
    return;
  }

  // If we hit an HTML tag, insert the whole tag at once
  if (html[index] === '<') {
    const tagEnd = html.indexOf('>', index);
    if (tagEnd !== -1) {
      // Check if it's an opening tag
      const tagContent = html.substring(index, tagEnd + 1);
      const isClosingTag = tagContent[1] === '/';

      if (isClosingTag) {
        // Find the last opened element and close it by moving cursor out
        element.innerHTML = html.substring(0, tagEnd + 1);
        // Actually, let's simplify: just reveal progressively
        requestAnimationFrame(() =>
          typeHTMLContent(element, html, tagEnd + 1, callback)
        );
        return;
      }

      // Find the matching closing tag
      const tagName = tagContent.match(/<(\w+)/)?.[1];
      if (tagName) {
        const closingTag = `</${tagName}>`;
        const closingIdx = html.indexOf(closingTag, tagEnd);
        if (closingIdx !== -1) {
          // Insert the entire tagged segment
          const fullSegment = html.substring(index, closingIdx + closingTag.length);
          const innerText = html.substring(tagEnd + 1, closingIdx);

          // Create the element
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = tagContent;
          const spanEl = tempDiv.firstChild;
          spanEl.textContent = '';
          element.appendChild(spanEl);

          // Type the inner text
          let charIdx = 0;
          function typeInner() {
            if (charIdx >= innerText.length) {
              requestAnimationFrame(() =>
                typeHTMLContent(element, html, closingIdx + closingTag.length, callback)
              );
              return;
            }
            spanEl.textContent += innerText[charIdx];
            charIdx++;
            setTimeout(typeInner, 25 + Math.random() * 15);
          }
          typeInner();
          return;
        }
      }
    }
  }

  // Regular character
  element.innerHTML = html.substring(0, index + 1);
  // Re-render: simpler approach - just reveal chars
  const textNode = document.createTextNode(html[index]);
  setTimeout(
    () => typeHTMLContent(element, html, index + 1, callback),
    25 + Math.random() * 15
  );
}

/*
  Simplified typing: reveal the pre-built HTML line by line
  with a "rendering" feel
*/
function initTypingEffectSimple() {
  const codeEl = document.getElementById('hero-code');
  if (!codeEl) return;

  const lines = codeEl.querySelectorAll('.type-line');

  lines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateX(-8px)';
    line.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateX(0)';
    }, 400 + i * 250);
  });

  // Blinking cursor after all lines
  setTimeout(() => {
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    const lastLine = lines[lines.length - 1];
    if (lastLine) lastLine.appendChild(cursor);
  }, 400 + lines.length * 250 + 200);
}

/* Override with the simpler, more reliable approach */
document.addEventListener('DOMContentLoaded', () => {
  // Re-init with simple typing
  const codeEl = document.getElementById('hero-code');
  if (codeEl) {
    initTypingEffectSimple();
  }
});

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
  // Hamburger toggle
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchors.forEach((a) => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: '-70px 0px -50% 0px' }
  );

  sections.forEach((sec) => scrollObserver.observe(sec));
}

/* ============================================
   SKILL CHIP STAGGERED ANIMATION
   ============================================ */
function initSkillChipStagger() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const chips = entry.target.querySelectorAll('.skill-chip');
          chips.forEach((chip, i) => {
            chip.style.animationDelay = `${i * 0.04}s`;
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  observer.observe(skillsSection);
}

/* ============================================
   CELL EXECUTION COUNTER ANIMATION
   ============================================ */
function animateCellNumbers() {
  const labels = document.querySelectorAll('.cell-label .cell-num');
  labels.forEach((label, i) => {
    const target = i + 1;
    label.textContent = '·';
    setTimeout(() => {
      label.textContent = target;
    }, 300 + i * 200);
  });
}

// Run counter animation on load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(animateCellNumbers, 200);
});
