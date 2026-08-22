import { Suspense } from "react";
import Script from "next/script";
import { ResumeEntryCollection } from "@/components/resume-timeline";
import { SectionHeading } from "@/components/section-heading";
import { entriesForSection, resumeEntries, resumeSkills } from "@/content/resume";
import { site } from "@/lib/site";
import { PortraitIllustration } from "@/components/portrait-illustration";

export default function HomePage() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    image: `${site.url}/media/akash-portfolio-portrait.webp`,
    jobTitle: "Graduate Research Engineer",
    sameAs: [site.github, site.linkedin, site.twitter],
    knowsAbout: ["Scientific visualization", "Digital twins", "Advanced manufacturing", "Computer vision", "Geospatial systems"],
  };

  return (
    <main id="main" className="resume-home">
      <Script id="person-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />

      <section className="resume-document-section resume-introduction" id="introduction" aria-labelledby="introduction-title">
        <div className="page-shell introduction-grid">
          <figure className="professional-portrait">
            <PortraitIllustration />
          </figure>

          <div className="introduction-copy">
            <p className="eyebrow mono">01 Introduction / Interactive résumé / 2026</p>
            <h1 id="introduction-title">Akash Raj<br /><em>Patel.</em></h1>
            <p className="introduction-role">Graduate Research Engineer</p>
            <p className="introduction-disciplines mono">Computer vision · Digital twins · Smart manufacturing</p>
            <p className="introduction-thesis">I connect scientific data, artificial intelligence, and precision engineering through inspectable simulations and dependable software systems.</p>

            <div className="profile-details">
              <div className="profile-facts">
                <a href="#education"><span className="mono">Current</span><strong>M.S. Advanced Manufacturing</strong><p>National Chung Cheng University · Chiayi, Taiwan</p></a>
                <a href="#experience"><span className="mono">Research</span><strong>Disaster Response Digital Twin Model</strong><p>Geospatial pipelines · Unreal Engine 5 · C++</p></a>
              </div>

              <div className="resume-skills" aria-labelledby="skills-title">
                <p id="skills-title" className="mono">Core capabilities / 08</p>
                <ul>{resumeSkills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
              </div>
            </div>

            <nav className="profile-links" aria-label="Professional links">
              <a href={site.github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
              <a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
              <a href={site.twitter} target="_blank" rel="noreferrer">X / Twitter <span aria-hidden="true">↗</span></a>
              <a href={site.resumePath} download>Résumé PDF <span aria-hidden="true">↓</span></a>
            </nav>

          </div>
        </div>
      </section>

      <section className="resume-document-section" aria-labelledby="education-title">
        <div className="page-shell">
          <span className="section-scroll-target" id="education" aria-hidden="true" />
          <SectionHeading id="education-title" number="02" eyebrow="Education" title="Technical foundations, extended through research." description="Formal study spanning computer science, artificial intelligence, advanced manufacturing, and industrially connected graduate research." variant="resume" />
          <Suspense fallback={<p>Loading education…</p>}><ResumeEntryCollection entries={entriesForSection("education")} /></Suspense>
        </div>
      </section>

      <section className="resume-document-section" aria-labelledby="experience-title">
        <div className="page-shell">
          <span className="section-scroll-target" id="experience" aria-hidden="true" />
          <SectionHeading id="experience-title" number="03" eyebrow="Experience" title="Research systems with real constraints." description="Current graduate-lab engineering, an incoming industrial R&D placement, and an earlier international computer-vision research internship." variant="resume" />
          <Suspense fallback={<p>Loading experience…</p>}><ResumeEntryCollection entries={entriesForSection("experience")} /></Suspense>
        </div>
      </section>

      <section className="resume-document-section" aria-labelledby="awards-title">
        <div className="page-shell">
          <span className="section-scroll-target" id="awards" aria-hidden="true" />
          <SectionHeading id="awards-title" number="04" eyebrow="Awards" title="Recognition that enabled the work." description="Fellowships, academic support, and technical competition results presented with their status and context." variant="resume" />
          <Suspense fallback={<p>Loading awards…</p>}><ResumeEntryCollection entries={entriesForSection("award")} /></Suspense>
        </div>
      </section>

      <section className="resume-document-section" aria-labelledby="projects-title">
        <div className="page-shell">
          <span className="section-scroll-target" id="projects" aria-hidden="true" />
          <SectionHeading id="projects-title" number="05" eyebrow="Projects" title="Earlier experiments that built technical range." description="Computer vision, neural image systems, and geospatial application work remain separate from the graduate-lab research record." variant="resume" />
          <Suspense fallback={<p>Loading projects…</p>}><ResumeEntryCollection entries={entriesForSection("project")} /></Suspense>
          <div className="resume-section-action"><a className="text-action" href="/projects">Explore the complete project archive <span aria-hidden="true">→</span></a><a className="text-action" href="/apps">View authored and operated apps <span aria-hidden="true">→</span></a></div>
        </div>
      </section>
    </main>
  );
}
