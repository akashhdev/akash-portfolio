export function ArchitectureDiagram() {
  return (
    <figure className="technical-figure">
      <div className="architecture" role="img" aria-label="Three data streams for flood, evacuation, and priority events are validated and rendered together in Unreal Engine Game Main.">
        <div className="architecture-column"><p>Stream 01 / Flood</p><div className="architecture-node"><strong>5 flood frames</strong><span>HEC-RAS-derived geometry + timestamps</span></div><div className="architecture-node"><strong>Load & validate</strong><span>Height/depth-aware cached meshes</span></div><div className="architecture-node"><strong>Flood progression</strong><span>Time-synchronized state switching</span></div></div>
        <div className="architecture-column"><p>Stream 02 / Evacuation</p><div className="architecture-node"><strong>4 routes</strong><span>24,408 trajectory samples / 100 agents</span></div><div className="architecture-node"><strong>Transform & interpolate</strong><span>Shared coordinate and time contracts</span></div><div className="architecture-node"><strong>Routes & movement</strong><span>Lines, agents, shelters, state colors</span></div></div>
        <div className="architecture-column"><p>Stream 03 / Events</p><div className="architecture-node"><strong>Ranked-event JSON</strong><span>Local file or REST GET snapshot</span></div><div className="architecture-node"><strong>Parse & reconcile</strong><span>Strict validation, rank preservation, TWD97 conversion</span></div><div className="architecture-node"><strong>Operational view</strong><span>Top-K panel, markers, evidence, camera focus</span></div></div>
        <div className="architecture-merge"><strong>Unified UE5 presentation layer / <code>/Game/Main</code></strong></div>
      </div>
      <figcaption>Three upstream data streams converge in the UE5 presentation layer. Akash’s scope begins at validated inputs; upstream simulation, routing, and authoritative ranking remain collaborator-owned.</figcaption>
    </figure>
  );
}

export function PipelineDiagram() {
  const steps = [
    ["01", "Adaptive polygons", "HEC-RAS hydraulic fields inspected in QGIS"],
    ["02", "Reference raster", "2017 × 2017 masks and continuous layers"],
    ["03", "Playback mesh", "512 × 512 WSE/depth-aware procedural geometry"],
    ["04", "Cached runtime", "Five validated frames preloaded for switching"],
  ];
  return <figure className="technical-figure"><div className="flow-row" role="img" aria-label="Pipeline from adaptive HEC-RAS polygons through reference raster and 512 mesh to cached Unreal Engine playback.">{steps.map(([number, title, note]) => <div className="flow-step" key={number}><span>{number}</span><strong>{title}</strong><small>{note}</small></div>)}</div><figcaption>Evidence-supported data path from hydraulic output to evaluated UE5 playback. The reference raster is an evaluation intermediary, not field truth.</figcaption></figure>;
}

export function PlaybackTimeline() {
  const markers = [["0%", "00:00 / reset"], ["22%", "Flood state 02"], ["44%", "Flood state 03"], ["66%", "Flood state 04"], ["100%", "03:00 / loop"]];
  return <figure className="technical-figure"><div className="timeline-diagram" role="img" aria-label="A shared 180 second timeline controls flood frames, moving agents, route states, ranked events, and interface state."><p className="mono eyebrow">Shared clock / play · pause · seek · reset · loop · speed</p><div className="timeline-track">{markers.map(([left, label]) => <i className="timeline-marker" style={{ left }} key={label}><span>{label}</span></i>)}</div><p>One clock coordinates flood state, trajectory interpolation, route and agent colors, effective event priority, selection, and interface restoration.</p></div><figcaption>A 180-second presentation clock keeps otherwise independent visual systems coherent during demonstration and review.</figcaption></figure>;
}

export function RestFlowDiagram() {
  const steps = [["01", "GET snapshot", "Manual refresh; no continuous polling"], ["02", "Strict parse", "Reject malformed or incomplete records"], ["03", "Coordinate conversion", "TWD97 control points into UE-local space"], ["04", "Reconcile", "Preserve selection where possible; restore fallback safely"]];
  return <figure className="technical-figure"><div className="flow-row" role="img" aria-label="REST snapshot is fetched, strictly parsed, spatially converted, and reconciled with current interface state.">{steps.map(([n, title, note]) => <div className="flow-step" key={n}><span>{n}</span><strong>{title}</strong><small>{note}</small></div>)}</div><figcaption>The implemented network path loads REST GET snapshots asynchronously. Continuous polling and WebSocket updates are not implemented.</figcaption></figure>;
}

export function PerformanceChart() {
  const rows = [{ label: "Direct JSON", value: "3,491 ms", width: "100%", className: "bar" }, { label: "Preloaded", value: "17.6 ms", width: "0.51%", className: "bar cached" }];
  return <figure className="technical-figure"><div className="bar-chart" role="img" aria-label="Average reported wet-frame switch time changed from 3491 milliseconds with direct JSON loading to 17.6 milliseconds with preloading.">{rows.map((row) => <div style={{ display: "contents" }} key={row.label}><span className="mono eyebrow">{row.label}</span><i className={row.className} style={{ width: row.width }}></i><strong>{row.value}</strong></div>)}</div><figcaption>Reported wet-frame average in the project test: moving JSON parsing and mesh preparation out of the runtime switch reduced 3,491 ms to 17.6 ms, approximately 199×. Hardware/build context should accompany external benchmarking.</figcaption></figure>;
}

export function ConsistencyChart() {
  return <figure className="technical-figure"><div style={{ padding: "clamp(2rem, 6vw, 5rem) 2rem", display: "grid", gap: "1.2rem" }} role="img" aria-label="Documented playback-mask consistency IoU range across wet frames is 0.9522 to 0.9877."><div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end" }}><span className="mono eyebrow">Lowest reported wet frame<br /><strong style={{ color: "var(--ink)", fontSize: "1.65rem" }}>0.9522</strong></span><span className="mono eyebrow" style={{ textAlign: "right" }}>Highest reported wet frame<br /><strong style={{ color: "var(--ink)", fontSize: "1.65rem" }}>0.9877</strong></span></div><div style={{ height: "1.4rem", background: "linear-gradient(90deg, var(--cyan), var(--blue))" }}></div><span className="mono" style={{ color: "var(--muted)", fontSize: ".975rem", textAlign: "center" }}>Documented range / individual frame values withheld until raw evaluation output is confirmed</span></div><figcaption>2017-reference versus 512-playback mask IoU/CSI across wet frames. This measures visualization consistency after resampling—not hydraulic model validity, field accuracy, or predictive skill.</figcaption></figure>;
}
