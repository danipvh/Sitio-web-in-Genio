import { useEffect, useMemo, useState } from "react";

const services = [
  {
    title: "🛠️ Obras civiles industriales",
    text: "Ejecución de fundaciones, estructuras, urbanización técnica y habilitaciones para operaciones industriales."
  },
  {
    title: "🔧 Mantenimiento de infraestructura",
    text: "Planes preventivos y correctivos para prolongar vida util, continuidad operacional y confiabilidad de activos."
  },
  {
    title: "⚙️ Soporte a maquinaria industrial",
    text: "Montaje, apoyo mecánico y control de condiciones para equipos en faenas de alta exigencia."
  },
  {
    title: "📊 Ingeniería y gestión",
    text: "Levantamiento, diseño, programación y control para proyectos EPC y contratos de servicio continuo."
  }
];

const pillars = [
  {
    title: "🦺 Seguridad primero",
    text: "Aplicamos protocolos operacionales y controles de riesgo en todas las etapas."
  },
  {
    title: "💎 Calidad verificable",
    text: "Documentamos cada avance para asegurar trazabilidad y cumplimiento técnico."
  },
  {
    title: "🔄 Mejora continua",
    text: "Evaluamos desempeño y optimizamos procesos para lograr mayor productividad."
  }
];

const kpis = [
  { icon: "✅", label: "+10 años de trayectoria en terreno" },
  { icon: "📍", label: "Cobertura nacional" },
  { icon: "🛡️", label: "Normativa vigente" }
];

const welcomeSlides = [
  {
    src: "/assets/welcome-1.jpg.png",
    title: "Desarrollo de infraestructura para faenas de alto impacto",
    text: "Ejecucion de obras civiles con control técnico, seguridad y continuidad operacional."
  },
  {
    src: "/assets/welcome-2.jpg.png",
    title: "Montaje industrial y estructuras metálicas",
    text: "Integración de equipos en terreno con estándares de precisión y productividad."
  },
  {
    src: "/assets/welcome-3.jpg.png",
    title: "Ingeniería aplicada en entornos mineros",
    text: "Planificación y ejecución de soluciones para proyectos críticos en Atacama y en Chile."
  }
];

const logoCandidates = [
  "/assets/logo-in-genio.png",
  "/assets/logo-in-genio.jpg",
  "/assets/logo-in-genio.svg"
];

function SmartImage({ candidates, alt }) {
  const [index, setIndex] = useState(0);

  return (
    <img
      src={candidates[index]}
      alt={alt}
      onError={() => {
        if (index < candidates.length - 1) setIndex(index + 1);
      }}
    />
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeWelcome, setActiveWelcome] = useState(0);
  const [activeFormTab, setActiveFormTab] = useState("comercial"); // "comercial" or "jobs"

  const [form, setForm] = useState({ name: "", company: "", email: "", message: "" });
  const [formState, setFormState] = useState({ status: "idle", message: "" });

  const [jobForm, setJobForm] = useState({ name: "", position: "" });
  const [jobFile, setJobFile] = useState(null);
  const [jobFormState, setJobFormState] = useState({ status: "idle", message: "" });

  const apiBase = useMemo(() => import.meta.env.VITE_API_URL || "", []);
  const totalWelcome = welcomeSlides.length;

  const goPrevWelcome = () => {
    setActiveWelcome((prev) => (prev - 1 + totalWelcome) % totalWelcome);
  };

  const goNextWelcome = () => {
    setActiveWelcome((prev) => (prev + 1) % totalWelcome);
  };

  useEffect(() => {
    const revealItems = document.querySelectorAll(".reveal");
    const counters = document.querySelectorAll("[data-counter]");

    const animateCounter = (el) => {
      const target = Number(el.dataset.counter || "0");
      let value = 0;
      const step = Math.max(1, Math.floor(target / 45));
      const tick = () => {
        value += step;
        if (value >= target) {
          el.textContent = String(target);
          return;
        }
        el.textContent = String(value);
        requestAnimationFrame(tick);
      };
      tick();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("show");
          if (entry.target.matches("[data-counter]")) animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );

    revealItems.forEach((item) => observer.observe(item));
    counters.forEach((counter) => observer.observe(counter));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWelcome((prev) => (prev + 1) % totalWelcome);
    }, 6500);

    return () => clearInterval(interval);
  }, [totalWelcome]);

  const onInputChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onJobInputChange = (e) => {
    setJobForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onJobFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setJobFile(e.target.files[0]);
    } else {
      setJobFile(null);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormState({ status: "loading", message: "Enviando solicitud..." });

    try {
      const response = await fetch(`${apiBase}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "No se pudo enviar el formulario.");

      setFormState({ status: "success", message: data.message || "Solicitud enviada correctamente." });
      setForm({ name: "", company: "", email: "", message: "" });
    } catch (error) {
      setFormState({ status: "error", message: error.message || "Error inesperado." });
    }
  };

  const onJobSubmit = async (e) => {
    e.preventDefault();
    setJobFormState({ status: "loading", message: "Enviando postulación..." });

    const formData = new FormData();
    formData.append("name", jobForm.name);
    formData.append("position", jobForm.position);
    if (jobFile) {
      formData.append("cv", jobFile);
    }

    try {
      const response = await fetch(`${apiBase}/api/jobs`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "No se pudo enviar la postulación.");

      setJobFormState({ status: "success", message: data.message || "Postulación enviada correctamente." });
      setJobForm({ name: "", position: "" });
      setJobFile(null);

      // Reset file input visually
      const fileInput = document.getElementById("cv-upload");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      setJobFormState({ status: "error", message: error.message || "Error inesperado." });
    }
  };

  return (
    <>
      <div className="bg-grid" aria-hidden="true" />

      <header className="site-header" id="top">
        <div className="container nav-wrap">
          <a className="brand" href="#top" aria-label="Inicio in-genio">
            <SmartImage candidates={logoCandidates} alt="Logo in-genio" />
          </a>

          <button
            className="menu-toggle"
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            aria-controls="menu"
          >
            ☰
          </button>

          <nav id="menu" className={`menu ${menuOpen ? "open" : ""}`}>
            <a href="#nosotros" onClick={() => setMenuOpen(false)}>Nosotros</a>
            <a href="#servicios" onClick={() => setMenuOpen(false)}>Servicios</a>
            <a href="#proyectos" onClick={() => setMenuOpen(false)}>Proyectos</a>
            <a href="#contacto" onClick={() => setMenuOpen(false)}>Contacto</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="welcome-section reveal" aria-label="Bienvenida in-genio">
          <div className="container">
            <div className="welcome-carousel">
              <div
                className="welcome-track"
                style={{ transform: `translateX(-${activeWelcome * 100}%)` }}
              >
                {welcomeSlides.map((slide, index) => (
                  <article className="welcome-slide" key={slide.src} aria-hidden={activeWelcome !== index}>
                    <img src={slide.src} alt={slide.title} />
                    <div className="welcome-overlay" />
                    <div className="welcome-content">
                      <p className="tag">Bienvenidos a in-Genio</p>
                      <h2>{slide.title}</h2>
                      <p>{slide.text}</p>
                    </div>
                  </article>
                ))}
              </div>

              <button className="welcome-arrow left" type="button" onClick={goPrevWelcome} aria-label="Imagen anterior">
                ‹
              </button>
              <button className="welcome-arrow right" type="button" onClick={goNextWelcome} aria-label="Imagen siguiente">
                ›
              </button>

              <div className="welcome-dots" role="tablist" aria-label="Seleccion de imagen">
                {welcomeSlides.map((slide, index) => (
                  <button
                    key={slide.src}
                    type="button"
                    className={`welcome-dot ${activeWelcome === index ? "active" : ""}`}
                    onClick={() => setActiveWelcome(index)}
                    aria-label={`Ir a imagen ${index + 1}`}
                    aria-selected={activeWelcome === index}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="hero" aria-labelledby="hero-title">
          <div className="container hero-grid">
            <div className="reveal">
              <p className="tag">Ingeniería aplicada a resultados reales</p>
              <h1 id="hero-title">Construimos soluciones técnicas para operaciones exigentes</h1>
              <p className="lead">
                En in-Genio integramos ingeniería, ejecución en terreno y enfoque en seguridad
                para proyectos de minería, infraestructura y mantenimiento industrial.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="https://wa.me/56968278634" target="_blank" rel="noopener noreferrer">¡Contáctanos!</a>
                <a className="btn btn-ghost" href="#servicios">Ver servicios</a>
              </div>
            </div>

            <ul className="kpis kpis-vertical reveal" aria-label="Indicadores">
              {kpis.map((item) => (
                <li key={item.label}>
                  <div className="kpi-icon-top">{item.icon}</div>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section reveal" id="nosotros">
          <div className="container">
            <p className="eyebrow">Quienes somos</p>
            <h2>Empresa de ingeniería con foco operacional y tecnológico</h2>
            <p className="about-text">
              in-Genio desarrolla soluciones para la industria minera e infraestructura,
              combinando planificacion técnica, ejecución en terreno y mejora continua.
              Nuestro equipo trabaja bajo estándares de calidad, seguridad y productividad.
            </p>
            <div className="about-cards">
              <article className="about-card">
                <h3>💡 Visión</h3>
                <p>Liderar la ingeniería del futuro como aliado estratégico operacional y ágil.</p>
              </article>
              <article className="about-card">
                <h3>🎯 Misión</h3>
                <p>Ejecución confiable y competitiva con resultados reales para la industria.</p>
              </article>
              <article className="about-card">
                <h3>🤝 Valores</h3>
                <p>Seguridad, profesionalismo, excelencia sotenible, competitividad.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section reveal" id="servicios">
          <div className="container">
            <p className="eyebrow">Servicios</p>
            <h2>Capacidades integrales para cada proyecto</h2>
            <div className="cards">
              {services.map((service) => (
                <article className="card reveal" key={service.title}>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section alt reveal" id="proyectos">
          <div className="container projects">
            <div className="projects-text">
              <p className="eyebrow">Proyectos</p>
              <h2>Experiencia en entornos mineros y de infraestructura crítica</h2>
              <p>
                Participamos en obras y servicios para clientes del sector minero e industrial,
                con metodologías orientadas a trazabilidad, cumplimiento normativo y continuidad operacional.
              </p>
              <ul>
                <li>Planificación y control de avance por hitos técnicos</li><br></br>
                <li>Coordinación con equipos de terreno, HSE y operaciones</li><br></br>
                <li>Ejecución bajo protocolos de seguridad en faena</li>
              </ul>
            </div>
            <div className="projects-image">
              <img
                className="projects-photo"
                src="/assets/faena-real.jpg"
                alt="Fotografia real de in-genio en obra"
              />
            </div>
          </div>
        </section>

        <section className="section section-security reveal" id="seguridad">
          <div className="container security">
            <p className="eyebrow">Seguridad y calidad</p>
            <h2>Compromiso con personas, procesos y resultados</h2>
            <div className="pillars">
              {pillars.map((pillar) => (
                <article className="reveal" key={pillar.title}>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section contact reveal" id="contacto">
          <div className="container">
            <div className="form-tabs">
              <button
                type="button"
                className={`tab-btn ${activeFormTab === "comercial" ? "active" : ""}`}
                onClick={() => setActiveFormTab("comercial")}
              >
                💼 Contacto Comercial
              </button>
              <button
                type="button"
                className={`tab-btn ${activeFormTab === "jobs" ? "active" : ""}`}
                onClick={() => setActiveFormTab("jobs")}
              >
                👤 Trabaja con Nosotros
              </button>
            </div>
          </div>

          <div className="container contact-wrap">
            {activeFormTab === "comercial" ? (
              <>
                <div>
                  <p className="eyebrow">Contacto</p>
                  <h2>Hablemos de tu próximo proyecto 🤝</h2>
                  <p>
                    Escríbenos para coordinar una reunión técnica y evaluar alternativas de ejecución
                    para tu proyecto.
                  </p>
                </div>

                <form className="contact-form" onSubmit={onSubmit}>
                  <label>
                    Nombre
                    <input
                      type="text"
                      name="name"
                      placeholder="Tu nombre"
                      value={form.name}
                      onChange={onInputChange}
                      required
                    />
                  </label>
                  <label>
                    Empresa
                    <input
                      type="text"
                      name="company"
                      placeholder="Nombre de tu empresa"
                      value={form.company}
                      onChange={onInputChange}
                      required
                    />
                  </label>
                  <label>
                    Correo
                    <input
                      type="email"
                      name="email"
                      placeholder="correo@empresa.com"
                      value={form.email}
                      onChange={onInputChange}
                      required
                    />
                  </label>
                  <label>
                    Mensaje
                    <textarea
                      rows="4"
                      name="message"
                      placeholder="Cuéntanos brevemente tu requerimiento"
                      value={form.message}
                      onChange={onInputChange}
                      required
                    />
                  </label>
                  <button className="btn btn-primary" type="submit" disabled={formState.status === "loading"}>
                    {formState.status === "loading" ? "Enviando..." : "Enviar solicitud"}
                  </button>
                  {formState.message ? (
                    <p className={`form-message ${formState.status}`}>{formState.message}</p>
                  ) : null}
                </form>
              </>
            ) : (
              <>
                <div>
                  <p className="eyebrow">Postulación</p>
                  <h2>Trabaja con Nosotros 👷‍♂️</h2>
                  <p>
                    Postula para formar parte de nuestras próximas faenas y proyectos enviando tus datos.
                  </p>
                </div>

                <form className="contact-form" onSubmit={onJobSubmit}>
                  <label>
                    Nombre Completo
                    <input
                      type="text"
                      name="name"
                      placeholder="Tu nombre completo"
                      value={jobForm.name}
                      onChange={onJobInputChange}
                      required
                    />
                  </label>
                  <label>
                    Cargo o especialidad
                    <input
                      type="text"
                      name="position"
                      placeholder="Especialidad a postular"
                      value={jobForm.position}
                      onChange={onJobInputChange}
                      required
                    />
                  </label>
                  <label>
                    Adjuntar CV (Opcional - Máx. 5MB)
                    <div className="file-input-wrapper">
                      <input
                        type="file"
                        name="cv"
                        id="cv-upload"
                        onChange={onJobFileChange}
                        accept=".pdf,.doc,.docx"
                      />
                    </div>
                  </label>
                  <button className="btn btn-primary" type="submit" disabled={jobFormState.status === "loading"}>
                    {jobFormState.status === "loading" ? "Enviando..." : "Enviar Postulación"}
                  </button>
                  {jobFormState.message ? (
                    <p className={`form-message ${jobFormState.status}`}>{jobFormState.message}</p>
                  ) : null}
                </form>
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-wrap">
          <SmartImage candidates={logoCandidates} alt="in-genio" />
          <p>© 2026 in-Genio Chile - Soluciones de Ingeniería.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
