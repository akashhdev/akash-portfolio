export type ProjectDemo =
  | { title: string; source: "youtube"; videoId: string; repositoryUrl?: string }
  | { title: string; source: "video"; url: string; repositoryUrl?: string };

export type ProjectDetails = {
  overview: readonly string[];
  outcomes: readonly string[];
  learnings: readonly string[];
};

export type Project = {
  id: string;
  year: string;
  title: string;
  area: string;
  summary: string;
  skills: readonly string[];
  demos?: readonly ProjectDemo[];
  details?: ProjectDetails;
  repositoryUrl?: string;
};

export const projects: readonly Project[] = [
  {
    id: "arcgis-shapefiles-to-3d-models",
    year: "2022",
    title: "ArcGIS shapefiles to 3D models",
    area: "Geospatial API",
    summary: "A Flask API that converted 2D shapefiles into rendered 3D models during a 48-hour national hackathon.",
    skills: ["Python", "Flask", "ArcGIS"],
    details: {
      overview: [
        "Built for the NIRMAAN hackathon, this project accepted the component files of an Esri shapefile, used building-height data as the third dimension, and exposed the conversion through a Flask service.",
        "The workflow moved uploaded geospatial data through model generation and returned an STL file to a browser viewer where the result could be rotated around the X, Y, and Z axes or downloaded for sharing.",
      ],
      outcomes: [
        "Delivered a working end-to-end 2D-to-3D pipeline within the 48-hour challenge and received second prize in the hackathon.",
        "Generated an interactive, dependency-free web view of the compiled 3D model while preserving a downloadable local copy.",
      ],
      learnings: [
        "Geospatial conversion depends on preserving the complete shapefile bundle and translating attribute data into consistent model geometry.",
        "A short hackathon benefits from a narrow service boundary: upload, transform, return, and visualize were separated into understandable stages.",
      ],
    },
    repositoryUrl: "https://github.com/akashhdev/nirmanHackathon2023RunnerUp",
    demos: [{ title: "2D ArcGIS to 3D", source: "youtube", videoId: "m7ln6uTDEbw" }],
  },
  {
    id: "fast-neural-artistic-style-transfer",
    year: "2024",
    title: "Fast neural artistic style transfer",
    area: "Machine learning",
    summary: "A PyTorch implementation for transferring the visual character of an artwork onto another image.",
    skills: ["PyTorch", "CNNs", "Imaging"],
    details: {
      overview: [
        "This final-year project wrapped a trained fast neural style-transfer model in a Flask application. A user can upload a source image, choose an artistic style, and compare the original with the generated image.",
        "The application covers the supporting inference workflow as well as the model: image validation and preprocessing, PyTorch execution, result display, and cleanup before another attempt.",
      ],
      outcomes: [
        "Delivered a reusable web application that applies learned artistic styles to user-supplied images and presents the result alongside the source.",
        "Structured the project so the interface, trained model, and processing pipeline can be run locally from the public repository.",
      ],
      learnings: [
        "Fast style transfer trades the flexibility of optimizing each image for the speed of a trained feed-forward network, which is better suited to an interactive application.",
        "Image-model applications need careful resource handling and predictable cleanup so repeated inference does not leave stale uploads or results behind.",
      ],
    },
    repositoryUrl: "https://github.com/akashhdev/Fast_NAST_Webapp",
    demos: [{ title: "Style transfer", source: "youtube", videoId: "R_dPeist9VI" }],
  },
  {
    id: "image-color-restoration",
    year: "2024",
    title: "Image color restoration",
    area: "Machine learning",
    summary: "A neural approach for restoring plausible color to black-and-white photographs and archival imagery.",
    skills: ["PyTorch", "Computer vision"],
    details: {
      overview: [
        "This internship project paired a learned image-colorization model with a small web workflow for uploading monochrome photographs, processing them, and comparing the original with the generated result.",
        "The implementation combined model inference with the practical application work around image preprocessing, upload handling, result presentation, and clearing files between experiments.",
      ],
      outcomes: [
        "Delivered an end-to-end application that accepted black-and-white images and returned plausible colorized versions for visual comparison.",
        "Packaged the interface and inference workflow in a public Flask and TensorFlow repository so the experiment can be run and inspected outside the original demo.",
      ],
      learnings: [
        "Colorization is an underdetermined task: the model estimates a believable result rather than recovering a single ground-truth color palette.",
        "Turning a model into a usable tool requires reliable preprocessing, file-lifecycle handling, and clear presentation alongside the network itself.",
      ],
    },
    repositoryUrl: "https://github.com/akashhdev/imageRestorization",
  },
  {
    id: "gesture-controlled-coffee-ordering",
    year: "2024",
    title: "Gesture-controlled coffee ordering",
    area: "Human-computer interaction",
    summary: "A touch-free ordering flow driven by tracked hand gestures, including menu navigation and receipt output.",
    skills: ["OpenCV", "Gesture tracking", "HCI"],
    details: {
      overview: [
        "A virtual coffee-machine prototype that replaced touch input with camera-tracked hand gestures. The interface guided a user through choosing a drink and confirming an order.",
        "The prototype connected the gesture-driven front end to a MySQL-backed order flow and generated a receipt when an order was completed.",
      ],
      outcomes: [
        "Demonstrated a complete touch-free ordering journey from gesture selection through confirmation and receipt output.",
        "Recorded orders in the database at the same time as the visible interface advanced, connecting the interaction prototype to persistent backend state.",
      ],
      learnings: [
        "Gesture interfaces need explicit visual feedback and confirmation states because users cannot rely on the tactile cues of a physical control.",
        "Debouncing and deliberate state transitions are important when a continuously tracked gesture can otherwise trigger the same action repeatedly.",
      ],
    },
    repositoryUrl: "https://github.com/akashhdev/VirtualCoffeeMachineInterface_openCV",
    demos: [{ title: "Coffee ordering", source: "youtube", videoId: "yz24zvuXmSY" }],
  },
  {
    id: "privacy-aware-face-blurring",
    year: "2023",
    title: "Privacy-aware face blurring",
    area: "Computer vision",
    summary: "A real-time video pipeline that detects and obscures faces continuously.",
    skills: ["OpenCV.js", "Node.js", "Video processing"],
    details: {
      overview: [
        "A Node.js application using OpenCV.js to find faces in a live camera feed and obscure them continuously. The work explored privacy protection as a real-time video-processing problem rather than a one-time image edit.",
        "Each incoming frame passed through detection and region-based blurring before being shown to the viewer, keeping the privacy treatment aligned with moving subjects.",
      ],
      outcomes: [
        "Built a working browser-oriented prototype that detected and blurred faces while the camera feed was running.",
        "Demonstrated that privacy filtering could be applied as part of the live rendering loop instead of requiring recorded footage to be edited afterward.",
      ],
      learnings: [
        "Real-time vision requires balancing detection quality with per-frame processing cost so the output remains responsive.",
        "Privacy filters should fail conservatively: missed or unstable detections matter more than small visual imperfections in the blur itself.",
      ],
    },
    repositoryUrl: "https://github.com/akashhdev/faceBlurFilterApp",
    demos: [{ title: "Face blurring", source: "youtube", videoId: "KobhezULv7I" }],
  },
  {
    id: "coin-classification-and-counter",
    year: "2023",
    title: "Coin classification and counter",
    area: "Computer vision",
    summary: "A camera-based system for classifying coin types and calculating their combined monetary value.",
    skills: ["OpenCV", "Classification"],
    details: {
      overview: [
        "A Python and OpenCV experiment that processed a camera view of mixed coins, separated the visible objects, differentiated coin types, and converted the detections into a monetary total.",
        "The project joined the visual stages of finding and classifying coins with application logic that accumulated their values into a useful result.",
      ],
      outcomes: [
        "Produced a live demonstration that recognized multiple coin types in one view and displayed their combined value.",
        "Turned raw camera input into both per-object classifications and an aggregate count rather than stopping at detection boxes alone.",
      ],
      learnings: [
        "Classical vision pipelines are sensitive to lighting, scale, overlap, and background contrast, so controlled image capture improves reliability.",
        "Separating segmentation, classification, and value calculation makes it easier to diagnose whether an incorrect total began in vision or business logic.",
      ],
    },
    repositoryUrl: "https://github.com/akashhdev/coinCounterUsingOpenCV",
    demos: [{ title: "Coin classification", source: "youtube", videoId: "b9UDZGF7Hx8" }],
  },
  {
    id: "gesture-cursor-and-keyboard",
    year: "2023",
    title: "Gesture cursor and keyboard",
    area: "Human-computer interaction",
    summary: "Experiments mapping tracked hand movement and gestures to desktop pointer and keyboard controls.",
    skills: ["OpenCV", "MediaPipe", "HCI"],
    details: {
      overview: [
        "A group of three OpenCV interaction experiments that translated hand motion into everyday computer input: moving and clicking a cursor, typing on a virtual keyboard, and changing system volume.",
        "Each prototype used the same camera-based interaction idea but mapped movement, position, and gesture state to a different desktop control surface.",
      ],
      outcomes: [
        "Delivered three working input demonstrations and preserved each implementation in its own public repository.",
        "Showed that a single hand-tracking foundation could support continuous controls such as pointer movement and volume as well as discrete controls such as key selection.",
      ],
      learnings: [
        "Continuous controls need smoothing, while discrete controls need thresholds and debouncing; the same tracked landmarks require different interaction logic for each task.",
        "Comfort, discoverability, and error recovery are as important as recognition accuracy when gestures replace familiar physical devices.",
      ],
    },
    demos: [
      { title: "Cursor control", source: "video", url: "https://user-images.githubusercontent.com/89295808/219943363-490ebd51-41c1-4cb1-8830-394e56ca9a5f.mp4", repositoryUrl: "https://github.com/akashhdev/cursorGestureControlInterface" },
      { title: "Gesture keyboard", source: "youtube", videoId: "eI2WCGRazD0", repositoryUrl: "https://github.com/akashhdev/VirtualKeyboardOpenCV" },
      { title: "Volume control", source: "youtube", videoId: "-pegHhLSizM", repositoryUrl: "https://github.com/akashhdev/volumeControlGestureInterface" },
    ],
  },
  {
    id: "bicep-curl-counter",
    year: "2023",
    title: "Bicep Curl Counter",
    area: "Computer vision",
    summary: "A camera-based pose-tracking demo that counts bicep-curl repetitions.",
    skills: ["Computer vision", "Pose tracking", "Exercise analytics"],
    details: {
      overview: [
        "A Python and OpenCV personal-trainer prototype that followed arm movement through a camera feed, identified the stages of a bicep curl, and converted completed movement cycles into repetition counts.",
        "The interface combined live pose feedback with exercise state so a user could see both the current curl stage and accumulated repetitions.",
      ],
      outcomes: [
        "Built a real-time demonstration that differentiated curl stages, counted completed repetitions, and returned immediate visual feedback.",
        "Converted continuous pose observations into a simple exercise state machine rather than treating every frame as an isolated prediction.",
      ],
      learnings: [
        "Reliable repetition counting depends on movement-state transitions and appropriate thresholds, not only on detecting a body pose in each frame.",
        "Camera angle, body position, and individual range of motion all influence geometric exercise measurements and should be considered before treating them as coaching advice.",
      ],
    },
    repositoryUrl: "https://github.com/akashhdev/personalTrainer_OpenCV",
    demos: [{ title: "Bicep curl counter", source: "video", url: "https://user-images.githubusercontent.com/89295808/219944072-9eeac4dd-a998-403b-8787-0cdec011a4f3.mp4" }],
  },
  {
    id: "virtual-calculator",
    year: "2023",
    title: "Virtual Calculator",
    area: "Human-computer interaction",
    summary: "A hand-gesture interface for selecting calculator numbers and operators.",
    skills: ["Gesture tracking", "Computer vision", "HCI"],
    details: {
      overview: [
        "A Python and OpenCV calculator that replaced mouse or touch input with hand gestures. Users selected on-screen numbers and operators while the application assembled and evaluated the expression in real time.",
        "The prototype explored how a familiar button grid could be retained visually while its physical input mechanism was replaced by camera tracking.",
      ],
      outcomes: [
        "Delivered a working gesture-controlled interface for entering numbers, choosing arithmetic operators, and displaying calculated results.",
        "Demonstrated an alternative input method without changing the calculator's familiar visual model.",
      ],
      learnings: [
        "Hover, selection, and confirmation must be visually distinct when a gesture substitutes for the precision and feedback of a click.",
        "Input debouncing is essential so a held gesture registers once instead of repeatedly entering the same number or operator.",
      ],
    },
    repositoryUrl: "https://github.com/akashhdev/VirtualCalculatorOpenCV",
    demos: [{ title: "Virtual calculator", source: "video", url: "https://user-images.githubusercontent.com/89295808/219943897-6fef7245-fe2b-4f43-aec9-639d59895e80.mp4" }],
  },
  {
    id: "real-time-object-detection",
    year: "2022",
    title: "Real-time object detection",
    area: "Computer vision",
    summary: "Live recognition of multiple COCO object classes from a video stream.",
    skills: ["OpenCV", "COCO", "Detection"],
    details: {
      overview: [
        "A Python real-time detection and classification experiment built around a YOLO model. It processed a live video stream, located multiple objects in each frame, and labeled classes represented in the COCO dataset.",
        "The project focused on integrating a pretrained detector into an interactive OpenCV loop and presenting simultaneous detections clearly on the camera output.",
      ],
      outcomes: [
        "Produced a working live demonstration capable of locating and labeling multiple supported object classes at the same time.",
        "Connected model inference, confidence-based detection output, and annotated rendering in one continuous video pipeline.",
      ],
      learnings: [
        "Real-time detection is a balance among input resolution, inference speed, confidence thresholds, and the number of predictions rendered per frame.",
        "A pretrained label set makes rapid prototyping possible, but the application remains limited to its training classes and the conditions represented in that data.",
      ],
    },
    repositoryUrl: "https://github.com/akashhdev/ObjectClassification_YOLO",
    demos: [{ title: "Object classification", source: "youtube", videoId: "pa_0tHsT2VY" }],
  },
  {
    id: "boston-housing-analysis",
    year: "2022",
    title: "Boston housing analysis",
    area: "Data science",
    summary: "An exploration of social and economic variables associated with historical Boston housing prices.",
    skills: ["Python", "Statistics", "Visualization"],
    details: {
      overview: [
        "Part one of a two-part data-science study using the historical Boston Housing dataset. The analysis explored how recorded social and economic variables moved alongside median home values in 1970s Boston.",
        "The work focused on exploratory analysis and visualization: inspecting distributions, comparing variables, and building a structured account of the relationships visible in the dataset.",
      ],
      outcomes: [
        "Produced a documented exploratory analysis that connected housing-price patterns to the dataset's surrounding demographic and economic variables.",
        "Established the descriptive groundwork for the follow-up recession and housing-price hypothesis test.",
      ],
      learnings: [
        "A visible association is not evidence of causation; historical housing variables need to be interpreted in their social and collection context.",
        "Clear plots and careful variable definitions are often more valuable at the exploratory stage than jumping directly to a predictive model.",
      ],
    },
  },
  {
    id: "recession-and-housing-price-analysis",
    year: "2022",
    title: "Recession and housing-price analysis",
    area: "Data science",
    summary: "A statistical comparison of housing-price behavior during recessionary and non-recessionary periods.",
    skills: ["Pandas", "Hypothesis testing"],
    details: {
      overview: [
        "The second housing study framed a testable question around whether university-town home prices behaved differently during recessionary and non-recessionary periods.",
        "The workflow used Pandas to align housing observations with recession periods, define comparison groups, and apply a hypothesis-testing structure to the resulting samples.",
      ],
      outcomes: [
        "Turned a broad economic question into a reproducible sequence of data preparation, grouping, and statistical comparison steps.",
        "Created a focused case study in communicating what a statistical test can—and cannot—support about a time-dependent housing pattern.",
      ],
      learnings: [
        "Hypothesis-test conclusions depend on defensible group definitions, assumptions, and time windows as much as on the final statistic.",
        "Statistical significance and practical significance are different, while unmeasured economic factors can still confound a temporal comparison.",
      ],
    },
  },
  {
    id: "movie-recommender",
    year: "2022",
    title: "Movie recommender",
    area: "Data science",
    summary: "A similarity-based recommendation experiment using structured film metadata.",
    skills: ["Python", "Recommendation systems"],
    details: {
      overview: [
        "A content-based recommendation experiment that represented films through structured metadata and used similarity to retrieve related titles.",
        "The project explored the full baseline pipeline: choosing useful metadata, converting it into comparable features, calculating similarity, and returning a ranked recommendation list.",
      ],
      outcomes: [
        "Built a compact recommendation baseline that could generate related-film suggestions without requiring individual viewing histories.",
        "Created a useful reference point for understanding what additional personalization or ranking evaluation would need to improve.",
      ],
      learnings: [
        "Feature selection and representation strongly shape what the system considers similar, so recommendation quality begins before the ranking step.",
        "Content similarity can handle new or sparsely viewed titles, but meaningful personalization requires user behavior and an explicit evaluation strategy.",
      ],
    },
  },
  {
    id: "sensor-and-arduino-experiments",
    year: "2021",
    title: "Sensor and Arduino experiments",
    area: "Hardware",
    summary: "Small embedded-system studies connecting sensors, actuators, and software control loops.",
    skills: ["Arduino", "C++", "Sensors"],
    details: {
      overview: [
        "A set of beginner embedded-system exercises that connected physical sensors and actuators to Arduino control logic. One documented build was an ultrasonic distance and depth gauge with live measurement output.",
        "The experiments covered the path from acquiring a sensor signal to interpreting it in software and using the result in a small interactive hardware system.",
      ],
      outcomes: [
        "Built a working ultrasonic measurement prototype that translated time-of-flight readings into live distance and depth output.",
        "Used the project to connect introductory C++ control logic with real hardware behavior after completing an Arduino beginner course.",
      ],
      learnings: [
        "Physical measurements need calibration and filtering because timing, noise, placement, and the environment all affect sensor readings.",
        "Separating acquisition, processing, and actuation makes embedded control loops easier to test and extend.",
      ],
    },
  },
] as const;
