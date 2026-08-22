import type { Metadata } from "next";
import Script from "next/script";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/section-heading";
import { ArchitectureDiagram, ConsistencyChart, PerformanceChart, PipelineDiagram, PlaybackTimeline, RestFlowDiagram } from "@/components/research-diagrams";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Disaster Response Digital Twin Model",
  description: "A research-engineering case study of the UE5 visualization and integration layer for a Minxiong flood-response digital twin demonstrator.",
  alternates: { canonical: "/research/tag-twin" },
};

export default function TagTwinPage() {
  const creativeWork = { "@context": "https://schema.org", "@type": "CreativeWork", name: "Disaster Response Digital Twin Model", author: { "@type": "Person", name: site.name }, description: metadata.description, dateModified: "2026-08-22", url: `${site.url}/research/tag-twin` };
  return (
    <main id="main">
      <Script id="tag-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWork) }} />
      <div className="page-shell research-hero">
        <Breadcrumbs section="Research" current="Disaster Response Digital Twin Model" />
        <header className="research-title">
          <p className="eyebrow mono">Research record 01 / Updated 22 Aug 2026</p>
          <h1>Disaster Response <span>Digital Twin Model</span></h1>
          <div className="research-deck">
            <p>How can heterogeneous flood, evacuation, and decision-support data become one inspectable, synchronized 3D research demonstrator?</p>
            <dl><dt>Role</dt><dd>Digital Twin Platform / UE5 visualization & integration</dd><dt>Context</dt><dd>Graduate lab research · Minxiong, Taiwan</dd><dt>Status</dt><dd>Integrated research demonstrator; not an operational emergency system</dd><dt>Tools</dt><dd>UE5, C++, QGIS, Python, REST, geospatial data</dd></dl>
          </div>
        </header>
      </div>

      <article className="page-shell">
        <section className="section" aria-labelledby="overview-title">
          <SectionHeading number="01" eyebrow="Research question & context" title="A presentation layer for evidence, not spectacle." description="The work connects hydraulic outputs, evacuation trajectories, and ranked response events without overstating what the visualization can prove." />
          <div className="prose-grid"><aside className="mono">My remit<br />UE5 visualization<br />Geospatial integration<br />Runtime interaction</aside><div className="prose"><p className="lead">I developed the Unreal Engine visualization and integration layer for a Minxiong flood-response digital twin research demonstrator.</p><p>The result brings five flood states, evacuation movement, shelters, and response-event evidence into one shared runtime. It is designed for laboratory integration, testing, and technical communication—not field command.</p><div className="limitation-note"><strong>Claim boundary</strong>“Integrated” describes the research prototype. It does not mean deployed, field-validated, connected to live emergency operations, or approved for public-safety decisions.</div></div></div>
        </section>

        <section className="section" aria-labelledby="metrics-title">
          <SectionHeading number="02" eyebrow="Verified status" title="The system at a glance." description="Counts below describe the August 2026 integrated presentation build and its automated checks." />
          <div className="metric-grid">
            <div className="metric"><strong>5</strong><span>flood states</span><small>height/depth-aware geometry</small></div>
            <div className="metric"><strong>4</strong><span>evacuation routes</span><small>100 synchronized agents</small></div>
            <div className="metric"><strong>24,408</strong><span>trajectory samples</span><small>plus two shelters</small></div>
            <div className="metric"><strong>16 / 16</strong><span>automated tests passing</span><small>11 event + 5 playback tests</small></div>
          </div>
          <div className="evidence-note"><strong>Build evidence</strong>UE 5.6 editor compilation and a Win64 Development package both succeeded in the documented August status run, with no test warnings or failures.</div>
        </section>

        <section className="section" aria-labelledby="boundary-title">
          <SectionHeading number="03" eyebrow="Responsibility boundary" title="What I built—and what I consumed." />
          <div className="boundary">
            <div className="owned"><h3>Owned in the UE5 layer</h3><ul><li>Geospatial conversion, alignment, and flood geometry</li><li>Five-frame caching, playback, and profiling</li><li>Route and trajectory visualization</li><li>Priority-event parser, interface, markers, evidence, and camera interaction</li><li>REST snapshot loading, validation, fallback, and refresh reconciliation</li><li>Shared playback, dynamic visual state, testing, packaging, and handoff</li></ul></div>
            <div className="upstream"><h3>Consumed from collaborators</h3><ul><li>HEC-RAS flood simulation outputs and hydraulic interpretation</li><li>Authoritative evacuation-route computation</li><li>Decision-support logic and operational event ranking</li><li>Upstream backend contracts and source data stewardship</li><li>Claims about real-world emergency performance or field effectiveness</li></ul></div>
          </div>
        </section>

        <section className="section" aria-labelledby="architecture-title">
          <SectionHeading number="04" eyebrow="System architecture" title="Three streams, one runtime." description="Flood, evacuation, and ranked-event systems keep their own data contracts, then meet inside the presentation layer." />
          <ArchitectureDiagram />
        </section>

        <section className="section" aria-labelledby="geospatial-title">
          <SectionHeading number="05" eyebrow="Geospatial ingestion" title="The first bug was not visual. It was spatial." />
          <div className="prose-grid"><aside className="mono">Input<br />Adaptive mesh<br />depth_m<br />wse_m<br />timestamps</aside><div className="prose"><p className="lead">A flood layer can render perfectly and still be geographically wrong.</p><p>I treated coordinate reference systems, units, anchor conventions, raster extent, and UE-local centimeters as testable parts of the pipeline. The adaptive source polygons were rasterized into continuous water-surface and depth layers, then converted into height/depth-aware procedural flood volumes.</p><h3>Two alignment failures, two diagnoses</h3><p>A CRS mismatch changes the geographic relationship between datasets. An object-anchor mismatch changes how otherwise correct geometry sits in the Unreal scene. Translating one to imitate the other may look fixed while preserving a hidden error.</p><div className="limitation-note"><strong>Provisional correction</strong>An early coordinate correction was useful for diagnosis but was not presented as authoritative spatial calibration. Later integration used shared TWD97 control points and explicit conversion constraints.</div></div></div>
          <PipelineDiagram />
        </section>

        <section className="section" aria-labelledby="playback-title">
          <SectionHeading number="06" eyebrow="Playback & profiling" title="Move expensive work out of the frame switch." />
          <div className="prose-grid"><aside className="mono">Reported test<br />3,491 ms → 17.6 ms<br />≈199×</aside><div className="prose"><p className="lead">Profiling showed that repeated parsing and mesh preparation—not drawing alone—dominated the direct update path.</p><p>Preloading the five validated frames changed runtime switching from a data-ingestion operation into a cached state transition. The wet-frame average in the documented test fell from 3,491 ms to 17.6 ms.</p><div className="evidence-note"><strong>Benchmark qualification</strong>The result describes the reported project test. Public comparisons should include machine, build, and measurement context; it is not a general UE5 performance guarantee.</div></div></div>
          <PerformanceChart />
          <PlaybackTimeline />
        </section>

        <section className="section" aria-labelledby="evacuation-title">
          <SectionHeading number="07" eyebrow="Evacuation visualization" title="Movement became a time contract." />
          <div className="prose-grid"><aside className="mono">4 routes<br />100 agents<br />24,408 samples<br />2 shelters</aside><div className="prose"><p className="lead">Route lines answer where. Trajectories answer when.</p><p>The presentation layer maps route and agent records into the same spatial and temporal system as the flood frames. Trajectory interpolation drives 100 agents while a shared clock keeps their motion, route colors, shelter context, and scenario state inspectable.</p><p>The system visualizes upstream route results; it does not compute the routes or claim that a displayed route is operationally safe.</p></div></div>
        </section>

        <section className="section" aria-labelledby="events-title">
          <SectionHeading number="08" eyebrow="Priority-event subsystem" title="Ranked events remain traceable to evidence." />
          <div className="prose-grid"><aside className="mono">Top-K panel<br />World markers<br />Evidence view<br />Camera focus</aside><div className="prose"><p className="lead">A priority list is more useful when a reviewer can inspect the record behind the rank and locate it in the world.</p><p>I built a strict C++ ingestion and presentation path: schema validation, fallback handling, stable ranking, selection, detail and evidence views, markers, camera focus/return, and refresh reconciliation. Selection persists where the refreshed record still exists and fails safely where it does not.</p><p>The interface preserves upstream ranking; the Unreal layer does not author the authoritative operational priority.</p></div></div>
        </section>

        <section className="section" aria-labelledby="calibration-title">
          <SectionHeading number="09" eyebrow="Spatial calibration" title="One coordinate contract across every stream." />
          <div className="prose-grid"><aside className="mono">TWD97<br />control points<br />UE-local cm<br />shared anchors</aside><div className="prose"><p className="lead">Integration exposed a second-order problem: each individually plausible stream had to agree on the same place.</p><p>TWD97 calibration and shared control points constrain the transformation from geospatial coordinates into Unreal-local centimeters. Flood geometry, routes, shelters, agents, and event markers therefore use one explicit spatial agreement rather than stream-specific visual offsets.</p></div></div>
        </section>

        <section className="section" aria-labelledby="risk-title">
          <SectionHeading number="10" eyebrow="Dynamic-risk demonstration" title="A synchronized story, explicitly synthetic." />
          <div className="prose-grid"><aside className="mono">5 frames<br />route states<br />agent colors<br />effective rank</aside><div className="prose"><p className="lead">A five-frame synthetic timeline demonstrates how changing conditions can propagate through the presentation layer.</p><p>During playback, route and agent colors, effective event rank and priority, markers, and selected details change together. Resetting restores the static source state so repeated review begins from a known condition.</p><div className="limitation-note"><strong>Non-operational values</strong>The dynamic risk states are synthetic demonstration values. They are not trained predictions, validated probabilities, authoritative rankings, or live emergency data.</div></div></div>
        </section>

        <section className="section" aria-labelledby="rest-title">
          <SectionHeading number="11" eyebrow="Data refresh" title="Snapshots with safe fallback—not a live stream." />
          <RestFlowDiagram />
          <div className="prose-grid"><aside className="mono">Implemented<br />local JSON<br />async REST GET<br />manual refresh</aside><div className="prose"><p>Both local JSON and asynchronous REST GET snapshots feed the same strict parser. Network, parse, or empty-response failures return the presentation to a known fallback rather than leaving partially updated state.</p><div className="limitation-note"><strong>Not implemented</strong>Continuous polling, server-sent events, and WebSocket streaming against a deployed backend are outside the current status. “REST integration” means snapshot loading on request.</div></div></div>
        </section>

        <section className="section" aria-labelledby="validation-title">
          <SectionHeading number="12" eyebrow="Validation, limits & next steps" title="Evidence is strongest when its scope stays visible." />
          <div className="prose-grid"><aside className="mono">16 tests<br />0 failures<br />UE 5.6<br />Win64 package</aside><div className="prose"><h3>Visualization consistency</h3><p>Wet-frame masks produced by the 512 playback grid were compared against the rasterized 2017 reference. IoU/CSI ranged from 0.9522 to 0.9877 across the recorded wet frames.</p><ConsistencyChart /><div className="limitation-note"><strong>Scientific qualification</strong>This comparison quantifies resampling and visualization consistency against a derived raster reference. It is not field accuracy, hydraulic validation, or evidence that the source flood model predicts a real event.</div><h3>Known limits</h3><ul><li>The demonstrator has no field deployment or user study.</li><li>The 0.05 m wet/dry threshold has not been hydraulically validated for operational decision-making.</li><li>Continuous backend updates remain unimplemented.</li><li>Source-data licensing and selected visual publication permissions still require lab confirmation.</li><li>CostGrow and other literature-derived extensions remain proposed research, not implemented features.</li></ul><h3>Next milestones</h3><p>Confirm affiliation and collaborator wording; approve a publishable media set; document benchmark hardware; connect a controlled continuous-update source; and design evaluation with domain experts without crossing from demonstrator evidence into operational claims.</p></div></div>
          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 500 }}>Evidence notes</h3>
          <ol className="citation-list"><li><span>[R01]</span><p>Research Portfolio Briefing for the Disaster Response Digital Twin Model, compiled from supplied project artifacts, May 2026. Used for chronology, geospatial method, performance results, consistency measures, and limitation review.</p></li><li><span>[R02]</span><p>Current Status and Akash Contributions for the Disaster Response Digital Twin Model, updated 22 August 2026. Used as the authoritative source for current integration status, responsibility boundaries, tests, REST behavior, dynamic-risk labeling, and packaging.</p></li><li><span>[SCOPE]</span><p>Where sources disagree on current implementation status, [R02] takes precedence. Team-level system goals are context—not individual authorship claims.</p></li></ol>
        </section>
      </article>
    </main>
  );
}
