import { expect, test } from "@playwright/test";

test("homepage sends complete résumé sections in its initial HTML", async ({ request }) => {
  const response = await request.get("/");
  expect(response.ok()).toBeTruthy();
  const html = await response.text();
  expect(html).toContain("M.S. Advanced Manufacturing");
  expect(html).toContain("Graduate Research Student");
  expect(html).toContain("INTENSE Program Fellow");
  expect(html).toContain("Image Color Restoration");
  expect(html).not.toMatch(/Loading (education|experience|awards|projects)/);
});

test("homepage résumé drawer preserves its section hash", async ({ page }) => {
  await page.goto("/#experience");
  const trigger = page.getByRole("button", { name: /Graduate Research Student/ });
  await trigger.focus();
  await trigger.press("Enter");
  await expect(page).toHaveURL(/preview=tag-twin.*#experience/);
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page).not.toHaveURL(/preview=/);
  await expect(page).toHaveURL(/#experience/);
});

test("browser history restores the résumé preview", async ({ page }) => {
  await page.goto("/?preview=tag-twin#experience");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: /Close preview/ }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await page.goBack();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("project demos open in a URL-aware accessible side panel", async ({ page }) => {
  await page.goto("/projects");
  await expect(page.locator("iframe")).toHaveCount(0);
  const trigger = page.getByRole("button", { name: "View demo for ArcGIS shapefiles to 3D models" });
  await trigger.focus();
  await trigger.press("Enter");
  await expect(page).toHaveURL(/project=arcgis-shapefiles-to-3d-models/);
  const dialog = page.getByRole("dialog", { name: "ArcGIS shapefiles to 3D models" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("A Flask API that converted 2D shapefiles into rendered 3D models");
  await expect(dialog).toContainText("Project context");
  await expect(dialog).toContainText("Results & outcomes");
  await expect(dialog).toContainText("Key learnings");
  await expect(dialog).toContainText("received second prize in the hackathon");
  await expect(dialog.locator("iframe")).toHaveAttribute("src", /youtube-nocookie\.com\/embed\/m7ln6uTDEbw\?enablejsapi=1&playsinline=1&origin=/);
  await expect(dialog.locator("iframe")).toHaveCount(1);
  await expect(dialog.locator(".project-drawer-actions a")).toHaveText(["Watch 2D ArcGIS to 3D on YouTube ↗", "View source on GitHub ↗"]);
  await expect(dialog.getByRole("link", { name: /View source on GitHub/ })).toHaveAttribute("href", "https://github.com/akashhdev/nirmanHackathon2023RunnerUp");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
  if ((page.viewportSize()?.width ?? 1280) <= 620) {
    const drawerWidth = await dialog.evaluate((element) => Math.round(element.getBoundingClientRect().width));
    expect(drawerWidth).toBe(page.viewportSize()?.width);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page).not.toHaveURL(/project=/);
  await page.goBack();
  await expect(page.getByRole("dialog", { name: "ArcGIS shapefiles to 3D models" })).toBeVisible();
});

test("gesture project switches one privacy-enhanced video player", async ({ page }) => {
  await page.goto("/projects?project=gesture-cursor-and-keyboard");
  const dialog = page.getByRole("dialog", { name: "Gesture cursor and keyboard" });
  const iframe = dialog.locator("iframe");
  const video = dialog.locator("video");
  await expect(dialog).toBeVisible();
  await expect(iframe).toHaveCount(0);
  await expect(video).toHaveCount(1);
  await expect(video.locator("source")).toHaveAttribute("src", "https://user-images.githubusercontent.com/89295808/219943363-490ebd51-41c1-4cb1-8830-394e56ca9a5f.mp4");
  expect(await video.evaluate((element) => (element as HTMLVideoElement).muted)).toBe(true);
  await expect(dialog.getByRole("link", { name: /View source on GitHub/ })).toHaveAttribute("href", "https://github.com/akashhdev/cursorGestureControlInterface");
  await dialog.getByRole("button", { name: "Gesture keyboard" }).click();
  await expect(video).toHaveCount(0);
  await expect(iframe).toHaveAttribute("src", /youtube-nocookie\.com\/embed\/eI2WCGRazD0\?enablejsapi=1&playsinline=1&origin=/);
  await expect(dialog.getByRole("link", { name: /View source on GitHub/ })).toHaveAttribute("href", "https://github.com/akashhdev/VirtualKeyboardOpenCV");
  await dialog.getByRole("button", { name: "Volume control" }).click();
  await expect(iframe).toHaveAttribute("src", /youtube-nocookie\.com\/embed\/-pegHhLSizM\?enablejsapi=1&playsinline=1&origin=/);
  await expect(iframe).toHaveCount(1);
  await expect(dialog.getByRole("link", { name: /View source on GitHub/ })).toHaveAttribute("href", "https://github.com/akashhdev/volumeControlGestureInterface");
});

test("GitHub-hosted calculator and bicep demos load muted", async ({ page }) => {
  const cases = [
    ["bicep-curl-counter", "Bicep Curl Counter", "https://user-images.githubusercontent.com/89295808/219944072-9eeac4dd-a998-403b-8787-0cdec011a4f3.mp4", "https://github.com/akashhdev/personalTrainer_OpenCV"],
    ["virtual-calculator", "Virtual Calculator", "https://user-images.githubusercontent.com/89295808/219943897-6fef7245-fe2b-4f43-aec9-639d59895e80.mp4", "https://github.com/akashhdev/VirtualCalculatorOpenCV"],
  ] as const;

  for (const [projectId, title, videoUrl, repositoryUrl] of cases) {
    await page.goto(`/projects?project=${projectId}`);
    const dialog = page.getByRole("dialog", { name: title });
    const video = dialog.locator("video");
    await expect(video).toHaveCount(1);
    await expect(video.locator("source")).toHaveAttribute("src", videoUrl);
    expect(await video.evaluate((element) => (element as HTMLVideoElement).muted)).toBe(true);
    await expect(dialog.getByRole("link", { name: /View source on GitHub/ })).toHaveAttribute("href", repositoryUrl);
  }
});

test("projects without demos open expanded details and invalid links fail closed", async ({ page }) => {
  await page.goto("/projects?project=not-a-project");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const project = page.locator('article[data-project-id="image-color-restoration"]');
  await expect(project).toContainText("Image color restoration");
  const trigger = project.getByRole("button", { name: "View details for Image color restoration" });
  await trigger.click();
  await expect(page).toHaveURL(/project=image-color-restoration/);
  const dialog = page.getByRole("dialog", { name: "Image color restoration" });
  await expect(dialog).toContainText("Project context");
  await expect(dialog).toContainText("Results & outcomes");
  await expect(dialog).toContainText("Key learnings");
  await expect(dialog).toContainText("Delivered an end-to-end application");
  await expect(dialog.locator("iframe, video")).toHaveCount(0);
  await expect(dialog.getByRole("link", { name: /View source on GitHub/ })).toHaveAttribute("href", "https://github.com/akashhdev/imageRestorization");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("section navigation and responsive header remain accessible", async ({ page }) => {
  await page.goto("/");
  const width = page.viewportSize()?.width ?? 1280;
  if (width <= 1180) {
    await page.getByRole("button", { name: "Menu" }).click();
    const mobileNavigation = page.getByRole("navigation", { name: "Mobile navigation" });
    await expect(mobileNavigation).toBeVisible();
    await mobileNavigation.getByRole("link", { name: /Education/ }).click();
  } else {
    await page.getByRole("navigation", { name: "Résumé sections" }).getByRole("link", { name: "Education" }).click();
  }
  await expect(page).toHaveURL(/#education/);
  await expect(page.getByRole("heading", { name: "02 Education" })).toBeVisible();
  await expect(page.locator('.desktop-primary-nav a[aria-current="location"]')).toHaveAttribute("href", "/#education");
  await expect.poll(async () => page.evaluate(() => {
    const headingTop = document.getElementById("education-title")?.getBoundingClientRect().top ?? 0;
    const headerBottom = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;
    return Math.round(headingTop - headerBottom);
  })).toBeLessThanOrEqual(16);
  const headingOffset = await page.evaluate(() => {
    const headingTop = document.getElementById("education-title")?.getBoundingClientRect().top ?? 0;
    const headerBottom = document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;
    return headingTop - headerBottom;
  });
  expect(headingOffset).toBeGreaterThanOrEqual(0);

  await page.goto("/#experience");
  await expect(page.locator('.desktop-primary-nav a[aria-current="location"]')).toHaveAttribute("href", "/#experience");
});

test("homepage uses plain numbered résumé headings", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/01 Introduction \/ Interactive résumé/)).toBeVisible();
  await expect(page.locator("main h1")).toHaveCount(1);
  expect(await page.locator("main h2").allTextContents()).toEqual([
    "02 Education",
    "03 Experience",
    "04 Awards",
    "05 Projects",
  ]);
  await expect(page.getByText(/Technical foundations, extended through research/)).toBeVisible();
});

test("theme follows the system and persists a manual choice", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  if ((page.viewportSize()?.width ?? 1280) <= 620) await page.getByRole("button", { name: "Menu" }).click();
  const toggle = page.getByRole("button", { name: "Switch to day theme" }).first();
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("header and supporting typography use the expanded scales", async ({ page }) => {
  await page.goto("/");
  const bodySize = await page.locator("body").evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
  expect(bodySize).toBeCloseTo(24, 1);
  if ((page.viewportSize()?.width ?? 1280) > 1180) {
    const navSize = await page.getByRole("navigation", { name: "Résumé sections" }).getByRole("link", { name: "Introduction" }).evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
    expect(navSize).toBeGreaterThanOrEqual(17);
  }
  const wordmarkSize = await page.locator(".wordmark").evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
  expect(wordmarkSize).toBeCloseTo(27.84, 1);
  await expect(page.locator(".introduction-copy h1 em")).toHaveCSS("color", "rgb(176, 16, 48)");
});

test("résumé records render their organization logos and project icons", async ({ page, request }) => {
  await page.goto("/#education");
  await expect(page.locator('.resume-visual-logo img[src*="ccu-logo"]').first()).toBeVisible();
  await expect(page.locator('.resume-visual-logo img[src*="amity-logo"]').first()).toBeVisible();
  await page.goto("/#experience");
  await expect(page.locator('.resume-visual-logo img[src*="hiwin-logo"]').first()).toBeVisible();
  await page.goto("/#projects");
  await expect(page.locator(".resume-visual-icon svg")).toHaveCount(3);
  for (const asset of ["/media/organizations/ccu-logo.png", "/media/organizations/amity-logo.webp", "/media/organizations/hiwin-logo.svg"]) {
    expect((await request.get(asset)).ok()).toBe(true);
  }
});

test("mobile navigation supports optional edge-swipe gestures", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 1280) > 1180, "Swipe navigation is enabled only below the expanded-header breakpoint.");
  await page.goto("/");
  await page.getByRole("button", { name: "Menu" }).click();
  await page.getByRole("button", { name: "Close navigation" }).click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeHidden();
  await page.dispatchEvent("body", "pointerdown", { clientX: 2, clientY: 400, pointerId: 1, pointerType: "touch" });
  await page.dispatchEvent("body", "pointerup", { clientX: 105, clientY: 400, pointerId: 1, pointerType: "touch" });
  const navigation = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(navigation).toBeVisible();
  await page.dispatchEvent("body", "pointerdown", { clientX: 300, clientY: 400, pointerId: 2, pointerType: "touch" });
  await page.dispatchEvent("body", "pointerup", { clientX: 120, clientY: 400, pointerId: 2, pointerType: "touch" });
  await expect(navigation).toBeHidden();
});

test("portrait treatment is responsive and the incoming role is explicit", async ({ page }) => {
  await page.goto("/");
  const portrait = page.getByRole("img", { name: /Akash Raj Patel wearing/ });
  await expect(portrait).toBeVisible();
  await expect(portrait.locator("image.portrait-svg-light")).toHaveCount(1);
  await expect(portrait.locator("image.portrait-svg-dark")).toHaveCount(1);
  await expect(portrait.locator("[data-doodle]")).toHaveCount(4);
  await expect(portrait.locator(".portrait-silhouette-edge")).toHaveCount(1);
  await expect(portrait.locator('g[mask="url(#portrait-background-mask)"]')).toHaveCount(1);
  const outlinePath = await portrait.locator(".portrait-silhouette-edge-accent").getAttribute("d");
  const maskPath = await portrait.locator(".portrait-mask-shape").getAttribute("d");
  expect(maskPath).toBe(outlinePath);
  expect((outlinePath?.match(/L/g) ?? []).length).toBeGreaterThan(90);
  await expect(portrait.locator(".portrait-photo-float")).toHaveCSS("animation-duration", "5s");
  await expect(portrait.locator(".portrait-doodle-robot")).toHaveCSS("animation-duration", "4.14s");
  await page.mouse.move((page.viewportSize()?.width ?? 400) - 5, 5);
  await expect.poll(async () => portrait.evaluate((element) => element.style.getPropertyValue("--portrait-cursor-x"))).not.toBe("");
  await expect(page.getByText(/Portrait \/ Akash Raj Patel \/ 2026/)).toHaveCount(0);
  if ((page.viewportSize()?.width ?? 0) > 1180) {
    const portraitHeight = await page.locator(".professional-portrait").evaluate((element) => element.getBoundingClientRect().height);
    const copyHeight = await page.locator(".introduction-copy").evaluate((element) => element.getBoundingClientRect().height);
    expect(Math.abs(portraitHeight - copyHeight)).toBeLessThan(2);
  }
  await page.goto("/#experience");
  const incoming = page.getByRole("button", { name: /Corporate Sponsorship Fellow/ });
  await expect(incoming).toContainText("Incoming");
  await expect(incoming).toContainText("Sep 2027");
});

test("introduction shortcuts, research blog navigation, and reveal motion remain accessible", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /M\.S\. Advanced Manufacturing/ }).click();
  await expect(page).toHaveURL(/#education$/);

  await page.goto("/");
  await page.getByRole("link", { name: /Disaster Response Digital Twin Model/ }).click();
  await expect(page).toHaveURL(/#experience$/);

  if ((page.viewportSize()?.width ?? 0) > 1180) {
    const blogLink = page.locator(".research-blog-link");
    await expect(blogLink).toBeVisible();
    await expect(blogLink).toHaveAttribute("href", "/writing");
    await expect(page.getByRole("button", { name: "More" })).toHaveCount(0);
  } else {
    await page.getByRole("button", { name: "Menu" }).click();
    await expect(page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Research Blog" })).toHaveAttribute("href", "/writing");
  }

  await page.goto("/");
  await expect(page.locator("[data-reveal-visible]").first()).toBeVisible();
});

test("public research naming and reduced-motion portrait behavior are correct", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of ["/", "/research/tag-twin"]) {
    await page.goto(route);
    expect(await page.locator("body").innerText()).not.toMatch(/TAG[-–— ]?Twin/i);
    expect(await page.locator('meta[name="description"]').getAttribute("content")).not.toMatch(/TAG[-–— ]?Twin/i);
  }
  await expect(page).toHaveTitle(/Disaster Response Digital Twin Model/);
  const structuredData = JSON.parse(await page.locator("#tag-jsonld").textContent() ?? "{}");
  expect(`${structuredData.name} ${structuredData.description}`).not.toMatch(/TAG[-–— ]?Twin/i);
  expect(structuredData.url).toContain("/research/tag-twin");
  await page.goto("/");
  await expect(page.locator(".portrait-doodle-robot")).toHaveCSS("animation-name", "none");
  await expect(page.locator(".portrait-photo-float")).toHaveCSS("animation-name", "none");
});

test("downloadable résumé is served as an unchanged PDF asset", async ({ page, request }) => {
  await page.goto("/");
  const link = page.locator('a[download][href="/resume/Akash-Raj-Patel-Resume-2026.pdf"]').first();
  await expect(link).toHaveAttribute("download", "");
  const response = await request.get(await link.getAttribute("href") ?? "");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect((await response.body()).length).toBe(84820);
});

test("private contact details are absent from rendered pages", async ({ page }) => {
  await page.goto("/");
  const text = await page.locator("body").innerText();
  expect(text).not.toContain("akashpatel96883@gmail.com");
  expect(text).not.toContain("0978308721");
  expect(text).not.toContain("angel.tu@hiwin.tw");
  expect(text).not.toContain("pahsiung@ccu.edu.tw");
});

test("primary routes render without horizontal overflow", async ({ page }) => {
  for (const route of ["/", "/research/tag-twin", "/apps", "/projects", "/writing", "/experience/ai-sustainability-internship"]) {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow, route).toBe(false);
  }
});

test("draft writing is excluded from public surfaces", async ({ page }) => {
  await page.goto("/writing");
  await expect(page.getByText("No public notes yet.")).toBeVisible();
  await page.goto("/writing/replace-with-slug");
  await expect(page.getByRole("heading", { name: /Record not found/ })).toBeVisible();
});
