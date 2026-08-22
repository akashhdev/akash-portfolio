"use client";

import { useEffect, useRef } from "react";

export function PortraitIllustration() {
  const svgRef = useRef<SVGSVGElement>(null);
  const silhouette = "M516 30L511 34L471 42L442 56L412 86L398 116L390 162L391 182L396 190L380 192L374 198L370 222L384 276L399 292L416 296L422 348L406 360L401 370L394 410L355 442L290 466L283 474L231 500L205 546L189 606L181 780L172 824L173 844L182 858L175 864L176 888L172 898L180 1006L168 1022L171 1058L184 1086L185 1140L184 1148L171 1166L150 1214L138 1250L136 1274L150 1380L158 1406L185 1436L203 1450L240 1466L271 1472L269 1534L848 1534L845 1468L854 1376L835 1282L837 1246L824 1200L775 1094L772 1086L774 1082L765 1060L781 1050L784 1032L762 964L857 962L865 960L893 940L914 910L924 882L931 850L931 820L927 806L910 780L903 762L873 652L876 638L855 572L834 528L805 482L784 466L713 444L688 430L687 426L677 424L676 352L669 340L657 336L607 334L616 300L623 290L633 260L643 242L654 238L650 198L646 190L652 170L644 146L644 130L634 94L615 66L592 50L535 34L534 30Z";

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    function writePosition() {
      if (!svg) return;
      currentX += (targetX - currentX) * .14;
      currentY += (targetY - currentY) * .14;
      svg.style.setProperty("--portrait-cursor-x", `${currentX * 7}px`);
      svg.style.setProperty("--portrait-cursor-y", `${currentY * 5}px`);
      svg.style.setProperty("--doodle-cursor-x", `${currentX * -13}px`);
      svg.style.setProperty("--doodle-cursor-y", `${currentY * -10}px`);
      if (Math.abs(targetX - currentX) > .002 || Math.abs(targetY - currentY) > .002) frame = window.requestAnimationFrame(writePosition);
      else frame = 0;
    }

    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(writePosition);
    }

    function onPointerMove(event: PointerEvent) {
      if (motionPreference.matches || !svg) return;
      const bounds = svg.getBoundingClientRect();
      targetX = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - .5) * 2));
      targetY = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - .5) * 2));
      schedule();
    }

    function resetPosition() {
      targetX = 0;
      targetY = 0;
      schedule();
    }

    function onMotionChange() {
      if (motionPreference.matches) resetPosition();
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", resetPosition);
    motionPreference.addEventListener("change", onMotionChange);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", resetPosition);
      motionPreference.removeEventListener("change", onMotionChange);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <svg ref={svgRef} className="portrait-illustration" viewBox="70 0 884 1536" preserveAspectRatio="xMidYMin slice" role="img" aria-labelledby="portrait-title portrait-description" xmlns="http://www.w3.org/2000/svg">
      <title id="portrait-title">Akash Raj Patel wearing a black shirt and red tie</title>
      <desc id="portrait-description">Professional portrait surrounded by animated crimson pencil doodles of a robot arm, brain, light bulb, and paper plane.</desc>

      <defs>
        <clipPath id="portrait-subject-clip" clipPathUnits="userSpaceOnUse">
          <path d={silhouette} />
        </clipPath>
        <mask id="portrait-background-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536">
          <rect width="1024" height="1536" fill="white" />
          <path className="portrait-mask-shape" d={silhouette} fill="black" stroke="black" strokeWidth="22" />
        </mask>
      </defs>

      <g className="portrait-photo-float" clipPath="url(#portrait-subject-clip)">
        <image className="portrait-svg-light" href="/media/akash-portfolio-portrait-white-smile-test.png" x="0" y="0" width="1024" height="1536" />
        <image className="portrait-svg-dark" href="/media/akash-portfolio-portrait.webp" x="0" y="0" width="1024" height="1536" />
      </g>

      <g mask="url(#portrait-background-mask)">
      <g className="portrait-doodle portrait-doodle-robot" data-doodle="robot-arm" aria-hidden="true">
        <path className="doodle-fill" d="M88 408H257L244 370H101ZM132 345L166 282L199 299L164 361ZM181 275L228 229L253 252L202 302ZM242 219L277 212L267 230L281 245L251 261Z" />
        <circle className="doodle-fill" cx="149" cy="345" r="22" /><circle className="doodle-cut" cx="149" cy="345" r="8" /><circle className="doodle-fill" cx="184" cy="289" r="19" /><circle className="doodle-cut" cx="184" cy="289" r="7" />
        <path className="doodle-pencil" d="M82 414L264 411M126 349L162 277L204 296M178 270L225 223L258 250M239 214L283 207" />
      </g>
      <g className="portrait-doodle portrait-doodle-bulb" data-doodle="light-bulb" aria-hidden="true">
        <path className="doodle-fill" d="M850 239C798 239 766 280 775 327C780 353 796 366 807 382L813 401H887L893 382C904 366 920 352 925 327C934 280 902 239 850 239Z" />
        <path className="doodle-cut" d="M824 322C838 308 861 308 876 322M832 401V350M868 401V350" />
        <path className="doodle-fill" d="M817 413H883L875 432H825Z" />
        <path className="doodle-pencil" d="M850 212V187M787 233L769 214M913 233L931 214M755 302H730M945 302H970M817 443H882" />
      </g>
      <g className="portrait-doodle portrait-doodle-plane" data-doodle="paper-plane" aria-hidden="true">
        <path className="doodle-fill" d="M78 704L205 651L166 782L137 734L101 760L112 722Z" />
        <path className="doodle-cut" d="M112 722L178 678L137 734M137 734L157 748" />
        <path className="doodle-pencil" d="M71 700L210 644M91 774L126 748M74 790L112 772" />
      </g>
      <g className="portrait-doodle portrait-doodle-brain" data-doodle="brain-cognition" aria-hidden="true">
        <path className="doodle-fill" d="M814 1068C787 1057 789 1020 813 1009C798 982 821 953 849 961C861 935 895 937 905 961C933 948 962 970 958 1000C984 1008 986 1044 963 1057C975 1085 948 1112 921 1101C904 1124 870 1117 862 1092C839 1106 812 1092 814 1068Z" />
        <path className="doodle-cut" d="M875 967V1094M844 981C865 992 865 1015 849 1028M908 980C891 995 893 1018 914 1029M828 1050C850 1038 870 1054 866 1077M921 1048C943 1040 956 1055 950 1075" />
        <path className="doodle-pencil" d="M805 1075C776 1057 781 1013 806 1002M844 952C862 925 899 928 912 952M968 996C996 1007 998 1049 970 1064" />
      </g>
      </g>

      <g className="portrait-outline-float" aria-hidden="true">
        <path className="portrait-silhouette-edge portrait-silhouette-edge-accent" d={silhouette} />
      </g>
    </svg>
  );
}
