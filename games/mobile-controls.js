(() => {
  "use strict";

  const STORAGE_KEY = "toby_web_mobile_controls";
  const LAYOUT_KEY = "toby_web_mobile_controls_layout";
  const storedMode = localStorage.getItem(STORAGE_KEY);
  const mode = ["auto", "on", "off"].includes(storedMode) ? storedMode : "auto";
  const touchDevice = matchMedia("(pointer: coarse)").matches || matchMedia("(hover: none)").matches;
  const enabled = mode === "on" || (mode === "auto" && touchDevice);
  document.documentElement.classList.toggle("toby-mobile-controls-enabled", enabled);
  document.documentElement.classList.toggle("toby-mobile-controls-disabled", !enabled);

  if (!enabled) return;

  const layout = localStorage.getItem(LAYOUT_KEY) === "arrows" ? "arrows" : "stick";

  const existingControls = document.querySelector(
    document.documentElement.dataset.tobyUnifiedControls === "true"
      ? "#toby-mobile-controls"
      : "#toby-mobile-controls, #mobile-controls"
  );
  if (existingControls) {
    existingControls.style.display = "block";
    return;
  }

  const scriptUrl = document.currentScript?.src || location.href;
  const controlFontUrl = new URL("monster-friend-fore.woff2", scriptUrl).href;
  const style = document.createElement("style");
  style.textContent = `
    @font-face {
      font-family: "Toby Mobile";
      src: url("${controlFontUrl}") format("woff2");
      font-display: swap;
    }
    #toby-mobile-controls {
      position: fixed;
      inset: 0;
      z-index: 2147483646;
      pointer-events: none;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
      font-family: Arial, sans-serif;
    }
    #toby-mobile-controls .toby-stick {
      position: absolute;
      left: max(7vw, env(safe-area-inset-left));
      bottom: max(6vh, env(safe-area-inset-bottom));
      width: clamp(132px, 17vw, 220px);
      aspect-ratio: 1;
      border: 4px solid rgba(255, 255, 255, 0.55);
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.55);
      box-shadow: inset 0 0 0 3px rgba(0, 0, 0, 0.85), 0 3px 0 rgba(0, 0, 0, 0.6);
      pointer-events: auto;
      touch-action: none;
      box-sizing: border-box;
    }
    #toby-mobile-controls .toby-stick-knob {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 58%;
      aspect-ratio: 1;
      border: 4px solid rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.7);
      box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.8);
      transform: translate(-50%, -50%);
      box-sizing: border-box;
      pointer-events: none;
    }
    #toby-mobile-controls .toby-stick.is-active .toby-stick-knob {
      border-color: #fff;
      background: rgba(255, 255, 255, 0.25);
    }
    #toby-mobile-controls .toby-dpad {
      position: absolute;
      left: max(7vw, env(safe-area-inset-left));
      bottom: max(6vh, env(safe-area-inset-bottom));
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      width: clamp(132px, 17vw, 220px);
      aspect-ratio: 1;
      gap: 6px;
      pointer-events: none;
      filter: drop-shadow(4px 4px 0 rgba(0, 0, 0, 0.6));
    }
    #toby-mobile-controls .toby-dpad .toby-dpad-key {
      pointer-events: auto;
      touch-action: none;
      border: 3px solid rgba(255, 255, 255, 0.75);
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      font: 400 clamp(18px, 2.6vw, 30px)/1 "Toby Mobile", monospace;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      -webkit-tap-highlight-color: transparent;
      box-sizing: border-box;
    }
    #toby-mobile-controls .toby-dpad .toby-dpad-key.is-pressed {
      background: #fff;
      color: #000;
      border-color: #fff;
    }
    #toby-mobile-controls .toby-dpad .up    { grid-area: 1 / 2; }
    #toby-mobile-controls .toby-dpad .left  { grid-area: 2 / 1; }
    #toby-mobile-controls .toby-dpad .right { grid-area: 2 / 3; }
    #toby-mobile-controls .toby-dpad .down  { grid-area: 3 / 2; }
    #toby-mobile-controls .toby-direction-key {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
    }
    #toby-mobile-controls .toby-actions {
      position: absolute;
      right: max(5vw, env(safe-area-inset-right));
      bottom: max(5vh, env(safe-area-inset-bottom));
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: clamp(12px, 2vh, 24px);
      padding-right: clamp(18px, 3vw, 44px);
      filter: drop-shadow(6px 7px 0 #000);
    }
    #toby-mobile-controls .toby-action {
      width: clamp(68px, 7.2vw, 100px);
      aspect-ratio: 1;
      position: relative;
      isolation: isolate;
      overflow: hidden;
      padding: 0;
      border: 0;
      border-radius: 50%;
      clip-path: none;
      background: #000;
      color: #fff;
      font: 400 clamp(28px, 3.4vw, 48px)/1 "Toby Mobile", monospace;
      letter-spacing: 0;
      pointer-events: auto;
      touch-action: none;
      -webkit-tap-highlight-color: transparent;
      box-sizing: border-box;
      text-shadow: none;
      transform: translateX(var(--toby-action-offset));
    }
    #toby-mobile-controls .toby-action::before {
      content: "";
      position: absolute;
      z-index: -1;
      inset: 4px;
      border-radius: 50%;
      clip-path: none;
      background: #000;
      box-shadow: inset 0 0 0 5px #fff;
    }
    #toby-mobile-controls .toby-action span {
      display: block;
      transform: translateY(3px);
    }
    #toby-mobile-controls .toby-action.c { --toby-action-offset: clamp(36px, 5vw, 72px); }
    #toby-mobile-controls .toby-action.x { --toby-action-offset: clamp(18px, 2.5vw, 36px); }
    #toby-mobile-controls .toby-action.z { --toby-action-offset: 0px; }
    #toby-mobile-controls .toby-action.is-pressed {
      color: #000;
      background: #fff;
      transform: translate(var(--toby-action-offset), 4px) scale(0.94);
    }
    #toby-mobile-controls .toby-action.is-pressed::before {
      background: #fff;
      box-shadow: inset 0 0 0 5px #000;
    }
    @media (max-width: 680px), (max-height: 520px) {
      #toby-mobile-controls .toby-stick {
        left: max(24px, env(safe-area-inset-left));
        bottom: max(20px, env(safe-area-inset-bottom));
        width: clamp(116px, 28vw, 160px);
      }
      #toby-mobile-controls .toby-dpad {
        left: max(24px, env(safe-area-inset-left));
        bottom: max(20px, env(safe-area-inset-bottom));
        width: clamp(116px, 28vw, 160px);
      }
      #toby-mobile-controls .toby-actions {
        right: max(22px, env(safe-area-inset-right));
        bottom: max(18px, env(safe-area-inset-bottom));
        gap: 8px;
        padding-right: 20px;
      }
      #toby-mobile-controls .toby-action {
        width: clamp(58px, 14vw, 74px);
        font-size: clamp(24px, 7vw, 34px);
      }
      #toby-mobile-controls .toby-action::before {
        inset: 3px;
        box-shadow: inset 0 0 0 4px #fff;
      }
    }
  `;
  document.head.appendChild(style);

  const directionKeys = `
      <button class="toby-direction-key up" data-key="ArrowUp" data-code="ArrowUp" data-key-code="38" aria-label="Up"></button>
      <button class="toby-direction-key left" data-key="ArrowLeft" data-code="ArrowLeft" data-key-code="37" aria-label="Left"></button>
      <button class="toby-direction-key down" data-key="ArrowDown" data-code="ArrowDown" data-key-code="40" aria-label="Down"></button>
      <button class="toby-direction-key right" data-key="ArrowRight" data-code="ArrowRight" data-key-code="39" aria-label="Right"></button>`;

  const root = document.createElement("div");
  root.id = "toby-mobile-controls";
  root.setAttribute("aria-label", "Mobile game controls");
  root.innerHTML = (layout === "arrows"
    ? `<div class="toby-dpad" role="group" aria-label="Movement pad">
        <button class="toby-dpad-key up" data-key="ArrowUp" data-code="ArrowUp" data-key-code="38" aria-label="Up">&#9650;</button>
        <button class="toby-dpad-key left" data-key="ArrowLeft" data-code="ArrowLeft" data-key-code="37" aria-label="Left">&#9664;</button>
        <button class="toby-dpad-key right" data-key="ArrowRight" data-code="ArrowRight" data-key-code="39" aria-label="Right">&#9654;</button>
        <button class="toby-dpad-key down" data-key="ArrowDown" data-code="ArrowDown" data-key-code="40" aria-label="Down">&#9660;</button>
      </div>`
    : `<div class="toby-stick" role="group" aria-label="Movement joystick">
      <div class="toby-stick-knob"></div>${directionKeys}
    </div>`) + `
    <div class="toby-actions" aria-label="Action controls">
      <button class="toby-action c" data-key="c" data-code="KeyC" data-key-code="67" aria-label="Menu (C)"><span>C</span></button>
      <button class="toby-action x" data-key="x" data-code="KeyX" data-key-code="88" aria-label="Cancel (X)"><span>X</span></button>
      <button class="toby-action z" data-key="z" data-code="KeyZ" data-key-code="90" aria-label="Confirm (Z)"><span>Z</span></button>
    </div>
  `;

  const held = new Map();
  const target = () => document.querySelector("canvas") || document.activeElement || document.body;
  const dispatchTargets = () => {
    const primary = target();
    const set = new Set([primary, document.body, document.documentElement, document, window]);
    return [...set].filter(Boolean);
  };
  const makeKeyboardEvent = (button, type) => {
    const keyCode = Number(button.dataset.keyCode);
    const event = new KeyboardEvent(type, {
      key: button.dataset.key,
      code: button.dataset.code,
      bubbles: true,
      cancelable: true,
      composed: true,
      repeat: type === "keydown" && held.has(button),
    });
    try {
      Object.defineProperties(event, {
        keyCode: { get: () => keyCode },
        charCode: { get: () => type === "keypress" ? keyCode : 0 },
        which: { get: () => keyCode },
      });
    } catch (_) {}
    return event;
  };
  const send = (button, type) => {
    dispatchTargets().forEach(t => t.dispatchEvent(makeKeyboardEvent(button, type)));
  };

  const release = button => {
    if (!held.has(button)) return;
    held.delete(button);
    button.classList.remove("is-pressed");
    send(button, "keyup");
  };

  const pressButton = (button, pointerId) => {
    if (held.has(button)) return;
    held.set(button, pointerId);
    button.classList.add("is-pressed");
    send(button, "keydown");
    send(button, "keypress");
  };

  root.querySelectorAll(".toby-action").forEach(button => {
    button.addEventListener("pointerdown", event => {
      event.preventDefault();
      try { button.setPointerCapture(event.pointerId); } catch (_) {}
      target().focus?.();
      pressButton(button, event.pointerId);
    });
    button.addEventListener("pointerup", event => {
      event.preventDefault();
      setTimeout(() => release(button), 45);
    });
    button.addEventListener("pointercancel", () => release(button));
    button.addEventListener("lostpointercapture", () => release(button));
    button.addEventListener("contextmenu", event => event.preventDefault());
  });

  // Arrow-pad layout: discrete direction buttons behave like the action buttons.
  root.querySelectorAll(".toby-dpad-key").forEach(button => {
    button.addEventListener("pointerdown", event => {
      event.preventDefault();
      try { button.setPointerCapture(event.pointerId); } catch (_) {}
      target().focus?.();
      pressButton(button, event.pointerId);
    });
    button.addEventListener("pointerup", event => {
      event.preventDefault();
      setTimeout(() => release(button), 45);
    });
    button.addEventListener("pointercancel", () => release(button));
    button.addEventListener("lostpointercapture", () => release(button));
    button.addEventListener("contextmenu", event => event.preventDefault());
  });

  const stick = root.querySelector(".toby-stick");
  const directions = {
    up: root.querySelector(".toby-direction-key.up"),
    left: root.querySelector(".toby-direction-key.left"),
    down: root.querySelector(".toby-direction-key.down"),
    right: root.querySelector(".toby-direction-key.right"),
  };
  let stickPointer = null;

  const setDirection = (button, active) => {
    if (active && !held.has(button)) {
      held.set(button, stickPointer);
      send(button, "keydown");
    } else if (!active) {
      release(button);
    }
  };

  const knob = root.querySelector(".toby-stick-knob");
  const updateStick = event => {
    const rect = stick.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rawX = event.clientX - centerX;
    const rawY = event.clientY - centerY;
    const radius = rect.width * 0.3;
    const distance = Math.hypot(rawX, rawY);
    const scale = distance > radius ? radius / distance : 1;
    const x = rawX * scale;
    const y = rawY * scale;
    const threshold = rect.width * 0.12;

    knob.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    setDirection(directions.left, rawX < -threshold);
    setDirection(directions.right, rawX > threshold);
    setDirection(directions.up, rawY < -threshold);
    setDirection(directions.down, rawY > threshold);
  };

  const releaseStick = () => {
    Object.values(directions).forEach(release);
    stickPointer = null;
    if (stick) stick.classList.remove("is-active");
    if (knob) knob.style.transform = "translate(-50%, -50%)";
  };

  if (stick) {
    stick.addEventListener("pointerdown", event => {
      event.preventDefault();
      if (stickPointer !== null) return;
      stickPointer = event.pointerId;
      try { stick.setPointerCapture(event.pointerId); } catch (_) {}
      stick.classList.add("is-active");
      target().focus?.();
      updateStick(event);
    });
    stick.addEventListener("pointermove", event => {
      if (event.pointerId === stickPointer) updateStick(event);
    });
    stick.addEventListener("pointerup", event => {
      if (event.pointerId === stickPointer) releaseStick();
    });
    stick.addEventListener("pointercancel", releaseStick);
    stick.addEventListener("lostpointercapture", releaseStick);
    stick.addEventListener("contextmenu", event => event.preventDefault());
  }

  const releaseAll = () => {
    releaseStick();
    [...held.keys()].forEach(release);
  };
  window.addEventListener("blur", releaseAll);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) releaseAll();
  });
  document.body.appendChild(root);
})();
