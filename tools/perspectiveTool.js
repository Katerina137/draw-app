function PerspectiveTool() {
    this.icon = "assets/perspectivetool.png";
    this.name = "Perspective Grid (SPACE toggles overlay)";

    this.overlayVisible = false;

    this.gridDivisions = 5;
    this.gridAlpha = 0.2;
    this.h = 0;
    this.topBase = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
    this.botBase = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
    this.vp = [{ x: 0, y: 0 }, { x: 0, y: 0 }];

    // DOM overlay canvas + ctx
    this.overlayCanvas = null;
    this.ctx = null;

    // Utility: find the main p5 canvas element
    const getMainCanvas = () =>
        (window._renderer && window._renderer.canvas) ||
        document.querySelector('canvas'); // fallback if not in instance mode

    // Create overlay canvas stacked above main
    const ensureOverlayCanvas = () => {
        if (this.overlayCanvas) return;
        const main = getMainCanvas();
        if (!main) return;

        const parent = main.parentNode || document.body;
        const ov = document.createElement('canvas');
        ov.style.position = 'absolute';
        ov.style.left = main.style.left || '0';
        ov.style.top = main.style.top || '0';
        ov.style.pointerEvents = 'none';
        ov.style.zIndex = (parseInt(main.style.zIndex || '0', 10) + 1).toString();
        parent.appendChild(ov);

        this.overlayCanvas = ov;
        this.ctx = ov.getContext('2d');
    };

    // Handle HiDPI so lines look crisp
    const resizeOverlayCanvas = (w, h) => {
        if (!this.overlayCanvas) return;
        const dpr = window.devicePixelRatio || 1;
        this.overlayCanvas.width = Math.floor(w * dpr);
        this.overlayCanvas.height = Math.floor(h * dpr);
        this.overlayCanvas.style.width = w + 'px';
        this.overlayCanvas.style.height = h + 'px';
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    this.onSelect = () => {
        ensureOverlayCanvas();
        this.onResize(width, height);
    };

    this.onResize = (w, h) => {
        ensureOverlayCanvas();
        resizeOverlayCanvas(w, h);

        this.h = Math.round(h * 0.6);
        const sidePad = Math.round(w * 0.02);
        const topY = 2;
        const botY = h - 2;
        this.topBase[0] = { x: sidePad, y: topY };
        this.topBase[1] = { x: w - sidePad, y: topY };
        this.botBase[0] = { x: sidePad, y: botY };
        this.botBase[1] = { x: w - sidePad, y: botY };
        const vpInset = Math.max(24, Math.round(w * 0.025));
        this.vp[0] = { x: vpInset, y: this.h };
        this.vp[1] = { x: w - vpInset, y: this.h };

        this.redrawOverlay();
    };

    const stroke = (rgba, w = 1) => {
        this.ctx.strokeStyle = rgba;
        this.ctx.lineWidth = w;
        this.ctx.lineCap = 'butt';
        this.ctx.lineJoin = 'miter';
    };

    const fill = (rgba) => { this.ctx.fillStyle = rgba; };

    const line2d = (x1, y1, x2, y2) => {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    };

    const circle2d = (cx, cy, r) => {
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
    };

    const drawFan = (A, B, vpL, vpR) => {
        const dx = B.x - A.x, dy = B.y - A.y;
        const seg = Math.hypot(dx, dy); if (seg <= 0.0001) return;
        const ux = dx / seg, uy = dy / seg;
        const step = seg / this.gridDivisions;
        const ext = this.gridDivisions * 3;

        stroke(`rgba(120,200,255,${this.gridAlpha})`, 1);
        for (let i = -ext; i <= ext; i++) {
            const px = A.x + ux * step * i;
            const py = A.y + uy * step * i;
            line2d(px, py, vpL.x, vpL.y);
            line2d(px, py, vpR.x, vpR.y);
        }
        stroke(`rgba(90,160,255,0.82)`, 1.25);
        line2d(A.x, A.y, B.x, B.y);
    };

    this.onKeyPressed = (kc) => {
        if (kc === 32) {
            this.overlayVisible = !this.overlayVisible;
            if (this.overlayCanvas) {
                this.overlayCanvas.style.display = this.overlayVisible ? 'block' : 'none';
            }
            if (this.overlayVisible) this.redrawOverlay();
            return true;
        }
        return false;
    };

    this.redrawOverlay = () => {
        if (!this.overlayCanvas || !this.ctx) return;
        const w = parseInt(this.overlayCanvas.style.width) || this.overlayCanvas.width;
        const h = parseInt(this.overlayCanvas.style.height) || this.overlayCanvas.height;

        // Clear fully (doesn't touch main canvas)
        this.ctx.clearRect(0, 0, w, h);
        if (!this.overlayVisible) return;

        // Horizon
        stroke(`rgba(90,160,255,0.86)`, 1);
        line2d(-1e6, this.h, 1e6, this.h);

        // Grid fans
        drawFan(this.topBase[0], this.topBase[1], this.vp[0], this.vp[1]);
        drawFan(this.botBase[0], this.botBase[1], this.vp[0], this.vp[1]);

        // Vanishing points
        fill(`rgba(26,208,255,0.9)`);
        stroke(`rgba(10,20,30,0.9)`, 2);
        circle2d(this.vp[0].x, this.vp[0].y, 7);
        circle2d(this.vp[1].x, this.vp[1].y, 7);

    };

    // Nothing is drawn to the main canvas anymore
    this.draw = () => {
        fill(0);
        textAlign(CENTER);
        textSize(18);
        text("Press SPACE to toggle Perspective Grid (Erase)", width / 2, height - 20);
    };
    this.populateOptions = () => { };
}

