document.addEventListener('DOMContentLoaded', () => {

/* =====================================================
1. NAVBAR — SMOOTH SCROLL
===================================================== */

const navLinks = document.querySelectorAll('.navbar a');

navLinks.forEach(link => {

link.addEventListener('click', function (e) {

  const targetId = this.getAttribute('href');

  if (!targetId || !targetId.startsWith('#')) {
    return;
  }

  const target = document.querySelector(targetId);

  if (!target) {
    return;
  }

  e.preventDefault();

  target.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

});

});

/* =====================================================
2. MOBILE HAMBURGER MENU
===================================================== */

const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.nav-links');

if (hamburger && mobileNav) {

hamburger.addEventListener('click', () => {

  mobileNav.classList.toggle('active');

  hamburger.classList.toggle('open');

});


/* Close menu after clicking a link */

mobileNav.querySelectorAll('a').forEach(link => {

  link.addEventListener('click', () => {

    mobileNav.classList.remove('active');

    hamburger.classList.remove('open');

  });

});

}

/* =====================================================
3. PROJECT PUZZLE CARDS
===================================================== */

const cards = document.querySelectorAll('.card');

cards.forEach(card => {

const glowColor =
  card.getAttribute('data-color');

const imageUrl =
  card.getAttribute('data-image');

const puzzleBox =
  card.querySelector('.puzzle-box');


if (!puzzleBox || !imageUrl) {
  return;
}


/* Set glow colour */

if (glowColor) {

  card.style.setProperty(
    '--glow-color',
    glowColor
  );

}


/* Create puzzle pieces */

const pieces = [];


for (let i = 0; i < 9; i++) {

  const piece =
    document.createElement('div');

  piece.classList.add(
    'puzzle-piece'
  );


  piece.style.backgroundImage =
    `url("${imageUrl}")`;


  const row =
    Math.floor(i / 3);

  const col =
    i % 3;


  /*
    3 × 3 image positioning
  */

  piece.style.backgroundPosition =
    `${col * 50}% ${row * 50}%`;


  puzzleBox.appendChild(piece);


  pieces.push({

    element: piece,

    scatterX:
      (Math.random() - 0.5) * 45,

    scatterY:
      (Math.random() - 0.5) * 45,

    scatterRot:
      (Math.random() - 0.5) * 16

  });

}



/* =================================================
   DESKTOP HOVER
   ================================================= */

card.addEventListener('mouseenter', () => {

  pieces.forEach(piece => {

    piece.element.style.transform =
      `translate(
        ${piece.scatterX}px,
        ${piece.scatterY}px
      )
      rotate(${piece.scatterRot}deg)
      scale(0.88)`;

    piece.element.style.borderRadius =
      '7px';

    piece.element.style.boxShadow =
      '0 8px 18px rgba(0,0,0,0.45)';

  });

});



/* =================================================
   MOUSE LEAVE
   ================================================= */

card.addEventListener('mouseleave', () => {

  pieces.forEach(piece => {

    piece.element.style.transform =
      'translate(0,0) rotate(0deg) scale(1)';

    piece.element.style.borderRadius =
      '0';

    piece.element.style.boxShadow =
      'none';

  });


  card.style.transform =
    'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';

});



/* =================================================
   3D CARD TILT
   ================================================= */

card.addEventListener('mousemove', event => {

  /*
    Disable heavy tilt on touch devices.
  */

  if (window.innerWidth <= 768) {
    return;
  }


  const rect =
    card.getBoundingClientRect();


  const x =
    event.clientX - rect.left;

  const y =
    event.clientY - rect.top;


  const centerX =
    rect.width / 2;

  const centerY =
    rect.height / 2;


  const rotateX =
    ((y - centerY) / centerY) * -7;

  const rotateY =
    ((x - centerX) / centerX) * 7;


  card.style.transform =
    `perspective(1000px)
     rotateX(${rotateX}deg)
     rotateY(${rotateY}deg)
     translateY(-10px)
     scale(1.015)`;

});

});



/* =========================================================
   4. CONTACT FORM → FORMSPREE + WHATSAPP
   ========================================================= */

const contactForm = document.querySelector('.contact-form');

if (contactForm) {

    contactForm.addEventListener('submit', async (event) => {

        event.preventDefault();

        const btn = contactForm.querySelector('.submit-btn');
        const originalText = btn.textContent;

        btn.textContent = "Sending...";
        btn.disabled = true;

        const formData = new FormData(contactForm);

        const name = formData.get("name");
        const email = formData.get("email");
        const phone = formData.get("phone");
        const message = formData.get("message");

        try {

            /* =========================
               1. SEND TO FORMSPREE
               ========================= */

            const response = await fetch(contactForm.action, {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Formspree submission failed");
            }


            /* =========================
               2. OPEN WHATSAPP
               ========================= */

            const whatsappNumber = "919847594021";

            const whatsappMessage =
`Hello Splatter Graphics!

I would like to discuss a design project.

Name: ${name}
Email: ${email}
Phone: ${phone}

Project Details:
${message}`;

            const whatsappURL =
                `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

            window.open(whatsappURL, "_blank");


            /* =========================
               3. SUCCESS
               ========================= */

            btn.textContent = "Message Sent! ✓";

            contactForm.reset();

            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 3000);

        } catch (error) {

            console.error(error);

            btn.textContent = "Failed to Send";
            btn.disabled = false;

            setTimeout(() => {
                btn.textContent = originalText;
            }, 3000);
        }

    });

}


/* =====================================================
5. GSAP SCROLL ANIMATIONS
===================================================== */

if (
typeof gsap !== 'undefined' &&
typeof ScrollTrigger !== 'undefined'
) {

gsap.registerPlugin(
  ScrollTrigger
);


/* Navbar entrance */

gsap.from(
  '.navbar',
  {
    y: -80,
    opacity: 0,
    duration: 1,
    ease: 'power4.out'
  }
);


/* Hero animation */

gsap.from(
  '.home-right > *',
  {
    scrollTrigger: {
      trigger: '#home',
      start: 'top 80%'
    },

    y: 35,
    opacity: 0,

    duration: 0.8,

    stagger: 0.12,

    ease: 'power3.out'
  }
);


/* About */

gsap.from(
  '#about .section-label, #about h2, #about .about-card',
  {
    scrollTrigger: {
      trigger: '#about',
      start: 'top 75%'
    },

    y: 50,
    opacity: 0,

    duration: 0.9,

    stagger: 0.15,

    ease: 'power3.out'
  }
);


/* Services */

gsap.from(
  '.service-card',
  {
    scrollTrigger: {
      trigger: '#services',
      start: 'top 75%'
    },

    y: 60,
    opacity: 0,

    duration: 0.7,

    stagger: 0.12,

    ease: 'power3.out'
  }
);


/* Projects */

gsap.from(
  '.card',
  {
    scrollTrigger: {
      trigger: '#projects',
      start: 'top 75%'
    },

    y: 70,
    opacity: 0,

    duration: 0.8,

    stagger: 0.15,

    ease: 'power3.out'
  }
);


/* Skills */

gsap.from(
  '.skill-item',
  {
    scrollTrigger: {
      trigger: '#skills',
      start: 'top 80%'
    },

    y: 40,
    opacity: 0,

    duration: 0.6,

    stagger: 0.1,

    ease: 'power3.out'
  }
);


/* Process */

gsap.from(
  '.process-step',
  {
    scrollTrigger: {
      trigger: '#process',
      start: 'top 80%'
    },

    y: 40,
    opacity: 0,

    duration: 0.6,

    stagger: 0.12,

    ease: 'power3.out'
  }
);


/* Contact */

gsap.from(
  '.contact-wrapper > *',
  {
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 80%'
    },

    y: 50,
    opacity: 0,

    duration: 0.8,

    stagger: 0.2,

    ease: 'power3.out'
  }
);


/* Footer */

gsap.from(
  'footer',
  {
    scrollTrigger: {
      trigger: 'footer',
      start: 'top 95%'
    },

    opacity: 0,

    duration: 0.8

  }
);

}

/* =====================================================
6. ACTIVE NAVBAR LINK
===================================================== */

const sections =
document.querySelectorAll(
'section[id]'
);

const navigationLinks =
document.querySelectorAll(
'.nav-links a'
);

const updateActiveNav =
() => {

  let currentSection = 'home';


  sections.forEach(section => {

    const sectionTop =
      section.offsetTop - 150;


    if (
      window.scrollY >=
      sectionTop
    ) {

      currentSection =
        section.getAttribute('id');

    }

  });


  navigationLinks.forEach(link => {

    link.classList.remove(
      'active-link'
    );


    const href =
      link.getAttribute('href');


    if (
      href ===
      `#${currentSection}`
    ) {

      link.classList.add(
        'active-link'
      );

    }

  });

};

window.addEventListener(
'scroll',
updateActiveNav
);

updateActiveNav();

});


/* =========================================================
   GLOBAL SCROLL REVEAL ANIMATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* Normal content */
    const revealElements = document.querySelectorAll(
        "#about .section-label, " +
        "#about .about-card, " +
        "#services .section-label, " +
        "#services h2, " +
        "#projects .section-label, " +
        "#projects h2, " +
        "#skills .section-label, " +
        "#skills h2, " +
        "#process .section-label, " +
        "#process h2, " +
        "#contact .section-label, " +
        "#contact h2"
    );

    revealElements.forEach((element) => {
        element.classList.add("scroll-reveal");
    });


    /* Cards / individual items */
    const cardElements = document.querySelectorAll(
        ".service-card, " +
        ".card, " +
        ".skill-item, " +
        ".process-step, " +
        ".contact-wrapper > div, " +
        ".contact-form"
    );

    cardElements.forEach((element) => {
        element.classList.add("scroll-reveal-card");
    });


    /* Intersection Observer */
    const observer = new IntersectionObserver(
        (entries, obs) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("revealed");

                    obs.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        }
    );


    document
        .querySelectorAll(".scroll-reveal, .scroll-reveal-card")
        .forEach((element) => {
            observer.observe(element);
        });

});