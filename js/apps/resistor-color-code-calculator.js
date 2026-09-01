/* Resistor Color Code Calculator
 * Vertical "reel" style color pickers with seamless infinite looping,
 * synced to an editable ohms field and a live SVG resistor diagram.
 */
(function () {
    'use strict';

    // Must match the CSS custom property --picker-item-height and the
    // 3-row height (calc(item-height * 3)) set on .band-picker.
    var ITEM_HEIGHT = 56;
    var VISIBLE_ROWS = 3;
    var CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ROWS;

    // Cloned copies of each color list rendered back-to-back so the picker
    // can scroll "infinitely" without ever reaching the real start/end.
    var COPIES = 9;
    var MIDDLE_COPY = Math.floor(COPIES / 2);

    var REDUCE_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var DIGIT_COLORS = [
        { name: 'Black', hex: '#000000', value: 0, label: '0' },
        { name: 'Brown', hex: '#8B4513', value: 1, label: '1' },
        { name: 'Red', hex: '#E4211C', value: 2, label: '2' },
        { name: 'Orange', hex: '#F2811D', value: 3, label: '3' },
        { name: 'Yellow', hex: '#F4D03F', value: 4, label: '4' },
        { name: 'Green', hex: '#149652', value: 5, label: '5' },
        { name: 'Blue', hex: '#1F5FBF', value: 6, label: '6' },
        { name: 'Violet', hex: '#8E44AD', value: 7, label: '7' },
        { name: 'Gray', hex: '#95A5A6', value: 8, label: '8' },
        { name: 'White', hex: '#FFFFFF', value: 9, label: '9' }
    ];

    var MULTIPLIER_COLORS = [
        { name: 'Silver', hex: '#C0C0C0', value: -2, label: '\u00D70.01' },
        { name: 'Gold', hex: '#D4AF37', value: -1, label: '\u00D70.1' },
        { name: 'Black', hex: '#000000', value: 0, label: '\u00D71' },
        { name: 'Brown', hex: '#8B4513', value: 1, label: '\u00D710' },
        { name: 'Red', hex: '#E4211C', value: 2, label: '\u00D7100' },
        { name: 'Orange', hex: '#F2811D', value: 3, label: '\u00D71k' },
        { name: 'Yellow', hex: '#F4D03F', value: 4, label: '\u00D710k' },
        { name: 'Green', hex: '#149652', value: 5, label: '\u00D7100k' },
        { name: 'Blue', hex: '#1F5FBF', value: 6, label: '\u00D71M' },
        { name: 'Violet', hex: '#8E44AD', value: 7, label: '\u00D710M' },
        { name: 'Gray', hex: '#95A5A6', value: 8, label: '\u00D7100M' },
        { name: 'White', hex: '#FFFFFF', value: 9, label: '\u00D71G' }
    ];

    var TOLERANCE_COLORS = [
        { name: 'Gray', hex: '#95A5A6', value: 0.05, label: '\u00B10.05%' },
        { name: 'Violet', hex: '#8E44AD', value: 0.1, label: '\u00B10.1%' },
        { name: 'Blue', hex: '#1F5FBF', value: 0.25, label: '\u00B10.25%' },
        { name: 'Green', hex: '#149652', value: 0.5, label: '\u00B10.5%' },
        { name: 'Brown', hex: '#8B4513', value: 1, label: '\u00B11%' },
        { name: 'Red', hex: '#E4211C', value: 2, label: '\u00B12%' },
        { name: 'Gold', hex: '#D4AF37', value: 5, label: '\u00B15%' },
        { name: 'Silver', hex: '#C0C0C0', value: 10, label: '\u00B110%' }
    ];

    var MULT_EXP_MIN = MULTIPLIER_COLORS[0].value;
    var MULT_EXP_MAX = MULTIPLIER_COLORS[MULTIPLIER_COLORS.length - 1].value;

    /* ---------- math / formatting helpers ---------- */

    function mantissaFromDigits(digits) {
        var mantissa = 0;
        for (var i = 0; i < digits.length; i++) { mantissa = mantissa * 10 + digits[i]; }
        return mantissa;
    }

    function computeResistance(digits, exp) {
        return mantissaFromDigits(digits) * Math.pow(10, exp);
    }

    // Finds the (digits[], exponent) combination whose resistance is closest
    // to the requested value, since only `digitCount` significant figures are
    // representable on a resistor's color bands.
    function decompose(value, digitCount) {
        value = Math.max(0, value || 0);
        if (value === 0) {
            return { digits: new Array(digitCount).fill(0), exp: 0, result: 0 };
        }
        var combos = Math.pow(10, digitCount);
        var best = null;
        for (var exp = MULT_EXP_MIN; exp <= MULT_EXP_MAX; exp++) {
            var factor = Math.pow(10, exp);
            for (var n = 0; n < combos; n++) {
                var digits = [];
                var rem = n;
                for (var d = digitCount - 1; d >= 0; d--) {
                    digits[d] = rem % 10;
                    rem = Math.floor(rem / 10);
                }
                var result = mantissaFromDigits(digits) * factor;
                var err = Math.abs(result - value);
                if (!best || err < best.err - 1e-9) {
                    best = { digits: digits, exp: exp, result: result, err: err };
                }
            }
        }
        return best;
    }

    function trimNumber(n) {
        return parseFloat(n.toFixed(3)).toString();
    }

    function formatOhms(value) {
        if (!isFinite(value)) { return '\u2014'; }
        var abs = Math.abs(value);
        if (abs >= 1e9) { return trimNumber(value / 1e9) + ' G\u03A9'; }
        if (abs >= 1e6) { return trimNumber(value / 1e6) + ' M\u03A9'; }
        if (abs >= 1e3) { return trimNumber(value / 1e3) + ' k\u03A9'; }
        return trimNumber(value) + ' \u03A9';
    }

    function formatPlainOhms(value) {
        if (!isFinite(value)) { return '0'; }
        return (Math.round(value * 1e6) / 1e6).toString();
    }

    // Accepts plain numbers and electronics shorthand: "4700", "4.7k", "4k7",
    // "2.2M", "1M2". A lone "m"/"M" suffix is treated as mega, since resistor
    // values are essentially never quoted in milliohms.
    function parseOhmsInput(raw) {
        if (typeof raw !== 'string') { return null; }
        var s = raw.trim().replace(/,/g, '');
        if (!s) { return null; }
        s = s.replace(/(ohms?|\u03A9)$/i, '').trim();

        var shorthand = s.match(/^(\d+)\s*([kKmM])\s*(\d+)?$/);
        if (shorthand) {
            var combined = parseFloat(shorthand[1] + '.' + (shorthand[3] || '0'));
            return shorthand[2].toLowerCase() === 'k' ? combined * 1e3 : combined * 1e6;
        }

        var plain = s.match(/^(\d+(?:\.\d+)?)\s*([kKmM]?)$/);
        if (plain) {
            var num = parseFloat(plain[1]);
            var unit = plain[2].toLowerCase();
            if (unit === 'k') { return num * 1e3; }
            if (unit === 'm') { return num * 1e6; }
            return num;
        }

        return null;
    }

    function toleranceRange(value, percent) {
        var delta = value * (percent / 100);
        return { min: value - delta, max: value + delta };
    }

    function findIndexByValue(colors, value) {
        for (var i = 0; i < colors.length; i++) {
            if (colors[i].value === value) { return i; }
        }
        return 0;
    }

    /* ---------- vertical infinite-scroll picker component ---------- */

    function createPicker(container, options) {
        var colors = options.colors;
        var n = colors.length;
        var onChange = options.onChange;

        container.setAttribute('role', 'listbox');
        container.setAttribute('aria-label', options.ariaLabel);
        container.innerHTML = '';
        container.tabIndex = 0;

        var items = [];
        var frag = document.createDocumentFragment();
        for (var c = 0; c < COPIES; c++) {
            for (var i = 0; i < n; i++) {
                items.push(buildSwatch(colors[i], c * n + i));
            }
        }
        function buildSwatch(color, flatIndex) {
            var el = document.createElement('div');
            el.className = 'swatch';
            el.setAttribute('role', 'option');
            el.setAttribute('aria-label', color.name + ' ' + color.label);
            var chip = document.createElement('span');
            chip.className = 'swatch-chip';
            chip.style.background = color.hex;
            var text = document.createElement('span');
            text.className = 'swatch-text';
            text.innerHTML = '<span class="swatch-name">' + color.name + '</span>' +
                '<span class="swatch-label">' + color.label + '</span>';
            el.appendChild(chip);
            el.appendChild(text);
            el.addEventListener('click', function () {
                scrollToFlat(flatIndex, true);
            });
            frag.appendChild(el);
            return el;
        }
        container.appendChild(frag);

        var currentIndex = ((options.initialIndex % n) + n) % n;
        var settleTimer = null;
        var rafPending = false;

        function flatFromScrollTop(scrollTop) {
            return Math.round((scrollTop + (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2) / ITEM_HEIGHT);
        }

        function scrollTopFromFlat(flat) {
            return flat * ITEM_HEIGHT - (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2;
        }

        function scrollToFlat(flat, animate) {
            container.scrollTo({
                top: scrollTopFromFlat(flat),
                behavior: (animate && !REDUCE_MOTION) ? 'smooth' : 'auto'
            });
        }

        function updateAriaSelected(flat) {
            for (var idx = 0; idx < items.length; idx++) {
                items[idx].setAttribute('aria-selected', idx === flat ? 'true' : 'false');
            }
        }

        function onScroll() {
            var scrollTop = container.scrollTop;
            var flat = flatFromScrollTop(scrollTop);
            var localIndex = ((flat % n) + n) % n;

            if (localIndex !== currentIndex) {
                currentIndex = localIndex;
                updateAriaSelected(flat);
                onChange(localIndex, { settled: false });
            }

            // Keep the scroll position within the safe inner copies so the
            // real start/end of the list is never reached mid-interaction.
            var copy = Math.floor(flat / n);
            if (copy <= 0) {
                container.scrollTop = scrollTop + n * ITEM_HEIGHT;
            } else if (copy >= COPIES - 1) {
                container.scrollTop = scrollTop - n * ITEM_HEIGHT;
            }

            clearTimeout(settleTimer);
            settleTimer = setTimeout(settle, 110);
        }

        function settle() {
            var flat = flatFromScrollTop(container.scrollTop);
            var localIndex = ((flat % n) + n) % n;
            currentIndex = localIndex;
            // Re-center into the middle copy (identical content, so the
            // jump is visually invisible) to keep buffer for future scrolls.
            var targetFlat = MIDDLE_COPY * n + localIndex;
            container.scrollTop = scrollTopFromFlat(targetFlat);
            updateAriaSelected(targetFlat);
            onChange(localIndex, { settled: true });
        }

        container.addEventListener('scroll', function () {
            if (rafPending) { return; }
            rafPending = true;
            requestAnimationFrame(function () {
                rafPending = false;
                onScroll();
            });
        });
        container.addEventListener('scrollend', function () {
            clearTimeout(settleTimer);
            settle();
        });

        container.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown') { e.preventDefault(); setIndex((currentIndex + 1) % n); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setIndex((currentIndex - 1 + n) % n); }
            else if (e.key === 'Home') { e.preventDefault(); setIndex(0); }
            else if (e.key === 'End') { e.preventDefault(); setIndex(n - 1); }
        });

        function setIndex(targetLocal, opts) {
            var animate = !opts || opts.animate !== false;
            var currentFlat = flatFromScrollTop(container.scrollTop);
            var baseCopy = Math.floor(currentFlat / n);

            var bestFlat = null;
            var bestDist = Infinity;
            for (var dc = -1; dc <= 1; dc++) {
                var candidateCopy = baseCopy + dc;
                if (candidateCopy < 0 || candidateCopy >= COPIES) { continue; }
                var candidateFlat = candidateCopy * n + targetLocal;
                var dist = Math.abs(candidateFlat - currentFlat);
                if (dist < bestDist) { bestDist = dist; bestFlat = candidateFlat; }
            }

            scrollToFlat(bestFlat, animate);
            currentIndex = targetLocal;
            onChange(targetLocal, { settled: true });
        }

        // Initial placement, centered in the middle copy, no animation.
        container.scrollTop = scrollTopFromFlat(MIDDLE_COPY * n + currentIndex);
        updateAriaSelected(MIDDLE_COPY * n + currentIndex);
        onChange(currentIndex, { settled: true });

        return { setIndex: setIndex, getIndex: function () { return currentIndex; } };
    }

    /* ---------- app wiring ---------- */

    function init() {
        var root = document.querySelector('[data-resistor-calculator]');
        if (!root) { return; }

        var els = {
            digit1: root.querySelector('[data-picker="digit1"]'),
            digit2: root.querySelector('[data-picker="digit2"]'),
            digit3: root.querySelector('[data-picker="digit3"]'),
            multiplier: root.querySelector('[data-picker="multiplier"]'),
            tolerance: root.querySelector('[data-picker="tolerance"]'),
            digit3Column: root.querySelector('[data-digit3-column]'),
            ohmsInput: root.querySelector('[data-ohms-input]'),
            friendly: root.querySelector('[data-readout-friendly]'),
            toleranceReadout: root.querySelector('[data-readout-tolerance]'),
            announcer: root.querySelector('[data-announcer]'),
            resetBtn: root.querySelector('[data-reset-btn]'),
            modeRadios: root.querySelectorAll('input[name="band-mode"]'),
            svg: root.querySelector('[data-resistor-svg]'),
            fullscreenToggle: root.querySelector('[data-fullscreen-toggle]')
        };

        var svgBands = els.svg ? {
            d1: els.svg.querySelector('[data-band="d1"]'),
            d2: els.svg.querySelector('[data-band="d2"]'),
            d3: els.svg.querySelector('[data-band="d3"]'),
            mult: els.svg.querySelector('[data-band="mult"]'),
            tol: els.svg.querySelector('[data-band="tol"]')
        } : null;

        // 3-band mode = 3 color bands + tolerance (4 total); 4-band mode adds a
        // 3rd precision digit = 4 color bands + tolerance (5 total).
        var BAND_X_4TOTAL = { d1: 108, d2: 138, mult: 168, tol: 244 };
        var BAND_X_5TOTAL = { d1: 92, d2: 120, d3: 148, mult: 176, tol: 244 };

        var DEFAULT_DIGIT1 = DIGIT_COLORS[4]; // Yellow
        var DEFAULT_DIGIT2 = DIGIT_COLORS[7]; // Violet
        var DEFAULT_DIGIT3 = DIGIT_COLORS[0]; // Black
        var DEFAULT_MULT = MULTIPLIER_COLORS[findIndexByValue(MULTIPLIER_COLORS, 2)]; // Red (x100)
        var DEFAULT_TOL = TOLERANCE_COLORS[findIndexByValue(TOLERANCE_COLORS, 5)]; // Gold (5%)

        var state = {
            mode: '3band',
            digit1: DEFAULT_DIGIT1,
            digit2: DEFAULT_DIGIT2,
            digit3: DEFAULT_DIGIT3,
            multiplier: DEFAULT_MULT,
            tolerance: DEFAULT_TOL
        };

        function activeDigits() {
            return state.mode === '4band'
                ? [state.digit1.value, state.digit2.value, state.digit3.value]
                : [state.digit1.value, state.digit2.value];
        }

        function currentResistance() {
            return computeResistance(activeDigits(), state.multiplier.value);
        }

        function repositionBands() {
            if (!svgBands) { return; }
            var is4Band = state.mode === '4band';
            var pos = is4Band ? BAND_X_5TOTAL : BAND_X_4TOTAL;
            svgBands.d1.setAttribute('x', pos.d1);
            svgBands.d2.setAttribute('x', pos.d2);
            svgBands.mult.setAttribute('x', pos.mult);
            svgBands.tol.setAttribute('x', pos.tol);
            if (is4Band) {
                svgBands.d3.setAttribute('x', pos.d3);
                svgBands.d3.style.display = '';
            } else {
                svgBands.d3.style.display = 'none';
            }
        }

        function updateSvgColors() {
            if (!svgBands) { return; }
            svgBands.d1.setAttribute('fill', state.digit1.hex);
            svgBands.d2.setAttribute('fill', state.digit2.hex);
            svgBands.d3.setAttribute('fill', state.digit3.hex);
            svgBands.mult.setAttribute('fill', state.multiplier.hex);
            svgBands.tol.setAttribute('fill', state.tolerance.hex);
        }

        function recalc(meta) {
            var resistance = currentResistance();
            var pct = state.tolerance.value;
            updateSvgColors();

            if (els.friendly) { els.friendly.textContent = '\u2248 ' + formatOhms(resistance); }
            if (els.toleranceReadout) {
                var range = toleranceRange(resistance, pct);
                els.toleranceReadout.textContent =
                    '\u00B1' + pct + '%  \u2192  ' + formatOhms(range.min) + ' \u2013 ' + formatOhms(range.max);
            }

            if (meta && meta.settled) {
                if (els.ohmsInput && document.activeElement !== els.ohmsInput) {
                    els.ohmsInput.value = formatPlainOhms(resistance);
                }
                if (els.announcer) {
                    els.announcer.textContent =
                        formatPlainOhms(resistance) + ' ohms, approximately ' + formatOhms(resistance) +
                        ', tolerance plus or minus ' + pct + ' percent';
                }
            }
        }

        var pickers = {
            digit1: createPicker(els.digit1, {
                colors: DIGIT_COLORS,
                initialIndex: DIGIT_COLORS.indexOf(state.digit1),
                ariaLabel: 'First digit band',
                onChange: function (idx, meta) { state.digit1 = DIGIT_COLORS[idx]; recalc(meta); }
            }),
            digit2: createPicker(els.digit2, {
                colors: DIGIT_COLORS,
                initialIndex: DIGIT_COLORS.indexOf(state.digit2),
                ariaLabel: 'Second digit band',
                onChange: function (idx, meta) { state.digit2 = DIGIT_COLORS[idx]; recalc(meta); }
            }),
            digit3: createPicker(els.digit3, {
                colors: DIGIT_COLORS,
                initialIndex: DIGIT_COLORS.indexOf(state.digit3),
                ariaLabel: 'Third digit band',
                onChange: function (idx, meta) { state.digit3 = DIGIT_COLORS[idx]; recalc(meta); }
            }),
            multiplier: createPicker(els.multiplier, {
                colors: MULTIPLIER_COLORS,
                initialIndex: MULTIPLIER_COLORS.indexOf(state.multiplier),
                ariaLabel: 'Multiplier band',
                onChange: function (idx, meta) { state.multiplier = MULTIPLIER_COLORS[idx]; recalc(meta); }
            }),
            tolerance: createPicker(els.tolerance, {
                colors: TOLERANCE_COLORS,
                initialIndex: TOLERANCE_COLORS.indexOf(state.tolerance),
                ariaLabel: 'Tolerance band',
                onChange: function (idx, meta) { state.tolerance = TOLERANCE_COLORS[idx]; recalc(meta); }
            })
        };

        function applyMode() {
            var is4Band = state.mode === '4band';
            // The 3rd digit column only applies to 4-band (5-total) mode.
            if (els.digit3Column) { els.digit3Column.hidden = !is4Band; }
            repositionBands();
            recalc({ settled: true });
        }

        applyMode();

        for (var r = 0; r < els.modeRadios.length; r++) {
            els.modeRadios[r].addEventListener('change', function (e) {
                state.mode = e.target.value;
                applyMode();
            });
        }

        function flashInvalid(el) {
            el.classList.add('invalid');
            setTimeout(function () { el.classList.remove('invalid'); }, 400);
        }

        function commitOhmsInput() {
            if (!els.ohmsInput) { return; }
            var parsed = parseOhmsInput(els.ohmsInput.value);
            if (parsed === null || parsed < 0) {
                flashInvalid(els.ohmsInput);
                els.ohmsInput.value = formatPlainOhms(currentResistance());
                return;
            }
            var digitCount = state.mode === '4band' ? 3 : 2;
            var best = decompose(parsed, digitCount);
            pickers.digit1.setIndex(findIndexByValue(DIGIT_COLORS, best.digits[0]));
            pickers.digit2.setIndex(findIndexByValue(DIGIT_COLORS, best.digits[1]));
            if (digitCount === 3) {
                pickers.digit3.setIndex(findIndexByValue(DIGIT_COLORS, best.digits[2]));
            }
            pickers.multiplier.setIndex(findIndexByValue(MULTIPLIER_COLORS, best.exp));
            els.ohmsInput.value = formatPlainOhms(best.result);
        }

        if (els.ohmsInput) {
            els.ohmsInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') { e.preventDefault(); commitOhmsInput(); els.ohmsInput.blur(); }
            });
            els.ohmsInput.addEventListener('blur', commitOhmsInput);
        }

        if (els.resetBtn) {
            els.resetBtn.addEventListener('click', function () {
                state.mode = '3band';
                for (var m = 0; m < els.modeRadios.length; m++) {
                    els.modeRadios[m].checked = (els.modeRadios[m].value === '3band');
                }
                pickers.digit1.setIndex(DIGIT_COLORS.indexOf(DEFAULT_DIGIT1));
                pickers.digit2.setIndex(DIGIT_COLORS.indexOf(DEFAULT_DIGIT2));
                pickers.digit3.setIndex(DIGIT_COLORS.indexOf(DEFAULT_DIGIT3));
                pickers.multiplier.setIndex(MULTIPLIER_COLORS.indexOf(DEFAULT_MULT));
                pickers.tolerance.setIndex(TOLERANCE_COLORS.indexOf(DEFAULT_TOL));
                applyMode();
            });
        }

        if (els.fullscreenToggle) {
            var setFullscreenUi = function (active) {
                document.body.classList.toggle('tool-fullscreen', active);
                els.fullscreenToggle.setAttribute('aria-pressed', String(active));
                var icon = els.fullscreenToggle.querySelector('i');
                if (icon) { icon.className = active ? 'fa-solid fa-compress' : 'fa-solid fa-expand'; }
            };

            els.fullscreenToggle.addEventListener('click', function () {
                setFullscreenUi(!document.body.classList.contains('tool-fullscreen'));
            });

            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && document.body.classList.contains('tool-fullscreen')) {
                    setFullscreenUi(false);
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
