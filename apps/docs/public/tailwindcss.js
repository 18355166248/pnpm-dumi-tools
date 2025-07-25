(() => {
  var Sb = Object.create;
  var li = Object.defineProperty;
  var Cb = Object.getOwnPropertyDescriptor;
  var Ab = Object.getOwnPropertyNames;
  var _b = Object.getPrototypeOf,
    Eb = Object.prototype.hasOwnProperty;
  var uu = (i) => li(i, '__esModule', { value: !0 });
  var fu = (i) => {
    if (typeof require != 'undefined') return require(i);
    throw new Error('Dynamic require of "' + i + '" is not supported');
  };
  var C = (i, e) => () => (i && (e = i((i = 0))), e);
  var v = (i, e) => () => (e || i((e = { exports: {} }).exports, e), e.exports),
    Ae = (i, e) => {
      uu(i);
      for (var t in e) li(i, t, { get: e[t], enumerable: !0 });
    },
    Ob = (i, e, t) => {
      if ((e && typeof e == 'object') || typeof e == 'function')
        for (let r of Ab(e))
          !Eb.call(i, r) &&
            r !== 'default' &&
            li(i, r, {
              get: () => e[r],
              enumerable: !(t = Cb(e, r)) || t.enumerable,
            });
      return i;
    },
    K = (i) =>
      Ob(
        uu(
          li(
            i != null ? Sb(_b(i)) : {},
            'default',
            i && i.__esModule && 'default' in i
              ? { get: () => i.default, enumerable: !0 }
              : { value: i, enumerable: !0 },
          ),
        ),
        i,
      );
  var m,
    l = C(() => {
      m = { platform: '', env: {}, versions: { node: '14.17.6' } };
    });
  var Tb,
    te,
    ze = C(() => {
      l();
      (Tb = 0),
        (te = {
          readFileSync: (i) => self[i] || '',
          statSync: () => ({ mtimeMs: Tb++ }),
          promises: { readFile: (i) => Promise.resolve(self[i] || '') },
        });
    });
  var Xn = v((X5, pu) => {
    l();
    ('use strict');
    var cu = class {
      constructor(e = {}) {
        if (!(e.maxSize && e.maxSize > 0))
          throw new TypeError('`maxSize` must be a number greater than 0');
        if (typeof e.maxAge == 'number' && e.maxAge === 0)
          throw new TypeError('`maxAge` must be a number greater than 0');
        (this.maxSize = e.maxSize),
          (this.maxAge = e.maxAge || 1 / 0),
          (this.onEviction = e.onEviction),
          (this.cache = new Map()),
          (this.oldCache = new Map()),
          (this._size = 0);
      }
      _emitEvictions(e) {
        if (typeof this.onEviction == 'function')
          for (let [t, r] of e) this.onEviction(t, r.value);
      }
      _deleteIfExpired(e, t) {
        return typeof t.expiry == 'number' && t.expiry <= Date.now()
          ? (typeof this.onEviction == 'function' &&
              this.onEviction(e, t.value),
            this.delete(e))
          : !1;
      }
      _getOrDeleteIfExpired(e, t) {
        if (this._deleteIfExpired(e, t) === !1) return t.value;
      }
      _getItemValue(e, t) {
        return t.expiry ? this._getOrDeleteIfExpired(e, t) : t.value;
      }
      _peek(e, t) {
        let r = t.get(e);
        return this._getItemValue(e, r);
      }
      _set(e, t) {
        this.cache.set(e, t),
          this._size++,
          this._size >= this.maxSize &&
            ((this._size = 0),
            this._emitEvictions(this.oldCache),
            (this.oldCache = this.cache),
            (this.cache = new Map()));
      }
      _moveToRecent(e, t) {
        this.oldCache.delete(e), this._set(e, t);
      }
      *_entriesAscending() {
        for (let e of this.oldCache) {
          let [t, r] = e;
          this.cache.has(t) ||
            (this._deleteIfExpired(t, r) === !1 && (yield e));
        }
        for (let e of this.cache) {
          let [t, r] = e;
          this._deleteIfExpired(t, r) === !1 && (yield e);
        }
      }
      get(e) {
        if (this.cache.has(e)) {
          let t = this.cache.get(e);
          return this._getItemValue(e, t);
        }
        if (this.oldCache.has(e)) {
          let t = this.oldCache.get(e);
          if (this._deleteIfExpired(e, t) === !1)
            return this._moveToRecent(e, t), t.value;
        }
      }
      set(
        e,
        t,
        {
          maxAge: r = this.maxAge === 1 / 0 ? void 0 : Date.now() + this.maxAge,
        } = {},
      ) {
        this.cache.has(e)
          ? this.cache.set(e, { value: t, maxAge: r })
          : this._set(e, { value: t, expiry: r });
      }
      has(e) {
        return this.cache.has(e)
          ? !this._deleteIfExpired(e, this.cache.get(e))
          : this.oldCache.has(e)
          ? !this._deleteIfExpired(e, this.oldCache.get(e))
          : !1;
      }
      peek(e) {
        if (this.cache.has(e)) return this._peek(e, this.cache);
        if (this.oldCache.has(e)) return this._peek(e, this.oldCache);
      }
      delete(e) {
        let t = this.cache.delete(e);
        return t && this._size--, this.oldCache.delete(e) || t;
      }
      clear() {
        this.cache.clear(), this.oldCache.clear(), (this._size = 0);
      }
      resize(e) {
        if (!(e && e > 0))
          throw new TypeError('`maxSize` must be a number greater than 0');
        let t = [...this._entriesAscending()],
          r = t.length - e;
        r < 0
          ? ((this.cache = new Map(t)),
            (this.oldCache = new Map()),
            (this._size = t.length))
          : (r > 0 && this._emitEvictions(t.slice(0, r)),
            (this.oldCache = new Map(t.slice(r))),
            (this.cache = new Map()),
            (this._size = 0)),
          (this.maxSize = e);
      }
      *keys() {
        for (let [e] of this) yield e;
      }
      *values() {
        for (let [, e] of this) yield e;
      }
      *[Symbol.iterator]() {
        for (let e of this.cache) {
          let [t, r] = e;
          this._deleteIfExpired(t, r) === !1 && (yield [t, r.value]);
        }
        for (let e of this.oldCache) {
          let [t, r] = e;
          this.cache.has(t) ||
            (this._deleteIfExpired(t, r) === !1 && (yield [t, r.value]));
        }
      }
      *entriesDescending() {
        let e = [...this.cache];
        for (let t = e.length - 1; t >= 0; --t) {
          let r = e[t],
            [n, a] = r;
          this._deleteIfExpired(n, a) === !1 && (yield [n, a.value]);
        }
        e = [...this.oldCache];
        for (let t = e.length - 1; t >= 0; --t) {
          let r = e[t],
            [n, a] = r;
          this.cache.has(n) ||
            (this._deleteIfExpired(n, a) === !1 && (yield [n, a.value]));
        }
      }
      *entriesAscending() {
        for (let [e, t] of this._entriesAscending()) yield [e, t.value];
      }
      get size() {
        if (!this._size) return this.oldCache.size;
        let e = 0;
        for (let t of this.oldCache.keys()) this.cache.has(t) || e++;
        return Math.min(this._size + e, this.maxSize);
      }
    };
    pu.exports = cu;
  });
  var du,
    hu = C(() => {
      l();
      du = (i) => i && i._hash;
    });
  function ui(i) {
    return du(i, { ignoreUnknown: !0 });
  }
  var mu = C(() => {
    l();
    hu();
  });
  function Xe(i) {
    if (((i = `${i}`), i === '0')) return '0';
    if (/^[+-]?(\d+|\d*\.\d+)(e[+-]?\d+)?(%|\w+)?$/.test(i))
      return i.replace(/^[+-]?/, (t) => (t === '-' ? '' : '-'));
    let e = ['var', 'calc', 'min', 'max', 'clamp'];
    for (let t of e) if (i.includes(`${t}(`)) return `calc(${i} * -1)`;
  }
  var fi = C(() => {
    l();
  });
  var gu,
    yu = C(() => {
      l();
      gu = [
        'preflight',
        'container',
        'accessibility',
        'pointerEvents',
        'visibility',
        'position',
        'inset',
        'isolation',
        'zIndex',
        'order',
        'gridColumn',
        'gridColumnStart',
        'gridColumnEnd',
        'gridRow',
        'gridRowStart',
        'gridRowEnd',
        'float',
        'clear',
        'margin',
        'boxSizing',
        'lineClamp',
        'display',
        'aspectRatio',
        'height',
        'maxHeight',
        'minHeight',
        'width',
        'minWidth',
        'maxWidth',
        'flex',
        'flexShrink',
        'flexGrow',
        'flexBasis',
        'tableLayout',
        'captionSide',
        'borderCollapse',
        'borderSpacing',
        'transformOrigin',
        'translate',
        'rotate',
        'skew',
        'scale',
        'transform',
        'animation',
        'cursor',
        'touchAction',
        'userSelect',
        'resize',
        'scrollSnapType',
        'scrollSnapAlign',
        'scrollSnapStop',
        'scrollMargin',
        'scrollPadding',
        'listStylePosition',
        'listStyleType',
        'listStyleImage',
        'appearance',
        'columns',
        'breakBefore',
        'breakInside',
        'breakAfter',
        'gridAutoColumns',
        'gridAutoFlow',
        'gridAutoRows',
        'gridTemplateColumns',
        'gridTemplateRows',
        'flexDirection',
        'flexWrap',
        'placeContent',
        'placeItems',
        'alignContent',
        'alignItems',
        'justifyContent',
        'justifyItems',
        'gap',
        'space',
        'divideWidth',
        'divideStyle',
        'divideColor',
        'divideOpacity',
        'placeSelf',
        'alignSelf',
        'justifySelf',
        'overflow',
        'overscrollBehavior',
        'scrollBehavior',
        'textOverflow',
        'hyphens',
        'whitespace',
        'wordBreak',
        'borderRadius',
        'borderWidth',
        'borderStyle',
        'borderColor',
        'borderOpacity',
        'backgroundColor',
        'backgroundOpacity',
        'backgroundImage',
        'gradientColorStops',
        'boxDecorationBreak',
        'backgroundSize',
        'backgroundAttachment',
        'backgroundClip',
        'backgroundPosition',
        'backgroundRepeat',
        'backgroundOrigin',
        'fill',
        'stroke',
        'strokeWidth',
        'objectFit',
        'objectPosition',
        'padding',
        'textAlign',
        'textIndent',
        'verticalAlign',
        'fontFamily',
        'fontSize',
        'fontWeight',
        'textTransform',
        'fontStyle',
        'fontVariantNumeric',
        'lineHeight',
        'letterSpacing',
        'textColor',
        'textOpacity',
        'textDecoration',
        'textDecorationColor',
        'textDecorationStyle',
        'textDecorationThickness',
        'textUnderlineOffset',
        'fontSmoothing',
        'placeholderColor',
        'placeholderOpacity',
        'caretColor',
        'accentColor',
        'opacity',
        'backgroundBlendMode',
        'mixBlendMode',
        'boxShadow',
        'boxShadowColor',
        'outlineStyle',
        'outlineWidth',
        'outlineOffset',
        'outlineColor',
        'ringWidth',
        'ringColor',
        'ringOpacity',
        'ringOffsetWidth',
        'ringOffsetColor',
        'blur',
        'brightness',
        'contrast',
        'dropShadow',
        'grayscale',
        'hueRotate',
        'invert',
        'saturate',
        'sepia',
        'filter',
        'backdropBlur',
        'backdropBrightness',
        'backdropContrast',
        'backdropGrayscale',
        'backdropHueRotate',
        'backdropInvert',
        'backdropOpacity',
        'backdropSaturate',
        'backdropSepia',
        'backdropFilter',
        'transitionProperty',
        'transitionDelay',
        'transitionDuration',
        'transitionTimingFunction',
        'willChange',
        'content',
      ];
    });
  function wu(i, e) {
    return i === void 0
      ? e
      : Array.isArray(i)
      ? i
      : [
          ...new Set(
            e
              .filter((r) => i !== !1 && i[r] !== !1)
              .concat(Object.keys(i).filter((r) => i[r] !== !1)),
          ),
        ];
  }
  var bu = C(() => {
    l();
  });
  var vu = {};
  Ae(vu, { default: () => _e });
  var _e,
    ci = C(() => {
      l();
      _e = new Proxy({}, { get: () => String });
    });
  function Kn(i, e, t) {
    (typeof m != 'undefined' && m.env.JEST_WORKER_ID) ||
      (t && xu.has(t)) ||
      (t && xu.add(t),
      console.warn(''),
      e.forEach((r) => console.warn(i, '-', r)));
  }
  function Zn(i) {
    return _e.dim(i);
  }
  var xu,
    F,
    Ee = C(() => {
      l();
      ci();
      xu = new Set();
      F = {
        info(i, e) {
          Kn(_e.bold(_e.cyan('info')), ...(Array.isArray(i) ? [i] : [e, i]));
        },
        warn(i, e) {
          ['content-problems'].includes(i) ||
            Kn(
              _e.bold(_e.yellow('warn')),
              ...(Array.isArray(i) ? [i] : [e, i]),
            );
        },
        risk(i, e) {
          Kn(_e.bold(_e.magenta('risk')), ...(Array.isArray(i) ? [i] : [e, i]));
        },
      };
    });
  var ku = {};
  Ae(ku, { default: () => es });
  function nr({ version: i, from: e, to: t }) {
    F.warn(`${e}-color-renamed`, [
      `As of Tailwind CSS ${i}, \`${e}\` has been renamed to \`${t}\`.`,
      'Update your configuration file to silence this warning.',
    ]);
  }
  var es,
    ts = C(() => {
      l();
      Ee();
      es = {
        inherit: 'inherit',
        current: 'currentColor',
        transparent: 'transparent',
        black: '#000',
        white: '#fff',
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        zinc: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
        red: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        yellow: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006',
        },
        lime: {
          50: '#f7fee7',
          100: '#ecfccb',
          200: '#d9f99d',
          300: '#bef264',
          400: '#a3e635',
          500: '#84cc16',
          600: '#65a30d',
          700: '#4d7c0f',
          800: '#3f6212',
          900: '#365314',
          950: '#1a2e05',
        },
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        cyan: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        violet: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        fuchsia: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        get lightBlue() {
          return (
            nr({ version: 'v2.2', from: 'lightBlue', to: 'sky' }), this.sky
          );
        },
        get warmGray() {
          return (
            nr({ version: 'v3.0', from: 'warmGray', to: 'stone' }), this.stone
          );
        },
        get trueGray() {
          return (
            nr({ version: 'v3.0', from: 'trueGray', to: 'neutral' }),
            this.neutral
          );
        },
        get coolGray() {
          return (
            nr({ version: 'v3.0', from: 'coolGray', to: 'gray' }), this.gray
          );
        },
        get blueGray() {
          return (
            nr({ version: 'v3.0', from: 'blueGray', to: 'slate' }), this.slate
          );
        },
      };
    });
  function rs(i, ...e) {
    for (let t of e) {
      for (let r in t) i?.hasOwnProperty?.(r) || (i[r] = t[r]);
      for (let r of Object.getOwnPropertySymbols(t))
        i?.hasOwnProperty?.(r) || (i[r] = t[r]);
    }
    return i;
  }
  var Su = C(() => {
    l();
  });
  function Ke(i) {
    if (Array.isArray(i)) return i;
    let e = i.split('[').length - 1,
      t = i.split(']').length - 1;
    if (e !== t)
      throw new Error(`Path is invalid. Has unbalanced brackets: ${i}`);
    return i.split(/\.(?![^\[]*\])|[\[\]]/g).filter(Boolean);
  }
  var pi = C(() => {
    l();
  });
  function J(i, e) {
    return di.future.includes(e)
      ? i.future === 'all' || (i?.future?.[e] ?? Cu[e] ?? !1)
      : di.experimental.includes(e)
      ? i.experimental === 'all' || (i?.experimental?.[e] ?? Cu[e] ?? !1)
      : !1;
  }
  function Au(i) {
    return i.experimental === 'all'
      ? di.experimental
      : Object.keys(i?.experimental ?? {}).filter(
          (e) => di.experimental.includes(e) && i.experimental[e],
        );
  }
  function _u(i) {
    if (m.env.JEST_WORKER_ID === void 0 && Au(i).length > 0) {
      let e = Au(i)
        .map((t) => _e.yellow(t))
        .join(', ');
      F.warn('experimental-flags-enabled', [
        `You have enabled experimental features: ${e}`,
        'Experimental features in Tailwind CSS are not covered by semver, may introduce breaking changes, and can change at any time.',
      ]);
    }
  }
  var Cu,
    di,
    De = C(() => {
      l();
      ci();
      Ee();
      (Cu = {
        optimizeUniversalDefaults: !1,
        generalizedModifiers: !0,
        get disableColorOpacityUtilitiesByDefault() {
          return !1;
        },
        get relativeContentPathsByDefault() {
          return !1;
        },
      }),
        (di = {
          future: [
            'hoverOnlyWhenSupported',
            'respectDefaultRingColorOpacity',
            'disableColorOpacityUtilitiesByDefault',
            'relativeContentPathsByDefault',
          ],
          experimental: ['optimizeUniversalDefaults', 'generalizedModifiers'],
        });
    });
  function Eu(i) {
    (() => {
      if (
        i.purge ||
        !i.content ||
        (!Array.isArray(i.content) &&
          !(typeof i.content == 'object' && i.content !== null))
      )
        return !1;
      if (Array.isArray(i.content))
        return i.content.every((t) =>
          typeof t == 'string'
            ? !0
            : !(
                typeof t?.raw != 'string' ||
                (t?.extension && typeof t?.extension != 'string')
              ),
        );
      if (typeof i.content == 'object' && i.content !== null) {
        if (
          Object.keys(i.content).some(
            (t) => !['files', 'relative', 'extract', 'transform'].includes(t),
          )
        )
          return !1;
        if (Array.isArray(i.content.files)) {
          if (
            !i.content.files.every((t) =>
              typeof t == 'string'
                ? !0
                : !(
                    typeof t?.raw != 'string' ||
                    (t?.extension && typeof t?.extension != 'string')
                  ),
            )
          )
            return !1;
          if (typeof i.content.extract == 'object') {
            for (let t of Object.values(i.content.extract))
              if (typeof t != 'function') return !1;
          } else if (
            !(
              i.content.extract === void 0 ||
              typeof i.content.extract == 'function'
            )
          )
            return !1;
          if (typeof i.content.transform == 'object') {
            for (let t of Object.values(i.content.transform))
              if (typeof t != 'function') return !1;
          } else if (
            !(
              i.content.transform === void 0 ||
              typeof i.content.transform == 'function'
            )
          )
            return !1;
          if (
            typeof i.content.relative != 'boolean' &&
            typeof i.content.relative != 'undefined'
          )
            return !1;
        }
        return !0;
      }
      return !1;
    })() ||
      F.warn('purge-deprecation', [
        'The `purge`/`content` options have changed in Tailwind CSS v3.0.',
        'Update your configuration file to eliminate this warning.',
        'https://tailwindcss.com/docs/upgrade-guide#configure-content-sources',
      ]),
      (i.safelist = (() => {
        let { content: t, purge: r, safelist: n } = i;
        return Array.isArray(n)
          ? n
          : Array.isArray(t?.safelist)
          ? t.safelist
          : Array.isArray(r?.safelist)
          ? r.safelist
          : Array.isArray(r?.options?.safelist)
          ? r.options.safelist
          : [];
      })()),
      (i.blocklist = (() => {
        let { blocklist: t } = i;
        if (Array.isArray(t)) {
          if (t.every((r) => typeof r == 'string')) return t;
          F.warn('blocklist-invalid', [
            'The `blocklist` option must be an array of strings.',
            'https://tailwindcss.com/docs/content-configuration#discarding-classes',
          ]);
        }
        return [];
      })()),
      typeof i.prefix == 'function'
        ? (F.warn('prefix-function', [
            'As of Tailwind CSS v3.0, `prefix` cannot be a function.',
            'Update `prefix` in your configuration to be a string to eliminate this warning.',
            'https://tailwindcss.com/docs/upgrade-guide#prefix-cannot-be-a-function',
          ]),
          (i.prefix = ''))
        : (i.prefix = i.prefix ?? ''),
      (i.content = {
        relative: (() => {
          let { content: t } = i;
          return t?.relative
            ? t.relative
            : J(i, 'relativeContentPathsByDefault');
        })(),
        files: (() => {
          let { content: t, purge: r } = i;
          return Array.isArray(r)
            ? r
            : Array.isArray(r?.content)
            ? r.content
            : Array.isArray(t)
            ? t
            : Array.isArray(t?.content)
            ? t.content
            : Array.isArray(t?.files)
            ? t.files
            : [];
        })(),
        extract: (() => {
          let t = (() =>
              i.purge?.extract
                ? i.purge.extract
                : i.content?.extract
                ? i.content.extract
                : i.purge?.extract?.DEFAULT
                ? i.purge.extract.DEFAULT
                : i.content?.extract?.DEFAULT
                ? i.content.extract.DEFAULT
                : i.purge?.options?.extractors
                ? i.purge.options.extractors
                : i.content?.options?.extractors
                ? i.content.options.extractors
                : {})(),
            r = {},
            n = (() => {
              if (i.purge?.options?.defaultExtractor)
                return i.purge.options.defaultExtractor;
              if (i.content?.options?.defaultExtractor)
                return i.content.options.defaultExtractor;
            })();
          if ((n !== void 0 && (r.DEFAULT = n), typeof t == 'function'))
            r.DEFAULT = t;
          else if (Array.isArray(t))
            for (let { extensions: a, extractor: s } of t ?? [])
              for (let o of a) r[o] = s;
          else typeof t == 'object' && t !== null && Object.assign(r, t);
          return r;
        })(),
        transform: (() => {
          let t = (() =>
              i.purge?.transform
                ? i.purge.transform
                : i.content?.transform
                ? i.content.transform
                : i.purge?.transform?.DEFAULT
                ? i.purge.transform.DEFAULT
                : i.content?.transform?.DEFAULT
                ? i.content.transform.DEFAULT
                : {})(),
            r = {};
          return (
            typeof t == 'function' && (r.DEFAULT = t),
            typeof t == 'object' && t !== null && Object.assign(r, t),
            r
          );
        })(),
      });
    for (let t of i.content.files)
      if (typeof t == 'string' && /{([^,]*?)}/g.test(t)) {
        F.warn('invalid-glob-braces', [
          `The glob pattern ${Zn(
            t,
          )} in your Tailwind CSS configuration is invalid.`,
          `Update it to ${Zn(
            t.replace(/{([^,]*?)}/g, '$1'),
          )} to silence this warning.`,
        ]);
        break;
      }
    return i;
  }
  var Ou = C(() => {
    l();
    De();
    Ee();
  });
  function ie(i) {
    if (Object.prototype.toString.call(i) !== '[object Object]') return !1;
    let e = Object.getPrototypeOf(i);
    return e === null || e === Object.prototype;
  }
  var xt = C(() => {
    l();
  });
  function Ze(i) {
    return Array.isArray(i)
      ? i.map((e) => Ze(e))
      : typeof i == 'object' && i !== null
      ? Object.fromEntries(Object.entries(i).map(([e, t]) => [e, Ze(t)]))
      : i;
  }
  var hi = C(() => {
    l();
  });
  function ht(i) {
    return i.replace(/\\,/g, '\\2c ');
  }
  var mi = C(() => {
    l();
  });
  var is,
    Tu = C(() => {
      l();
      is = {
        aliceblue: [240, 248, 255],
        antiquewhite: [250, 235, 215],
        aqua: [0, 255, 255],
        aquamarine: [127, 255, 212],
        azure: [240, 255, 255],
        beige: [245, 245, 220],
        bisque: [255, 228, 196],
        black: [0, 0, 0],
        blanchedalmond: [255, 235, 205],
        blue: [0, 0, 255],
        blueviolet: [138, 43, 226],
        brown: [165, 42, 42],
        burlywood: [222, 184, 135],
        cadetblue: [95, 158, 160],
        chartreuse: [127, 255, 0],
        chocolate: [210, 105, 30],
        coral: [255, 127, 80],
        cornflowerblue: [100, 149, 237],
        cornsilk: [255, 248, 220],
        crimson: [220, 20, 60],
        cyan: [0, 255, 255],
        darkblue: [0, 0, 139],
        darkcyan: [0, 139, 139],
        darkgoldenrod: [184, 134, 11],
        darkgray: [169, 169, 169],
        darkgreen: [0, 100, 0],
        darkgrey: [169, 169, 169],
        darkkhaki: [189, 183, 107],
        darkmagenta: [139, 0, 139],
        darkolivegreen: [85, 107, 47],
        darkorange: [255, 140, 0],
        darkorchid: [153, 50, 204],
        darkred: [139, 0, 0],
        darksalmon: [233, 150, 122],
        darkseagreen: [143, 188, 143],
        darkslateblue: [72, 61, 139],
        darkslategray: [47, 79, 79],
        darkslategrey: [47, 79, 79],
        darkturquoise: [0, 206, 209],
        darkviolet: [148, 0, 211],
        deeppink: [255, 20, 147],
        deepskyblue: [0, 191, 255],
        dimgray: [105, 105, 105],
        dimgrey: [105, 105, 105],
        dodgerblue: [30, 144, 255],
        firebrick: [178, 34, 34],
        floralwhite: [255, 250, 240],
        forestgreen: [34, 139, 34],
        fuchsia: [255, 0, 255],
        gainsboro: [220, 220, 220],
        ghostwhite: [248, 248, 255],
        gold: [255, 215, 0],
        goldenrod: [218, 165, 32],
        gray: [128, 128, 128],
        green: [0, 128, 0],
        greenyellow: [173, 255, 47],
        grey: [128, 128, 128],
        honeydew: [240, 255, 240],
        hotpink: [255, 105, 180],
        indianred: [205, 92, 92],
        indigo: [75, 0, 130],
        ivory: [255, 255, 240],
        khaki: [240, 230, 140],
        lavender: [230, 230, 250],
        lavenderblush: [255, 240, 245],
        lawngreen: [124, 252, 0],
        lemonchiffon: [255, 250, 205],
        lightblue: [173, 216, 230],
        lightcoral: [240, 128, 128],
        lightcyan: [224, 255, 255],
        lightgoldenrodyellow: [250, 250, 210],
        lightgray: [211, 211, 211],
        lightgreen: [144, 238, 144],
        lightgrey: [211, 211, 211],
        lightpink: [255, 182, 193],
        lightsalmon: [255, 160, 122],
        lightseagreen: [32, 178, 170],
        lightskyblue: [135, 206, 250],
        lightslategray: [119, 136, 153],
        lightslategrey: [119, 136, 153],
        lightsteelblue: [176, 196, 222],
        lightyellow: [255, 255, 224],
        lime: [0, 255, 0],
        limegreen: [50, 205, 50],
        linen: [250, 240, 230],
        magenta: [255, 0, 255],
        maroon: [128, 0, 0],
        mediumaquamarine: [102, 205, 170],
        mediumblue: [0, 0, 205],
        mediumorchid: [186, 85, 211],
        mediumpurple: [147, 112, 219],
        mediumseagreen: [60, 179, 113],
        mediumslateblue: [123, 104, 238],
        mediumspringgreen: [0, 250, 154],
        mediumturquoise: [72, 209, 204],
        mediumvioletred: [199, 21, 133],
        midnightblue: [25, 25, 112],
        mintcream: [245, 255, 250],
        mistyrose: [255, 228, 225],
        moccasin: [255, 228, 181],
        navajowhite: [255, 222, 173],
        navy: [0, 0, 128],
        oldlace: [253, 245, 230],
        olive: [128, 128, 0],
        olivedrab: [107, 142, 35],
        orange: [255, 165, 0],
        orangered: [255, 69, 0],
        orchid: [218, 112, 214],
        palegoldenrod: [238, 232, 170],
        palegreen: [152, 251, 152],
        paleturquoise: [175, 238, 238],
        palevioletred: [219, 112, 147],
        papayawhip: [255, 239, 213],
        peachpuff: [255, 218, 185],
        peru: [205, 133, 63],
        pink: [255, 192, 203],
        plum: [221, 160, 221],
        powderblue: [176, 224, 230],
        purple: [128, 0, 128],
        rebeccapurple: [102, 51, 153],
        red: [255, 0, 0],
        rosybrown: [188, 143, 143],
        royalblue: [65, 105, 225],
        saddlebrown: [139, 69, 19],
        salmon: [250, 128, 114],
        sandybrown: [244, 164, 96],
        seagreen: [46, 139, 87],
        seashell: [255, 245, 238],
        sienna: [160, 82, 45],
        silver: [192, 192, 192],
        skyblue: [135, 206, 235],
        slateblue: [106, 90, 205],
        slategray: [112, 128, 144],
        slategrey: [112, 128, 144],
        snow: [255, 250, 250],
        springgreen: [0, 255, 127],
        steelblue: [70, 130, 180],
        tan: [210, 180, 140],
        teal: [0, 128, 128],
        thistle: [216, 191, 216],
        tomato: [255, 99, 71],
        turquoise: [64, 224, 208],
        violet: [238, 130, 238],
        wheat: [245, 222, 179],
        white: [255, 255, 255],
        whitesmoke: [245, 245, 245],
        yellow: [255, 255, 0],
        yellowgreen: [154, 205, 50],
      };
    });
  function sr(i, { loose: e = !1 } = {}) {
    if (typeof i != 'string') return null;
    if (((i = i.trim()), i === 'transparent'))
      return { mode: 'rgb', color: ['0', '0', '0'], alpha: '0' };
    if (i in is) return { mode: 'rgb', color: is[i].map((a) => a.toString()) };
    let t = i
      .replace(Db, (a, s, o, u, c) =>
        ['#', s, s, o, o, u, u, c ? c + c : ''].join(''),
      )
      .match(Pb);
    if (t !== null)
      return {
        mode: 'rgb',
        color: [parseInt(t[1], 16), parseInt(t[2], 16), parseInt(t[3], 16)].map(
          (a) => a.toString(),
        ),
        alpha: t[4] ? (parseInt(t[4], 16) / 255).toString() : void 0,
      };
    let r = i.match(Ib) ?? i.match(qb);
    if (r === null) return null;
    let n = [r[2], r[3], r[4]].filter(Boolean).map((a) => a.toString());
    return n.length === 2 && n[0].startsWith('var(')
      ? { mode: r[1], color: [n[0]], alpha: n[1] }
      : (!e && n.length !== 3) ||
        (n.length < 3 && !n.some((a) => /^var\(.*?\)$/.test(a)))
      ? null
      : { mode: r[1], color: n, alpha: r[5]?.toString?.() };
  }
  function ns({ mode: i, color: e, alpha: t }) {
    let r = t !== void 0;
    return i === 'rgba' || i === 'hsla'
      ? `${i}(${e.join(', ')}${r ? `, ${t}` : ''})`
      : `${i}(${e.join(' ')}${r ? ` / ${t}` : ''})`;
  }
  var Pb,
    Db,
    et,
    gi,
    Pu,
    tt,
    Ib,
    qb,
    ss = C(() => {
      l();
      Tu();
      (Pb = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i),
        (Db = /^#([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i),
        (et = /(?:\d+|\d*\.\d+)%?/),
        (gi = /(?:\s*,\s*|\s+)/),
        (Pu = /\s*[,/]\s*/),
        (tt = /var\(--(?:[^ )]*?)\)/),
        (Ib = new RegExp(
          `^(rgba?)\\(\\s*(${et.source}|${tt.source})(?:${gi.source}(${et.source}|${tt.source}))?(?:${gi.source}(${et.source}|${tt.source}))?(?:${Pu.source}(${et.source}|${tt.source}))?\\s*\\)$`,
        )),
        (qb = new RegExp(
          `^(hsla?)\\(\\s*((?:${et.source})(?:deg|rad|grad|turn)?|${tt.source})(?:${gi.source}(${et.source}|${tt.source}))?(?:${gi.source}(${et.source}|${tt.source}))?(?:${Pu.source}(${et.source}|${tt.source}))?\\s*\\)$`,
        ));
    });
  function Ie(i, e, t) {
    if (typeof i == 'function') return i({ opacityValue: e });
    let r = sr(i, { loose: !0 });
    return r === null ? t : ns({ ...r, alpha: e });
  }
  function se({ color: i, property: e, variable: t }) {
    let r = [].concat(e);
    if (typeof i == 'function')
      return {
        [t]: '1',
        ...Object.fromEntries(
          r.map((a) => [
            a,
            i({ opacityVariable: t, opacityValue: `var(${t})` }),
          ]),
        ),
      };
    let n = sr(i);
    return n === null
      ? Object.fromEntries(r.map((a) => [a, i]))
      : n.alpha !== void 0
      ? Object.fromEntries(r.map((a) => [a, i]))
      : {
          [t]: '1',
          ...Object.fromEntries(
            r.map((a) => [a, ns({ ...n, alpha: `var(${t})` })]),
          ),
        };
  }
  var ar = C(() => {
    l();
    ss();
  });
  function le(i, e) {
    let t = [],
      r = [],
      n = 0,
      a = !1;
    for (let s = 0; s < i.length; s++) {
      let o = i[s];
      t.length === 0 &&
        o === e[0] &&
        !a &&
        (e.length === 1 || i.slice(s, s + e.length) === e) &&
        (r.push(i.slice(n, s)), (n = s + e.length)),
        a ? (a = !1) : o === '\\' && (a = !0),
        o === '(' || o === '[' || o === '{'
          ? t.push(o)
          : ((o === ')' && t[t.length - 1] === '(') ||
              (o === ']' && t[t.length - 1] === '[') ||
              (o === '}' && t[t.length - 1] === '{')) &&
            t.pop();
    }
    return r.push(i.slice(n)), r;
  }
  var or = C(() => {
    l();
  });
  function yi(i) {
    return le(i, ',').map((t) => {
      let r = t.trim(),
        n = { raw: r },
        a = r.split(Mb),
        s = new Set();
      for (let o of a)
        (Du.lastIndex = 0),
          !s.has('KEYWORD') && Rb.has(o)
            ? ((n.keyword = o), s.add('KEYWORD'))
            : Du.test(o)
            ? s.has('X')
              ? s.has('Y')
                ? s.has('BLUR')
                  ? s.has('SPREAD') || ((n.spread = o), s.add('SPREAD'))
                  : ((n.blur = o), s.add('BLUR'))
                : ((n.y = o), s.add('Y'))
              : ((n.x = o), s.add('X'))
            : n.color
            ? (n.unknown || (n.unknown = []), n.unknown.push(o))
            : (n.color = o);
      return (n.valid = n.x !== void 0 && n.y !== void 0), n;
    });
  }
  function Iu(i) {
    return i
      .map((e) =>
        e.valid
          ? [e.keyword, e.x, e.y, e.blur, e.spread, e.color]
              .filter(Boolean)
              .join(' ')
          : e.raw,
      )
      .join(', ');
  }
  var Rb,
    Mb,
    Du,
    as = C(() => {
      l();
      or();
      (Rb = new Set(['inset', 'inherit', 'initial', 'revert', 'unset'])),
        (Mb = /\ +(?![^(]*\))/g),
        (Du = /^-?(\d+|\.\d+)(.*?)$/g);
    });
  function os(i) {
    return Bb.some((e) => new RegExp(`^${e}\\(.*\\)`).test(i));
  }
  function U(i, e = !0) {
    return i.startsWith('--')
      ? `var(${i})`
      : i.includes('url(')
      ? i
          .split(/(url\(.*?\))/g)
          .filter(Boolean)
          .map((t) => (/^url\(.*?\)$/.test(t) ? t : U(t, !1)))
          .join('')
      : ((i = i
          .replace(/([^\\])_+/g, (t, r) => r + ' '.repeat(t.length - 1))
          .replace(/^_/g, ' ')
          .replace(/\\_/g, '_')),
        e && (i = i.trim()),
        (i = Nb(i)),
        i);
  }
  function Nb(i) {
    return i.replace(/(calc|min|max|clamp)\(.+\)/g, (e) => {
      let t = [];
      return e
        .replace(/var\((--.+?)[,)]/g, (r, n) => (t.push(n), r.replace(n, qu)))
        .replace(
          /(-?\d*\.?\d(?!\b-\d.+[,)](?![^+\-/*])\D)(?:%|[a-z]+)?|\))([+\-/*])/g,
          '$1 $2 ',
        )
        .replace(Fb, () => t.shift());
    });
  }
  function ls(i) {
    return i.startsWith('url(');
  }
  function us(i) {
    return !isNaN(Number(i)) || os(i);
  }
  function lr(i) {
    return (i.endsWith('%') && us(i.slice(0, -1))) || os(i);
  }
  function ur(i) {
    return (
      i === '0' ||
      new RegExp(`^[+-]?[0-9]*.?[0-9]+(?:[eE][+-]?[0-9]+)?${$b}$`).test(i) ||
      os(i)
    );
  }
  function Ru(i) {
    return jb.has(i);
  }
  function Mu(i) {
    let e = yi(U(i));
    for (let t of e) if (!t.valid) return !1;
    return !0;
  }
  function Bu(i) {
    let e = 0;
    return le(i, '_').every(
      (r) => (
        (r = U(r)),
        r.startsWith('var(')
          ? !0
          : sr(r, { loose: !0 }) !== null
          ? (e++, !0)
          : !1
      ),
    )
      ? e > 0
      : !1;
  }
  function Fu(i) {
    let e = 0;
    return le(i, ',').every(
      (r) => (
        (r = U(r)),
        r.startsWith('var(')
          ? !0
          : ls(r) ||
            Vb(r) ||
            ['element(', 'image(', 'cross-fade(', 'image-set('].some((n) =>
              r.startsWith(n),
            )
          ? (e++, !0)
          : !1
      ),
    )
      ? e > 0
      : !1;
  }
  function Vb(i) {
    i = U(i);
    for (let e of zb) if (i.startsWith(`${e}(`)) return !0;
    return !1;
  }
  function Nu(i) {
    let e = 0;
    return le(i, '_').every(
      (r) => (
        (r = U(r)),
        r.startsWith('var(') ? !0 : Ub.has(r) || ur(r) || lr(r) ? (e++, !0) : !1
      ),
    )
      ? e > 0
      : !1;
  }
  function Lu(i) {
    let e = 0;
    return le(i, ',').every(
      (r) => (
        (r = U(r)),
        r.startsWith('var(')
          ? !0
          : (r.includes(' ') && !/(['"])([^"']+)\1/g.test(r)) || /^\d/g.test(r)
          ? !1
          : (e++, !0)
      ),
    )
      ? e > 0
      : !1;
  }
  function $u(i) {
    return Wb.has(i);
  }
  function ju(i) {
    return Gb.has(i);
  }
  function zu(i) {
    return Hb.has(i);
  }
  var Bb,
    qu,
    Fb,
    Lb,
    $b,
    jb,
    zb,
    Ub,
    Wb,
    Gb,
    Hb,
    fr = C(() => {
      l();
      ss();
      as();
      or();
      Bb = ['min', 'max', 'clamp', 'calc'];
      (qu = '--tw-placeholder'), (Fb = new RegExp(qu, 'g'));
      (Lb = [
        'cm',
        'mm',
        'Q',
        'in',
        'pc',
        'pt',
        'px',
        'em',
        'ex',
        'ch',
        'rem',
        'lh',
        'rlh',
        'vw',
        'vh',
        'vmin',
        'vmax',
        'vb',
        'vi',
        'svw',
        'svh',
        'lvw',
        'lvh',
        'dvw',
        'dvh',
        'cqw',
        'cqh',
        'cqi',
        'cqb',
        'cqmin',
        'cqmax',
      ]),
        ($b = `(?:${Lb.join('|')})`);
      jb = new Set(['thin', 'medium', 'thick']);
      zb = new Set([
        'conic-gradient',
        'linear-gradient',
        'radial-gradient',
        'repeating-conic-gradient',
        'repeating-linear-gradient',
        'repeating-radial-gradient',
      ]);
      Ub = new Set(['center', 'top', 'right', 'bottom', 'left']);
      Wb = new Set([
        'serif',
        'sans-serif',
        'monospace',
        'cursive',
        'fantasy',
        'system-ui',
        'ui-serif',
        'ui-sans-serif',
        'ui-monospace',
        'ui-rounded',
        'math',
        'emoji',
        'fangsong',
      ]);
      Gb = new Set([
        'xx-small',
        'x-small',
        'small',
        'medium',
        'large',
        'x-large',
        'x-large',
        'xxx-large',
      ]);
      Hb = new Set(['larger', 'smaller']);
    });
  function Vu(i) {
    let e = ['cover', 'contain'];
    return le(i, ',').every((t) => {
      let r = le(t, '_').filter(Boolean);
      return r.length === 1 && e.includes(r[0])
        ? !0
        : r.length !== 1 && r.length !== 2
        ? !1
        : r.every((n) => ur(n) || lr(n) || n === 'auto');
    });
  }
  var Uu = C(() => {
    l();
    fr();
    or();
  });
  function Wu(i, e) {
    i.walkClasses((t) => {
      (t.value = e(t.value)),
        t.raws && t.raws.value && (t.raws.value = ht(t.raws.value));
    });
  }
  function Gu(i, e) {
    if (!rt(i)) return;
    let t = i.slice(1, -1);
    if (!!e(t)) return U(t);
  }
  function Yb(i, e = {}, t) {
    let r = e[i];
    if (r !== void 0) return Xe(r);
    if (rt(i)) {
      let n = Gu(i, t);
      return n === void 0 ? void 0 : Xe(n);
    }
  }
  function wi(i, e = {}, { validate: t = () => !0 } = {}) {
    let r = e.values?.[i];
    return r !== void 0
      ? r
      : e.supportsNegativeValues && i.startsWith('-')
      ? Yb(i.slice(1), e.values, t)
      : Gu(i, t);
  }
  function rt(i) {
    return i.startsWith('[') && i.endsWith(']');
  }
  function Hu(i) {
    let e = i.lastIndexOf('/');
    return e === -1 || e === i.length - 1
      ? [i, void 0]
      : rt(i) && !i.includes(']/[')
      ? [i, void 0]
      : [i.slice(0, e), i.slice(e + 1)];
  }
  function kt(i) {
    if (typeof i == 'string' && i.includes('<alpha-value>')) {
      let e = i;
      return ({ opacityValue: t = 1 }) => e.replace('<alpha-value>', t);
    }
    return i;
  }
  function Yu(i) {
    return U(i.slice(1, -1));
  }
  function Qb(i, e = {}, { tailwindConfig: t = {} } = {}) {
    if (e.values?.[i] !== void 0) return kt(e.values?.[i]);
    let [r, n] = Hu(i);
    if (n !== void 0) {
      let a = e.values?.[r] ?? (rt(r) ? r.slice(1, -1) : void 0);
      return a === void 0
        ? void 0
        : ((a = kt(a)),
          rt(n)
            ? Ie(a, Yu(n))
            : t.theme?.opacity?.[n] === void 0
            ? void 0
            : Ie(a, t.theme.opacity[n]));
    }
    return wi(i, e, { validate: Bu });
  }
  function Jb(i, e = {}) {
    return e.values?.[i];
  }
  function he(i) {
    return (e, t) => wi(e, t, { validate: i });
  }
  function Xb(i, e) {
    let t = i.indexOf(e);
    return t === -1 ? [void 0, i] : [i.slice(0, t), i.slice(t + 1)];
  }
  function cs(i, e, t, r) {
    if (t.values && e in t.values)
      for (let { type: a } of i ?? []) {
        let s = fs[a](e, t, { tailwindConfig: r });
        if (s !== void 0) return [s, a, null];
      }
    if (rt(e)) {
      let a = e.slice(1, -1),
        [s, o] = Xb(a, ':');
      if (!/^[\w-_]+$/g.test(s)) o = a;
      else if (s !== void 0 && !Qu.includes(s)) return [];
      if (o.length > 0 && Qu.includes(s)) return [wi(`[${o}]`, t), s, null];
    }
    let n = ps(i, e, t, r);
    for (let a of n) return a;
    return [];
  }
  function* ps(i, e, t, r) {
    let n = J(r, 'generalizedModifiers'),
      [a, s] = Hu(e);
    if (
      ((n &&
        t.modifiers != null &&
        (t.modifiers === 'any' ||
          (typeof t.modifiers == 'object' &&
            ((s && rt(s)) || s in t.modifiers)))) ||
        ((a = e), (s = void 0)),
      s !== void 0 && a === '' && (a = 'DEFAULT'),
      s !== void 0 && typeof t.modifiers == 'object')
    ) {
      let u = t.modifiers?.[s] ?? null;
      u !== null ? (s = u) : rt(s) && (s = Yu(s));
    }
    for (let { type: u } of i ?? []) {
      let c = fs[u](a, t, { tailwindConfig: r });
      c !== void 0 && (yield [c, u, s ?? null]);
    }
  }
  var fs,
    Qu,
    cr = C(() => {
      l();
      mi();
      ar();
      fr();
      fi();
      Uu();
      De();
      (fs = {
        any: wi,
        color: Qb,
        url: he(ls),
        image: he(Fu),
        length: he(ur),
        percentage: he(lr),
        position: he(Nu),
        lookup: Jb,
        'generic-name': he($u),
        'family-name': he(Lu),
        number: he(us),
        'line-width': he(Ru),
        'absolute-size': he(ju),
        'relative-size': he(zu),
        shadow: he(Mu),
        size: he(Vu),
      }),
        (Qu = Object.keys(fs));
    });
  function N(i) {
    return typeof i == 'function' ? i({}) : i;
  }
  var ds = C(() => {
    l();
  });
  function St(i) {
    return typeof i == 'function';
  }
  function pr(i, ...e) {
    let t = e.pop();
    for (let r of e)
      for (let n in r) {
        let a = t(i[n], r[n]);
        a === void 0
          ? ie(i[n]) && ie(r[n])
            ? (i[n] = pr({}, i[n], r[n], t))
            : (i[n] = r[n])
          : (i[n] = a);
      }
    return i;
  }
  function Kb(i, ...e) {
    return St(i) ? i(...e) : i;
  }
  function Zb(i) {
    return i.reduce(
      (e, { extend: t }) =>
        pr(e, t, (r, n) =>
          r === void 0 ? [n] : Array.isArray(r) ? [n, ...r] : [n, r],
        ),
      {},
    );
  }
  function e0(i) {
    return { ...i.reduce((e, t) => rs(e, t), {}), extend: Zb(i) };
  }
  function Ju(i, e) {
    if (Array.isArray(i) && ie(i[0])) return i.concat(e);
    if (Array.isArray(e) && ie(e[0]) && ie(i)) return [i, ...e];
    if (Array.isArray(e)) return e;
  }
  function t0({ extend: i, ...e }) {
    return pr(e, i, (t, r) =>
      !St(t) && !r.some(St)
        ? pr({}, t, ...r, Ju)
        : (n, a) => pr({}, ...[t, ...r].map((s) => Kb(s, n, a)), Ju),
    );
  }
  function* r0(i) {
    let e = Ke(i);
    if (e.length === 0 || (yield e, Array.isArray(i))) return;
    let t = /^(.*?)\s*\/\s*([^/]+)$/,
      r = i.match(t);
    if (r !== null) {
      let [, n, a] = r,
        s = Ke(n);
      (s.alpha = a), yield s;
    }
  }
  function i0(i) {
    let e = (t, r) => {
      for (let n of r0(t)) {
        let a = 0,
          s = i;
        for (; s != null && a < n.length; )
          (s = s[n[a++]]),
            (s =
              St(s) && (n.alpha === void 0 || a <= n.length - 1)
                ? s(e, hs)
                : s);
        if (s !== void 0) {
          if (n.alpha !== void 0) {
            let o = kt(s);
            return Ie(o, n.alpha, N(o));
          }
          return ie(s) ? Ze(s) : s;
        }
      }
      return r;
    };
    return (
      Object.assign(e, { theme: e, ...hs }),
      Object.keys(i).reduce(
        (t, r) => ((t[r] = St(i[r]) ? i[r](e, hs) : i[r]), t),
        {},
      )
    );
  }
  function Xu(i) {
    let e = [];
    return (
      i.forEach((t) => {
        e = [...e, t];
        let r = t?.plugins ?? [];
        r.length !== 0 &&
          r.forEach((n) => {
            n.__isOptionsFunction && (n = n()),
              (e = [...e, ...Xu([n?.config ?? {}])]);
          });
      }),
      e
    );
  }
  function n0(i) {
    return [...i].reduceRight(
      (t, r) => (St(r) ? r({ corePlugins: t }) : wu(r, t)),
      gu,
    );
  }
  function s0(i) {
    return [...i].reduceRight((t, r) => [...t, ...r], []);
  }
  function ms(i) {
    let e = [...Xu(i), { prefix: '', important: !1, separator: ':' }];
    return Eu(
      rs(
        {
          theme: i0(t0(e0(e.map((t) => t?.theme ?? {})))),
          corePlugins: n0(e.map((t) => t.corePlugins)),
          plugins: s0(i.map((t) => t?.plugins ?? [])),
        },
        ...e,
      ),
    );
  }
  var hs,
    Ku = C(() => {
      l();
      fi();
      yu();
      bu();
      ts();
      Su();
      pi();
      Ou();
      xt();
      hi();
      cr();
      ar();
      ds();
      hs = {
        colors: es,
        negative(i) {
          return Object.keys(i)
            .filter((e) => i[e] !== '0')
            .reduce((e, t) => {
              let r = Xe(i[t]);
              return r !== void 0 && (e[`-${t}`] = r), e;
            }, {});
        },
        breakpoints(i) {
          return Object.keys(i)
            .filter((e) => typeof i[e] == 'string')
            .reduce((e, t) => ({ ...e, [`screen-${t}`]: i[t] }), {});
        },
      };
    });
  var bi = v((eT, Zu) => {
    l();
    Zu.exports = {
      content: [],
      presets: [],
      darkMode: 'media',
      theme: {
        accentColor: ({ theme: i }) => ({ ...i('colors'), auto: 'auto' }),
        animation: {
          none: 'none',
          spin: 'spin 1s linear infinite',
          ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
          pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          bounce: 'bounce 1s infinite',
        },
        aria: {
          busy: 'busy="true"',
          checked: 'checked="true"',
          disabled: 'disabled="true"',
          expanded: 'expanded="true"',
          hidden: 'hidden="true"',
          pressed: 'pressed="true"',
          readonly: 'readonly="true"',
          required: 'required="true"',
          selected: 'selected="true"',
        },
        aspectRatio: { auto: 'auto', square: '1 / 1', video: '16 / 9' },
        backdropBlur: ({ theme: i }) => i('blur'),
        backdropBrightness: ({ theme: i }) => i('brightness'),
        backdropContrast: ({ theme: i }) => i('contrast'),
        backdropGrayscale: ({ theme: i }) => i('grayscale'),
        backdropHueRotate: ({ theme: i }) => i('hueRotate'),
        backdropInvert: ({ theme: i }) => i('invert'),
        backdropOpacity: ({ theme: i }) => i('opacity'),
        backdropSaturate: ({ theme: i }) => i('saturate'),
        backdropSepia: ({ theme: i }) => i('sepia'),
        backgroundColor: ({ theme: i }) => i('colors'),
        backgroundImage: {
          none: 'none',
          'gradient-to-t': 'linear-gradient(to top, var(--tw-gradient-stops))',
          'gradient-to-tr':
            'linear-gradient(to top right, var(--tw-gradient-stops))',
          'gradient-to-r':
            'linear-gradient(to right, var(--tw-gradient-stops))',
          'gradient-to-br':
            'linear-gradient(to bottom right, var(--tw-gradient-stops))',
          'gradient-to-b':
            'linear-gradient(to bottom, var(--tw-gradient-stops))',
          'gradient-to-bl':
            'linear-gradient(to bottom left, var(--tw-gradient-stops))',
          'gradient-to-l': 'linear-gradient(to left, var(--tw-gradient-stops))',
          'gradient-to-tl':
            'linear-gradient(to top left, var(--tw-gradient-stops))',
        },
        backgroundOpacity: ({ theme: i }) => i('opacity'),
        backgroundPosition: {
          bottom: 'bottom',
          center: 'center',
          left: 'left',
          'left-bottom': 'left bottom',
          'left-top': 'left top',
          right: 'right',
          'right-bottom': 'right bottom',
          'right-top': 'right top',
          top: 'top',
        },
        backgroundSize: { auto: 'auto', cover: 'cover', contain: 'contain' },
        blur: {
          0: '0',
          none: '0',
          sm: '4px',
          DEFAULT: '8px',
          md: '12px',
          lg: '16px',
          xl: '24px',
          '2xl': '40px',
          '3xl': '64px',
        },
        borderColor: ({ theme: i }) => ({
          ...i('colors'),
          DEFAULT: i('colors.gray.200', 'currentColor'),
        }),
        borderOpacity: ({ theme: i }) => i('opacity'),
        borderRadius: {
          none: '0px',
          sm: '0.125rem',
          DEFAULT: '0.25rem',
          md: '0.375rem',
          lg: '0.5rem',
          xl: '0.75rem',
          '2xl': '1rem',
          '3xl': '1.5rem',
          full: '9999px',
        },
        borderSpacing: ({ theme: i }) => ({ ...i('spacing') }),
        borderWidth: { DEFAULT: '1px', 0: '0px', 2: '2px', 4: '4px', 8: '8px' },
        boxShadow: {
          sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          DEFAULT:
            '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
          xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
          inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
          none: 'none',
        },
        boxShadowColor: ({ theme: i }) => i('colors'),
        brightness: {
          0: '0',
          50: '.5',
          75: '.75',
          90: '.9',
          95: '.95',
          100: '1',
          105: '1.05',
          110: '1.1',
          125: '1.25',
          150: '1.5',
          200: '2',
        },
        caretColor: ({ theme: i }) => i('colors'),
        colors: ({ colors: i }) => ({
          inherit: i.inherit,
          current: i.current,
          transparent: i.transparent,
          black: i.black,
          white: i.white,
          slate: i.slate,
          gray: i.gray,
          zinc: i.zinc,
          neutral: i.neutral,
          stone: i.stone,
          red: i.red,
          orange: i.orange,
          amber: i.amber,
          yellow: i.yellow,
          lime: i.lime,
          green: i.green,
          emerald: i.emerald,
          teal: i.teal,
          cyan: i.cyan,
          sky: i.sky,
          blue: i.blue,
          indigo: i.indigo,
          violet: i.violet,
          purple: i.purple,
          fuchsia: i.fuchsia,
          pink: i.pink,
          rose: i.rose,
        }),
        columns: {
          auto: 'auto',
          1: '1',
          2: '2',
          3: '3',
          4: '4',
          5: '5',
          6: '6',
          7: '7',
          8: '8',
          9: '9',
          10: '10',
          11: '11',
          12: '12',
          '3xs': '16rem',
          '2xs': '18rem',
          xs: '20rem',
          sm: '24rem',
          md: '28rem',
          lg: '32rem',
          xl: '36rem',
          '2xl': '42rem',
          '3xl': '48rem',
          '4xl': '56rem',
          '5xl': '64rem',
          '6xl': '72rem',
          '7xl': '80rem',
        },
        container: {},
        content: { none: 'none' },
        contrast: {
          0: '0',
          50: '.5',
          75: '.75',
          100: '1',
          125: '1.25',
          150: '1.5',
          200: '2',
        },
        cursor: {
          auto: 'auto',
          default: 'default',
          pointer: 'pointer',
          wait: 'wait',
          text: 'text',
          move: 'move',
          help: 'help',
          'not-allowed': 'not-allowed',
          none: 'none',
          'context-menu': 'context-menu',
          progress: 'progress',
          cell: 'cell',
          crosshair: 'crosshair',
          'vertical-text': 'vertical-text',
          alias: 'alias',
          copy: 'copy',
          'no-drop': 'no-drop',
          grab: 'grab',
          grabbing: 'grabbing',
          'all-scroll': 'all-scroll',
          'col-resize': 'col-resize',
          'row-resize': 'row-resize',
          'n-resize': 'n-resize',
          'e-resize': 'e-resize',
          's-resize': 's-resize',
          'w-resize': 'w-resize',
          'ne-resize': 'ne-resize',
          'nw-resize': 'nw-resize',
          'se-resize': 'se-resize',
          'sw-resize': 'sw-resize',
          'ew-resize': 'ew-resize',
          'ns-resize': 'ns-resize',
          'nesw-resize': 'nesw-resize',
          'nwse-resize': 'nwse-resize',
          'zoom-in': 'zoom-in',
          'zoom-out': 'zoom-out',
        },
        divideColor: ({ theme: i }) => i('borderColor'),
        divideOpacity: ({ theme: i }) => i('borderOpacity'),
        divideWidth: ({ theme: i }) => i('borderWidth'),
        dropShadow: {
          sm: '0 1px 1px rgb(0 0 0 / 0.05)',
          DEFAULT: [
            '0 1px 2px rgb(0 0 0 / 0.1)',
            '0 1px 1px rgb(0 0 0 / 0.06)',
          ],
          md: ['0 4px 3px rgb(0 0 0 / 0.07)', '0 2px 2px rgb(0 0 0 / 0.06)'],
          lg: ['0 10px 8px rgb(0 0 0 / 0.04)', '0 4px 3px rgb(0 0 0 / 0.1)'],
          xl: ['0 20px 13px rgb(0 0 0 / 0.03)', '0 8px 5px rgb(0 0 0 / 0.08)'],
          '2xl': '0 25px 25px rgb(0 0 0 / 0.15)',
          none: '0 0 #0000',
        },
        fill: ({ theme: i }) => ({ none: 'none', ...i('colors') }),
        flex: {
          1: '1 1 0%',
          auto: '1 1 auto',
          initial: '0 1 auto',
          none: 'none',
        },
        flexBasis: ({ theme: i }) => ({
          auto: 'auto',
          ...i('spacing'),
          '1/2': '50%',
          '1/3': '33.333333%',
          '2/3': '66.666667%',
          '1/4': '25%',
          '2/4': '50%',
          '3/4': '75%',
          '1/5': '20%',
          '2/5': '40%',
          '3/5': '60%',
          '4/5': '80%',
          '1/6': '16.666667%',
          '2/6': '33.333333%',
          '3/6': '50%',
          '4/6': '66.666667%',
          '5/6': '83.333333%',
          '1/12': '8.333333%',
          '2/12': '16.666667%',
          '3/12': '25%',
          '4/12': '33.333333%',
          '5/12': '41.666667%',
          '6/12': '50%',
          '7/12': '58.333333%',
          '8/12': '66.666667%',
          '9/12': '75%',
          '10/12': '83.333333%',
          '11/12': '91.666667%',
          full: '100%',
        }),
        flexGrow: { 0: '0', DEFAULT: '1' },
        flexShrink: { 0: '0', DEFAULT: '1' },
        fontFamily: {
          sans: [
            'ui-sans-serif',
            'system-ui',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            '"Noto Sans"',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
            '"Noto Color Emoji"',
          ],
          serif: [
            'ui-serif',
            'Georgia',
            'Cambria',
            '"Times New Roman"',
            'Times',
            'serif',
          ],
          mono: [
            'ui-monospace',
            'SFMono-Regular',
            'Menlo',
            'Monaco',
            'Consolas',
            '"Liberation Mono"',
            '"Courier New"',
            'monospace',
          ],
        },
        fontSize: {
          xs: ['0.75rem', { lineHeight: '1rem' }],
          sm: ['0.875rem', { lineHeight: '1.25rem' }],
          base: ['1rem', { lineHeight: '1.5rem' }],
          lg: ['1.125rem', { lineHeight: '1.75rem' }],
          xl: ['1.25rem', { lineHeight: '1.75rem' }],
          '2xl': ['1.5rem', { lineHeight: '2rem' }],
          '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
          '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
          '5xl': ['3rem', { lineHeight: '1' }],
          '6xl': ['3.75rem', { lineHeight: '1' }],
          '7xl': ['4.5rem', { lineHeight: '1' }],
          '8xl': ['6rem', { lineHeight: '1' }],
          '9xl': ['8rem', { lineHeight: '1' }],
        },
        fontWeight: {
          thin: '100',
          extralight: '200',
          light: '300',
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700',
          extrabold: '800',
          black: '900',
        },
        gap: ({ theme: i }) => i('spacing'),
        gradientColorStops: ({ theme: i }) => i('colors'),
        gradientColorStopPositions: {
          '0%': '0%',
          '5%': '5%',
          '10%': '10%',
          '15%': '15%',
          '20%': '20%',
          '25%': '25%',
          '30%': '30%',
          '35%': '35%',
          '40%': '40%',
          '45%': '45%',
          '50%': '50%',
          '55%': '55%',
          '60%': '60%',
          '65%': '65%',
          '70%': '70%',
          '75%': '75%',
          '80%': '80%',
          '85%': '85%',
          '90%': '90%',
          '95%': '95%',
          '100%': '100%',
        },
        grayscale: { 0: '0', DEFAULT: '100%' },
        gridAutoColumns: {
          auto: 'auto',
          min: 'min-content',
          max: 'max-content',
          fr: 'minmax(0, 1fr)',
        },
        gridAutoRows: {
          auto: 'auto',
          min: 'min-content',
          max: 'max-content',
          fr: 'minmax(0, 1fr)',
        },
        gridColumn: {
          auto: 'auto',
          'span-1': 'span 1 / span 1',
          'span-2': 'span 2 / span 2',
          'span-3': 'span 3 / span 3',
          'span-4': 'span 4 / span 4',
          'span-5': 'span 5 / span 5',
          'span-6': 'span 6 / span 6',
          'span-7': 'span 7 / span 7',
          'span-8': 'span 8 / span 8',
          'span-9': 'span 9 / span 9',
          'span-10': 'span 10 / span 10',
          'span-11': 'span 11 / span 11',
          'span-12': 'span 12 / span 12',
          'span-full': '1 / -1',
        },
        gridColumnEnd: {
          auto: 'auto',
          1: '1',
          2: '2',
          3: '3',
          4: '4',
          5: '5',
          6: '6',
          7: '7',
          8: '8',
          9: '9',
          10: '10',
          11: '11',
          12: '12',
          13: '13',
        },
        gridColumnStart: {
          auto: 'auto',
          1: '1',
          2: '2',
          3: '3',
          4: '4',
          5: '5',
          6: '6',
          7: '7',
          8: '8',
          9: '9',
          10: '10',
          11: '11',
          12: '12',
          13: '13',
        },
        gridRow: {
          auto: 'auto',
          'span-1': 'span 1 / span 1',
          'span-2': 'span 2 / span 2',
          'span-3': 'span 3 / span 3',
          'span-4': 'span 4 / span 4',
          'span-5': 'span 5 / span 5',
          'span-6': 'span 6 / span 6',
          'span-full': '1 / -1',
        },
        gridRowEnd: {
          auto: 'auto',
          1: '1',
          2: '2',
          3: '3',
          4: '4',
          5: '5',
          6: '6',
          7: '7',
        },
        gridRowStart: {
          auto: 'auto',
          1: '1',
          2: '2',
          3: '3',
          4: '4',
          5: '5',
          6: '6',
          7: '7',
        },
        gridTemplateColumns: {
          none: 'none',
          1: 'repeat(1, minmax(0, 1fr))',
          2: 'repeat(2, minmax(0, 1fr))',
          3: 'repeat(3, minmax(0, 1fr))',
          4: 'repeat(4, minmax(0, 1fr))',
          5: 'repeat(5, minmax(0, 1fr))',
          6: 'repeat(6, minmax(0, 1fr))',
          7: 'repeat(7, minmax(0, 1fr))',
          8: 'repeat(8, minmax(0, 1fr))',
          9: 'repeat(9, minmax(0, 1fr))',
          10: 'repeat(10, minmax(0, 1fr))',
          11: 'repeat(11, minmax(0, 1fr))',
          12: 'repeat(12, minmax(0, 1fr))',
        },
        gridTemplateRows: {
          none: 'none',
          1: 'repeat(1, minmax(0, 1fr))',
          2: 'repeat(2, minmax(0, 1fr))',
          3: 'repeat(3, minmax(0, 1fr))',
          4: 'repeat(4, minmax(0, 1fr))',
          5: 'repeat(5, minmax(0, 1fr))',
          6: 'repeat(6, minmax(0, 1fr))',
        },
        height: ({ theme: i }) => ({
          auto: 'auto',
          ...i('spacing'),
          '1/2': '50%',
          '1/3': '33.333333%',
          '2/3': '66.666667%',
          '1/4': '25%',
          '2/4': '50%',
          '3/4': '75%',
          '1/5': '20%',
          '2/5': '40%',
          '3/5': '60%',
          '4/5': '80%',
          '1/6': '16.666667%',
          '2/6': '33.333333%',
          '3/6': '50%',
          '4/6': '66.666667%',
          '5/6': '83.333333%',
          full: '100%',
          screen: '100vh',
          min: 'min-content',
          max: 'max-content',
          fit: 'fit-content',
        }),
        hueRotate: {
          0: '0deg',
          15: '15deg',
          30: '30deg',
          60: '60deg',
          90: '90deg',
          180: '180deg',
        },
        inset: ({ theme: i }) => ({
          auto: 'auto',
          ...i('spacing'),
          '1/2': '50%',
          '1/3': '33.333333%',
          '2/3': '66.666667%',
          '1/4': '25%',
          '2/4': '50%',
          '3/4': '75%',
          full: '100%',
        }),
        invert: { 0: '0', DEFAULT: '100%' },
        keyframes: {
          spin: { to: { transform: 'rotate(360deg)' } },
          ping: { '75%, 100%': { transform: 'scale(2)', opacity: '0' } },
          pulse: { '50%': { opacity: '.5' } },
          bounce: {
            '0%, 100%': {
              transform: 'translateY(-25%)',
              animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
            },
            '50%': {
              transform: 'none',
              animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
            },
          },
        },
        letterSpacing: {
          tighter: '-0.05em',
          tight: '-0.025em',
          normal: '0em',
          wide: '0.025em',
          wider: '0.05em',
          widest: '0.1em',
        },
        lineHeight: {
          none: '1',
          tight: '1.25',
          snug: '1.375',
          normal: '1.5',
          relaxed: '1.625',
          loose: '2',
          3: '.75rem',
          4: '1rem',
          5: '1.25rem',
          6: '1.5rem',
          7: '1.75rem',
          8: '2rem',
          9: '2.25rem',
          10: '2.5rem',
        },
        listStyleType: { none: 'none', disc: 'disc', decimal: 'decimal' },
        listStyleImage: { none: 'none' },
        margin: ({ theme: i }) => ({ auto: 'auto', ...i('spacing') }),
        lineClamp: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6' },
        maxHeight: ({ theme: i }) => ({
          ...i('spacing'),
          none: 'none',
          full: '100%',
          screen: '100vh',
          min: 'min-content',
          max: 'max-content',
          fit: 'fit-content',
        }),
        maxWidth: ({ theme: i, breakpoints: e }) => ({
          none: 'none',
          0: '0rem',
          xs: '20rem',
          sm: '24rem',
          md: '28rem',
          lg: '32rem',
          xl: '36rem',
          '2xl': '42rem',
          '3xl': '48rem',
          '4xl': '56rem',
          '5xl': '64rem',
          '6xl': '72rem',
          '7xl': '80rem',
          full: '100%',
          min: 'min-content',
          max: 'max-content',
          fit: 'fit-content',
          prose: '65ch',
          ...e(i('screens')),
        }),
        minHeight: {
          0: '0px',
          full: '100%',
          screen: '100vh',
          min: 'min-content',
          max: 'max-content',
          fit: 'fit-content',
        },
        minWidth: {
          0: '0px',
          full: '100%',
          min: 'min-content',
          max: 'max-content',
          fit: 'fit-content',
        },
        objectPosition: {
          bottom: 'bottom',
          center: 'center',
          left: 'left',
          'left-bottom': 'left bottom',
          'left-top': 'left top',
          right: 'right',
          'right-bottom': 'right bottom',
          'right-top': 'right top',
          top: 'top',
        },
        opacity: {
          0: '0',
          5: '0.05',
          10: '0.1',
          20: '0.2',
          25: '0.25',
          30: '0.3',
          40: '0.4',
          50: '0.5',
          60: '0.6',
          70: '0.7',
          75: '0.75',
          80: '0.8',
          90: '0.9',
          95: '0.95',
          100: '1',
        },
        order: {
          first: '-9999',
          last: '9999',
          none: '0',
          1: '1',
          2: '2',
          3: '3',
          4: '4',
          5: '5',
          6: '6',
          7: '7',
          8: '8',
          9: '9',
          10: '10',
          11: '11',
          12: '12',
        },
        outlineColor: ({ theme: i }) => i('colors'),
        outlineOffset: { 0: '0px', 1: '1px', 2: '2px', 4: '4px', 8: '8px' },
        outlineWidth: { 0: '0px', 1: '1px', 2: '2px', 4: '4px', 8: '8px' },
        padding: ({ theme: i }) => i('spacing'),
        placeholderColor: ({ theme: i }) => i('colors'),
        placeholderOpacity: ({ theme: i }) => i('opacity'),
        ringColor: ({ theme: i }) => ({
          DEFAULT: i('colors.blue.500', '#3b82f6'),
          ...i('colors'),
        }),
        ringOffsetColor: ({ theme: i }) => i('colors'),
        ringOffsetWidth: { 0: '0px', 1: '1px', 2: '2px', 4: '4px', 8: '8px' },
        ringOpacity: ({ theme: i }) => ({ DEFAULT: '0.5', ...i('opacity') }),
        ringWidth: {
          DEFAULT: '3px',
          0: '0px',
          1: '1px',
          2: '2px',
          4: '4px',
          8: '8px',
        },
        rotate: {
          0: '0deg',
          1: '1deg',
          2: '2deg',
          3: '3deg',
          6: '6deg',
          12: '12deg',
          45: '45deg',
          90: '90deg',
          180: '180deg',
        },
        saturate: { 0: '0', 50: '.5', 100: '1', 150: '1.5', 200: '2' },
        scale: {
          0: '0',
          50: '.5',
          75: '.75',
          90: '.9',
          95: '.95',
          100: '1',
          105: '1.05',
          110: '1.1',
          125: '1.25',
          150: '1.5',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
        scrollMargin: ({ theme: i }) => ({ ...i('spacing') }),
        scrollPadding: ({ theme: i }) => i('spacing'),
        sepia: { 0: '0', DEFAULT: '100%' },
        skew: {
          0: '0deg',
          1: '1deg',
          2: '2deg',
          3: '3deg',
          6: '6deg',
          12: '12deg',
        },
        space: ({ theme: i }) => ({ ...i('spacing') }),
        spacing: {
          px: '1px',
          0: '0px',
          0.5: '0.125rem',
          1: '0.25rem',
          1.5: '0.375rem',
          2: '0.5rem',
          2.5: '0.625rem',
          3: '0.75rem',
          3.5: '0.875rem',
          4: '1rem',
          5: '1.25rem',
          6: '1.5rem',
          7: '1.75rem',
          8: '2rem',
          9: '2.25rem',
          10: '2.5rem',
          11: '2.75rem',
          12: '3rem',
          14: '3.5rem',
          16: '4rem',
          20: '5rem',
          24: '6rem',
          28: '7rem',
          32: '8rem',
          36: '9rem',
          40: '10rem',
          44: '11rem',
          48: '12rem',
          52: '13rem',
          56: '14rem',
          60: '15rem',
          64: '16rem',
          72: '18rem',
          80: '20rem',
          96: '24rem',
        },
        stroke: ({ theme: i }) => ({ none: 'none', ...i('colors') }),
        strokeWidth: { 0: '0', 1: '1', 2: '2' },
        supports: {},
        data: {},
        textColor: ({ theme: i }) => i('colors'),
        textDecorationColor: ({ theme: i }) => i('colors'),
        textDecorationThickness: {
          auto: 'auto',
          'from-font': 'from-font',
          0: '0px',
          1: '1px',
          2: '2px',
          4: '4px',
          8: '8px',
        },
        textIndent: ({ theme: i }) => ({ ...i('spacing') }),
        textOpacity: ({ theme: i }) => i('opacity'),
        textUnderlineOffset: {
          auto: 'auto',
          0: '0px',
          1: '1px',
          2: '2px',
          4: '4px',
          8: '8px',
        },
        transformOrigin: {
          center: 'center',
          top: 'top',
          'top-right': 'top right',
          right: 'right',
          'bottom-right': 'bottom right',
          bottom: 'bottom',
          'bottom-left': 'bottom left',
          left: 'left',
          'top-left': 'top left',
        },
        transitionDelay: {
          0: '0s',
          75: '75ms',
          100: '100ms',
          150: '150ms',
          200: '200ms',
          300: '300ms',
          500: '500ms',
          700: '700ms',
          1e3: '1000ms',
        },
        transitionDuration: {
          DEFAULT: '150ms',
          0: '0s',
          75: '75ms',
          100: '100ms',
          150: '150ms',
          200: '200ms',
          300: '300ms',
          500: '500ms',
          700: '700ms',
          1e3: '1000ms',
        },
        transitionProperty: {
          none: 'none',
          all: 'all',
          DEFAULT:
            'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
          colors:
            'color, background-color, border-color, text-decoration-color, fill, stroke',
          opacity: 'opacity',
          shadow: 'box-shadow',
          transform: 'transform',
        },
        transitionTimingFunction: {
          DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
          linear: 'linear',
          in: 'cubic-bezier(0.4, 0, 1, 1)',
          out: 'cubic-bezier(0, 0, 0.2, 1)',
          'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
        translate: ({ theme: i }) => ({
          ...i('spacing'),
          '1/2': '50%',
          '1/3': '33.333333%',
          '2/3': '66.666667%',
          '1/4': '25%',
          '2/4': '50%',
          '3/4': '75%',
          full: '100%',
        }),
        width: ({ theme: i }) => ({
          auto: 'auto',
          ...i('spacing'),
          '1/2': '50%',
          '1/3': '33.333333%',
          '2/3': '66.666667%',
          '1/4': '25%',
          '2/4': '50%',
          '3/4': '75%',
          '1/5': '20%',
          '2/5': '40%',
          '3/5': '60%',
          '4/5': '80%',
          '1/6': '16.666667%',
          '2/6': '33.333333%',
          '3/6': '50%',
          '4/6': '66.666667%',
          '5/6': '83.333333%',
          '1/12': '8.333333%',
          '2/12': '16.666667%',
          '3/12': '25%',
          '4/12': '33.333333%',
          '5/12': '41.666667%',
          '6/12': '50%',
          '7/12': '58.333333%',
          '8/12': '66.666667%',
          '9/12': '75%',
          '10/12': '83.333333%',
          '11/12': '91.666667%',
          full: '100%',
          screen: '100vw',
          min: 'min-content',
          max: 'max-content',
          fit: 'fit-content',
        }),
        willChange: {
          auto: 'auto',
          scroll: 'scroll-position',
          contents: 'contents',
          transform: 'transform',
        },
        zIndex: {
          auto: 'auto',
          0: '0',
          10: '10',
          20: '20',
          30: '30',
          40: '40',
          50: '50',
        },
      },
      plugins: [],
    };
  });
  function vi(i) {
    let e = (i?.presets ?? [ef.default])
        .slice()
        .reverse()
        .flatMap((n) => vi(n instanceof Function ? n() : n)),
      t = {
        respectDefaultRingColorOpacity: {
          theme: {
            ringColor: ({ theme: n }) => ({
              DEFAULT: '#3b82f67f',
              ...n('colors'),
            }),
          },
        },
        disableColorOpacityUtilitiesByDefault: {
          corePlugins: {
            backgroundOpacity: !1,
            borderOpacity: !1,
            divideOpacity: !1,
            placeholderOpacity: !1,
            ringOpacity: !1,
            textOpacity: !1,
          },
        },
      },
      r = Object.keys(t)
        .filter((n) => J(i, n))
        .map((n) => t[n]);
    return [i, ...r, ...e];
  }
  var ef,
    tf = C(() => {
      l();
      ef = K(bi());
      De();
    });
  var rf = {};
  Ae(rf, { default: () => dr });
  function dr(...i) {
    let [, ...e] = vi(i[0]);
    return ms([...i, ...e]);
  }
  var gs = C(() => {
    l();
    Ku();
    tf();
  });
  var nf = {};
  Ae(nf, { default: () => Z });
  var Z,
    mt = C(() => {
      l();
      Z = { resolve: (i) => i, extname: (i) => '.' + i.split('.').pop() };
    });
  function xi(i) {
    return typeof i == 'object' && i !== null;
  }
  function o0(i) {
    return Object.keys(i).length === 0;
  }
  function sf(i) {
    return typeof i == 'string' || i instanceof String;
  }
  function ys(i) {
    return xi(i) && i.config === void 0 && !o0(i)
      ? null
      : xi(i) && i.config !== void 0 && sf(i.config)
      ? Z.resolve(i.config)
      : xi(i) && i.config !== void 0 && xi(i.config)
      ? null
      : sf(i)
      ? Z.resolve(i)
      : l0();
  }
  function l0() {
    for (let i of a0)
      try {
        let e = Z.resolve(i);
        return te.accessSync(e), e;
      } catch (e) {}
    return null;
  }
  var a0,
    af = C(() => {
      l();
      ze();
      mt();
      a0 = [
        './tailwind.config.js',
        './tailwind.config.cjs',
        './tailwind.config.mjs',
        './tailwind.config.ts',
      ];
    });
  var of = {};
  Ae(of, { default: () => ws });
  var ws,
    bs = C(() => {
      l();
      ws = { parse: (i) => ({ href: i }) };
    });
  var vs = v(() => {
    l();
  });
  var ki = v((fT, ff) => {
    l();
    ('use strict');
    var lf = (ci(), vu),
      uf = vs(),
      Ct = class extends Error {
        constructor(e, t, r, n, a, s) {
          super(e);
          (this.name = 'CssSyntaxError'),
            (this.reason = e),
            a && (this.file = a),
            n && (this.source = n),
            s && (this.plugin = s),
            typeof t != 'undefined' &&
              typeof r != 'undefined' &&
              (typeof t == 'number'
                ? ((this.line = t), (this.column = r))
                : ((this.line = t.line),
                  (this.column = t.column),
                  (this.endLine = r.line),
                  (this.endColumn = r.column))),
            this.setMessage(),
            Error.captureStackTrace && Error.captureStackTrace(this, Ct);
        }
        setMessage() {
          (this.message = this.plugin ? this.plugin + ': ' : ''),
            (this.message += this.file ? this.file : '<css input>'),
            typeof this.line != 'undefined' &&
              (this.message += ':' + this.line + ':' + this.column),
            (this.message += ': ' + this.reason);
        }
        showSourceCode(e) {
          if (!this.source) return '';
          let t = this.source;
          e == null && (e = lf.isColorSupported), uf && e && (t = uf(t));
          let r = t.split(/\r?\n/),
            n = Math.max(this.line - 3, 0),
            a = Math.min(this.line + 2, r.length),
            s = String(a).length,
            o,
            u;
          if (e) {
            let { bold: c, red: f, gray: p } = lf.createColors(!0);
            (o = (d) => c(f(d))), (u = (d) => p(d));
          } else o = u = (c) => c;
          return r.slice(n, a).map((c, f) => {
            let p = n + 1 + f,
              d = ' ' + (' ' + p).slice(-s) + ' | ';
            if (p === this.line) {
              let h =
                u(d.replace(/\d/g, ' ')) +
                c.slice(0, this.column - 1).replace(/[^\t]/g, ' ');
              return (
                o('>') +
                u(d) +
                c +
                `
 ` +
                h +
                o('^')
              );
            }
            return ' ' + u(d) + c;
          }).join(`
`);
        }
        toString() {
          let e = this.showSourceCode();
          return (
            e &&
              (e =
                `

` +
                e +
                `
`),
            this.name + ': ' + this.message + e
          );
        }
      };
    ff.exports = Ct;
    Ct.default = Ct;
  });
  var Si = v((cT, xs) => {
    l();
    ('use strict');
    xs.exports.isClean = Symbol('isClean');
    xs.exports.my = Symbol('my');
  });
  var ks = v((pT, pf) => {
    l();
    ('use strict');
    var cf = {
      colon: ': ',
      indent: '    ',
      beforeDecl: `
`,
      beforeRule: `
`,
      beforeOpen: ' ',
      beforeClose: `
`,
      beforeComment: `
`,
      after: `
`,
      emptyBody: '',
      commentLeft: ' ',
      commentRight: ' ',
      semicolon: !1,
    };
    function u0(i) {
      return i[0].toUpperCase() + i.slice(1);
    }
    var Ci = class {
      constructor(e) {
        this.builder = e;
      }
      stringify(e, t) {
        if (!this[e.type])
          throw new Error(
            'Unknown AST node type ' +
              e.type +
              '. Maybe you need to change PostCSS stringifier.',
          );
        this[e.type](e, t);
      }
      document(e) {
        this.body(e);
      }
      root(e) {
        this.body(e), e.raws.after && this.builder(e.raws.after);
      }
      comment(e) {
        let t = this.raw(e, 'left', 'commentLeft'),
          r = this.raw(e, 'right', 'commentRight');
        this.builder('/*' + t + e.text + r + '*/', e);
      }
      decl(e, t) {
        let r = this.raw(e, 'between', 'colon'),
          n = e.prop + r + this.rawValue(e, 'value');
        e.important && (n += e.raws.important || ' !important'),
          t && (n += ';'),
          this.builder(n, e);
      }
      rule(e) {
        this.block(e, this.rawValue(e, 'selector')),
          e.raws.ownSemicolon && this.builder(e.raws.ownSemicolon, e, 'end');
      }
      atrule(e, t) {
        let r = '@' + e.name,
          n = e.params ? this.rawValue(e, 'params') : '';
        if (
          (typeof e.raws.afterName != 'undefined'
            ? (r += e.raws.afterName)
            : n && (r += ' '),
          e.nodes)
        )
          this.block(e, r + n);
        else {
          let a = (e.raws.between || '') + (t ? ';' : '');
          this.builder(r + n + a, e);
        }
      }
      body(e) {
        let t = e.nodes.length - 1;
        for (; t > 0 && e.nodes[t].type === 'comment'; ) t -= 1;
        let r = this.raw(e, 'semicolon');
        for (let n = 0; n < e.nodes.length; n++) {
          let a = e.nodes[n],
            s = this.raw(a, 'before');
          s && this.builder(s), this.stringify(a, t !== n || r);
        }
      }
      block(e, t) {
        let r = this.raw(e, 'between', 'beforeOpen');
        this.builder(t + r + '{', e, 'start');
        let n;
        e.nodes && e.nodes.length
          ? (this.body(e), (n = this.raw(e, 'after')))
          : (n = this.raw(e, 'after', 'emptyBody')),
          n && this.builder(n),
          this.builder('}', e, 'end');
      }
      raw(e, t, r) {
        let n;
        if ((r || (r = t), t && ((n = e.raws[t]), typeof n != 'undefined')))
          return n;
        let a = e.parent;
        if (
          r === 'before' &&
          (!a ||
            (a.type === 'root' && a.first === e) ||
            (a && a.type === 'document'))
        )
          return '';
        if (!a) return cf[r];
        let s = e.root();
        if (
          (s.rawCache || (s.rawCache = {}), typeof s.rawCache[r] != 'undefined')
        )
          return s.rawCache[r];
        if (r === 'before' || r === 'after') return this.beforeAfter(e, r);
        {
          let o = 'raw' + u0(r);
          this[o]
            ? (n = this[o](s, e))
            : s.walk((u) => {
                if (((n = u.raws[t]), typeof n != 'undefined')) return !1;
              });
        }
        return typeof n == 'undefined' && (n = cf[r]), (s.rawCache[r] = n), n;
      }
      rawSemicolon(e) {
        let t;
        return (
          e.walk((r) => {
            if (
              r.nodes &&
              r.nodes.length &&
              r.last.type === 'decl' &&
              ((t = r.raws.semicolon), typeof t != 'undefined')
            )
              return !1;
          }),
          t
        );
      }
      rawEmptyBody(e) {
        let t;
        return (
          e.walk((r) => {
            if (
              r.nodes &&
              r.nodes.length === 0 &&
              ((t = r.raws.after), typeof t != 'undefined')
            )
              return !1;
          }),
          t
        );
      }
      rawIndent(e) {
        if (e.raws.indent) return e.raws.indent;
        let t;
        return (
          e.walk((r) => {
            let n = r.parent;
            if (
              n &&
              n !== e &&
              n.parent &&
              n.parent === e &&
              typeof r.raws.before != 'undefined'
            ) {
              let a = r.raws.before.split(`
`);
              return (t = a[a.length - 1]), (t = t.replace(/\S/g, '')), !1;
            }
          }),
          t
        );
      }
      rawBeforeComment(e, t) {
        let r;
        return (
          e.walkComments((n) => {
            if (typeof n.raws.before != 'undefined')
              return (
                (r = n.raws.before),
                r.includes(`
`) && (r = r.replace(/[^\n]+$/, '')),
                !1
              );
          }),
          typeof r == 'undefined'
            ? (r = this.raw(t, null, 'beforeDecl'))
            : r && (r = r.replace(/\S/g, '')),
          r
        );
      }
      rawBeforeDecl(e, t) {
        let r;
        return (
          e.walkDecls((n) => {
            if (typeof n.raws.before != 'undefined')
              return (
                (r = n.raws.before),
                r.includes(`
`) && (r = r.replace(/[^\n]+$/, '')),
                !1
              );
          }),
          typeof r == 'undefined'
            ? (r = this.raw(t, null, 'beforeRule'))
            : r && (r = r.replace(/\S/g, '')),
          r
        );
      }
      rawBeforeRule(e) {
        let t;
        return (
          e.walk((r) => {
            if (
              r.nodes &&
              (r.parent !== e || e.first !== r) &&
              typeof r.raws.before != 'undefined'
            )
              return (
                (t = r.raws.before),
                t.includes(`
`) && (t = t.replace(/[^\n]+$/, '')),
                !1
              );
          }),
          t && (t = t.replace(/\S/g, '')),
          t
        );
      }
      rawBeforeClose(e) {
        let t;
        return (
          e.walk((r) => {
            if (
              r.nodes &&
              r.nodes.length > 0 &&
              typeof r.raws.after != 'undefined'
            )
              return (
                (t = r.raws.after),
                t.includes(`
`) && (t = t.replace(/[^\n]+$/, '')),
                !1
              );
          }),
          t && (t = t.replace(/\S/g, '')),
          t
        );
      }
      rawBeforeOpen(e) {
        let t;
        return (
          e.walk((r) => {
            if (
              r.type !== 'decl' &&
              ((t = r.raws.between), typeof t != 'undefined')
            )
              return !1;
          }),
          t
        );
      }
      rawColon(e) {
        let t;
        return (
          e.walkDecls((r) => {
            if (typeof r.raws.between != 'undefined')
              return (t = r.raws.between.replace(/[^\s:]/g, '')), !1;
          }),
          t
        );
      }
      beforeAfter(e, t) {
        let r;
        e.type === 'decl'
          ? (r = this.raw(e, null, 'beforeDecl'))
          : e.type === 'comment'
          ? (r = this.raw(e, null, 'beforeComment'))
          : t === 'before'
          ? (r = this.raw(e, null, 'beforeRule'))
          : (r = this.raw(e, null, 'beforeClose'));
        let n = e.parent,
          a = 0;
        for (; n && n.type !== 'root'; ) (a += 1), (n = n.parent);
        if (
          r.includes(`
`)
        ) {
          let s = this.raw(e, null, 'indent');
          if (s.length) for (let o = 0; o < a; o++) r += s;
        }
        return r;
      }
      rawValue(e, t) {
        let r = e[t],
          n = e.raws[t];
        return n && n.value === r ? n.raw : r;
      }
    };
    pf.exports = Ci;
    Ci.default = Ci;
  });
  var hr = v((dT, df) => {
    l();
    ('use strict');
    var f0 = ks();
    function Ss(i, e) {
      new f0(e).stringify(i);
    }
    df.exports = Ss;
    Ss.default = Ss;
  });
  var mr = v((hT, hf) => {
    l();
    ('use strict');
    var { isClean: Ai, my: c0 } = Si(),
      p0 = ki(),
      d0 = ks(),
      h0 = hr();
    function Cs(i, e) {
      let t = new i.constructor();
      for (let r in i) {
        if (!Object.prototype.hasOwnProperty.call(i, r) || r === 'proxyCache')
          continue;
        let n = i[r],
          a = typeof n;
        r === 'parent' && a === 'object'
          ? e && (t[r] = e)
          : r === 'source'
          ? (t[r] = n)
          : Array.isArray(n)
          ? (t[r] = n.map((s) => Cs(s, t)))
          : (a === 'object' && n !== null && (n = Cs(n)), (t[r] = n));
      }
      return t;
    }
    var _i = class {
      constructor(e = {}) {
        (this.raws = {}), (this[Ai] = !1), (this[c0] = !0);
        for (let t in e)
          if (t === 'nodes') {
            this.nodes = [];
            for (let r of e[t])
              typeof r.clone == 'function'
                ? this.append(r.clone())
                : this.append(r);
          } else this[t] = e[t];
      }
      error(e, t = {}) {
        if (this.source) {
          let { start: r, end: n } = this.rangeBy(t);
          return this.source.input.error(
            e,
            { line: r.line, column: r.column },
            { line: n.line, column: n.column },
            t,
          );
        }
        return new p0(e);
      }
      warn(e, t, r) {
        let n = { node: this };
        for (let a in r) n[a] = r[a];
        return e.warn(t, n);
      }
      remove() {
        return (
          this.parent && this.parent.removeChild(this),
          (this.parent = void 0),
          this
        );
      }
      toString(e = h0) {
        e.stringify && (e = e.stringify);
        let t = '';
        return (
          e(this, (r) => {
            t += r;
          }),
          t
        );
      }
      assign(e = {}) {
        for (let t in e) this[t] = e[t];
        return this;
      }
      clone(e = {}) {
        let t = Cs(this);
        for (let r in e) t[r] = e[r];
        return t;
      }
      cloneBefore(e = {}) {
        let t = this.clone(e);
        return this.parent.insertBefore(this, t), t;
      }
      cloneAfter(e = {}) {
        let t = this.clone(e);
        return this.parent.insertAfter(this, t), t;
      }
      replaceWith(...e) {
        if (this.parent) {
          let t = this,
            r = !1;
          for (let n of e)
            n === this
              ? (r = !0)
              : r
              ? (this.parent.insertAfter(t, n), (t = n))
              : this.parent.insertBefore(t, n);
          r || this.remove();
        }
        return this;
      }
      next() {
        if (!this.parent) return;
        let e = this.parent.index(this);
        return this.parent.nodes[e + 1];
      }
      prev() {
        if (!this.parent) return;
        let e = this.parent.index(this);
        return this.parent.nodes[e - 1];
      }
      before(e) {
        return this.parent.insertBefore(this, e), this;
      }
      after(e) {
        return this.parent.insertAfter(this, e), this;
      }
      root() {
        let e = this;
        for (; e.parent && e.parent.type !== 'document'; ) e = e.parent;
        return e;
      }
      raw(e, t) {
        return new d0().raw(this, e, t);
      }
      cleanRaws(e) {
        delete this.raws.before,
          delete this.raws.after,
          e || delete this.raws.between;
      }
      toJSON(e, t) {
        let r = {},
          n = t == null;
        t = t || new Map();
        let a = 0;
        for (let s in this) {
          if (
            !Object.prototype.hasOwnProperty.call(this, s) ||
            s === 'parent' ||
            s === 'proxyCache'
          )
            continue;
          let o = this[s];
          if (Array.isArray(o))
            r[s] = o.map((u) =>
              typeof u == 'object' && u.toJSON ? u.toJSON(null, t) : u,
            );
          else if (typeof o == 'object' && o.toJSON) r[s] = o.toJSON(null, t);
          else if (s === 'source') {
            let u = t.get(o.input);
            u == null && ((u = a), t.set(o.input, a), a++),
              (r[s] = { inputId: u, start: o.start, end: o.end });
          } else r[s] = o;
        }
        return n && (r.inputs = [...t.keys()].map((s) => s.toJSON())), r;
      }
      positionInside(e) {
        let t = this.toString(),
          r = this.source.start.column,
          n = this.source.start.line;
        for (let a = 0; a < e; a++)
          t[a] ===
          `
`
            ? ((r = 1), (n += 1))
            : (r += 1);
        return { line: n, column: r };
      }
      positionBy(e) {
        let t = this.source.start;
        if (e.index) t = this.positionInside(e.index);
        else if (e.word) {
          let r = this.toString().indexOf(e.word);
          r !== -1 && (t = this.positionInside(r));
        }
        return t;
      }
      rangeBy(e) {
        let t = {
            line: this.source.start.line,
            column: this.source.start.column,
          },
          r = this.source.end
            ? { line: this.source.end.line, column: this.source.end.column + 1 }
            : { line: t.line, column: t.column + 1 };
        if (e.word) {
          let n = this.toString().indexOf(e.word);
          n !== -1 &&
            ((t = this.positionInside(n)),
            (r = this.positionInside(n + e.word.length)));
        } else
          e.start
            ? (t = { line: e.start.line, column: e.start.column })
            : e.index && (t = this.positionInside(e.index)),
            e.end
              ? (r = { line: e.end.line, column: e.end.column })
              : e.endIndex
              ? (r = this.positionInside(e.endIndex))
              : e.index && (r = this.positionInside(e.index + 1));
        return (
          (r.line < t.line || (r.line === t.line && r.column <= t.column)) &&
            (r = { line: t.line, column: t.column + 1 }),
          { start: t, end: r }
        );
      }
      getProxyProcessor() {
        return {
          set(e, t, r) {
            return (
              e[t] === r ||
                ((e[t] = r),
                (t === 'prop' ||
                  t === 'value' ||
                  t === 'name' ||
                  t === 'params' ||
                  t === 'important' ||
                  t === 'text') &&
                  e.markDirty()),
              !0
            );
          },
          get(e, t) {
            return t === 'proxyOf'
              ? e
              : t === 'root'
              ? () => e.root().toProxy()
              : e[t];
          },
        };
      }
      toProxy() {
        return (
          this.proxyCache ||
            (this.proxyCache = new Proxy(this, this.getProxyProcessor())),
          this.proxyCache
        );
      }
      addToError(e) {
        if (
          ((e.postcssNode = this),
          e.stack && this.source && /\n\s{4}at /.test(e.stack))
        ) {
          let t = this.source;
          e.stack = e.stack.replace(
            /\n\s{4}at /,
            `$&${t.input.from}:${t.start.line}:${t.start.column}$&`,
          );
        }
        return e;
      }
      markDirty() {
        if (this[Ai]) {
          this[Ai] = !1;
          let e = this;
          for (; (e = e.parent); ) e[Ai] = !1;
        }
      }
      get proxyOf() {
        return this;
      }
    };
    hf.exports = _i;
    _i.default = _i;
  });
  var gr = v((mT, mf) => {
    l();
    ('use strict');
    var m0 = mr(),
      Ei = class extends m0 {
        constructor(e) {
          e &&
            typeof e.value != 'undefined' &&
            typeof e.value != 'string' &&
            (e = { ...e, value: String(e.value) });
          super(e);
          this.type = 'decl';
        }
        get variable() {
          return this.prop.startsWith('--') || this.prop[0] === '$';
        }
      };
    mf.exports = Ei;
    Ei.default = Ei;
  });
  var As = v((gT, gf) => {
    l();
    gf.exports = function (i, e) {
      return {
        generate: () => {
          let t = '';
          return (
            i(e, (r) => {
              t += r;
            }),
            [t]
          );
        },
      };
    };
  });
  var yr = v((yT, yf) => {
    l();
    ('use strict');
    var g0 = mr(),
      Oi = class extends g0 {
        constructor(e) {
          super(e);
          this.type = 'comment';
        }
      };
    yf.exports = Oi;
    Oi.default = Oi;
  });
  var it = v((wT, _f) => {
    l();
    ('use strict');
    var { isClean: wf, my: bf } = Si(),
      vf = gr(),
      xf = yr(),
      y0 = mr(),
      kf,
      _s,
      Es,
      Sf;
    function Cf(i) {
      return i.map(
        (e) => (e.nodes && (e.nodes = Cf(e.nodes)), delete e.source, e),
      );
    }
    function Af(i) {
      if (((i[wf] = !1), i.proxyOf.nodes)) for (let e of i.proxyOf.nodes) Af(e);
    }
    var ye = class extends y0 {
      push(e) {
        return (e.parent = this), this.proxyOf.nodes.push(e), this;
      }
      each(e) {
        if (!this.proxyOf.nodes) return;
        let t = this.getIterator(),
          r,
          n;
        for (
          ;
          this.indexes[t] < this.proxyOf.nodes.length &&
          ((r = this.indexes[t]), (n = e(this.proxyOf.nodes[r], r)), n !== !1);

        )
          this.indexes[t] += 1;
        return delete this.indexes[t], n;
      }
      walk(e) {
        return this.each((t, r) => {
          let n;
          try {
            n = e(t, r);
          } catch (a) {
            throw t.addToError(a);
          }
          return n !== !1 && t.walk && (n = t.walk(e)), n;
        });
      }
      walkDecls(e, t) {
        return t
          ? e instanceof RegExp
            ? this.walk((r, n) => {
                if (r.type === 'decl' && e.test(r.prop)) return t(r, n);
              })
            : this.walk((r, n) => {
                if (r.type === 'decl' && r.prop === e) return t(r, n);
              })
          : ((t = e),
            this.walk((r, n) => {
              if (r.type === 'decl') return t(r, n);
            }));
      }
      walkRules(e, t) {
        return t
          ? e instanceof RegExp
            ? this.walk((r, n) => {
                if (r.type === 'rule' && e.test(r.selector)) return t(r, n);
              })
            : this.walk((r, n) => {
                if (r.type === 'rule' && r.selector === e) return t(r, n);
              })
          : ((t = e),
            this.walk((r, n) => {
              if (r.type === 'rule') return t(r, n);
            }));
      }
      walkAtRules(e, t) {
        return t
          ? e instanceof RegExp
            ? this.walk((r, n) => {
                if (r.type === 'atrule' && e.test(r.name)) return t(r, n);
              })
            : this.walk((r, n) => {
                if (r.type === 'atrule' && r.name === e) return t(r, n);
              })
          : ((t = e),
            this.walk((r, n) => {
              if (r.type === 'atrule') return t(r, n);
            }));
      }
      walkComments(e) {
        return this.walk((t, r) => {
          if (t.type === 'comment') return e(t, r);
        });
      }
      append(...e) {
        for (let t of e) {
          let r = this.normalize(t, this.last);
          for (let n of r) this.proxyOf.nodes.push(n);
        }
        return this.markDirty(), this;
      }
      prepend(...e) {
        e = e.reverse();
        for (let t of e) {
          let r = this.normalize(t, this.first, 'prepend').reverse();
          for (let n of r) this.proxyOf.nodes.unshift(n);
          for (let n in this.indexes)
            this.indexes[n] = this.indexes[n] + r.length;
        }
        return this.markDirty(), this;
      }
      cleanRaws(e) {
        if ((super.cleanRaws(e), this.nodes))
          for (let t of this.nodes) t.cleanRaws(e);
      }
      insertBefore(e, t) {
        let r = this.index(e),
          n = r === 0 ? 'prepend' : !1,
          a = this.normalize(t, this.proxyOf.nodes[r], n).reverse();
        r = this.index(e);
        for (let o of a) this.proxyOf.nodes.splice(r, 0, o);
        let s;
        for (let o in this.indexes)
          (s = this.indexes[o]), r <= s && (this.indexes[o] = s + a.length);
        return this.markDirty(), this;
      }
      insertAfter(e, t) {
        let r = this.index(e),
          n = this.normalize(t, this.proxyOf.nodes[r]).reverse();
        r = this.index(e);
        for (let s of n) this.proxyOf.nodes.splice(r + 1, 0, s);
        let a;
        for (let s in this.indexes)
          (a = this.indexes[s]), r < a && (this.indexes[s] = a + n.length);
        return this.markDirty(), this;
      }
      removeChild(e) {
        (e = this.index(e)),
          (this.proxyOf.nodes[e].parent = void 0),
          this.proxyOf.nodes.splice(e, 1);
        let t;
        for (let r in this.indexes)
          (t = this.indexes[r]), t >= e && (this.indexes[r] = t - 1);
        return this.markDirty(), this;
      }
      removeAll() {
        for (let e of this.proxyOf.nodes) e.parent = void 0;
        return (this.proxyOf.nodes = []), this.markDirty(), this;
      }
      replaceValues(e, t, r) {
        return (
          r || ((r = t), (t = {})),
          this.walkDecls((n) => {
            (t.props && !t.props.includes(n.prop)) ||
              (t.fast && !n.value.includes(t.fast)) ||
              (n.value = n.value.replace(e, r));
          }),
          this.markDirty(),
          this
        );
      }
      every(e) {
        return this.nodes.every(e);
      }
      some(e) {
        return this.nodes.some(e);
      }
      index(e) {
        return typeof e == 'number'
          ? e
          : (e.proxyOf && (e = e.proxyOf), this.proxyOf.nodes.indexOf(e));
      }
      get first() {
        if (!!this.proxyOf.nodes) return this.proxyOf.nodes[0];
      }
      get last() {
        if (!!this.proxyOf.nodes)
          return this.proxyOf.nodes[this.proxyOf.nodes.length - 1];
      }
      normalize(e, t) {
        if (typeof e == 'string') e = Cf(kf(e).nodes);
        else if (Array.isArray(e)) {
          e = e.slice(0);
          for (let n of e) n.parent && n.parent.removeChild(n, 'ignore');
        } else if (e.type === 'root' && this.type !== 'document') {
          e = e.nodes.slice(0);
          for (let n of e) n.parent && n.parent.removeChild(n, 'ignore');
        } else if (e.type) e = [e];
        else if (e.prop) {
          if (typeof e.value == 'undefined')
            throw new Error('Value field is missed in node creation');
          typeof e.value != 'string' && (e.value = String(e.value)),
            (e = [new vf(e)]);
        } else if (e.selector) e = [new _s(e)];
        else if (e.name) e = [new Es(e)];
        else if (e.text) e = [new xf(e)];
        else throw new Error('Unknown node type in node creation');
        return e.map(
          (n) => (
            n[bf] || ye.rebuild(n),
            (n = n.proxyOf),
            n.parent && n.parent.removeChild(n),
            n[wf] && Af(n),
            typeof n.raws.before == 'undefined' &&
              t &&
              typeof t.raws.before != 'undefined' &&
              (n.raws.before = t.raws.before.replace(/\S/g, '')),
            (n.parent = this.proxyOf),
            n
          ),
        );
      }
      getProxyProcessor() {
        return {
          set(e, t, r) {
            return (
              e[t] === r ||
                ((e[t] = r),
                (t === 'name' || t === 'params' || t === 'selector') &&
                  e.markDirty()),
              !0
            );
          },
          get(e, t) {
            return t === 'proxyOf'
              ? e
              : e[t]
              ? t === 'each' || (typeof t == 'string' && t.startsWith('walk'))
                ? (...r) =>
                    e[t](
                      ...r.map((n) =>
                        typeof n == 'function'
                          ? (a, s) => n(a.toProxy(), s)
                          : n,
                      ),
                    )
                : t === 'every' || t === 'some'
                ? (r) => e[t]((n, ...a) => r(n.toProxy(), ...a))
                : t === 'root'
                ? () => e.root().toProxy()
                : t === 'nodes'
                ? e.nodes.map((r) => r.toProxy())
                : t === 'first' || t === 'last'
                ? e[t].toProxy()
                : e[t]
              : e[t];
          },
        };
      }
      getIterator() {
        this.lastEach || (this.lastEach = 0),
          this.indexes || (this.indexes = {}),
          (this.lastEach += 1);
        let e = this.lastEach;
        return (this.indexes[e] = 0), e;
      }
    };
    ye.registerParse = (i) => {
      kf = i;
    };
    ye.registerRule = (i) => {
      _s = i;
    };
    ye.registerAtRule = (i) => {
      Es = i;
    };
    ye.registerRoot = (i) => {
      Sf = i;
    };
    _f.exports = ye;
    ye.default = ye;
    ye.rebuild = (i) => {
      i.type === 'atrule'
        ? Object.setPrototypeOf(i, Es.prototype)
        : i.type === 'rule'
        ? Object.setPrototypeOf(i, _s.prototype)
        : i.type === 'decl'
        ? Object.setPrototypeOf(i, vf.prototype)
        : i.type === 'comment'
        ? Object.setPrototypeOf(i, xf.prototype)
        : i.type === 'root' && Object.setPrototypeOf(i, Sf.prototype),
        (i[bf] = !0),
        i.nodes &&
          i.nodes.forEach((e) => {
            ye.rebuild(e);
          });
    };
  });
  var Ti = v((bT, Tf) => {
    l();
    ('use strict');
    var w0 = it(),
      Ef,
      Of,
      At = class extends w0 {
        constructor(e) {
          super({ type: 'document', ...e });
          this.nodes || (this.nodes = []);
        }
        toResult(e = {}) {
          return new Ef(new Of(), this, e).stringify();
        }
      };
    At.registerLazyResult = (i) => {
      Ef = i;
    };
    At.registerProcessor = (i) => {
      Of = i;
    };
    Tf.exports = At;
    At.default = At;
  });
  var Os = v((vT, Df) => {
    l();
    ('use strict');
    var Pf = {};
    Df.exports = function (e) {
      Pf[e] ||
        ((Pf[e] = !0),
        typeof console != 'undefined' && console.warn && console.warn(e));
    };
  });
  var Ts = v((xT, If) => {
    l();
    ('use strict');
    var Pi = class {
      constructor(e, t = {}) {
        if (
          ((this.type = 'warning'), (this.text = e), t.node && t.node.source)
        ) {
          let r = t.node.rangeBy(t);
          (this.line = r.start.line),
            (this.column = r.start.column),
            (this.endLine = r.end.line),
            (this.endColumn = r.end.column);
        }
        for (let r in t) this[r] = t[r];
      }
      toString() {
        return this.node
          ? this.node.error(this.text, {
              plugin: this.plugin,
              index: this.index,
              word: this.word,
            }).message
          : this.plugin
          ? this.plugin + ': ' + this.text
          : this.text;
      }
    };
    If.exports = Pi;
    Pi.default = Pi;
  });
  var Ii = v((kT, qf) => {
    l();
    ('use strict');
    var b0 = Ts(),
      Di = class {
        constructor(e, t, r) {
          (this.processor = e),
            (this.messages = []),
            (this.root = t),
            (this.opts = r),
            (this.css = void 0),
            (this.map = void 0);
        }
        toString() {
          return this.css;
        }
        warn(e, t = {}) {
          t.plugin ||
            (this.lastPlugin &&
              this.lastPlugin.postcssPlugin &&
              (t.plugin = this.lastPlugin.postcssPlugin));
          let r = new b0(e, t);
          return this.messages.push(r), r;
        }
        warnings() {
          return this.messages.filter((e) => e.type === 'warning');
        }
        get content() {
          return this.css;
        }
      };
    qf.exports = Di;
    Di.default = Di;
  });
  var Nf = v((ST, Ff) => {
    l();
    ('use strict');
    var Ps = "'".charCodeAt(0),
      Rf = '"'.charCodeAt(0),
      qi = '\\'.charCodeAt(0),
      Mf = '/'.charCodeAt(0),
      Ri = `
`.charCodeAt(0),
      wr = ' '.charCodeAt(0),
      Mi = '\f'.charCodeAt(0),
      Bi = '	'.charCodeAt(0),
      Fi = '\r'.charCodeAt(0),
      v0 = '['.charCodeAt(0),
      x0 = ']'.charCodeAt(0),
      k0 = '('.charCodeAt(0),
      S0 = ')'.charCodeAt(0),
      C0 = '{'.charCodeAt(0),
      A0 = '}'.charCodeAt(0),
      _0 = ';'.charCodeAt(0),
      E0 = '*'.charCodeAt(0),
      O0 = ':'.charCodeAt(0),
      T0 = '@'.charCodeAt(0),
      Ni = /[\t\n\f\r "#'()/;[\\\]{}]/g,
      Li = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g,
      P0 = /.[\n"'(/\\]/,
      Bf = /[\da-f]/i;
    Ff.exports = function (e, t = {}) {
      let r = e.css.valueOf(),
        n = t.ignoreErrors,
        a,
        s,
        o,
        u,
        c,
        f,
        p,
        d,
        h,
        y,
        x = r.length,
        w = 0,
        b = [],
        k = [];
      function S() {
        return w;
      }
      function _(q) {
        throw e.error('Unclosed ' + q, w);
      }
      function E() {
        return k.length === 0 && w >= x;
      }
      function I(q) {
        if (k.length) return k.pop();
        if (w >= x) return;
        let X = q ? q.ignoreUnclosed : !1;
        switch (((a = r.charCodeAt(w)), a)) {
          case Ri:
          case wr:
          case Bi:
          case Fi:
          case Mi: {
            s = w;
            do (s += 1), (a = r.charCodeAt(s));
            while (a === wr || a === Ri || a === Bi || a === Fi || a === Mi);
            (y = ['space', r.slice(w, s)]), (w = s - 1);
            break;
          }
          case v0:
          case x0:
          case C0:
          case A0:
          case O0:
          case _0:
          case S0: {
            let ae = String.fromCharCode(a);
            y = [ae, ae, w];
            break;
          }
          case k0: {
            if (
              ((d = b.length ? b.pop()[1] : ''),
              (h = r.charCodeAt(w + 1)),
              d === 'url' &&
                h !== Ps &&
                h !== Rf &&
                h !== wr &&
                h !== Ri &&
                h !== Bi &&
                h !== Mi &&
                h !== Fi)
            ) {
              s = w;
              do {
                if (((f = !1), (s = r.indexOf(')', s + 1)), s === -1))
                  if (n || X) {
                    s = w;
                    break;
                  } else _('bracket');
                for (p = s; r.charCodeAt(p - 1) === qi; ) (p -= 1), (f = !f);
              } while (f);
              (y = ['brackets', r.slice(w, s + 1), w, s]), (w = s);
            } else
              (s = r.indexOf(')', w + 1)),
                (u = r.slice(w, s + 1)),
                s === -1 || P0.test(u)
                  ? (y = ['(', '(', w])
                  : ((y = ['brackets', u, w, s]), (w = s));
            break;
          }
          case Ps:
          case Rf: {
            (o = a === Ps ? "'" : '"'), (s = w);
            do {
              if (((f = !1), (s = r.indexOf(o, s + 1)), s === -1))
                if (n || X) {
                  s = w + 1;
                  break;
                } else _('string');
              for (p = s; r.charCodeAt(p - 1) === qi; ) (p -= 1), (f = !f);
            } while (f);
            (y = ['string', r.slice(w, s + 1), w, s]), (w = s);
            break;
          }
          case T0: {
            (Ni.lastIndex = w + 1),
              Ni.test(r),
              Ni.lastIndex === 0 ? (s = r.length - 1) : (s = Ni.lastIndex - 2),
              (y = ['at-word', r.slice(w, s + 1), w, s]),
              (w = s);
            break;
          }
          case qi: {
            for (s = w, c = !0; r.charCodeAt(s + 1) === qi; )
              (s += 1), (c = !c);
            if (
              ((a = r.charCodeAt(s + 1)),
              c &&
                a !== Mf &&
                a !== wr &&
                a !== Ri &&
                a !== Bi &&
                a !== Fi &&
                a !== Mi &&
                ((s += 1), Bf.test(r.charAt(s))))
            ) {
              for (; Bf.test(r.charAt(s + 1)); ) s += 1;
              r.charCodeAt(s + 1) === wr && (s += 1);
            }
            (y = ['word', r.slice(w, s + 1), w, s]), (w = s);
            break;
          }
          default: {
            a === Mf && r.charCodeAt(w + 1) === E0
              ? ((s = r.indexOf('*/', w + 2) + 1),
                s === 0 && (n || X ? (s = r.length) : _('comment')),
                (y = ['comment', r.slice(w, s + 1), w, s]),
                (w = s))
              : ((Li.lastIndex = w + 1),
                Li.test(r),
                Li.lastIndex === 0
                  ? (s = r.length - 1)
                  : (s = Li.lastIndex - 2),
                (y = ['word', r.slice(w, s + 1), w, s]),
                b.push(y),
                (w = s));
            break;
          }
        }
        return w++, y;
      }
      function B(q) {
        k.push(q);
      }
      return { back: B, nextToken: I, endOfFile: E, position: S };
    };
  });
  var $i = v((CT, $f) => {
    l();
    ('use strict');
    var Lf = it(),
      br = class extends Lf {
        constructor(e) {
          super(e);
          this.type = 'atrule';
        }
        append(...e) {
          return this.proxyOf.nodes || (this.nodes = []), super.append(...e);
        }
        prepend(...e) {
          return this.proxyOf.nodes || (this.nodes = []), super.prepend(...e);
        }
      };
    $f.exports = br;
    br.default = br;
    Lf.registerAtRule(br);
  });
  var _t = v((AT, Uf) => {
    l();
    ('use strict');
    var jf = it(),
      zf,
      Vf,
      gt = class extends jf {
        constructor(e) {
          super(e);
          (this.type = 'root'), this.nodes || (this.nodes = []);
        }
        removeChild(e, t) {
          let r = this.index(e);
          return (
            !t &&
              r === 0 &&
              this.nodes.length > 1 &&
              (this.nodes[1].raws.before = this.nodes[r].raws.before),
            super.removeChild(e)
          );
        }
        normalize(e, t, r) {
          let n = super.normalize(e);
          if (t) {
            if (r === 'prepend')
              this.nodes.length > 1
                ? (t.raws.before = this.nodes[1].raws.before)
                : delete t.raws.before;
            else if (this.first !== t)
              for (let a of n) a.raws.before = t.raws.before;
          }
          return n;
        }
        toResult(e = {}) {
          return new zf(new Vf(), this, e).stringify();
        }
      };
    gt.registerLazyResult = (i) => {
      zf = i;
    };
    gt.registerProcessor = (i) => {
      Vf = i;
    };
    Uf.exports = gt;
    gt.default = gt;
    jf.registerRoot(gt);
  });
  var Ds = v((_T, Wf) => {
    l();
    ('use strict');
    var vr = {
      split(i, e, t) {
        let r = [],
          n = '',
          a = !1,
          s = 0,
          o = !1,
          u = '',
          c = !1;
        for (let f of i)
          c
            ? (c = !1)
            : f === '\\'
            ? (c = !0)
            : o
            ? f === u && (o = !1)
            : f === '"' || f === "'"
            ? ((o = !0), (u = f))
            : f === '('
            ? (s += 1)
            : f === ')'
            ? s > 0 && (s -= 1)
            : s === 0 && e.includes(f) && (a = !0),
            a ? (n !== '' && r.push(n.trim()), (n = ''), (a = !1)) : (n += f);
        return (t || n !== '') && r.push(n.trim()), r;
      },
      space(i) {
        let e = [
          ' ',
          `
`,
          '	',
        ];
        return vr.split(i, e);
      },
      comma(i) {
        return vr.split(i, [','], !0);
      },
    };
    Wf.exports = vr;
    vr.default = vr;
  });
  var ji = v((ET, Hf) => {
    l();
    ('use strict');
    var Gf = it(),
      D0 = Ds(),
      xr = class extends Gf {
        constructor(e) {
          super(e);
          (this.type = 'rule'), this.nodes || (this.nodes = []);
        }
        get selectors() {
          return D0.comma(this.selector);
        }
        set selectors(e) {
          let t = this.selector ? this.selector.match(/,\s*/) : null,
            r = t ? t[0] : ',' + this.raw('between', 'beforeOpen');
          this.selector = e.join(r);
        }
      };
    Hf.exports = xr;
    xr.default = xr;
    Gf.registerRule(xr);
  });
  var Kf = v((OT, Xf) => {
    l();
    ('use strict');
    var I0 = gr(),
      q0 = Nf(),
      R0 = yr(),
      M0 = $i(),
      B0 = _t(),
      Yf = ji(),
      Qf = { empty: !0, space: !0 };
    function F0(i) {
      for (let e = i.length - 1; e >= 0; e--) {
        let t = i[e],
          r = t[3] || t[2];
        if (r) return r;
      }
    }
    var Jf = class {
      constructor(e) {
        (this.input = e),
          (this.root = new B0()),
          (this.current = this.root),
          (this.spaces = ''),
          (this.semicolon = !1),
          (this.customProperty = !1),
          this.createTokenizer(),
          (this.root.source = {
            input: e,
            start: { offset: 0, line: 1, column: 1 },
          });
      }
      createTokenizer() {
        this.tokenizer = q0(this.input);
      }
      parse() {
        let e;
        for (; !this.tokenizer.endOfFile(); )
          switch (((e = this.tokenizer.nextToken()), e[0])) {
            case 'space':
              this.spaces += e[1];
              break;
            case ';':
              this.freeSemicolon(e);
              break;
            case '}':
              this.end(e);
              break;
            case 'comment':
              this.comment(e);
              break;
            case 'at-word':
              this.atrule(e);
              break;
            case '{':
              this.emptyRule(e);
              break;
            default:
              this.other(e);
              break;
          }
        this.endFile();
      }
      comment(e) {
        let t = new R0();
        this.init(t, e[2]), (t.source.end = this.getPosition(e[3] || e[2]));
        let r = e[1].slice(2, -2);
        if (/^\s*$/.test(r))
          (t.text = ''), (t.raws.left = r), (t.raws.right = '');
        else {
          let n = r.match(/^(\s*)([^]*\S)(\s*)$/);
          (t.text = n[2]), (t.raws.left = n[1]), (t.raws.right = n[3]);
        }
      }
      emptyRule(e) {
        let t = new Yf();
        this.init(t, e[2]),
          (t.selector = ''),
          (t.raws.between = ''),
          (this.current = t);
      }
      other(e) {
        let t = !1,
          r = null,
          n = !1,
          a = null,
          s = [],
          o = e[1].startsWith('--'),
          u = [],
          c = e;
        for (; c; ) {
          if (((r = c[0]), u.push(c), r === '(' || r === '['))
            a || (a = c), s.push(r === '(' ? ')' : ']');
          else if (o && n && r === '{') a || (a = c), s.push('}');
          else if (s.length === 0)
            if (r === ';')
              if (n) {
                this.decl(u, o);
                return;
              } else break;
            else if (r === '{') {
              this.rule(u);
              return;
            } else if (r === '}') {
              this.tokenizer.back(u.pop()), (t = !0);
              break;
            } else r === ':' && (n = !0);
          else r === s[s.length - 1] && (s.pop(), s.length === 0 && (a = null));
          c = this.tokenizer.nextToken();
        }
        if (
          (this.tokenizer.endOfFile() && (t = !0),
          s.length > 0 && this.unclosedBracket(a),
          t && n)
        ) {
          if (!o)
            for (
              ;
              u.length &&
              ((c = u[u.length - 1][0]), !(c !== 'space' && c !== 'comment'));

            )
              this.tokenizer.back(u.pop());
          this.decl(u, o);
        } else this.unknownWord(u);
      }
      rule(e) {
        e.pop();
        let t = new Yf();
        this.init(t, e[0][2]),
          (t.raws.between = this.spacesAndCommentsFromEnd(e)),
          this.raw(t, 'selector', e),
          (this.current = t);
      }
      decl(e, t) {
        let r = new I0();
        this.init(r, e[0][2]);
        let n = e[e.length - 1];
        for (
          n[0] === ';' && ((this.semicolon = !0), e.pop()),
            r.source.end = this.getPosition(n[3] || n[2] || F0(e));
          e[0][0] !== 'word';

        )
          e.length === 1 && this.unknownWord(e),
            (r.raws.before += e.shift()[1]);
        for (
          r.source.start = this.getPosition(e[0][2]), r.prop = '';
          e.length;

        ) {
          let c = e[0][0];
          if (c === ':' || c === 'space' || c === 'comment') break;
          r.prop += e.shift()[1];
        }
        r.raws.between = '';
        let a;
        for (; e.length; )
          if (((a = e.shift()), a[0] === ':')) {
            r.raws.between += a[1];
            break;
          } else
            a[0] === 'word' && /\w/.test(a[1]) && this.unknownWord([a]),
              (r.raws.between += a[1]);
        (r.prop[0] === '_' || r.prop[0] === '*') &&
          ((r.raws.before += r.prop[0]), (r.prop = r.prop.slice(1)));
        let s = [],
          o;
        for (
          ;
          e.length && ((o = e[0][0]), !(o !== 'space' && o !== 'comment'));

        )
          s.push(e.shift());
        this.precheckMissedSemicolon(e);
        for (let c = e.length - 1; c >= 0; c--) {
          if (((a = e[c]), a[1].toLowerCase() === '!important')) {
            r.important = !0;
            let f = this.stringFrom(e, c);
            (f = this.spacesFromEnd(e) + f),
              f !== ' !important' && (r.raws.important = f);
            break;
          } else if (a[1].toLowerCase() === 'important') {
            let f = e.slice(0),
              p = '';
            for (let d = c; d > 0; d--) {
              let h = f[d][0];
              if (p.trim().indexOf('!') === 0 && h !== 'space') break;
              p = f.pop()[1] + p;
            }
            p.trim().indexOf('!') === 0 &&
              ((r.important = !0), (r.raws.important = p), (e = f));
          }
          if (a[0] !== 'space' && a[0] !== 'comment') break;
        }
        e.some((c) => c[0] !== 'space' && c[0] !== 'comment') &&
          ((r.raws.between += s.map((c) => c[1]).join('')), (s = [])),
          this.raw(r, 'value', s.concat(e), t),
          r.value.includes(':') && !t && this.checkMissedSemicolon(e);
      }
      atrule(e) {
        let t = new M0();
        (t.name = e[1].slice(1)),
          t.name === '' && this.unnamedAtrule(t, e),
          this.init(t, e[2]);
        let r,
          n,
          a,
          s = !1,
          o = !1,
          u = [],
          c = [];
        for (; !this.tokenizer.endOfFile(); ) {
          if (
            ((e = this.tokenizer.nextToken()),
            (r = e[0]),
            r === '(' || r === '['
              ? c.push(r === '(' ? ')' : ']')
              : r === '{' && c.length > 0
              ? c.push('}')
              : r === c[c.length - 1] && c.pop(),
            c.length === 0)
          )
            if (r === ';') {
              (t.source.end = this.getPosition(e[2])), (this.semicolon = !0);
              break;
            } else if (r === '{') {
              o = !0;
              break;
            } else if (r === '}') {
              if (u.length > 0) {
                for (a = u.length - 1, n = u[a]; n && n[0] === 'space'; )
                  n = u[--a];
                n && (t.source.end = this.getPosition(n[3] || n[2]));
              }
              this.end(e);
              break;
            } else u.push(e);
          else u.push(e);
          if (this.tokenizer.endOfFile()) {
            s = !0;
            break;
          }
        }
        (t.raws.between = this.spacesAndCommentsFromEnd(u)),
          u.length
            ? ((t.raws.afterName = this.spacesAndCommentsFromStart(u)),
              this.raw(t, 'params', u),
              s &&
                ((e = u[u.length - 1]),
                (t.source.end = this.getPosition(e[3] || e[2])),
                (this.spaces = t.raws.between),
                (t.raws.between = '')))
            : ((t.raws.afterName = ''), (t.params = '')),
          o && ((t.nodes = []), (this.current = t));
      }
      end(e) {
        this.current.nodes &&
          this.current.nodes.length &&
          (this.current.raws.semicolon = this.semicolon),
          (this.semicolon = !1),
          (this.current.raws.after =
            (this.current.raws.after || '') + this.spaces),
          (this.spaces = ''),
          this.current.parent
            ? ((this.current.source.end = this.getPosition(e[2])),
              (this.current = this.current.parent))
            : this.unexpectedClose(e);
      }
      endFile() {
        this.current.parent && this.unclosedBlock(),
          this.current.nodes &&
            this.current.nodes.length &&
            (this.current.raws.semicolon = this.semicolon),
          (this.current.raws.after =
            (this.current.raws.after || '') + this.spaces);
      }
      freeSemicolon(e) {
        if (((this.spaces += e[1]), this.current.nodes)) {
          let t = this.current.nodes[this.current.nodes.length - 1];
          t &&
            t.type === 'rule' &&
            !t.raws.ownSemicolon &&
            ((t.raws.ownSemicolon = this.spaces), (this.spaces = ''));
        }
      }
      getPosition(e) {
        let t = this.input.fromOffset(e);
        return { offset: e, line: t.line, column: t.col };
      }
      init(e, t) {
        this.current.push(e),
          (e.source = { start: this.getPosition(t), input: this.input }),
          (e.raws.before = this.spaces),
          (this.spaces = ''),
          e.type !== 'comment' && (this.semicolon = !1);
      }
      raw(e, t, r, n) {
        let a,
          s,
          o = r.length,
          u = '',
          c = !0,
          f,
          p;
        for (let d = 0; d < o; d += 1)
          (a = r[d]),
            (s = a[0]),
            s === 'space' && d === o - 1 && !n
              ? (c = !1)
              : s === 'comment'
              ? ((p = r[d - 1] ? r[d - 1][0] : 'empty'),
                (f = r[d + 1] ? r[d + 1][0] : 'empty'),
                !Qf[p] && !Qf[f]
                  ? u.slice(-1) === ','
                    ? (c = !1)
                    : (u += a[1])
                  : (c = !1))
              : (u += a[1]);
        if (!c) {
          let d = r.reduce((h, y) => h + y[1], '');
          e.raws[t] = { value: u, raw: d };
        }
        e[t] = u;
      }
      spacesAndCommentsFromEnd(e) {
        let t,
          r = '';
        for (
          ;
          e.length &&
          ((t = e[e.length - 1][0]), !(t !== 'space' && t !== 'comment'));

        )
          r = e.pop()[1] + r;
        return r;
      }
      spacesAndCommentsFromStart(e) {
        let t,
          r = '';
        for (
          ;
          e.length && ((t = e[0][0]), !(t !== 'space' && t !== 'comment'));

        )
          r += e.shift()[1];
        return r;
      }
      spacesFromEnd(e) {
        let t,
          r = '';
        for (; e.length && ((t = e[e.length - 1][0]), t === 'space'); )
          r = e.pop()[1] + r;
        return r;
      }
      stringFrom(e, t) {
        let r = '';
        for (let n = t; n < e.length; n++) r += e[n][1];
        return e.splice(t, e.length - t), r;
      }
      colon(e) {
        let t = 0,
          r,
          n,
          a;
        for (let [s, o] of e.entries()) {
          if (
            ((r = o),
            (n = r[0]),
            n === '(' && (t += 1),
            n === ')' && (t -= 1),
            t === 0 && n === ':')
          )
            if (!a) this.doubleColon(r);
            else {
              if (a[0] === 'word' && a[1] === 'progid') continue;
              return s;
            }
          a = r;
        }
        return !1;
      }
      unclosedBracket(e) {
        throw this.input.error(
          'Unclosed bracket',
          { offset: e[2] },
          { offset: e[2] + 1 },
        );
      }
      unknownWord(e) {
        throw this.input.error(
          'Unknown word',
          { offset: e[0][2] },
          { offset: e[0][2] + e[0][1].length },
        );
      }
      unexpectedClose(e) {
        throw this.input.error(
          'Unexpected }',
          { offset: e[2] },
          { offset: e[2] + 1 },
        );
      }
      unclosedBlock() {
        let e = this.current.source.start;
        throw this.input.error('Unclosed block', e.line, e.column);
      }
      doubleColon(e) {
        throw this.input.error(
          'Double colon',
          { offset: e[2] },
          { offset: e[2] + e[1].length },
        );
      }
      unnamedAtrule(e, t) {
        throw this.input.error(
          'At-rule without name',
          { offset: t[2] },
          { offset: t[2] + t[1].length },
        );
      }
      precheckMissedSemicolon() {}
      checkMissedSemicolon(e) {
        let t = this.colon(e);
        if (t === !1) return;
        let r = 0,
          n;
        for (
          let a = t - 1;
          a >= 0 && ((n = e[a]), !(n[0] !== 'space' && ((r += 1), r === 2)));
          a--
        );
        throw this.input.error(
          'Missed semicolon',
          n[0] === 'word' ? n[3] + 1 : n[2],
        );
      }
    };
    Xf.exports = Jf;
  });
  var Zf = v(() => {
    l();
  });
  var tc = v((DT, ec) => {
    l();
    var N0 = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict',
      L0 =
        (i, e = 21) =>
        (t = e) => {
          let r = '',
            n = t;
          for (; n--; ) r += i[(Math.random() * i.length) | 0];
          return r;
        },
      $0 = (i = 21) => {
        let e = '',
          t = i;
        for (; t--; ) e += N0[(Math.random() * 64) | 0];
        return e;
      };
    ec.exports = { nanoid: $0, customAlphabet: L0 };
  });
  var Is = v((IT, rc) => {
    l();
    rc.exports = {};
  });
  var Vi = v((qT, ac) => {
    l();
    ('use strict');
    var { SourceMapConsumer: j0, SourceMapGenerator: z0 } = Zf(),
      { fileURLToPath: ic, pathToFileURL: zi } = (bs(), of),
      { resolve: qs, isAbsolute: Rs } = (mt(), nf),
      { nanoid: V0 } = tc(),
      Ms = vs(),
      nc = ki(),
      U0 = Is(),
      Bs = Symbol('fromOffsetCache'),
      W0 = Boolean(j0 && z0),
      sc = Boolean(qs && Rs),
      kr = class {
        constructor(e, t = {}) {
          if (
            e === null ||
            typeof e == 'undefined' ||
            (typeof e == 'object' && !e.toString)
          )
            throw new Error(`PostCSS received ${e} instead of CSS string`);
          if (
            ((this.css = e.toString()),
            this.css[0] === '\uFEFF' || this.css[0] === '\uFFFE'
              ? ((this.hasBOM = !0), (this.css = this.css.slice(1)))
              : (this.hasBOM = !1),
            t.from &&
              (!sc || /^\w+:\/\//.test(t.from) || Rs(t.from)
                ? (this.file = t.from)
                : (this.file = qs(t.from))),
            sc && W0)
          ) {
            let r = new U0(this.css, t);
            if (r.text) {
              this.map = r;
              let n = r.consumer().file;
              !this.file && n && (this.file = this.mapResolve(n));
            }
          }
          this.file || (this.id = '<input css ' + V0(6) + '>'),
            this.map && (this.map.file = this.from);
        }
        fromOffset(e) {
          let t, r;
          if (this[Bs]) r = this[Bs];
          else {
            let a = this.css.split(`
`);
            r = new Array(a.length);
            let s = 0;
            for (let o = 0, u = a.length; o < u; o++)
              (r[o] = s), (s += a[o].length + 1);
            this[Bs] = r;
          }
          t = r[r.length - 1];
          let n = 0;
          if (e >= t) n = r.length - 1;
          else {
            let a = r.length - 2,
              s;
            for (; n < a; )
              if (((s = n + ((a - n) >> 1)), e < r[s])) a = s - 1;
              else if (e >= r[s + 1]) n = s + 1;
              else {
                n = s;
                break;
              }
          }
          return { line: n + 1, col: e - r[n] + 1 };
        }
        error(e, t, r, n = {}) {
          let a, s, o;
          if (t && typeof t == 'object') {
            let c = t,
              f = r;
            if (typeof c.offset == 'number') {
              let p = this.fromOffset(c.offset);
              (t = p.line), (r = p.col);
            } else (t = c.line), (r = c.column);
            if (typeof f.offset == 'number') {
              let p = this.fromOffset(f.offset);
              (s = p.line), (o = p.col);
            } else (s = f.line), (o = f.column);
          } else if (!r) {
            let c = this.fromOffset(t);
            (t = c.line), (r = c.col);
          }
          let u = this.origin(t, r, s, o);
          return (
            u
              ? (a = new nc(
                  e,
                  u.endLine === void 0
                    ? u.line
                    : { line: u.line, column: u.column },
                  u.endLine === void 0
                    ? u.column
                    : { line: u.endLine, column: u.endColumn },
                  u.source,
                  u.file,
                  n.plugin,
                ))
              : (a = new nc(
                  e,
                  s === void 0 ? t : { line: t, column: r },
                  s === void 0 ? r : { line: s, column: o },
                  this.css,
                  this.file,
                  n.plugin,
                )),
            (a.input = {
              line: t,
              column: r,
              endLine: s,
              endColumn: o,
              source: this.css,
            }),
            this.file &&
              (zi && (a.input.url = zi(this.file).toString()),
              (a.input.file = this.file)),
            a
          );
        }
        origin(e, t, r, n) {
          if (!this.map) return !1;
          let a = this.map.consumer(),
            s = a.originalPositionFor({ line: e, column: t });
          if (!s.source) return !1;
          let o;
          typeof r == 'number' &&
            (o = a.originalPositionFor({ line: r, column: n }));
          let u;
          Rs(s.source)
            ? (u = zi(s.source))
            : (u = new URL(
                s.source,
                this.map.consumer().sourceRoot || zi(this.map.mapFile),
              ));
          let c = {
            url: u.toString(),
            line: s.line,
            column: s.column,
            endLine: o && o.line,
            endColumn: o && o.column,
          };
          if (u.protocol === 'file:')
            if (ic) c.file = ic(u);
            else
              throw new Error(
                'file: protocol is not available in this PostCSS build',
              );
          let f = a.sourceContentFor(s.source);
          return f && (c.source = f), c;
        }
        mapResolve(e) {
          return /^\w+:\/\//.test(e)
            ? e
            : qs(this.map.consumer().sourceRoot || this.map.root || '.', e);
        }
        get from() {
          return this.file || this.id;
        }
        toJSON() {
          let e = {};
          for (let t of ['hasBOM', 'css', 'file', 'id'])
            this[t] != null && (e[t] = this[t]);
          return (
            this.map &&
              ((e.map = { ...this.map }),
              e.map.consumerCache && (e.map.consumerCache = void 0)),
            e
          );
        }
      };
    ac.exports = kr;
    kr.default = kr;
    Ms && Ms.registerInput && Ms.registerInput(kr);
  });
  var Wi = v((RT, oc) => {
    l();
    ('use strict');
    var G0 = it(),
      H0 = Kf(),
      Y0 = Vi();
    function Ui(i, e) {
      let t = new Y0(i, e),
        r = new H0(t);
      try {
        r.parse();
      } catch (n) {
        throw n;
      }
      return r.root;
    }
    oc.exports = Ui;
    Ui.default = Ui;
    G0.registerParse(Ui);
  });
  var Ls = v((BT, cc) => {
    l();
    ('use strict');
    var { isClean: qe, my: Q0 } = Si(),
      J0 = As(),
      X0 = hr(),
      K0 = it(),
      Z0 = Ti(),
      MT = Os(),
      lc = Ii(),
      ev = Wi(),
      tv = _t(),
      rv = {
        document: 'Document',
        root: 'Root',
        atrule: 'AtRule',
        rule: 'Rule',
        decl: 'Declaration',
        comment: 'Comment',
      },
      iv = {
        postcssPlugin: !0,
        prepare: !0,
        Once: !0,
        Document: !0,
        Root: !0,
        Declaration: !0,
        Rule: !0,
        AtRule: !0,
        Comment: !0,
        DeclarationExit: !0,
        RuleExit: !0,
        AtRuleExit: !0,
        CommentExit: !0,
        RootExit: !0,
        DocumentExit: !0,
        OnceExit: !0,
      },
      nv = { postcssPlugin: !0, prepare: !0, Once: !0 },
      Et = 0;
    function Sr(i) {
      return typeof i == 'object' && typeof i.then == 'function';
    }
    function uc(i) {
      let e = !1,
        t = rv[i.type];
      return (
        i.type === 'decl'
          ? (e = i.prop.toLowerCase())
          : i.type === 'atrule' && (e = i.name.toLowerCase()),
        e && i.append
          ? [t, t + '-' + e, Et, t + 'Exit', t + 'Exit-' + e]
          : e
          ? [t, t + '-' + e, t + 'Exit', t + 'Exit-' + e]
          : i.append
          ? [t, Et, t + 'Exit']
          : [t, t + 'Exit']
      );
    }
    function fc(i) {
      let e;
      return (
        i.type === 'document'
          ? (e = ['Document', Et, 'DocumentExit'])
          : i.type === 'root'
          ? (e = ['Root', Et, 'RootExit'])
          : (e = uc(i)),
        {
          node: i,
          events: e,
          eventIndex: 0,
          visitors: [],
          visitorIndex: 0,
          iterator: 0,
        }
      );
    }
    function Fs(i) {
      return (i[qe] = !1), i.nodes && i.nodes.forEach((e) => Fs(e)), i;
    }
    var Ns = {},
      Ve = class {
        constructor(e, t, r) {
          (this.stringified = !1), (this.processed = !1);
          let n;
          if (
            typeof t == 'object' &&
            t !== null &&
            (t.type === 'root' || t.type === 'document')
          )
            n = Fs(t);
          else if (t instanceof Ve || t instanceof lc)
            (n = Fs(t.root)),
              t.map &&
                (typeof r.map == 'undefined' && (r.map = {}),
                r.map.inline || (r.map.inline = !1),
                (r.map.prev = t.map));
          else {
            let a = ev;
            r.syntax && (a = r.syntax.parse),
              r.parser && (a = r.parser),
              a.parse && (a = a.parse);
            try {
              n = a(t, r);
            } catch (s) {
              (this.processed = !0), (this.error = s);
            }
            n && !n[Q0] && K0.rebuild(n);
          }
          (this.result = new lc(e, n, r)),
            (this.helpers = { ...Ns, result: this.result, postcss: Ns }),
            (this.plugins = this.processor.plugins.map((a) =>
              typeof a == 'object' && a.prepare
                ? { ...a, ...a.prepare(this.result) }
                : a,
            ));
        }
        get [Symbol.toStringTag]() {
          return 'LazyResult';
        }
        get processor() {
          return this.result.processor;
        }
        get opts() {
          return this.result.opts;
        }
        get css() {
          return this.stringify().css;
        }
        get content() {
          return this.stringify().content;
        }
        get map() {
          return this.stringify().map;
        }
        get root() {
          return this.sync().root;
        }
        get messages() {
          return this.sync().messages;
        }
        warnings() {
          return this.sync().warnings();
        }
        toString() {
          return this.css;
        }
        then(e, t) {
          return this.async().then(e, t);
        }
        catch(e) {
          return this.async().catch(e);
        }
        finally(e) {
          return this.async().then(e, e);
        }
        async() {
          return this.error
            ? Promise.reject(this.error)
            : this.processed
            ? Promise.resolve(this.result)
            : (this.processing || (this.processing = this.runAsync()),
              this.processing);
        }
        sync() {
          if (this.error) throw this.error;
          if (this.processed) return this.result;
          if (((this.processed = !0), this.processing))
            throw this.getAsyncError();
          for (let e of this.plugins) {
            let t = this.runOnRoot(e);
            if (Sr(t)) throw this.getAsyncError();
          }
          if ((this.prepareVisitors(), this.hasListener)) {
            let e = this.result.root;
            for (; !e[qe]; ) (e[qe] = !0), this.walkSync(e);
            if (this.listeners.OnceExit)
              if (e.type === 'document')
                for (let t of e.nodes)
                  this.visitSync(this.listeners.OnceExit, t);
              else this.visitSync(this.listeners.OnceExit, e);
          }
          return this.result;
        }
        stringify() {
          if (this.error) throw this.error;
          if (this.stringified) return this.result;
          (this.stringified = !0), this.sync();
          let e = this.result.opts,
            t = X0;
          e.syntax && (t = e.syntax.stringify),
            e.stringifier && (t = e.stringifier),
            t.stringify && (t = t.stringify);
          let n = new J0(t, this.result.root, this.result.opts).generate();
          return (
            (this.result.css = n[0]), (this.result.map = n[1]), this.result
          );
        }
        walkSync(e) {
          e[qe] = !0;
          let t = uc(e);
          for (let r of t)
            if (r === Et)
              e.nodes &&
                e.each((n) => {
                  n[qe] || this.walkSync(n);
                });
            else {
              let n = this.listeners[r];
              if (n && this.visitSync(n, e.toProxy())) return;
            }
        }
        visitSync(e, t) {
          for (let [r, n] of e) {
            this.result.lastPlugin = r;
            let a;
            try {
              a = n(t, this.helpers);
            } catch (s) {
              throw this.handleError(s, t.proxyOf);
            }
            if (t.type !== 'root' && t.type !== 'document' && !t.parent)
              return !0;
            if (Sr(a)) throw this.getAsyncError();
          }
        }
        runOnRoot(e) {
          this.result.lastPlugin = e;
          try {
            if (typeof e == 'object' && e.Once) {
              if (this.result.root.type === 'document') {
                let t = this.result.root.nodes.map((r) =>
                  e.Once(r, this.helpers),
                );
                return Sr(t[0]) ? Promise.all(t) : t;
              }
              return e.Once(this.result.root, this.helpers);
            } else if (typeof e == 'function')
              return e(this.result.root, this.result);
          } catch (t) {
            throw this.handleError(t);
          }
        }
        getAsyncError() {
          throw new Error(
            'Use process(css).then(cb) to work with async plugins',
          );
        }
        handleError(e, t) {
          let r = this.result.lastPlugin;
          try {
            t && t.addToError(e),
              (this.error = e),
              e.name === 'CssSyntaxError' && !e.plugin
                ? ((e.plugin = r.postcssPlugin), e.setMessage())
                : r.postcssVersion;
          } catch (n) {
            console && console.error && console.error(n);
          }
          return e;
        }
        async runAsync() {
          this.plugin = 0;
          for (let e = 0; e < this.plugins.length; e++) {
            let t = this.plugins[e],
              r = this.runOnRoot(t);
            if (Sr(r))
              try {
                await r;
              } catch (n) {
                throw this.handleError(n);
              }
          }
          if ((this.prepareVisitors(), this.hasListener)) {
            let e = this.result.root;
            for (; !e[qe]; ) {
              e[qe] = !0;
              let t = [fc(e)];
              for (; t.length > 0; ) {
                let r = this.visitTick(t);
                if (Sr(r))
                  try {
                    await r;
                  } catch (n) {
                    let a = t[t.length - 1].node;
                    throw this.handleError(n, a);
                  }
              }
            }
            if (this.listeners.OnceExit)
              for (let [t, r] of this.listeners.OnceExit) {
                this.result.lastPlugin = t;
                try {
                  if (e.type === 'document') {
                    let n = e.nodes.map((a) => r(a, this.helpers));
                    await Promise.all(n);
                  } else await r(e, this.helpers);
                } catch (n) {
                  throw this.handleError(n);
                }
              }
          }
          return (this.processed = !0), this.stringify();
        }
        prepareVisitors() {
          this.listeners = {};
          let e = (t, r, n) => {
            this.listeners[r] || (this.listeners[r] = []),
              this.listeners[r].push([t, n]);
          };
          for (let t of this.plugins)
            if (typeof t == 'object')
              for (let r in t) {
                if (!iv[r] && /^[A-Z]/.test(r))
                  throw new Error(
                    `Unknown event ${r} in ${t.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`,
                  );
                if (!nv[r])
                  if (typeof t[r] == 'object')
                    for (let n in t[r])
                      n === '*'
                        ? e(t, r, t[r][n])
                        : e(t, r + '-' + n.toLowerCase(), t[r][n]);
                  else typeof t[r] == 'function' && e(t, r, t[r]);
              }
          this.hasListener = Object.keys(this.listeners).length > 0;
        }
        visitTick(e) {
          let t = e[e.length - 1],
            { node: r, visitors: n } = t;
          if (r.type !== 'root' && r.type !== 'document' && !r.parent) {
            e.pop();
            return;
          }
          if (n.length > 0 && t.visitorIndex < n.length) {
            let [s, o] = n[t.visitorIndex];
            (t.visitorIndex += 1),
              t.visitorIndex === n.length &&
                ((t.visitors = []), (t.visitorIndex = 0)),
              (this.result.lastPlugin = s);
            try {
              return o(r.toProxy(), this.helpers);
            } catch (u) {
              throw this.handleError(u, r);
            }
          }
          if (t.iterator !== 0) {
            let s = t.iterator,
              o;
            for (; (o = r.nodes[r.indexes[s]]); )
              if (((r.indexes[s] += 1), !o[qe])) {
                (o[qe] = !0), e.push(fc(o));
                return;
              }
            (t.iterator = 0), delete r.indexes[s];
          }
          let a = t.events;
          for (; t.eventIndex < a.length; ) {
            let s = a[t.eventIndex];
            if (((t.eventIndex += 1), s === Et)) {
              r.nodes &&
                r.nodes.length &&
                ((r[qe] = !0), (t.iterator = r.getIterator()));
              return;
            } else if (this.listeners[s]) {
              t.visitors = this.listeners[s];
              return;
            }
          }
          e.pop();
        }
      };
    Ve.registerPostcss = (i) => {
      Ns = i;
    };
    cc.exports = Ve;
    Ve.default = Ve;
    tv.registerLazyResult(Ve);
    Z0.registerLazyResult(Ve);
  });
  var dc = v((NT, pc) => {
    l();
    ('use strict');
    var sv = As(),
      av = hr(),
      FT = Os(),
      ov = Wi(),
      lv = Ii(),
      Gi = class {
        constructor(e, t, r) {
          (t = t.toString()),
            (this.stringified = !1),
            (this._processor = e),
            (this._css = t),
            (this._opts = r),
            (this._map = void 0);
          let n,
            a = av;
          (this.result = new lv(this._processor, n, this._opts)),
            (this.result.css = t);
          let s = this;
          Object.defineProperty(this.result, 'root', {
            get() {
              return s.root;
            },
          });
          let o = new sv(a, n, this._opts, t);
          if (o.isMap()) {
            let [u, c] = o.generate();
            u && (this.result.css = u), c && (this.result.map = c);
          }
        }
        get [Symbol.toStringTag]() {
          return 'NoWorkResult';
        }
        get processor() {
          return this.result.processor;
        }
        get opts() {
          return this.result.opts;
        }
        get css() {
          return this.result.css;
        }
        get content() {
          return this.result.css;
        }
        get map() {
          return this.result.map;
        }
        get root() {
          if (this._root) return this._root;
          let e,
            t = ov;
          try {
            e = t(this._css, this._opts);
          } catch (r) {
            this.error = r;
          }
          if (this.error) throw this.error;
          return (this._root = e), e;
        }
        get messages() {
          return [];
        }
        warnings() {
          return [];
        }
        toString() {
          return this._css;
        }
        then(e, t) {
          return this.async().then(e, t);
        }
        catch(e) {
          return this.async().catch(e);
        }
        finally(e) {
          return this.async().then(e, e);
        }
        async() {
          return this.error
            ? Promise.reject(this.error)
            : Promise.resolve(this.result);
        }
        sync() {
          if (this.error) throw this.error;
          return this.result;
        }
      };
    pc.exports = Gi;
    Gi.default = Gi;
  });
  var mc = v((LT, hc) => {
    l();
    ('use strict');
    var uv = dc(),
      fv = Ls(),
      cv = Ti(),
      pv = _t(),
      Ot = class {
        constructor(e = []) {
          (this.version = '8.4.24'), (this.plugins = this.normalize(e));
        }
        use(e) {
          return (
            (this.plugins = this.plugins.concat(this.normalize([e]))), this
          );
        }
        process(e, t = {}) {
          return this.plugins.length === 0 &&
            typeof t.parser == 'undefined' &&
            typeof t.stringifier == 'undefined' &&
            typeof t.syntax == 'undefined'
            ? new uv(this, e, t)
            : new fv(this, e, t);
        }
        normalize(e) {
          let t = [];
          for (let r of e)
            if (
              (r.postcss === !0 ? (r = r()) : r.postcss && (r = r.postcss),
              typeof r == 'object' && Array.isArray(r.plugins))
            )
              t = t.concat(r.plugins);
            else if (typeof r == 'object' && r.postcssPlugin) t.push(r);
            else if (typeof r == 'function') t.push(r);
            else if (!(typeof r == 'object' && (r.parse || r.stringify)))
              throw new Error(r + ' is not a PostCSS plugin');
          return t;
        }
      };
    hc.exports = Ot;
    Ot.default = Ot;
    pv.registerProcessor(Ot);
    cv.registerProcessor(Ot);
  });
  var yc = v(($T, gc) => {
    l();
    ('use strict');
    var dv = gr(),
      hv = Is(),
      mv = yr(),
      gv = $i(),
      yv = Vi(),
      wv = _t(),
      bv = ji();
    function Cr(i, e) {
      if (Array.isArray(i)) return i.map((n) => Cr(n));
      let { inputs: t, ...r } = i;
      if (t) {
        e = [];
        for (let n of t) {
          let a = { ...n, __proto__: yv.prototype };
          a.map && (a.map = { ...a.map, __proto__: hv.prototype }), e.push(a);
        }
      }
      if ((r.nodes && (r.nodes = i.nodes.map((n) => Cr(n, e))), r.source)) {
        let { inputId: n, ...a } = r.source;
        (r.source = a), n != null && (r.source.input = e[n]);
      }
      if (r.type === 'root') return new wv(r);
      if (r.type === 'decl') return new dv(r);
      if (r.type === 'rule') return new bv(r);
      if (r.type === 'comment') return new mv(r);
      if (r.type === 'atrule') return new gv(r);
      throw new Error('Unknown node type: ' + i.type);
    }
    gc.exports = Cr;
    Cr.default = Cr;
  });
  var me = v((jT, Cc) => {
    l();
    ('use strict');
    var vv = ki(),
      wc = gr(),
      xv = Ls(),
      kv = it(),
      $s = mc(),
      Sv = hr(),
      Cv = yc(),
      bc = Ti(),
      Av = Ts(),
      vc = yr(),
      xc = $i(),
      _v = Ii(),
      Ev = Vi(),
      Ov = Wi(),
      Tv = Ds(),
      kc = ji(),
      Sc = _t(),
      Pv = mr();
    function j(...i) {
      return i.length === 1 && Array.isArray(i[0]) && (i = i[0]), new $s(i);
    }
    j.plugin = function (e, t) {
      let r = !1;
      function n(...s) {
        console &&
          console.warn &&
          !r &&
          ((r = !0),
          console.warn(
            e +
              `: postcss.plugin was deprecated. Migration guide:
https://evilmartians.com/chronicles/postcss-8-plugin-migration`,
          ),
          m.env.LANG &&
            m.env.LANG.startsWith('cn') &&
            console.warn(
              e +
                `: \u91CC\u9762 postcss.plugin \u88AB\u5F03\u7528. \u8FC1\u79FB\u6307\u5357:
https://www.w3ctech.com/topic/2226`,
            ));
        let o = t(...s);
        return (o.postcssPlugin = e), (o.postcssVersion = new $s().version), o;
      }
      let a;
      return (
        Object.defineProperty(n, 'postcss', {
          get() {
            return a || (a = n()), a;
          },
        }),
        (n.process = function (s, o, u) {
          return j([n(u)]).process(s, o);
        }),
        n
      );
    };
    j.stringify = Sv;
    j.parse = Ov;
    j.fromJSON = Cv;
    j.list = Tv;
    j.comment = (i) => new vc(i);
    j.atRule = (i) => new xc(i);
    j.decl = (i) => new wc(i);
    j.rule = (i) => new kc(i);
    j.root = (i) => new Sc(i);
    j.document = (i) => new bc(i);
    j.CssSyntaxError = vv;
    j.Declaration = wc;
    j.Container = kv;
    j.Processor = $s;
    j.Document = bc;
    j.Comment = vc;
    j.Warning = Av;
    j.AtRule = xc;
    j.Result = _v;
    j.Input = Ev;
    j.Rule = kc;
    j.Root = Sc;
    j.Node = Pv;
    xv.registerPostcss(j);
    Cc.exports = j;
    j.default = j;
  });
  var W,
    z,
    zT,
    VT,
    UT,
    WT,
    GT,
    HT,
    YT,
    QT,
    JT,
    XT,
    KT,
    ZT,
    eP,
    tP,
    rP,
    iP,
    nP,
    sP,
    aP,
    oP,
    lP,
    uP,
    fP,
    cP,
    nt = C(() => {
      l();
      (W = K(me())),
        (z = W.default),
        (zT = W.default.stringify),
        (VT = W.default.fromJSON),
        (UT = W.default.plugin),
        (WT = W.default.parse),
        (GT = W.default.list),
        (HT = W.default.document),
        (YT = W.default.comment),
        (QT = W.default.atRule),
        (JT = W.default.rule),
        (XT = W.default.decl),
        (KT = W.default.root),
        (ZT = W.default.CssSyntaxError),
        (eP = W.default.Declaration),
        (tP = W.default.Container),
        (rP = W.default.Processor),
        (iP = W.default.Document),
        (nP = W.default.Comment),
        (sP = W.default.Warning),
        (aP = W.default.AtRule),
        (oP = W.default.Result),
        (lP = W.default.Input),
        (uP = W.default.Rule),
        (fP = W.default.Root),
        (cP = W.default.Node);
    });
  var js = v((dP, Ac) => {
    l();
    Ac.exports = function (i, e, t, r, n) {
      for (e = e.split ? e.split('.') : e, r = 0; r < e.length; r++)
        i = i ? i[e[r]] : n;
      return i === n ? t : i;
    };
  });
  var Yi = v((Hi, _c) => {
    l();
    ('use strict');
    Hi.__esModule = !0;
    Hi.default = qv;
    function Dv(i) {
      for (
        var e = i.toLowerCase(), t = '', r = !1, n = 0;
        n < 6 && e[n] !== void 0;
        n++
      ) {
        var a = e.charCodeAt(n),
          s = (a >= 97 && a <= 102) || (a >= 48 && a <= 57);
        if (((r = a === 32), !s)) break;
        t += e[n];
      }
      if (t.length !== 0) {
        var o = parseInt(t, 16),
          u = o >= 55296 && o <= 57343;
        return u || o === 0 || o > 1114111
          ? ['\uFFFD', t.length + (r ? 1 : 0)]
          : [String.fromCodePoint(o), t.length + (r ? 1 : 0)];
      }
    }
    var Iv = /\\/;
    function qv(i) {
      var e = Iv.test(i);
      if (!e) return i;
      for (var t = '', r = 0; r < i.length; r++) {
        if (i[r] === '\\') {
          var n = Dv(i.slice(r + 1, r + 7));
          if (n !== void 0) {
            (t += n[0]), (r += n[1]);
            continue;
          }
          if (i[r + 1] === '\\') {
            (t += '\\'), r++;
            continue;
          }
          i.length === r + 1 && (t += i[r]);
          continue;
        }
        t += i[r];
      }
      return t;
    }
    _c.exports = Hi.default;
  });
  var Oc = v((Qi, Ec) => {
    l();
    ('use strict');
    Qi.__esModule = !0;
    Qi.default = Rv;
    function Rv(i) {
      for (
        var e = arguments.length, t = new Array(e > 1 ? e - 1 : 0), r = 1;
        r < e;
        r++
      )
        t[r - 1] = arguments[r];
      for (; t.length > 0; ) {
        var n = t.shift();
        if (!i[n]) return;
        i = i[n];
      }
      return i;
    }
    Ec.exports = Qi.default;
  });
  var Pc = v((Ji, Tc) => {
    l();
    ('use strict');
    Ji.__esModule = !0;
    Ji.default = Mv;
    function Mv(i) {
      for (
        var e = arguments.length, t = new Array(e > 1 ? e - 1 : 0), r = 1;
        r < e;
        r++
      )
        t[r - 1] = arguments[r];
      for (; t.length > 0; ) {
        var n = t.shift();
        i[n] || (i[n] = {}), (i = i[n]);
      }
    }
    Tc.exports = Ji.default;
  });
  var Ic = v((Xi, Dc) => {
    l();
    ('use strict');
    Xi.__esModule = !0;
    Xi.default = Bv;
    function Bv(i) {
      for (var e = '', t = i.indexOf('/*'), r = 0; t >= 0; ) {
        e = e + i.slice(r, t);
        var n = i.indexOf('*/', t + 2);
        if (n < 0) return e;
        (r = n + 2), (t = i.indexOf('/*', r));
      }
      return (e = e + i.slice(r)), e;
    }
    Dc.exports = Xi.default;
  });
  var Ar = v((Re) => {
    l();
    ('use strict');
    Re.__esModule = !0;
    Re.unesc = Re.stripComments = Re.getProp = Re.ensureObject = void 0;
    var Fv = Ki(Yi());
    Re.unesc = Fv.default;
    var Nv = Ki(Oc());
    Re.getProp = Nv.default;
    var Lv = Ki(Pc());
    Re.ensureObject = Lv.default;
    var $v = Ki(Ic());
    Re.stripComments = $v.default;
    function Ki(i) {
      return i && i.__esModule ? i : { default: i };
    }
  });
  var Ue = v((_r, Mc) => {
    l();
    ('use strict');
    _r.__esModule = !0;
    _r.default = void 0;
    var qc = Ar();
    function Rc(i, e) {
      for (var t = 0; t < e.length; t++) {
        var r = e[t];
        (r.enumerable = r.enumerable || !1),
          (r.configurable = !0),
          'value' in r && (r.writable = !0),
          Object.defineProperty(i, r.key, r);
      }
    }
    function jv(i, e, t) {
      return (
        e && Rc(i.prototype, e),
        t && Rc(i, t),
        Object.defineProperty(i, 'prototype', { writable: !1 }),
        i
      );
    }
    var zv = function i(e, t) {
        if (typeof e != 'object' || e === null) return e;
        var r = new e.constructor();
        for (var n in e)
          if (!!e.hasOwnProperty(n)) {
            var a = e[n],
              s = typeof a;
            n === 'parent' && s === 'object'
              ? t && (r[n] = t)
              : a instanceof Array
              ? (r[n] = a.map(function (o) {
                  return i(o, r);
                }))
              : (r[n] = i(a, r));
          }
        return r;
      },
      Vv = (function () {
        function i(t) {
          t === void 0 && (t = {}),
            Object.assign(this, t),
            (this.spaces = this.spaces || {}),
            (this.spaces.before = this.spaces.before || ''),
            (this.spaces.after = this.spaces.after || '');
        }
        var e = i.prototype;
        return (
          (e.remove = function () {
            return (
              this.parent && this.parent.removeChild(this),
              (this.parent = void 0),
              this
            );
          }),
          (e.replaceWith = function () {
            if (this.parent) {
              for (var r in arguments)
                this.parent.insertBefore(this, arguments[r]);
              this.remove();
            }
            return this;
          }),
          (e.next = function () {
            return this.parent.at(this.parent.index(this) + 1);
          }),
          (e.prev = function () {
            return this.parent.at(this.parent.index(this) - 1);
          }),
          (e.clone = function (r) {
            r === void 0 && (r = {});
            var n = zv(this);
            for (var a in r) n[a] = r[a];
            return n;
          }),
          (e.appendToPropertyAndEscape = function (r, n, a) {
            this.raws || (this.raws = {});
            var s = this[r],
              o = this.raws[r];
            (this[r] = s + n),
              o || a !== n
                ? (this.raws[r] = (o || s) + a)
                : delete this.raws[r];
          }),
          (e.setPropertyAndEscape = function (r, n, a) {
            this.raws || (this.raws = {}), (this[r] = n), (this.raws[r] = a);
          }),
          (e.setPropertyWithoutEscape = function (r, n) {
            (this[r] = n), this.raws && delete this.raws[r];
          }),
          (e.isAtPosition = function (r, n) {
            if (this.source && this.source.start && this.source.end)
              return !(
                this.source.start.line > r ||
                this.source.end.line < r ||
                (this.source.start.line === r &&
                  this.source.start.column > n) ||
                (this.source.end.line === r && this.source.end.column < n)
              );
          }),
          (e.stringifyProperty = function (r) {
            return (this.raws && this.raws[r]) || this[r];
          }),
          (e.valueToString = function () {
            return String(this.stringifyProperty('value'));
          }),
          (e.toString = function () {
            return [
              this.rawSpaceBefore,
              this.valueToString(),
              this.rawSpaceAfter,
            ].join('');
          }),
          jv(i, [
            {
              key: 'rawSpaceBefore',
              get: function () {
                var r =
                  this.raws && this.raws.spaces && this.raws.spaces.before;
                return (
                  r === void 0 && (r = this.spaces && this.spaces.before),
                  r || ''
                );
              },
              set: function (r) {
                (0, qc.ensureObject)(this, 'raws', 'spaces'),
                  (this.raws.spaces.before = r);
              },
            },
            {
              key: 'rawSpaceAfter',
              get: function () {
                var r = this.raws && this.raws.spaces && this.raws.spaces.after;
                return r === void 0 && (r = this.spaces.after), r || '';
              },
              set: function (r) {
                (0, qc.ensureObject)(this, 'raws', 'spaces'),
                  (this.raws.spaces.after = r);
              },
            },
          ]),
          i
        );
      })();
    _r.default = Vv;
    Mc.exports = _r.default;
  });
  var ne = v((G) => {
    l();
    ('use strict');
    G.__esModule = !0;
    G.UNIVERSAL =
      G.TAG =
      G.STRING =
      G.SELECTOR =
      G.ROOT =
      G.PSEUDO =
      G.NESTING =
      G.ID =
      G.COMMENT =
      G.COMBINATOR =
      G.CLASS =
      G.ATTRIBUTE =
        void 0;
    var Uv = 'tag';
    G.TAG = Uv;
    var Wv = 'string';
    G.STRING = Wv;
    var Gv = 'selector';
    G.SELECTOR = Gv;
    var Hv = 'root';
    G.ROOT = Hv;
    var Yv = 'pseudo';
    G.PSEUDO = Yv;
    var Qv = 'nesting';
    G.NESTING = Qv;
    var Jv = 'id';
    G.ID = Jv;
    var Xv = 'comment';
    G.COMMENT = Xv;
    var Kv = 'combinator';
    G.COMBINATOR = Kv;
    var Zv = 'class';
    G.CLASS = Zv;
    var ex = 'attribute';
    G.ATTRIBUTE = ex;
    var tx = 'universal';
    G.UNIVERSAL = tx;
  });
  var Zi = v((Er, Lc) => {
    l();
    ('use strict');
    Er.__esModule = !0;
    Er.default = void 0;
    var rx = nx(Ue()),
      We = ix(ne());
    function Bc(i) {
      if (typeof WeakMap != 'function') return null;
      var e = new WeakMap(),
        t = new WeakMap();
      return (Bc = function (n) {
        return n ? t : e;
      })(i);
    }
    function ix(i, e) {
      if (!e && i && i.__esModule) return i;
      if (i === null || (typeof i != 'object' && typeof i != 'function'))
        return { default: i };
      var t = Bc(e);
      if (t && t.has(i)) return t.get(i);
      var r = {},
        n = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var a in i)
        if (a !== 'default' && Object.prototype.hasOwnProperty.call(i, a)) {
          var s = n ? Object.getOwnPropertyDescriptor(i, a) : null;
          s && (s.get || s.set)
            ? Object.defineProperty(r, a, s)
            : (r[a] = i[a]);
        }
      return (r.default = i), t && t.set(i, r), r;
    }
    function nx(i) {
      return i && i.__esModule ? i : { default: i };
    }
    function sx(i, e) {
      var t =
        (typeof Symbol != 'undefined' && i[Symbol.iterator]) || i['@@iterator'];
      if (t) return (t = t.call(i)).next.bind(t);
      if (
        Array.isArray(i) ||
        (t = ax(i)) ||
        (e && i && typeof i.length == 'number')
      ) {
        t && (i = t);
        var r = 0;
        return function () {
          return r >= i.length ? { done: !0 } : { done: !1, value: i[r++] };
        };
      }
      throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
    }
    function ax(i, e) {
      if (!!i) {
        if (typeof i == 'string') return Fc(i, e);
        var t = Object.prototype.toString.call(i).slice(8, -1);
        if (
          (t === 'Object' && i.constructor && (t = i.constructor.name),
          t === 'Map' || t === 'Set')
        )
          return Array.from(i);
        if (
          t === 'Arguments' ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
        )
          return Fc(i, e);
      }
    }
    function Fc(i, e) {
      (e == null || e > i.length) && (e = i.length);
      for (var t = 0, r = new Array(e); t < e; t++) r[t] = i[t];
      return r;
    }
    function Nc(i, e) {
      for (var t = 0; t < e.length; t++) {
        var r = e[t];
        (r.enumerable = r.enumerable || !1),
          (r.configurable = !0),
          'value' in r && (r.writable = !0),
          Object.defineProperty(i, r.key, r);
      }
    }
    function ox(i, e, t) {
      return (
        e && Nc(i.prototype, e),
        t && Nc(i, t),
        Object.defineProperty(i, 'prototype', { writable: !1 }),
        i
      );
    }
    function lx(i, e) {
      (i.prototype = Object.create(e.prototype)),
        (i.prototype.constructor = i),
        zs(i, e);
    }
    function zs(i, e) {
      return (
        (zs = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (r, n) {
              return (r.__proto__ = n), r;
            }),
        zs(i, e)
      );
    }
    var ux = (function (i) {
      lx(e, i);
      function e(r) {
        var n;
        return (n = i.call(this, r) || this), n.nodes || (n.nodes = []), n;
      }
      var t = e.prototype;
      return (
        (t.append = function (n) {
          return (n.parent = this), this.nodes.push(n), this;
        }),
        (t.prepend = function (n) {
          return (n.parent = this), this.nodes.unshift(n), this;
        }),
        (t.at = function (n) {
          return this.nodes[n];
        }),
        (t.index = function (n) {
          return typeof n == 'number' ? n : this.nodes.indexOf(n);
        }),
        (t.removeChild = function (n) {
          (n = this.index(n)),
            (this.at(n).parent = void 0),
            this.nodes.splice(n, 1);
          var a;
          for (var s in this.indexes)
            (a = this.indexes[s]), a >= n && (this.indexes[s] = a - 1);
          return this;
        }),
        (t.removeAll = function () {
          for (var n = sx(this.nodes), a; !(a = n()).done; ) {
            var s = a.value;
            s.parent = void 0;
          }
          return (this.nodes = []), this;
        }),
        (t.empty = function () {
          return this.removeAll();
        }),
        (t.insertAfter = function (n, a) {
          a.parent = this;
          var s = this.index(n);
          this.nodes.splice(s + 1, 0, a), (a.parent = this);
          var o;
          for (var u in this.indexes)
            (o = this.indexes[u]), s <= o && (this.indexes[u] = o + 1);
          return this;
        }),
        (t.insertBefore = function (n, a) {
          a.parent = this;
          var s = this.index(n);
          this.nodes.splice(s, 0, a), (a.parent = this);
          var o;
          for (var u in this.indexes)
            (o = this.indexes[u]), o <= s && (this.indexes[u] = o + 1);
          return this;
        }),
        (t._findChildAtPosition = function (n, a) {
          var s = void 0;
          return (
            this.each(function (o) {
              if (o.atPosition) {
                var u = o.atPosition(n, a);
                if (u) return (s = u), !1;
              } else if (o.isAtPosition(n, a)) return (s = o), !1;
            }),
            s
          );
        }),
        (t.atPosition = function (n, a) {
          if (this.isAtPosition(n, a))
            return this._findChildAtPosition(n, a) || this;
        }),
        (t._inferEndPosition = function () {
          this.last &&
            this.last.source &&
            this.last.source.end &&
            ((this.source = this.source || {}),
            (this.source.end = this.source.end || {}),
            Object.assign(this.source.end, this.last.source.end));
        }),
        (t.each = function (n) {
          this.lastEach || (this.lastEach = 0),
            this.indexes || (this.indexes = {}),
            this.lastEach++;
          var a = this.lastEach;
          if (((this.indexes[a] = 0), !!this.length)) {
            for (
              var s, o;
              this.indexes[a] < this.length &&
              ((s = this.indexes[a]), (o = n(this.at(s), s)), o !== !1);

            )
              this.indexes[a] += 1;
            if ((delete this.indexes[a], o === !1)) return !1;
          }
        }),
        (t.walk = function (n) {
          return this.each(function (a, s) {
            var o = n(a, s);
            if ((o !== !1 && a.length && (o = a.walk(n)), o === !1)) return !1;
          });
        }),
        (t.walkAttributes = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === We.ATTRIBUTE) return n.call(a, s);
          });
        }),
        (t.walkClasses = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === We.CLASS) return n.call(a, s);
          });
        }),
        (t.walkCombinators = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === We.COMBINATOR) return n.call(a, s);
          });
        }),
        (t.walkComments = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === We.COMMENT) return n.call(a, s);
          });
        }),
        (t.walkIds = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === We.ID) return n.call(a, s);
          });
        }),
        (t.walkNesting = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === We.NESTING) return n.call(a, s);
          });
        }),
        (t.walkPseudos = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === We.PSEUDO) return n.call(a, s);
          });
        }),
        (t.walkTags = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === We.TAG) return n.call(a, s);
          });
        }),
        (t.walkUniversals = function (n) {
          var a = this;
          return this.walk(function (s) {
            if (s.type === We.UNIVERSAL) return n.call(a, s);
          });
        }),
        (t.split = function (n) {
          var a = this,
            s = [];
          return this.reduce(function (o, u, c) {
            var f = n.call(a, u);
            return (
              s.push(u),
              f ? (o.push(s), (s = [])) : c === a.length - 1 && o.push(s),
              o
            );
          }, []);
        }),
        (t.map = function (n) {
          return this.nodes.map(n);
        }),
        (t.reduce = function (n, a) {
          return this.nodes.reduce(n, a);
        }),
        (t.every = function (n) {
          return this.nodes.every(n);
        }),
        (t.some = function (n) {
          return this.nodes.some(n);
        }),
        (t.filter = function (n) {
          return this.nodes.filter(n);
        }),
        (t.sort = function (n) {
          return this.nodes.sort(n);
        }),
        (t.toString = function () {
          return this.map(String).join('');
        }),
        ox(e, [
          {
            key: 'first',
            get: function () {
              return this.at(0);
            },
          },
          {
            key: 'last',
            get: function () {
              return this.at(this.length - 1);
            },
          },
          {
            key: 'length',
            get: function () {
              return this.nodes.length;
            },
          },
        ]),
        e
      );
    })(rx.default);
    Er.default = ux;
    Lc.exports = Er.default;
  });
  var Us = v((Or, jc) => {
    l();
    ('use strict');
    Or.__esModule = !0;
    Or.default = void 0;
    var fx = px(Zi()),
      cx = ne();
    function px(i) {
      return i && i.__esModule ? i : { default: i };
    }
    function $c(i, e) {
      for (var t = 0; t < e.length; t++) {
        var r = e[t];
        (r.enumerable = r.enumerable || !1),
          (r.configurable = !0),
          'value' in r && (r.writable = !0),
          Object.defineProperty(i, r.key, r);
      }
    }
    function dx(i, e, t) {
      return (
        e && $c(i.prototype, e),
        t && $c(i, t),
        Object.defineProperty(i, 'prototype', { writable: !1 }),
        i
      );
    }
    function hx(i, e) {
      (i.prototype = Object.create(e.prototype)),
        (i.prototype.constructor = i),
        Vs(i, e);
    }
    function Vs(i, e) {
      return (
        (Vs = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (r, n) {
              return (r.__proto__ = n), r;
            }),
        Vs(i, e)
      );
    }
    var mx = (function (i) {
      hx(e, i);
      function e(r) {
        var n;
        return (n = i.call(this, r) || this), (n.type = cx.ROOT), n;
      }
      var t = e.prototype;
      return (
        (t.toString = function () {
          var n = this.reduce(function (a, s) {
            return a.push(String(s)), a;
          }, []).join(',');
          return this.trailingComma ? n + ',' : n;
        }),
        (t.error = function (n, a) {
          return this._error ? this._error(n, a) : new Error(n);
        }),
        dx(e, [
          {
            key: 'errorGenerator',
            set: function (n) {
              this._error = n;
            },
          },
        ]),
        e
      );
    })(fx.default);
    Or.default = mx;
    jc.exports = Or.default;
  });
  var Gs = v((Tr, zc) => {
    l();
    ('use strict');
    Tr.__esModule = !0;
    Tr.default = void 0;
    var gx = wx(Zi()),
      yx = ne();
    function wx(i) {
      return i && i.__esModule ? i : { default: i };
    }
    function bx(i, e) {
      (i.prototype = Object.create(e.prototype)),
        (i.prototype.constructor = i),
        Ws(i, e);
    }
    function Ws(i, e) {
      return (
        (Ws = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (r, n) {
              return (r.__proto__ = n), r;
            }),
        Ws(i, e)
      );
    }
    var vx = (function (i) {
      bx(e, i);
      function e(t) {
        var r;
        return (r = i.call(this, t) || this), (r.type = yx.SELECTOR), r;
      }
      return e;
    })(gx.default);
    Tr.default = vx;
    zc.exports = Tr.default;
  });
  var en = v((gP, Vc) => {
    l();
    ('use strict');
    var xx = {},
      kx = xx.hasOwnProperty,
      Sx = function (e, t) {
        if (!e) return t;
        var r = {};
        for (var n in t) r[n] = kx.call(e, n) ? e[n] : t[n];
        return r;
      },
      Cx = /[ -,\.\/:-@\[-\^`\{-~]/,
      Ax = /[ -,\.\/:-@\[\]\^`\{-~]/,
      _x = /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g,
      Hs = function i(e, t) {
        (t = Sx(t, i.options)),
          t.quotes != 'single' && t.quotes != 'double' && (t.quotes = 'single');
        for (
          var r = t.quotes == 'double' ? '"' : "'",
            n = t.isIdentifier,
            a = e.charAt(0),
            s = '',
            o = 0,
            u = e.length;
          o < u;

        ) {
          var c = e.charAt(o++),
            f = c.charCodeAt(),
            p = void 0;
          if (f < 32 || f > 126) {
            if (f >= 55296 && f <= 56319 && o < u) {
              var d = e.charCodeAt(o++);
              (d & 64512) == 56320
                ? (f = ((f & 1023) << 10) + (d & 1023) + 65536)
                : o--;
            }
            p = '\\' + f.toString(16).toUpperCase() + ' ';
          } else
            t.escapeEverything
              ? Cx.test(c)
                ? (p = '\\' + c)
                : (p = '\\' + f.toString(16).toUpperCase() + ' ')
              : /[\t\n\f\r\x0B]/.test(c)
              ? (p = '\\' + f.toString(16).toUpperCase() + ' ')
              : c == '\\' ||
                (!n && ((c == '"' && r == c) || (c == "'" && r == c))) ||
                (n && Ax.test(c))
              ? (p = '\\' + c)
              : (p = c);
          s += p;
        }
        return (
          n &&
            (/^-[-\d]/.test(s)
              ? (s = '\\-' + s.slice(1))
              : /\d/.test(a) && (s = '\\3' + a + ' ' + s.slice(1))),
          (s = s.replace(_x, function (h, y, x) {
            return y && y.length % 2 ? h : (y || '') + x;
          })),
          !n && t.wrap ? r + s + r : s
        );
      };
    Hs.options = {
      escapeEverything: !1,
      isIdentifier: !1,
      quotes: 'single',
      wrap: !1,
    };
    Hs.version = '3.0.0';
    Vc.exports = Hs;
  });
  var Qs = v((Pr, Gc) => {
    l();
    ('use strict');
    Pr.__esModule = !0;
    Pr.default = void 0;
    var Ex = Uc(en()),
      Ox = Ar(),
      Tx = Uc(Ue()),
      Px = ne();
    function Uc(i) {
      return i && i.__esModule ? i : { default: i };
    }
    function Wc(i, e) {
      for (var t = 0; t < e.length; t++) {
        var r = e[t];
        (r.enumerable = r.enumerable || !1),
          (r.configurable = !0),
          'value' in r && (r.writable = !0),
          Object.defineProperty(i, r.key, r);
      }
    }
    function Dx(i, e, t) {
      return (
        e && Wc(i.prototype, e),
        t && Wc(i, t),
        Object.defineProperty(i, 'prototype', { writable: !1 }),
        i
      );
    }
    function Ix(i, e) {
      (i.prototype = Object.create(e.prototype)),
        (i.prototype.constructor = i),
        Ys(i, e);
    }
    function Ys(i, e) {
      return (
        (Ys = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (r, n) {
              return (r.__proto__ = n), r;
            }),
        Ys(i, e)
      );
    }
    var qx = (function (i) {
      Ix(e, i);
      function e(r) {
        var n;
        return (
          (n = i.call(this, r) || this),
          (n.type = Px.CLASS),
          (n._constructed = !0),
          n
        );
      }
      var t = e.prototype;
      return (
        (t.valueToString = function () {
          return '.' + i.prototype.valueToString.call(this);
        }),
        Dx(e, [
          {
            key: 'value',
            get: function () {
              return this._value;
            },
            set: function (n) {
              if (this._constructed) {
                var a = (0, Ex.default)(n, { isIdentifier: !0 });
                a !== n
                  ? ((0, Ox.ensureObject)(this, 'raws'), (this.raws.value = a))
                  : this.raws && delete this.raws.value;
              }
              this._value = n;
            },
          },
        ]),
        e
      );
    })(Tx.default);
    Pr.default = qx;
    Gc.exports = Pr.default;
  });
  var Xs = v((Dr, Hc) => {
    l();
    ('use strict');
    Dr.__esModule = !0;
    Dr.default = void 0;
    var Rx = Bx(Ue()),
      Mx = ne();
    function Bx(i) {
      return i && i.__esModule ? i : { default: i };
    }
    function Fx(i, e) {
      (i.prototype = Object.create(e.prototype)),
        (i.prototype.constructor = i),
        Js(i, e);
    }
    function Js(i, e) {
      return (
        (Js = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (r, n) {
              return (r.__proto__ = n), r;
            }),
        Js(i, e)
      );
    }
    var Nx = (function (i) {
      Fx(e, i);
      function e(t) {
        var r;
        return (r = i.call(this, t) || this), (r.type = Mx.COMMENT), r;
      }
      return e;
    })(Rx.default);
    Dr.default = Nx;
    Hc.exports = Dr.default;
  });
  var Zs = v((Ir, Yc) => {
    l();
    ('use strict');
    Ir.__esModule = !0;
    Ir.default = void 0;
    var Lx = jx(Ue()),
      $x = ne();
    function jx(i) {
      return i && i.__esModule ? i : { default: i };
    }
    function zx(i, e) {
      (i.prototype = Object.create(e.prototype)),
        (i.prototype.constructor = i),
        Ks(i, e);
    }
    function Ks(i, e) {
      return (
        (Ks = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (r, n) {
              return (r.__proto__ = n), r;
            }),
        Ks(i, e)
      );
    }
    var Vx = (function (i) {
      zx(e, i);
      function e(r) {
        var n;
        return (n = i.call(this, r) || this), (n.type = $x.ID), n;
      }
      var t = e.prototype;
      return (
        (t.valueToString = function () {
          return '#' + i.prototype.valueToString.call(this);
        }),
        e
      );
    })(Lx.default);
    Ir.default = Vx;
    Yc.exports = Ir.default;
  });
  var tn = v((qr, Xc) => {
    l();
    ('use strict');
    qr.__esModule = !0;
    qr.default = void 0;
    var Ux = Qc(en()),
      Wx = Ar(),
      Gx = Qc(Ue());
    function Qc(i) {
      return i && i.__esModule ? i : { default: i };
    }
    function Jc(i, e) {
      for (var t = 0; t < e.length; t++) {
        var r = e[t];
        (r.enumerable = r.enumerable || !1),
          (r.configurable = !0),
          'value' in r && (r.writable = !0),
          Object.defineProperty(i, r.key, r);
      }
    }
    function Hx(i, e, t) {
      return (
        e && Jc(i.prototype, e),
        t && Jc(i, t),
        Object.defineProperty(i, 'prototype', { writable: !1 }),
        i
      );
    }
    function Yx(i, e) {
      (i.prototype = Object.create(e.prototype)),
        (i.prototype.constructor = i),
        ea(i, e);
    }
    function ea(i, e) {
      return (
        (ea = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (r, n) {
              return (r.__proto__ = n), r;
            }),
        ea(i, e)
      );
    }
    var Qx = (function (i) {
      Yx(e, i);
      function e() {
        return i.apply(this, arguments) || this;
      }
      var t = e.prototype;
      return (
        (t.qualifiedName = function (n) {
          return this.namespace ? this.namespaceString + '|' + n : n;
        }),
        (t.valueToString = function () {
          return this.qualifiedName(i.prototype.valueToString.call(this));
        }),
        Hx(e, [
          {
            key: 'namespace',
            get: function () {
              return this._namespace;
            },
            set: function (n) {
              if (n === !0 || n === '*' || n === '&') {
                (this._namespace = n), this.raws && delete this.raws.namespace;
                return;
              }
              var a = (0, Ux.default)(n, { isIdentifier: !0 });
              (this._namespace = n),
                a !== n
                  ? ((0, Wx.ensureObject)(this, 'raws'),
                    (this.raws.namespace = a))
                  : this.raws && delete this.raws.namespace;
            },
          },
          {
            key: 'ns',
            get: function () {
              return this._namespace;
            },
            set: function (n) {
              this.namespace = n;
            },
          },
          {
            key: 'namespaceString',
            get: function () {
              if (this.namespace) {
                var n = this.stringifyProperty('namespace');
                return n === !0 ? '' : n;
              } else return '';
            },
          },
        ]),
        e
      );
    })(Gx.default);
    qr.default = Qx;
    Xc.exports = qr.default;
  });
  var ra = v((Rr, Kc) => {
    l();
    ('use strict');
    Rr.__esModule = !0;
    Rr.default = void 0;
    var Jx = Kx(tn()),
      Xx = ne();
    function Kx(i) {
      return i && i.__esModule ? i : { default: i };
    }
    function Zx(i, e) {
      (i.prototype = Object.create(e.prototype)),
        (i.prototype.constructor = i),
        ta(i, e);
    }
    function ta(i, e) {
      return (
        (ta = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (r, n) {
              return (r.__proto__ = n), r;
            }),
        ta(i, e)
      );
    }
    var e1 = (function (i) {
      Zx(e, i);
      function e(t) {
        var r;
        return (r = i.call(this, t) || this), (r.type = Xx.TAG), r;
      }
      return e;
    })(Jx.default);
    Rr.default = e1;
    Kc.exports = Rr.default;
  });
  var na = v((Mr, Zc) => {
    l();
    ('use strict');
    Mr.__esModule = !0;
    Mr.default = void 0;
    var t1 = i1(Ue()),
      r1 = ne();
    function i1(i) {
      return i && i.__esModule ? i : { default: i };
    }
    function n1(i, e) {
      (i.prototype = Object.create(e.prototype)),
        (i.prototype.constructor = i),
        ia(i, e);
    }
    function ia(i, e) {
      return (
        (ia = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (r, n) {
              return (r.__proto__ = n), r;
            }),
        ia(i, e)
      );
    }
    var s1 = (function (i) {
      n1(e, i);
      function e(t) {
        var r;
        return (r = i.call(this, t) || this), (r.type = r1.STRING), r;
      }
      return e;
    })(t1.default);
    Mr.default = s1;
    Zc.exports = Mr.default;
  });
  var aa = v((Br, ep) => {
    l();
    ('use strict');
    Br.__esModule = !0;
    Br.default = void 0;
    var a1 = l1(Zi()),
      o1 = ne();
    function l1(i) {
      return i && i.__esModule ? i : { default: i };
    }
    function u1(i, e) {
      (i.prototype = Object.create(e.prototype)),
        (i.prototype.constructor = i),
        sa(i, e);
    }
    function sa(i, e) {
      return (
        (sa = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (r, n) {
              return (r.__proto__ = n), r;
            }),
        sa(i, e)
      );
    }
    var f1 = (function (i) {
      u1(e, i);
      function e(r) {
        var n;
        return (n = i.call(this, r) || this), (n.type = o1.PSEUDO), n;
      }
      var t = e.prototype;
      return (
        (t.toString = function () {
          var n = this.length ? '(' + this.map(String).join(',') + ')' : '';
          return [
            this.rawSpaceBefore,
            this.stringifyProperty('value'),
            n,
            this.rawSpaceAfter,
          ].join('');
        }),
        e
      );
    })(a1.default);
    Br.default = f1;
    ep.exports = Br.default;
  });
  var tp = {};
  Ae(tp, { deprecate: () => c1 });
  function c1(i) {
    return i;
  }
  var rp = C(() => {
    l();
  });
  var np = v((yP, ip) => {
    l();
    ip.exports = (rp(), tp).deprecate;
  });
  var pa = v((Lr) => {
    l();
    ('use strict');
    Lr.__esModule = !0;
    Lr.default = void 0;
    Lr.unescapeValue = fa;
    var Fr = la(en()),
      p1 = la(Yi()),
      d1 = la(tn()),
      h1 = ne(),
      oa;
    function la(i) {
      return i && i.__esModule ? i : { default: i };
    }
    function sp(i, e) {
      for (var t = 0; t < e.length; t++) {
        var r = e[t];
        (r.enumerable = r.enumerable || !1),
          (r.configurable = !0),
          'value' in r && (r.writable = !0),
          Object.defineProperty(i, r.key, r);
      }
    }
    function m1(i, e, t) {
      return (
        e && sp(i.prototype, e),
        t && sp(i, t),
        Object.defineProperty(i, 'prototype', { writable: !1 }),
        i
      );
    }
    function g1(i, e) {
      (i.prototype = Object.create(e.prototype)),
        (i.prototype.constructor = i),
        ua(i, e);
    }
    function ua(i, e) {
      return (
        (ua = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (r, n) {
              return (r.__proto__ = n), r;
            }),
        ua(i, e)
      );
    }
    var Nr = np(),
      y1 = /^('|")([^]*)\1$/,
      w1 = Nr(
        function () {},
        'Assigning an attribute a value containing characters that might need to be escaped is deprecated. Call attribute.setValue() instead.',
      ),
      b1 = Nr(
        function () {},
        'Assigning attr.quoted is deprecated and has no effect. Assign to attr.quoteMark instead.',
      ),
      v1 = Nr(
        function () {},
        'Constructing an Attribute selector with a value without specifying quoteMark is deprecated. Note: The value should be unescaped now.',
      );
    function fa(i) {
      var e = !1,
        t = null,
        r = i,
        n = r.match(y1);
      return (
        n && ((t = n[1]), (r = n[2])),
        (r = (0, p1.default)(r)),
        r !== i && (e = !0),
        { deprecatedUsage: e, unescaped: r, quoteMark: t }
      );
    }
    function x1(i) {
      if (i.quoteMark !== void 0 || i.value === void 0) return i;
      v1();
      var e = fa(i.value),
        t = e.quoteMark,
        r = e.unescaped;
      return (
        i.raws || (i.raws = {}),
        i.raws.value === void 0 && (i.raws.value = i.value),
        (i.value = r),
        (i.quoteMark = t),
        i
      );
    }
    var rn = (function (i) {
      g1(e, i);
      function e(r) {
        var n;
        return (
          r === void 0 && (r = {}),
          (n = i.call(this, x1(r)) || this),
          (n.type = h1.ATTRIBUTE),
          (n.raws = n.raws || {}),
          Object.defineProperty(n.raws, 'unquoted', {
            get: Nr(function () {
              return n.value;
            }, 'attr.raws.unquoted is deprecated. Call attr.value instead.'),
            set: Nr(function () {
              return n.value;
            }, 'Setting attr.raws.unquoted is deprecated and has no effect. attr.value is unescaped by default now.'),
          }),
          (n._constructed = !0),
          n
        );
      }
      var t = e.prototype;
      return (
        (t.getQuotedValue = function (n) {
          n === void 0 && (n = {});
          var a = this._determineQuoteMark(n),
            s = ca[a],
            o = (0, Fr.default)(this._value, s);
          return o;
        }),
        (t._determineQuoteMark = function (n) {
          return n.smart ? this.smartQuoteMark(n) : this.preferredQuoteMark(n);
        }),
        (t.setValue = function (n, a) {
          a === void 0 && (a = {}),
            (this._value = n),
            (this._quoteMark = this._determineQuoteMark(a)),
            this._syncRawValue();
        }),
        (t.smartQuoteMark = function (n) {
          var a = this.value,
            s = a.replace(/[^']/g, '').length,
            o = a.replace(/[^"]/g, '').length;
          if (s + o === 0) {
            var u = (0, Fr.default)(a, { isIdentifier: !0 });
            if (u === a) return e.NO_QUOTE;
            var c = this.preferredQuoteMark(n);
            if (c === e.NO_QUOTE) {
              var f = this.quoteMark || n.quoteMark || e.DOUBLE_QUOTE,
                p = ca[f],
                d = (0, Fr.default)(a, p);
              if (d.length < u.length) return f;
            }
            return c;
          } else
            return o === s
              ? this.preferredQuoteMark(n)
              : o < s
              ? e.DOUBLE_QUOTE
              : e.SINGLE_QUOTE;
        }),
        (t.preferredQuoteMark = function (n) {
          var a = n.preferCurrentQuoteMark ? this.quoteMark : n.quoteMark;
          return (
            a === void 0 &&
              (a = n.preferCurrentQuoteMark ? n.quoteMark : this.quoteMark),
            a === void 0 && (a = e.DOUBLE_QUOTE),
            a
          );
        }),
        (t._syncRawValue = function () {
          var n = (0, Fr.default)(this._value, ca[this.quoteMark]);
          n === this._value
            ? this.raws && delete this.raws.value
            : (this.raws.value = n);
        }),
        (t._handleEscapes = function (n, a) {
          if (this._constructed) {
            var s = (0, Fr.default)(a, { isIdentifier: !0 });
            s !== a ? (this.raws[n] = s) : delete this.raws[n];
          }
        }),
        (t._spacesFor = function (n) {
          var a = { before: '', after: '' },
            s = this.spaces[n] || {},
            o = (this.raws.spaces && this.raws.spaces[n]) || {};
          return Object.assign(a, s, o);
        }),
        (t._stringFor = function (n, a, s) {
          a === void 0 && (a = n), s === void 0 && (s = ap);
          var o = this._spacesFor(a);
          return s(this.stringifyProperty(n), o);
        }),
        (t.offsetOf = function (n) {
          var a = 1,
            s = this._spacesFor('attribute');
          if (((a += s.before.length), n === 'namespace' || n === 'ns'))
            return this.namespace ? a : -1;
          if (
            n === 'attributeNS' ||
            ((a += this.namespaceString.length),
            this.namespace && (a += 1),
            n === 'attribute')
          )
            return a;
          (a += this.stringifyProperty('attribute').length),
            (a += s.after.length);
          var o = this._spacesFor('operator');
          a += o.before.length;
          var u = this.stringifyProperty('operator');
          if (n === 'operator') return u ? a : -1;
          (a += u.length), (a += o.after.length);
          var c = this._spacesFor('value');
          a += c.before.length;
          var f = this.stringifyProperty('value');
          if (n === 'value') return f ? a : -1;
          (a += f.length), (a += c.after.length);
          var p = this._spacesFor('insensitive');
          return (
            (a += p.before.length),
            n === 'insensitive' && this.insensitive ? a : -1
          );
        }),
        (t.toString = function () {
          var n = this,
            a = [this.rawSpaceBefore, '['];
          return (
            a.push(this._stringFor('qualifiedAttribute', 'attribute')),
            this.operator &&
              (this.value || this.value === '') &&
              (a.push(this._stringFor('operator')),
              a.push(this._stringFor('value')),
              a.push(
                this._stringFor(
                  'insensitiveFlag',
                  'insensitive',
                  function (s, o) {
                    return (
                      s.length > 0 &&
                        !n.quoted &&
                        o.before.length === 0 &&
                        !(n.spaces.value && n.spaces.value.after) &&
                        (o.before = ' '),
                      ap(s, o)
                    );
                  },
                ),
              )),
            a.push(']'),
            a.push(this.rawSpaceAfter),
            a.join('')
          );
        }),
        m1(e, [
          {
            key: 'quoted',
            get: function () {
              var n = this.quoteMark;
              return n === "'" || n === '"';
            },
            set: function (n) {
              b1();
            },
          },
          {
            key: 'quoteMark',
            get: function () {
              return this._quoteMark;
            },
            set: function (n) {
              if (!this._constructed) {
                this._quoteMark = n;
                return;
              }
              this._quoteMark !== n &&
                ((this._quoteMark = n), this._syncRawValue());
            },
          },
          {
            key: 'qualifiedAttribute',
            get: function () {
              return this.qualifiedName(this.raws.attribute || this.attribute);
            },
          },
          {
            key: 'insensitiveFlag',
            get: function () {
              return this.insensitive ? 'i' : '';
            },
          },
          {
            key: 'value',
            get: function () {
              return this._value;
            },
            set: function (n) {
              if (this._constructed) {
                var a = fa(n),
                  s = a.deprecatedUsage,
                  o = a.unescaped,
                  u = a.quoteMark;
                if ((s && w1(), o === this._value && u === this._quoteMark))
                  return;
                (this._value = o), (this._quoteMark = u), this._syncRawValue();
              } else this._value = n;
            },
          },
          {
            key: 'insensitive',
            get: function () {
              return this._insensitive;
            },
            set: function (n) {
              n ||
                ((this._insensitive = !1),
                this.raws &&
                  (this.raws.insensitiveFlag === 'I' ||
                    this.raws.insensitiveFlag === 'i') &&
                  (this.raws.insensitiveFlag = void 0)),
                (this._insensitive = n);
            },
          },
          {
            key: 'attribute',
            get: function () {
              return this._attribute;
            },
            set: function (n) {
              this._handleEscapes('attribute', n), (this._attribute = n);
            },
          },
        ]),
        e
      );
    })(d1.default);
    Lr.default = rn;
    rn.NO_QUOTE = null;
    rn.SINGLE_QUOTE = "'";
    rn.DOUBLE_QUOTE = '"';
    var ca =
      ((oa = {
        "'": { quotes: 'single', wrap: !0 },
        '"': { quotes: 'double', wrap: !0 },
      }),
      (oa[null] = { isIdentifier: !0 }),
      oa);
    function ap(i, e) {
      return '' + e.before + i + e.after;
    }
  });
  var ha = v(($r, op) => {
    l();
    ('use strict');
    $r.__esModule = !0;
    $r.default = void 0;
    var k1 = C1(tn()),
      S1 = ne();
    function C1(i) {
      return i && i.__esModule ? i : { default: i };
    }
    function A1(i, e) {
      (i.prototype = Object.create(e.prototype)),
        (i.prototype.constructor = i),
        da(i, e);
    }
    function da(i, e) {
      return (
        (da = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (r, n) {
              return (r.__proto__ = n), r;
            }),
        da(i, e)
      );
    }
    var _1 = (function (i) {
      A1(e, i);
      function e(t) {
        var r;
        return (
          (r = i.call(this, t) || this),
          (r.type = S1.UNIVERSAL),
          (r.value = '*'),
          r
        );
      }
      return e;
    })(k1.default);
    $r.default = _1;
    op.exports = $r.default;
  });
  var ga = v((jr, lp) => {
    l();
    ('use strict');
    jr.__esModule = !0;
    jr.default = void 0;
    var E1 = T1(Ue()),
      O1 = ne();
    function T1(i) {
      return i && i.__esModule ? i : { default: i };
    }
    function P1(i, e) {
      (i.prototype = Object.create(e.prototype)),
        (i.prototype.constructor = i),
        ma(i, e);
    }
    function ma(i, e) {
      return (
        (ma = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (r, n) {
              return (r.__proto__ = n), r;
            }),
        ma(i, e)
      );
    }
    var D1 = (function (i) {
      P1(e, i);
      function e(t) {
        var r;
        return (r = i.call(this, t) || this), (r.type = O1.COMBINATOR), r;
      }
      return e;
    })(E1.default);
    jr.default = D1;
    lp.exports = jr.default;
  });
  var wa = v((zr, up) => {
    l();
    ('use strict');
    zr.__esModule = !0;
    zr.default = void 0;
    var I1 = R1(Ue()),
      q1 = ne();
    function R1(i) {
      return i && i.__esModule ? i : { default: i };
    }
    function M1(i, e) {
      (i.prototype = Object.create(e.prototype)),
        (i.prototype.constructor = i),
        ya(i, e);
    }
    function ya(i, e) {
      return (
        (ya = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (r, n) {
              return (r.__proto__ = n), r;
            }),
        ya(i, e)
      );
    }
    var B1 = (function (i) {
      M1(e, i);
      function e(t) {
        var r;
        return (
          (r = i.call(this, t) || this),
          (r.type = q1.NESTING),
          (r.value = '&'),
          r
        );
      }
      return e;
    })(I1.default);
    zr.default = B1;
    up.exports = zr.default;
  });
  var cp = v((nn, fp) => {
    l();
    ('use strict');
    nn.__esModule = !0;
    nn.default = F1;
    function F1(i) {
      return i.sort(function (e, t) {
        return e - t;
      });
    }
    fp.exports = nn.default;
  });
  var ba = v((D) => {
    l();
    ('use strict');
    D.__esModule = !0;
    D.word =
      D.tilde =
      D.tab =
      D.str =
      D.space =
      D.slash =
      D.singleQuote =
      D.semicolon =
      D.plus =
      D.pipe =
      D.openSquare =
      D.openParenthesis =
      D.newline =
      D.greaterThan =
      D.feed =
      D.equals =
      D.doubleQuote =
      D.dollar =
      D.cr =
      D.comment =
      D.comma =
      D.combinator =
      D.colon =
      D.closeSquare =
      D.closeParenthesis =
      D.caret =
      D.bang =
      D.backslash =
      D.at =
      D.asterisk =
      D.ampersand =
        void 0;
    var N1 = 38;
    D.ampersand = N1;
    var L1 = 42;
    D.asterisk = L1;
    var $1 = 64;
    D.at = $1;
    var j1 = 44;
    D.comma = j1;
    var z1 = 58;
    D.colon = z1;
    var V1 = 59;
    D.semicolon = V1;
    var U1 = 40;
    D.openParenthesis = U1;
    var W1 = 41;
    D.closeParenthesis = W1;
    var G1 = 91;
    D.openSquare = G1;
    var H1 = 93;
    D.closeSquare = H1;
    var Y1 = 36;
    D.dollar = Y1;
    var Q1 = 126;
    D.tilde = Q1;
    var J1 = 94;
    D.caret = J1;
    var X1 = 43;
    D.plus = X1;
    var K1 = 61;
    D.equals = K1;
    var Z1 = 124;
    D.pipe = Z1;
    var ek = 62;
    D.greaterThan = ek;
    var tk = 32;
    D.space = tk;
    var pp = 39;
    D.singleQuote = pp;
    var rk = 34;
    D.doubleQuote = rk;
    var ik = 47;
    D.slash = ik;
    var nk = 33;
    D.bang = nk;
    var sk = 92;
    D.backslash = sk;
    var ak = 13;
    D.cr = ak;
    var ok = 12;
    D.feed = ok;
    var lk = 10;
    D.newline = lk;
    var uk = 9;
    D.tab = uk;
    var fk = pp;
    D.str = fk;
    var ck = -1;
    D.comment = ck;
    var pk = -2;
    D.word = pk;
    var dk = -3;
    D.combinator = dk;
  });
  var mp = v((Vr) => {
    l();
    ('use strict');
    Vr.__esModule = !0;
    Vr.FIELDS = void 0;
    Vr.default = vk;
    var O = hk(ba()),
      Tt,
      V;
    function dp(i) {
      if (typeof WeakMap != 'function') return null;
      var e = new WeakMap(),
        t = new WeakMap();
      return (dp = function (n) {
        return n ? t : e;
      })(i);
    }
    function hk(i, e) {
      if (!e && i && i.__esModule) return i;
      if (i === null || (typeof i != 'object' && typeof i != 'function'))
        return { default: i };
      var t = dp(e);
      if (t && t.has(i)) return t.get(i);
      var r = {},
        n = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var a in i)
        if (a !== 'default' && Object.prototype.hasOwnProperty.call(i, a)) {
          var s = n ? Object.getOwnPropertyDescriptor(i, a) : null;
          s && (s.get || s.set)
            ? Object.defineProperty(r, a, s)
            : (r[a] = i[a]);
        }
      return (r.default = i), t && t.set(i, r), r;
    }
    var mk =
        ((Tt = {}),
        (Tt[O.tab] = !0),
        (Tt[O.newline] = !0),
        (Tt[O.cr] = !0),
        (Tt[O.feed] = !0),
        Tt),
      gk =
        ((V = {}),
        (V[O.space] = !0),
        (V[O.tab] = !0),
        (V[O.newline] = !0),
        (V[O.cr] = !0),
        (V[O.feed] = !0),
        (V[O.ampersand] = !0),
        (V[O.asterisk] = !0),
        (V[O.bang] = !0),
        (V[O.comma] = !0),
        (V[O.colon] = !0),
        (V[O.semicolon] = !0),
        (V[O.openParenthesis] = !0),
        (V[O.closeParenthesis] = !0),
        (V[O.openSquare] = !0),
        (V[O.closeSquare] = !0),
        (V[O.singleQuote] = !0),
        (V[O.doubleQuote] = !0),
        (V[O.plus] = !0),
        (V[O.pipe] = !0),
        (V[O.tilde] = !0),
        (V[O.greaterThan] = !0),
        (V[O.equals] = !0),
        (V[O.dollar] = !0),
        (V[O.caret] = !0),
        (V[O.slash] = !0),
        V),
      va = {},
      hp = '0123456789abcdefABCDEF';
    for (sn = 0; sn < hp.length; sn++) va[hp.charCodeAt(sn)] = !0;
    var sn;
    function yk(i, e) {
      var t = e,
        r;
      do {
        if (((r = i.charCodeAt(t)), gk[r])) return t - 1;
        r === O.backslash ? (t = wk(i, t) + 1) : t++;
      } while (t < i.length);
      return t - 1;
    }
    function wk(i, e) {
      var t = e,
        r = i.charCodeAt(t + 1);
      if (!mk[r])
        if (va[r]) {
          var n = 0;
          do t++, n++, (r = i.charCodeAt(t + 1));
          while (va[r] && n < 6);
          n < 6 && r === O.space && t++;
        } else t++;
      return t;
    }
    var bk = {
      TYPE: 0,
      START_LINE: 1,
      START_COL: 2,
      END_LINE: 3,
      END_COL: 4,
      START_POS: 5,
      END_POS: 6,
    };
    Vr.FIELDS = bk;
    function vk(i) {
      var e = [],
        t = i.css.valueOf(),
        r = t,
        n = r.length,
        a = -1,
        s = 1,
        o = 0,
        u = 0,
        c,
        f,
        p,
        d,
        h,
        y,
        x,
        w,
        b,
        k,
        S,
        _,
        E;
      function I(B, q) {
        if (i.safe) (t += q), (b = t.length - 1);
        else throw i.error('Unclosed ' + B, s, o - a, o);
      }
      for (; o < n; ) {
        switch (
          ((c = t.charCodeAt(o)), c === O.newline && ((a = o), (s += 1)), c)
        ) {
          case O.space:
          case O.tab:
          case O.newline:
          case O.cr:
          case O.feed:
            b = o;
            do
              (b += 1),
                (c = t.charCodeAt(b)),
                c === O.newline && ((a = b), (s += 1));
            while (
              c === O.space ||
              c === O.newline ||
              c === O.tab ||
              c === O.cr ||
              c === O.feed
            );
            (E = O.space), (d = s), (p = b - a - 1), (u = b);
            break;
          case O.plus:
          case O.greaterThan:
          case O.tilde:
          case O.pipe:
            b = o;
            do (b += 1), (c = t.charCodeAt(b));
            while (
              c === O.plus ||
              c === O.greaterThan ||
              c === O.tilde ||
              c === O.pipe
            );
            (E = O.combinator), (d = s), (p = o - a), (u = b);
            break;
          case O.asterisk:
          case O.ampersand:
          case O.bang:
          case O.comma:
          case O.equals:
          case O.dollar:
          case O.caret:
          case O.openSquare:
          case O.closeSquare:
          case O.colon:
          case O.semicolon:
          case O.openParenthesis:
          case O.closeParenthesis:
            (b = o), (E = c), (d = s), (p = o - a), (u = b + 1);
            break;
          case O.singleQuote:
          case O.doubleQuote:
            (_ = c === O.singleQuote ? "'" : '"'), (b = o);
            do
              for (
                h = !1,
                  b = t.indexOf(_, b + 1),
                  b === -1 && I('quote', _),
                  y = b;
                t.charCodeAt(y - 1) === O.backslash;

              )
                (y -= 1), (h = !h);
            while (h);
            (E = O.str), (d = s), (p = o - a), (u = b + 1);
            break;
          default:
            c === O.slash && t.charCodeAt(o + 1) === O.asterisk
              ? ((b = t.indexOf('*/', o + 2) + 1),
                b === 0 && I('comment', '*/'),
                (f = t.slice(o, b + 1)),
                (w = f.split(`
`)),
                (x = w.length - 1),
                x > 0
                  ? ((k = s + x), (S = b - w[x].length))
                  : ((k = s), (S = a)),
                (E = O.comment),
                (s = k),
                (d = k),
                (p = b - S))
              : c === O.slash
              ? ((b = o), (E = c), (d = s), (p = o - a), (u = b + 1))
              : ((b = yk(t, o)), (E = O.word), (d = s), (p = b - a)),
              (u = b + 1);
            break;
        }
        e.push([E, s, o - a, d, p, o, u]), S && ((a = S), (S = null)), (o = u);
      }
      return e;
    }
  });
  var Sp = v((Ur, kp) => {
    l();
    ('use strict');
    Ur.__esModule = !0;
    Ur.default = void 0;
    var xk = we(Us()),
      xa = we(Gs()),
      kk = we(Qs()),
      gp = we(Xs()),
      Sk = we(Zs()),
      Ck = we(ra()),
      ka = we(na()),
      Ak = we(aa()),
      yp = an(pa()),
      _k = we(ha()),
      Sa = we(ga()),
      Ek = we(wa()),
      Ok = we(cp()),
      A = an(mp()),
      T = an(ba()),
      Tk = an(ne()),
      Y = Ar(),
      yt,
      Ca;
    function wp(i) {
      if (typeof WeakMap != 'function') return null;
      var e = new WeakMap(),
        t = new WeakMap();
      return (wp = function (n) {
        return n ? t : e;
      })(i);
    }
    function an(i, e) {
      if (!e && i && i.__esModule) return i;
      if (i === null || (typeof i != 'object' && typeof i != 'function'))
        return { default: i };
      var t = wp(e);
      if (t && t.has(i)) return t.get(i);
      var r = {},
        n = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var a in i)
        if (a !== 'default' && Object.prototype.hasOwnProperty.call(i, a)) {
          var s = n ? Object.getOwnPropertyDescriptor(i, a) : null;
          s && (s.get || s.set)
            ? Object.defineProperty(r, a, s)
            : (r[a] = i[a]);
        }
      return (r.default = i), t && t.set(i, r), r;
    }
    function we(i) {
      return i && i.__esModule ? i : { default: i };
    }
    function bp(i, e) {
      for (var t = 0; t < e.length; t++) {
        var r = e[t];
        (r.enumerable = r.enumerable || !1),
          (r.configurable = !0),
          'value' in r && (r.writable = !0),
          Object.defineProperty(i, r.key, r);
      }
    }
    function Pk(i, e, t) {
      return (
        e && bp(i.prototype, e),
        t && bp(i, t),
        Object.defineProperty(i, 'prototype', { writable: !1 }),
        i
      );
    }
    var Aa =
        ((yt = {}),
        (yt[T.space] = !0),
        (yt[T.cr] = !0),
        (yt[T.feed] = !0),
        (yt[T.newline] = !0),
        (yt[T.tab] = !0),
        yt),
      Dk = Object.assign({}, Aa, ((Ca = {}), (Ca[T.comment] = !0), Ca));
    function vp(i) {
      return { line: i[A.FIELDS.START_LINE], column: i[A.FIELDS.START_COL] };
    }
    function xp(i) {
      return { line: i[A.FIELDS.END_LINE], column: i[A.FIELDS.END_COL] };
    }
    function wt(i, e, t, r) {
      return { start: { line: i, column: e }, end: { line: t, column: r } };
    }
    function Pt(i) {
      return wt(
        i[A.FIELDS.START_LINE],
        i[A.FIELDS.START_COL],
        i[A.FIELDS.END_LINE],
        i[A.FIELDS.END_COL],
      );
    }
    function _a(i, e) {
      if (!!i)
        return wt(
          i[A.FIELDS.START_LINE],
          i[A.FIELDS.START_COL],
          e[A.FIELDS.END_LINE],
          e[A.FIELDS.END_COL],
        );
    }
    function Dt(i, e) {
      var t = i[e];
      if (typeof t == 'string')
        return (
          t.indexOf('\\') !== -1 &&
            ((0, Y.ensureObject)(i, 'raws'),
            (i[e] = (0, Y.unesc)(t)),
            i.raws[e] === void 0 && (i.raws[e] = t)),
          i
        );
    }
    function Ea(i, e) {
      for (var t = -1, r = []; (t = i.indexOf(e, t + 1)) !== -1; ) r.push(t);
      return r;
    }
    function Ik() {
      var i = Array.prototype.concat.apply([], arguments);
      return i.filter(function (e, t) {
        return t === i.indexOf(e);
      });
    }
    var qk = (function () {
      function i(t, r) {
        r === void 0 && (r = {}),
          (this.rule = t),
          (this.options = Object.assign({ lossy: !1, safe: !1 }, r)),
          (this.position = 0),
          (this.css =
            typeof this.rule == 'string' ? this.rule : this.rule.selector),
          (this.tokens = (0, A.default)({
            css: this.css,
            error: this._errorGenerator(),
            safe: this.options.safe,
          }));
        var n = _a(this.tokens[0], this.tokens[this.tokens.length - 1]);
        (this.root = new xk.default({ source: n })),
          (this.root.errorGenerator = this._errorGenerator());
        var a = new xa.default({ source: { start: { line: 1, column: 1 } } });
        this.root.append(a), (this.current = a), this.loop();
      }
      var e = i.prototype;
      return (
        (e._errorGenerator = function () {
          var r = this;
          return function (n, a) {
            return typeof r.rule == 'string'
              ? new Error(n)
              : r.rule.error(n, a);
          };
        }),
        (e.attribute = function () {
          var r = [],
            n = this.currToken;
          for (
            this.position++;
            this.position < this.tokens.length &&
            this.currToken[A.FIELDS.TYPE] !== T.closeSquare;

          )
            r.push(this.currToken), this.position++;
          if (this.currToken[A.FIELDS.TYPE] !== T.closeSquare)
            return this.expected(
              'closing square bracket',
              this.currToken[A.FIELDS.START_POS],
            );
          var a = r.length,
            s = {
              source: wt(n[1], n[2], this.currToken[3], this.currToken[4]),
              sourceIndex: n[A.FIELDS.START_POS],
            };
          if (a === 1 && !~[T.word].indexOf(r[0][A.FIELDS.TYPE]))
            return this.expected('attribute', r[0][A.FIELDS.START_POS]);
          for (var o = 0, u = '', c = '', f = null, p = !1; o < a; ) {
            var d = r[o],
              h = this.content(d),
              y = r[o + 1];
            switch (d[A.FIELDS.TYPE]) {
              case T.space:
                if (((p = !0), this.options.lossy)) break;
                if (f) {
                  (0, Y.ensureObject)(s, 'spaces', f);
                  var x = s.spaces[f].after || '';
                  s.spaces[f].after = x + h;
                  var w =
                    (0, Y.getProp)(s, 'raws', 'spaces', f, 'after') || null;
                  w && (s.raws.spaces[f].after = w + h);
                } else (u = u + h), (c = c + h);
                break;
              case T.asterisk:
                if (y[A.FIELDS.TYPE] === T.equals)
                  (s.operator = h), (f = 'operator');
                else if ((!s.namespace || (f === 'namespace' && !p)) && y) {
                  u &&
                    ((0, Y.ensureObject)(s, 'spaces', 'attribute'),
                    (s.spaces.attribute.before = u),
                    (u = '')),
                    c &&
                      ((0, Y.ensureObject)(s, 'raws', 'spaces', 'attribute'),
                      (s.raws.spaces.attribute.before = u),
                      (c = '')),
                    (s.namespace = (s.namespace || '') + h);
                  var b = (0, Y.getProp)(s, 'raws', 'namespace') || null;
                  b && (s.raws.namespace += h), (f = 'namespace');
                }
                p = !1;
                break;
              case T.dollar:
                if (f === 'value') {
                  var k = (0, Y.getProp)(s, 'raws', 'value');
                  (s.value += '$'), k && (s.raws.value = k + '$');
                  break;
                }
              case T.caret:
                y[A.FIELDS.TYPE] === T.equals &&
                  ((s.operator = h), (f = 'operator')),
                  (p = !1);
                break;
              case T.combinator:
                if (
                  (h === '~' &&
                    y[A.FIELDS.TYPE] === T.equals &&
                    ((s.operator = h), (f = 'operator')),
                  h !== '|')
                ) {
                  p = !1;
                  break;
                }
                y[A.FIELDS.TYPE] === T.equals
                  ? ((s.operator = h), (f = 'operator'))
                  : !s.namespace && !s.attribute && (s.namespace = !0),
                  (p = !1);
                break;
              case T.word:
                if (
                  y &&
                  this.content(y) === '|' &&
                  r[o + 2] &&
                  r[o + 2][A.FIELDS.TYPE] !== T.equals &&
                  !s.operator &&
                  !s.namespace
                )
                  (s.namespace = h), (f = 'namespace');
                else if (!s.attribute || (f === 'attribute' && !p)) {
                  u &&
                    ((0, Y.ensureObject)(s, 'spaces', 'attribute'),
                    (s.spaces.attribute.before = u),
                    (u = '')),
                    c &&
                      ((0, Y.ensureObject)(s, 'raws', 'spaces', 'attribute'),
                      (s.raws.spaces.attribute.before = c),
                      (c = '')),
                    (s.attribute = (s.attribute || '') + h);
                  var S = (0, Y.getProp)(s, 'raws', 'attribute') || null;
                  S && (s.raws.attribute += h), (f = 'attribute');
                } else if (
                  (!s.value && s.value !== '') ||
                  (f === 'value' && !(p || s.quoteMark))
                ) {
                  var _ = (0, Y.unesc)(h),
                    E = (0, Y.getProp)(s, 'raws', 'value') || '',
                    I = s.value || '';
                  (s.value = I + _),
                    (s.quoteMark = null),
                    (_ !== h || E) &&
                      ((0, Y.ensureObject)(s, 'raws'),
                      (s.raws.value = (E || I) + h)),
                    (f = 'value');
                } else {
                  var B = h === 'i' || h === 'I';
                  (s.value || s.value === '') && (s.quoteMark || p)
                    ? ((s.insensitive = B),
                      (!B || h === 'I') &&
                        ((0, Y.ensureObject)(s, 'raws'),
                        (s.raws.insensitiveFlag = h)),
                      (f = 'insensitive'),
                      u &&
                        ((0, Y.ensureObject)(s, 'spaces', 'insensitive'),
                        (s.spaces.insensitive.before = u),
                        (u = '')),
                      c &&
                        ((0, Y.ensureObject)(
                          s,
                          'raws',
                          'spaces',
                          'insensitive',
                        ),
                        (s.raws.spaces.insensitive.before = c),
                        (c = '')))
                    : (s.value || s.value === '') &&
                      ((f = 'value'),
                      (s.value += h),
                      s.raws.value && (s.raws.value += h));
                }
                p = !1;
                break;
              case T.str:
                if (!s.attribute || !s.operator)
                  return this.error(
                    'Expected an attribute followed by an operator preceding the string.',
                    { index: d[A.FIELDS.START_POS] },
                  );
                var q = (0, yp.unescapeValue)(h),
                  X = q.unescaped,
                  ae = q.quoteMark;
                (s.value = X),
                  (s.quoteMark = ae),
                  (f = 'value'),
                  (0, Y.ensureObject)(s, 'raws'),
                  (s.raws.value = h),
                  (p = !1);
                break;
              case T.equals:
                if (!s.attribute)
                  return this.expected('attribute', d[A.FIELDS.START_POS], h);
                if (s.value)
                  return this.error(
                    'Unexpected "=" found; an operator was already defined.',
                    { index: d[A.FIELDS.START_POS] },
                  );
                (s.operator = s.operator ? s.operator + h : h),
                  (f = 'operator'),
                  (p = !1);
                break;
              case T.comment:
                if (f)
                  if (
                    p ||
                    (y && y[A.FIELDS.TYPE] === T.space) ||
                    f === 'insensitive'
                  ) {
                    var ge = (0, Y.getProp)(s, 'spaces', f, 'after') || '',
                      je =
                        (0, Y.getProp)(s, 'raws', 'spaces', f, 'after') || ge;
                    (0, Y.ensureObject)(s, 'raws', 'spaces', f),
                      (s.raws.spaces[f].after = je + h);
                  } else {
                    var $ = s[f] || '',
                      oe = (0, Y.getProp)(s, 'raws', f) || $;
                    (0, Y.ensureObject)(s, 'raws'), (s.raws[f] = oe + h);
                  }
                else c = c + h;
                break;
              default:
                return this.error('Unexpected "' + h + '" found.', {
                  index: d[A.FIELDS.START_POS],
                });
            }
            o++;
          }
          Dt(s, 'attribute'),
            Dt(s, 'namespace'),
            this.newNode(new yp.default(s)),
            this.position++;
        }),
        (e.parseWhitespaceEquivalentTokens = function (r) {
          r < 0 && (r = this.tokens.length);
          var n = this.position,
            a = [],
            s = '',
            o = void 0;
          do
            if (Aa[this.currToken[A.FIELDS.TYPE]])
              this.options.lossy || (s += this.content());
            else if (this.currToken[A.FIELDS.TYPE] === T.comment) {
              var u = {};
              s && ((u.before = s), (s = '')),
                (o = new gp.default({
                  value: this.content(),
                  source: Pt(this.currToken),
                  sourceIndex: this.currToken[A.FIELDS.START_POS],
                  spaces: u,
                })),
                a.push(o);
            }
          while (++this.position < r);
          if (s) {
            if (o) o.spaces.after = s;
            else if (!this.options.lossy) {
              var c = this.tokens[n],
                f = this.tokens[this.position - 1];
              a.push(
                new ka.default({
                  value: '',
                  source: wt(
                    c[A.FIELDS.START_LINE],
                    c[A.FIELDS.START_COL],
                    f[A.FIELDS.END_LINE],
                    f[A.FIELDS.END_COL],
                  ),
                  sourceIndex: c[A.FIELDS.START_POS],
                  spaces: { before: s, after: '' },
                }),
              );
            }
          }
          return a;
        }),
        (e.convertWhitespaceNodesToSpace = function (r, n) {
          var a = this;
          n === void 0 && (n = !1);
          var s = '',
            o = '';
          r.forEach(function (c) {
            var f = a.lossySpace(c.spaces.before, n),
              p = a.lossySpace(c.rawSpaceBefore, n);
            (s += f + a.lossySpace(c.spaces.after, n && f.length === 0)),
              (o +=
                f +
                c.value +
                a.lossySpace(c.rawSpaceAfter, n && p.length === 0));
          }),
            o === s && (o = void 0);
          var u = { space: s, rawSpace: o };
          return u;
        }),
        (e.isNamedCombinator = function (r) {
          return (
            r === void 0 && (r = this.position),
            this.tokens[r + 0] &&
              this.tokens[r + 0][A.FIELDS.TYPE] === T.slash &&
              this.tokens[r + 1] &&
              this.tokens[r + 1][A.FIELDS.TYPE] === T.word &&
              this.tokens[r + 2] &&
              this.tokens[r + 2][A.FIELDS.TYPE] === T.slash
          );
        }),
        (e.namedCombinator = function () {
          if (this.isNamedCombinator()) {
            var r = this.content(this.tokens[this.position + 1]),
              n = (0, Y.unesc)(r).toLowerCase(),
              a = {};
            n !== r && (a.value = '/' + r + '/');
            var s = new Sa.default({
              value: '/' + n + '/',
              source: wt(
                this.currToken[A.FIELDS.START_LINE],
                this.currToken[A.FIELDS.START_COL],
                this.tokens[this.position + 2][A.FIELDS.END_LINE],
                this.tokens[this.position + 2][A.FIELDS.END_COL],
              ),
              sourceIndex: this.currToken[A.FIELDS.START_POS],
              raws: a,
            });
            return (this.position = this.position + 3), s;
          } else this.unexpected();
        }),
        (e.combinator = function () {
          var r = this;
          if (this.content() === '|') return this.namespace();
          var n = this.locateNextMeaningfulToken(this.position);
          if (n < 0 || this.tokens[n][A.FIELDS.TYPE] === T.comma) {
            var a = this.parseWhitespaceEquivalentTokens(n);
            if (a.length > 0) {
              var s = this.current.last;
              if (s) {
                var o = this.convertWhitespaceNodesToSpace(a),
                  u = o.space,
                  c = o.rawSpace;
                c !== void 0 && (s.rawSpaceAfter += c), (s.spaces.after += u);
              } else
                a.forEach(function (E) {
                  return r.newNode(E);
                });
            }
            return;
          }
          var f = this.currToken,
            p = void 0;
          n > this.position && (p = this.parseWhitespaceEquivalentTokens(n));
          var d;
          if (
            (this.isNamedCombinator()
              ? (d = this.namedCombinator())
              : this.currToken[A.FIELDS.TYPE] === T.combinator
              ? ((d = new Sa.default({
                  value: this.content(),
                  source: Pt(this.currToken),
                  sourceIndex: this.currToken[A.FIELDS.START_POS],
                })),
                this.position++)
              : Aa[this.currToken[A.FIELDS.TYPE]] || p || this.unexpected(),
            d)
          ) {
            if (p) {
              var h = this.convertWhitespaceNodesToSpace(p),
                y = h.space,
                x = h.rawSpace;
              (d.spaces.before = y), (d.rawSpaceBefore = x);
            }
          } else {
            var w = this.convertWhitespaceNodesToSpace(p, !0),
              b = w.space,
              k = w.rawSpace;
            k || (k = b);
            var S = {},
              _ = { spaces: {} };
            b.endsWith(' ') && k.endsWith(' ')
              ? ((S.before = b.slice(0, b.length - 1)),
                (_.spaces.before = k.slice(0, k.length - 1)))
              : b.startsWith(' ') && k.startsWith(' ')
              ? ((S.after = b.slice(1)), (_.spaces.after = k.slice(1)))
              : (_.value = k),
              (d = new Sa.default({
                value: ' ',
                source: _a(f, this.tokens[this.position - 1]),
                sourceIndex: f[A.FIELDS.START_POS],
                spaces: S,
                raws: _,
              }));
          }
          return (
            this.currToken &&
              this.currToken[A.FIELDS.TYPE] === T.space &&
              ((d.spaces.after = this.optionalSpace(this.content())),
              this.position++),
            this.newNode(d)
          );
        }),
        (e.comma = function () {
          if (this.position === this.tokens.length - 1) {
            (this.root.trailingComma = !0), this.position++;
            return;
          }
          this.current._inferEndPosition();
          var r = new xa.default({
            source: { start: vp(this.tokens[this.position + 1]) },
          });
          this.current.parent.append(r), (this.current = r), this.position++;
        }),
        (e.comment = function () {
          var r = this.currToken;
          this.newNode(
            new gp.default({
              value: this.content(),
              source: Pt(r),
              sourceIndex: r[A.FIELDS.START_POS],
            }),
          ),
            this.position++;
        }),
        (e.error = function (r, n) {
          throw this.root.error(r, n);
        }),
        (e.missingBackslash = function () {
          return this.error('Expected a backslash preceding the semicolon.', {
            index: this.currToken[A.FIELDS.START_POS],
          });
        }),
        (e.missingParenthesis = function () {
          return this.expected(
            'opening parenthesis',
            this.currToken[A.FIELDS.START_POS],
          );
        }),
        (e.missingSquareBracket = function () {
          return this.expected(
            'opening square bracket',
            this.currToken[A.FIELDS.START_POS],
          );
        }),
        (e.unexpected = function () {
          return this.error(
            "Unexpected '" +
              this.content() +
              "'. Escaping special characters with \\ may help.",
            this.currToken[A.FIELDS.START_POS],
          );
        }),
        (e.unexpectedPipe = function () {
          return this.error(
            "Unexpected '|'.",
            this.currToken[A.FIELDS.START_POS],
          );
        }),
        (e.namespace = function () {
          var r = (this.prevToken && this.content(this.prevToken)) || !0;
          if (this.nextToken[A.FIELDS.TYPE] === T.word)
            return this.position++, this.word(r);
          if (this.nextToken[A.FIELDS.TYPE] === T.asterisk)
            return this.position++, this.universal(r);
          this.unexpectedPipe();
        }),
        (e.nesting = function () {
          if (this.nextToken) {
            var r = this.content(this.nextToken);
            if (r === '|') {
              this.position++;
              return;
            }
          }
          var n = this.currToken;
          this.newNode(
            new Ek.default({
              value: this.content(),
              source: Pt(n),
              sourceIndex: n[A.FIELDS.START_POS],
            }),
          ),
            this.position++;
        }),
        (e.parentheses = function () {
          var r = this.current.last,
            n = 1;
          if ((this.position++, r && r.type === Tk.PSEUDO)) {
            var a = new xa.default({
                source: { start: vp(this.tokens[this.position - 1]) },
              }),
              s = this.current;
            for (
              r.append(a), this.current = a;
              this.position < this.tokens.length && n;

            )
              this.currToken[A.FIELDS.TYPE] === T.openParenthesis && n++,
                this.currToken[A.FIELDS.TYPE] === T.closeParenthesis && n--,
                n
                  ? this.parse()
                  : ((this.current.source.end = xp(this.currToken)),
                    (this.current.parent.source.end = xp(this.currToken)),
                    this.position++);
            this.current = s;
          } else {
            for (
              var o = this.currToken, u = '(', c;
              this.position < this.tokens.length && n;

            )
              this.currToken[A.FIELDS.TYPE] === T.openParenthesis && n++,
                this.currToken[A.FIELDS.TYPE] === T.closeParenthesis && n--,
                (c = this.currToken),
                (u += this.parseParenthesisToken(this.currToken)),
                this.position++;
            r
              ? r.appendToPropertyAndEscape('value', u, u)
              : this.newNode(
                  new ka.default({
                    value: u,
                    source: wt(
                      o[A.FIELDS.START_LINE],
                      o[A.FIELDS.START_COL],
                      c[A.FIELDS.END_LINE],
                      c[A.FIELDS.END_COL],
                    ),
                    sourceIndex: o[A.FIELDS.START_POS],
                  }),
                );
          }
          if (n)
            return this.expected(
              'closing parenthesis',
              this.currToken[A.FIELDS.START_POS],
            );
        }),
        (e.pseudo = function () {
          for (
            var r = this, n = '', a = this.currToken;
            this.currToken && this.currToken[A.FIELDS.TYPE] === T.colon;

          )
            (n += this.content()), this.position++;
          if (!this.currToken)
            return this.expected(
              ['pseudo-class', 'pseudo-element'],
              this.position - 1,
            );
          if (this.currToken[A.FIELDS.TYPE] === T.word)
            this.splitWord(!1, function (s, o) {
              (n += s),
                r.newNode(
                  new Ak.default({
                    value: n,
                    source: _a(a, r.currToken),
                    sourceIndex: a[A.FIELDS.START_POS],
                  }),
                ),
                o > 1 &&
                  r.nextToken &&
                  r.nextToken[A.FIELDS.TYPE] === T.openParenthesis &&
                  r.error('Misplaced parenthesis.', {
                    index: r.nextToken[A.FIELDS.START_POS],
                  });
            });
          else
            return this.expected(
              ['pseudo-class', 'pseudo-element'],
              this.currToken[A.FIELDS.START_POS],
            );
        }),
        (e.space = function () {
          var r = this.content();
          this.position === 0 ||
          this.prevToken[A.FIELDS.TYPE] === T.comma ||
          this.prevToken[A.FIELDS.TYPE] === T.openParenthesis ||
          this.current.nodes.every(function (n) {
            return n.type === 'comment';
          })
            ? ((this.spaces = this.optionalSpace(r)), this.position++)
            : this.position === this.tokens.length - 1 ||
              this.nextToken[A.FIELDS.TYPE] === T.comma ||
              this.nextToken[A.FIELDS.TYPE] === T.closeParenthesis
            ? ((this.current.last.spaces.after = this.optionalSpace(r)),
              this.position++)
            : this.combinator();
        }),
        (e.string = function () {
          var r = this.currToken;
          this.newNode(
            new ka.default({
              value: this.content(),
              source: Pt(r),
              sourceIndex: r[A.FIELDS.START_POS],
            }),
          ),
            this.position++;
        }),
        (e.universal = function (r) {
          var n = this.nextToken;
          if (n && this.content(n) === '|')
            return this.position++, this.namespace();
          var a = this.currToken;
          this.newNode(
            new _k.default({
              value: this.content(),
              source: Pt(a),
              sourceIndex: a[A.FIELDS.START_POS],
            }),
            r,
          ),
            this.position++;
        }),
        (e.splitWord = function (r, n) {
          for (
            var a = this, s = this.nextToken, o = this.content();
            s &&
            ~[T.dollar, T.caret, T.equals, T.word].indexOf(s[A.FIELDS.TYPE]);

          ) {
            this.position++;
            var u = this.content();
            if (((o += u), u.lastIndexOf('\\') === u.length - 1)) {
              var c = this.nextToken;
              c &&
                c[A.FIELDS.TYPE] === T.space &&
                ((o += this.requiredSpace(this.content(c))), this.position++);
            }
            s = this.nextToken;
          }
          var f = Ea(o, '.').filter(function (y) {
              var x = o[y - 1] === '\\',
                w = /^\d+\.\d+%$/.test(o);
              return !x && !w;
            }),
            p = Ea(o, '#').filter(function (y) {
              return o[y - 1] !== '\\';
            }),
            d = Ea(o, '#{');
          d.length &&
            (p = p.filter(function (y) {
              return !~d.indexOf(y);
            }));
          var h = (0, Ok.default)(Ik([0].concat(f, p)));
          h.forEach(function (y, x) {
            var w = h[x + 1] || o.length,
              b = o.slice(y, w);
            if (x === 0 && n) return n.call(a, b, h.length);
            var k,
              S = a.currToken,
              _ = S[A.FIELDS.START_POS] + h[x],
              E = wt(S[1], S[2] + y, S[3], S[2] + (w - 1));
            if (~f.indexOf(y)) {
              var I = { value: b.slice(1), source: E, sourceIndex: _ };
              k = new kk.default(Dt(I, 'value'));
            } else if (~p.indexOf(y)) {
              var B = { value: b.slice(1), source: E, sourceIndex: _ };
              k = new Sk.default(Dt(B, 'value'));
            } else {
              var q = { value: b, source: E, sourceIndex: _ };
              Dt(q, 'value'), (k = new Ck.default(q));
            }
            a.newNode(k, r), (r = null);
          }),
            this.position++;
        }),
        (e.word = function (r) {
          var n = this.nextToken;
          return n && this.content(n) === '|'
            ? (this.position++, this.namespace())
            : this.splitWord(r);
        }),
        (e.loop = function () {
          for (; this.position < this.tokens.length; ) this.parse(!0);
          return this.current._inferEndPosition(), this.root;
        }),
        (e.parse = function (r) {
          switch (this.currToken[A.FIELDS.TYPE]) {
            case T.space:
              this.space();
              break;
            case T.comment:
              this.comment();
              break;
            case T.openParenthesis:
              this.parentheses();
              break;
            case T.closeParenthesis:
              r && this.missingParenthesis();
              break;
            case T.openSquare:
              this.attribute();
              break;
            case T.dollar:
            case T.caret:
            case T.equals:
            case T.word:
              this.word();
              break;
            case T.colon:
              this.pseudo();
              break;
            case T.comma:
              this.comma();
              break;
            case T.asterisk:
              this.universal();
              break;
            case T.ampersand:
              this.nesting();
              break;
            case T.slash:
            case T.combinator:
              this.combinator();
              break;
            case T.str:
              this.string();
              break;
            case T.closeSquare:
              this.missingSquareBracket();
            case T.semicolon:
              this.missingBackslash();
            default:
              this.unexpected();
          }
        }),
        (e.expected = function (r, n, a) {
          if (Array.isArray(r)) {
            var s = r.pop();
            r = r.join(', ') + ' or ' + s;
          }
          var o = /^[aeiou]/.test(r[0]) ? 'an' : 'a';
          return a
            ? this.error(
                'Expected ' + o + ' ' + r + ', found "' + a + '" instead.',
                { index: n },
              )
            : this.error('Expected ' + o + ' ' + r + '.', { index: n });
        }),
        (e.requiredSpace = function (r) {
          return this.options.lossy ? ' ' : r;
        }),
        (e.optionalSpace = function (r) {
          return this.options.lossy ? '' : r;
        }),
        (e.lossySpace = function (r, n) {
          return this.options.lossy ? (n ? ' ' : '') : r;
        }),
        (e.parseParenthesisToken = function (r) {
          var n = this.content(r);
          return r[A.FIELDS.TYPE] === T.space ? this.requiredSpace(n) : n;
        }),
        (e.newNode = function (r, n) {
          return (
            n &&
              (/^ +$/.test(n) &&
                (this.options.lossy || (this.spaces = (this.spaces || '') + n),
                (n = !0)),
              (r.namespace = n),
              Dt(r, 'namespace')),
            this.spaces &&
              ((r.spaces.before = this.spaces), (this.spaces = '')),
            this.current.append(r)
          );
        }),
        (e.content = function (r) {
          return (
            r === void 0 && (r = this.currToken),
            this.css.slice(r[A.FIELDS.START_POS], r[A.FIELDS.END_POS])
          );
        }),
        (e.locateNextMeaningfulToken = function (r) {
          r === void 0 && (r = this.position + 1);
          for (var n = r; n < this.tokens.length; )
            if (Dk[this.tokens[n][A.FIELDS.TYPE]]) {
              n++;
              continue;
            } else return n;
          return -1;
        }),
        Pk(i, [
          {
            key: 'currToken',
            get: function () {
              return this.tokens[this.position];
            },
          },
          {
            key: 'nextToken',
            get: function () {
              return this.tokens[this.position + 1];
            },
          },
          {
            key: 'prevToken',
            get: function () {
              return this.tokens[this.position - 1];
            },
          },
        ]),
        i
      );
    })();
    Ur.default = qk;
    kp.exports = Ur.default;
  });
  var Ap = v((Wr, Cp) => {
    l();
    ('use strict');
    Wr.__esModule = !0;
    Wr.default = void 0;
    var Rk = Mk(Sp());
    function Mk(i) {
      return i && i.__esModule ? i : { default: i };
    }
    var Bk = (function () {
      function i(t, r) {
        (this.func = t || function () {}),
          (this.funcRes = null),
          (this.options = r);
      }
      var e = i.prototype;
      return (
        (e._shouldUpdateSelector = function (r, n) {
          n === void 0 && (n = {});
          var a = Object.assign({}, this.options, n);
          return a.updateSelector === !1 ? !1 : typeof r != 'string';
        }),
        (e._isLossy = function (r) {
          r === void 0 && (r = {});
          var n = Object.assign({}, this.options, r);
          return n.lossless === !1;
        }),
        (e._root = function (r, n) {
          n === void 0 && (n = {});
          var a = new Rk.default(r, this._parseOptions(n));
          return a.root;
        }),
        (e._parseOptions = function (r) {
          return { lossy: this._isLossy(r) };
        }),
        (e._run = function (r, n) {
          var a = this;
          return (
            n === void 0 && (n = {}),
            new Promise(function (s, o) {
              try {
                var u = a._root(r, n);
                Promise.resolve(a.func(u))
                  .then(function (c) {
                    var f = void 0;
                    return (
                      a._shouldUpdateSelector(r, n) &&
                        ((f = u.toString()), (r.selector = f)),
                      { transform: c, root: u, string: f }
                    );
                  })
                  .then(s, o);
              } catch (c) {
                o(c);
                return;
              }
            })
          );
        }),
        (e._runSync = function (r, n) {
          n === void 0 && (n = {});
          var a = this._root(r, n),
            s = this.func(a);
          if (s && typeof s.then == 'function')
            throw new Error(
              'Selector processor returned a promise to a synchronous call.',
            );
          var o = void 0;
          return (
            n.updateSelector &&
              typeof r != 'string' &&
              ((o = a.toString()), (r.selector = o)),
            { transform: s, root: a, string: o }
          );
        }),
        (e.ast = function (r, n) {
          return this._run(r, n).then(function (a) {
            return a.root;
          });
        }),
        (e.astSync = function (r, n) {
          return this._runSync(r, n).root;
        }),
        (e.transform = function (r, n) {
          return this._run(r, n).then(function (a) {
            return a.transform;
          });
        }),
        (e.transformSync = function (r, n) {
          return this._runSync(r, n).transform;
        }),
        (e.process = function (r, n) {
          return this._run(r, n).then(function (a) {
            return a.string || a.root.toString();
          });
        }),
        (e.processSync = function (r, n) {
          var a = this._runSync(r, n);
          return a.string || a.root.toString();
        }),
        i
      );
    })();
    Wr.default = Bk;
    Cp.exports = Wr.default;
  });
  var _p = v((H) => {
    l();
    ('use strict');
    H.__esModule = !0;
    H.universal =
      H.tag =
      H.string =
      H.selector =
      H.root =
      H.pseudo =
      H.nesting =
      H.id =
      H.comment =
      H.combinator =
      H.className =
      H.attribute =
        void 0;
    var Fk = be(pa()),
      Nk = be(Qs()),
      Lk = be(ga()),
      $k = be(Xs()),
      jk = be(Zs()),
      zk = be(wa()),
      Vk = be(aa()),
      Uk = be(Us()),
      Wk = be(Gs()),
      Gk = be(na()),
      Hk = be(ra()),
      Yk = be(ha());
    function be(i) {
      return i && i.__esModule ? i : { default: i };
    }
    var Qk = function (e) {
      return new Fk.default(e);
    };
    H.attribute = Qk;
    var Jk = function (e) {
      return new Nk.default(e);
    };
    H.className = Jk;
    var Xk = function (e) {
      return new Lk.default(e);
    };
    H.combinator = Xk;
    var Kk = function (e) {
      return new $k.default(e);
    };
    H.comment = Kk;
    var Zk = function (e) {
      return new jk.default(e);
    };
    H.id = Zk;
    var eS = function (e) {
      return new zk.default(e);
    };
    H.nesting = eS;
    var tS = function (e) {
      return new Vk.default(e);
    };
    H.pseudo = tS;
    var rS = function (e) {
      return new Uk.default(e);
    };
    H.root = rS;
    var iS = function (e) {
      return new Wk.default(e);
    };
    H.selector = iS;
    var nS = function (e) {
      return new Gk.default(e);
    };
    H.string = nS;
    var sS = function (e) {
      return new Hk.default(e);
    };
    H.tag = sS;
    var aS = function (e) {
      return new Yk.default(e);
    };
    H.universal = aS;
  });
  var Pp = v((L) => {
    l();
    ('use strict');
    L.__esModule = !0;
    L.isComment = L.isCombinator = L.isClassName = L.isAttribute = void 0;
    L.isContainer = wS;
    L.isIdentifier = void 0;
    L.isNamespace = bS;
    L.isNesting = void 0;
    L.isNode = Oa;
    L.isPseudo = void 0;
    L.isPseudoClass = yS;
    L.isPseudoElement = Tp;
    L.isUniversal = L.isTag = L.isString = L.isSelector = L.isRoot = void 0;
    var Q = ne(),
      fe,
      oS =
        ((fe = {}),
        (fe[Q.ATTRIBUTE] = !0),
        (fe[Q.CLASS] = !0),
        (fe[Q.COMBINATOR] = !0),
        (fe[Q.COMMENT] = !0),
        (fe[Q.ID] = !0),
        (fe[Q.NESTING] = !0),
        (fe[Q.PSEUDO] = !0),
        (fe[Q.ROOT] = !0),
        (fe[Q.SELECTOR] = !0),
        (fe[Q.STRING] = !0),
        (fe[Q.TAG] = !0),
        (fe[Q.UNIVERSAL] = !0),
        fe);
    function Oa(i) {
      return typeof i == 'object' && oS[i.type];
    }
    function ve(i, e) {
      return Oa(e) && e.type === i;
    }
    var Ep = ve.bind(null, Q.ATTRIBUTE);
    L.isAttribute = Ep;
    var lS = ve.bind(null, Q.CLASS);
    L.isClassName = lS;
    var uS = ve.bind(null, Q.COMBINATOR);
    L.isCombinator = uS;
    var fS = ve.bind(null, Q.COMMENT);
    L.isComment = fS;
    var cS = ve.bind(null, Q.ID);
    L.isIdentifier = cS;
    var pS = ve.bind(null, Q.NESTING);
    L.isNesting = pS;
    var Ta = ve.bind(null, Q.PSEUDO);
    L.isPseudo = Ta;
    var dS = ve.bind(null, Q.ROOT);
    L.isRoot = dS;
    var hS = ve.bind(null, Q.SELECTOR);
    L.isSelector = hS;
    var mS = ve.bind(null, Q.STRING);
    L.isString = mS;
    var Op = ve.bind(null, Q.TAG);
    L.isTag = Op;
    var gS = ve.bind(null, Q.UNIVERSAL);
    L.isUniversal = gS;
    function Tp(i) {
      return (
        Ta(i) &&
        i.value &&
        (i.value.startsWith('::') ||
          i.value.toLowerCase() === ':before' ||
          i.value.toLowerCase() === ':after' ||
          i.value.toLowerCase() === ':first-letter' ||
          i.value.toLowerCase() === ':first-line')
      );
    }
    function yS(i) {
      return Ta(i) && !Tp(i);
    }
    function wS(i) {
      return !!(Oa(i) && i.walk);
    }
    function bS(i) {
      return Ep(i) || Op(i);
    }
  });
  var Dp = v((Oe) => {
    l();
    ('use strict');
    Oe.__esModule = !0;
    var Pa = ne();
    Object.keys(Pa).forEach(function (i) {
      i === 'default' ||
        i === '__esModule' ||
        (i in Oe && Oe[i] === Pa[i]) ||
        (Oe[i] = Pa[i]);
    });
    var Da = _p();
    Object.keys(Da).forEach(function (i) {
      i === 'default' ||
        i === '__esModule' ||
        (i in Oe && Oe[i] === Da[i]) ||
        (Oe[i] = Da[i]);
    });
    var Ia = Pp();
    Object.keys(Ia).forEach(function (i) {
      i === 'default' ||
        i === '__esModule' ||
        (i in Oe && Oe[i] === Ia[i]) ||
        (Oe[i] = Ia[i]);
    });
  });
  var Me = v((Gr, qp) => {
    l();
    ('use strict');
    Gr.__esModule = !0;
    Gr.default = void 0;
    var vS = SS(Ap()),
      xS = kS(Dp());
    function Ip(i) {
      if (typeof WeakMap != 'function') return null;
      var e = new WeakMap(),
        t = new WeakMap();
      return (Ip = function (n) {
        return n ? t : e;
      })(i);
    }
    function kS(i, e) {
      if (!e && i && i.__esModule) return i;
      if (i === null || (typeof i != 'object' && typeof i != 'function'))
        return { default: i };
      var t = Ip(e);
      if (t && t.has(i)) return t.get(i);
      var r = {},
        n = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var a in i)
        if (a !== 'default' && Object.prototype.hasOwnProperty.call(i, a)) {
          var s = n ? Object.getOwnPropertyDescriptor(i, a) : null;
          s && (s.get || s.set)
            ? Object.defineProperty(r, a, s)
            : (r[a] = i[a]);
        }
      return (r.default = i), t && t.set(i, r), r;
    }
    function SS(i) {
      return i && i.__esModule ? i : { default: i };
    }
    var qa = function (e) {
      return new vS.default(e);
    };
    Object.assign(qa, xS);
    delete qa.__esModule;
    var CS = qa;
    Gr.default = CS;
    qp.exports = Gr.default;
  });
  function Ge(i) {
    return ['fontSize', 'outline'].includes(i)
      ? (e) => (
          typeof e == 'function' && (e = e({})),
          Array.isArray(e) && (e = e[0]),
          e
        )
      : i === 'fontFamily'
      ? (e) => {
          typeof e == 'function' && (e = e({}));
          let t = Array.isArray(e) && ie(e[1]) ? e[0] : e;
          return Array.isArray(t) ? t.join(', ') : t;
        }
      : [
          'boxShadow',
          'transitionProperty',
          'transitionDuration',
          'transitionDelay',
          'transitionTimingFunction',
          'backgroundImage',
          'backgroundSize',
          'backgroundColor',
          'cursor',
          'animation',
        ].includes(i)
      ? (e) => (
          typeof e == 'function' && (e = e({})),
          Array.isArray(e) && (e = e.join(', ')),
          e
        )
      : ['gridTemplateColumns', 'gridTemplateRows', 'objectPosition'].includes(
          i,
        )
      ? (e) => (
          typeof e == 'function' && (e = e({})),
          typeof e == 'string' && (e = z.list.comma(e).join(' ')),
          e
        )
      : (e, t = {}) => (typeof e == 'function' && (e = e(t)), e);
  }
  var Hr = C(() => {
    l();
    nt();
    xt();
  });
  var $p = v((EP, Na) => {
    l();
    var { Rule: Rp, AtRule: AS } = me(),
      Mp = Me();
    function Ra(i, e) {
      let t;
      try {
        Mp((r) => {
          t = r;
        }).processSync(i);
      } catch (r) {
        throw i.includes(':')
          ? e
            ? e.error('Missed semicolon')
            : r
          : e
          ? e.error(r.message)
          : r;
      }
      return t.at(0);
    }
    function Bp(i, e) {
      let t = !1;
      return (
        i.each((r) => {
          if (r.type === 'nesting') {
            let n = e.clone({});
            r.value !== '&'
              ? r.replaceWith(Ra(r.value.replace('&', n.toString())))
              : r.replaceWith(n),
              (t = !0);
          } else 'nodes' in r && r.nodes && Bp(r, e) && (t = !0);
        }),
        t
      );
    }
    function Fp(i, e) {
      let t = [];
      return (
        i.selectors.forEach((r) => {
          let n = Ra(r, i);
          e.selectors.forEach((a) => {
            if (!a) return;
            let s = Ra(a, e);
            Bp(s, n) ||
              (s.prepend(Mp.combinator({ value: ' ' })),
              s.prepend(n.clone({}))),
              t.push(s.toString());
          });
        }),
        t
      );
    }
    function on(i, e) {
      let t = i.prev();
      for (e.after(i); t && t.type === 'comment'; ) {
        let r = t.prev();
        e.after(t), (t = r);
      }
      return i;
    }
    function _S(i) {
      return function e(t, r, n, a = n) {
        let s = [];
        if (
          (r.each((o) => {
            o.type === 'rule' && n
              ? a && (o.selectors = Fp(t, o))
              : o.type === 'atrule' && o.nodes
              ? i[o.name]
                ? e(t, o, a)
                : r[Ba] !== !1 && s.push(o)
              : s.push(o);
          }),
          n && s.length)
        ) {
          let o = t.clone({ nodes: [] });
          for (let u of s) o.append(u);
          r.prepend(o);
        }
      };
    }
    function Ma(i, e, t) {
      let r = new Rp({ selector: i, nodes: [] });
      return r.append(e), t.after(r), r;
    }
    function Np(i, e) {
      let t = {};
      for (let r of i) t[r] = !0;
      if (e) for (let r of e) t[r.replace(/^@/, '')] = !0;
      return t;
    }
    function ES(i) {
      i = i.trim();
      let e = i.match(/^\((.*)\)$/);
      if (!e) return { type: 'basic', selector: i };
      let t = e[1].match(/^(with(?:out)?):(.+)$/);
      if (t) {
        let r = t[1] === 'with',
          n = Object.fromEntries(
            t[2]
              .trim()
              .split(/\s+/)
              .map((s) => [s, !0]),
          );
        if (r && n.all) return { type: 'noop' };
        let a = (s) => !!n[s];
        return (
          n.all ? (a = () => !0) : r && (a = (s) => (s === 'all' ? !1 : !n[s])),
          { type: 'withrules', escapes: a }
        );
      }
      return { type: 'unknown' };
    }
    function OS(i) {
      let e = [],
        t = i.parent;
      for (; t && t instanceof AS; ) e.push(t), (t = t.parent);
      return e;
    }
    function TS(i) {
      let e = i[Lp];
      if (!e) i.after(i.nodes);
      else {
        let t = i.nodes,
          r,
          n = -1,
          a,
          s,
          o,
          u = OS(i);
        if (
          (u.forEach((c, f) => {
            if (e(c.name)) (r = c), (n = f), (s = o);
            else {
              let p = o;
              (o = c.clone({ nodes: [] })), p && o.append(p), (a = a || o);
            }
          }),
          r ? (s ? (a.append(t), r.after(s)) : r.after(t)) : i.after(t),
          i.next() && r)
        ) {
          let c;
          u.slice(0, n + 1).forEach((f, p, d) => {
            let h = c;
            (c = f.clone({ nodes: [] })), h && c.append(h);
            let y = [],
              w = (d[p - 1] || i).next();
            for (; w; ) y.push(w), (w = w.next());
            c.append(y);
          }),
            c && (s || t[t.length - 1]).after(c);
        }
      }
      i.remove();
    }
    var Ba = Symbol('rootRuleMergeSel'),
      Lp = Symbol('rootRuleEscapes');
    function PS(i) {
      let { params: e } = i,
        { type: t, selector: r, escapes: n } = ES(e);
      if (t === 'unknown')
        throw i.error(`Unknown @${i.name} parameter ${JSON.stringify(e)}`);
      if (t === 'basic' && r) {
        let a = new Rp({ selector: r, nodes: i.nodes });
        i.removeAll(), i.append(a);
      }
      (i[Lp] = n), (i[Ba] = n ? !n('all') : t === 'noop');
    }
    var Fa = Symbol('hasRootRule');
    Na.exports = (i = {}) => {
      let e = Np(['media', 'supports', 'layer', 'container'], i.bubble),
        t = _S(e),
        r = Np(
          [
            'document',
            'font-face',
            'keyframes',
            '-webkit-keyframes',
            '-moz-keyframes',
          ],
          i.unwrap,
        ),
        n = (i.rootRuleName || 'at-root').replace(/^@/, ''),
        a = i.preserveEmpty;
      return {
        postcssPlugin: 'postcss-nested',
        Once(s) {
          s.walkAtRules(n, (o) => {
            PS(o), (s[Fa] = !0);
          });
        },
        Rule(s) {
          let o = !1,
            u = s,
            c = !1,
            f = [];
          s.each((p) => {
            p.type === 'rule'
              ? (f.length && ((u = Ma(s.selector, f, u)), (f = [])),
                (c = !0),
                (o = !0),
                (p.selectors = Fp(s, p)),
                (u = on(p, u)))
              : p.type === 'atrule'
              ? (f.length && ((u = Ma(s.selector, f, u)), (f = [])),
                p.name === n
                  ? ((o = !0), t(s, p, !0, p[Ba]), (u = on(p, u)))
                  : e[p.name]
                  ? ((c = !0), (o = !0), t(s, p, !0), (u = on(p, u)))
                  : r[p.name]
                  ? ((c = !0), (o = !0), t(s, p, !1), (u = on(p, u)))
                  : c && f.push(p))
              : p.type === 'decl' && c && f.push(p);
          }),
            f.length && (u = Ma(s.selector, f, u)),
            o &&
              a !== !0 &&
              ((s.raws.semicolon = !0), s.nodes.length === 0 && s.remove());
        },
        RootExit(s) {
          s[Fa] && (s.walkAtRules(n, TS), (s[Fa] = !1));
        },
      };
    };
    Na.exports.postcss = !0;
  });
  var Up = v((OP, Vp) => {
    l();
    ('use strict');
    var jp = /-(\w|$)/g,
      zp = (i, e) => e.toUpperCase(),
      DS = (i) => (
        (i = i.toLowerCase()),
        i === 'float'
          ? 'cssFloat'
          : i.startsWith('-ms-')
          ? i.substr(1).replace(jp, zp)
          : i.replace(jp, zp)
      );
    Vp.exports = DS;
  });
  var ja = v((TP, Wp) => {
    l();
    var IS = Up(),
      qS = {
        boxFlex: !0,
        boxFlexGroup: !0,
        columnCount: !0,
        flex: !0,
        flexGrow: !0,
        flexPositive: !0,
        flexShrink: !0,
        flexNegative: !0,
        fontWeight: !0,
        lineClamp: !0,
        lineHeight: !0,
        opacity: !0,
        order: !0,
        orphans: !0,
        tabSize: !0,
        widows: !0,
        zIndex: !0,
        zoom: !0,
        fillOpacity: !0,
        strokeDashoffset: !0,
        strokeOpacity: !0,
        strokeWidth: !0,
      };
    function La(i) {
      return typeof i.nodes == 'undefined' ? !0 : $a(i);
    }
    function $a(i) {
      let e,
        t = {};
      return (
        i.each((r) => {
          if (r.type === 'atrule')
            (e = '@' + r.name),
              r.params && (e += ' ' + r.params),
              typeof t[e] == 'undefined'
                ? (t[e] = La(r))
                : Array.isArray(t[e])
                ? t[e].push(La(r))
                : (t[e] = [t[e], La(r)]);
          else if (r.type === 'rule') {
            let n = $a(r);
            if (t[r.selector]) for (let a in n) t[r.selector][a] = n[a];
            else t[r.selector] = n;
          } else if (r.type === 'decl') {
            (r.prop[0] === '-' && r.prop[1] === '-') ||
            (r.parent && r.parent.selector === ':export')
              ? (e = r.prop)
              : (e = IS(r.prop));
            let n = r.value;
            !isNaN(r.value) && qS[e] && (n = parseFloat(r.value)),
              r.important && (n += ' !important'),
              typeof t[e] == 'undefined'
                ? (t[e] = n)
                : Array.isArray(t[e])
                ? t[e].push(n)
                : (t[e] = [t[e], n]);
          }
        }),
        t
      );
    }
    Wp.exports = $a;
  });
  var ln = v((PP, Qp) => {
    l();
    var Yr = me(),
      Gp = /\s*!important\s*$/i,
      RS = {
        'box-flex': !0,
        'box-flex-group': !0,
        'column-count': !0,
        flex: !0,
        'flex-grow': !0,
        'flex-positive': !0,
        'flex-shrink': !0,
        'flex-negative': !0,
        'font-weight': !0,
        'line-clamp': !0,
        'line-height': !0,
        opacity: !0,
        order: !0,
        orphans: !0,
        'tab-size': !0,
        widows: !0,
        'z-index': !0,
        zoom: !0,
        'fill-opacity': !0,
        'stroke-dashoffset': !0,
        'stroke-opacity': !0,
        'stroke-width': !0,
      };
    function MS(i) {
      return i
        .replace(/([A-Z])/g, '-$1')
        .replace(/^ms-/, '-ms-')
        .toLowerCase();
    }
    function Hp(i, e, t) {
      t === !1 ||
        t === null ||
        (e.startsWith('--') || (e = MS(e)),
        typeof t == 'number' &&
          (t === 0 || RS[e] ? (t = t.toString()) : (t += 'px')),
        e === 'css-float' && (e = 'float'),
        Gp.test(t)
          ? ((t = t.replace(Gp, '')),
            i.push(Yr.decl({ prop: e, value: t, important: !0 })))
          : i.push(Yr.decl({ prop: e, value: t })));
    }
    function Yp(i, e, t) {
      let r = Yr.atRule({ name: e[1], params: e[3] || '' });
      typeof t == 'object' && ((r.nodes = []), za(t, r)), i.push(r);
    }
    function za(i, e) {
      let t, r, n;
      for (t in i)
        if (((r = i[t]), !(r === null || typeof r == 'undefined')))
          if (t[0] === '@') {
            let a = t.match(/@(\S+)(\s+([\W\w]*)\s*)?/);
            if (Array.isArray(r)) for (let s of r) Yp(e, a, s);
            else Yp(e, a, r);
          } else if (Array.isArray(r)) for (let a of r) Hp(e, t, a);
          else
            typeof r == 'object'
              ? ((n = Yr.rule({ selector: t })), za(r, n), e.push(n))
              : Hp(e, t, r);
    }
    Qp.exports = function (i) {
      let e = Yr.root();
      return za(i, e), e;
    };
  });
  var Va = v((DP, Jp) => {
    l();
    var BS = ja();
    Jp.exports = function (e) {
      return (
        console &&
          console.warn &&
          e.warnings().forEach((t) => {
            let r = t.plugin || 'PostCSS';
            console.warn(r + ': ' + t.text);
          }),
        BS(e.root)
      );
    };
  });
  var Kp = v((IP, Xp) => {
    l();
    var FS = me(),
      NS = Va(),
      LS = ln();
    Xp.exports = function (e) {
      let t = FS(e);
      return async (r) => {
        let n = await t.process(r, { parser: LS, from: void 0 });
        return NS(n);
      };
    };
  });
  var ed = v((qP, Zp) => {
    l();
    var $S = me(),
      jS = Va(),
      zS = ln();
    Zp.exports = function (i) {
      let e = $S(i);
      return (t) => {
        let r = e.process(t, { parser: zS, from: void 0 });
        return jS(r);
      };
    };
  });
  var rd = v((RP, td) => {
    l();
    var VS = ja(),
      US = ln(),
      WS = Kp(),
      GS = ed();
    td.exports = { objectify: VS, parse: US, async: WS, sync: GS };
  });
  var It,
    id,
    MP,
    BP,
    FP,
    NP,
    nd = C(() => {
      l();
      (It = K(rd())),
        (id = It.default),
        (MP = It.default.objectify),
        (BP = It.default.parse),
        (FP = It.default.async),
        (NP = It.default.sync);
    });
  function qt(i) {
    return Array.isArray(i)
      ? i.flatMap(
          (e) =>
            z([(0, sd.default)({ bubble: ['screen'] })]).process(e, {
              parser: id,
            }).root.nodes,
        )
      : qt([i]);
  }
  var sd,
    Ua = C(() => {
      l();
      nt();
      sd = K($p());
      nd();
    });
  function Rt(i, e, t = !1) {
    if (i === '') return e;
    let r = typeof e == 'string' ? (0, ad.default)().astSync(e) : e;
    return (
      r.walkClasses((n) => {
        let a = n.value,
          s = t && a.startsWith('-');
        n.value = s ? `-${i}${a.slice(1)}` : `${i}${a}`;
      }),
      typeof e == 'string' ? r.toString() : r
    );
  }
  var ad,
    un = C(() => {
      l();
      ad = K(Me());
    });
  function ce(i) {
    let e = od.default.className();
    return (e.value = i), ht(e?.raws?.value ?? e.value);
  }
  var od,
    Mt = C(() => {
      l();
      od = K(Me());
      mi();
    });
  function Wa(i) {
    return ht(`.${ce(i)}`);
  }
  function fn(i, e) {
    return Wa(Qr(i, e));
  }
  function Qr(i, e) {
    return e === 'DEFAULT'
      ? i
      : e === '-' || e === '-DEFAULT'
      ? `-${i}`
      : e.startsWith('-')
      ? `-${i}${e}`
      : e.startsWith('/')
      ? `${i}${e}`
      : `${i}-${e}`;
  }
  var Ga = C(() => {
    l();
    Mt();
    mi();
  });
  function P(i, e = [[i, [i]]], { filterDefault: t = !1, ...r } = {}) {
    let n = Ge(i);
    return function ({ matchUtilities: a, theme: s }) {
      for (let o of e) {
        let u = Array.isArray(o[0]) ? o : [o];
        a(
          u.reduce(
            (c, [f, p]) =>
              Object.assign(c, {
                [f]: (d) =>
                  p.reduce(
                    (h, y) =>
                      Array.isArray(y)
                        ? Object.assign(h, { [y[0]]: y[1] })
                        : Object.assign(h, { [y]: n(d) }),
                    {},
                  ),
              }),
            {},
          ),
          {
            ...r,
            values: t
              ? Object.fromEntries(
                  Object.entries(s(i) ?? {}).filter(([c]) => c !== 'DEFAULT'),
                )
              : s(i),
          },
        );
      }
    };
  }
  var ld = C(() => {
    l();
    Hr();
  });
  function st(i) {
    return (
      (i = Array.isArray(i) ? i : [i]),
      i
        .map((e) => {
          let t = e.values.map((r) =>
            r.raw !== void 0
              ? r.raw
              : [
                  r.min && `(min-width: ${r.min})`,
                  r.max && `(max-width: ${r.max})`,
                ]
                  .filter(Boolean)
                  .join(' and '),
          );
          return e.not ? `not all and ${t}` : t;
        })
        .join(', ')
    );
  }
  var cn = C(() => {
    l();
  });
  function Ha(i) {
    return i.split(ZS).map((t) => {
      let r = t.trim(),
        n = { value: r },
        a = r.split(eC),
        s = new Set();
      for (let o of a)
        !s.has('DIRECTIONS') && HS.has(o)
          ? ((n.direction = o), s.add('DIRECTIONS'))
          : !s.has('PLAY_STATES') && YS.has(o)
          ? ((n.playState = o), s.add('PLAY_STATES'))
          : !s.has('FILL_MODES') && QS.has(o)
          ? ((n.fillMode = o), s.add('FILL_MODES'))
          : !s.has('ITERATION_COUNTS') && (JS.has(o) || tC.test(o))
          ? ((n.iterationCount = o), s.add('ITERATION_COUNTS'))
          : (!s.has('TIMING_FUNCTION') && XS.has(o)) ||
            (!s.has('TIMING_FUNCTION') && KS.some((u) => o.startsWith(`${u}(`)))
          ? ((n.timingFunction = o), s.add('TIMING_FUNCTION'))
          : !s.has('DURATION') && ud.test(o)
          ? ((n.duration = o), s.add('DURATION'))
          : !s.has('DELAY') && ud.test(o)
          ? ((n.delay = o), s.add('DELAY'))
          : s.has('NAME')
          ? (n.unknown || (n.unknown = []), n.unknown.push(o))
          : ((n.name = o), s.add('NAME'));
      return n;
    });
  }
  var HS,
    YS,
    QS,
    JS,
    XS,
    KS,
    ZS,
    eC,
    ud,
    tC,
    fd = C(() => {
      l();
      (HS = new Set(['normal', 'reverse', 'alternate', 'alternate-reverse'])),
        (YS = new Set(['running', 'paused'])),
        (QS = new Set(['none', 'forwards', 'backwards', 'both'])),
        (JS = new Set(['infinite'])),
        (XS = new Set([
          'linear',
          'ease',
          'ease-in',
          'ease-out',
          'ease-in-out',
          'step-start',
          'step-end',
        ])),
        (KS = ['cubic-bezier', 'steps']),
        (ZS = /\,(?![^(]*\))/g),
        (eC = /\ +(?![^(]*\))/g),
        (ud = /^(-?[\d.]+m?s)$/),
        (tC = /^(\d+)$/);
    });
  var cd,
    re,
    pd = C(() => {
      l();
      (cd = (i) =>
        Object.assign(
          {},
          ...Object.entries(i ?? {}).flatMap(([e, t]) =>
            typeof t == 'object'
              ? Object.entries(cd(t)).map(([r, n]) => ({
                  [e + (r === 'DEFAULT' ? '' : `-${r}`)]: n,
                }))
              : [{ [`${e}`]: t }],
          ),
        )),
        (re = cd);
    });
  var rC,
    Qa,
    iC,
    nC,
    sC,
    aC,
    oC,
    lC,
    uC,
    fC,
    cC,
    pC,
    dC,
    hC,
    mC,
    gC,
    yC,
    wC,
    Ja,
    Ya = C(() => {
      (rC = 'tailwindcss'),
        (Qa = '3.3.3'),
        (iC =
          'A utility-first CSS framework for rapidly building custom user interfaces.'),
        (nC = 'MIT'),
        (sC = 'lib/index.js'),
        (aC = 'types/index.d.ts'),
        (oC = 'https://github.com/tailwindlabs/tailwindcss.git'),
        (lC = 'https://github.com/tailwindlabs/tailwindcss/issues'),
        (uC = 'https://tailwindcss.com'),
        (fC = { tailwind: 'lib/cli.js', tailwindcss: 'lib/cli.js' }),
        (cC = { engine: 'stable' }),
        (pC = {
          prebuild: 'npm run generate && rimraf lib',
          build: `swc src --out-dir lib --copy-files --config jsc.transform.optimizer.globals.vars.__OXIDE__='"false"'`,
          postbuild:
            'esbuild lib/cli-peer-dependencies.js --bundle --platform=node --outfile=peers/index.js --define:process.env.CSS_TRANSFORMER_WASM=false',
          'rebuild-fixtures':
            'npm run build && node -r @swc/register scripts/rebuildFixtures.js',
          style: 'eslint .',
          pretest: 'npm run generate',
          test: 'jest',
          'test:integrations': 'npm run test --prefix ./integrations',
          'install:integrations': 'node scripts/install-integrations.js',
          'generate:plugin-list':
            'node -r @swc/register scripts/create-plugin-list.js',
          'generate:types': 'node -r @swc/register scripts/generate-types.js',
          generate: 'npm run generate:plugin-list && npm run generate:types',
          'release-channel': 'node ./scripts/release-channel.js',
          'release-notes': 'node ./scripts/release-notes.js',
          prepublishOnly: 'npm install --force && npm run build',
        }),
        (dC = [
          'src/*',
          'cli/*',
          'lib/*',
          'peers/*',
          'scripts/*.js',
          'stubs/*',
          'nesting/*',
          'types/**/*',
          '*.d.ts',
          '*.css',
          '*.js',
        ]),
        (hC = {
          '@swc/cli': '^0.1.62',
          '@swc/core': '^1.3.55',
          '@swc/jest': '^0.2.26',
          '@swc/register': '^0.1.10',
          autoprefixer: '^10.4.14',
          browserslist: '^4.21.5',
          concurrently: '^8.0.1',
          cssnano: '^6.0.0',
          esbuild: '^0.17.18',
          eslint: '^8.39.0',
          'eslint-config-prettier': '^8.8.0',
          'eslint-plugin-prettier': '^4.2.1',
          jest: '^29.5.0',
          'jest-diff': '^29.5.0',
          lightningcss: '1.18.0',
          prettier: '^2.8.8',
          rimraf: '^5.0.0',
          'source-map-js': '^1.0.2',
          turbo: '^1.9.3',
        }),
        (mC = {
          '@alloc/quick-lru': '^5.2.0',
          arg: '^5.0.2',
          chokidar: '^3.5.3',
          didyoumean: '^1.2.2',
          dlv: '^1.1.3',
          'fast-glob': '^3.2.12',
          'glob-parent': '^6.0.2',
          'is-glob': '^4.0.3',
          jiti: '^1.18.2',
          lilconfig: '^2.1.0',
          micromatch: '^4.0.5',
          'normalize-path': '^3.0.0',
          'object-hash': '^3.0.0',
          picocolors: '^1.0.0',
          postcss: '^8.4.23',
          'postcss-import': '^15.1.0',
          'postcss-js': '^4.0.1',
          'postcss-load-config': '^4.0.1',
          'postcss-nested': '^6.0.1',
          'postcss-selector-parser': '^6.0.11',
          resolve: '^1.22.2',
          sucrase: '^3.32.0',
        }),
        (gC = ['> 1%', 'not edge <= 18', 'not ie 11', 'not op_mini all']),
        (yC = {
          testTimeout: 3e4,
          setupFilesAfterEnv: ['<rootDir>/jest/customMatchers.js'],
          testPathIgnorePatterns: [
            '/node_modules/',
            '/integrations/',
            '/standalone-cli/',
            '\\.test\\.skip\\.js$',
          ],
          transformIgnorePatterns: ['node_modules/(?!lightningcss)'],
          transform: { '\\.js$': '@swc/jest', '\\.ts$': '@swc/jest' },
        }),
        (wC = { node: '>=14.0.0' }),
        (Ja = {
          name: rC,
          version: Qa,
          description: iC,
          license: nC,
          main: sC,
          types: aC,
          repository: oC,
          bugs: lC,
          homepage: uC,
          bin: fC,
          tailwindcss: cC,
          scripts: pC,
          files: dC,
          devDependencies: hC,
          dependencies: mC,
          browserslist: gC,
          jest: yC,
          engines: wC,
        });
    });
  function at(i, e = !0) {
    return Array.isArray(i)
      ? i.map((t) => {
          if (e && Array.isArray(t))
            throw new Error('The tuple syntax is not supported for `screens`.');
          if (typeof t == 'string')
            return {
              name: t.toString(),
              not: !1,
              values: [{ min: t, max: void 0 }],
            };
          let [r, n] = t;
          return (
            (r = r.toString()),
            typeof n == 'string'
              ? { name: r, not: !1, values: [{ min: n, max: void 0 }] }
              : Array.isArray(n)
              ? { name: r, not: !1, values: n.map((a) => hd(a)) }
              : { name: r, not: !1, values: [hd(n)] }
          );
        })
      : at(Object.entries(i ?? {}), !1);
  }
  function pn(i) {
    return i.values.length !== 1
      ? { result: !1, reason: 'multiple-values' }
      : i.values[0].raw !== void 0
      ? { result: !1, reason: 'raw-values' }
      : i.values[0].min !== void 0 && i.values[0].max !== void 0
      ? { result: !1, reason: 'min-and-max' }
      : { result: !0, reason: null };
  }
  function dd(i, e, t) {
    let r = dn(e, i),
      n = dn(t, i),
      a = pn(r),
      s = pn(n);
    if (a.reason === 'multiple-values' || s.reason === 'multiple-values')
      throw new Error(
        'Attempted to sort a screen with multiple values. This should never happen. Please open a bug report.',
      );
    if (a.reason === 'raw-values' || s.reason === 'raw-values')
      throw new Error(
        'Attempted to sort a screen with raw values. This should never happen. Please open a bug report.',
      );
    if (a.reason === 'min-and-max' || s.reason === 'min-and-max')
      throw new Error(
        'Attempted to sort a screen with both min and max values. This should never happen. Please open a bug report.',
      );
    let { min: o, max: u } = r.values[0],
      { min: c, max: f } = n.values[0];
    e.not && ([o, u] = [u, o]),
      t.not && ([c, f] = [f, c]),
      (o = o === void 0 ? o : parseFloat(o)),
      (u = u === void 0 ? u : parseFloat(u)),
      (c = c === void 0 ? c : parseFloat(c)),
      (f = f === void 0 ? f : parseFloat(f));
    let [p, d] = i === 'min' ? [o, c] : [f, u];
    return p - d;
  }
  function dn(i, e) {
    return typeof i == 'object'
      ? i
      : { name: 'arbitrary-screen', values: [{ [e]: i }] };
  }
  function hd({ 'min-width': i, min: e = i, max: t, raw: r } = {}) {
    return { min: e, max: t, raw: r };
  }
  var hn = C(() => {
    l();
  });
  function mn(i, e) {
    i.walkDecls((t) => {
      if (e.includes(t.prop)) {
        t.remove();
        return;
      }
      for (let r of e)
        t.value.includes(`/ var(${r})`) &&
          (t.value = t.value.replace(`/ var(${r})`, ''));
    });
  }
  var md = C(() => {
    l();
  });
  var pe,
    Te,
    Be,
    Fe,
    gd,
    yd = C(() => {
      l();
      ze();
      mt();
      nt();
      ld();
      cn();
      Mt();
      fd();
      pd();
      ar();
      ds();
      xt();
      Hr();
      Ya();
      Ee();
      hn();
      as();
      md();
      De();
      fr();
      Xr();
      (pe = {
        pseudoElementVariants: ({ addVariant: i }) => {
          i('first-letter', '&::first-letter'),
            i('first-line', '&::first-line'),
            i('marker', [
              ({ container: e }) => (
                mn(e, ['--tw-text-opacity']), '& *::marker'
              ),
              ({ container: e }) => (mn(e, ['--tw-text-opacity']), '&::marker'),
            ]),
            i('selection', ['& *::selection', '&::selection']),
            i('file', '&::file-selector-button'),
            i('placeholder', '&::placeholder'),
            i('backdrop', '&::backdrop'),
            i(
              'before',
              ({ container: e }) => (
                e.walkRules((t) => {
                  let r = !1;
                  t.walkDecls('content', () => {
                    r = !0;
                  }),
                    r ||
                      t.prepend(
                        z.decl({ prop: 'content', value: 'var(--tw-content)' }),
                      );
                }),
                '&::before'
              ),
            ),
            i(
              'after',
              ({ container: e }) => (
                e.walkRules((t) => {
                  let r = !1;
                  t.walkDecls('content', () => {
                    r = !0;
                  }),
                    r ||
                      t.prepend(
                        z.decl({ prop: 'content', value: 'var(--tw-content)' }),
                      );
                }),
                '&::after'
              ),
            );
        },
        pseudoClassVariants: ({
          addVariant: i,
          matchVariant: e,
          config: t,
          prefix: r,
        }) => {
          let n = [
            ['first', '&:first-child'],
            ['last', '&:last-child'],
            ['only', '&:only-child'],
            ['odd', '&:nth-child(odd)'],
            ['even', '&:nth-child(even)'],
            'first-of-type',
            'last-of-type',
            'only-of-type',
            [
              'visited',
              ({ container: s }) => (
                mn(s, [
                  '--tw-text-opacity',
                  '--tw-border-opacity',
                  '--tw-bg-opacity',
                ]),
                '&:visited'
              ),
            ],
            'target',
            ['open', '&[open]'],
            'default',
            'checked',
            'indeterminate',
            'placeholder-shown',
            'autofill',
            'optional',
            'required',
            'valid',
            'invalid',
            'in-range',
            'out-of-range',
            'read-only',
            'empty',
            'focus-within',
            [
              'hover',
              J(t(), 'hoverOnlyWhenSupported')
                ? '@media (hover: hover) and (pointer: fine) { &:hover }'
                : '&:hover',
            ],
            'focus',
            'focus-visible',
            'active',
            'enabled',
            'disabled',
          ].map((s) => (Array.isArray(s) ? s : [s, `&:${s}`]));
          for (let [s, o] of n)
            i(s, (u) => (typeof o == 'function' ? o(u) : o));
          let a = {
            group: (s, { modifier: o }) =>
              o
                ? [`:merge(${r('.group')}\\/${ce(o)})`, ' &']
                : [`:merge(${r('.group')})`, ' &'],
            peer: (s, { modifier: o }) =>
              o
                ? [`:merge(${r('.peer')}\\/${ce(o)})`, ' ~ &']
                : [`:merge(${r('.peer')})`, ' ~ &'],
          };
          for (let [s, o] of Object.entries(a))
            e(
              s,
              (u = '', c) => {
                let f = U(typeof u == 'function' ? u(c) : u);
                f.includes('&') || (f = '&' + f);
                let [p, d] = o('', c),
                  h = null,
                  y = null,
                  x = 0;
                for (let w = 0; w < f.length; ++w) {
                  let b = f[w];
                  b === '&'
                    ? (h = w)
                    : b === "'" || b === '"'
                    ? (x += 1)
                    : h !== null && b === ' ' && !x && (y = w);
                }
                return (
                  h !== null && y === null && (y = f.length),
                  f.slice(0, h) + p + f.slice(h + 1, y) + d + f.slice(y)
                );
              },
              { values: Object.fromEntries(n), [Jr]: { respectPrefix: !1 } },
            );
        },
        directionVariants: ({ addVariant: i }) => {
          i('ltr', ':is([dir="ltr"] &)'), i('rtl', ':is([dir="rtl"] &)');
        },
        reducedMotionVariants: ({ addVariant: i }) => {
          i('motion-safe', '@media (prefers-reduced-motion: no-preference)'),
            i('motion-reduce', '@media (prefers-reduced-motion: reduce)');
        },
        darkVariants: ({ config: i, addVariant: e }) => {
          let [t, r = '.dark'] = [].concat(i('darkMode', 'media'));
          t === !1 &&
            ((t = 'media'),
            F.warn('darkmode-false', [
              'The `darkMode` option in your Tailwind CSS configuration is set to `false`, which now behaves the same as `media`.',
              'Change `darkMode` to `media` or remove it entirely.',
              'https://tailwindcss.com/docs/upgrade-guide#remove-dark-mode-configuration',
            ])),
            t === 'class'
              ? e('dark', `:is(${r} &)`)
              : t === 'media' &&
                e('dark', '@media (prefers-color-scheme: dark)');
        },
        printVariant: ({ addVariant: i }) => {
          i('print', '@media print');
        },
        screenVariants: ({ theme: i, addVariant: e, matchVariant: t }) => {
          let r = i('screens') ?? {},
            n = Object.values(r).every((b) => typeof b == 'string'),
            a = at(i('screens')),
            s = new Set([]);
          function o(b) {
            return b.match(/(\D+)$/)?.[1] ?? '(none)';
          }
          function u(b) {
            b !== void 0 && s.add(o(b));
          }
          function c(b) {
            return u(b), s.size === 1;
          }
          for (let b of a) for (let k of b.values) u(k.min), u(k.max);
          let f = s.size <= 1;
          function p(b) {
            return Object.fromEntries(
              a
                .filter((k) => pn(k).result)
                .map((k) => {
                  let { min: S, max: _ } = k.values[0];
                  if (b === 'min' && S !== void 0) return k;
                  if (b === 'min' && _ !== void 0) return { ...k, not: !k.not };
                  if (b === 'max' && _ !== void 0) return k;
                  if (b === 'max' && S !== void 0) return { ...k, not: !k.not };
                })
                .map((k) => [k.name, k]),
            );
          }
          function d(b) {
            return (k, S) => dd(b, k.value, S.value);
          }
          let h = d('max'),
            y = d('min');
          function x(b) {
            return (k) => {
              if (n)
                if (f) {
                  if (typeof k == 'string' && !c(k))
                    return (
                      F.warn('minmax-have-mixed-units', [
                        'The `min-*` and `max-*` variants are not supported with a `screens` configuration containing mixed units.',
                      ]),
                      []
                    );
                } else
                  return (
                    F.warn('mixed-screen-units', [
                      'The `min-*` and `max-*` variants are not supported with a `screens` configuration containing mixed units.',
                    ]),
                    []
                  );
              else
                return (
                  F.warn('complex-screen-config', [
                    'The `min-*` and `max-*` variants are not supported with a `screens` configuration containing objects.',
                  ]),
                  []
                );
              return [`@media ${st(dn(k, b))}`];
            };
          }
          t('max', x('max'), { sort: h, values: n ? p('max') : {} });
          let w = 'min-screens';
          for (let b of a)
            e(b.name, `@media ${st(b)}`, {
              id: w,
              sort: n && f ? y : void 0,
              value: b,
            });
          t('min', x('min'), { id: w, sort: y });
        },
        supportsVariants: ({ matchVariant: i, theme: e }) => {
          i(
            'supports',
            (t = '') => {
              let r = U(t),
                n = /^\w*\s*\(/.test(r);
              return (
                (r = n ? r.replace(/\b(and|or|not)\b/g, ' $1 ') : r),
                n
                  ? `@supports ${r}`
                  : (r.includes(':') || (r = `${r}: var(--tw)`),
                    (r.startsWith('(') && r.endsWith(')')) || (r = `(${r})`),
                    `@supports ${r}`)
              );
            },
            { values: e('supports') ?? {} },
          );
        },
        ariaVariants: ({ matchVariant: i, theme: e }) => {
          i('aria', (t) => `&[aria-${U(t)}]`, { values: e('aria') ?? {} }),
            i(
              'group-aria',
              (t, { modifier: r }) =>
                r
                  ? `:merge(.group\\/${r})[aria-${U(t)}] &`
                  : `:merge(.group)[aria-${U(t)}] &`,
              { values: e('aria') ?? {} },
            ),
            i(
              'peer-aria',
              (t, { modifier: r }) =>
                r
                  ? `:merge(.peer\\/${r})[aria-${U(t)}] ~ &`
                  : `:merge(.peer)[aria-${U(t)}] ~ &`,
              { values: e('aria') ?? {} },
            );
        },
        dataVariants: ({ matchVariant: i, theme: e }) => {
          i('data', (t) => `&[data-${U(t)}]`, { values: e('data') ?? {} }),
            i(
              'group-data',
              (t, { modifier: r }) =>
                r
                  ? `:merge(.group\\/${r})[data-${U(t)}] &`
                  : `:merge(.group)[data-${U(t)}] &`,
              { values: e('data') ?? {} },
            ),
            i(
              'peer-data',
              (t, { modifier: r }) =>
                r
                  ? `:merge(.peer\\/${r})[data-${U(t)}] ~ &`
                  : `:merge(.peer)[data-${U(t)}] ~ &`,
              { values: e('data') ?? {} },
            );
        },
        orientationVariants: ({ addVariant: i }) => {
          i('portrait', '@media (orientation: portrait)'),
            i('landscape', '@media (orientation: landscape)');
        },
        prefersContrastVariants: ({ addVariant: i }) => {
          i('contrast-more', '@media (prefers-contrast: more)'),
            i('contrast-less', '@media (prefers-contrast: less)');
        },
      }),
        (Te = [
          'translate(var(--tw-translate-x), var(--tw-translate-y))',
          'rotate(var(--tw-rotate))',
          'skewX(var(--tw-skew-x))',
          'skewY(var(--tw-skew-y))',
          'scaleX(var(--tw-scale-x))',
          'scaleY(var(--tw-scale-y))',
        ].join(' ')),
        (Be = [
          'var(--tw-blur)',
          'var(--tw-brightness)',
          'var(--tw-contrast)',
          'var(--tw-grayscale)',
          'var(--tw-hue-rotate)',
          'var(--tw-invert)',
          'var(--tw-saturate)',
          'var(--tw-sepia)',
          'var(--tw-drop-shadow)',
        ].join(' ')),
        (Fe = [
          'var(--tw-backdrop-blur)',
          'var(--tw-backdrop-brightness)',
          'var(--tw-backdrop-contrast)',
          'var(--tw-backdrop-grayscale)',
          'var(--tw-backdrop-hue-rotate)',
          'var(--tw-backdrop-invert)',
          'var(--tw-backdrop-opacity)',
          'var(--tw-backdrop-saturate)',
          'var(--tw-backdrop-sepia)',
        ].join(' ')),
        (gd = {
          preflight: ({ addBase: i }) => {
            let e = z.parse(
              `*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:theme('borderColor.DEFAULT', currentColor)}::after,::before{--tw-content:''}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:theme('fontFamily.sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji");font-feature-settings:theme('fontFamily.sans[1].fontFeatureSettings', normal);font-variation-settings:theme('fontFamily.sans[1].fontVariationSettings', normal)}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:theme('fontFamily.mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace);font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:theme('colors.gray.4', #9ca3af)}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}`,
            );
            i([
              z.comment({
                text: `! tailwindcss v${Qa} | MIT License | https://tailwindcss.com`,
              }),
              ...e.nodes,
            ]);
          },
          container: (() => {
            function i(t = []) {
              return t
                .flatMap((r) => r.values.map((n) => n.min))
                .filter((r) => r !== void 0);
            }
            function e(t, r, n) {
              if (typeof n == 'undefined') return [];
              if (!(typeof n == 'object' && n !== null))
                return [{ screen: 'DEFAULT', minWidth: 0, padding: n }];
              let a = [];
              n.DEFAULT &&
                a.push({ screen: 'DEFAULT', minWidth: 0, padding: n.DEFAULT });
              for (let s of t)
                for (let o of r)
                  for (let { min: u } of o.values)
                    u === s && a.push({ minWidth: s, padding: n[o.name] });
              return a;
            }
            return function ({ addComponents: t, theme: r }) {
              let n = at(r('container.screens', r('screens'))),
                a = i(n),
                s = e(a, n, r('container.padding')),
                o = (c) => {
                  let f = s.find((p) => p.minWidth === c);
                  return f
                    ? { paddingRight: f.padding, paddingLeft: f.padding }
                    : {};
                },
                u = Array.from(
                  new Set(a.slice().sort((c, f) => parseInt(c) - parseInt(f))),
                ).map((c) => ({
                  [`@media (min-width: ${c})`]: {
                    '.container': { 'max-width': c, ...o(c) },
                  },
                }));
              t([
                {
                  '.container': Object.assign(
                    { width: '100%' },
                    r('container.center', !1)
                      ? { marginRight: 'auto', marginLeft: 'auto' }
                      : {},
                    o(0),
                  ),
                },
                ...u,
              ]);
            };
          })(),
          accessibility: ({ addUtilities: i }) => {
            i({
              '.sr-only': {
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: '0',
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                borderWidth: '0',
              },
              '.not-sr-only': {
                position: 'static',
                width: 'auto',
                height: 'auto',
                padding: '0',
                margin: '0',
                overflow: 'visible',
                clip: 'auto',
                whiteSpace: 'normal',
              },
            });
          },
          pointerEvents: ({ addUtilities: i }) => {
            i({
              '.pointer-events-none': { 'pointer-events': 'none' },
              '.pointer-events-auto': { 'pointer-events': 'auto' },
            });
          },
          visibility: ({ addUtilities: i }) => {
            i({
              '.visible': { visibility: 'visible' },
              '.invisible': { visibility: 'hidden' },
              '.collapse': { visibility: 'collapse' },
            });
          },
          position: ({ addUtilities: i }) => {
            i({
              '.static': { position: 'static' },
              '.fixed': { position: 'fixed' },
              '.absolute': { position: 'absolute' },
              '.relative': { position: 'relative' },
              '.sticky': { position: 'sticky' },
            });
          },
          inset: P(
            'inset',
            [
              ['inset', ['inset']],
              [
                ['inset-x', ['left', 'right']],
                ['inset-y', ['top', 'bottom']],
              ],
              [
                ['start', ['inset-inline-start']],
                ['end', ['inset-inline-end']],
                ['top', ['top']],
                ['right', ['right']],
                ['bottom', ['bottom']],
                ['left', ['left']],
              ],
            ],
            { supportsNegativeValues: !0 },
          ),
          isolation: ({ addUtilities: i }) => {
            i({
              '.isolate': { isolation: 'isolate' },
              '.isolation-auto': { isolation: 'auto' },
            });
          },
          zIndex: P('zIndex', [['z', ['zIndex']]], {
            supportsNegativeValues: !0,
          }),
          order: P('order', void 0, { supportsNegativeValues: !0 }),
          gridColumn: P('gridColumn', [['col', ['gridColumn']]]),
          gridColumnStart: P('gridColumnStart', [
            ['col-start', ['gridColumnStart']],
          ]),
          gridColumnEnd: P('gridColumnEnd', [['col-end', ['gridColumnEnd']]]),
          gridRow: P('gridRow', [['row', ['gridRow']]]),
          gridRowStart: P('gridRowStart', [['row-start', ['gridRowStart']]]),
          gridRowEnd: P('gridRowEnd', [['row-end', ['gridRowEnd']]]),
          float: ({ addUtilities: i }) => {
            i({
              '.float-right': { float: 'right' },
              '.float-left': { float: 'left' },
              '.float-none': { float: 'none' },
            });
          },
          clear: ({ addUtilities: i }) => {
            i({
              '.clear-left': { clear: 'left' },
              '.clear-right': { clear: 'right' },
              '.clear-both': { clear: 'both' },
              '.clear-none': { clear: 'none' },
            });
          },
          margin: P(
            'margin',
            [
              ['m', ['margin']],
              [
                ['mx', ['margin-left', 'margin-right']],
                ['my', ['margin-top', 'margin-bottom']],
              ],
              [
                ['ms', ['margin-inline-start']],
                ['me', ['margin-inline-end']],
                ['mt', ['margin-top']],
                ['mr', ['margin-right']],
                ['mb', ['margin-bottom']],
                ['ml', ['margin-left']],
              ],
            ],
            { supportsNegativeValues: !0 },
          ),
          boxSizing: ({ addUtilities: i }) => {
            i({
              '.box-border': { 'box-sizing': 'border-box' },
              '.box-content': { 'box-sizing': 'content-box' },
            });
          },
          lineClamp: ({ matchUtilities: i, addUtilities: e, theme: t }) => {
            i(
              {
                'line-clamp': (r) => ({
                  overflow: 'hidden',
                  display: '-webkit-box',
                  '-webkit-box-orient': 'vertical',
                  '-webkit-line-clamp': `${r}`,
                }),
              },
              { values: t('lineClamp') },
            ),
              e({
                '.line-clamp-none': {
                  overflow: 'visible',
                  display: 'block',
                  '-webkit-box-orient': 'horizontal',
                  '-webkit-line-clamp': 'none',
                },
              });
          },
          display: ({ addUtilities: i }) => {
            i({
              '.block': { display: 'block' },
              '.inline-block': { display: 'inline-block' },
              '.inline': { display: 'inline' },
              '.flex': { display: 'flex' },
              '.inline-flex': { display: 'inline-flex' },
              '.table': { display: 'table' },
              '.inline-table': { display: 'inline-table' },
              '.table-caption': { display: 'table-caption' },
              '.table-cell': { display: 'table-cell' },
              '.table-column': { display: 'table-column' },
              '.table-column-group': { display: 'table-column-group' },
              '.table-footer-group': { display: 'table-footer-group' },
              '.table-header-group': { display: 'table-header-group' },
              '.table-row-group': { display: 'table-row-group' },
              '.table-row': { display: 'table-row' },
              '.flow-root': { display: 'flow-root' },
              '.grid': { display: 'grid' },
              '.inline-grid': { display: 'inline-grid' },
              '.contents': { display: 'contents' },
              '.list-item': { display: 'list-item' },
              '.hidden': { display: 'none' },
            });
          },
          aspectRatio: P('aspectRatio', [['aspect', ['aspect-ratio']]]),
          height: P('height', [['h', ['height']]]),
          maxHeight: P('maxHeight', [['max-h', ['maxHeight']]]),
          minHeight: P('minHeight', [['min-h', ['minHeight']]]),
          width: P('width', [['w', ['width']]]),
          minWidth: P('minWidth', [['min-w', ['minWidth']]]),
          maxWidth: P('maxWidth', [['max-w', ['maxWidth']]]),
          flex: P('flex'),
          flexShrink: P('flexShrink', [
            ['flex-shrink', ['flex-shrink']],
            ['shrink', ['flex-shrink']],
          ]),
          flexGrow: P('flexGrow', [
            ['flex-grow', ['flex-grow']],
            ['grow', ['flex-grow']],
          ]),
          flexBasis: P('flexBasis', [['basis', ['flex-basis']]]),
          tableLayout: ({ addUtilities: i }) => {
            i({
              '.table-auto': { 'table-layout': 'auto' },
              '.table-fixed': { 'table-layout': 'fixed' },
            });
          },
          captionSide: ({ addUtilities: i }) => {
            i({
              '.caption-top': { 'caption-side': 'top' },
              '.caption-bottom': { 'caption-side': 'bottom' },
            });
          },
          borderCollapse: ({ addUtilities: i }) => {
            i({
              '.border-collapse': { 'border-collapse': 'collapse' },
              '.border-separate': { 'border-collapse': 'separate' },
            });
          },
          borderSpacing: ({ addDefaults: i, matchUtilities: e, theme: t }) => {
            i('border-spacing', {
              '--tw-border-spacing-x': 0,
              '--tw-border-spacing-y': 0,
            }),
              e(
                {
                  'border-spacing': (r) => ({
                    '--tw-border-spacing-x': r,
                    '--tw-border-spacing-y': r,
                    '@defaults border-spacing': {},
                    'border-spacing':
                      'var(--tw-border-spacing-x) var(--tw-border-spacing-y)',
                  }),
                  'border-spacing-x': (r) => ({
                    '--tw-border-spacing-x': r,
                    '@defaults border-spacing': {},
                    'border-spacing':
                      'var(--tw-border-spacing-x) var(--tw-border-spacing-y)',
                  }),
                  'border-spacing-y': (r) => ({
                    '--tw-border-spacing-y': r,
                    '@defaults border-spacing': {},
                    'border-spacing':
                      'var(--tw-border-spacing-x) var(--tw-border-spacing-y)',
                  }),
                },
                { values: t('borderSpacing') },
              );
          },
          transformOrigin: P('transformOrigin', [
            ['origin', ['transformOrigin']],
          ]),
          translate: P(
            'translate',
            [
              [
                [
                  'translate-x',
                  [
                    ['@defaults transform', {}],
                    '--tw-translate-x',
                    ['transform', Te],
                  ],
                ],
                [
                  'translate-y',
                  [
                    ['@defaults transform', {}],
                    '--tw-translate-y',
                    ['transform', Te],
                  ],
                ],
              ],
            ],
            { supportsNegativeValues: !0 },
          ),
          rotate: P(
            'rotate',
            [
              [
                'rotate',
                [['@defaults transform', {}], '--tw-rotate', ['transform', Te]],
              ],
            ],
            { supportsNegativeValues: !0 },
          ),
          skew: P(
            'skew',
            [
              [
                [
                  'skew-x',
                  [
                    ['@defaults transform', {}],
                    '--tw-skew-x',
                    ['transform', Te],
                  ],
                ],
                [
                  'skew-y',
                  [
                    ['@defaults transform', {}],
                    '--tw-skew-y',
                    ['transform', Te],
                  ],
                ],
              ],
            ],
            { supportsNegativeValues: !0 },
          ),
          scale: P(
            'scale',
            [
              [
                'scale',
                [
                  ['@defaults transform', {}],
                  '--tw-scale-x',
                  '--tw-scale-y',
                  ['transform', Te],
                ],
              ],
              [
                [
                  'scale-x',
                  [
                    ['@defaults transform', {}],
                    '--tw-scale-x',
                    ['transform', Te],
                  ],
                ],
                [
                  'scale-y',
                  [
                    ['@defaults transform', {}],
                    '--tw-scale-y',
                    ['transform', Te],
                  ],
                ],
              ],
            ],
            { supportsNegativeValues: !0 },
          ),
          transform: ({ addDefaults: i, addUtilities: e }) => {
            i('transform', {
              '--tw-translate-x': '0',
              '--tw-translate-y': '0',
              '--tw-rotate': '0',
              '--tw-skew-x': '0',
              '--tw-skew-y': '0',
              '--tw-scale-x': '1',
              '--tw-scale-y': '1',
            }),
              e({
                '.transform': { '@defaults transform': {}, transform: Te },
                '.transform-cpu': { transform: Te },
                '.transform-gpu': {
                  transform: Te.replace(
                    'translate(var(--tw-translate-x), var(--tw-translate-y))',
                    'translate3d(var(--tw-translate-x), var(--tw-translate-y), 0)',
                  ),
                },
                '.transform-none': { transform: 'none' },
              });
          },
          animation: ({ matchUtilities: i, theme: e, config: t }) => {
            let r = (a) => ce(t('prefix') + a),
              n = Object.fromEntries(
                Object.entries(e('keyframes') ?? {}).map(([a, s]) => [
                  a,
                  { [`@keyframes ${r(a)}`]: s },
                ]),
              );
            i(
              {
                animate: (a) => {
                  let s = Ha(a);
                  return [
                    ...s.flatMap((o) => n[o.name]),
                    {
                      animation: s
                        .map(({ name: o, value: u }) =>
                          o === void 0 || n[o] === void 0
                            ? u
                            : u.replace(o, r(o)),
                        )
                        .join(', '),
                    },
                  ];
                },
              },
              { values: e('animation') },
            );
          },
          cursor: P('cursor'),
          touchAction: ({ addDefaults: i, addUtilities: e }) => {
            i('touch-action', {
              '--tw-pan-x': ' ',
              '--tw-pan-y': ' ',
              '--tw-pinch-zoom': ' ',
            });
            let t = 'var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom)';
            e({
              '.touch-auto': { 'touch-action': 'auto' },
              '.touch-none': { 'touch-action': 'none' },
              '.touch-pan-x': {
                '@defaults touch-action': {},
                '--tw-pan-x': 'pan-x',
                'touch-action': t,
              },
              '.touch-pan-left': {
                '@defaults touch-action': {},
                '--tw-pan-x': 'pan-left',
                'touch-action': t,
              },
              '.touch-pan-right': {
                '@defaults touch-action': {},
                '--tw-pan-x': 'pan-right',
                'touch-action': t,
              },
              '.touch-pan-y': {
                '@defaults touch-action': {},
                '--tw-pan-y': 'pan-y',
                'touch-action': t,
              },
              '.touch-pan-up': {
                '@defaults touch-action': {},
                '--tw-pan-y': 'pan-up',
                'touch-action': t,
              },
              '.touch-pan-down': {
                '@defaults touch-action': {},
                '--tw-pan-y': 'pan-down',
                'touch-action': t,
              },
              '.touch-pinch-zoom': {
                '@defaults touch-action': {},
                '--tw-pinch-zoom': 'pinch-zoom',
                'touch-action': t,
              },
              '.touch-manipulation': { 'touch-action': 'manipulation' },
            });
          },
          userSelect: ({ addUtilities: i }) => {
            i({
              '.select-none': { 'user-select': 'none' },
              '.select-text': { 'user-select': 'text' },
              '.select-all': { 'user-select': 'all' },
              '.select-auto': { 'user-select': 'auto' },
            });
          },
          resize: ({ addUtilities: i }) => {
            i({
              '.resize-none': { resize: 'none' },
              '.resize-y': { resize: 'vertical' },
              '.resize-x': { resize: 'horizontal' },
              '.resize': { resize: 'both' },
            });
          },
          scrollSnapType: ({ addDefaults: i, addUtilities: e }) => {
            i('scroll-snap-type', {
              '--tw-scroll-snap-strictness': 'proximity',
            }),
              e({
                '.snap-none': { 'scroll-snap-type': 'none' },
                '.snap-x': {
                  '@defaults scroll-snap-type': {},
                  'scroll-snap-type': 'x var(--tw-scroll-snap-strictness)',
                },
                '.snap-y': {
                  '@defaults scroll-snap-type': {},
                  'scroll-snap-type': 'y var(--tw-scroll-snap-strictness)',
                },
                '.snap-both': {
                  '@defaults scroll-snap-type': {},
                  'scroll-snap-type': 'both var(--tw-scroll-snap-strictness)',
                },
                '.snap-mandatory': {
                  '--tw-scroll-snap-strictness': 'mandatory',
                },
                '.snap-proximity': {
                  '--tw-scroll-snap-strictness': 'proximity',
                },
              });
          },
          scrollSnapAlign: ({ addUtilities: i }) => {
            i({
              '.snap-start': { 'scroll-snap-align': 'start' },
              '.snap-end': { 'scroll-snap-align': 'end' },
              '.snap-center': { 'scroll-snap-align': 'center' },
              '.snap-align-none': { 'scroll-snap-align': 'none' },
            });
          },
          scrollSnapStop: ({ addUtilities: i }) => {
            i({
              '.snap-normal': { 'scroll-snap-stop': 'normal' },
              '.snap-always': { 'scroll-snap-stop': 'always' },
            });
          },
          scrollMargin: P(
            'scrollMargin',
            [
              ['scroll-m', ['scroll-margin']],
              [
                ['scroll-mx', ['scroll-margin-left', 'scroll-margin-right']],
                ['scroll-my', ['scroll-margin-top', 'scroll-margin-bottom']],
              ],
              [
                ['scroll-ms', ['scroll-margin-inline-start']],
                ['scroll-me', ['scroll-margin-inline-end']],
                ['scroll-mt', ['scroll-margin-top']],
                ['scroll-mr', ['scroll-margin-right']],
                ['scroll-mb', ['scroll-margin-bottom']],
                ['scroll-ml', ['scroll-margin-left']],
              ],
            ],
            { supportsNegativeValues: !0 },
          ),
          scrollPadding: P('scrollPadding', [
            ['scroll-p', ['scroll-padding']],
            [
              ['scroll-px', ['scroll-padding-left', 'scroll-padding-right']],
              ['scroll-py', ['scroll-padding-top', 'scroll-padding-bottom']],
            ],
            [
              ['scroll-ps', ['scroll-padding-inline-start']],
              ['scroll-pe', ['scroll-padding-inline-end']],
              ['scroll-pt', ['scroll-padding-top']],
              ['scroll-pr', ['scroll-padding-right']],
              ['scroll-pb', ['scroll-padding-bottom']],
              ['scroll-pl', ['scroll-padding-left']],
            ],
          ]),
          listStylePosition: ({ addUtilities: i }) => {
            i({
              '.list-inside': { 'list-style-position': 'inside' },
              '.list-outside': { 'list-style-position': 'outside' },
            });
          },
          listStyleType: P('listStyleType', [['list', ['listStyleType']]]),
          listStyleImage: P('listStyleImage', [
            ['list-image', ['listStyleImage']],
          ]),
          appearance: ({ addUtilities: i }) => {
            i({ '.appearance-none': { appearance: 'none' } });
          },
          columns: P('columns', [['columns', ['columns']]]),
          breakBefore: ({ addUtilities: i }) => {
            i({
              '.break-before-auto': { 'break-before': 'auto' },
              '.break-before-avoid': { 'break-before': 'avoid' },
              '.break-before-all': { 'break-before': 'all' },
              '.break-before-avoid-page': { 'break-before': 'avoid-page' },
              '.break-before-page': { 'break-before': 'page' },
              '.break-before-left': { 'break-before': 'left' },
              '.break-before-right': { 'break-before': 'right' },
              '.break-before-column': { 'break-before': 'column' },
            });
          },
          breakInside: ({ addUtilities: i }) => {
            i({
              '.break-inside-auto': { 'break-inside': 'auto' },
              '.break-inside-avoid': { 'break-inside': 'avoid' },
              '.break-inside-avoid-page': { 'break-inside': 'avoid-page' },
              '.break-inside-avoid-column': { 'break-inside': 'avoid-column' },
            });
          },
          breakAfter: ({ addUtilities: i }) => {
            i({
              '.break-after-auto': { 'break-after': 'auto' },
              '.break-after-avoid': { 'break-after': 'avoid' },
              '.break-after-all': { 'break-after': 'all' },
              '.break-after-avoid-page': { 'break-after': 'avoid-page' },
              '.break-after-page': { 'break-after': 'page' },
              '.break-after-left': { 'break-after': 'left' },
              '.break-after-right': { 'break-after': 'right' },
              '.break-after-column': { 'break-after': 'column' },
            });
          },
          gridAutoColumns: P('gridAutoColumns', [
            ['auto-cols', ['gridAutoColumns']],
          ]),
          gridAutoFlow: ({ addUtilities: i }) => {
            i({
              '.grid-flow-row': { gridAutoFlow: 'row' },
              '.grid-flow-col': { gridAutoFlow: 'column' },
              '.grid-flow-dense': { gridAutoFlow: 'dense' },
              '.grid-flow-row-dense': { gridAutoFlow: 'row dense' },
              '.grid-flow-col-dense': { gridAutoFlow: 'column dense' },
            });
          },
          gridAutoRows: P('gridAutoRows', [['auto-rows', ['gridAutoRows']]]),
          gridTemplateColumns: P('gridTemplateColumns', [
            ['grid-cols', ['gridTemplateColumns']],
          ]),
          gridTemplateRows: P('gridTemplateRows', [
            ['grid-rows', ['gridTemplateRows']],
          ]),
          flexDirection: ({ addUtilities: i }) => {
            i({
              '.flex-row': { 'flex-direction': 'row' },
              '.flex-row-reverse': { 'flex-direction': 'row-reverse' },
              '.flex-col': { 'flex-direction': 'column' },
              '.flex-col-reverse': { 'flex-direction': 'column-reverse' },
            });
          },
          flexWrap: ({ addUtilities: i }) => {
            i({
              '.flex-wrap': { 'flex-wrap': 'wrap' },
              '.flex-wrap-reverse': { 'flex-wrap': 'wrap-reverse' },
              '.flex-nowrap': { 'flex-wrap': 'nowrap' },
            });
          },
          placeContent: ({ addUtilities: i }) => {
            i({
              '.place-content-center': { 'place-content': 'center' },
              '.place-content-start': { 'place-content': 'start' },
              '.place-content-end': { 'place-content': 'end' },
              '.place-content-between': { 'place-content': 'space-between' },
              '.place-content-around': { 'place-content': 'space-around' },
              '.place-content-evenly': { 'place-content': 'space-evenly' },
              '.place-content-baseline': { 'place-content': 'baseline' },
              '.place-content-stretch': { 'place-content': 'stretch' },
            });
          },
          placeItems: ({ addUtilities: i }) => {
            i({
              '.place-items-start': { 'place-items': 'start' },
              '.place-items-end': { 'place-items': 'end' },
              '.place-items-center': { 'place-items': 'center' },
              '.place-items-baseline': { 'place-items': 'baseline' },
              '.place-items-stretch': { 'place-items': 'stretch' },
            });
          },
          alignContent: ({ addUtilities: i }) => {
            i({
              '.content-normal': { 'align-content': 'normal' },
              '.content-center': { 'align-content': 'center' },
              '.content-start': { 'align-content': 'flex-start' },
              '.content-end': { 'align-content': 'flex-end' },
              '.content-between': { 'align-content': 'space-between' },
              '.content-around': { 'align-content': 'space-around' },
              '.content-evenly': { 'align-content': 'space-evenly' },
              '.content-baseline': { 'align-content': 'baseline' },
              '.content-stretch': { 'align-content': 'stretch' },
            });
          },
          alignItems: ({ addUtilities: i }) => {
            i({
              '.items-start': { 'align-items': 'flex-start' },
              '.items-end': { 'align-items': 'flex-end' },
              '.items-center': { 'align-items': 'center' },
              '.items-baseline': { 'align-items': 'baseline' },
              '.items-stretch': { 'align-items': 'stretch' },
            });
          },
          justifyContent: ({ addUtilities: i }) => {
            i({
              '.justify-normal': { 'justify-content': 'normal' },
              '.justify-start': { 'justify-content': 'flex-start' },
              '.justify-end': { 'justify-content': 'flex-end' },
              '.justify-center': { 'justify-content': 'center' },
              '.justify-between': { 'justify-content': 'space-between' },
              '.justify-around': { 'justify-content': 'space-around' },
              '.justify-evenly': { 'justify-content': 'space-evenly' },
              '.justify-stretch': { 'justify-content': 'stretch' },
            });
          },
          justifyItems: ({ addUtilities: i }) => {
            i({
              '.justify-items-start': { 'justify-items': 'start' },
              '.justify-items-end': { 'justify-items': 'end' },
              '.justify-items-center': { 'justify-items': 'center' },
              '.justify-items-stretch': { 'justify-items': 'stretch' },
            });
          },
          gap: P('gap', [
            ['gap', ['gap']],
            [
              ['gap-x', ['columnGap']],
              ['gap-y', ['rowGap']],
            ],
          ]),
          space: ({ matchUtilities: i, addUtilities: e, theme: t }) => {
            i(
              {
                'space-x': (r) => (
                  (r = r === '0' ? '0px' : r),
                  {
                    '& > :not([hidden]) ~ :not([hidden])': {
                      '--tw-space-x-reverse': '0',
                      'margin-right': `calc(${r} * var(--tw-space-x-reverse))`,
                      'margin-left': `calc(${r} * calc(1 - var(--tw-space-x-reverse)))`,
                    },
                  }
                ),
                'space-y': (r) => (
                  (r = r === '0' ? '0px' : r),
                  {
                    '& > :not([hidden]) ~ :not([hidden])': {
                      '--tw-space-y-reverse': '0',
                      'margin-top': `calc(${r} * calc(1 - var(--tw-space-y-reverse)))`,
                      'margin-bottom': `calc(${r} * var(--tw-space-y-reverse))`,
                    },
                  }
                ),
              },
              { values: t('space'), supportsNegativeValues: !0 },
            ),
              e({
                '.space-y-reverse > :not([hidden]) ~ :not([hidden])': {
                  '--tw-space-y-reverse': '1',
                },
                '.space-x-reverse > :not([hidden]) ~ :not([hidden])': {
                  '--tw-space-x-reverse': '1',
                },
              });
          },
          divideWidth: ({ matchUtilities: i, addUtilities: e, theme: t }) => {
            i(
              {
                'divide-x': (r) => (
                  (r = r === '0' ? '0px' : r),
                  {
                    '& > :not([hidden]) ~ :not([hidden])': {
                      '@defaults border-width': {},
                      '--tw-divide-x-reverse': '0',
                      'border-right-width': `calc(${r} * var(--tw-divide-x-reverse))`,
                      'border-left-width': `calc(${r} * calc(1 - var(--tw-divide-x-reverse)))`,
                    },
                  }
                ),
                'divide-y': (r) => (
                  (r = r === '0' ? '0px' : r),
                  {
                    '& > :not([hidden]) ~ :not([hidden])': {
                      '@defaults border-width': {},
                      '--tw-divide-y-reverse': '0',
                      'border-top-width': `calc(${r} * calc(1 - var(--tw-divide-y-reverse)))`,
                      'border-bottom-width': `calc(${r} * var(--tw-divide-y-reverse))`,
                    },
                  }
                ),
              },
              {
                values: t('divideWidth'),
                type: ['line-width', 'length', 'any'],
              },
            ),
              e({
                '.divide-y-reverse > :not([hidden]) ~ :not([hidden])': {
                  '@defaults border-width': {},
                  '--tw-divide-y-reverse': '1',
                },
                '.divide-x-reverse > :not([hidden]) ~ :not([hidden])': {
                  '@defaults border-width': {},
                  '--tw-divide-x-reverse': '1',
                },
              });
          },
          divideStyle: ({ addUtilities: i }) => {
            i({
              '.divide-solid > :not([hidden]) ~ :not([hidden])': {
                'border-style': 'solid',
              },
              '.divide-dashed > :not([hidden]) ~ :not([hidden])': {
                'border-style': 'dashed',
              },
              '.divide-dotted > :not([hidden]) ~ :not([hidden])': {
                'border-style': 'dotted',
              },
              '.divide-double > :not([hidden]) ~ :not([hidden])': {
                'border-style': 'double',
              },
              '.divide-none > :not([hidden]) ~ :not([hidden])': {
                'border-style': 'none',
              },
            });
          },
          divideColor: ({ matchUtilities: i, theme: e, corePlugins: t }) => {
            i(
              {
                divide: (r) =>
                  t('divideOpacity')
                    ? {
                        ['& > :not([hidden]) ~ :not([hidden])']: se({
                          color: r,
                          property: 'border-color',
                          variable: '--tw-divide-opacity',
                        }),
                      }
                    : {
                        ['& > :not([hidden]) ~ :not([hidden])']: {
                          'border-color': N(r),
                        },
                      },
              },
              {
                values: (({ DEFAULT: r, ...n }) => n)(re(e('divideColor'))),
                type: ['color', 'any'],
              },
            );
          },
          divideOpacity: ({ matchUtilities: i, theme: e }) => {
            i(
              {
                'divide-opacity': (t) => ({
                  ['& > :not([hidden]) ~ :not([hidden])']: {
                    '--tw-divide-opacity': t,
                  },
                }),
              },
              { values: e('divideOpacity') },
            );
          },
          placeSelf: ({ addUtilities: i }) => {
            i({
              '.place-self-auto': { 'place-self': 'auto' },
              '.place-self-start': { 'place-self': 'start' },
              '.place-self-end': { 'place-self': 'end' },
              '.place-self-center': { 'place-self': 'center' },
              '.place-self-stretch': { 'place-self': 'stretch' },
            });
          },
          alignSelf: ({ addUtilities: i }) => {
            i({
              '.self-auto': { 'align-self': 'auto' },
              '.self-start': { 'align-self': 'flex-start' },
              '.self-end': { 'align-self': 'flex-end' },
              '.self-center': { 'align-self': 'center' },
              '.self-stretch': { 'align-self': 'stretch' },
              '.self-baseline': { 'align-self': 'baseline' },
            });
          },
          justifySelf: ({ addUtilities: i }) => {
            i({
              '.justify-self-auto': { 'justify-self': 'auto' },
              '.justify-self-start': { 'justify-self': 'start' },
              '.justify-self-end': { 'justify-self': 'end' },
              '.justify-self-center': { 'justify-self': 'center' },
              '.justify-self-stretch': { 'justify-self': 'stretch' },
            });
          },
          overflow: ({ addUtilities: i }) => {
            i({
              '.overflow-auto': { overflow: 'auto' },
              '.overflow-hidden': { overflow: 'hidden' },
              '.overflow-clip': { overflow: 'clip' },
              '.overflow-visible': { overflow: 'visible' },
              '.overflow-scroll': { overflow: 'scroll' },
              '.overflow-x-auto': { 'overflow-x': 'auto' },
              '.overflow-y-auto': { 'overflow-y': 'auto' },
              '.overflow-x-hidden': { 'overflow-x': 'hidden' },
              '.overflow-y-hidden': { 'overflow-y': 'hidden' },
              '.overflow-x-clip': { 'overflow-x': 'clip' },
              '.overflow-y-clip': { 'overflow-y': 'clip' },
              '.overflow-x-visible': { 'overflow-x': 'visible' },
              '.overflow-y-visible': { 'overflow-y': 'visible' },
              '.overflow-x-scroll': { 'overflow-x': 'scroll' },
              '.overflow-y-scroll': { 'overflow-y': 'scroll' },
            });
          },
          overscrollBehavior: ({ addUtilities: i }) => {
            i({
              '.overscroll-auto': { 'overscroll-behavior': 'auto' },
              '.overscroll-contain': { 'overscroll-behavior': 'contain' },
              '.overscroll-none': { 'overscroll-behavior': 'none' },
              '.overscroll-y-auto': { 'overscroll-behavior-y': 'auto' },
              '.overscroll-y-contain': { 'overscroll-behavior-y': 'contain' },
              '.overscroll-y-none': { 'overscroll-behavior-y': 'none' },
              '.overscroll-x-auto': { 'overscroll-behavior-x': 'auto' },
              '.overscroll-x-contain': { 'overscroll-behavior-x': 'contain' },
              '.overscroll-x-none': { 'overscroll-behavior-x': 'none' },
            });
          },
          scrollBehavior: ({ addUtilities: i }) => {
            i({
              '.scroll-auto': { 'scroll-behavior': 'auto' },
              '.scroll-smooth': { 'scroll-behavior': 'smooth' },
            });
          },
          textOverflow: ({ addUtilities: i }) => {
            i({
              '.truncate': {
                overflow: 'hidden',
                'text-overflow': 'ellipsis',
                'white-space': 'nowrap',
              },
              '.overflow-ellipsis': { 'text-overflow': 'ellipsis' },
              '.text-ellipsis': { 'text-overflow': 'ellipsis' },
              '.text-clip': { 'text-overflow': 'clip' },
            });
          },
          hyphens: ({ addUtilities: i }) => {
            i({
              '.hyphens-none': { hyphens: 'none' },
              '.hyphens-manual': { hyphens: 'manual' },
              '.hyphens-auto': { hyphens: 'auto' },
            });
          },
          whitespace: ({ addUtilities: i }) => {
            i({
              '.whitespace-normal': { 'white-space': 'normal' },
              '.whitespace-nowrap': { 'white-space': 'nowrap' },
              '.whitespace-pre': { 'white-space': 'pre' },
              '.whitespace-pre-line': { 'white-space': 'pre-line' },
              '.whitespace-pre-wrap': { 'white-space': 'pre-wrap' },
              '.whitespace-break-spaces': { 'white-space': 'break-spaces' },
            });
          },
          wordBreak: ({ addUtilities: i }) => {
            i({
              '.break-normal': {
                'overflow-wrap': 'normal',
                'word-break': 'normal',
              },
              '.break-words': { 'overflow-wrap': 'break-word' },
              '.break-all': { 'word-break': 'break-all' },
              '.break-keep': { 'word-break': 'keep-all' },
            });
          },
          borderRadius: P('borderRadius', [
            ['rounded', ['border-radius']],
            [
              [
                'rounded-s',
                ['border-start-start-radius', 'border-end-start-radius'],
              ],
              [
                'rounded-e',
                ['border-start-end-radius', 'border-end-end-radius'],
              ],
              [
                'rounded-t',
                ['border-top-left-radius', 'border-top-right-radius'],
              ],
              [
                'rounded-r',
                ['border-top-right-radius', 'border-bottom-right-radius'],
              ],
              [
                'rounded-b',
                ['border-bottom-right-radius', 'border-bottom-left-radius'],
              ],
              [
                'rounded-l',
                ['border-top-left-radius', 'border-bottom-left-radius'],
              ],
            ],
            [
              ['rounded-ss', ['border-start-start-radius']],
              ['rounded-se', ['border-start-end-radius']],
              ['rounded-ee', ['border-end-end-radius']],
              ['rounded-es', ['border-end-start-radius']],
              ['rounded-tl', ['border-top-left-radius']],
              ['rounded-tr', ['border-top-right-radius']],
              ['rounded-br', ['border-bottom-right-radius']],
              ['rounded-bl', ['border-bottom-left-radius']],
            ],
          ]),
          borderWidth: P(
            'borderWidth',
            [
              ['border', [['@defaults border-width', {}], 'border-width']],
              [
                [
                  'border-x',
                  [
                    ['@defaults border-width', {}],
                    'border-left-width',
                    'border-right-width',
                  ],
                ],
                [
                  'border-y',
                  [
                    ['@defaults border-width', {}],
                    'border-top-width',
                    'border-bottom-width',
                  ],
                ],
              ],
              [
                [
                  'border-s',
                  [['@defaults border-width', {}], 'border-inline-start-width'],
                ],
                [
                  'border-e',
                  [['@defaults border-width', {}], 'border-inline-end-width'],
                ],
                [
                  'border-t',
                  [['@defaults border-width', {}], 'border-top-width'],
                ],
                [
                  'border-r',
                  [['@defaults border-width', {}], 'border-right-width'],
                ],
                [
                  'border-b',
                  [['@defaults border-width', {}], 'border-bottom-width'],
                ],
                [
                  'border-l',
                  [['@defaults border-width', {}], 'border-left-width'],
                ],
              ],
            ],
            { type: ['line-width', 'length'] },
          ),
          borderStyle: ({ addUtilities: i }) => {
            i({
              '.border-solid': { 'border-style': 'solid' },
              '.border-dashed': { 'border-style': 'dashed' },
              '.border-dotted': { 'border-style': 'dotted' },
              '.border-double': { 'border-style': 'double' },
              '.border-hidden': { 'border-style': 'hidden' },
              '.border-none': { 'border-style': 'none' },
            });
          },
          borderColor: ({ matchUtilities: i, theme: e, corePlugins: t }) => {
            i(
              {
                border: (r) =>
                  t('borderOpacity')
                    ? se({
                        color: r,
                        property: 'border-color',
                        variable: '--tw-border-opacity',
                      })
                    : { 'border-color': N(r) },
              },
              {
                values: (({ DEFAULT: r, ...n }) => n)(re(e('borderColor'))),
                type: ['color', 'any'],
              },
            ),
              i(
                {
                  'border-x': (r) =>
                    t('borderOpacity')
                      ? se({
                          color: r,
                          property: ['border-left-color', 'border-right-color'],
                          variable: '--tw-border-opacity',
                        })
                      : {
                          'border-left-color': N(r),
                          'border-right-color': N(r),
                        },
                  'border-y': (r) =>
                    t('borderOpacity')
                      ? se({
                          color: r,
                          property: ['border-top-color', 'border-bottom-color'],
                          variable: '--tw-border-opacity',
                        })
                      : {
                          'border-top-color': N(r),
                          'border-bottom-color': N(r),
                        },
                },
                {
                  values: (({ DEFAULT: r, ...n }) => n)(re(e('borderColor'))),
                  type: ['color', 'any'],
                },
              ),
              i(
                {
                  'border-s': (r) =>
                    t('borderOpacity')
                      ? se({
                          color: r,
                          property: 'border-inline-start-color',
                          variable: '--tw-border-opacity',
                        })
                      : { 'border-inline-start-color': N(r) },
                  'border-e': (r) =>
                    t('borderOpacity')
                      ? se({
                          color: r,
                          property: 'border-inline-end-color',
                          variable: '--tw-border-opacity',
                        })
                      : { 'border-inline-end-color': N(r) },
                  'border-t': (r) =>
                    t('borderOpacity')
                      ? se({
                          color: r,
                          property: 'border-top-color',
                          variable: '--tw-border-opacity',
                        })
                      : { 'border-top-color': N(r) },
                  'border-r': (r) =>
                    t('borderOpacity')
                      ? se({
                          color: r,
                          property: 'border-right-color',
                          variable: '--tw-border-opacity',
                        })
                      : { 'border-right-color': N(r) },
                  'border-b': (r) =>
                    t('borderOpacity')
                      ? se({
                          color: r,
                          property: 'border-bottom-color',
                          variable: '--tw-border-opacity',
                        })
                      : { 'border-bottom-color': N(r) },
                  'border-l': (r) =>
                    t('borderOpacity')
                      ? se({
                          color: r,
                          property: 'border-left-color',
                          variable: '--tw-border-opacity',
                        })
                      : { 'border-left-color': N(r) },
                },
                {
                  values: (({ DEFAULT: r, ...n }) => n)(re(e('borderColor'))),
                  type: ['color', 'any'],
                },
              );
          },
          borderOpacity: P('borderOpacity', [
            ['border-opacity', ['--tw-border-opacity']],
          ]),
          backgroundColor: ({
            matchUtilities: i,
            theme: e,
            corePlugins: t,
          }) => {
            i(
              {
                bg: (r) =>
                  t('backgroundOpacity')
                    ? se({
                        color: r,
                        property: 'background-color',
                        variable: '--tw-bg-opacity',
                      })
                    : { 'background-color': N(r) },
              },
              { values: re(e('backgroundColor')), type: ['color', 'any'] },
            );
          },
          backgroundOpacity: P('backgroundOpacity', [
            ['bg-opacity', ['--tw-bg-opacity']],
          ]),
          backgroundImage: P(
            'backgroundImage',
            [['bg', ['background-image']]],
            { type: ['lookup', 'image', 'url'] },
          ),
          gradientColorStops: (() => {
            function i(e) {
              return Ie(e, 0, 'rgb(255 255 255 / 0)');
            }
            return function ({ matchUtilities: e, theme: t, addDefaults: r }) {
              r('gradient-color-stops', {
                '--tw-gradient-from-position': ' ',
                '--tw-gradient-via-position': ' ',
                '--tw-gradient-to-position': ' ',
              });
              let n = {
                  values: re(t('gradientColorStops')),
                  type: ['color', 'any'],
                },
                a = {
                  values: t('gradientColorStopPositions'),
                  type: ['length', 'percentage'],
                };
              e(
                {
                  from: (s) => {
                    let o = i(s);
                    return {
                      '@defaults gradient-color-stops': {},
                      '--tw-gradient-from': `${N(
                        s,
                      )} var(--tw-gradient-from-position)`,
                      '--tw-gradient-to': `${o} var(--tw-gradient-to-position)`,
                      '--tw-gradient-stops':
                        'var(--tw-gradient-from), var(--tw-gradient-to)',
                    };
                  },
                },
                n,
              ),
                e({ from: (s) => ({ '--tw-gradient-from-position': s }) }, a),
                e(
                  {
                    via: (s) => {
                      let o = i(s);
                      return {
                        '@defaults gradient-color-stops': {},
                        '--tw-gradient-to': `${o}  var(--tw-gradient-to-position)`,
                        '--tw-gradient-stops': `var(--tw-gradient-from), ${N(
                          s,
                        )} var(--tw-gradient-via-position), var(--tw-gradient-to)`,
                      };
                    },
                  },
                  n,
                ),
                e({ via: (s) => ({ '--tw-gradient-via-position': s }) }, a),
                e(
                  {
                    to: (s) => ({
                      '@defaults gradient-color-stops': {},
                      '--tw-gradient-to': `${N(
                        s,
                      )} var(--tw-gradient-to-position)`,
                    }),
                  },
                  n,
                ),
                e({ to: (s) => ({ '--tw-gradient-to-position': s }) }, a);
            };
          })(),
          boxDecorationBreak: ({ addUtilities: i }) => {
            i({
              '.decoration-slice': { 'box-decoration-break': 'slice' },
              '.decoration-clone': { 'box-decoration-break': 'clone' },
              '.box-decoration-slice': { 'box-decoration-break': 'slice' },
              '.box-decoration-clone': { 'box-decoration-break': 'clone' },
            });
          },
          backgroundSize: P('backgroundSize', [['bg', ['background-size']]], {
            type: ['lookup', 'length', 'percentage', 'size'],
          }),
          backgroundAttachment: ({ addUtilities: i }) => {
            i({
              '.bg-fixed': { 'background-attachment': 'fixed' },
              '.bg-local': { 'background-attachment': 'local' },
              '.bg-scroll': { 'background-attachment': 'scroll' },
            });
          },
          backgroundClip: ({ addUtilities: i }) => {
            i({
              '.bg-clip-border': { 'background-clip': 'border-box' },
              '.bg-clip-padding': { 'background-clip': 'padding-box' },
              '.bg-clip-content': { 'background-clip': 'content-box' },
              '.bg-clip-text': { 'background-clip': 'text' },
            });
          },
          backgroundPosition: P(
            'backgroundPosition',
            [['bg', ['background-position']]],
            { type: ['lookup', ['position', { preferOnConflict: !0 }]] },
          ),
          backgroundRepeat: ({ addUtilities: i }) => {
            i({
              '.bg-repeat': { 'background-repeat': 'repeat' },
              '.bg-no-repeat': { 'background-repeat': 'no-repeat' },
              '.bg-repeat-x': { 'background-repeat': 'repeat-x' },
              '.bg-repeat-y': { 'background-repeat': 'repeat-y' },
              '.bg-repeat-round': { 'background-repeat': 'round' },
              '.bg-repeat-space': { 'background-repeat': 'space' },
            });
          },
          backgroundOrigin: ({ addUtilities: i }) => {
            i({
              '.bg-origin-border': { 'background-origin': 'border-box' },
              '.bg-origin-padding': { 'background-origin': 'padding-box' },
              '.bg-origin-content': { 'background-origin': 'content-box' },
            });
          },
          fill: ({ matchUtilities: i, theme: e }) => {
            i(
              { fill: (t) => ({ fill: N(t) }) },
              { values: re(e('fill')), type: ['color', 'any'] },
            );
          },
          stroke: ({ matchUtilities: i, theme: e }) => {
            i(
              { stroke: (t) => ({ stroke: N(t) }) },
              { values: re(e('stroke')), type: ['color', 'url', 'any'] },
            );
          },
          strokeWidth: P('strokeWidth', [['stroke', ['stroke-width']]], {
            type: ['length', 'number', 'percentage'],
          }),
          objectFit: ({ addUtilities: i }) => {
            i({
              '.object-contain': { 'object-fit': 'contain' },
              '.object-cover': { 'object-fit': 'cover' },
              '.object-fill': { 'object-fit': 'fill' },
              '.object-none': { 'object-fit': 'none' },
              '.object-scale-down': { 'object-fit': 'scale-down' },
            });
          },
          objectPosition: P('objectPosition', [
            ['object', ['object-position']],
          ]),
          padding: P('padding', [
            ['p', ['padding']],
            [
              ['px', ['padding-left', 'padding-right']],
              ['py', ['padding-top', 'padding-bottom']],
            ],
            [
              ['ps', ['padding-inline-start']],
              ['pe', ['padding-inline-end']],
              ['pt', ['padding-top']],
              ['pr', ['padding-right']],
              ['pb', ['padding-bottom']],
              ['pl', ['padding-left']],
            ],
          ]),
          textAlign: ({ addUtilities: i }) => {
            i({
              '.text-left': { 'text-align': 'left' },
              '.text-center': { 'text-align': 'center' },
              '.text-right': { 'text-align': 'right' },
              '.text-justify': { 'text-align': 'justify' },
              '.text-start': { 'text-align': 'start' },
              '.text-end': { 'text-align': 'end' },
            });
          },
          textIndent: P('textIndent', [['indent', ['text-indent']]], {
            supportsNegativeValues: !0,
          }),
          verticalAlign: ({ addUtilities: i, matchUtilities: e }) => {
            i({
              '.align-baseline': { 'vertical-align': 'baseline' },
              '.align-top': { 'vertical-align': 'top' },
              '.align-middle': { 'vertical-align': 'middle' },
              '.align-bottom': { 'vertical-align': 'bottom' },
              '.align-text-top': { 'vertical-align': 'text-top' },
              '.align-text-bottom': { 'vertical-align': 'text-bottom' },
              '.align-sub': { 'vertical-align': 'sub' },
              '.align-super': { 'vertical-align': 'super' },
            }),
              e({ align: (t) => ({ 'vertical-align': t }) });
          },
          fontFamily: ({ matchUtilities: i, theme: e }) => {
            i(
              {
                font: (t) => {
                  let [r, n = {}] = Array.isArray(t) && ie(t[1]) ? t : [t],
                    { fontFeatureSettings: a, fontVariationSettings: s } = n;
                  return {
                    'font-family': Array.isArray(r) ? r.join(', ') : r,
                    ...(a === void 0 ? {} : { 'font-feature-settings': a }),
                    ...(s === void 0 ? {} : { 'font-variation-settings': s }),
                  };
                },
              },
              {
                values: e('fontFamily'),
                type: ['lookup', 'generic-name', 'family-name'],
              },
            );
          },
          fontSize: ({ matchUtilities: i, theme: e }) => {
            i(
              {
                text: (t, { modifier: r }) => {
                  let [n, a] = Array.isArray(t) ? t : [t];
                  if (r) return { 'font-size': n, 'line-height': r };
                  let {
                    lineHeight: s,
                    letterSpacing: o,
                    fontWeight: u,
                  } = ie(a) ? a : { lineHeight: a };
                  return {
                    'font-size': n,
                    ...(s === void 0 ? {} : { 'line-height': s }),
                    ...(o === void 0 ? {} : { 'letter-spacing': o }),
                    ...(u === void 0 ? {} : { 'font-weight': u }),
                  };
                },
              },
              {
                values: e('fontSize'),
                modifiers: e('lineHeight'),
                type: [
                  'absolute-size',
                  'relative-size',
                  'length',
                  'percentage',
                ],
              },
            );
          },
          fontWeight: P('fontWeight', [['font', ['fontWeight']]], {
            type: ['lookup', 'number', 'any'],
          }),
          textTransform: ({ addUtilities: i }) => {
            i({
              '.uppercase': { 'text-transform': 'uppercase' },
              '.lowercase': { 'text-transform': 'lowercase' },
              '.capitalize': { 'text-transform': 'capitalize' },
              '.normal-case': { 'text-transform': 'none' },
            });
          },
          fontStyle: ({ addUtilities: i }) => {
            i({
              '.italic': { 'font-style': 'italic' },
              '.not-italic': { 'font-style': 'normal' },
            });
          },
          fontVariantNumeric: ({ addDefaults: i, addUtilities: e }) => {
            let t =
              'var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)';
            i('font-variant-numeric', {
              '--tw-ordinal': ' ',
              '--tw-slashed-zero': ' ',
              '--tw-numeric-figure': ' ',
              '--tw-numeric-spacing': ' ',
              '--tw-numeric-fraction': ' ',
            }),
              e({
                '.normal-nums': { 'font-variant-numeric': 'normal' },
                '.ordinal': {
                  '@defaults font-variant-numeric': {},
                  '--tw-ordinal': 'ordinal',
                  'font-variant-numeric': t,
                },
                '.slashed-zero': {
                  '@defaults font-variant-numeric': {},
                  '--tw-slashed-zero': 'slashed-zero',
                  'font-variant-numeric': t,
                },
                '.lining-nums': {
                  '@defaults font-variant-numeric': {},
                  '--tw-numeric-figure': 'lining-nums',
                  'font-variant-numeric': t,
                },
                '.oldstyle-nums': {
                  '@defaults font-variant-numeric': {},
                  '--tw-numeric-figure': 'oldstyle-nums',
                  'font-variant-numeric': t,
                },
                '.proportional-nums': {
                  '@defaults font-variant-numeric': {},
                  '--tw-numeric-spacing': 'proportional-nums',
                  'font-variant-numeric': t,
                },
                '.tabular-nums': {
                  '@defaults font-variant-numeric': {},
                  '--tw-numeric-spacing': 'tabular-nums',
                  'font-variant-numeric': t,
                },
                '.diagonal-fractions': {
                  '@defaults font-variant-numeric': {},
                  '--tw-numeric-fraction': 'diagonal-fractions',
                  'font-variant-numeric': t,
                },
                '.stacked-fractions': {
                  '@defaults font-variant-numeric': {},
                  '--tw-numeric-fraction': 'stacked-fractions',
                  'font-variant-numeric': t,
                },
              });
          },
          lineHeight: P('lineHeight', [['leading', ['lineHeight']]]),
          letterSpacing: P('letterSpacing', [['tracking', ['letterSpacing']]], {
            supportsNegativeValues: !0,
          }),
          textColor: ({ matchUtilities: i, theme: e, corePlugins: t }) => {
            i(
              {
                text: (r) =>
                  t('textOpacity')
                    ? se({
                        color: r,
                        property: 'color',
                        variable: '--tw-text-opacity',
                      })
                    : { color: N(r) },
              },
              { values: re(e('textColor')), type: ['color', 'any'] },
            );
          },
          textOpacity: P('textOpacity', [
            ['text-opacity', ['--tw-text-opacity']],
          ]),
          textDecoration: ({ addUtilities: i }) => {
            i({
              '.underline': { 'text-decoration-line': 'underline' },
              '.overline': { 'text-decoration-line': 'overline' },
              '.line-through': { 'text-decoration-line': 'line-through' },
              '.no-underline': { 'text-decoration-line': 'none' },
            });
          },
          textDecorationColor: ({ matchUtilities: i, theme: e }) => {
            i(
              { decoration: (t) => ({ 'text-decoration-color': N(t) }) },
              { values: re(e('textDecorationColor')), type: ['color', 'any'] },
            );
          },
          textDecorationStyle: ({ addUtilities: i }) => {
            i({
              '.decoration-solid': { 'text-decoration-style': 'solid' },
              '.decoration-double': { 'text-decoration-style': 'double' },
              '.decoration-dotted': { 'text-decoration-style': 'dotted' },
              '.decoration-dashed': { 'text-decoration-style': 'dashed' },
              '.decoration-wavy': { 'text-decoration-style': 'wavy' },
            });
          },
          textDecorationThickness: P(
            'textDecorationThickness',
            [['decoration', ['text-decoration-thickness']]],
            { type: ['length', 'percentage'] },
          ),
          textUnderlineOffset: P(
            'textUnderlineOffset',
            [['underline-offset', ['text-underline-offset']]],
            { type: ['length', 'percentage', 'any'] },
          ),
          fontSmoothing: ({ addUtilities: i }) => {
            i({
              '.antialiased': {
                '-webkit-font-smoothing': 'antialiased',
                '-moz-osx-font-smoothing': 'grayscale',
              },
              '.subpixel-antialiased': {
                '-webkit-font-smoothing': 'auto',
                '-moz-osx-font-smoothing': 'auto',
              },
            });
          },
          placeholderColor: ({
            matchUtilities: i,
            theme: e,
            corePlugins: t,
          }) => {
            i(
              {
                placeholder: (r) =>
                  t('placeholderOpacity')
                    ? {
                        '&::placeholder': se({
                          color: r,
                          property: 'color',
                          variable: '--tw-placeholder-opacity',
                        }),
                      }
                    : { '&::placeholder': { color: N(r) } },
              },
              { values: re(e('placeholderColor')), type: ['color', 'any'] },
            );
          },
          placeholderOpacity: ({ matchUtilities: i, theme: e }) => {
            i(
              {
                'placeholder-opacity': (t) => ({
                  ['&::placeholder']: { '--tw-placeholder-opacity': t },
                }),
              },
              { values: e('placeholderOpacity') },
            );
          },
          caretColor: ({ matchUtilities: i, theme: e }) => {
            i(
              { caret: (t) => ({ 'caret-color': N(t) }) },
              { values: re(e('caretColor')), type: ['color', 'any'] },
            );
          },
          accentColor: ({ matchUtilities: i, theme: e }) => {
            i(
              { accent: (t) => ({ 'accent-color': N(t) }) },
              { values: re(e('accentColor')), type: ['color', 'any'] },
            );
          },
          opacity: P('opacity', [['opacity', ['opacity']]]),
          backgroundBlendMode: ({ addUtilities: i }) => {
            i({
              '.bg-blend-normal': { 'background-blend-mode': 'normal' },
              '.bg-blend-multiply': { 'background-blend-mode': 'multiply' },
              '.bg-blend-screen': { 'background-blend-mode': 'screen' },
              '.bg-blend-overlay': { 'background-blend-mode': 'overlay' },
              '.bg-blend-darken': { 'background-blend-mode': 'darken' },
              '.bg-blend-lighten': { 'background-blend-mode': 'lighten' },
              '.bg-blend-color-dodge': {
                'background-blend-mode': 'color-dodge',
              },
              '.bg-blend-color-burn': { 'background-blend-mode': 'color-burn' },
              '.bg-blend-hard-light': { 'background-blend-mode': 'hard-light' },
              '.bg-blend-soft-light': { 'background-blend-mode': 'soft-light' },
              '.bg-blend-difference': { 'background-blend-mode': 'difference' },
              '.bg-blend-exclusion': { 'background-blend-mode': 'exclusion' },
              '.bg-blend-hue': { 'background-blend-mode': 'hue' },
              '.bg-blend-saturation': { 'background-blend-mode': 'saturation' },
              '.bg-blend-color': { 'background-blend-mode': 'color' },
              '.bg-blend-luminosity': { 'background-blend-mode': 'luminosity' },
            });
          },
          mixBlendMode: ({ addUtilities: i }) => {
            i({
              '.mix-blend-normal': { 'mix-blend-mode': 'normal' },
              '.mix-blend-multiply': { 'mix-blend-mode': 'multiply' },
              '.mix-blend-screen': { 'mix-blend-mode': 'screen' },
              '.mix-blend-overlay': { 'mix-blend-mode': 'overlay' },
              '.mix-blend-darken': { 'mix-blend-mode': 'darken' },
              '.mix-blend-lighten': { 'mix-blend-mode': 'lighten' },
              '.mix-blend-color-dodge': { 'mix-blend-mode': 'color-dodge' },
              '.mix-blend-color-burn': { 'mix-blend-mode': 'color-burn' },
              '.mix-blend-hard-light': { 'mix-blend-mode': 'hard-light' },
              '.mix-blend-soft-light': { 'mix-blend-mode': 'soft-light' },
              '.mix-blend-difference': { 'mix-blend-mode': 'difference' },
              '.mix-blend-exclusion': { 'mix-blend-mode': 'exclusion' },
              '.mix-blend-hue': { 'mix-blend-mode': 'hue' },
              '.mix-blend-saturation': { 'mix-blend-mode': 'saturation' },
              '.mix-blend-color': { 'mix-blend-mode': 'color' },
              '.mix-blend-luminosity': { 'mix-blend-mode': 'luminosity' },
              '.mix-blend-plus-lighter': { 'mix-blend-mode': 'plus-lighter' },
            });
          },
          boxShadow: (() => {
            let i = Ge('boxShadow'),
              e = [
                'var(--tw-ring-offset-shadow, 0 0 #0000)',
                'var(--tw-ring-shadow, 0 0 #0000)',
                'var(--tw-shadow)',
              ].join(', ');
            return function ({ matchUtilities: t, addDefaults: r, theme: n }) {
              r(' box-shadow', {
                '--tw-ring-offset-shadow': '0 0 #0000',
                '--tw-ring-shadow': '0 0 #0000',
                '--tw-shadow': '0 0 #0000',
                '--tw-shadow-colored': '0 0 #0000',
              }),
                t(
                  {
                    shadow: (a) => {
                      a = i(a);
                      let s = yi(a);
                      for (let o of s)
                        !o.valid || (o.color = 'var(--tw-shadow-color)');
                      return {
                        '@defaults box-shadow': {},
                        '--tw-shadow': a === 'none' ? '0 0 #0000' : a,
                        '--tw-shadow-colored':
                          a === 'none' ? '0 0 #0000' : Iu(s),
                        'box-shadow': e,
                      };
                    },
                  },
                  { values: n('boxShadow'), type: ['shadow'] },
                );
            };
          })(),
          boxShadowColor: ({ matchUtilities: i, theme: e }) => {
            i(
              {
                shadow: (t) => ({
                  '--tw-shadow-color': N(t),
                  '--tw-shadow': 'var(--tw-shadow-colored)',
                }),
              },
              { values: re(e('boxShadowColor')), type: ['color', 'any'] },
            );
          },
          outlineStyle: ({ addUtilities: i }) => {
            i({
              '.outline-none': {
                outline: '2px solid transparent',
                'outline-offset': '2px',
              },
              '.outline': { 'outline-style': 'solid' },
              '.outline-dashed': { 'outline-style': 'dashed' },
              '.outline-dotted': { 'outline-style': 'dotted' },
              '.outline-double': { 'outline-style': 'double' },
            });
          },
          outlineWidth: P('outlineWidth', [['outline', ['outline-width']]], {
            type: ['length', 'number', 'percentage'],
          }),
          outlineOffset: P(
            'outlineOffset',
            [['outline-offset', ['outline-offset']]],
            {
              type: ['length', 'number', 'percentage', 'any'],
              supportsNegativeValues: !0,
            },
          ),
          outlineColor: ({ matchUtilities: i, theme: e }) => {
            i(
              { outline: (t) => ({ 'outline-color': N(t) }) },
              { values: re(e('outlineColor')), type: ['color', 'any'] },
            );
          },
          ringWidth: ({
            matchUtilities: i,
            addDefaults: e,
            addUtilities: t,
            theme: r,
            config: n,
          }) => {
            let a = (() => {
              if (J(n(), 'respectDefaultRingColorOpacity'))
                return r('ringColor.DEFAULT');
              let s = r('ringOpacity.DEFAULT', '0.5');
              return r('ringColor')?.DEFAULT
                ? Ie(r('ringColor')?.DEFAULT, s, `rgb(147 197 253 / ${s})`)
                : `rgb(147 197 253 / ${s})`;
            })();
            e('ring-width', {
              '--tw-ring-inset': ' ',
              '--tw-ring-offset-width': r('ringOffsetWidth.DEFAULT', '0px'),
              '--tw-ring-offset-color': r('ringOffsetColor.DEFAULT', '#fff'),
              '--tw-ring-color': a,
              '--tw-ring-offset-shadow': '0 0 #0000',
              '--tw-ring-shadow': '0 0 #0000',
              '--tw-shadow': '0 0 #0000',
              '--tw-shadow-colored': '0 0 #0000',
            }),
              i(
                {
                  ring: (s) => ({
                    '@defaults ring-width': {},
                    '--tw-ring-offset-shadow':
                      'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
                    '--tw-ring-shadow': `var(--tw-ring-inset) 0 0 0 calc(${s} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
                    'box-shadow': [
                      'var(--tw-ring-offset-shadow)',
                      'var(--tw-ring-shadow)',
                      'var(--tw-shadow, 0 0 #0000)',
                    ].join(', '),
                  }),
                },
                { values: r('ringWidth'), type: 'length' },
              ),
              t({
                '.ring-inset': {
                  '@defaults ring-width': {},
                  '--tw-ring-inset': 'inset',
                },
              });
          },
          ringColor: ({ matchUtilities: i, theme: e, corePlugins: t }) => {
            i(
              {
                ring: (r) =>
                  t('ringOpacity')
                    ? se({
                        color: r,
                        property: '--tw-ring-color',
                        variable: '--tw-ring-opacity',
                      })
                    : { '--tw-ring-color': N(r) },
              },
              {
                values: Object.fromEntries(
                  Object.entries(re(e('ringColor'))).filter(
                    ([r]) => r !== 'DEFAULT',
                  ),
                ),
                type: ['color', 'any'],
              },
            );
          },
          ringOpacity: (i) => {
            let { config: e } = i;
            return P('ringOpacity', [['ring-opacity', ['--tw-ring-opacity']]], {
              filterDefault: !J(e(), 'respectDefaultRingColorOpacity'),
            })(i);
          },
          ringOffsetWidth: P(
            'ringOffsetWidth',
            [['ring-offset', ['--tw-ring-offset-width']]],
            { type: 'length' },
          ),
          ringOffsetColor: ({ matchUtilities: i, theme: e }) => {
            i(
              { 'ring-offset': (t) => ({ '--tw-ring-offset-color': N(t) }) },
              { values: re(e('ringOffsetColor')), type: ['color', 'any'] },
            );
          },
          blur: ({ matchUtilities: i, theme: e }) => {
            i(
              {
                blur: (t) => ({
                  '--tw-blur': `blur(${t})`,
                  '@defaults filter': {},
                  filter: Be,
                }),
              },
              { values: e('blur') },
            );
          },
          brightness: ({ matchUtilities: i, theme: e }) => {
            i(
              {
                brightness: (t) => ({
                  '--tw-brightness': `brightness(${t})`,
                  '@defaults filter': {},
                  filter: Be,
                }),
              },
              { values: e('brightness') },
            );
          },
          contrast: ({ matchUtilities: i, theme: e }) => {
            i(
              {
                contrast: (t) => ({
                  '--tw-contrast': `contrast(${t})`,
                  '@defaults filter': {},
                  filter: Be,
                }),
              },
              { values: e('contrast') },
            );
          },
          dropShadow: ({ matchUtilities: i, theme: e }) => {
            i(
              {
                'drop-shadow': (t) => ({
                  '--tw-drop-shadow': Array.isArray(t)
                    ? t.map((r) => `drop-shadow(${r})`).join(' ')
                    : `drop-shadow(${t})`,
                  '@defaults filter': {},
                  filter: Be,
                }),
              },
              { values: e('dropShadow') },
            );
          },
          grayscale: ({ matchUtilities: i, theme: e }) => {
            i(
              {
                grayscale: (t) => ({
                  '--tw-grayscale': `grayscale(${t})`,
                  '@defaults filter': {},
                  filter: Be,
                }),
              },
              { values: e('grayscale') },
            );
          },
          hueRotate: ({ matchUtilities: i, theme: e }) => {
            i(
              {
                'hue-rotate': (t) => ({
                  '--tw-hue-rotate': `hue-rotate(${t})`,
                  '@defaults filter': {},
                  filter: Be,
                }),
              },
              { values: e('hueRotate'), supportsNegativeValues: !0 },
            );
          },
          invert: ({ matchUtilities: i, theme: e }) => {
            i(
              {
                invert: (t) => ({
                  '--tw-invert': `invert(${t})`,
                  '@defaults filter': {},
                  filter: Be,
                }),
              },
              { values: e('invert') },
            );
          },
          saturate: ({ matchUtilities: i, theme: e }) => {
            i(
              {
                saturate: (t) => ({
                  '--tw-saturate': `saturate(${t})`,
                  '@defaults filter': {},
                  filter: Be,
                }),
              },
              { values: e('saturate') },
            );
          },
          sepia: ({ matchUtilities: i, theme: e }) => {
            i(
              {
                sepia: (t) => ({
                  '--tw-sepia': `sepia(${t})`,
                  '@defaults filter': {},
                  filter: Be,
                }),
              },
              { values: e('sepia') },
            );
          },
          filter: ({ addDefaults: i, addUtilities: e }) => {
            i('filter', {
              '--tw-blur': ' ',
              '--tw-brightness': ' ',
              '--tw-contrast': ' ',
              '--tw-grayscale': ' ',
              '--tw-hue-rotate': ' ',
              '--tw-invert': ' ',
              '--tw-saturate': ' ',
              '--tw-sepia': ' ',
              '--tw-drop-shadow': ' ',
            }),
              e({
                '.filter': { '@defaults filter': {}, filter: Be },
                '.filter-none': { filter: 'none' },
              });
          },
          backdropBlur: ({ matchUtilities: i, theme: e }) => {
            i(
              {
                'backdrop-blur': (t) => ({
                  '--tw-backdrop-blur': `blur(${t})`,
                  '@defaults backdrop-filter': {},
                  'backdrop-filter': Fe,
                }),
              },
              { values: e('backdropBlur') },
            );
          },
          backdropBrightness: ({ matchUtilities: i, theme: e }) => {
            i(
              {
                'backdrop-brightness': (t) => ({
                  '--tw-backdrop-brightness': `brightness(${t})`,
                  '@defaults backdrop-filter': {},
                  'backdrop-filter': Fe,
                }),
              },
              { values: e('backdropBrightness') },
            );
          },
          backdropContrast: ({ matchUtilities: i, theme: e }) => {
            i(
              {
                'backdrop-contrast': (t) => ({
                  '--tw-backdrop-contrast': `contrast(${t})`,
                  '@defaults backdrop-filter': {},
                  'backdrop-filter': Fe,
                }),
              },
              { values: e('backdropContrast') },
            );
          },
          backdropGrayscale: ({ matchUtilities: i, theme: e }) => {
            i(
              {
                'backdrop-grayscale': (t) => ({
                  '--tw-backdrop-grayscale': `grayscale(${t})`,
                  '@defaults backdrop-filter': {},
                  'backdrop-filter': Fe,
                }),
              },
              { values: e('backdropGrayscale') },
            );
          },
          backdropHueRotate: ({ matchUtilities: i, theme: e }) => {
            i(
              {
                'backdrop-hue-rotate': (t) => ({
                  '--tw-backdrop-hue-rotate': `hue-rotate(${t})`,
                  '@defaults backdrop-filter': {},
                  'backdrop-filter': Fe,
                }),
              },
              { values: e('backdropHueRotate'), supportsNegativeValues: !0 },
            );
          },
          backdropInvert: ({ matchUtilities: i, theme: e }) => {
            i(
              {
                'backdrop-invert': (t) => ({
                  '--tw-backdrop-invert': `invert(${t})`,
                  '@defaults backdrop-filter': {},
                  'backdrop-filter': Fe,
                }),
              },
              { values: e('backdropInvert') },
            );
          },
          backdropOpacity: ({ matchUtilities: i, theme: e }) => {
            i(
              {
                'backdrop-opacity': (t) => ({
                  '--tw-backdrop-opacity': `opacity(${t})`,
                  '@defaults backdrop-filter': {},
                  'backdrop-filter': Fe,
                }),
              },
              { values: e('backdropOpacity') },
            );
          },
          backdropSaturate: ({ matchUtilities: i, theme: e }) => {
            i(
              {
                'backdrop-saturate': (t) => ({
                  '--tw-backdrop-saturate': `saturate(${t})`,
                  '@defaults backdrop-filter': {},
                  'backdrop-filter': Fe,
                }),
              },
              { values: e('backdropSaturate') },
            );
          },
          backdropSepia: ({ matchUtilities: i, theme: e }) => {
            i(
              {
                'backdrop-sepia': (t) => ({
                  '--tw-backdrop-sepia': `sepia(${t})`,
                  '@defaults backdrop-filter': {},
                  'backdrop-filter': Fe,
                }),
              },
              { values: e('backdropSepia') },
            );
          },
          backdropFilter: ({ addDefaults: i, addUtilities: e }) => {
            i('backdrop-filter', {
              '--tw-backdrop-blur': ' ',
              '--tw-backdrop-brightness': ' ',
              '--tw-backdrop-contrast': ' ',
              '--tw-backdrop-grayscale': ' ',
              '--tw-backdrop-hue-rotate': ' ',
              '--tw-backdrop-invert': ' ',
              '--tw-backdrop-opacity': ' ',
              '--tw-backdrop-saturate': ' ',
              '--tw-backdrop-sepia': ' ',
            }),
              e({
                '.backdrop-filter': {
                  '@defaults backdrop-filter': {},
                  'backdrop-filter': Fe,
                },
                '.backdrop-filter-none': { 'backdrop-filter': 'none' },
              });
          },
          transitionProperty: ({ matchUtilities: i, theme: e }) => {
            let t = e('transitionTimingFunction.DEFAULT'),
              r = e('transitionDuration.DEFAULT');
            i(
              {
                transition: (n) => ({
                  'transition-property': n,
                  ...(n === 'none'
                    ? {}
                    : {
                        'transition-timing-function': t,
                        'transition-duration': r,
                      }),
                }),
              },
              { values: e('transitionProperty') },
            );
          },
          transitionDelay: P('transitionDelay', [
            ['delay', ['transitionDelay']],
          ]),
          transitionDuration: P(
            'transitionDuration',
            [['duration', ['transitionDuration']]],
            { filterDefault: !0 },
          ),
          transitionTimingFunction: P(
            'transitionTimingFunction',
            [['ease', ['transitionTimingFunction']]],
            { filterDefault: !0 },
          ),
          willChange: P('willChange', [['will-change', ['will-change']]]),
          content: P('content', [
            ['content', ['--tw-content', ['content', 'var(--tw-content)']]],
          ]),
        });
    });
  function bC(i) {
    if (i === void 0) return !1;
    if (i === 'true' || i === '1') return !0;
    if (i === 'false' || i === '0') return !1;
    if (i === '*') return !0;
    let e = i.split(',').map((t) => t.split(':')[0]);
    return e.includes('-tailwindcss') ? !1 : !!e.includes('tailwindcss');
  }
  var Pe,
    wd,
    bd,
    gn,
    Xa,
    He,
    Kr,
    ot = C(() => {
      l();
      Ya();
      (Pe =
        typeof m != 'undefined'
          ? {
              NODE_ENV: 'production',
              DEBUG: bC(m.env.DEBUG),
              ENGINE: Ja.tailwindcss.engine,
            }
          : {
              NODE_ENV: 'production',
              DEBUG: !1,
              ENGINE: Ja.tailwindcss.engine,
            }),
        (wd = new Map()),
        (bd = new Map()),
        (gn = new Map()),
        (Xa = new Map()),
        (He = new String('*')),
        (Kr = Symbol('__NONE__'));
    });
  function Bt(i) {
    let e = [],
      t = !1;
    for (let r = 0; r < i.length; r++) {
      let n = i[r];
      if (n === ':' && !t && e.length === 0) return !1;
      if (
        (vC.has(n) && i[r - 1] !== '\\' && (t = !t), !t && i[r - 1] !== '\\')
      ) {
        if (vd.has(n)) e.push(n);
        else if (xd.has(n)) {
          let a = xd.get(n);
          if (e.length <= 0 || e.pop() !== a) return !1;
        }
      }
    }
    return !(e.length > 0);
  }
  var vd,
    xd,
    vC,
    Ka = C(() => {
      l();
      (vd = new Map([
        ['{', '}'],
        ['[', ']'],
        ['(', ')'],
      ])),
        (xd = new Map(Array.from(vd.entries()).map(([i, e]) => [e, i]))),
        (vC = new Set(['"', "'", '`']));
    });
  function Ft(i) {
    let [e] = kd(i);
    return (
      e.forEach(([t, r]) => t.removeChild(r)),
      i.nodes.push(...e.map(([, t]) => t)),
      i
    );
  }
  function kd(i) {
    let e = [],
      t = null;
    for (let r of i.nodes)
      if (r.type === 'combinator')
        (e = e.filter(([, n]) => eo(n).includes('jumpable'))), (t = null);
      else if (r.type === 'pseudo') {
        xC(r)
          ? ((t = r), e.push([i, r, null]))
          : t && kC(r, t)
          ? e.push([i, r, t])
          : (t = null);
        for (let n of r.nodes ?? []) {
          let [a, s] = kd(n);
          (t = s || t), e.push(...a);
        }
      }
    return [e, t];
  }
  function Sd(i) {
    return i.value.startsWith('::') || Za[i.value] !== void 0;
  }
  function xC(i) {
    return Sd(i) && eo(i).includes('terminal');
  }
  function kC(i, e) {
    return i.type !== 'pseudo' || Sd(i) ? !1 : eo(e).includes('actionable');
  }
  function eo(i) {
    return Za[i.value] ?? Za.__default__;
  }
  var Za,
    yn = C(() => {
      l();
      Za = {
        '::after': ['terminal', 'jumpable'],
        '::backdrop': ['terminal', 'jumpable'],
        '::before': ['terminal', 'jumpable'],
        '::cue': ['terminal'],
        '::cue-region': ['terminal'],
        '::first-letter': ['terminal', 'jumpable'],
        '::first-line': ['terminal', 'jumpable'],
        '::grammar-error': ['terminal'],
        '::marker': ['terminal', 'jumpable'],
        '::part': ['terminal', 'actionable'],
        '::placeholder': ['terminal', 'jumpable'],
        '::selection': ['terminal', 'jumpable'],
        '::slotted': ['terminal'],
        '::spelling-error': ['terminal'],
        '::target-text': ['terminal'],
        '::file-selector-button': ['terminal', 'actionable'],
        '::deep': ['actionable'],
        '::v-deep': ['actionable'],
        '::ng-deep': ['actionable'],
        ':after': ['terminal', 'jumpable'],
        ':before': ['terminal', 'jumpable'],
        ':first-letter': ['terminal', 'jumpable'],
        ':first-line': ['terminal', 'jumpable'],
        __default__: ['terminal', 'actionable'],
      };
    });
  function Nt(i, { context: e, candidate: t }) {
    let r = e?.tailwindConfig.prefix ?? '',
      n = i.map((s) => {
        let o = (0, Ne.default)().astSync(s.format);
        return { ...s, ast: s.respectPrefix ? Rt(r, o) : o };
      }),
      a = Ne.default.root({
        nodes: [
          Ne.default.selector({
            nodes: [Ne.default.className({ value: ce(t) })],
          }),
        ],
      });
    for (let { ast: s } of n)
      ([a, s] = CC(a, s)),
        s.walkNesting((o) => o.replaceWith(...a.nodes[0].nodes)),
        (a = s);
    return a;
  }
  function Ad(i) {
    let e = [];
    for (; i.prev() && i.prev().type !== 'combinator'; ) i = i.prev();
    for (; i && i.type !== 'combinator'; ) e.push(i), (i = i.next());
    return e;
  }
  function SC(i) {
    return (
      i.sort((e, t) =>
        e.type === 'tag' && t.type === 'class'
          ? -1
          : e.type === 'class' && t.type === 'tag'
          ? 1
          : e.type === 'class' &&
            t.type === 'pseudo' &&
            t.value.startsWith('::')
          ? -1
          : e.type === 'pseudo' &&
            e.value.startsWith('::') &&
            t.type === 'class'
          ? 1
          : i.index(e) - i.index(t),
      ),
      i
    );
  }
  function ro(i, e) {
    let t = !1;
    i.walk((r) => {
      if (r.type === 'class' && r.value === e) return (t = !0), !1;
    }),
      t || i.remove();
  }
  function wn(i, e, { context: t, candidate: r, base: n }) {
    let a = t?.tailwindConfig?.separator ?? ':';
    n = n ?? r.split(new RegExp(`\\${a}(?![^[]*\\])`)).pop();
    let s = (0, Ne.default)().astSync(i);
    s.walkClasses((f) => {
      f.raws &&
        f.value.includes(n) &&
        (f.raws.value = ce((0, Cd.default)(f.raws.value)));
    }),
      s.each((f) => ro(f, n));
    let o = Array.isArray(e) ? Nt(e, { context: t, candidate: r }) : e;
    if (o === null) return s.toString();
    let u = Ne.default.comment({ value: '/*__simple__*/' }),
      c = Ne.default.comment({ value: '/*__simple__*/' });
    return (
      s.walkClasses((f) => {
        if (f.value !== n) return;
        let p = f.parent,
          d = o.nodes[0].nodes;
        if (p.nodes.length === 1) {
          f.replaceWith(...d);
          return;
        }
        let h = Ad(f);
        p.insertBefore(h[0], u), p.insertAfter(h[h.length - 1], c);
        for (let x of d) p.insertBefore(h[0], x.clone());
        f.remove(), (h = Ad(u));
        let y = p.index(u);
        p.nodes.splice(
          y,
          h.length,
          ...SC(Ne.default.selector({ nodes: h })).nodes,
        ),
          u.remove(),
          c.remove();
      }),
      s.walkPseudos((f) => {
        f.value === to && f.replaceWith(f.nodes);
      }),
      s.each((f) => Ft(f)),
      s.toString()
    );
  }
  function CC(i, e) {
    let t = [];
    return (
      i.walkPseudos((r) => {
        r.value === to && t.push({ pseudo: r, value: r.nodes[0].toString() });
      }),
      e.walkPseudos((r) => {
        if (r.value !== to) return;
        let n = r.nodes[0].toString(),
          a = t.find((c) => c.value === n);
        if (!a) return;
        let s = [],
          o = r.next();
        for (; o && o.type !== 'combinator'; ) s.push(o), (o = o.next());
        let u = o;
        a.pseudo.parent.insertAfter(
          a.pseudo,
          Ne.default.selector({ nodes: s.map((c) => c.clone()) }),
        ),
          r.remove(),
          s.forEach((c) => c.remove()),
          u && u.type === 'combinator' && u.remove();
      }),
      [i, e]
    );
  }
  var Ne,
    Cd,
    to,
    io = C(() => {
      l();
      (Ne = K(Me())), (Cd = K(Yi()));
      Mt();
      un();
      yn();
      to = ':merge';
    });
  function bn(i, e) {
    let t = (0, no.default)().astSync(i);
    return (
      t.each((r) => {
        (r.nodes[0].type === 'pseudo' &&
          r.nodes[0].value === ':is' &&
          r.nodes.every((a) => a.type !== 'combinator')) ||
          (r.nodes = [no.default.pseudo({ value: ':is', nodes: [r.clone()] })]),
          Ft(r);
      }),
      `${e} ${t.toString()}`
    );
  }
  var no,
    so = C(() => {
      l();
      no = K(Me());
      yn();
    });
  function ao(i) {
    return AC.transformSync(i);
  }
  function* _C(i) {
    let e = 1 / 0;
    for (; e >= 0; ) {
      let t,
        r = !1;
      if (e === 1 / 0 && i.endsWith(']')) {
        let s = i.indexOf('[');
        i[s - 1] === '-'
          ? (t = s - 1)
          : i[s - 1] === '/'
          ? ((t = s - 1), (r = !0))
          : (t = -1);
      } else
        e === 1 / 0 && i.includes('/')
          ? ((t = i.lastIndexOf('/')), (r = !0))
          : (t = i.lastIndexOf('-', e));
      if (t < 0) break;
      let n = i.slice(0, t),
        a = i.slice(r ? t : t + 1);
      (e = t - 1), !(n === '' || a === '/') && (yield [n, a]);
    }
  }
  function EC(i, e) {
    if (i.length === 0 || e.tailwindConfig.prefix === '') return i;
    for (let t of i) {
      let [r] = t;
      if (r.options.respectPrefix) {
        let n = z.root({ nodes: [t[1].clone()] }),
          a = t[1].raws.tailwind.classCandidate;
        n.walkRules((s) => {
          let o = a.startsWith('-');
          s.selector = Rt(e.tailwindConfig.prefix, s.selector, o);
        }),
          (t[1] = n.nodes[0]);
      }
    }
    return i;
  }
  function OC(i, e) {
    if (i.length === 0) return i;
    let t = [];
    for (let [r, n] of i) {
      let a = z.root({ nodes: [n.clone()] });
      a.walkRules((s) => {
        let o = (0, vn.default)().astSync(s.selector);
        o.each((u) => ro(u, e)),
          Wu(o, (u) => (u === e ? `!${u}` : u)),
          (s.selector = o.toString()),
          s.walkDecls((u) => (u.important = !0));
      }),
        t.push([{ ...r, important: !0 }, a.nodes[0]]);
    }
    return t;
  }
  function TC(i, e, t) {
    if (e.length === 0) return e;
    let r = { modifier: null, value: Kr };
    {
      let [n, ...a] = le(i, '/');
      if (
        (a.length > 1 &&
          ((n = n + '/' + a.slice(0, -1).join('/')), (a = a.slice(-1))),
        a.length &&
          !t.variantMap.has(i) &&
          ((i = n),
          (r.modifier = a[0]),
          !J(t.tailwindConfig, 'generalizedModifiers')))
      )
        return [];
    }
    if (i.endsWith(']') && !i.startsWith('[')) {
      let n = /(.)(-?)\[(.*)\]/g.exec(i);
      if (n) {
        let [, a, s, o] = n;
        if (a === '@' && s === '-') return [];
        if (a !== '@' && s === '') return [];
        (i = i.replace(`${s}[${o}]`, '')), (r.value = o);
      }
    }
    if (lo(i) && !t.variantMap.has(i)) {
      let n = t.offsets.recordVariant(i),
        a = U(i.slice(1, -1)),
        s = le(a, ',');
      if (s.length > 1) return [];
      if (!s.every(An)) return [];
      let o = s.map((u, c) => [
        t.offsets.applyParallelOffset(n, c),
        Zr(u.trim()),
      ]);
      t.variantMap.set(i, o);
    }
    if (t.variantMap.has(i)) {
      let n = lo(i),
        a = t.variantOptions.get(i)?.[Jr] ?? {},
        s = t.variantMap.get(i).slice(),
        o = [],
        u = (() => !(n || a.respectPrefix === !1))();
      for (let [c, f] of e) {
        if (c.layer === 'user') continue;
        let p = z.root({ nodes: [f.clone()] });
        for (let [d, h, y] of s) {
          let b = function () {
              x.raws.neededBackup ||
                ((x.raws.neededBackup = !0),
                x.walkRules((E) => (E.raws.originalSelector = E.selector)));
            },
            k = function (E) {
              return (
                b(),
                x.each((I) => {
                  I.type === 'rule' &&
                    (I.selectors = I.selectors.map((B) =>
                      E({
                        get className() {
                          return ao(B);
                        },
                        selector: B,
                      }),
                    ));
                }),
                x
              );
            },
            x = (y ?? p).clone(),
            w = [],
            S = h({
              get container() {
                return b(), x;
              },
              separator: t.tailwindConfig.separator,
              modifySelectors: k,
              wrap(E) {
                let I = x.nodes;
                x.removeAll(), E.append(I), x.append(E);
              },
              format(E) {
                w.push({ format: E, respectPrefix: u });
              },
              args: r,
            });
          if (Array.isArray(S)) {
            for (let [E, I] of S.entries())
              s.push([t.offsets.applyParallelOffset(d, E), I, x.clone()]);
            continue;
          }
          if (
            (typeof S == 'string' && w.push({ format: S, respectPrefix: u }),
            S === null)
          )
            continue;
          x.raws.neededBackup &&
            (delete x.raws.neededBackup,
            x.walkRules((E) => {
              let I = E.raws.originalSelector;
              if (!I || (delete E.raws.originalSelector, I === E.selector))
                return;
              let B = E.selector,
                q = (0, vn.default)((X) => {
                  X.walkClasses((ae) => {
                    ae.value = `${i}${t.tailwindConfig.separator}${ae.value}`;
                  });
                }).processSync(I);
              w.push({ format: B.replace(q, '&'), respectPrefix: u }),
                (E.selector = I);
            })),
            (x.nodes[0].raws.tailwind = {
              ...x.nodes[0].raws.tailwind,
              parentLayer: c.layer,
            });
          let _ = [
            {
              ...c,
              sort: t.offsets.applyVariantOffset(
                c.sort,
                d,
                Object.assign(r, t.variantOptions.get(i)),
              ),
              collectedFormats: (c.collectedFormats ?? []).concat(w),
            },
            x.nodes[0],
          ];
          o.push(_);
        }
      }
      return o;
    }
    return [];
  }
  function oo(i, e, t = {}) {
    return !ie(i) && !Array.isArray(i)
      ? [[i], t]
      : Array.isArray(i)
      ? oo(i[0], e, i[1])
      : (e.has(i) || e.set(i, qt(i)), [e.get(i), t]);
  }
  function DC(i) {
    return PC.test(i);
  }
  function IC(i) {
    if (!i.includes('://')) return !1;
    try {
      let e = new URL(i);
      return e.scheme !== '' && e.host !== '';
    } catch (e) {
      return !1;
    }
  }
  function _d(i) {
    let e = !0;
    return (
      i.walkDecls((t) => {
        if (!Ed(t.prop, t.value)) return (e = !1), !1;
      }),
      e
    );
  }
  function Ed(i, e) {
    if (IC(`${i}:${e}`)) return !1;
    try {
      return z.parse(`a{${i}:${e}}`).toResult(), !0;
    } catch (t) {
      return !1;
    }
  }
  function qC(i, e) {
    let [, t, r] = i.match(/^\[([a-zA-Z0-9-_]+):(\S+)\]$/) ?? [];
    if (r === void 0 || !DC(t) || !Bt(r)) return null;
    let n = U(r);
    return Ed(t, n)
      ? [
          [
            { sort: e.offsets.arbitraryProperty(), layer: 'utilities' },
            () => ({ [Wa(i)]: { [t]: n } }),
          ],
        ]
      : null;
  }
  function* RC(i, e) {
    e.candidateRuleMap.has(i) && (yield [e.candidateRuleMap.get(i), 'DEFAULT']),
      yield* (function* (o) {
        o !== null && (yield [o, 'DEFAULT']);
      })(qC(i, e));
    let t = i,
      r = !1,
      n = e.tailwindConfig.prefix,
      a = n.length,
      s = t.startsWith(n) || t.startsWith(`-${n}`);
    t[a] === '-' && s && ((r = !0), (t = n + t.slice(a + 1))),
      r &&
        e.candidateRuleMap.has(t) &&
        (yield [e.candidateRuleMap.get(t), '-DEFAULT']);
    for (let [o, u] of _C(t))
      e.candidateRuleMap.has(o) &&
        (yield [e.candidateRuleMap.get(o), r ? `-${u}` : u]);
  }
  function MC(i, e) {
    return i === He ? [He] : le(i, e);
  }
  function* BC(i, e) {
    for (let t of i)
      (t[1].raws.tailwind = {
        ...t[1].raws.tailwind,
        classCandidate: e,
        preserveSource: t[0].options?.preserveSource ?? !1,
      }),
        yield t;
  }
  function* xn(i, e, t = i) {
    let r = e.tailwindConfig.separator,
      [n, ...a] = MC(i, r).reverse(),
      s = !1;
    if (
      (n.startsWith('!') && ((s = !0), (n = n.slice(1))),
      J(e.tailwindConfig, 'variantGrouping') &&
        n.startsWith('(') &&
        n.endsWith(')'))
    ) {
      let o = a.slice().reverse().join(r);
      for (let u of le(n.slice(1, -1), ',')) yield* xn(o + r + u, e, t);
    }
    for (let o of RC(n, e)) {
      let u = [],
        c = new Map(),
        [f, p] = o,
        d = f.length === 1;
      for (let [h, y] of f) {
        let x = [];
        if (typeof y == 'function')
          for (let w of [].concat(y(p, { isOnlyPlugin: d }))) {
            let [b, k] = oo(w, e.postCssNodeCache);
            for (let S of b)
              x.push([{ ...h, options: { ...h.options, ...k } }, S]);
          }
        else if (p === 'DEFAULT' || p === '-DEFAULT') {
          let w = y,
            [b, k] = oo(w, e.postCssNodeCache);
          for (let S of b)
            x.push([{ ...h, options: { ...h.options, ...k } }, S]);
        }
        if (x.length > 0) {
          let w = Array.from(
            ps(h.options?.types ?? [], p, h.options ?? {}, e.tailwindConfig),
          ).map(([b, k]) => k);
          w.length > 0 && c.set(x, w), u.push(x);
        }
      }
      if (lo(p)) {
        if (u.length > 1) {
          let x = function (b) {
              return b.length === 1
                ? b[0]
                : b.find((k) => {
                    let S = c.get(k);
                    return k.some(([{ options: _ }, E]) =>
                      _d(E)
                        ? _.types.some(
                            ({ type: I, preferOnConflict: B }) =>
                              S.includes(I) && B,
                          )
                        : !1,
                    );
                  });
            },
            [h, y] = u.reduce(
              (b, k) => (
                k.some(([{ options: _ }]) =>
                  _.types.some(({ type: E }) => E === 'any'),
                )
                  ? b[0].push(k)
                  : b[1].push(k),
                b
              ),
              [[], []],
            ),
            w = x(y) ?? x(h);
          if (w) u = [w];
          else {
            let b = u.map((S) => new Set([...(c.get(S) ?? [])]));
            for (let S of b)
              for (let _ of S) {
                let E = !1;
                for (let I of b) S !== I && I.has(_) && (I.delete(_), (E = !0));
                E && S.delete(_);
              }
            let k = [];
            for (let [S, _] of b.entries())
              for (let E of _) {
                let I = u[S].map(([, B]) => B)
                  .flat()
                  .map((B) =>
                    B.toString()
                      .split(
                        `
`,
                      )
                      .slice(1, -1)
                      .map((q) => q.trim())
                      .map((q) => `      ${q}`).join(`
`),
                  ).join(`

`);
                k.push(
                  `  Use \`${i.replace('[', `[${E}:`)}\` for \`${I.trim()}\``,
                );
                break;
              }
            F.warn([
              `The class \`${i}\` is ambiguous and matches multiple utilities.`,
              ...k,
              `If this is content and not a class, replace it with \`${i
                .replace('[', '&lsqb;')
                .replace(']', '&rsqb;')}\` to silence this warning.`,
            ]);
            continue;
          }
        }
        u = u.map((h) => h.filter((y) => _d(y[1])));
      }
      (u = u.flat()),
        (u = Array.from(BC(u, n))),
        (u = EC(u, e)),
        s && (u = OC(u, n));
      for (let h of a) u = TC(h, u, e);
      for (let h of u)
        (h[1].raws.tailwind = { ...h[1].raws.tailwind, candidate: i }),
          (h = FC(h, { context: e, candidate: i, original: t })),
          h !== null && (yield h);
    }
  }
  function FC(i, { context: e, candidate: t, original: r }) {
    if (!i[0].collectedFormats) return i;
    let n = !0,
      a;
    try {
      a = Nt(i[0].collectedFormats, { context: e, candidate: t });
    } catch {
      return null;
    }
    let s = z.root({ nodes: [i[1].clone()] });
    return (
      s.walkRules((o) => {
        if (!kn(o))
          try {
            o.selector = wn(o.selector, a, { candidate: r, context: e });
          } catch {
            return (n = !1), !1;
          }
      }),
      n ? ((i[1] = s.nodes[0]), i) : null
    );
  }
  function kn(i) {
    return (
      i.parent && i.parent.type === 'atrule' && i.parent.name === 'keyframes'
    );
  }
  function NC(i) {
    if (i === !0)
      return (e) => {
        kn(e) ||
          e.walkDecls((t) => {
            t.parent.type === 'rule' && !kn(t.parent) && (t.important = !0);
          });
      };
    if (typeof i == 'string')
      return (e) => {
        kn(e) || (e.selectors = e.selectors.map((t) => bn(t, i)));
      };
  }
  function Sn(i, e) {
    let t = [],
      r = NC(e.tailwindConfig.important);
    for (let n of i) {
      if (e.notClassCache.has(n)) continue;
      if (e.candidateRuleCache.has(n)) {
        t = t.concat(Array.from(e.candidateRuleCache.get(n)));
        continue;
      }
      let a = Array.from(xn(n, e));
      if (a.length === 0) {
        e.notClassCache.add(n);
        continue;
      }
      e.classCache.set(n, a);
      let s = e.candidateRuleCache.get(n) ?? new Set();
      e.candidateRuleCache.set(n, s);
      for (let o of a) {
        let [{ sort: u, options: c }, f] = o;
        if (c.respectImportant && r) {
          let d = z.root({ nodes: [f.clone()] });
          d.walkRules(r), (f = d.nodes[0]);
        }
        let p = [u, f];
        s.add(p), e.ruleCache.add(p), t.push(p);
      }
    }
    return t;
  }
  function lo(i) {
    return i.startsWith('[') && i.endsWith(']');
  }
  var vn,
    AC,
    PC,
    Cn = C(() => {
      l();
      nt();
      vn = K(Me());
      Ua();
      xt();
      un();
      cr();
      Ee();
      ot();
      io();
      Ga();
      fr();
      Xr();
      Ka();
      or();
      De();
      so();
      AC = (0, vn.default)(
        (i) => i.first.filter(({ type: e }) => e === 'class').pop().value,
      );
      PC = /^[a-z_-]/;
    });
  var Od,
    Td = C(() => {
      l();
      Od = {};
    });
  function LC(i) {
    try {
      return Od.createHash('md5').update(i, 'utf-8').digest('binary');
    } catch (e) {
      return '';
    }
  }
  function Pd(i, e) {
    let t = e.toString();
    if (!t.includes('@tailwind')) return !1;
    let r = Xa.get(i),
      n = LC(t),
      a = r !== n;
    return Xa.set(i, n), a;
  }
  var Dd = C(() => {
    l();
    Td();
    ot();
  });
  function _n(i) {
    return (i > 0n) - (i < 0n);
  }
  var Id = C(() => {
    l();
  });
  function qd(i, e) {
    let t = 0n,
      r = 0n;
    for (let [n, a] of e) i & n && ((t = t | n), (r = r | a));
    return (i & ~t) | r;
  }
  var Rd = C(() => {
    l();
  });
  function Md(i) {
    let e = null;
    for (let t of i) (e = e ?? t), (e = e > t ? e : t);
    return e;
  }
  function $C(i, e) {
    let t = i.length,
      r = e.length,
      n = t < r ? t : r;
    for (let a = 0; a < n; a++) {
      let s = i.charCodeAt(a) - e.charCodeAt(a);
      if (s !== 0) return s;
    }
    return t - r;
  }
  var uo,
    Bd = C(() => {
      l();
      Id();
      Rd();
      uo = class {
        constructor() {
          (this.offsets = {
            defaults: 0n,
            base: 0n,
            components: 0n,
            utilities: 0n,
            variants: 0n,
            user: 0n,
          }),
            (this.layerPositions = {
              defaults: 0n,
              base: 1n,
              components: 2n,
              utilities: 3n,
              user: 4n,
              variants: 5n,
            }),
            (this.reservedVariantBits = 0n),
            (this.variantOffsets = new Map());
        }
        create(e) {
          return {
            layer: e,
            parentLayer: e,
            arbitrary: 0n,
            variants: 0n,
            parallelIndex: 0n,
            index: this.offsets[e]++,
            options: [],
          };
        }
        arbitraryProperty() {
          return { ...this.create('utilities'), arbitrary: 1n };
        }
        forVariant(e, t = 0) {
          let r = this.variantOffsets.get(e);
          if (r === void 0)
            throw new Error(`Cannot find offset for unknown variant ${e}`);
          return { ...this.create('variants'), variants: r << BigInt(t) };
        }
        applyVariantOffset(e, t, r) {
          return (
            (r.variant = t.variants),
            {
              ...e,
              layer: 'variants',
              parentLayer: e.layer === 'variants' ? e.parentLayer : e.layer,
              variants: e.variants | t.variants,
              options: r.sort ? [].concat(r, e.options) : e.options,
              parallelIndex: Md([e.parallelIndex, t.parallelIndex]),
            }
          );
        }
        applyParallelOffset(e, t) {
          return { ...e, parallelIndex: BigInt(t) };
        }
        recordVariants(e, t) {
          for (let r of e) this.recordVariant(r, t(r));
        }
        recordVariant(e, t = 1) {
          return (
            this.variantOffsets.set(e, 1n << this.reservedVariantBits),
            (this.reservedVariantBits += BigInt(t)),
            { ...this.create('variants'), variants: this.variantOffsets.get(e) }
          );
        }
        compare(e, t) {
          if (e.layer !== t.layer)
            return this.layerPositions[e.layer] - this.layerPositions[t.layer];
          if (e.parentLayer !== t.parentLayer)
            return (
              this.layerPositions[e.parentLayer] -
              this.layerPositions[t.parentLayer]
            );
          for (let r of e.options)
            for (let n of t.options) {
              if (r.id !== n.id || !r.sort || !n.sort) continue;
              let a = Md([r.variant, n.variant]) ?? 0n,
                s = ~(a | (a - 1n)),
                o = e.variants & s,
                u = t.variants & s;
              if (o !== u) continue;
              let c = r.sort(
                { value: r.value, modifier: r.modifier },
                { value: n.value, modifier: n.modifier },
              );
              if (c !== 0) return c;
            }
          return e.variants !== t.variants
            ? e.variants - t.variants
            : e.parallelIndex !== t.parallelIndex
            ? e.parallelIndex - t.parallelIndex
            : e.arbitrary !== t.arbitrary
            ? e.arbitrary - t.arbitrary
            : e.index - t.index;
        }
        recalculateVariantOffsets() {
          let e = Array.from(this.variantOffsets.entries())
              .filter(([n]) => n.startsWith('['))
              .sort(([n], [a]) => $C(n, a)),
            t = e.map(([, n]) => n).sort((n, a) => _n(n - a));
          return e.map(([, n], a) => [n, t[a]]).filter(([n, a]) => n !== a);
        }
        remapArbitraryVariantOffsets(e) {
          let t = this.recalculateVariantOffsets();
          return t.length === 0
            ? e
            : e.map((r) => {
                let [n, a] = r;
                return (n = { ...n, variants: qd(n.variants, t) }), [n, a];
              });
        }
        sort(e) {
          return (
            (e = this.remapArbitraryVariantOffsets(e)),
            e.sort(([t], [r]) => _n(this.compare(t, r)))
          );
        }
      };
    });
  function ho(i, e) {
    let t = i.tailwindConfig.prefix;
    return typeof t == 'function' ? t(e) : t + e;
  }
  function Nd({ type: i = 'any', ...e }) {
    let t = [].concat(i);
    return {
      ...e,
      types: t.map((r) =>
        Array.isArray(r)
          ? { type: r[0], ...r[1] }
          : { type: r, preferOnConflict: !1 },
      ),
    };
  }
  function jC(i) {
    let e = [],
      t = '',
      r = 0;
    for (let n = 0; n < i.length; n++) {
      let a = i[n];
      if (a === '\\') t += '\\' + i[++n];
      else if (a === '{') ++r, e.push(t.trim()), (t = '');
      else if (a === '}') {
        if (--r < 0) throw new Error('Your { and } are unbalanced.');
        e.push(t.trim()), (t = '');
      } else t += a;
    }
    return t.length > 0 && e.push(t.trim()), (e = e.filter((n) => n !== '')), e;
  }
  function zC(i, e, { before: t = [] } = {}) {
    if (((t = [].concat(t)), t.length <= 0)) {
      i.push(e);
      return;
    }
    let r = i.length - 1;
    for (let n of t) {
      let a = i.indexOf(n);
      a !== -1 && (r = Math.min(r, a));
    }
    i.splice(r, 0, e);
  }
  function Ld(i) {
    return Array.isArray(i)
      ? i.flatMap((e) => (!Array.isArray(e) && !ie(e) ? e : qt(e)))
      : Ld([i]);
  }
  function $d(i, e) {
    return (0, fo.default)((r) => {
      let n = [];
      return (
        e && e(r),
        r.walkClasses((a) => {
          n.push(a.value);
        }),
        n
      );
    }).transformSync(i);
  }
  function VC(i, e = { containsNonOnDemandable: !1 }, t = 0) {
    let r = [];
    if (i.type === 'rule') {
      let n = function (a) {
        a.walkPseudos((s) => {
          s.value === ':not' && s.remove();
        });
      };
      for (let a of i.selectors) {
        let s = $d(a, n);
        s.length === 0 && (e.containsNonOnDemandable = !0);
        for (let o of s) r.push(o);
      }
    } else
      i.type === 'atrule' &&
        i.walkRules((n) => {
          for (let a of n.selectors.flatMap((s) => $d(s))) r.push(a);
        });
    return t === 0 ? [e.containsNonOnDemandable || r.length === 0, r] : r;
  }
  function En(i) {
    return Ld(i).flatMap((e) => {
      let t = new Map(),
        [r, n] = VC(e);
      return (
        r && n.unshift(He),
        n.map((a) => (t.has(e) || t.set(e, e), [a, t.get(e)]))
      );
    });
  }
  function An(i) {
    return i.startsWith('@') || i.includes('&');
  }
  function Zr(i) {
    i = i
      .replace(/\n+/g, '')
      .replace(/\s{1,}/g, ' ')
      .trim();
    let e = jC(i)
      .map((t) => {
        if (!t.startsWith('@')) return ({ format: a }) => a(t);
        let [, r, n] = /@(\S*)( .+|[({].*)?/g.exec(t);
        return ({ wrap: a }) =>
          a(z.atRule({ name: r, params: n?.trim() ?? '' }));
      })
      .reverse();
    return (t) => {
      for (let r of e) r(t);
    };
  }
  function UC(
    i,
    e,
    { variantList: t, variantMap: r, offsets: n, classList: a },
  ) {
    function s(d, h) {
      return d ? (0, Fd.default)(i, d, h) : i;
    }
    function o(d) {
      return Rt(i.prefix, d);
    }
    function u(d, h) {
      return d === He ? He : h.respectPrefix ? e.tailwindConfig.prefix + d : d;
    }
    function c(d, h, y = {}) {
      let x = Ke(d),
        w = s(['theme', ...x], h);
      return Ge(x[0])(w, y);
    }
    let f = 0,
      p = {
        postcss: z,
        prefix: o,
        e: ce,
        config: s,
        theme: c,
        corePlugins: (d) =>
          Array.isArray(i.corePlugins)
            ? i.corePlugins.includes(d)
            : s(['corePlugins', d], !0),
        variants: () => [],
        addBase(d) {
          for (let [h, y] of En(d)) {
            let x = u(h, {}),
              w = n.create('base');
            e.candidateRuleMap.has(x) || e.candidateRuleMap.set(x, []),
              e.candidateRuleMap.get(x).push([{ sort: w, layer: 'base' }, y]);
          }
        },
        addDefaults(d, h) {
          let y = { [`@defaults ${d}`]: h };
          for (let [x, w] of En(y)) {
            let b = u(x, {});
            e.candidateRuleMap.has(b) || e.candidateRuleMap.set(b, []),
              e.candidateRuleMap
                .get(b)
                .push([{ sort: n.create('defaults'), layer: 'defaults' }, w]);
          }
        },
        addComponents(d, h) {
          h = Object.assign(
            {},
            { preserveSource: !1, respectPrefix: !0, respectImportant: !1 },
            Array.isArray(h) ? {} : h,
          );
          for (let [x, w] of En(d)) {
            let b = u(x, h);
            a.add(b),
              e.candidateRuleMap.has(b) || e.candidateRuleMap.set(b, []),
              e.candidateRuleMap
                .get(b)
                .push([
                  {
                    sort: n.create('components'),
                    layer: 'components',
                    options: h,
                  },
                  w,
                ]);
          }
        },
        addUtilities(d, h) {
          h = Object.assign(
            {},
            { preserveSource: !1, respectPrefix: !0, respectImportant: !0 },
            Array.isArray(h) ? {} : h,
          );
          for (let [x, w] of En(d)) {
            let b = u(x, h);
            a.add(b),
              e.candidateRuleMap.has(b) || e.candidateRuleMap.set(b, []),
              e.candidateRuleMap
                .get(b)
                .push([
                  {
                    sort: n.create('utilities'),
                    layer: 'utilities',
                    options: h,
                  },
                  w,
                ]);
          }
        },
        matchUtilities: function (d, h) {
          h = Nd({
            ...{ respectPrefix: !0, respectImportant: !0, modifiers: !1 },
            ...h,
          });
          let x = n.create('utilities');
          for (let w in d) {
            let S = function (E, { isOnlyPlugin: I }) {
                let [B, q, X] = cs(h.types, E, h, i);
                if (B === void 0) return [];
                if (!h.types.some(({ type: $ }) => $ === q))
                  if (I)
                    F.warn([
                      `Unnecessary typehint \`${q}\` in \`${w}-${E}\`.`,
                      `You can safely update it to \`${w}-${E.replace(
                        q + ':',
                        '',
                      )}\`.`,
                    ]);
                  else return [];
                if (!Bt(B)) return [];
                let ae = {
                    get modifier() {
                      return (
                        h.modifiers ||
                          F.warn(`modifier-used-without-options-for-${w}`, [
                            'Your plugin must set `modifiers: true` in its options to support modifiers.',
                          ]),
                        X
                      );
                    },
                  },
                  ge = J(i, 'generalizedModifiers');
                return []
                  .concat(ge ? k(B, ae) : k(B))
                  .filter(Boolean)
                  .map(($) => ({ [fn(w, E)]: $ }));
              },
              b = u(w, h),
              k = d[w];
            a.add([b, h]);
            let _ = [{ sort: x, layer: 'utilities', options: h }, S];
            e.candidateRuleMap.has(b) || e.candidateRuleMap.set(b, []),
              e.candidateRuleMap.get(b).push(_);
          }
        },
        matchComponents: function (d, h) {
          h = Nd({
            ...{ respectPrefix: !0, respectImportant: !1, modifiers: !1 },
            ...h,
          });
          let x = n.create('components');
          for (let w in d) {
            let S = function (E, { isOnlyPlugin: I }) {
                let [B, q, X] = cs(h.types, E, h, i);
                if (B === void 0) return [];
                if (!h.types.some(({ type: $ }) => $ === q))
                  if (I)
                    F.warn([
                      `Unnecessary typehint \`${q}\` in \`${w}-${E}\`.`,
                      `You can safely update it to \`${w}-${E.replace(
                        q + ':',
                        '',
                      )}\`.`,
                    ]);
                  else return [];
                if (!Bt(B)) return [];
                let ae = {
                    get modifier() {
                      return (
                        h.modifiers ||
                          F.warn(`modifier-used-without-options-for-${w}`, [
                            'Your plugin must set `modifiers: true` in its options to support modifiers.',
                          ]),
                        X
                      );
                    },
                  },
                  ge = J(i, 'generalizedModifiers');
                return []
                  .concat(ge ? k(B, ae) : k(B))
                  .filter(Boolean)
                  .map(($) => ({ [fn(w, E)]: $ }));
              },
              b = u(w, h),
              k = d[w];
            a.add([b, h]);
            let _ = [{ sort: x, layer: 'components', options: h }, S];
            e.candidateRuleMap.has(b) || e.candidateRuleMap.set(b, []),
              e.candidateRuleMap.get(b).push(_);
          }
        },
        addVariant(d, h, y = {}) {
          (h = [].concat(h).map((x) => {
            if (typeof x != 'string')
              return (w = {}) => {
                let {
                    args: b,
                    modifySelectors: k,
                    container: S,
                    separator: _,
                    wrap: E,
                    format: I,
                  } = w,
                  B = x(
                    Object.assign(
                      { modifySelectors: k, container: S, separator: _ },
                      y.type === co.MatchVariant && {
                        args: b,
                        wrap: E,
                        format: I,
                      },
                    ),
                  );
                if (typeof B == 'string' && !An(B))
                  throw new Error(
                    `Your custom variant \`${d}\` has an invalid format string. Make sure it's an at-rule or contains a \`&\` placeholder.`,
                  );
                return Array.isArray(B)
                  ? B.filter((q) => typeof q == 'string').map((q) => Zr(q))
                  : B && typeof B == 'string' && Zr(B)(w);
              };
            if (!An(x))
              throw new Error(
                `Your custom variant \`${d}\` has an invalid format string. Make sure it's an at-rule or contains a \`&\` placeholder.`,
              );
            return Zr(x);
          })),
            zC(t, d, y),
            r.set(d, h),
            e.variantOptions.set(d, y);
        },
        matchVariant(d, h, y) {
          let x = y?.id ?? ++f,
            w = d === '@',
            b = J(i, 'generalizedModifiers');
          for (let [S, _] of Object.entries(y?.values ?? {}))
            S !== 'DEFAULT' &&
              p.addVariant(
                w ? `${d}${S}` : `${d}-${S}`,
                ({ args: E, container: I }) =>
                  h(
                    _,
                    b
                      ? { modifier: E?.modifier, container: I }
                      : { container: I },
                  ),
                {
                  ...y,
                  value: _,
                  id: x,
                  type: co.MatchVariant,
                  variantInfo: po.Base,
                },
              );
          let k = 'DEFAULT' in (y?.values ?? {});
          p.addVariant(
            d,
            ({ args: S, container: _ }) =>
              S?.value === Kr && !k
                ? null
                : h(
                    S?.value === Kr
                      ? y.values.DEFAULT
                      : S?.value ?? (typeof S == 'string' ? S : ''),
                    b
                      ? { modifier: S?.modifier, container: _ }
                      : { container: _ },
                  ),
            { ...y, id: x, type: co.MatchVariant, variantInfo: po.Dynamic },
          );
        },
      };
    return p;
  }
  function On(i) {
    return mo.has(i) || mo.set(i, new Map()), mo.get(i);
  }
  function jd(i, e) {
    let t = !1,
      r = new Map();
    for (let n of i) {
      if (!n) continue;
      let a = ws.parse(n),
        s = a.hash ? a.href.replace(a.hash, '') : a.href;
      s = a.search ? s.replace(a.search, '') : s;
      let o = te.statSync(decodeURIComponent(s), {
        throwIfNoEntry: !1,
      })?.mtimeMs;
      !o || ((!e.has(n) || o > e.get(n)) && (t = !0), r.set(n, o));
    }
    return [t, r];
  }
  function zd(i) {
    i.walkAtRules((e) => {
      ['responsive', 'variants'].includes(e.name) &&
        (zd(e), e.before(e.nodes), e.remove());
    });
  }
  function WC(i) {
    let e = [];
    return (
      i.each((t) => {
        t.type === 'atrule' &&
          ['responsive', 'variants'].includes(t.name) &&
          ((t.name = 'layer'), (t.params = 'utilities'));
      }),
      i.walkAtRules('layer', (t) => {
        if ((zd(t), t.params === 'base')) {
          for (let r of t.nodes)
            e.push(function ({ addBase: n }) {
              n(r, { respectPrefix: !1 });
            });
          t.remove();
        } else if (t.params === 'components') {
          for (let r of t.nodes)
            e.push(function ({ addComponents: n }) {
              n(r, { respectPrefix: !1, preserveSource: !0 });
            });
          t.remove();
        } else if (t.params === 'utilities') {
          for (let r of t.nodes)
            e.push(function ({ addUtilities: n }) {
              n(r, { respectPrefix: !1, preserveSource: !0 });
            });
          t.remove();
        }
      }),
      e
    );
  }
  function GC(i, e) {
    let t = Object.entries({ ...pe, ...gd })
        .map(([o, u]) => (i.tailwindConfig.corePlugins.includes(o) ? u : null))
        .filter(Boolean),
      r = i.tailwindConfig.plugins.map(
        (o) => (
          o.__isOptionsFunction && (o = o()),
          typeof o == 'function' ? o : o.handler
        ),
      ),
      n = WC(e),
      a = [
        pe.pseudoElementVariants,
        pe.pseudoClassVariants,
        pe.ariaVariants,
        pe.dataVariants,
      ],
      s = [
        pe.supportsVariants,
        pe.directionVariants,
        pe.reducedMotionVariants,
        pe.prefersContrastVariants,
        pe.darkVariants,
        pe.printVariant,
        pe.screenVariants,
        pe.orientationVariants,
      ];
    return [...t, ...a, ...r, ...s, ...n];
  }
  function HC(i, e) {
    let t = [],
      r = new Map();
    e.variantMap = r;
    let n = new uo();
    e.offsets = n;
    let a = new Set(),
      s = UC(e.tailwindConfig, e, {
        variantList: t,
        variantMap: r,
        offsets: n,
        classList: a,
      });
    for (let f of i)
      if (Array.isArray(f)) for (let p of f) p(s);
      else f?.(s);
    n.recordVariants(t, (f) => r.get(f).length);
    for (let [f, p] of r.entries())
      e.variantMap.set(
        f,
        p.map((d, h) => [n.forVariant(f, h), d]),
      );
    let o = (e.tailwindConfig.safelist ?? []).filter(Boolean);
    if (o.length > 0) {
      let f = [];
      for (let p of o) {
        if (typeof p == 'string') {
          e.changedContent.push({ content: p, extension: 'html' });
          continue;
        }
        if (p instanceof RegExp) {
          F.warn('root-regex', [
            'Regular expressions in `safelist` work differently in Tailwind CSS v3.0.',
            'Update your `safelist` configuration to eliminate this warning.',
            'https://tailwindcss.com/docs/content-configuration#safelisting-classes',
          ]);
          continue;
        }
        f.push(p);
      }
      if (f.length > 0) {
        let p = new Map(),
          d = e.tailwindConfig.prefix.length,
          h = f.some((y) => y.pattern.source.includes('!'));
        for (let y of a) {
          let x = Array.isArray(y)
            ? (() => {
                let [w, b] = y,
                  S = Object.keys(b?.values ?? {}).map((_) => Qr(w, _));
                return (
                  b?.supportsNegativeValues &&
                    ((S = [...S, ...S.map((_) => '-' + _)]),
                    (S = [
                      ...S,
                      ...S.map((_) => _.slice(0, d) + '-' + _.slice(d)),
                    ])),
                  b.types.some(({ type: _ }) => _ === 'color') &&
                    (S = [
                      ...S,
                      ...S.flatMap((_) =>
                        Object.keys(e.tailwindConfig.theme.opacity).map(
                          (E) => `${_}/${E}`,
                        ),
                      ),
                    ]),
                  h &&
                    b?.respectImportant &&
                    (S = [...S, ...S.map((_) => '!' + _)]),
                  S
                );
              })()
            : [y];
          for (let w of x)
            for (let { pattern: b, variants: k = [] } of f)
              if (((b.lastIndex = 0), p.has(b) || p.set(b, 0), !!b.test(w))) {
                p.set(b, p.get(b) + 1),
                  e.changedContent.push({ content: w, extension: 'html' });
                for (let S of k)
                  e.changedContent.push({
                    content: S + e.tailwindConfig.separator + w,
                    extension: 'html',
                  });
              }
        }
        for (let [y, x] of p.entries())
          x === 0 &&
            F.warn([
              `The safelist pattern \`${y}\` doesn't match any Tailwind CSS classes.`,
              'Fix this pattern or remove it from your `safelist` configuration.',
              'https://tailwindcss.com/docs/content-configuration#safelisting-classes',
            ]);
      }
    }
    let u = [].concat(e.tailwindConfig.darkMode ?? 'media')[1] ?? 'dark',
      c = [ho(e, u), ho(e, 'group'), ho(e, 'peer')];
    (e.getClassOrder = function (p) {
      let d = [...p].sort((w, b) => (w === b ? 0 : w < b ? -1 : 1)),
        h = new Map(d.map((w) => [w, null])),
        y = Sn(new Set(d), e);
      y = e.offsets.sort(y);
      let x = BigInt(c.length);
      for (let [, w] of y) {
        let b = w.raws.tailwind.candidate;
        h.set(b, h.get(b) ?? x++);
      }
      return p.map((w) => {
        let b = h.get(w) ?? null,
          k = c.indexOf(w);
        return b === null && k !== -1 && (b = BigInt(k)), [w, b];
      });
    }),
      (e.getClassList = function (p = {}) {
        let d = [];
        for (let h of a)
          if (Array.isArray(h)) {
            let [y, x] = h,
              w = [],
              b = Object.keys(x?.modifiers ?? {});
            x?.types?.some(({ type: _ }) => _ === 'color') &&
              b.push(...Object.keys(e.tailwindConfig.theme.opacity ?? {}));
            let k = { modifiers: b },
              S = p.includeMetadata && b.length > 0;
            for (let [_, E] of Object.entries(x?.values ?? {})) {
              if (E == null) continue;
              let I = Qr(y, _);
              if (
                (d.push(S ? [I, k] : I), x?.supportsNegativeValues && Xe(E))
              ) {
                let B = Qr(y, `-${_}`);
                w.push(S ? [B, k] : B);
              }
            }
            d.push(...w);
          } else d.push(h);
        return d;
      }),
      (e.getVariants = function () {
        let p = [];
        for (let [d, h] of e.variantOptions.entries())
          h.variantInfo !== po.Base &&
            p.push({
              name: d,
              isArbitrary: h.type === Symbol.for('MATCH_VARIANT'),
              values: Object.keys(h.values ?? {}),
              hasDash: d !== '@',
              selectors({ modifier: y, value: x } = {}) {
                let w = '__TAILWIND_PLACEHOLDER__',
                  b = z.rule({ selector: `.${w}` }),
                  k = z.root({ nodes: [b.clone()] }),
                  S = k.toString(),
                  _ = (e.variantMap.get(d) ?? []).flatMap(([$, oe]) => oe),
                  E = [];
                for (let $ of _) {
                  let oe = [],
                    ai = {
                      args: { modifier: y, value: h.values?.[x] ?? x },
                      separator: e.tailwindConfig.separator,
                      modifySelectors(Ce) {
                        return (
                          k.each((Jn) => {
                            Jn.type === 'rule' &&
                              (Jn.selectors = Jn.selectors.map((lu) =>
                                Ce({
                                  get className() {
                                    return ao(lu);
                                  },
                                  selector: lu,
                                }),
                              ));
                          }),
                          k
                        );
                      },
                      format(Ce) {
                        oe.push(Ce);
                      },
                      wrap(Ce) {
                        oe.push(`@${Ce.name} ${Ce.params} { & }`);
                      },
                      container: k,
                    },
                    oi = $(ai);
                  if ((oe.length > 0 && E.push(oe), Array.isArray(oi)))
                    for (let Ce of oi) (oe = []), Ce(ai), E.push(oe);
                }
                let I = [],
                  B = k.toString();
                S !== B &&
                  (k.walkRules(($) => {
                    let oe = $.selector,
                      ai = (0, fo.default)((oi) => {
                        oi.walkClasses((Ce) => {
                          Ce.value = `${d}${e.tailwindConfig.separator}${Ce.value}`;
                        });
                      }).processSync(oe);
                    I.push(oe.replace(ai, '&').replace(w, '&'));
                  }),
                  k.walkAtRules(($) => {
                    I.push(`@${$.name} (${$.params}) { & }`);
                  }));
                let q = !(x in (h.values ?? {})),
                  X = h[Jr] ?? {},
                  ae = (() => !(q || X.respectPrefix === !1))();
                (E = E.map(($) =>
                  $.map((oe) => ({ format: oe, respectPrefix: ae })),
                )),
                  (I = I.map(($) => ({ format: $, respectPrefix: ae })));
                let ge = { candidate: w, context: e },
                  je = E.map(($) =>
                    wn(`.${w}`, Nt($, ge), ge)
                      .replace(`.${w}`, '&')
                      .replace('{ & }', '')
                      .trim(),
                  );
                return (
                  I.length > 0 &&
                    je.push(Nt(I, ge).toString().replace(`.${w}`, '&')),
                  je
                );
              },
            });
        return p;
      });
  }
  function Vd(i, e) {
    !i.classCache.has(e) ||
      (i.notClassCache.add(e),
      i.classCache.delete(e),
      i.applyClassCache.delete(e),
      i.candidateRuleMap.delete(e),
      i.candidateRuleCache.delete(e),
      (i.stylesheetCache = null));
  }
  function YC(i, e) {
    let t = e.raws.tailwind.candidate;
    if (!!t) {
      for (let r of i.ruleCache)
        r[1].raws.tailwind.candidate === t && i.ruleCache.delete(r);
      Vd(i, t);
    }
  }
  function go(i, e = [], t = z.root()) {
    let r = {
        disposables: [],
        ruleCache: new Set(),
        candidateRuleCache: new Map(),
        classCache: new Map(),
        applyClassCache: new Map(),
        notClassCache: new Set(i.blocklist ?? []),
        postCssNodeCache: new Map(),
        candidateRuleMap: new Map(),
        tailwindConfig: i,
        changedContent: e,
        variantMap: new Map(),
        stylesheetCache: null,
        variantOptions: new Map(),
        markInvalidUtilityCandidate: (a) => Vd(r, a),
        markInvalidUtilityNode: (a) => YC(r, a),
      },
      n = GC(r, t);
    return HC(n, r), r;
  }
  function Ud(i, e, t, r, n, a) {
    let s = e.opts.from,
      o = r !== null;
    Pe.DEBUG && console.log('Source path:', s);
    let u;
    if (o && Lt.has(s)) u = Lt.get(s);
    else if (ei.has(n)) {
      let d = ei.get(n);
      lt.get(d).add(s), Lt.set(s, d), (u = d);
    }
    let c = Pd(s, i);
    if (u) {
      let [d, h] = jd([...a], On(u));
      if (!d && !c) return [u, !1, h];
    }
    if (Lt.has(s)) {
      let d = Lt.get(s);
      if (lt.has(d) && (lt.get(d).delete(s), lt.get(d).size === 0)) {
        lt.delete(d);
        for (let [h, y] of ei) y === d && ei.delete(h);
        for (let h of d.disposables.splice(0)) h(d);
      }
    }
    Pe.DEBUG && console.log('Setting up new context...');
    let f = go(t, [], i);
    Object.assign(f, { userConfigPath: r });
    let [, p] = jd([...a], On(f));
    return (
      ei.set(n, f),
      Lt.set(s, f),
      lt.has(f) || lt.set(f, new Set()),
      lt.get(f).add(s),
      [f, !0, p]
    );
  }
  var Fd,
    fo,
    Jr,
    co,
    po,
    mo,
    Lt,
    ei,
    lt,
    Xr = C(() => {
      l();
      ze();
      bs();
      nt();
      (Fd = K(js())), (fo = K(Me()));
      Hr();
      Ua();
      un();
      xt();
      Mt();
      Ga();
      cr();
      yd();
      ot();
      ot();
      pi();
      Ee();
      fi();
      Ka();
      Cn();
      Dd();
      Bd();
      De();
      io();
      (Jr = Symbol()),
        (co = {
          AddVariant: Symbol.for('ADD_VARIANT'),
          MatchVariant: Symbol.for('MATCH_VARIANT'),
        }),
        (po = { Base: 1 << 0, Dynamic: 1 << 1 });
      mo = new WeakMap();
      (Lt = wd), (ei = bd), (lt = gn);
    });
  function yo(i) {
    return i.ignore
      ? []
      : i.glob
      ? m.env.ROLLUP_WATCH === 'true'
        ? [{ type: 'dependency', file: i.base }]
        : [{ type: 'dir-dependency', dir: i.base, glob: i.glob }]
      : [{ type: 'dependency', file: i.base }];
  }
  var Wd = C(() => {
    l();
  });
  function Gd(i, e) {
    return { handler: i, config: e };
  }
  var Hd,
    Yd = C(() => {
      l();
      Gd.withOptions = function (i, e = () => ({})) {
        let t = function (r) {
          return { __options: r, handler: i(r), config: e(r) };
        };
        return (
          (t.__isOptionsFunction = !0),
          (t.__pluginFunction = i),
          (t.__configFunction = e),
          t
        );
      };
      Hd = Gd;
    });
  var wo = {};
  Ae(wo, { default: () => QC });
  var QC,
    bo = C(() => {
      l();
      Yd();
      QC = Hd;
    });
  var Jd = v((ID, Qd) => {
    l();
    var JC = (bo(), wo).default,
      XC = {
        overflow: 'hidden',
        display: '-webkit-box',
        '-webkit-box-orient': 'vertical',
      },
      KC = JC(
        function ({
          matchUtilities: i,
          addUtilities: e,
          theme: t,
          variants: r,
        }) {
          let n = t('lineClamp');
          i(
            { 'line-clamp': (a) => ({ ...XC, '-webkit-line-clamp': `${a}` }) },
            { values: n },
          ),
            e(
              [{ '.line-clamp-none': { '-webkit-line-clamp': 'unset' } }],
              r('lineClamp'),
            );
        },
        {
          theme: {
            lineClamp: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6' },
          },
          variants: { lineClamp: ['responsive'] },
        },
      );
    Qd.exports = KC;
  });
  function vo(i) {
    i.content.files.length === 0 &&
      F.warn('content-problems', [
        'The `content` option in your Tailwind CSS configuration is missing or empty.',
        'Configure your content sources or your generated CSS will be missing styles.',
        'https://tailwindcss.com/docs/content-configuration',
      ]);
    try {
      let e = Jd();
      i.plugins.includes(e) &&
        (F.warn('line-clamp-in-core', [
          'As of Tailwind CSS v3.3, the `@tailwindcss/line-clamp` plugin is now included by default.',
          'Remove it from the `plugins` array in your configuration to eliminate this warning.',
        ]),
        (i.plugins = i.plugins.filter((t) => t !== e)));
    } catch {}
    return i;
  }
  var Xd = C(() => {
    l();
    Ee();
  });
  var Kd,
    Zd = C(() => {
      l();
      Kd = () => !1;
    });
  var Tn,
    eh = C(() => {
      l();
      Tn = {
        sync: (i) => [].concat(i),
        generateTasks: (i) => [
          {
            dynamic: !1,
            base: '.',
            negative: [],
            positive: [].concat(i),
            patterns: [].concat(i),
          },
        ],
        escapePath: (i) => i,
      };
    });
  var xo,
    th = C(() => {
      l();
      xo = (i) => i;
    });
  var rh,
    ih = C(() => {
      l();
      rh = () => '';
    });
  function nh(i) {
    let e = i,
      t = rh(i);
    return (
      t !== '.' &&
        ((e = i.substr(t.length)), e.charAt(0) === '/' && (e = e.substr(1))),
      e.substr(0, 2) === './' && (e = e.substr(2)),
      e.charAt(0) === '/' && (e = e.substr(1)),
      { base: t, glob: e }
    );
  }
  var sh = C(() => {
    l();
    ih();
  });
  function ah(i, e) {
    let t = e.content.files;
    (t = t.filter((o) => typeof o == 'string')), (t = t.map(xo));
    let r = Tn.generateTasks(t),
      n = [],
      a = [];
    for (let o of r)
      n.push(...o.positive.map((u) => oh(u, !1))),
        a.push(...o.negative.map((u) => oh(u, !0)));
    let s = [...n, ...a];
    return (s = e2(i, s)), (s = s.flatMap(t2)), (s = s.map(ZC)), s;
  }
  function oh(i, e) {
    let t = { original: i, base: i, ignore: e, pattern: i, glob: null };
    return Kd(i) && Object.assign(t, nh(i)), t;
  }
  function ZC(i) {
    let e = xo(i.base);
    return (
      (e = Tn.escapePath(e)),
      (i.pattern = i.glob ? `${e}/${i.glob}` : e),
      (i.pattern = i.ignore ? `!${i.pattern}` : i.pattern),
      i
    );
  }
  function e2(i, e) {
    let t = [];
    return (
      i.userConfigPath &&
        i.tailwindConfig.content.relative &&
        (t = [Z.dirname(i.userConfigPath)]),
      e.map((r) => ((r.base = Z.resolve(...t, r.base)), r))
    );
  }
  function t2(i) {
    let e = [i];
    try {
      let t = te.realpathSync(i.base);
      t !== i.base && e.push({ ...i, base: t });
    } catch {}
    return e;
  }
  function lh(i, e, t) {
    let r = i.tailwindConfig.content.files
        .filter((s) => typeof s.raw == 'string')
        .map(({ raw: s, extension: o = 'html' }) => ({
          content: s,
          extension: o,
        })),
      [n, a] = r2(e, t);
    for (let s of n) {
      let o = Z.extname(s).slice(1);
      r.push({ file: s, extension: o });
    }
    return [r, a];
  }
  function r2(i, e) {
    let t = i.map((s) => s.pattern),
      r = new Map(),
      n = new Set();
    Pe.DEBUG && console.time('Finding changed files');
    let a = Tn.sync(t, { absolute: !0 });
    for (let s of a) {
      let o = e.get(s) || -1 / 0,
        u = te.statSync(s).mtimeMs;
      u > o && (n.add(s), r.set(s, u));
    }
    return Pe.DEBUG && console.timeEnd('Finding changed files'), [n, r];
  }
  var uh = C(() => {
    l();
    ze();
    mt();
    Zd();
    eh();
    th();
    sh();
    ot();
  });
  function fh() {}
  var ch = C(() => {
    l();
  });
  function a2(i, e) {
    for (let t of e) {
      let r = `${i}${t}`;
      if (te.existsSync(r) && te.statSync(r).isFile()) return r;
    }
    for (let t of e) {
      let r = `${i}/index${t}`;
      if (te.existsSync(r)) return r;
    }
    return null;
  }
  function* ph(i, e, t, r = Z.extname(i)) {
    let n = a2(Z.resolve(e, i), i2.includes(r) ? n2 : s2);
    if (n === null || t.has(n)) return;
    t.add(n), yield n, (e = Z.dirname(n)), (r = Z.extname(n));
    let a = te.readFileSync(n, 'utf-8');
    for (let s of [
      ...a.matchAll(/import[\s\S]*?['"](.{3,}?)['"]/gi),
      ...a.matchAll(/import[\s\S]*from[\s\S]*?['"](.{3,}?)['"]/gi),
      ...a.matchAll(/require\(['"`](.+)['"`]\)/gi),
    ])
      !s[1].startsWith('.') || (yield* ph(s[1], e, t, r));
  }
  function ko(i) {
    return i === null ? new Set() : new Set(ph(i, Z.dirname(i), new Set()));
  }
  var i2,
    n2,
    s2,
    dh = C(() => {
      l();
      ze();
      mt();
      (i2 = ['.js', '.cjs', '.mjs']),
        (n2 = [
          '',
          '.js',
          '.cjs',
          '.mjs',
          '.ts',
          '.cts',
          '.mts',
          '.jsx',
          '.tsx',
        ]),
        (s2 = [
          '',
          '.ts',
          '.cts',
          '.mts',
          '.tsx',
          '.js',
          '.cjs',
          '.mjs',
          '.jsx',
        ]);
    });
  function o2(i, e) {
    if (So.has(i)) return So.get(i);
    let t = ah(i, e);
    return So.set(i, t).get(i);
  }
  function l2(i) {
    let e = ys(i);
    if (e !== null) {
      let [r, n, a, s] = mh.get(e) || [],
        o = ko(e),
        u = !1,
        c = new Map();
      for (let d of o) {
        let h = te.statSync(d).mtimeMs;
        c.set(d, h), (!s || !s.has(d) || h > s.get(d)) && (u = !0);
      }
      if (!u) return [r, e, n, a];
      for (let d of o) delete fu.cache[d];
      let f = vo(dr(fh(e))),
        p = ui(f);
      return mh.set(e, [f, p, o, c]), [f, e, p, o];
    }
    let t = dr(i?.config ?? i ?? {});
    return (t = vo(t)), [t, null, ui(t), []];
  }
  function Co(i) {
    return ({ tailwindDirectives: e, registerDependency: t }) =>
      (r, n) => {
        let [a, s, o, u] = l2(i),
          c = new Set(u);
        if (e.size > 0) {
          c.add(n.opts.from);
          for (let y of n.messages) y.type === 'dependency' && c.add(y.file);
        }
        let [f, , p] = Ud(r, n, a, s, o, c),
          d = On(f),
          h = o2(f, a);
        if (e.size > 0) {
          for (let w of h) for (let b of yo(w)) t(b);
          let [y, x] = lh(f, h, d);
          for (let w of y) f.changedContent.push(w);
          for (let [w, b] of x.entries()) p.set(w, b);
        }
        for (let y of u) t({ type: 'dependency', file: y });
        for (let [y, x] of p.entries()) d.set(y, x);
        return f;
      };
  }
  var hh,
    mh,
    So,
    gh = C(() => {
      l();
      ze();
      hh = K(Xn());
      mu();
      gs();
      af();
      Xr();
      Wd();
      Xd();
      uh();
      ch();
      dh();
      (mh = new hh.default({ maxSize: 100 })), (So = new WeakMap());
    });
  function Ao(i) {
    let e = new Set(),
      t = new Set(),
      r = new Set();
    if (
      (i.walkAtRules((n) => {
        n.name === 'apply' && r.add(n),
          n.name === 'import' &&
            (n.params === '"tailwindcss/base"' ||
            n.params === "'tailwindcss/base'"
              ? ((n.name = 'tailwind'), (n.params = 'base'))
              : n.params === '"tailwindcss/components"' ||
                n.params === "'tailwindcss/components'"
              ? ((n.name = 'tailwind'), (n.params = 'components'))
              : n.params === '"tailwindcss/utilities"' ||
                n.params === "'tailwindcss/utilities'"
              ? ((n.name = 'tailwind'), (n.params = 'utilities'))
              : (n.params === '"tailwindcss/screens"' ||
                  n.params === "'tailwindcss/screens'" ||
                  n.params === '"tailwindcss/variants"' ||
                  n.params === "'tailwindcss/variants'") &&
                ((n.name = 'tailwind'), (n.params = 'variants'))),
          n.name === 'tailwind' &&
            (n.params === 'screens' && (n.params = 'variants'),
            e.add(n.params)),
          ['layer', 'responsive', 'variants'].includes(n.name) &&
            (['responsive', 'variants'].includes(n.name) &&
              F.warn(`${n.name}-at-rule-deprecated`, [
                `The \`@${n.name}\` directive has been deprecated in Tailwind CSS v3.0.`,
                'Use `@layer utilities` or `@layer components` instead.',
                'https://tailwindcss.com/docs/upgrade-guide#replace-variants-with-layer',
              ]),
            t.add(n));
      }),
      !e.has('base') || !e.has('components') || !e.has('utilities'))
    ) {
      for (let n of t)
        if (
          n.name === 'layer' &&
          ['base', 'components', 'utilities'].includes(n.params)
        ) {
          if (!e.has(n.params))
            throw n.error(
              `\`@layer ${n.params}\` is used but no matching \`@tailwind ${n.params}\` directive is present.`,
            );
        } else if (n.name === 'responsive') {
          if (!e.has('utilities'))
            throw n.error(
              '`@responsive` is used but `@tailwind utilities` is missing.',
            );
        } else if (n.name === 'variants' && !e.has('utilities'))
          throw n.error(
            '`@variants` is used but `@tailwind utilities` is missing.',
          );
    }
    return { tailwindDirectives: e, applyDirectives: r };
  }
  var yh = C(() => {
    l();
    Ee();
  });
  function bt(i, e = void 0, t = void 0) {
    return i.map((r) => {
      let n = r.clone(),
        a = r.raws.tailwind?.preserveSource !== !0 || !n.source;
      return (
        e !== void 0 &&
          a &&
          ((n.source = e),
          'walk' in n &&
            n.walk((s) => {
              s.source = e;
            })),
        t !== void 0 && (n.raws.tailwind = { ...n.raws.tailwind, ...t }),
        n
      );
    });
  }
  var wh = C(() => {
    l();
  });
  function Pn(i) {
    return (
      (i = Array.isArray(i) ? i : [i]),
      (i = i.map((e) => (e instanceof RegExp ? e.source : e))),
      i.join('')
    );
  }
  function xe(i) {
    return new RegExp(Pn(i), 'g');
  }
  function $t(i) {
    return `(?:${i.map(Pn).join('|')})`;
  }
  function _o(i) {
    return `(?:${Pn(i)})?`;
  }
  function vh(i) {
    return `(?:${Pn(i)})*`;
  }
  function xh(i) {
    return i && u2.test(i) ? i.replace(bh, '\\$&') : i || '';
  }
  var bh,
    u2,
    kh = C(() => {
      l();
      (bh = /[\\^$.*+?()[\]{}|]/g), (u2 = RegExp(bh.source));
    });
  function Sh(i) {
    let e = Array.from(f2(i));
    return (t) => {
      let r = [];
      for (let n of e) r = [...r, ...(t.match(n) ?? [])];
      return r.filter((n) => n !== void 0).map(d2);
    };
  }
  function* f2(i) {
    let e = i.tailwindConfig.separator,
      t = J(i.tailwindConfig, 'variantGrouping'),
      r =
        i.tailwindConfig.prefix !== ''
          ? _o(xe([/-?/, xh(i.tailwindConfig.prefix)]))
          : '',
      n = $t([
        /\[[^\s:'"`]+:[^\s\[\]]+\]/,
        /\[[^\s:'"`]+:[^\s]+?\[[^\s]+\][^\s]+?\]/,
        xe([
          /-?(?:\w+)/,
          _o(
            $t([
              xe([
                /-(?:\w+-)*\[[^\s:]+\]/,
                /(?![{([]])/,
                /(?:\/[^\s'"`\\><$]*)?/,
              ]),
              xe([/-(?:\w+-)*\[[^\s]+\]/, /(?![{([]])/, /(?:\/[^\s'"`\\$]*)?/]),
              /[-\/][^\s'"`\\$={><]*/,
            ]),
          ),
        ]),
      ]),
      a = [
        $t([
          xe([/@\[[^\s"'`]+\](\/[^\s"'`]+)?/, e]),
          xe([/([^\s"'`\[\\]+-)?\[[^\s"'`]+\]/, e]),
          xe([/[^\s"'`\[\\]+/, e]),
        ]),
        $t([xe([/([^\s"'`\[\\]+-)?\[[^\s`]+\]/, e]), xe([/[^\s`\[\\]+/, e])]),
      ];
    for (let s of a)
      yield xe([
        '((?=((',
        s,
        ')+))\\2)?',
        /!?/,
        r,
        t ? $t([xe([/\(/, n, vh([/,/, n]), /\)/]), n]) : n,
      ]);
    yield /[^<>"'`\s.(){}[\]#=%$]*[^<>"'`\s.(){}[\]#=%:$]/g;
  }
  function d2(i) {
    if (!i.includes('-[')) return i;
    let e = 0,
      t = [],
      r = i.matchAll(c2);
    r = Array.from(r).flatMap((n) => {
      let [, ...a] = n;
      return a.map((s, o) =>
        Object.assign([], n, { index: n.index + o, 0: s }),
      );
    });
    for (let n of r) {
      let a = n[0],
        s = t[t.length - 1];
      if (
        (a === s ? t.pop() : (a === "'" || a === '"' || a === '`') && t.push(a),
        !s)
      ) {
        if (a === '[') {
          e++;
          continue;
        } else if (a === ']') {
          e--;
          continue;
        }
        if (e < 0) return i.substring(0, n.index - 1);
        if (e === 0 && !p2.test(a)) return i.substring(0, n.index);
      }
    }
    return i;
  }
  var c2,
    p2,
    Ch = C(() => {
      l();
      De();
      kh();
      (c2 = /([\[\]'"`])([^\[\]'"`])?/g), (p2 = /[^"'`\s<>\]]+/);
    });
  function h2(i, e) {
    let t = i.tailwindConfig.content.extract;
    return t[e] || t.DEFAULT || _h[e] || _h.DEFAULT(i);
  }
  function m2(i, e) {
    let t = i.content.transform;
    return t[e] || t.DEFAULT || Eh[e] || Eh.DEFAULT;
  }
  function g2(i, e, t, r) {
    ti.has(e) || ti.set(e, new Ah.default({ maxSize: 25e3 }));
    for (let n of i.split(`
`))
      if (((n = n.trim()), !r.has(n)))
        if ((r.add(n), ti.get(e).has(n)))
          for (let a of ti.get(e).get(n)) t.add(a);
        else {
          let a = e(n).filter((o) => o !== '!*'),
            s = new Set(a);
          for (let o of s) t.add(o);
          ti.get(e).set(n, s);
        }
  }
  function y2(i, e) {
    let t = e.offsets.sort(i),
      r = {
        base: new Set(),
        defaults: new Set(),
        components: new Set(),
        utilities: new Set(),
        variants: new Set(),
      };
    for (let [n, a] of t) r[n.layer].add(a);
    return r;
  }
  function Eo(i) {
    return async (e) => {
      let t = { base: null, components: null, utilities: null, variants: null };
      if (
        (e.walkAtRules((y) => {
          y.name === 'tailwind' &&
            Object.keys(t).includes(y.params) &&
            (t[y.params] = y);
        }),
        Object.values(t).every((y) => y === null))
      )
        return e;
      let r = new Set([...(i.candidates ?? []), He]),
        n = new Set();
      Ye.DEBUG && console.time('Reading changed files'),
        await Promise.all(
          i.changedContent.map(
            async ({ file: y, content: x, extension: w }) => {
              let b = m2(i.tailwindConfig, w),
                k = h2(i, w);
              (x = y ? await te.promises.readFile(y, 'utf8') : x),
                g2(b(x), k, r, n);
            },
          ),
        ),
        Ye.DEBUG && console.timeEnd('Reading changed files');
      let a = i.classCache.size;
      Ye.DEBUG && console.time('Generate rules'),
        Ye.DEBUG && console.time('Sorting candidates');
      let s = new Set([...r].sort((y, x) => (y === x ? 0 : y < x ? -1 : 1)));
      Ye.DEBUG && console.timeEnd('Sorting candidates'),
        Sn(s, i),
        Ye.DEBUG && console.timeEnd('Generate rules'),
        Ye.DEBUG && console.time('Build stylesheet'),
        (i.stylesheetCache === null || i.classCache.size !== a) &&
          (i.stylesheetCache = y2([...i.ruleCache], i)),
        Ye.DEBUG && console.timeEnd('Build stylesheet');
      let {
        defaults: o,
        base: u,
        components: c,
        utilities: f,
        variants: p,
      } = i.stylesheetCache;
      t.base &&
        (t.base.before(bt([...u, ...o], t.base.source, { layer: 'base' })),
        t.base.remove()),
        t.components &&
          (t.components.before(
            bt([...c], t.components.source, { layer: 'components' }),
          ),
          t.components.remove()),
        t.utilities &&
          (t.utilities.before(
            bt([...f], t.utilities.source, { layer: 'utilities' }),
          ),
          t.utilities.remove());
      let d = Array.from(p).filter((y) => {
        let x = y.raws.tailwind?.parentLayer;
        return x === 'components'
          ? t.components !== null
          : x === 'utilities'
          ? t.utilities !== null
          : !0;
      });
      t.variants
        ? (t.variants.before(bt(d, t.variants.source, { layer: 'variants' })),
          t.variants.remove())
        : d.length > 0 && e.append(bt(d, e.source, { layer: 'variants' }));
      let h = d.some((y) => y.raws.tailwind?.parentLayer === 'utilities');
      t.utilities &&
        f.size === 0 &&
        !h &&
        F.warn('content-problems', [
          'No utility classes were detected in your source files. If this is unexpected, double-check the `content` option in your Tailwind CSS configuration.',
          'https://tailwindcss.com/docs/content-configuration',
        ]),
        Ye.DEBUG &&
          (console.log('Potential classes: ', r.size),
          console.log('Active contexts: ', gn.size)),
        (i.changedContent = []),
        e.walkAtRules('layer', (y) => {
          Object.keys(t).includes(y.params) && y.remove();
        });
    };
  }
  var Ah,
    Ye,
    _h,
    Eh,
    ti,
    Oh = C(() => {
      l();
      ze();
      Ah = K(Xn());
      ot();
      Cn();
      Ee();
      wh();
      Ch();
      (Ye = Pe),
        (_h = { DEFAULT: Sh }),
        (Eh = {
          DEFAULT: (i) => i,
          svelte: (i) => i.replace(/(?:^|\s)class:/g, ' '),
        });
      ti = new WeakMap();
    });
  function In(i) {
    let e = new Map();
    z.root({ nodes: [i.clone()] }).walkRules((a) => {
      (0, Dn.default)((s) => {
        s.walkClasses((o) => {
          let u = o.parent.toString(),
            c = e.get(u);
          c || e.set(u, (c = new Set())), c.add(o.value);
        });
      }).processSync(a.selector);
    });
    let r = Array.from(e.values(), (a) => Array.from(a)),
      n = r.flat();
    return Object.assign(n, { groups: r });
  }
  function Oo(i) {
    return w2.astSync(i);
  }
  function Th(i, e) {
    let t = new Set();
    for (let r of i) t.add(r.split(e).pop());
    return Array.from(t);
  }
  function Ph(i, e) {
    let t = i.tailwindConfig.prefix;
    return typeof t == 'function' ? t(e) : t + e;
  }
  function* Dh(i) {
    for (yield i; i.parent; ) yield i.parent, (i = i.parent);
  }
  function b2(i, e = {}) {
    let t = i.nodes;
    i.nodes = [];
    let r = i.clone(e);
    return (i.nodes = t), r;
  }
  function v2(i) {
    for (let e of Dh(i))
      if (i !== e) {
        if (e.type === 'root') break;
        i = b2(e, { nodes: [i] });
      }
    return i;
  }
  function x2(i, e) {
    let t = new Map();
    return (
      i.walkRules((r) => {
        for (let s of Dh(r)) if (s.raws.tailwind?.layer !== void 0) return;
        let n = v2(r),
          a = e.offsets.create('user');
        for (let s of In(r)) {
          let o = t.get(s) || [];
          t.set(s, o), o.push([{ layer: 'user', sort: a, important: !1 }, n]);
        }
      }),
      t
    );
  }
  function k2(i, e) {
    for (let t of i) {
      if (e.notClassCache.has(t) || e.applyClassCache.has(t)) continue;
      if (e.classCache.has(t)) {
        e.applyClassCache.set(
          t,
          e.classCache.get(t).map(([n, a]) => [n, a.clone()]),
        );
        continue;
      }
      let r = Array.from(xn(t, e));
      if (r.length === 0) {
        e.notClassCache.add(t);
        continue;
      }
      e.applyClassCache.set(t, r);
    }
    return e.applyClassCache;
  }
  function S2(i) {
    let e = null;
    return {
      get: (t) => ((e = e || i()), e.get(t)),
      has: (t) => ((e = e || i()), e.has(t)),
    };
  }
  function C2(i) {
    return {
      get: (e) => i.flatMap((t) => t.get(e) || []),
      has: (e) => i.some((t) => t.has(e)),
    };
  }
  function Ih(i) {
    let e = i.split(/[\s\t\n]+/g);
    return e[e.length - 1] === '!important' ? [e.slice(0, -1), !0] : [e, !1];
  }
  function qh(i, e, t) {
    let r = new Set(),
      n = [];
    if (
      (i.walkAtRules('apply', (u) => {
        let [c] = Ih(u.params);
        for (let f of c) r.add(f);
        n.push(u);
      }),
      n.length === 0)
    )
      return;
    let a = C2([t, k2(r, e)]);
    function s(u, c, f) {
      let p = Oo(u),
        d = Oo(c),
        y = Oo(`.${ce(f)}`).nodes[0].nodes[0];
      return (
        p.each((x) => {
          let w = new Set();
          d.each((b) => {
            let k = !1;
            (b = b.clone()),
              b.walkClasses((S) => {
                S.value === y.value &&
                  (k ||
                    (S.replaceWith(...x.nodes.map((_) => _.clone())),
                    w.add(b),
                    (k = !0)));
              });
          });
          for (let b of w) {
            let k = [[]];
            for (let S of b.nodes)
              S.type === 'combinator'
                ? (k.push(S), k.push([]))
                : k[k.length - 1].push(S);
            b.nodes = [];
            for (let S of k)
              Array.isArray(S) &&
                S.sort((_, E) =>
                  _.type === 'tag' && E.type === 'class'
                    ? -1
                    : _.type === 'class' && E.type === 'tag'
                    ? 1
                    : _.type === 'class' &&
                      E.type === 'pseudo' &&
                      E.value.startsWith('::')
                    ? -1
                    : _.type === 'pseudo' &&
                      _.value.startsWith('::') &&
                      E.type === 'class'
                    ? 1
                    : 0,
                ),
                (b.nodes = b.nodes.concat(S));
          }
          x.replaceWith(...w);
        }),
        p.toString()
      );
    }
    let o = new Map();
    for (let u of n) {
      let [c] = o.get(u.parent) || [[], u.source];
      o.set(u.parent, [c, u.source]);
      let [f, p] = Ih(u.params);
      if (u.parent.type === 'atrule') {
        if (u.parent.name === 'screen') {
          let d = u.parent.params;
          throw u.error(
            `@apply is not supported within nested at-rules like @screen. We suggest you write this as @apply ${f
              .map((h) => `${d}:${h}`)
              .join(' ')} instead.`,
          );
        }
        throw u.error(
          `@apply is not supported within nested at-rules like @${u.parent.name}. You can fix this by un-nesting @${u.parent.name}.`,
        );
      }
      for (let d of f) {
        if ([Ph(e, 'group'), Ph(e, 'peer')].includes(d))
          throw u.error(`@apply should not be used with the '${d}' utility`);
        if (!a.has(d))
          throw u.error(
            `The \`${d}\` class does not exist. If \`${d}\` is a custom class, make sure it is defined within a \`@layer\` directive.`,
          );
        let h = a.get(d);
        c.push([d, p, h]);
      }
    }
    for (let [u, [c, f]] of o) {
      let p = [];
      for (let [h, y, x] of c) {
        let w = [h, ...Th([h], e.tailwindConfig.separator)];
        for (let [b, k] of x) {
          let S = In(u),
            _ = In(k);
          if (
            ((_ = _.groups.filter((q) => q.some((X) => w.includes(X))).flat()),
            (_ = _.concat(Th(_, e.tailwindConfig.separator))),
            S.some((q) => _.includes(q)))
          )
            throw k.error(
              `You cannot \`@apply\` the \`${h}\` utility here because it creates a circular dependency.`,
            );
          let I = z.root({ nodes: [k.clone()] });
          I.walk((q) => {
            q.source = f;
          }),
            (k.type !== 'atrule' ||
              (k.type === 'atrule' && k.name !== 'keyframes')) &&
              I.walkRules((q) => {
                if (!In(q).some(($) => $ === h)) {
                  q.remove();
                  return;
                }
                let X =
                    typeof e.tailwindConfig.important == 'string'
                      ? e.tailwindConfig.important
                      : null,
                  ge =
                    u.raws.tailwind !== void 0 &&
                    X &&
                    u.selector.indexOf(X) === 0
                      ? u.selector.slice(X.length)
                      : u.selector;
                (q.selector = s(ge, q.selector, h)),
                  X && ge !== u.selector && (q.selector = bn(q.selector, X)),
                  q.walkDecls(($) => {
                    $.important = b.important || y;
                  });
                let je = (0, Dn.default)().astSync(q.selector);
                je.each(($) => Ft($)), (q.selector = je.toString());
              }),
            !!I.nodes[0] && p.push([b.sort, I.nodes[0]]);
        }
      }
      let d = e.offsets.sort(p).map((h) => h[1]);
      u.after(d);
    }
    for (let u of n) u.parent.nodes.length > 1 ? u.remove() : u.parent.remove();
    qh(i, e, t);
  }
  function To(i) {
    return (e) => {
      let t = S2(() => x2(e, i));
      qh(e, i, t);
    };
  }
  var Dn,
    w2,
    Rh = C(() => {
      l();
      nt();
      Dn = K(Me());
      Cn();
      Mt();
      so();
      yn();
      w2 = (0, Dn.default)();
    });
  var Mh = v((PI, qn) => {
    l();
    (function () {
      'use strict';
      function i(r, n, a) {
        if (!r) return null;
        i.caseSensitive || (r = r.toLowerCase());
        var s = i.threshold === null ? null : i.threshold * r.length,
          o = i.thresholdAbsolute,
          u;
        s !== null && o !== null
          ? (u = Math.min(s, o))
          : s !== null
          ? (u = s)
          : o !== null
          ? (u = o)
          : (u = null);
        var c,
          f,
          p,
          d,
          h,
          y = n.length;
        for (h = 0; h < y; h++)
          if (
            ((f = n[h]),
            a && (f = f[a]),
            !!f &&
              (i.caseSensitive ? (p = f) : (p = f.toLowerCase()),
              (d = t(r, p, u)),
              (u === null || d < u) &&
                ((u = d),
                a && i.returnWinningObject ? (c = n[h]) : (c = f),
                i.returnFirstMatch)))
          )
            return c;
        return c || i.nullResultValue;
      }
      (i.threshold = 0.4),
        (i.thresholdAbsolute = 20),
        (i.caseSensitive = !1),
        (i.nullResultValue = null),
        (i.returnWinningObject = null),
        (i.returnFirstMatch = !1),
        typeof qn != 'undefined' && qn.exports
          ? (qn.exports = i)
          : (window.didYouMean = i);
      var e = Math.pow(2, 32) - 1;
      function t(r, n, a) {
        a = a || a === 0 ? a : e;
        var s = r.length,
          o = n.length;
        if (s === 0) return Math.min(a + 1, o);
        if (o === 0) return Math.min(a + 1, s);
        if (Math.abs(s - o) > a) return a + 1;
        var u = [],
          c,
          f,
          p,
          d,
          h;
        for (c = 0; c <= o; c++) u[c] = [c];
        for (f = 0; f <= s; f++) u[0][f] = f;
        for (c = 1; c <= o; c++) {
          for (
            p = e,
              d = 1,
              c > a && (d = c - a),
              h = o + 1,
              h > a + c && (h = a + c),
              f = 1;
            f <= s;
            f++
          )
            f < d || f > h
              ? (u[c][f] = a + 1)
              : n.charAt(c - 1) === r.charAt(f - 1)
              ? (u[c][f] = u[c - 1][f - 1])
              : (u[c][f] = Math.min(
                  u[c - 1][f - 1] + 1,
                  Math.min(u[c][f - 1] + 1, u[c - 1][f] + 1),
                )),
              u[c][f] < p && (p = u[c][f]);
          if (p > a) return a + 1;
        }
        return u[o][s];
      }
    })();
  });
  var Fh = v((DI, Bh) => {
    l();
    var Po = '('.charCodeAt(0),
      Do = ')'.charCodeAt(0),
      Rn = "'".charCodeAt(0),
      Io = '"'.charCodeAt(0),
      qo = '\\'.charCodeAt(0),
      jt = '/'.charCodeAt(0),
      Ro = ','.charCodeAt(0),
      Mo = ':'.charCodeAt(0),
      Mn = '*'.charCodeAt(0),
      A2 = 'u'.charCodeAt(0),
      _2 = 'U'.charCodeAt(0),
      E2 = '+'.charCodeAt(0),
      O2 = /^[a-f0-9?-]+$/i;
    Bh.exports = function (i) {
      for (
        var e = [],
          t = i,
          r,
          n,
          a,
          s,
          o,
          u,
          c,
          f,
          p = 0,
          d = t.charCodeAt(p),
          h = t.length,
          y = [{ nodes: e }],
          x = 0,
          w,
          b = '',
          k = '',
          S = '';
        p < h;

      )
        if (d <= 32) {
          r = p;
          do (r += 1), (d = t.charCodeAt(r));
          while (d <= 32);
          (s = t.slice(p, r)),
            (a = e[e.length - 1]),
            d === Do && x
              ? (S = s)
              : a && a.type === 'div'
              ? ((a.after = s), (a.sourceEndIndex += s.length))
              : d === Ro ||
                d === Mo ||
                (d === jt &&
                  t.charCodeAt(r + 1) !== Mn &&
                  (!w || (w && w.type === 'function' && !1)))
              ? (k = s)
              : e.push({
                  type: 'space',
                  sourceIndex: p,
                  sourceEndIndex: r,
                  value: s,
                }),
            (p = r);
        } else if (d === Rn || d === Io) {
          (r = p),
            (n = d === Rn ? "'" : '"'),
            (s = { type: 'string', sourceIndex: p, quote: n });
          do
            if (((o = !1), (r = t.indexOf(n, r + 1)), ~r))
              for (u = r; t.charCodeAt(u - 1) === qo; ) (u -= 1), (o = !o);
            else (t += n), (r = t.length - 1), (s.unclosed = !0);
          while (o);
          (s.value = t.slice(p + 1, r)),
            (s.sourceEndIndex = s.unclosed ? r : r + 1),
            e.push(s),
            (p = r + 1),
            (d = t.charCodeAt(p));
        } else if (d === jt && t.charCodeAt(p + 1) === Mn)
          (r = t.indexOf('*/', p)),
            (s = { type: 'comment', sourceIndex: p, sourceEndIndex: r + 2 }),
            r === -1 &&
              ((s.unclosed = !0), (r = t.length), (s.sourceEndIndex = r)),
            (s.value = t.slice(p + 2, r)),
            e.push(s),
            (p = r + 2),
            (d = t.charCodeAt(p));
        else if ((d === jt || d === Mn) && w && w.type === 'function')
          (s = t[p]),
            e.push({
              type: 'word',
              sourceIndex: p - k.length,
              sourceEndIndex: p + s.length,
              value: s,
            }),
            (p += 1),
            (d = t.charCodeAt(p));
        else if (d === jt || d === Ro || d === Mo)
          (s = t[p]),
            e.push({
              type: 'div',
              sourceIndex: p - k.length,
              sourceEndIndex: p + s.length,
              value: s,
              before: k,
              after: '',
            }),
            (k = ''),
            (p += 1),
            (d = t.charCodeAt(p));
        else if (Po === d) {
          r = p;
          do (r += 1), (d = t.charCodeAt(r));
          while (d <= 32);
          if (
            ((f = p),
            (s = {
              type: 'function',
              sourceIndex: p - b.length,
              value: b,
              before: t.slice(f + 1, r),
            }),
            (p = r),
            b === 'url' && d !== Rn && d !== Io)
          ) {
            r -= 1;
            do
              if (((o = !1), (r = t.indexOf(')', r + 1)), ~r))
                for (u = r; t.charCodeAt(u - 1) === qo; ) (u -= 1), (o = !o);
              else (t += ')'), (r = t.length - 1), (s.unclosed = !0);
            while (o);
            c = r;
            do (c -= 1), (d = t.charCodeAt(c));
            while (d <= 32);
            f < c
              ? (p !== c + 1
                  ? (s.nodes = [
                      {
                        type: 'word',
                        sourceIndex: p,
                        sourceEndIndex: c + 1,
                        value: t.slice(p, c + 1),
                      },
                    ])
                  : (s.nodes = []),
                s.unclosed && c + 1 !== r
                  ? ((s.after = ''),
                    s.nodes.push({
                      type: 'space',
                      sourceIndex: c + 1,
                      sourceEndIndex: r,
                      value: t.slice(c + 1, r),
                    }))
                  : ((s.after = t.slice(c + 1, r)), (s.sourceEndIndex = r)))
              : ((s.after = ''), (s.nodes = [])),
              (p = r + 1),
              (s.sourceEndIndex = s.unclosed ? r : p),
              (d = t.charCodeAt(p)),
              e.push(s);
          } else
            (x += 1),
              (s.after = ''),
              (s.sourceEndIndex = p + 1),
              e.push(s),
              y.push(s),
              (e = s.nodes = []),
              (w = s);
          b = '';
        } else if (Do === d && x)
          (p += 1),
            (d = t.charCodeAt(p)),
            (w.after = S),
            (w.sourceEndIndex += S.length),
            (S = ''),
            (x -= 1),
            (y[y.length - 1].sourceEndIndex = p),
            y.pop(),
            (w = y[x]),
            (e = w.nodes);
        else {
          r = p;
          do d === qo && (r += 1), (r += 1), (d = t.charCodeAt(r));
          while (
            r < h &&
            !(
              d <= 32 ||
              d === Rn ||
              d === Io ||
              d === Ro ||
              d === Mo ||
              d === jt ||
              d === Po ||
              (d === Mn && w && w.type === 'function' && !0) ||
              (d === jt && w.type === 'function' && !0) ||
              (d === Do && x)
            )
          );
          (s = t.slice(p, r)),
            Po === d
              ? (b = s)
              : (A2 === s.charCodeAt(0) || _2 === s.charCodeAt(0)) &&
                E2 === s.charCodeAt(1) &&
                O2.test(s.slice(2))
              ? e.push({
                  type: 'unicode-range',
                  sourceIndex: p,
                  sourceEndIndex: r,
                  value: s,
                })
              : e.push({
                  type: 'word',
                  sourceIndex: p,
                  sourceEndIndex: r,
                  value: s,
                }),
            (p = r);
        }
      for (p = y.length - 1; p; p -= 1)
        (y[p].unclosed = !0), (y[p].sourceEndIndex = t.length);
      return y[0].nodes;
    };
  });
  var Lh = v((II, Nh) => {
    l();
    Nh.exports = function i(e, t, r) {
      var n, a, s, o;
      for (n = 0, a = e.length; n < a; n += 1)
        (s = e[n]),
          r || (o = t(s, n, e)),
          o !== !1 &&
            s.type === 'function' &&
            Array.isArray(s.nodes) &&
            i(s.nodes, t, r),
          r && t(s, n, e);
    };
  });
  var Vh = v((qI, zh) => {
    l();
    function $h(i, e) {
      var t = i.type,
        r = i.value,
        n,
        a;
      return e && (a = e(i)) !== void 0
        ? a
        : t === 'word' || t === 'space'
        ? r
        : t === 'string'
        ? ((n = i.quote || ''), n + r + (i.unclosed ? '' : n))
        : t === 'comment'
        ? '/*' + r + (i.unclosed ? '' : '*/')
        : t === 'div'
        ? (i.before || '') + r + (i.after || '')
        : Array.isArray(i.nodes)
        ? ((n = jh(i.nodes, e)),
          t !== 'function'
            ? n
            : r +
              '(' +
              (i.before || '') +
              n +
              (i.after || '') +
              (i.unclosed ? '' : ')'))
        : r;
    }
    function jh(i, e) {
      var t, r;
      if (Array.isArray(i)) {
        for (t = '', r = i.length - 1; ~r; r -= 1) t = $h(i[r], e) + t;
        return t;
      }
      return $h(i, e);
    }
    zh.exports = jh;
  });
  var Wh = v((RI, Uh) => {
    l();
    var Bn = '-'.charCodeAt(0),
      Fn = '+'.charCodeAt(0),
      Bo = '.'.charCodeAt(0),
      T2 = 'e'.charCodeAt(0),
      P2 = 'E'.charCodeAt(0);
    function D2(i) {
      var e = i.charCodeAt(0),
        t;
      if (e === Fn || e === Bn) {
        if (((t = i.charCodeAt(1)), t >= 48 && t <= 57)) return !0;
        var r = i.charCodeAt(2);
        return t === Bo && r >= 48 && r <= 57;
      }
      return e === Bo
        ? ((t = i.charCodeAt(1)), t >= 48 && t <= 57)
        : e >= 48 && e <= 57;
    }
    Uh.exports = function (i) {
      var e = 0,
        t = i.length,
        r,
        n,
        a;
      if (t === 0 || !D2(i)) return !1;
      for (
        r = i.charCodeAt(e), (r === Fn || r === Bn) && e++;
        e < t && ((r = i.charCodeAt(e)), !(r < 48 || r > 57));

      )
        e += 1;
      if (
        ((r = i.charCodeAt(e)),
        (n = i.charCodeAt(e + 1)),
        r === Bo && n >= 48 && n <= 57)
      )
        for (e += 2; e < t && ((r = i.charCodeAt(e)), !(r < 48 || r > 57)); )
          e += 1;
      if (
        ((r = i.charCodeAt(e)),
        (n = i.charCodeAt(e + 1)),
        (a = i.charCodeAt(e + 2)),
        (r === T2 || r === P2) &&
          ((n >= 48 && n <= 57) ||
            ((n === Fn || n === Bn) && a >= 48 && a <= 57)))
      )
        for (
          e += n === Fn || n === Bn ? 3 : 2;
          e < t && ((r = i.charCodeAt(e)), !(r < 48 || r > 57));

        )
          e += 1;
      return { number: i.slice(0, e), unit: i.slice(e) };
    };
  });
  var Qh = v((MI, Yh) => {
    l();
    var I2 = Fh(),
      Gh = Lh(),
      Hh = Vh();
    function ut(i) {
      return this instanceof ut ? ((this.nodes = I2(i)), this) : new ut(i);
    }
    ut.prototype.toString = function () {
      return Array.isArray(this.nodes) ? Hh(this.nodes) : '';
    };
    ut.prototype.walk = function (i, e) {
      return Gh(this.nodes, i, e), this;
    };
    ut.unit = Wh();
    ut.walk = Gh;
    ut.stringify = Hh;
    Yh.exports = ut;
  });
  function No(i) {
    return typeof i == 'object' && i !== null;
  }
  function q2(i, e) {
    let t = Ke(e);
    do if ((t.pop(), (0, ri.default)(i, t) !== void 0)) break;
    while (t.length);
    return t.length ? t : void 0;
  }
  function zt(i) {
    return typeof i == 'string'
      ? i
      : i.reduce(
          (e, t, r) =>
            t.includes('.') ? `${e}[${t}]` : r === 0 ? t : `${e}.${t}`,
          '',
        );
  }
  function Xh(i) {
    return i.map((e) => `'${e}'`).join(', ');
  }
  function Kh(i) {
    return Xh(Object.keys(i));
  }
  function Lo(i, e, t, r = {}) {
    let n = Array.isArray(e) ? zt(e) : e.replace(/^['"]+|['"]+$/g, ''),
      a = Array.isArray(e) ? e : Ke(n),
      s = (0, ri.default)(i.theme, a, t);
    if (s === void 0) {
      let u = `'${n}' does not exist in your theme config.`,
        c = a.slice(0, -1),
        f = (0, ri.default)(i.theme, c);
      if (No(f)) {
        let p = Object.keys(f).filter((h) => Lo(i, [...c, h]).isValid),
          d = (0, Jh.default)(a[a.length - 1], p);
        d
          ? (u += ` Did you mean '${zt([...c, d])}'?`)
          : p.length > 0 &&
            (u += ` '${zt(c)}' has the following valid keys: ${Xh(p)}`);
      } else {
        let p = q2(i.theme, n);
        if (p) {
          let d = (0, ri.default)(i.theme, p);
          No(d)
            ? (u += ` '${zt(p)}' has the following keys: ${Kh(d)}`)
            : (u += ` '${zt(p)}' is not an object.`);
        } else
          u += ` Your theme has the following top-level keys: ${Kh(i.theme)}`;
      }
      return { isValid: !1, error: u };
    }
    if (
      !(
        typeof s == 'string' ||
        typeof s == 'number' ||
        typeof s == 'function' ||
        s instanceof String ||
        s instanceof Number ||
        Array.isArray(s)
      )
    ) {
      let u = `'${n}' was found but does not resolve to a string.`;
      if (No(s)) {
        let c = Object.keys(s).filter((f) => Lo(i, [...a, f]).isValid);
        c.length &&
          (u += ` Did you mean something like '${zt([...a, c[0]])}'?`);
      }
      return { isValid: !1, error: u };
    }
    let [o] = a;
    return { isValid: !0, value: Ge(o)(s, r) };
  }
  function R2(i, e, t) {
    e = e.map((n) => Zh(i, n, t));
    let r = [''];
    for (let n of e)
      n.type === 'div' && n.value === ','
        ? r.push('')
        : (r[r.length - 1] += Fo.default.stringify(n));
    return r;
  }
  function Zh(i, e, t) {
    if (e.type === 'function' && t[e.value] !== void 0) {
      let r = R2(i, e.nodes, t);
      (e.type = 'word'), (e.value = t[e.value](i, ...r));
    }
    return e;
  }
  function M2(i, e, t) {
    return Object.keys(t).some((n) => e.includes(`${n}(`))
      ? (0, Fo.default)(e)
          .walk((n) => {
            Zh(i, n, t);
          })
          .toString()
      : e;
  }
  function* F2(i) {
    i = i.replace(/^['"]+|['"]+$/g, '');
    let e = i.match(/^([^\s]+)(?![^\[]*\])(?:\s*\/\s*([^\/\s]+))$/),
      t;
    yield [i, void 0], e && ((i = e[1]), (t = e[2]), yield [i, t]);
  }
  function N2(i, e, t) {
    let r = Array.from(F2(e)).map(([n, a]) =>
      Object.assign(Lo(i, n, t, { opacityValue: a }), {
        resolvedPath: n,
        alpha: a,
      }),
    );
    return r.find((n) => n.isValid) ?? r[0];
  }
  function em(i) {
    let e = i.tailwindConfig,
      t = {
        theme: (r, n, ...a) => {
          let {
            isValid: s,
            value: o,
            error: u,
            alpha: c,
          } = N2(e, n, a.length ? a : void 0);
          if (!s) {
            let d = r.parent,
              h = d?.raws.tailwind?.candidate;
            if (d && h !== void 0) {
              i.markInvalidUtilityNode(d),
                d.remove(),
                F.warn('invalid-theme-key-in-class', [
                  `The utility \`${h}\` contains an invalid theme value and was not generated.`,
                ]);
              return;
            }
            throw r.error(u);
          }
          let f = kt(o),
            p = f !== void 0 && typeof f == 'function';
          return (
            (c !== void 0 || p) && (c === void 0 && (c = 1), (o = Ie(f, c, f))),
            o
          );
        },
        screen: (r, n) => {
          n = n.replace(/^['"]+/g, '').replace(/['"]+$/g, '');
          let s = at(e.theme.screens).find(({ name: o }) => o === n);
          if (!s)
            throw r.error(`The '${n}' screen does not exist in your theme.`);
          return st(s);
        },
      };
    return (r) => {
      r.walk((n) => {
        let a = B2[n.type];
        a !== void 0 && (n[a] = M2(n, n[a], t));
      });
    };
  }
  var ri,
    Jh,
    Fo,
    B2,
    tm = C(() => {
      l();
      (ri = K(js())), (Jh = K(Mh()));
      Hr();
      Fo = K(Qh());
      hn();
      cn();
      pi();
      ar();
      cr();
      Ee();
      B2 = { atrule: 'params', decl: 'value' };
    });
  function rm({ tailwindConfig: { theme: i } }) {
    return function (e) {
      e.walkAtRules('screen', (t) => {
        let r = t.params,
          a = at(i.screens).find(({ name: s }) => s === r);
        if (!a) throw t.error(`No \`${r}\` screen found.`);
        (t.name = 'media'), (t.params = st(a));
      });
    };
  }
  var im = C(() => {
    l();
    hn();
    cn();
  });
  function L2(i) {
    let e = i
        .filter((o) =>
          o.type !== 'pseudo' || o.nodes.length > 0
            ? !0
            : o.value.startsWith('::') ||
              [':before', ':after', ':first-line', ':first-letter'].includes(
                o.value,
              ),
        )
        .reverse(),
      t = new Set(['tag', 'class', 'id', 'attribute']),
      r = e.findIndex((o) => t.has(o.type));
    if (r === -1) return e.reverse().join('').trim();
    let n = e[r],
      a = nm[n.type] ? nm[n.type](n) : n;
    e = e.slice(0, r);
    let s = e.findIndex((o) => o.type === 'combinator' && o.value === '>');
    return (
      s !== -1 && (e.splice(0, s), e.unshift(Nn.default.universal())),
      [a, ...e.reverse()].join('').trim()
    );
  }
  function j2(i) {
    return $o.has(i) || $o.set(i, $2.transformSync(i)), $o.get(i);
  }
  function jo({ tailwindConfig: i }) {
    return (e) => {
      let t = new Map(),
        r = new Set();
      if (
        (e.walkAtRules('defaults', (n) => {
          if (n.nodes && n.nodes.length > 0) {
            r.add(n);
            return;
          }
          let a = n.params;
          t.has(a) || t.set(a, new Set()), t.get(a).add(n.parent), n.remove();
        }),
        J(i, 'optimizeUniversalDefaults'))
      )
        for (let n of r) {
          let a = new Map(),
            s = t.get(n.params) ?? [];
          for (let o of s)
            for (let u of j2(o.selector)) {
              let c = u.includes(':-') || u.includes('::-') ? u : '__DEFAULT__',
                f = a.get(c) ?? new Set();
              a.set(c, f), f.add(u);
            }
          if (J(i, 'optimizeUniversalDefaults')) {
            if (a.size === 0) {
              n.remove();
              continue;
            }
            for (let [, o] of a) {
              let u = z.rule({ source: n.source });
              (u.selectors = [...o]),
                u.append(n.nodes.map((c) => c.clone())),
                n.before(u);
            }
          }
          n.remove();
        }
      else if (r.size) {
        let n = z.rule({ selectors: ['*', '::before', '::after'] });
        for (let s of r)
          n.append(s.nodes),
            n.parent || s.before(n),
            n.source || (n.source = s.source),
            s.remove();
        let a = n.clone({ selectors: ['::backdrop'] });
        n.after(a);
      }
    };
  }
  var Nn,
    nm,
    $2,
    $o,
    sm = C(() => {
      l();
      nt();
      Nn = K(Me());
      De();
      nm = {
        id(i) {
          return Nn.default.attribute({
            attribute: 'id',
            operator: '=',
            value: i.value,
            quoteMark: '"',
          });
        },
      };
      ($2 = (0, Nn.default)((i) =>
        i.map((e) => {
          let t = e
            .split((r) => r.type === 'combinator' && r.value === ' ')
            .pop();
          return L2(t);
        }),
      )),
        ($o = new Map());
    });
  function zo() {
    function i(e) {
      let t = null;
      e.each((r) => {
        if (!z2.has(r.type)) {
          t = null;
          return;
        }
        if (t === null) {
          t = r;
          return;
        }
        let n = am[r.type];
        r.type === 'atrule' && r.name === 'font-face'
          ? (t = r)
          : n.every(
              (a) =>
                (r[a] ?? '').replace(/\s+/g, ' ') ===
                (t[a] ?? '').replace(/\s+/g, ' '),
            )
          ? (r.nodes && t.append(r.nodes), r.remove())
          : (t = r);
      }),
        e.each((r) => {
          r.type === 'atrule' && i(r);
        });
    }
    return (e) => {
      i(e);
    };
  }
  var am,
    z2,
    om = C(() => {
      l();
      (am = { atrule: ['name', 'params'], rule: ['selector'] }),
        (z2 = new Set(Object.keys(am)));
    });
  function Vo() {
    return (i) => {
      i.walkRules((e) => {
        let t = new Map(),
          r = new Set([]),
          n = new Map();
        e.walkDecls((a) => {
          if (a.parent === e) {
            if (t.has(a.prop)) {
              if (t.get(a.prop).value === a.value) {
                r.add(t.get(a.prop)), t.set(a.prop, a);
                return;
              }
              n.has(a.prop) || n.set(a.prop, new Set()),
                n.get(a.prop).add(t.get(a.prop)),
                n.get(a.prop).add(a);
            }
            t.set(a.prop, a);
          }
        });
        for (let a of r) a.remove();
        for (let a of n.values()) {
          let s = new Map();
          for (let o of a) {
            let u = U2(o.value);
            u !== null && (s.has(u) || s.set(u, new Set()), s.get(u).add(o));
          }
          for (let o of s.values()) {
            let u = Array.from(o).slice(0, -1);
            for (let c of u) c.remove();
          }
        }
      });
    };
  }
  function U2(i) {
    let e = /^-?\d*.?\d+([\w%]+)?$/g.exec(i);
    return e ? e[1] ?? V2 : null;
  }
  var V2,
    lm = C(() => {
      l();
      V2 = Symbol('unitless-number');
    });
  function W2(i) {
    if (!i.walkAtRules) return;
    let e = new Set();
    if (
      (i.walkAtRules('apply', (t) => {
        e.add(t.parent);
      }),
      e.size !== 0)
    )
      for (let t of e) {
        let r = [],
          n = [];
        for (let a of t.nodes)
          a.type === 'atrule' && a.name === 'apply'
            ? (n.length > 0 && (r.push(n), (n = [])), r.push([a]))
            : n.push(a);
        if ((n.length > 0 && r.push(n), r.length !== 1)) {
          for (let a of [...r].reverse()) {
            let s = t.clone({ nodes: [] });
            s.append(a), t.after(s);
          }
          t.remove();
        }
      }
  }
  function Ln() {
    return (i) => {
      W2(i);
    };
  }
  var um = C(() => {
    l();
  });
  function G2(i) {
    return i.type === 'root';
  }
  function H2(i) {
    return i.type === 'atrule' && i.name === 'layer';
  }
  function fm(i) {
    return (e, t) => {
      let r = !1;
      e.walkAtRules('tailwind', (n) => {
        if (r) return !1;
        if (n.parent && !(G2(n.parent) || H2(n.parent)))
          return (
            (r = !0),
            n.warn(
              t,
              [
                'Nested @tailwind rules were detected, but are not supported.',
                "Consider using a prefix to scope Tailwind's classes: https://tailwindcss.com/docs/configuration#prefix",
                'Alternatively, use the important selector strategy: https://tailwindcss.com/docs/configuration#selector-strategy',
              ].join(`
`),
            ),
            !1
          );
      }),
        e.walkRules((n) => {
          if (r) return !1;
          n.walkRules(
            (a) => (
              (r = !0),
              a.warn(
                t,
                [
                  'Nested CSS was detected, but CSS nesting has not been configured correctly.',
                  'Please enable a CSS nesting plugin *before* Tailwind in your configuration.',
                  'See how here: https://tailwindcss.com/docs/using-with-preprocessors#nesting',
                ].join(`
`),
              ),
              !1
            ),
          );
        });
    };
  }
  var cm = C(() => {
    l();
  });
  function $n(i) {
    return async function (e, t) {
      let { tailwindDirectives: r, applyDirectives: n } = Ao(e);
      fm()(e, t), Ln()(e, t);
      let a = i({
        tailwindDirectives: r,
        applyDirectives: n,
        registerDependency(s) {
          t.messages.push({ plugin: 'tailwindcss', parent: t.opts.from, ...s });
        },
        createContext(s, o) {
          return go(s, o, e);
        },
      })(e, t);
      if (a.tailwindConfig.separator === '-')
        throw new Error(
          "The '-' character cannot be used as a custom separator in JIT mode due to parsing ambiguity. Please use another character like '_' instead.",
        );
      _u(a.tailwindConfig),
        await Eo(a)(e, t),
        Ln()(e, t),
        To(a)(e, t),
        em(a)(e, t),
        rm(a)(e, t),
        jo(a)(e, t),
        zo(a)(e, t),
        Vo(a)(e, t);
    };
  }
  var pm = C(() => {
    l();
    yh();
    Oh();
    Rh();
    tm();
    im();
    sm();
    om();
    lm();
    um();
    cm();
    Xr();
    De();
  });
  function dm(i, e) {
    let t = null,
      r = null;
    return (
      i.walkAtRules('config', (n) => {
        if (((r = n.source?.input.file ?? e.opts.from ?? null), r === null))
          throw n.error(
            'The `@config` directive cannot be used without setting `from` in your PostCSS config.',
          );
        if (t)
          throw n.error('Only one `@config` directive is allowed per file.');
        let a = n.params.match(/(['"])(.*?)\1/);
        if (!a)
          throw n.error(
            'A path is required when using the `@config` directive.',
          );
        let s = a[2];
        if (Z.isAbsolute(s))
          throw n.error(
            'The `@config` directive cannot be used with an absolute path.',
          );
        if (((t = Z.resolve(Z.dirname(r), s)), !te.existsSync(t)))
          throw n.error(
            `The config file at "${s}" does not exist. Make sure the path is correct and the file exists.`,
          );
        n.remove();
      }),
      t || null
    );
  }
  var hm = C(() => {
    l();
    ze();
    mt();
  });
  var mm = v((v4, Uo) => {
    l();
    gh();
    pm();
    ot();
    hm();
    Uo.exports = function (e) {
      return {
        postcssPlugin: 'tailwindcss',
        plugins: [
          Pe.DEBUG &&
            function (t) {
              return (
                console.log(`
`),
                console.time('JIT TOTAL'),
                t
              );
            },
          async function (t, r) {
            e = dm(t, r) ?? e;
            let n = Co(e);
            if (t.type === 'document') {
              let a = t.nodes.filter((s) => s.type === 'root');
              for (let s of a) s.type === 'root' && (await $n(n)(s, r));
              return;
            }
            await $n(n)(t, r);
          },
          !1,
          Pe.DEBUG &&
            function (t) {
              return (
                console.timeEnd('JIT TOTAL'),
                console.log(`
`),
                t
              );
            },
        ].filter(Boolean),
      };
    };
    Uo.exports.postcss = !0;
  });
  var ym = v((x4, gm) => {
    l();
    gm.exports = mm();
  });
  var Wo = v((k4, wm) => {
    l();
    wm.exports = () => [
      'and_chr 114',
      'and_uc 15.5',
      'chrome 114',
      'chrome 113',
      'chrome 109',
      'edge 114',
      'firefox 114',
      'ios_saf 16.5',
      'ios_saf 16.4',
      'ios_saf 16.3',
      'ios_saf 16.1',
      'opera 99',
      'safari 16.5',
      'samsung 21',
    ];
  });
  var jn = {};
  Ae(jn, { agents: () => Y2, feature: () => Q2 });
  function Q2() {
    return {
      status: 'cr',
      title: 'CSS Feature Queries',
      stats: {
        ie: { 6: 'n', 7: 'n', 8: 'n', 9: 'n', 10: 'n', 11: 'n', 5.5: 'n' },
        edge: {
          12: 'y',
          13: 'y',
          14: 'y',
          15: 'y',
          16: 'y',
          17: 'y',
          18: 'y',
          79: 'y',
          80: 'y',
          81: 'y',
          83: 'y',
          84: 'y',
          85: 'y',
          86: 'y',
          87: 'y',
          88: 'y',
          89: 'y',
          90: 'y',
          91: 'y',
          92: 'y',
          93: 'y',
          94: 'y',
          95: 'y',
          96: 'y',
          97: 'y',
          98: 'y',
          99: 'y',
          100: 'y',
          101: 'y',
          102: 'y',
          103: 'y',
          104: 'y',
          105: 'y',
          106: 'y',
          107: 'y',
          108: 'y',
          109: 'y',
          110: 'y',
          111: 'y',
          112: 'y',
          113: 'y',
          114: 'y',
        },
        firefox: {
          2: 'n',
          3: 'n',
          4: 'n',
          5: 'n',
          6: 'n',
          7: 'n',
          8: 'n',
          9: 'n',
          10: 'n',
          11: 'n',
          12: 'n',
          13: 'n',
          14: 'n',
          15: 'n',
          16: 'n',
          17: 'n',
          18: 'n',
          19: 'n',
          20: 'n',
          21: 'n',
          22: 'y',
          23: 'y',
          24: 'y',
          25: 'y',
          26: 'y',
          27: 'y',
          28: 'y',
          29: 'y',
          30: 'y',
          31: 'y',
          32: 'y',
          33: 'y',
          34: 'y',
          35: 'y',
          36: 'y',
          37: 'y',
          38: 'y',
          39: 'y',
          40: 'y',
          41: 'y',
          42: 'y',
          43: 'y',
          44: 'y',
          45: 'y',
          46: 'y',
          47: 'y',
          48: 'y',
          49: 'y',
          50: 'y',
          51: 'y',
          52: 'y',
          53: 'y',
          54: 'y',
          55: 'y',
          56: 'y',
          57: 'y',
          58: 'y',
          59: 'y',
          60: 'y',
          61: 'y',
          62: 'y',
          63: 'y',
          64: 'y',
          65: 'y',
          66: 'y',
          67: 'y',
          68: 'y',
          69: 'y',
          70: 'y',
          71: 'y',
          72: 'y',
          73: 'y',
          74: 'y',
          75: 'y',
          76: 'y',
          77: 'y',
          78: 'y',
          79: 'y',
          80: 'y',
          81: 'y',
          82: 'y',
          83: 'y',
          84: 'y',
          85: 'y',
          86: 'y',
          87: 'y',
          88: 'y',
          89: 'y',
          90: 'y',
          91: 'y',
          92: 'y',
          93: 'y',
          94: 'y',
          95: 'y',
          96: 'y',
          97: 'y',
          98: 'y',
          99: 'y',
          100: 'y',
          101: 'y',
          102: 'y',
          103: 'y',
          104: 'y',
          105: 'y',
          106: 'y',
          107: 'y',
          108: 'y',
          109: 'y',
          110: 'y',
          111: 'y',
          112: 'y',
          113: 'y',
          114: 'y',
          115: 'y',
          116: 'y',
          117: 'y',
          3.5: 'n',
          3.6: 'n',
        },
        chrome: {
          4: 'n',
          5: 'n',
          6: 'n',
          7: 'n',
          8: 'n',
          9: 'n',
          10: 'n',
          11: 'n',
          12: 'n',
          13: 'n',
          14: 'n',
          15: 'n',
          16: 'n',
          17: 'n',
          18: 'n',
          19: 'n',
          20: 'n',
          21: 'n',
          22: 'n',
          23: 'n',
          24: 'n',
          25: 'n',
          26: 'n',
          27: 'n',
          28: 'y',
          29: 'y',
          30: 'y',
          31: 'y',
          32: 'y',
          33: 'y',
          34: 'y',
          35: 'y',
          36: 'y',
          37: 'y',
          38: 'y',
          39: 'y',
          40: 'y',
          41: 'y',
          42: 'y',
          43: 'y',
          44: 'y',
          45: 'y',
          46: 'y',
          47: 'y',
          48: 'y',
          49: 'y',
          50: 'y',
          51: 'y',
          52: 'y',
          53: 'y',
          54: 'y',
          55: 'y',
          56: 'y',
          57: 'y',
          58: 'y',
          59: 'y',
          60: 'y',
          61: 'y',
          62: 'y',
          63: 'y',
          64: 'y',
          65: 'y',
          66: 'y',
          67: 'y',
          68: 'y',
          69: 'y',
          70: 'y',
          71: 'y',
          72: 'y',
          73: 'y',
          74: 'y',
          75: 'y',
          76: 'y',
          77: 'y',
          78: 'y',
          79: 'y',
          80: 'y',
          81: 'y',
          83: 'y',
          84: 'y',
          85: 'y',
          86: 'y',
          87: 'y',
          88: 'y',
          89: 'y',
          90: 'y',
          91: 'y',
          92: 'y',
          93: 'y',
          94: 'y',
          95: 'y',
          96: 'y',
          97: 'y',
          98: 'y',
          99: 'y',
          100: 'y',
          101: 'y',
          102: 'y',
          103: 'y',
          104: 'y',
          105: 'y',
          106: 'y',
          107: 'y',
          108: 'y',
          109: 'y',
          110: 'y',
          111: 'y',
          112: 'y',
          113: 'y',
          114: 'y',
          115: 'y',
          116: 'y',
          117: 'y',
        },
        safari: {
          4: 'n',
          5: 'n',
          6: 'n',
          7: 'n',
          8: 'n',
          9: 'y',
          10: 'y',
          11: 'y',
          12: 'y',
          13: 'y',
          14: 'y',
          15: 'y',
          17: 'y',
          9.1: 'y',
          10.1: 'y',
          11.1: 'y',
          12.1: 'y',
          13.1: 'y',
          14.1: 'y',
          15.1: 'y',
          '15.2-15.3': 'y',
          15.4: 'y',
          15.5: 'y',
          15.6: 'y',
          '16.0': 'y',
          16.1: 'y',
          16.2: 'y',
          16.3: 'y',
          16.4: 'y',
          16.5: 'y',
          16.6: 'y',
          TP: 'y',
          3.1: 'n',
          3.2: 'n',
          5.1: 'n',
          6.1: 'n',
          7.1: 'n',
        },
        opera: {
          9: 'n',
          11: 'n',
          12: 'n',
          15: 'y',
          16: 'y',
          17: 'y',
          18: 'y',
          19: 'y',
          20: 'y',
          21: 'y',
          22: 'y',
          23: 'y',
          24: 'y',
          25: 'y',
          26: 'y',
          27: 'y',
          28: 'y',
          29: 'y',
          30: 'y',
          31: 'y',
          32: 'y',
          33: 'y',
          34: 'y',
          35: 'y',
          36: 'y',
          37: 'y',
          38: 'y',
          39: 'y',
          40: 'y',
          41: 'y',
          42: 'y',
          43: 'y',
          44: 'y',
          45: 'y',
          46: 'y',
          47: 'y',
          48: 'y',
          49: 'y',
          50: 'y',
          51: 'y',
          52: 'y',
          53: 'y',
          54: 'y',
          55: 'y',
          56: 'y',
          57: 'y',
          58: 'y',
          60: 'y',
          62: 'y',
          63: 'y',
          64: 'y',
          65: 'y',
          66: 'y',
          67: 'y',
          68: 'y',
          69: 'y',
          70: 'y',
          71: 'y',
          72: 'y',
          73: 'y',
          74: 'y',
          75: 'y',
          76: 'y',
          77: 'y',
          78: 'y',
          79: 'y',
          80: 'y',
          81: 'y',
          82: 'y',
          83: 'y',
          84: 'y',
          85: 'y',
          86: 'y',
          87: 'y',
          88: 'y',
          89: 'y',
          90: 'y',
          91: 'y',
          92: 'y',
          93: 'y',
          94: 'y',
          95: 'y',
          96: 'y',
          97: 'y',
          98: 'y',
          99: 'y',
          100: 'y',
          12.1: 'y',
          '9.5-9.6': 'n',
          '10.0-10.1': 'n',
          10.5: 'n',
          10.6: 'n',
          11.1: 'n',
          11.5: 'n',
          11.6: 'n',
        },
        ios_saf: {
          8: 'n',
          17: 'y',
          '9.0-9.2': 'y',
          9.3: 'y',
          '10.0-10.2': 'y',
          10.3: 'y',
          '11.0-11.2': 'y',
          '11.3-11.4': 'y',
          '12.0-12.1': 'y',
          '12.2-12.5': 'y',
          '13.0-13.1': 'y',
          13.2: 'y',
          13.3: 'y',
          '13.4-13.7': 'y',
          '14.0-14.4': 'y',
          '14.5-14.8': 'y',
          '15.0-15.1': 'y',
          '15.2-15.3': 'y',
          15.4: 'y',
          15.5: 'y',
          15.6: 'y',
          '16.0': 'y',
          16.1: 'y',
          16.2: 'y',
          16.3: 'y',
          16.4: 'y',
          16.5: 'y',
          16.6: 'y',
          3.2: 'n',
          '4.0-4.1': 'n',
          '4.2-4.3': 'n',
          '5.0-5.1': 'n',
          '6.0-6.1': 'n',
          '7.0-7.1': 'n',
          '8.1-8.4': 'n',
        },
        op_mini: { all: 'y' },
        android: {
          3: 'n',
          4: 'n',
          114: 'y',
          4.4: 'y',
          '4.4.3-4.4.4': 'y',
          2.1: 'n',
          2.2: 'n',
          2.3: 'n',
          4.1: 'n',
          '4.2-4.3': 'n',
        },
        bb: { 7: 'n', 10: 'n' },
        op_mob: {
          10: 'n',
          11: 'n',
          12: 'n',
          73: 'y',
          11.1: 'n',
          11.5: 'n',
          12.1: 'n',
        },
        and_chr: { 114: 'y' },
        and_ff: { 115: 'y' },
        ie_mob: { 10: 'n', 11: 'n' },
        and_uc: { 15.5: 'y' },
        samsung: {
          4: 'y',
          20: 'y',
          21: 'y',
          '5.0-5.4': 'y',
          '6.2-6.4': 'y',
          '7.2-7.4': 'y',
          8.2: 'y',
          9.2: 'y',
          10.1: 'y',
          '11.1-11.2': 'y',
          '12.0': 'y',
          '13.0': 'y',
          '14.0': 'y',
          '15.0': 'y',
          '16.0': 'y',
          '17.0': 'y',
          '18.0': 'y',
          '19.0': 'y',
        },
        and_qq: { 13.1: 'y' },
        baidu: { 13.18: 'y' },
        kaios: { 2.5: 'y', '3.0-3.1': 'y' },
      },
    };
  }
  var Y2,
    zn = C(() => {
      l();
      Y2 = {
        ie: { prefix: 'ms' },
        edge: {
          prefix: 'webkit',
          prefix_exceptions: {
            12: 'ms',
            13: 'ms',
            14: 'ms',
            15: 'ms',
            16: 'ms',
            17: 'ms',
            18: 'ms',
          },
        },
        firefox: { prefix: 'moz' },
        chrome: { prefix: 'webkit' },
        safari: { prefix: 'webkit' },
        opera: {
          prefix: 'webkit',
          prefix_exceptions: {
            9: 'o',
            11: 'o',
            12: 'o',
            '9.5-9.6': 'o',
            '10.0-10.1': 'o',
            10.5: 'o',
            10.6: 'o',
            11.1: 'o',
            11.5: 'o',
            11.6: 'o',
            12.1: 'o',
          },
        },
        ios_saf: { prefix: 'webkit' },
        op_mini: { prefix: 'o' },
        android: { prefix: 'webkit' },
        bb: { prefix: 'webkit' },
        op_mob: { prefix: 'o', prefix_exceptions: { 73: 'webkit' } },
        and_chr: { prefix: 'webkit' },
        and_ff: { prefix: 'moz' },
        ie_mob: { prefix: 'ms' },
        and_uc: { prefix: 'webkit', prefix_exceptions: { 15.5: 'webkit' } },
        samsung: { prefix: 'webkit' },
        and_qq: { prefix: 'webkit' },
        baidu: { prefix: 'webkit' },
        kaios: { prefix: 'moz' },
      };
    });
  var bm = v(() => {
    l();
  });
  var ue = v((A4, ft) => {
    l();
    var { list: Go } = me();
    ft.exports.error = function (i) {
      let e = new Error(i);
      throw ((e.autoprefixer = !0), e);
    };
    ft.exports.uniq = function (i) {
      return [...new Set(i)];
    };
    ft.exports.removeNote = function (i) {
      return i.includes(' ') ? i.split(' ')[0] : i;
    };
    ft.exports.escapeRegexp = function (i) {
      return i.replace(/[$()*+-.?[\\\]^{|}]/g, '\\$&');
    };
    ft.exports.regexp = function (i, e = !0) {
      return (
        e && (i = this.escapeRegexp(i)),
        new RegExp(`(^|[\\s,(])(${i}($|[\\s(,]))`, 'gi')
      );
    };
    ft.exports.editList = function (i, e) {
      let t = Go.comma(i),
        r = e(t, []);
      if (t === r) return i;
      let n = i.match(/,\s*/);
      return (n = n ? n[0] : ', '), r.join(n);
    };
    ft.exports.splitSelector = function (i) {
      return Go.comma(i).map((e) =>
        Go.space(e).map((t) => t.split(/(?=\.|#)/g)),
      );
    };
  });
  var ct = v((_4, km) => {
    l();
    var J2 = Wo(),
      vm = (zn(), jn).agents,
      X2 = ue(),
      xm = class {
        static prefixes() {
          if (this.prefixesCache) return this.prefixesCache;
          this.prefixesCache = [];
          for (let e in vm) this.prefixesCache.push(`-${vm[e].prefix}-`);
          return (
            (this.prefixesCache = X2.uniq(this.prefixesCache).sort(
              (e, t) => t.length - e.length,
            )),
            this.prefixesCache
          );
        }
        static withPrefix(e) {
          return (
            this.prefixesRegexp ||
              (this.prefixesRegexp = new RegExp(this.prefixes().join('|'))),
            this.prefixesRegexp.test(e)
          );
        }
        constructor(e, t, r, n) {
          (this.data = e),
            (this.options = r || {}),
            (this.browserslistOpts = n || {}),
            (this.selected = this.parse(t));
        }
        parse(e) {
          let t = {};
          for (let r in this.browserslistOpts) t[r] = this.browserslistOpts[r];
          return (t.path = this.options.from), J2(e, t);
        }
        prefix(e) {
          let [t, r] = e.split(' '),
            n = this.data[t],
            a = n.prefix_exceptions && n.prefix_exceptions[r];
          return a || (a = n.prefix), `-${a}-`;
        }
        isSelected(e) {
          return this.selected.includes(e);
        }
      };
    km.exports = xm;
  });
  var ii = v((E4, Sm) => {
    l();
    Sm.exports = {
      prefix(i) {
        let e = i.match(/^(-\w+-)/);
        return e ? e[0] : '';
      },
      unprefixed(i) {
        return i.replace(/^-\w+-/, '');
      },
    };
  });
  var Vt = v((O4, Am) => {
    l();
    var K2 = ct(),
      Cm = ii(),
      Z2 = ue();
    function Ho(i, e) {
      let t = new i.constructor();
      for (let r of Object.keys(i || {})) {
        let n = i[r];
        r === 'parent' && typeof n == 'object'
          ? e && (t[r] = e)
          : r === 'source' || r === null
          ? (t[r] = n)
          : Array.isArray(n)
          ? (t[r] = n.map((a) => Ho(a, t)))
          : r !== '_autoprefixerPrefix' &&
            r !== '_autoprefixerValues' &&
            r !== 'proxyCache' &&
            (typeof n == 'object' && n !== null && (n = Ho(n, t)), (t[r] = n));
      }
      return t;
    }
    var Vn = class {
      static hack(e) {
        return (
          this.hacks || (this.hacks = {}),
          e.names.map((t) => ((this.hacks[t] = e), this.hacks[t]))
        );
      }
      static load(e, t, r) {
        let n = this.hacks && this.hacks[e];
        return n ? new n(e, t, r) : new this(e, t, r);
      }
      static clone(e, t) {
        let r = Ho(e);
        for (let n in t) r[n] = t[n];
        return r;
      }
      constructor(e, t, r) {
        (this.prefixes = t), (this.name = e), (this.all = r);
      }
      parentPrefix(e) {
        let t;
        return (
          typeof e._autoprefixerPrefix != 'undefined'
            ? (t = e._autoprefixerPrefix)
            : e.type === 'decl' && e.prop[0] === '-'
            ? (t = Cm.prefix(e.prop))
            : e.type === 'root'
            ? (t = !1)
            : e.type === 'rule' &&
              e.selector.includes(':-') &&
              /:(-\w+-)/.test(e.selector)
            ? (t = e.selector.match(/:(-\w+-)/)[1])
            : e.type === 'atrule' && e.name[0] === '-'
            ? (t = Cm.prefix(e.name))
            : (t = this.parentPrefix(e.parent)),
          K2.prefixes().includes(t) || (t = !1),
          (e._autoprefixerPrefix = t),
          e._autoprefixerPrefix
        );
      }
      process(e, t) {
        if (!this.check(e)) return;
        let r = this.parentPrefix(e),
          n = this.prefixes.filter((s) => !r || r === Z2.removeNote(s)),
          a = [];
        for (let s of n) this.add(e, s, a.concat([s]), t) && a.push(s);
        return a;
      }
      clone(e, t) {
        return Vn.clone(e, t);
      }
    };
    Am.exports = Vn;
  });
  var R = v((T4, Om) => {
    l();
    var eA = Vt(),
      tA = ct(),
      _m = ue(),
      Em = class extends eA {
        check() {
          return !0;
        }
        prefixed(e, t) {
          return t + e;
        }
        normalize(e) {
          return e;
        }
        otherPrefixes(e, t) {
          for (let r of tA.prefixes()) if (r !== t && e.includes(r)) return !0;
          return !1;
        }
        set(e, t) {
          return (e.prop = this.prefixed(e.prop, t)), e;
        }
        needCascade(e) {
          return (
            e._autoprefixerCascade ||
              (e._autoprefixerCascade =
                this.all.options.cascade !== !1 &&
                e.raw('before').includes(`
`)),
            e._autoprefixerCascade
          );
        }
        maxPrefixed(e, t) {
          if (t._autoprefixerMax) return t._autoprefixerMax;
          let r = 0;
          for (let n of e)
            (n = _m.removeNote(n)), n.length > r && (r = n.length);
          return (t._autoprefixerMax = r), t._autoprefixerMax;
        }
        calcBefore(e, t, r = '') {
          let a = this.maxPrefixed(e, t) - _m.removeNote(r).length,
            s = t.raw('before');
          return a > 0 && (s += Array(a).fill(' ').join('')), s;
        }
        restoreBefore(e) {
          let t = e.raw('before').split(`
`),
            r = t[t.length - 1];
          this.all.group(e).up((n) => {
            let a = n.raw('before').split(`
`),
              s = a[a.length - 1];
            s.length < r.length && (r = s);
          }),
            (t[t.length - 1] = r),
            (e.raws.before = t.join(`
`));
        }
        insert(e, t, r) {
          let n = this.set(this.clone(e), t);
          if (
            !(
              !n ||
              e.parent.some((s) => s.prop === n.prop && s.value === n.value)
            )
          )
            return (
              this.needCascade(e) && (n.raws.before = this.calcBefore(r, e, t)),
              e.parent.insertBefore(e, n)
            );
        }
        isAlready(e, t) {
          let r = this.all.group(e).up((n) => n.prop === t);
          return r || (r = this.all.group(e).down((n) => n.prop === t)), r;
        }
        add(e, t, r, n) {
          let a = this.prefixed(e.prop, t);
          if (!(this.isAlready(e, a) || this.otherPrefixes(e.value, t)))
            return this.insert(e, t, r, n);
        }
        process(e, t) {
          if (!this.needCascade(e)) {
            super.process(e, t);
            return;
          }
          let r = super.process(e, t);
          !r ||
            !r.length ||
            (this.restoreBefore(e), (e.raws.before = this.calcBefore(r, e)));
        }
        old(e, t) {
          return [this.prefixed(e, t)];
        }
      };
    Om.exports = Em;
  });
  var Pm = v((P4, Tm) => {
    l();
    Tm.exports = function i(e) {
      return {
        mul: (t) => new i(e * t),
        div: (t) => new i(e / t),
        simplify: () => new i(e),
        toString: () => e.toString(),
      };
    };
  });
  var qm = v((D4, Im) => {
    l();
    var rA = Pm(),
      iA = Vt(),
      Yo = ue(),
      nA = /(min|max)-resolution\s*:\s*\d*\.?\d+(dppx|dpcm|dpi|x)/gi,
      sA = /(min|max)-resolution(\s*:\s*)(\d*\.?\d+)(dppx|dpcm|dpi|x)/i,
      Dm = class extends iA {
        prefixName(e, t) {
          return e === '-moz-'
            ? t + '--moz-device-pixel-ratio'
            : e + t + '-device-pixel-ratio';
        }
        prefixQuery(e, t, r, n, a) {
          return (
            (n = new rA(n)),
            a === 'dpi'
              ? (n = n.div(96))
              : a === 'dpcm' && (n = n.mul(2.54).div(96)),
            (n = n.simplify()),
            e === '-o-' && (n = n.n + '/' + n.d),
            this.prefixName(e, t) + r + n
          );
        }
        clean(e) {
          if (!this.bad) {
            this.bad = [];
            for (let t of this.prefixes)
              this.bad.push(this.prefixName(t, 'min')),
                this.bad.push(this.prefixName(t, 'max'));
          }
          e.params = Yo.editList(e.params, (t) =>
            t.filter((r) => this.bad.every((n) => !r.includes(n))),
          );
        }
        process(e) {
          let t = this.parentPrefix(e),
            r = t ? [t] : this.prefixes;
          e.params = Yo.editList(e.params, (n, a) => {
            for (let s of n) {
              if (
                !s.includes('min-resolution') &&
                !s.includes('max-resolution')
              ) {
                a.push(s);
                continue;
              }
              for (let o of r) {
                let u = s.replace(nA, (c) => {
                  let f = c.match(sA);
                  return this.prefixQuery(o, f[1], f[2], f[3], f[4]);
                });
                a.push(u);
              }
              a.push(s);
            }
            return Yo.uniq(a);
          });
        }
      };
    Im.exports = Dm;
  });
  var Mm = v((I4, Rm) => {
    l();
    var Qo = '('.charCodeAt(0),
      Jo = ')'.charCodeAt(0),
      Un = "'".charCodeAt(0),
      Xo = '"'.charCodeAt(0),
      Ko = '\\'.charCodeAt(0),
      Ut = '/'.charCodeAt(0),
      Zo = ','.charCodeAt(0),
      el = ':'.charCodeAt(0),
      Wn = '*'.charCodeAt(0),
      aA = 'u'.charCodeAt(0),
      oA = 'U'.charCodeAt(0),
      lA = '+'.charCodeAt(0),
      uA = /^[a-f0-9?-]+$/i;
    Rm.exports = function (i) {
      for (
        var e = [],
          t = i,
          r,
          n,
          a,
          s,
          o,
          u,
          c,
          f,
          p = 0,
          d = t.charCodeAt(p),
          h = t.length,
          y = [{ nodes: e }],
          x = 0,
          w,
          b = '',
          k = '',
          S = '';
        p < h;

      )
        if (d <= 32) {
          r = p;
          do (r += 1), (d = t.charCodeAt(r));
          while (d <= 32);
          (s = t.slice(p, r)),
            (a = e[e.length - 1]),
            d === Jo && x
              ? (S = s)
              : a && a.type === 'div'
              ? ((a.after = s), (a.sourceEndIndex += s.length))
              : d === Zo ||
                d === el ||
                (d === Ut &&
                  t.charCodeAt(r + 1) !== Wn &&
                  (!w || (w && w.type === 'function' && w.value !== 'calc')))
              ? (k = s)
              : e.push({
                  type: 'space',
                  sourceIndex: p,
                  sourceEndIndex: r,
                  value: s,
                }),
            (p = r);
        } else if (d === Un || d === Xo) {
          (r = p),
            (n = d === Un ? "'" : '"'),
            (s = { type: 'string', sourceIndex: p, quote: n });
          do
            if (((o = !1), (r = t.indexOf(n, r + 1)), ~r))
              for (u = r; t.charCodeAt(u - 1) === Ko; ) (u -= 1), (o = !o);
            else (t += n), (r = t.length - 1), (s.unclosed = !0);
          while (o);
          (s.value = t.slice(p + 1, r)),
            (s.sourceEndIndex = s.unclosed ? r : r + 1),
            e.push(s),
            (p = r + 1),
            (d = t.charCodeAt(p));
        } else if (d === Ut && t.charCodeAt(p + 1) === Wn)
          (r = t.indexOf('*/', p)),
            (s = { type: 'comment', sourceIndex: p, sourceEndIndex: r + 2 }),
            r === -1 &&
              ((s.unclosed = !0), (r = t.length), (s.sourceEndIndex = r)),
            (s.value = t.slice(p + 2, r)),
            e.push(s),
            (p = r + 2),
            (d = t.charCodeAt(p));
        else if (
          (d === Ut || d === Wn) &&
          w &&
          w.type === 'function' &&
          w.value === 'calc'
        )
          (s = t[p]),
            e.push({
              type: 'word',
              sourceIndex: p - k.length,
              sourceEndIndex: p + s.length,
              value: s,
            }),
            (p += 1),
            (d = t.charCodeAt(p));
        else if (d === Ut || d === Zo || d === el)
          (s = t[p]),
            e.push({
              type: 'div',
              sourceIndex: p - k.length,
              sourceEndIndex: p + s.length,
              value: s,
              before: k,
              after: '',
            }),
            (k = ''),
            (p += 1),
            (d = t.charCodeAt(p));
        else if (Qo === d) {
          r = p;
          do (r += 1), (d = t.charCodeAt(r));
          while (d <= 32);
          if (
            ((f = p),
            (s = {
              type: 'function',
              sourceIndex: p - b.length,
              value: b,
              before: t.slice(f + 1, r),
            }),
            (p = r),
            b === 'url' && d !== Un && d !== Xo)
          ) {
            r -= 1;
            do
              if (((o = !1), (r = t.indexOf(')', r + 1)), ~r))
                for (u = r; t.charCodeAt(u - 1) === Ko; ) (u -= 1), (o = !o);
              else (t += ')'), (r = t.length - 1), (s.unclosed = !0);
            while (o);
            c = r;
            do (c -= 1), (d = t.charCodeAt(c));
            while (d <= 32);
            f < c
              ? (p !== c + 1
                  ? (s.nodes = [
                      {
                        type: 'word',
                        sourceIndex: p,
                        sourceEndIndex: c + 1,
                        value: t.slice(p, c + 1),
                      },
                    ])
                  : (s.nodes = []),
                s.unclosed && c + 1 !== r
                  ? ((s.after = ''),
                    s.nodes.push({
                      type: 'space',
                      sourceIndex: c + 1,
                      sourceEndIndex: r,
                      value: t.slice(c + 1, r),
                    }))
                  : ((s.after = t.slice(c + 1, r)), (s.sourceEndIndex = r)))
              : ((s.after = ''), (s.nodes = [])),
              (p = r + 1),
              (s.sourceEndIndex = s.unclosed ? r : p),
              (d = t.charCodeAt(p)),
              e.push(s);
          } else
            (x += 1),
              (s.after = ''),
              (s.sourceEndIndex = p + 1),
              e.push(s),
              y.push(s),
              (e = s.nodes = []),
              (w = s);
          b = '';
        } else if (Jo === d && x)
          (p += 1),
            (d = t.charCodeAt(p)),
            (w.after = S),
            (w.sourceEndIndex += S.length),
            (S = ''),
            (x -= 1),
            (y[y.length - 1].sourceEndIndex = p),
            y.pop(),
            (w = y[x]),
            (e = w.nodes);
        else {
          r = p;
          do d === Ko && (r += 1), (r += 1), (d = t.charCodeAt(r));
          while (
            r < h &&
            !(
              d <= 32 ||
              d === Un ||
              d === Xo ||
              d === Zo ||
              d === el ||
              d === Ut ||
              d === Qo ||
              (d === Wn && w && w.type === 'function' && w.value === 'calc') ||
              (d === Ut && w.type === 'function' && w.value === 'calc') ||
              (d === Jo && x)
            )
          );
          (s = t.slice(p, r)),
            Qo === d
              ? (b = s)
              : (aA === s.charCodeAt(0) || oA === s.charCodeAt(0)) &&
                lA === s.charCodeAt(1) &&
                uA.test(s.slice(2))
              ? e.push({
                  type: 'unicode-range',
                  sourceIndex: p,
                  sourceEndIndex: r,
                  value: s,
                })
              : e.push({
                  type: 'word',
                  sourceIndex: p,
                  sourceEndIndex: r,
                  value: s,
                }),
            (p = r);
        }
      for (p = y.length - 1; p; p -= 1)
        (y[p].unclosed = !0), (y[p].sourceEndIndex = t.length);
      return y[0].nodes;
    };
  });
  var Fm = v((q4, Bm) => {
    l();
    Bm.exports = function i(e, t, r) {
      var n, a, s, o;
      for (n = 0, a = e.length; n < a; n += 1)
        (s = e[n]),
          r || (o = t(s, n, e)),
          o !== !1 &&
            s.type === 'function' &&
            Array.isArray(s.nodes) &&
            i(s.nodes, t, r),
          r && t(s, n, e);
    };
  });
  var jm = v((R4, $m) => {
    l();
    function Nm(i, e) {
      var t = i.type,
        r = i.value,
        n,
        a;
      return e && (a = e(i)) !== void 0
        ? a
        : t === 'word' || t === 'space'
        ? r
        : t === 'string'
        ? ((n = i.quote || ''), n + r + (i.unclosed ? '' : n))
        : t === 'comment'
        ? '/*' + r + (i.unclosed ? '' : '*/')
        : t === 'div'
        ? (i.before || '') + r + (i.after || '')
        : Array.isArray(i.nodes)
        ? ((n = Lm(i.nodes, e)),
          t !== 'function'
            ? n
            : r +
              '(' +
              (i.before || '') +
              n +
              (i.after || '') +
              (i.unclosed ? '' : ')'))
        : r;
    }
    function Lm(i, e) {
      var t, r;
      if (Array.isArray(i)) {
        for (t = '', r = i.length - 1; ~r; r -= 1) t = Nm(i[r], e) + t;
        return t;
      }
      return Nm(i, e);
    }
    $m.exports = Lm;
  });
  var Vm = v((M4, zm) => {
    l();
    var Gn = '-'.charCodeAt(0),
      Hn = '+'.charCodeAt(0),
      tl = '.'.charCodeAt(0),
      fA = 'e'.charCodeAt(0),
      cA = 'E'.charCodeAt(0);
    function pA(i) {
      var e = i.charCodeAt(0),
        t;
      if (e === Hn || e === Gn) {
        if (((t = i.charCodeAt(1)), t >= 48 && t <= 57)) return !0;
        var r = i.charCodeAt(2);
        return t === tl && r >= 48 && r <= 57;
      }
      return e === tl
        ? ((t = i.charCodeAt(1)), t >= 48 && t <= 57)
        : e >= 48 && e <= 57;
    }
    zm.exports = function (i) {
      var e = 0,
        t = i.length,
        r,
        n,
        a;
      if (t === 0 || !pA(i)) return !1;
      for (
        r = i.charCodeAt(e), (r === Hn || r === Gn) && e++;
        e < t && ((r = i.charCodeAt(e)), !(r < 48 || r > 57));

      )
        e += 1;
      if (
        ((r = i.charCodeAt(e)),
        (n = i.charCodeAt(e + 1)),
        r === tl && n >= 48 && n <= 57)
      )
        for (e += 2; e < t && ((r = i.charCodeAt(e)), !(r < 48 || r > 57)); )
          e += 1;
      if (
        ((r = i.charCodeAt(e)),
        (n = i.charCodeAt(e + 1)),
        (a = i.charCodeAt(e + 2)),
        (r === fA || r === cA) &&
          ((n >= 48 && n <= 57) ||
            ((n === Hn || n === Gn) && a >= 48 && a <= 57)))
      )
        for (
          e += n === Hn || n === Gn ? 3 : 2;
          e < t && ((r = i.charCodeAt(e)), !(r < 48 || r > 57));

        )
          e += 1;
      return { number: i.slice(0, e), unit: i.slice(e) };
    };
  });
  var Yn = v((B4, Gm) => {
    l();
    var dA = Mm(),
      Um = Fm(),
      Wm = jm();
    function pt(i) {
      return this instanceof pt ? ((this.nodes = dA(i)), this) : new pt(i);
    }
    pt.prototype.toString = function () {
      return Array.isArray(this.nodes) ? Wm(this.nodes) : '';
    };
    pt.prototype.walk = function (i, e) {
      return Um(this.nodes, i, e), this;
    };
    pt.unit = Vm();
    pt.walk = Um;
    pt.stringify = Wm;
    Gm.exports = pt;
  });
  var Xm = v((F4, Jm) => {
    l();
    var { list: hA } = me(),
      Hm = Yn(),
      mA = ct(),
      Ym = ii(),
      Qm = class {
        constructor(e) {
          (this.props = ['transition', 'transition-property']),
            (this.prefixes = e);
        }
        add(e, t) {
          let r,
            n,
            a = this.prefixes.add[e.prop],
            s = this.ruleVendorPrefixes(e),
            o = s || (a && a.prefixes) || [],
            u = this.parse(e.value),
            c = u.map((h) => this.findProp(h)),
            f = [];
          if (c.some((h) => h[0] === '-')) return;
          for (let h of u) {
            if (((n = this.findProp(h)), n[0] === '-')) continue;
            let y = this.prefixes.add[n];
            if (!(!y || !y.prefixes))
              for (r of y.prefixes) {
                if (s && !s.some((w) => r.includes(w))) continue;
                let x = this.prefixes.prefixed(n, r);
                x !== '-ms-transform' &&
                  !c.includes(x) &&
                  (this.disabled(n, r) || f.push(this.clone(n, x, h)));
              }
          }
          u = u.concat(f);
          let p = this.stringify(u),
            d = this.stringify(this.cleanFromUnprefixed(u, '-webkit-'));
          if (
            (o.includes('-webkit-') &&
              this.cloneBefore(e, `-webkit-${e.prop}`, d),
            this.cloneBefore(e, e.prop, d),
            o.includes('-o-'))
          ) {
            let h = this.stringify(this.cleanFromUnprefixed(u, '-o-'));
            this.cloneBefore(e, `-o-${e.prop}`, h);
          }
          for (r of o)
            if (r !== '-webkit-' && r !== '-o-') {
              let h = this.stringify(this.cleanOtherPrefixes(u, r));
              this.cloneBefore(e, r + e.prop, h);
            }
          p !== e.value &&
            !this.already(e, e.prop, p) &&
            (this.checkForWarning(t, e), e.cloneBefore(), (e.value = p));
        }
        findProp(e) {
          let t = e[0].value;
          if (/^\d/.test(t)) {
            for (let [r, n] of e.entries())
              if (r !== 0 && n.type === 'word') return n.value;
          }
          return t;
        }
        already(e, t, r) {
          return e.parent.some((n) => n.prop === t && n.value === r);
        }
        cloneBefore(e, t, r) {
          this.already(e, t, r) || e.cloneBefore({ prop: t, value: r });
        }
        checkForWarning(e, t) {
          if (t.prop !== 'transition-property') return;
          let r = !1,
            n = !1;
          t.parent.each((a) => {
            if (a.type !== 'decl' || a.prop.indexOf('transition-') !== 0)
              return;
            let s = hA.comma(a.value);
            if (a.prop === 'transition-property') {
              s.forEach((o) => {
                let u = this.prefixes.add[o];
                u && u.prefixes && u.prefixes.length > 0 && (r = !0);
              });
              return;
            }
            return (n = n || s.length > 1), !1;
          }),
            r &&
              n &&
              t.warn(
                e,
                'Replace transition-property to transition, because Autoprefixer could not support any cases of transition-property and other transition-*',
              );
        }
        remove(e) {
          let t = this.parse(e.value);
          t = t.filter((s) => {
            let o = this.prefixes.remove[this.findProp(s)];
            return !o || !o.remove;
          });
          let r = this.stringify(t);
          if (e.value === r) return;
          if (t.length === 0) {
            e.remove();
            return;
          }
          let n = e.parent.some((s) => s.prop === e.prop && s.value === r),
            a = e.parent.some(
              (s) => s !== e && s.prop === e.prop && s.value.length > r.length,
            );
          if (n || a) {
            e.remove();
            return;
          }
          e.value = r;
        }
        parse(e) {
          let t = Hm(e),
            r = [],
            n = [];
          for (let a of t.nodes)
            n.push(a),
              a.type === 'div' && a.value === ',' && (r.push(n), (n = []));
          return r.push(n), r.filter((a) => a.length > 0);
        }
        stringify(e) {
          if (e.length === 0) return '';
          let t = [];
          for (let r of e)
            r[r.length - 1].type !== 'div' && r.push(this.div(e)),
              (t = t.concat(r));
          return (
            t[0].type === 'div' && (t = t.slice(1)),
            t[t.length - 1].type === 'div' &&
              (t = t.slice(0, -2 + 1 || void 0)),
            Hm.stringify({ nodes: t })
          );
        }
        clone(e, t, r) {
          let n = [],
            a = !1;
          for (let s of r)
            !a && s.type === 'word' && s.value === e
              ? (n.push({ type: 'word', value: t }), (a = !0))
              : n.push(s);
          return n;
        }
        div(e) {
          for (let t of e)
            for (let r of t) if (r.type === 'div' && r.value === ',') return r;
          return { type: 'div', value: ',', after: ' ' };
        }
        cleanOtherPrefixes(e, t) {
          return e.filter((r) => {
            let n = Ym.prefix(this.findProp(r));
            return n === '' || n === t;
          });
        }
        cleanFromUnprefixed(e, t) {
          let r = e
              .map((a) => this.findProp(a))
              .filter((a) => a.slice(0, t.length) === t)
              .map((a) => this.prefixes.unprefixed(a)),
            n = [];
          for (let a of e) {
            let s = this.findProp(a),
              o = Ym.prefix(s);
            !r.includes(s) && (o === t || o === '') && n.push(a);
          }
          return n;
        }
        disabled(e, t) {
          let r = ['order', 'justify-content', 'align-self', 'align-content'];
          if (e.includes('flex') || r.includes(e)) {
            if (this.prefixes.options.flexbox === !1) return !0;
            if (this.prefixes.options.flexbox === 'no-2009')
              return t.includes('2009');
          }
        }
        ruleVendorPrefixes(e) {
          let { parent: t } = e;
          if (t.type !== 'rule') return !1;
          if (!t.selector.includes(':-')) return !1;
          let r = mA.prefixes().filter((n) => t.selector.includes(':' + n));
          return r.length > 0 ? r : !1;
        }
      };
    Jm.exports = Qm;
  });
  var Wt = v((N4, Zm) => {
    l();
    var gA = ue(),
      Km = class {
        constructor(e, t, r, n) {
          (this.unprefixed = e),
            (this.prefixed = t),
            (this.string = r || t),
            (this.regexp = n || gA.regexp(t));
        }
        check(e) {
          return e.includes(this.string) ? !!e.match(this.regexp) : !1;
        }
      };
    Zm.exports = Km;
  });
  var ke = v((L4, tg) => {
    l();
    var yA = Vt(),
      wA = Wt(),
      bA = ii(),
      vA = ue(),
      eg = class extends yA {
        static save(e, t) {
          let r = t.prop,
            n = [];
          for (let a in t._autoprefixerValues) {
            let s = t._autoprefixerValues[a];
            if (s === t.value) continue;
            let o,
              u = bA.prefix(r);
            if (u === '-pie-') continue;
            if (u === a) {
              (o = t.value = s), n.push(o);
              continue;
            }
            let c = e.prefixed(r, a),
              f = t.parent;
            if (!f.every((y) => y.prop !== c)) {
              n.push(o);
              continue;
            }
            let p = s.replace(/\s+/, ' ');
            if (
              f.some(
                (y) => y.prop === t.prop && y.value.replace(/\s+/, ' ') === p,
              )
            ) {
              n.push(o);
              continue;
            }
            let h = this.clone(t, { value: s });
            (o = t.parent.insertBefore(t, h)), n.push(o);
          }
          return n;
        }
        check(e) {
          let t = e.value;
          return t.includes(this.name) ? !!t.match(this.regexp()) : !1;
        }
        regexp() {
          return this.regexpCache || (this.regexpCache = vA.regexp(this.name));
        }
        replace(e, t) {
          return e.replace(this.regexp(), `$1${t}$2`);
        }
        value(e) {
          return e.raws.value && e.raws.value.value === e.value
            ? e.raws.value.raw
            : e.value;
        }
        add(e, t) {
          e._autoprefixerValues || (e._autoprefixerValues = {});
          let r = e._autoprefixerValues[t] || this.value(e),
            n;
          do if (((n = r), (r = this.replace(r, t)), r === !1)) return;
          while (r !== n);
          e._autoprefixerValues[t] = r;
        }
        old(e) {
          return new wA(this.name, e + this.name);
        }
      };
    tg.exports = eg;
  });
  var dt = v(($4, rg) => {
    l();
    rg.exports = {};
  });
  var il = v((j4, sg) => {
    l();
    var ig = Yn(),
      xA = ke(),
      kA = dt().insertAreas,
      SA = /(^|[^-])linear-gradient\(\s*(top|left|right|bottom)/i,
      CA = /(^|[^-])radial-gradient\(\s*\d+(\w*|%)\s+\d+(\w*|%)\s*,/i,
      AA = /(!\s*)?autoprefixer:\s*ignore\s+next/i,
      _A = /(!\s*)?autoprefixer\s*grid:\s*(on|off|(no-)?autoplace)/i,
      EA = [
        'width',
        'height',
        'min-width',
        'max-width',
        'min-height',
        'max-height',
        'inline-size',
        'min-inline-size',
        'max-inline-size',
        'block-size',
        'min-block-size',
        'max-block-size',
      ];
    function rl(i) {
      return i.parent.some(
        (e) => e.prop === 'grid-template' || e.prop === 'grid-template-areas',
      );
    }
    function OA(i) {
      let e = i.parent.some((r) => r.prop === 'grid-template-rows'),
        t = i.parent.some((r) => r.prop === 'grid-template-columns');
      return e && t;
    }
    var ng = class {
      constructor(e) {
        this.prefixes = e;
      }
      add(e, t) {
        let r = this.prefixes.add['@resolution'],
          n = this.prefixes.add['@keyframes'],
          a = this.prefixes.add['@viewport'],
          s = this.prefixes.add['@supports'];
        e.walkAtRules((f) => {
          if (f.name === 'keyframes') {
            if (!this.disabled(f, t)) return n && n.process(f);
          } else if (f.name === 'viewport') {
            if (!this.disabled(f, t)) return a && a.process(f);
          } else if (f.name === 'supports') {
            if (this.prefixes.options.supports !== !1 && !this.disabled(f, t))
              return s.process(f);
          } else if (
            f.name === 'media' &&
            f.params.includes('-resolution') &&
            !this.disabled(f, t)
          )
            return r && r.process(f);
        }),
          e.walkRules((f) => {
            if (!this.disabled(f, t))
              return this.prefixes.add.selectors.map((p) => p.process(f, t));
          });
        function o(f) {
          return f.parent.nodes.some((p) => {
            if (p.type !== 'decl') return !1;
            let d = p.prop === 'display' && /(inline-)?grid/.test(p.value),
              h = p.prop.startsWith('grid-template'),
              y = /^grid-([A-z]+-)?gap/.test(p.prop);
            return d || h || y;
          });
        }
        function u(f) {
          return f.parent.some(
            (p) => p.prop === 'display' && /(inline-)?flex/.test(p.value),
          );
        }
        let c =
          this.gridStatus(e, t) &&
          this.prefixes.add['grid-area'] &&
          this.prefixes.add['grid-area'].prefixes;
        return (
          e.walkDecls((f) => {
            if (this.disabledDecl(f, t)) return;
            let p = f.parent,
              d = f.prop,
              h = f.value;
            if (d === 'grid-row-span') {
              t.warn(
                'grid-row-span is not part of final Grid Layout. Use grid-row.',
                { node: f },
              );
              return;
            } else if (d === 'grid-column-span') {
              t.warn(
                'grid-column-span is not part of final Grid Layout. Use grid-column.',
                { node: f },
              );
              return;
            } else if (d === 'display' && h === 'box') {
              t.warn(
                'You should write display: flex by final spec instead of display: box',
                { node: f },
              );
              return;
            } else if (d === 'text-emphasis-position')
              (h === 'under' || h === 'over') &&
                t.warn(
                  'You should use 2 values for text-emphasis-position For example, `under left` instead of just `under`.',
                  { node: f },
                );
            else if (/^(align|justify|place)-(items|content)$/.test(d) && u(f))
              (h === 'start' || h === 'end') &&
                t.warn(
                  `${h} value has mixed support, consider using flex-${h} instead`,
                  { node: f },
                );
            else if (d === 'text-decoration-skip' && h === 'ink')
              t.warn(
                'Replace text-decoration-skip: ink to text-decoration-skip-ink: auto, because spec had been changed',
                { node: f },
              );
            else {
              if (c && this.gridStatus(f, t))
                if (
                  (f.value === 'subgrid' &&
                    t.warn('IE does not support subgrid', { node: f }),
                  /^(align|justify|place)-items$/.test(d) && o(f))
                ) {
                  let x = d.replace('-items', '-self');
                  t.warn(
                    `IE does not support ${d} on grid containers. Try using ${x} on child elements instead: ${f.parent.selector} > * { ${x}: ${f.value} }`,
                    { node: f },
                  );
                } else if (/^(align|justify|place)-content$/.test(d) && o(f))
                  t.warn(`IE does not support ${f.prop} on grid containers`, {
                    node: f,
                  });
                else if (d === 'display' && f.value === 'contents') {
                  t.warn(
                    'Please do not use display: contents; if you have grid setting enabled',
                    { node: f },
                  );
                  return;
                } else if (f.prop === 'grid-gap') {
                  let x = this.gridStatus(f, t);
                  x === 'autoplace' && !OA(f) && !rl(f)
                    ? t.warn(
                        'grid-gap only works if grid-template(-areas) is being used or both rows and columns have been declared and cells have not been manually placed inside the explicit grid',
                        { node: f },
                      )
                    : (x === !0 || x === 'no-autoplace') &&
                      !rl(f) &&
                      t.warn(
                        'grid-gap only works if grid-template(-areas) is being used',
                        { node: f },
                      );
                } else if (d === 'grid-auto-columns') {
                  t.warn('grid-auto-columns is not supported by IE', {
                    node: f,
                  });
                  return;
                } else if (d === 'grid-auto-rows') {
                  t.warn('grid-auto-rows is not supported by IE', { node: f });
                  return;
                } else if (d === 'grid-auto-flow') {
                  let x = p.some((b) => b.prop === 'grid-template-rows'),
                    w = p.some((b) => b.prop === 'grid-template-columns');
                  rl(f)
                    ? t.warn('grid-auto-flow is not supported by IE', {
                        node: f,
                      })
                    : h.includes('dense')
                    ? t.warn('grid-auto-flow: dense is not supported by IE', {
                        node: f,
                      })
                    : !x &&
                      !w &&
                      t.warn(
                        'grid-auto-flow works only if grid-template-rows and grid-template-columns are present in the same rule',
                        { node: f },
                      );
                  return;
                } else if (h.includes('auto-fit')) {
                  t.warn('auto-fit value is not supported by IE', {
                    node: f,
                    word: 'auto-fit',
                  });
                  return;
                } else if (h.includes('auto-fill')) {
                  t.warn('auto-fill value is not supported by IE', {
                    node: f,
                    word: 'auto-fill',
                  });
                  return;
                } else
                  d.startsWith('grid-template') &&
                    h.includes('[') &&
                    t.warn(
                      'Autoprefixer currently does not support line names. Try using grid-template-areas instead.',
                      { node: f, word: '[' },
                    );
              if (h.includes('radial-gradient'))
                if (CA.test(f.value))
                  t.warn(
                    'Gradient has outdated direction syntax. New syntax is like `closest-side at 0 0` instead of `0 0, closest-side`.',
                    { node: f },
                  );
                else {
                  let x = ig(h);
                  for (let w of x.nodes)
                    if (w.type === 'function' && w.value === 'radial-gradient')
                      for (let b of w.nodes)
                        b.type === 'word' &&
                          (b.value === 'cover'
                            ? t.warn(
                                'Gradient has outdated direction syntax. Replace `cover` to `farthest-corner`.',
                                { node: f },
                              )
                            : b.value === 'contain' &&
                              t.warn(
                                'Gradient has outdated direction syntax. Replace `contain` to `closest-side`.',
                                { node: f },
                              ));
                }
              h.includes('linear-gradient') &&
                SA.test(h) &&
                t.warn(
                  'Gradient has outdated direction syntax. New syntax is like `to left` instead of `right`.',
                  { node: f },
                );
            }
            EA.includes(f.prop) &&
              (f.value.includes('-fill-available') ||
                (f.value.includes('fill-available')
                  ? t.warn(
                      'Replace fill-available to stretch, because spec had been changed',
                      { node: f },
                    )
                  : f.value.includes('fill') &&
                    ig(h).nodes.some(
                      (w) => w.type === 'word' && w.value === 'fill',
                    ) &&
                    t.warn(
                      'Replace fill to stretch, because spec had been changed',
                      { node: f },
                    )));
            let y;
            if (f.prop === 'transition' || f.prop === 'transition-property')
              return this.prefixes.transition.add(f, t);
            if (f.prop === 'align-self') {
              if (
                (this.displayType(f) !== 'grid' &&
                  this.prefixes.options.flexbox !== !1 &&
                  ((y = this.prefixes.add['align-self']),
                  y && y.prefixes && y.process(f)),
                this.gridStatus(f, t) !== !1 &&
                  ((y = this.prefixes.add['grid-row-align']), y && y.prefixes))
              )
                return y.process(f, t);
            } else if (f.prop === 'justify-self') {
              if (
                this.gridStatus(f, t) !== !1 &&
                ((y = this.prefixes.add['grid-column-align']), y && y.prefixes)
              )
                return y.process(f, t);
            } else if (f.prop === 'place-self') {
              if (
                ((y = this.prefixes.add['place-self']),
                y && y.prefixes && this.gridStatus(f, t) !== !1)
              )
                return y.process(f, t);
            } else if (((y = this.prefixes.add[f.prop]), y && y.prefixes))
              return y.process(f, t);
          }),
          this.gridStatus(e, t) && kA(e, this.disabled),
          e.walkDecls((f) => {
            if (this.disabledValue(f, t)) return;
            let p = this.prefixes.unprefixed(f.prop),
              d = this.prefixes.values('add', p);
            if (Array.isArray(d)) for (let h of d) h.process && h.process(f, t);
            xA.save(this.prefixes, f);
          })
        );
      }
      remove(e, t) {
        let r = this.prefixes.remove['@resolution'];
        e.walkAtRules((n, a) => {
          this.prefixes.remove[`@${n.name}`]
            ? this.disabled(n, t) || n.parent.removeChild(a)
            : n.name === 'media' &&
              n.params.includes('-resolution') &&
              r &&
              r.clean(n);
        });
        for (let n of this.prefixes.remove.selectors)
          e.walkRules((a, s) => {
            n.check(a) && (this.disabled(a, t) || a.parent.removeChild(s));
          });
        return e.walkDecls((n, a) => {
          if (this.disabled(n, t)) return;
          let s = n.parent,
            o = this.prefixes.unprefixed(n.prop);
          if (
            ((n.prop === 'transition' || n.prop === 'transition-property') &&
              this.prefixes.transition.remove(n),
            this.prefixes.remove[n.prop] && this.prefixes.remove[n.prop].remove)
          ) {
            let u = this.prefixes
              .group(n)
              .down((c) => this.prefixes.normalize(c.prop) === o);
            if (
              (o === 'flex-flow' && (u = !0), n.prop === '-webkit-box-orient')
            ) {
              let c = { 'flex-direction': !0, 'flex-flow': !0 };
              if (!n.parent.some((f) => c[f.prop])) return;
            }
            if (u && !this.withHackValue(n)) {
              n.raw('before').includes(`
`) && this.reduceSpaces(n),
                s.removeChild(a);
              return;
            }
          }
          for (let u of this.prefixes.values('remove', o)) {
            if (!u.check || !u.check(n.value)) continue;
            if (
              ((o = u.unprefixed),
              this.prefixes.group(n).down((f) => f.value.includes(o)))
            ) {
              s.removeChild(a);
              return;
            }
          }
        });
      }
      withHackValue(e) {
        return e.prop === '-webkit-background-clip' && e.value === 'text';
      }
      disabledValue(e, t) {
        return (this.gridStatus(e, t) === !1 &&
          e.type === 'decl' &&
          e.prop === 'display' &&
          e.value.includes('grid')) ||
          (this.prefixes.options.flexbox === !1 &&
            e.type === 'decl' &&
            e.prop === 'display' &&
            e.value.includes('flex')) ||
          (e.type === 'decl' && e.prop === 'content')
          ? !0
          : this.disabled(e, t);
      }
      disabledDecl(e, t) {
        if (
          this.gridStatus(e, t) === !1 &&
          e.type === 'decl' &&
          (e.prop.includes('grid') || e.prop === 'justify-items')
        )
          return !0;
        if (this.prefixes.options.flexbox === !1 && e.type === 'decl') {
          let r = ['order', 'justify-content', 'align-items', 'align-content'];
          if (e.prop.includes('flex') || r.includes(e.prop)) return !0;
        }
        return this.disabled(e, t);
      }
      disabled(e, t) {
        if (!e) return !1;
        if (e._autoprefixerDisabled !== void 0) return e._autoprefixerDisabled;
        if (e.parent) {
          let n = e.prev();
          if (n && n.type === 'comment' && AA.test(n.text))
            return (
              (e._autoprefixerDisabled = !0),
              (e._autoprefixerSelfDisabled = !0),
              !0
            );
        }
        let r = null;
        if (e.nodes) {
          let n;
          e.each((a) => {
            a.type === 'comment' &&
              /(!\s*)?autoprefixer:\s*(off|on)/i.test(a.text) &&
              (typeof n != 'undefined'
                ? t.warn(
                    'Second Autoprefixer control comment was ignored. Autoprefixer applies control comment to whole block, not to next rules.',
                    { node: a },
                  )
                : (n = /on/i.test(a.text)));
          }),
            n !== void 0 && (r = !n);
        }
        if (!e.nodes || r === null)
          if (e.parent) {
            let n = this.disabled(e.parent, t);
            e.parent._autoprefixerSelfDisabled === !0 ? (r = !1) : (r = n);
          } else r = !1;
        return (e._autoprefixerDisabled = r), r;
      }
      reduceSpaces(e) {
        let t = !1;
        if ((this.prefixes.group(e).up(() => ((t = !0), !0)), t)) return;
        let r = e.raw('before').split(`
`),
          n = r[r.length - 1].length,
          a = !1;
        this.prefixes.group(e).down((s) => {
          r = s.raw('before').split(`
`);
          let o = r.length - 1;
          r[o].length > n &&
            (a === !1 && (a = r[o].length - n),
            (r[o] = r[o].slice(0, -a)),
            (s.raws.before = r.join(`
`)));
        });
      }
      displayType(e) {
        for (let t of e.parent.nodes)
          if (t.prop === 'display') {
            if (t.value.includes('flex')) return 'flex';
            if (t.value.includes('grid')) return 'grid';
          }
        return !1;
      }
      gridStatus(e, t) {
        if (!e) return !1;
        if (e._autoprefixerGridStatus !== void 0)
          return e._autoprefixerGridStatus;
        let r = null;
        if (e.nodes) {
          let n;
          e.each((a) => {
            if (a.type === 'comment' && _A.test(a.text)) {
              let s = /:\s*autoplace/i.test(a.text),
                o = /no-autoplace/i.test(a.text);
              typeof n != 'undefined'
                ? t.warn(
                    'Second Autoprefixer grid control comment was ignored. Autoprefixer applies control comments to the whole block, not to the next rules.',
                    { node: a },
                  )
                : s
                ? (n = 'autoplace')
                : o
                ? (n = !0)
                : (n = /on/i.test(a.text));
            }
          }),
            n !== void 0 && (r = n);
        }
        if (e.type === 'atrule' && e.name === 'supports') {
          let n = e.params;
          n.includes('grid') && n.includes('auto') && (r = !1);
        }
        if (!e.nodes || r === null)
          if (e.parent) {
            let n = this.gridStatus(e.parent, t);
            e.parent._autoprefixerSelfDisabled === !0 ? (r = !1) : (r = n);
          } else
            typeof this.prefixes.options.grid != 'undefined'
              ? (r = this.prefixes.options.grid)
              : typeof m.env.AUTOPREFIXER_GRID != 'undefined'
              ? m.env.AUTOPREFIXER_GRID === 'autoplace'
                ? (r = 'autoplace')
                : (r = !0)
              : (r = !1);
        return (e._autoprefixerGridStatus = r), r;
      }
    };
    sg.exports = ng;
  });
  var og = v((z4, ag) => {
    l();
    ag.exports = {
      A: {
        A: { 2: 'K E F G A B JC' },
        B: {
          1: 'C L M H N D O P Q R S T U V W X Y Z a b c d e f g h i j n o p q r s t u v w x y z I',
        },
        C: {
          1: '2 3 4 5 6 7 8 9 AB BB CB DB EB FB GB HB IB JB KB LB MB NB OB PB QB RB SB TB UB VB WB XB YB ZB aB bB cB 0B dB 1B eB fB gB hB iB jB kB lB mB nB oB m pB qB rB sB tB P Q R 2B S T U V W X Y Z a b c d e f g h i j n o p q r s t u v w x y z I uB 3B 4B',
          2: '0 1 KC zB J K E F G A B C L M H N D O k l LC MC',
        },
        D: {
          1: '8 9 AB BB CB DB EB FB GB HB IB JB KB LB MB NB OB PB QB RB SB TB UB VB WB XB YB ZB aB bB cB 0B dB 1B eB fB gB hB iB jB kB lB mB nB oB m pB qB rB sB tB P Q R S T U V W X Y Z a b c d e f g h i j n o p q r s t u v w x y z I uB 3B 4B',
          2: '0 1 2 3 4 5 6 7 J K E F G A B C L M H N D O k l',
        },
        E: {
          1: 'G A B C L M H D RC 6B vB wB 7B SC TC 8B 9B xB AC yB BC CC DC EC FC GC UC',
          2: '0 J K E F NC 5B OC PC QC',
        },
        F: {
          1: '1 2 3 4 5 6 7 8 9 H N D O k l AB BB CB DB EB FB GB HB IB JB KB LB MB NB OB PB QB RB SB TB UB VB WB XB YB ZB aB bB cB dB eB fB gB hB iB jB kB lB mB nB oB m pB qB rB sB tB P Q R 2B S T U V W X Y Z a b c d e f g h i j wB',
          2: 'G B C VC WC XC YC vB HC ZC',
        },
        G: {
          1: 'D fC gC hC iC jC kC lC mC nC oC pC qC rC sC tC 8B 9B xB AC yB BC CC DC EC FC GC',
          2: 'F 5B aC IC bC cC dC eC',
        },
        H: { 1: 'uC' },
        I: { 1: 'I zC 0C', 2: 'zB J vC wC xC yC IC' },
        J: { 2: 'E A' },
        K: { 1: 'm', 2: 'A B C vB HC wB' },
        L: { 1: 'I' },
        M: { 1: 'uB' },
        N: { 2: 'A B' },
        O: { 1: 'xB' },
        P: { 1: 'J k l 1C 2C 3C 4C 5C 6B 6C 7C 8C 9C AD yB BD CD DD' },
        Q: { 1: '7B' },
        R: { 1: 'ED' },
        S: { 1: 'FD GD' },
      },
      B: 4,
      C: 'CSS Feature Queries',
    };
  });
  var cg = v((V4, fg) => {
    l();
    function lg(i) {
      return i[i.length - 1];
    }
    var ug = {
      parse(i) {
        let e = [''],
          t = [e];
        for (let r of i) {
          if (r === '(') {
            (e = ['']), lg(t).push(e), t.push(e);
            continue;
          }
          if (r === ')') {
            t.pop(), (e = lg(t)), e.push('');
            continue;
          }
          e[e.length - 1] += r;
        }
        return t[0];
      },
      stringify(i) {
        let e = '';
        for (let t of i) {
          if (typeof t == 'object') {
            e += `(${ug.stringify(t)})`;
            continue;
          }
          e += t;
        }
        return e;
      },
    };
    fg.exports = ug;
  });
  var gg = v((U4, mg) => {
    l();
    var TA = og(),
      { feature: PA } = (zn(), jn),
      { parse: DA } = me(),
      IA = ct(),
      nl = cg(),
      qA = ke(),
      RA = ue(),
      pg = PA(TA),
      dg = [];
    for (let i in pg.stats) {
      let e = pg.stats[i];
      for (let t in e) {
        let r = e[t];
        /y/.test(r) && dg.push(i + ' ' + t);
      }
    }
    var hg = class {
      constructor(e, t) {
        (this.Prefixes = e), (this.all = t);
      }
      prefixer() {
        if (this.prefixerCache) return this.prefixerCache;
        let e = this.all.browsers.selected.filter((r) => dg.includes(r)),
          t = new IA(this.all.browsers.data, e, this.all.options);
        return (
          (this.prefixerCache = new this.Prefixes(
            this.all.data,
            t,
            this.all.options,
          )),
          this.prefixerCache
        );
      }
      parse(e) {
        let t = e.split(':'),
          r = t[0],
          n = t[1];
        return n || (n = ''), [r.trim(), n.trim()];
      }
      virtual(e) {
        let [t, r] = this.parse(e),
          n = DA('a{}').first;
        return n.append({ prop: t, value: r, raws: { before: '' } }), n;
      }
      prefixed(e) {
        let t = this.virtual(e);
        if (this.disabled(t.first)) return t.nodes;
        let r = { warn: () => null },
          n = this.prefixer().add[t.first.prop];
        n && n.process && n.process(t.first, r);
        for (let a of t.nodes) {
          for (let s of this.prefixer().values('add', t.first.prop))
            s.process(a);
          qA.save(this.all, a);
        }
        return t.nodes;
      }
      isNot(e) {
        return typeof e == 'string' && /not\s*/i.test(e);
      }
      isOr(e) {
        return typeof e == 'string' && /\s*or\s*/i.test(e);
      }
      isProp(e) {
        return (
          typeof e == 'object' && e.length === 1 && typeof e[0] == 'string'
        );
      }
      isHack(e, t) {
        return !new RegExp(`(\\(|\\s)${RA.escapeRegexp(t)}:`).test(e);
      }
      toRemove(e, t) {
        let [r, n] = this.parse(e),
          a = this.all.unprefixed(r),
          s = this.all.cleaner();
        if (s.remove[r] && s.remove[r].remove && !this.isHack(t, a)) return !0;
        for (let o of s.values('remove', a)) if (o.check(n)) return !0;
        return !1;
      }
      remove(e, t) {
        let r = 0;
        for (; r < e.length; ) {
          if (
            !this.isNot(e[r - 1]) &&
            this.isProp(e[r]) &&
            this.isOr(e[r + 1])
          ) {
            if (this.toRemove(e[r][0], t)) {
              e.splice(r, 2);
              continue;
            }
            r += 2;
            continue;
          }
          typeof e[r] == 'object' && (e[r] = this.remove(e[r], t)), (r += 1);
        }
        return e;
      }
      cleanBrackets(e) {
        return e.map((t) =>
          typeof t != 'object'
            ? t
            : t.length === 1 && typeof t[0] == 'object'
            ? this.cleanBrackets(t[0])
            : this.cleanBrackets(t),
        );
      }
      convert(e) {
        let t = [''];
        for (let r of e) t.push([`${r.prop}: ${r.value}`]), t.push(' or ');
        return (t[t.length - 1] = ''), t;
      }
      normalize(e) {
        if (typeof e != 'object') return e;
        if (((e = e.filter((t) => t !== '')), typeof e[0] == 'string')) {
          let t = e[0].trim();
          if (t.includes(':') || t === 'selector' || t === 'not selector')
            return [nl.stringify(e)];
        }
        return e.map((t) => this.normalize(t));
      }
      add(e, t) {
        return e.map((r) => {
          if (this.isProp(r)) {
            let n = this.prefixed(r[0]);
            return n.length > 1 ? this.convert(n) : r;
          }
          return typeof r == 'object' ? this.add(r, t) : r;
        });
      }
      process(e) {
        let t = nl.parse(e.params);
        (t = this.normalize(t)),
          (t = this.remove(t, e.params)),
          (t = this.add(t, e.params)),
          (t = this.cleanBrackets(t)),
          (e.params = nl.stringify(t));
      }
      disabled(e) {
        if (
          !this.all.options.grid &&
          ((e.prop === 'display' && e.value.includes('grid')) ||
            e.prop.includes('grid') ||
            e.prop === 'justify-items')
        )
          return !0;
        if (this.all.options.flexbox === !1) {
          if (e.prop === 'display' && e.value.includes('flex')) return !0;
          let t = ['order', 'justify-content', 'align-items', 'align-content'];
          if (e.prop.includes('flex') || t.includes(e.prop)) return !0;
        }
        return !1;
      }
    };
    mg.exports = hg;
  });
  var bg = v((W4, wg) => {
    l();
    var yg = class {
      constructor(e, t) {
        (this.prefix = t),
          (this.prefixed = e.prefixed(this.prefix)),
          (this.regexp = e.regexp(this.prefix)),
          (this.prefixeds = e
            .possible()
            .map((r) => [e.prefixed(r), e.regexp(r)])),
          (this.unprefixed = e.name),
          (this.nameRegexp = e.regexp());
      }
      isHack(e) {
        let t = e.parent.index(e) + 1,
          r = e.parent.nodes;
        for (; t < r.length; ) {
          let n = r[t].selector;
          if (!n) return !0;
          if (n.includes(this.unprefixed) && n.match(this.nameRegexp))
            return !1;
          let a = !1;
          for (let [s, o] of this.prefixeds)
            if (n.includes(s) && n.match(o)) {
              a = !0;
              break;
            }
          if (!a) return !0;
          t += 1;
        }
        return !0;
      }
      check(e) {
        return !(
          !e.selector.includes(this.prefixed) ||
          !e.selector.match(this.regexp) ||
          this.isHack(e)
        );
      }
    };
    wg.exports = yg;
  });
  var Gt = v((G4, xg) => {
    l();
    var { list: MA } = me(),
      BA = bg(),
      FA = Vt(),
      NA = ct(),
      LA = ue(),
      vg = class extends FA {
        constructor(e, t, r) {
          super(e, t, r);
          this.regexpCache = new Map();
        }
        check(e) {
          return e.selector.includes(this.name)
            ? !!e.selector.match(this.regexp())
            : !1;
        }
        prefixed(e) {
          return this.name.replace(/^(\W*)/, `$1${e}`);
        }
        regexp(e) {
          if (!this.regexpCache.has(e)) {
            let t = e ? this.prefixed(e) : this.name;
            this.regexpCache.set(
              e,
              new RegExp(`(^|[^:"'=])${LA.escapeRegexp(t)}`, 'gi'),
            );
          }
          return this.regexpCache.get(e);
        }
        possible() {
          return NA.prefixes();
        }
        prefixeds(e) {
          if (e._autoprefixerPrefixeds) {
            if (e._autoprefixerPrefixeds[this.name])
              return e._autoprefixerPrefixeds;
          } else e._autoprefixerPrefixeds = {};
          let t = {};
          if (e.selector.includes(',')) {
            let n = MA.comma(e.selector).filter((a) => a.includes(this.name));
            for (let a of this.possible())
              t[a] = n.map((s) => this.replace(s, a)).join(', ');
          } else
            for (let r of this.possible()) t[r] = this.replace(e.selector, r);
          return (
            (e._autoprefixerPrefixeds[this.name] = t), e._autoprefixerPrefixeds
          );
        }
        already(e, t, r) {
          let n = e.parent.index(e) - 1;
          for (; n >= 0; ) {
            let a = e.parent.nodes[n];
            if (a.type !== 'rule') return !1;
            let s = !1;
            for (let o in t[this.name]) {
              let u = t[this.name][o];
              if (a.selector === u) {
                if (r === o) return !0;
                s = !0;
                break;
              }
            }
            if (!s) return !1;
            n -= 1;
          }
          return !1;
        }
        replace(e, t) {
          return e.replace(this.regexp(), `$1${this.prefixed(t)}`);
        }
        add(e, t) {
          let r = this.prefixeds(e);
          if (this.already(e, r, t)) return;
          let n = this.clone(e, { selector: r[this.name][t] });
          e.parent.insertBefore(e, n);
        }
        old(e) {
          return new BA(this, e);
        }
      };
    xg.exports = vg;
  });
  var Cg = v((H4, Sg) => {
    l();
    var $A = Vt(),
      kg = class extends $A {
        add(e, t) {
          let r = t + e.name;
          if (e.parent.some((s) => s.name === r && s.params === e.params))
            return;
          let a = this.clone(e, { name: r });
          return e.parent.insertBefore(e, a);
        }
        process(e) {
          let t = this.parentPrefix(e);
          for (let r of this.prefixes) (!t || t === r) && this.add(e, r);
        }
      };
    Sg.exports = kg;
  });
  var _g = v((Y4, Ag) => {
    l();
    var jA = Gt(),
      sl = class extends jA {
        prefixed(e) {
          return e === '-webkit-'
            ? ':-webkit-full-screen'
            : e === '-moz-'
            ? ':-moz-full-screen'
            : `:${e}fullscreen`;
        }
      };
    sl.names = [':fullscreen'];
    Ag.exports = sl;
  });
  var Og = v((Q4, Eg) => {
    l();
    var zA = Gt(),
      al = class extends zA {
        possible() {
          return super.possible().concat(['-moz- old', '-ms- old']);
        }
        prefixed(e) {
          return e === '-webkit-'
            ? '::-webkit-input-placeholder'
            : e === '-ms-'
            ? '::-ms-input-placeholder'
            : e === '-ms- old'
            ? ':-ms-input-placeholder'
            : e === '-moz- old'
            ? ':-moz-placeholder'
            : `::${e}placeholder`;
        }
      };
    al.names = ['::placeholder'];
    Eg.exports = al;
  });
  var Pg = v((J4, Tg) => {
    l();
    var VA = Gt(),
      ol = class extends VA {
        prefixed(e) {
          return e === '-ms-'
            ? ':-ms-input-placeholder'
            : `:${e}placeholder-shown`;
        }
      };
    ol.names = [':placeholder-shown'];
    Tg.exports = ol;
  });
  var Ig = v((X4, Dg) => {
    l();
    var UA = Gt(),
      WA = ue(),
      ll = class extends UA {
        constructor(e, t, r) {
          super(e, t, r);
          this.prefixes &&
            (this.prefixes = WA.uniq(this.prefixes.map((n) => '-webkit-')));
        }
        prefixed(e) {
          return e === '-webkit-'
            ? '::-webkit-file-upload-button'
            : `::${e}file-selector-button`;
        }
      };
    ll.names = ['::file-selector-button'];
    Dg.exports = ll;
  });
  var de = v((K4, qg) => {
    l();
    qg.exports = function (i) {
      let e;
      return (
        i === '-webkit- 2009' || i === '-moz-'
          ? (e = 2009)
          : i === '-ms-'
          ? (e = 2012)
          : i === '-webkit-' && (e = 'final'),
        i === '-webkit- 2009' && (i = '-webkit-'),
        [e, i]
      );
    };
  });
  var Fg = v((Z4, Bg) => {
    l();
    var Rg = me().list,
      Mg = de(),
      GA = R(),
      Ht = class extends GA {
        prefixed(e, t) {
          let r;
          return (
            ([r, t] = Mg(t)), r === 2009 ? t + 'box-flex' : super.prefixed(e, t)
          );
        }
        normalize() {
          return 'flex';
        }
        set(e, t) {
          let r = Mg(t)[0];
          if (r === 2009)
            return (
              (e.value = Rg.space(e.value)[0]),
              (e.value = Ht.oldValues[e.value] || e.value),
              super.set(e, t)
            );
          if (r === 2012) {
            let n = Rg.space(e.value);
            n.length === 3 &&
              n[2] === '0' &&
              (e.value = n.slice(0, 2).concat('0px').join(' '));
          }
          return super.set(e, t);
        }
      };
    Ht.names = ['flex', 'box-flex'];
    Ht.oldValues = { auto: '1', none: '0' };
    Bg.exports = Ht;
  });
  var $g = v((eq, Lg) => {
    l();
    var Ng = de(),
      HA = R(),
      ul = class extends HA {
        prefixed(e, t) {
          let r;
          return (
            ([r, t] = Ng(t)),
            r === 2009
              ? t + 'box-ordinal-group'
              : r === 2012
              ? t + 'flex-order'
              : super.prefixed(e, t)
          );
        }
        normalize() {
          return 'order';
        }
        set(e, t) {
          return Ng(t)[0] === 2009 && /\d/.test(e.value)
            ? ((e.value = (parseInt(e.value) + 1).toString()), super.set(e, t))
            : super.set(e, t);
        }
      };
    ul.names = ['order', 'flex-order', 'box-ordinal-group'];
    Lg.exports = ul;
  });
  var zg = v((tq, jg) => {
    l();
    var YA = R(),
      fl = class extends YA {
        check(e) {
          let t = e.value;
          return (
            !t.toLowerCase().includes('alpha(') &&
            !t.includes('DXImageTransform.Microsoft') &&
            !t.includes('data:image/svg+xml')
          );
        }
      };
    fl.names = ['filter'];
    jg.exports = fl;
  });
  var Ug = v((rq, Vg) => {
    l();
    var QA = R(),
      cl = class extends QA {
        insert(e, t, r, n) {
          if (t !== '-ms-') return super.insert(e, t, r);
          let a = this.clone(e),
            s = e.prop.replace(/end$/, 'start'),
            o = t + e.prop.replace(/end$/, 'span');
          if (!e.parent.some((u) => u.prop === o)) {
            if (((a.prop = o), e.value.includes('span')))
              a.value = e.value.replace(/span\s/i, '');
            else {
              let u;
              if (
                (e.parent.walkDecls(s, (c) => {
                  u = c;
                }),
                u)
              ) {
                let c = Number(e.value) - Number(u.value) + '';
                a.value = c;
              } else e.warn(n, `Can not prefix ${e.prop} (${s} is not found)`);
            }
            e.cloneBefore(a);
          }
        }
      };
    cl.names = ['grid-row-end', 'grid-column-end'];
    Vg.exports = cl;
  });
  var Gg = v((iq, Wg) => {
    l();
    var JA = R(),
      pl = class extends JA {
        check(e) {
          return !e.value.split(/\s+/).some((t) => {
            let r = t.toLowerCase();
            return r === 'reverse' || r === 'alternate-reverse';
          });
        }
      };
    pl.names = ['animation', 'animation-direction'];
    Wg.exports = pl;
  });
  var Yg = v((nq, Hg) => {
    l();
    var XA = de(),
      KA = R(),
      dl = class extends KA {
        insert(e, t, r) {
          let n;
          if ((([n, t] = XA(t)), n !== 2009)) return super.insert(e, t, r);
          let a = e.value
            .split(/\s+/)
            .filter((p) => p !== 'wrap' && p !== 'nowrap' && 'wrap-reverse');
          if (
            a.length === 0 ||
            e.parent.some(
              (p) =>
                p.prop === t + 'box-orient' || p.prop === t + 'box-direction',
            )
          )
            return;
          let o = a[0],
            u = o.includes('row') ? 'horizontal' : 'vertical',
            c = o.includes('reverse') ? 'reverse' : 'normal',
            f = this.clone(e);
          return (
            (f.prop = t + 'box-orient'),
            (f.value = u),
            this.needCascade(e) && (f.raws.before = this.calcBefore(r, e, t)),
            e.parent.insertBefore(e, f),
            (f = this.clone(e)),
            (f.prop = t + 'box-direction'),
            (f.value = c),
            this.needCascade(e) && (f.raws.before = this.calcBefore(r, e, t)),
            e.parent.insertBefore(e, f)
          );
        }
      };
    dl.names = ['flex-flow', 'box-direction', 'box-orient'];
    Hg.exports = dl;
  });
  var Jg = v((sq, Qg) => {
    l();
    var ZA = de(),
      e_ = R(),
      hl = class extends e_ {
        normalize() {
          return 'flex';
        }
        prefixed(e, t) {
          let r;
          return (
            ([r, t] = ZA(t)),
            r === 2009
              ? t + 'box-flex'
              : r === 2012
              ? t + 'flex-positive'
              : super.prefixed(e, t)
          );
        }
      };
    hl.names = ['flex-grow', 'flex-positive'];
    Qg.exports = hl;
  });
  var Kg = v((aq, Xg) => {
    l();
    var t_ = de(),
      r_ = R(),
      ml = class extends r_ {
        set(e, t) {
          if (t_(t)[0] !== 2009) return super.set(e, t);
        }
      };
    ml.names = ['flex-wrap'];
    Xg.exports = ml;
  });
  var ey = v((oq, Zg) => {
    l();
    var i_ = R(),
      Yt = dt(),
      gl = class extends i_ {
        insert(e, t, r, n) {
          if (t !== '-ms-') return super.insert(e, t, r);
          let a = Yt.parse(e),
            [s, o] = Yt.translate(a, 0, 2),
            [u, c] = Yt.translate(a, 1, 3);
          [
            ['grid-row', s],
            ['grid-row-span', o],
            ['grid-column', u],
            ['grid-column-span', c],
          ].forEach(([f, p]) => {
            Yt.insertDecl(e, f, p);
          }),
            Yt.warnTemplateSelectorNotFound(e, n),
            Yt.warnIfGridRowColumnExists(e, n);
        }
      };
    gl.names = ['grid-area'];
    Zg.exports = gl;
  });
  var ry = v((lq, ty) => {
    l();
    var n_ = R(),
      ni = dt(),
      yl = class extends n_ {
        insert(e, t, r) {
          if (t !== '-ms-') return super.insert(e, t, r);
          if (e.parent.some((s) => s.prop === '-ms-grid-row-align')) return;
          let [[n, a]] = ni.parse(e);
          a
            ? (ni.insertDecl(e, 'grid-row-align', n),
              ni.insertDecl(e, 'grid-column-align', a))
            : (ni.insertDecl(e, 'grid-row-align', n),
              ni.insertDecl(e, 'grid-column-align', n));
        }
      };
    yl.names = ['place-self'];
    ty.exports = yl;
  });
  var ny = v((uq, iy) => {
    l();
    var s_ = R(),
      wl = class extends s_ {
        check(e) {
          let t = e.value;
          return !t.includes('/') || t.includes('span');
        }
        normalize(e) {
          return e.replace('-start', '');
        }
        prefixed(e, t) {
          let r = super.prefixed(e, t);
          return t === '-ms-' && (r = r.replace('-start', '')), r;
        }
      };
    wl.names = ['grid-row-start', 'grid-column-start'];
    iy.exports = wl;
  });
  var oy = v((fq, ay) => {
    l();
    var sy = de(),
      a_ = R(),
      Qt = class extends a_ {
        check(e) {
          return (
            e.parent &&
            !e.parent.some((t) => t.prop && t.prop.startsWith('grid-'))
          );
        }
        prefixed(e, t) {
          let r;
          return (
            ([r, t] = sy(t)),
            r === 2012 ? t + 'flex-item-align' : super.prefixed(e, t)
          );
        }
        normalize() {
          return 'align-self';
        }
        set(e, t) {
          let r = sy(t)[0];
          if (r === 2012)
            return (
              (e.value = Qt.oldValues[e.value] || e.value), super.set(e, t)
            );
          if (r === 'final') return super.set(e, t);
        }
      };
    Qt.names = ['align-self', 'flex-item-align'];
    Qt.oldValues = { 'flex-end': 'end', 'flex-start': 'start' };
    ay.exports = Qt;
  });
  var uy = v((cq, ly) => {
    l();
    var o_ = R(),
      l_ = ue(),
      bl = class extends o_ {
        constructor(e, t, r) {
          super(e, t, r);
          this.prefixes &&
            (this.prefixes = l_.uniq(
              this.prefixes.map((n) => (n === '-ms-' ? '-webkit-' : n)),
            ));
        }
      };
    bl.names = ['appearance'];
    ly.exports = bl;
  });
  var py = v((pq, cy) => {
    l();
    var fy = de(),
      u_ = R(),
      vl = class extends u_ {
        normalize() {
          return 'flex-basis';
        }
        prefixed(e, t) {
          let r;
          return (
            ([r, t] = fy(t)),
            r === 2012 ? t + 'flex-preferred-size' : super.prefixed(e, t)
          );
        }
        set(e, t) {
          let r;
          if ((([r, t] = fy(t)), r === 2012 || r === 'final'))
            return super.set(e, t);
        }
      };
    vl.names = ['flex-basis', 'flex-preferred-size'];
    cy.exports = vl;
  });
  var hy = v((dq, dy) => {
    l();
    var f_ = R(),
      xl = class extends f_ {
        normalize() {
          return this.name.replace('box-image', 'border');
        }
        prefixed(e, t) {
          let r = super.prefixed(e, t);
          return t === '-webkit-' && (r = r.replace('border', 'box-image')), r;
        }
      };
    xl.names = [
      'mask-border',
      'mask-border-source',
      'mask-border-slice',
      'mask-border-width',
      'mask-border-outset',
      'mask-border-repeat',
      'mask-box-image',
      'mask-box-image-source',
      'mask-box-image-slice',
      'mask-box-image-width',
      'mask-box-image-outset',
      'mask-box-image-repeat',
    ];
    dy.exports = xl;
  });
  var gy = v((hq, my) => {
    l();
    var c_ = R(),
      Le = class extends c_ {
        insert(e, t, r) {
          let n = e.prop === 'mask-composite',
            a;
          n ? (a = e.value.split(',')) : (a = e.value.match(Le.regexp) || []),
            (a = a.map((c) => c.trim()).filter((c) => c));
          let s = a.length,
            o;
          if (
            (s &&
              ((o = this.clone(e)),
              (o.value = a.map((c) => Le.oldValues[c] || c).join(', ')),
              a.includes('intersect') && (o.value += ', xor'),
              (o.prop = t + 'mask-composite')),
            n)
          )
            return s
              ? (this.needCascade(e) &&
                  (o.raws.before = this.calcBefore(r, e, t)),
                e.parent.insertBefore(e, o))
              : void 0;
          let u = this.clone(e);
          return (
            (u.prop = t + u.prop),
            s && (u.value = u.value.replace(Le.regexp, '')),
            this.needCascade(e) && (u.raws.before = this.calcBefore(r, e, t)),
            e.parent.insertBefore(e, u),
            s
              ? (this.needCascade(e) &&
                  (o.raws.before = this.calcBefore(r, e, t)),
                e.parent.insertBefore(e, o))
              : e
          );
        }
      };
    Le.names = ['mask', 'mask-composite'];
    Le.oldValues = {
      add: 'source-over',
      subtract: 'source-out',
      intersect: 'source-in',
      exclude: 'xor',
    };
    Le.regexp = new RegExp(
      `\\s+(${Object.keys(Le.oldValues).join('|')})\\b(?!\\))\\s*(?=[,])`,
      'ig',
    );
    my.exports = Le;
  });
  var by = v((mq, wy) => {
    l();
    var yy = de(),
      p_ = R(),
      Jt = class extends p_ {
        prefixed(e, t) {
          let r;
          return (
            ([r, t] = yy(t)),
            r === 2009
              ? t + 'box-align'
              : r === 2012
              ? t + 'flex-align'
              : super.prefixed(e, t)
          );
        }
        normalize() {
          return 'align-items';
        }
        set(e, t) {
          let r = yy(t)[0];
          return (
            (r === 2009 || r === 2012) &&
              (e.value = Jt.oldValues[e.value] || e.value),
            super.set(e, t)
          );
        }
      };
    Jt.names = ['align-items', 'flex-align', 'box-align'];
    Jt.oldValues = { 'flex-end': 'end', 'flex-start': 'start' };
    wy.exports = Jt;
  });
  var xy = v((gq, vy) => {
    l();
    var d_ = R(),
      kl = class extends d_ {
        set(e, t) {
          return (
            t === '-ms-' && e.value === 'contain' && (e.value = 'element'),
            super.set(e, t)
          );
        }
        insert(e, t, r) {
          if (!(e.value === 'all' && t === '-ms-'))
            return super.insert(e, t, r);
        }
      };
    kl.names = ['user-select'];
    vy.exports = kl;
  });
  var Cy = v((yq, Sy) => {
    l();
    var ky = de(),
      h_ = R(),
      Sl = class extends h_ {
        normalize() {
          return 'flex-shrink';
        }
        prefixed(e, t) {
          let r;
          return (
            ([r, t] = ky(t)),
            r === 2012 ? t + 'flex-negative' : super.prefixed(e, t)
          );
        }
        set(e, t) {
          let r;
          if ((([r, t] = ky(t)), r === 2012 || r === 'final'))
            return super.set(e, t);
        }
      };
    Sl.names = ['flex-shrink', 'flex-negative'];
    Sy.exports = Sl;
  });
  var _y = v((wq, Ay) => {
    l();
    var m_ = R(),
      Cl = class extends m_ {
        prefixed(e, t) {
          return `${t}column-${e}`;
        }
        normalize(e) {
          return e.includes('inside')
            ? 'break-inside'
            : e.includes('before')
            ? 'break-before'
            : 'break-after';
        }
        set(e, t) {
          return (
            ((e.prop === 'break-inside' && e.value === 'avoid-column') ||
              e.value === 'avoid-page') &&
              (e.value = 'avoid'),
            super.set(e, t)
          );
        }
        insert(e, t, r) {
          if (e.prop !== 'break-inside') return super.insert(e, t, r);
          if (!(/region/i.test(e.value) || /page/i.test(e.value)))
            return super.insert(e, t, r);
        }
      };
    Cl.names = [
      'break-inside',
      'page-break-inside',
      'column-break-inside',
      'break-before',
      'page-break-before',
      'column-break-before',
      'break-after',
      'page-break-after',
      'column-break-after',
    ];
    Ay.exports = Cl;
  });
  var Oy = v((bq, Ey) => {
    l();
    var g_ = R(),
      Al = class extends g_ {
        prefixed(e, t) {
          return t + 'print-color-adjust';
        }
        normalize() {
          return 'color-adjust';
        }
      };
    Al.names = ['color-adjust', 'print-color-adjust'];
    Ey.exports = Al;
  });
  var Py = v((vq, Ty) => {
    l();
    var y_ = R(),
      Xt = class extends y_ {
        insert(e, t, r) {
          if (t === '-ms-') {
            let n = this.set(this.clone(e), t);
            this.needCascade(e) && (n.raws.before = this.calcBefore(r, e, t));
            let a = 'ltr';
            return (
              e.parent.nodes.forEach((s) => {
                s.prop === 'direction' &&
                  (s.value === 'rtl' || s.value === 'ltr') &&
                  (a = s.value);
              }),
              (n.value = Xt.msValues[a][e.value] || e.value),
              e.parent.insertBefore(e, n)
            );
          }
          return super.insert(e, t, r);
        }
      };
    Xt.names = ['writing-mode'];
    Xt.msValues = {
      ltr: {
        'horizontal-tb': 'lr-tb',
        'vertical-rl': 'tb-rl',
        'vertical-lr': 'tb-lr',
      },
      rtl: {
        'horizontal-tb': 'rl-tb',
        'vertical-rl': 'bt-rl',
        'vertical-lr': 'bt-lr',
      },
    };
    Ty.exports = Xt;
  });
  var Iy = v((xq, Dy) => {
    l();
    var w_ = R(),
      _l = class extends w_ {
        set(e, t) {
          return (
            (e.value = e.value.replace(/\s+fill(\s)/, '$1')), super.set(e, t)
          );
        }
      };
    _l.names = ['border-image'];
    Dy.exports = _l;
  });
  var My = v((kq, Ry) => {
    l();
    var qy = de(),
      b_ = R(),
      Kt = class extends b_ {
        prefixed(e, t) {
          let r;
          return (
            ([r, t] = qy(t)),
            r === 2012 ? t + 'flex-line-pack' : super.prefixed(e, t)
          );
        }
        normalize() {
          return 'align-content';
        }
        set(e, t) {
          let r = qy(t)[0];
          if (r === 2012)
            return (
              (e.value = Kt.oldValues[e.value] || e.value), super.set(e, t)
            );
          if (r === 'final') return super.set(e, t);
        }
      };
    Kt.names = ['align-content', 'flex-line-pack'];
    Kt.oldValues = {
      'flex-end': 'end',
      'flex-start': 'start',
      'space-between': 'justify',
      'space-around': 'distribute',
    };
    Ry.exports = Kt;
  });
  var Fy = v((Sq, By) => {
    l();
    var v_ = R(),
      Se = class extends v_ {
        prefixed(e, t) {
          return t === '-moz-'
            ? t + (Se.toMozilla[e] || e)
            : super.prefixed(e, t);
        }
        normalize(e) {
          return Se.toNormal[e] || e;
        }
      };
    Se.names = ['border-radius'];
    Se.toMozilla = {};
    Se.toNormal = {};
    for (let i of ['top', 'bottom'])
      for (let e of ['left', 'right']) {
        let t = `border-${i}-${e}-radius`,
          r = `border-radius-${i}${e}`;
        Se.names.push(t),
          Se.names.push(r),
          (Se.toMozilla[t] = r),
          (Se.toNormal[r] = t);
      }
    By.exports = Se;
  });
  var Ly = v((Cq, Ny) => {
    l();
    var x_ = R(),
      El = class extends x_ {
        prefixed(e, t) {
          return e.includes('-start')
            ? t + e.replace('-block-start', '-before')
            : t + e.replace('-block-end', '-after');
        }
        normalize(e) {
          return e.includes('-before')
            ? e.replace('-before', '-block-start')
            : e.replace('-after', '-block-end');
        }
      };
    El.names = [
      'border-block-start',
      'border-block-end',
      'margin-block-start',
      'margin-block-end',
      'padding-block-start',
      'padding-block-end',
      'border-before',
      'border-after',
      'margin-before',
      'margin-after',
      'padding-before',
      'padding-after',
    ];
    Ny.exports = El;
  });
  var jy = v((Aq, $y) => {
    l();
    var k_ = R(),
      {
        parseTemplate: S_,
        warnMissedAreas: C_,
        getGridGap: A_,
        warnGridGap: __,
        inheritGridGap: E_,
      } = dt(),
      Ol = class extends k_ {
        insert(e, t, r, n) {
          if (t !== '-ms-') return super.insert(e, t, r);
          if (e.parent.some((h) => h.prop === '-ms-grid-rows')) return;
          let a = A_(e),
            s = E_(e, a),
            { rows: o, columns: u, areas: c } = S_({ decl: e, gap: s || a }),
            f = Object.keys(c).length > 0,
            p = Boolean(o),
            d = Boolean(u);
          return (
            __({ gap: a, hasColumns: d, decl: e, result: n }),
            C_(c, e, n),
            ((p && d) || f) &&
              e.cloneBefore({ prop: '-ms-grid-rows', value: o, raws: {} }),
            d &&
              e.cloneBefore({ prop: '-ms-grid-columns', value: u, raws: {} }),
            e
          );
        }
      };
    Ol.names = ['grid-template'];
    $y.exports = Ol;
  });
  var Vy = v((_q, zy) => {
    l();
    var O_ = R(),
      Tl = class extends O_ {
        prefixed(e, t) {
          return t + e.replace('-inline', '');
        }
        normalize(e) {
          return e.replace(
            /(margin|padding|border)-(start|end)/,
            '$1-inline-$2',
          );
        }
      };
    Tl.names = [
      'border-inline-start',
      'border-inline-end',
      'margin-inline-start',
      'margin-inline-end',
      'padding-inline-start',
      'padding-inline-end',
      'border-start',
      'border-end',
      'margin-start',
      'margin-end',
      'padding-start',
      'padding-end',
    ];
    zy.exports = Tl;
  });
  var Wy = v((Eq, Uy) => {
    l();
    var T_ = R(),
      Pl = class extends T_ {
        check(e) {
          return !e.value.includes('flex-') && e.value !== 'baseline';
        }
        prefixed(e, t) {
          return t + 'grid-row-align';
        }
        normalize() {
          return 'align-self';
        }
      };
    Pl.names = ['grid-row-align'];
    Uy.exports = Pl;
  });
  var Hy = v((Oq, Gy) => {
    l();
    var P_ = R(),
      Zt = class extends P_ {
        keyframeParents(e) {
          let { parent: t } = e;
          for (; t; ) {
            if (t.type === 'atrule' && t.name === 'keyframes') return !0;
            ({ parent: t } = t);
          }
          return !1;
        }
        contain3d(e) {
          if (e.prop === 'transform-origin') return !1;
          for (let t of Zt.functions3d)
            if (e.value.includes(`${t}(`)) return !0;
          return !1;
        }
        set(e, t) {
          return (
            (e = super.set(e, t)),
            t === '-ms-' && (e.value = e.value.replace(/rotatez/gi, 'rotate')),
            e
          );
        }
        insert(e, t, r) {
          if (t === '-ms-') {
            if (!this.contain3d(e) && !this.keyframeParents(e))
              return super.insert(e, t, r);
          } else if (t === '-o-') {
            if (!this.contain3d(e)) return super.insert(e, t, r);
          } else return super.insert(e, t, r);
        }
      };
    Zt.names = ['transform', 'transform-origin'];
    Zt.functions3d = [
      'matrix3d',
      'translate3d',
      'translateZ',
      'scale3d',
      'scaleZ',
      'rotate3d',
      'rotateX',
      'rotateY',
      'perspective',
    ];
    Gy.exports = Zt;
  });
  var Jy = v((Tq, Qy) => {
    l();
    var Yy = de(),
      D_ = R(),
      Dl = class extends D_ {
        normalize() {
          return 'flex-direction';
        }
        insert(e, t, r) {
          let n;
          if ((([n, t] = Yy(t)), n !== 2009)) return super.insert(e, t, r);
          if (
            e.parent.some(
              (f) =>
                f.prop === t + 'box-orient' || f.prop === t + 'box-direction',
            )
          )
            return;
          let s = e.value,
            o,
            u;
          s === 'inherit' || s === 'initial' || s === 'unset'
            ? ((o = s), (u = s))
            : ((o = s.includes('row') ? 'horizontal' : 'vertical'),
              (u = s.includes('reverse') ? 'reverse' : 'normal'));
          let c = this.clone(e);
          return (
            (c.prop = t + 'box-orient'),
            (c.value = o),
            this.needCascade(e) && (c.raws.before = this.calcBefore(r, e, t)),
            e.parent.insertBefore(e, c),
            (c = this.clone(e)),
            (c.prop = t + 'box-direction'),
            (c.value = u),
            this.needCascade(e) && (c.raws.before = this.calcBefore(r, e, t)),
            e.parent.insertBefore(e, c)
          );
        }
        old(e, t) {
          let r;
          return (
            ([r, t] = Yy(t)),
            r === 2009
              ? [t + 'box-orient', t + 'box-direction']
              : super.old(e, t)
          );
        }
      };
    Dl.names = ['flex-direction', 'box-direction', 'box-orient'];
    Qy.exports = Dl;
  });
  var Ky = v((Pq, Xy) => {
    l();
    var I_ = R(),
      Il = class extends I_ {
        check(e) {
          return e.value === 'pixelated';
        }
        prefixed(e, t) {
          return t === '-ms-' ? '-ms-interpolation-mode' : super.prefixed(e, t);
        }
        set(e, t) {
          return t !== '-ms-'
            ? super.set(e, t)
            : ((e.prop = '-ms-interpolation-mode'),
              (e.value = 'nearest-neighbor'),
              e);
        }
        normalize() {
          return 'image-rendering';
        }
        process(e, t) {
          return super.process(e, t);
        }
      };
    Il.names = ['image-rendering', 'interpolation-mode'];
    Xy.exports = Il;
  });
  var ew = v((Dq, Zy) => {
    l();
    var q_ = R(),
      R_ = ue(),
      ql = class extends q_ {
        constructor(e, t, r) {
          super(e, t, r);
          this.prefixes &&
            (this.prefixes = R_.uniq(
              this.prefixes.map((n) => (n === '-ms-' ? '-webkit-' : n)),
            ));
        }
      };
    ql.names = ['backdrop-filter'];
    Zy.exports = ql;
  });
  var rw = v((Iq, tw) => {
    l();
    var M_ = R(),
      B_ = ue(),
      Rl = class extends M_ {
        constructor(e, t, r) {
          super(e, t, r);
          this.prefixes &&
            (this.prefixes = B_.uniq(
              this.prefixes.map((n) => (n === '-ms-' ? '-webkit-' : n)),
            ));
        }
        check(e) {
          return e.value.toLowerCase() === 'text';
        }
      };
    Rl.names = ['background-clip'];
    tw.exports = Rl;
  });
  var nw = v((qq, iw) => {
    l();
    var F_ = R(),
      N_ = [
        'none',
        'underline',
        'overline',
        'line-through',
        'blink',
        'inherit',
        'initial',
        'unset',
      ],
      Ml = class extends F_ {
        check(e) {
          return e.value.split(/\s+/).some((t) => !N_.includes(t));
        }
      };
    Ml.names = ['text-decoration'];
    iw.exports = Ml;
  });
  var ow = v((Rq, aw) => {
    l();
    var sw = de(),
      L_ = R(),
      er = class extends L_ {
        prefixed(e, t) {
          let r;
          return (
            ([r, t] = sw(t)),
            r === 2009
              ? t + 'box-pack'
              : r === 2012
              ? t + 'flex-pack'
              : super.prefixed(e, t)
          );
        }
        normalize() {
          return 'justify-content';
        }
        set(e, t) {
          let r = sw(t)[0];
          if (r === 2009 || r === 2012) {
            let n = er.oldValues[e.value] || e.value;
            if (((e.value = n), r !== 2009 || n !== 'distribute'))
              return super.set(e, t);
          } else if (r === 'final') return super.set(e, t);
        }
      };
    er.names = ['justify-content', 'flex-pack', 'box-pack'];
    er.oldValues = {
      'flex-end': 'end',
      'flex-start': 'start',
      'space-between': 'justify',
      'space-around': 'distribute',
    };
    aw.exports = er;
  });
  var uw = v((Mq, lw) => {
    l();
    var $_ = R(),
      Bl = class extends $_ {
        set(e, t) {
          let r = e.value.toLowerCase();
          return (
            t === '-webkit-' &&
              !r.includes(' ') &&
              r !== 'contain' &&
              r !== 'cover' &&
              (e.value = e.value + ' ' + e.value),
            super.set(e, t)
          );
        }
      };
    Bl.names = ['background-size'];
    lw.exports = Bl;
  });
  var cw = v((Bq, fw) => {
    l();
    var j_ = R(),
      Fl = dt(),
      Nl = class extends j_ {
        insert(e, t, r) {
          if (t !== '-ms-') return super.insert(e, t, r);
          let n = Fl.parse(e),
            [a, s] = Fl.translate(n, 0, 1);
          n[0] &&
            n[0].includes('span') &&
            (s = n[0].join('').replace(/\D/g, '')),
            [
              [e.prop, a],
              [`${e.prop}-span`, s],
            ].forEach(([u, c]) => {
              Fl.insertDecl(e, u, c);
            });
        }
      };
    Nl.names = ['grid-row', 'grid-column'];
    fw.exports = Nl;
  });
  var hw = v((Fq, dw) => {
    l();
    var z_ = R(),
      {
        prefixTrackProp: pw,
        prefixTrackValue: V_,
        autoplaceGridItems: U_,
        getGridGap: W_,
        inheritGridGap: G_,
      } = dt(),
      H_ = il(),
      Ll = class extends z_ {
        prefixed(e, t) {
          return t === '-ms-'
            ? pw({ prop: e, prefix: t })
            : super.prefixed(e, t);
        }
        normalize(e) {
          return e.replace(/^grid-(rows|columns)/, 'grid-template-$1');
        }
        insert(e, t, r, n) {
          if (t !== '-ms-') return super.insert(e, t, r);
          let { parent: a, prop: s, value: o } = e,
            u = s.includes('rows'),
            c = s.includes('columns'),
            f = a.some(
              (k) =>
                k.prop === 'grid-template' || k.prop === 'grid-template-areas',
            );
          if (f && u) return !1;
          let p = new H_({ options: {} }),
            d = p.gridStatus(a, n),
            h = W_(e);
          h = G_(e, h) || h;
          let y = u ? h.row : h.column;
          (d === 'no-autoplace' || d === !0) && !f && (y = null);
          let x = V_({ value: o, gap: y });
          e.cloneBefore({ prop: pw({ prop: s, prefix: t }), value: x });
          let w = a.nodes.find((k) => k.prop === 'grid-auto-flow'),
            b = 'row';
          if (
            (w && !p.disabled(w, n) && (b = w.value.trim()), d === 'autoplace')
          ) {
            let k = a.nodes.find((_) => _.prop === 'grid-template-rows');
            if (!k && f) return;
            if (!k && !f) {
              e.warn(
                n,
                'Autoplacement does not work without grid-template-rows property',
              );
              return;
            }
            !a.nodes.find((_) => _.prop === 'grid-template-columns') &&
              !f &&
              e.warn(
                n,
                'Autoplacement does not work without grid-template-columns property',
              ),
              c && !f && U_(e, n, h, b);
          }
        }
      };
    Ll.names = [
      'grid-template-rows',
      'grid-template-columns',
      'grid-rows',
      'grid-columns',
    ];
    dw.exports = Ll;
  });
  var gw = v((Nq, mw) => {
    l();
    var Y_ = R(),
      $l = class extends Y_ {
        check(e) {
          return !e.value.includes('flex-') && e.value !== 'baseline';
        }
        prefixed(e, t) {
          return t + 'grid-column-align';
        }
        normalize() {
          return 'justify-self';
        }
      };
    $l.names = ['grid-column-align'];
    mw.exports = $l;
  });
  var ww = v((Lq, yw) => {
    l();
    var Q_ = R(),
      jl = class extends Q_ {
        prefixed(e, t) {
          return t + 'scroll-chaining';
        }
        normalize() {
          return 'overscroll-behavior';
        }
        set(e, t) {
          return (
            e.value === 'auto'
              ? (e.value = 'chained')
              : (e.value === 'none' || e.value === 'contain') &&
                (e.value = 'none'),
            super.set(e, t)
          );
        }
      };
    jl.names = ['overscroll-behavior', 'scroll-chaining'];
    yw.exports = jl;
  });
  var xw = v(($q, vw) => {
    l();
    var J_ = R(),
      {
        parseGridAreas: X_,
        warnMissedAreas: K_,
        prefixTrackProp: Z_,
        prefixTrackValue: bw,
        getGridGap: eE,
        warnGridGap: tE,
        inheritGridGap: rE,
      } = dt();
    function iE(i) {
      return i
        .trim()
        .slice(1, -1)
        .split(/["']\s*["']?/g);
    }
    var zl = class extends J_ {
      insert(e, t, r, n) {
        if (t !== '-ms-') return super.insert(e, t, r);
        let a = !1,
          s = !1,
          o = e.parent,
          u = eE(e);
        (u = rE(e, u) || u),
          o.walkDecls(/-ms-grid-rows/, (p) => p.remove()),
          o.walkDecls(/grid-template-(rows|columns)/, (p) => {
            if (p.prop === 'grid-template-rows') {
              s = !0;
              let { prop: d, value: h } = p;
              p.cloneBefore({
                prop: Z_({ prop: d, prefix: t }),
                value: bw({ value: h, gap: u.row }),
              });
            } else a = !0;
          });
        let c = iE(e.value);
        a &&
          !s &&
          u.row &&
          c.length > 1 &&
          e.cloneBefore({
            prop: '-ms-grid-rows',
            value: bw({ value: `repeat(${c.length}, auto)`, gap: u.row }),
            raws: {},
          }),
          tE({ gap: u, hasColumns: a, decl: e, result: n });
        let f = X_({ rows: c, gap: u });
        return K_(f, e, n), e;
      }
    };
    zl.names = ['grid-template-areas'];
    vw.exports = zl;
  });
  var Sw = v((jq, kw) => {
    l();
    var nE = R(),
      Vl = class extends nE {
        set(e, t) {
          return (
            t === '-webkit-' &&
              (e.value = e.value.replace(/\s*(right|left)\s*/i, '')),
            super.set(e, t)
          );
        }
      };
    Vl.names = ['text-emphasis-position'];
    kw.exports = Vl;
  });
  var Aw = v((zq, Cw) => {
    l();
    var sE = R(),
      Ul = class extends sE {
        set(e, t) {
          return e.prop === 'text-decoration-skip-ink' && e.value === 'auto'
            ? ((e.prop = t + 'text-decoration-skip'), (e.value = 'ink'), e)
            : super.set(e, t);
        }
      };
    Ul.names = ['text-decoration-skip-ink', 'text-decoration-skip'];
    Cw.exports = Ul;
  });
  var Dw = v((Vq, Pw) => {
    l();
    ('use strict');
    Pw.exports = {
      wrap: _w,
      limit: Ew,
      validate: Ow,
      test: Wl,
      curry: aE,
      name: Tw,
    };
    function _w(i, e, t) {
      var r = e - i;
      return ((((t - i) % r) + r) % r) + i;
    }
    function Ew(i, e, t) {
      return Math.max(i, Math.min(e, t));
    }
    function Ow(i, e, t, r, n) {
      if (!Wl(i, e, t, r, n))
        throw new Error(t + ' is outside of range [' + i + ',' + e + ')');
      return t;
    }
    function Wl(i, e, t, r, n) {
      return !(t < i || t > e || (n && t === e) || (r && t === i));
    }
    function Tw(i, e, t, r) {
      return (t ? '(' : '[') + i + ',' + e + (r ? ')' : ']');
    }
    function aE(i, e, t, r) {
      var n = Tw.bind(null, i, e, t, r);
      return {
        wrap: _w.bind(null, i, e),
        limit: Ew.bind(null, i, e),
        validate: function (a) {
          return Ow(i, e, a, t, r);
        },
        test: function (a) {
          return Wl(i, e, a, t, r);
        },
        toString: n,
        name: n,
      };
    }
  });
  var Rw = v((Uq, qw) => {
    l();
    var Gl = Yn(),
      oE = Dw(),
      lE = Wt(),
      uE = ke(),
      fE = ue(),
      Iw = /top|left|right|bottom/gi,
      Qe = class extends uE {
        replace(e, t) {
          let r = Gl(e);
          for (let n of r.nodes)
            if (n.type === 'function' && n.value === this.name)
              if (
                ((n.nodes = this.newDirection(n.nodes)),
                (n.nodes = this.normalize(n.nodes)),
                t === '-webkit- old')
              ) {
                if (!this.oldWebkit(n)) return !1;
              } else
                (n.nodes = this.convertDirection(n.nodes)),
                  (n.value = t + n.value);
          return r.toString();
        }
        replaceFirst(e, ...t) {
          return t
            .map((n) =>
              n === ' '
                ? { type: 'space', value: n }
                : { type: 'word', value: n },
            )
            .concat(e.slice(1));
        }
        normalizeUnit(e, t) {
          return `${(parseFloat(e) / t) * 360}deg`;
        }
        normalize(e) {
          if (!e[0]) return e;
          if (/-?\d+(.\d+)?grad/.test(e[0].value))
            e[0].value = this.normalizeUnit(e[0].value, 400);
          else if (/-?\d+(.\d+)?rad/.test(e[0].value))
            e[0].value = this.normalizeUnit(e[0].value, 2 * Math.PI);
          else if (/-?\d+(.\d+)?turn/.test(e[0].value))
            e[0].value = this.normalizeUnit(e[0].value, 1);
          else if (e[0].value.includes('deg')) {
            let t = parseFloat(e[0].value);
            (t = oE.wrap(0, 360, t)), (e[0].value = `${t}deg`);
          }
          return (
            e[0].value === '0deg'
              ? (e = this.replaceFirst(e, 'to', ' ', 'top'))
              : e[0].value === '90deg'
              ? (e = this.replaceFirst(e, 'to', ' ', 'right'))
              : e[0].value === '180deg'
              ? (e = this.replaceFirst(e, 'to', ' ', 'bottom'))
              : e[0].value === '270deg' &&
                (e = this.replaceFirst(e, 'to', ' ', 'left')),
            e
          );
        }
        newDirection(e) {
          if (e[0].value === 'to' || ((Iw.lastIndex = 0), !Iw.test(e[0].value)))
            return e;
          e.unshift(
            { type: 'word', value: 'to' },
            { type: 'space', value: ' ' },
          );
          for (let t = 2; t < e.length && e[t].type !== 'div'; t++)
            e[t].type === 'word' &&
              (e[t].value = this.revertDirection(e[t].value));
          return e;
        }
        isRadial(e) {
          let t = 'before';
          for (let r of e)
            if (t === 'before' && r.type === 'space') t = 'at';
            else if (t === 'at' && r.value === 'at') t = 'after';
            else {
              if (t === 'after' && r.type === 'space') return !0;
              if (r.type === 'div') break;
              t = 'before';
            }
          return !1;
        }
        convertDirection(e) {
          return (
            e.length > 0 &&
              (e[0].value === 'to'
                ? this.fixDirection(e)
                : e[0].value.includes('deg')
                ? this.fixAngle(e)
                : this.isRadial(e) && this.fixRadial(e)),
            e
          );
        }
        fixDirection(e) {
          e.splice(0, 2);
          for (let t of e) {
            if (t.type === 'div') break;
            t.type === 'word' && (t.value = this.revertDirection(t.value));
          }
        }
        fixAngle(e) {
          let t = e[0].value;
          (t = parseFloat(t)),
            (t = Math.abs(450 - t) % 360),
            (t = this.roundFloat(t, 3)),
            (e[0].value = `${t}deg`);
        }
        fixRadial(e) {
          let t = [],
            r = [],
            n,
            a,
            s,
            o,
            u;
          for (o = 0; o < e.length - 2; o++)
            if (
              ((n = e[o]),
              (a = e[o + 1]),
              (s = e[o + 2]),
              n.type === 'space' && a.value === 'at' && s.type === 'space')
            ) {
              u = o + 3;
              break;
            } else t.push(n);
          let c;
          for (o = u; o < e.length; o++)
            if (e[o].type === 'div') {
              c = e[o];
              break;
            } else r.push(e[o]);
          e.splice(0, o, ...r, c, ...t);
        }
        revertDirection(e) {
          return Qe.directions[e.toLowerCase()] || e;
        }
        roundFloat(e, t) {
          return parseFloat(e.toFixed(t));
        }
        oldWebkit(e) {
          let { nodes: t } = e,
            r = Gl.stringify(e.nodes);
          if (
            this.name !== 'linear-gradient' ||
            (t[0] && t[0].value.includes('deg')) ||
            r.includes('px') ||
            r.includes('-corner') ||
            r.includes('-side')
          )
            return !1;
          let n = [[]];
          for (let a of t)
            n[n.length - 1].push(a),
              a.type === 'div' && a.value === ',' && n.push([]);
          this.oldDirection(n), this.colorStops(n), (e.nodes = []);
          for (let a of n) e.nodes = e.nodes.concat(a);
          return (
            e.nodes.unshift(
              { type: 'word', value: 'linear' },
              this.cloneDiv(e.nodes),
            ),
            (e.value = '-webkit-gradient'),
            !0
          );
        }
        oldDirection(e) {
          let t = this.cloneDiv(e[0]);
          if (e[0][0].value !== 'to')
            return e.unshift([
              { type: 'word', value: Qe.oldDirections.bottom },
              t,
            ]);
          {
            let r = [];
            for (let a of e[0].slice(2))
              a.type === 'word' && r.push(a.value.toLowerCase());
            r = r.join(' ');
            let n = Qe.oldDirections[r] || r;
            return (e[0] = [{ type: 'word', value: n }, t]), e[0];
          }
        }
        cloneDiv(e) {
          for (let t of e) if (t.type === 'div' && t.value === ',') return t;
          return { type: 'div', value: ',', after: ' ' };
        }
        colorStops(e) {
          let t = [];
          for (let r = 0; r < e.length; r++) {
            let n,
              a = e[r],
              s;
            if (r === 0) continue;
            let o = Gl.stringify(a[0]);
            a[1] && a[1].type === 'word'
              ? (n = a[1].value)
              : a[2] && a[2].type === 'word' && (n = a[2].value);
            let u;
            r === 1 && (!n || n === '0%')
              ? (u = `from(${o})`)
              : r === e.length - 1 && (!n || n === '100%')
              ? (u = `to(${o})`)
              : n
              ? (u = `color-stop(${n}, ${o})`)
              : (u = `color-stop(${o})`);
            let c = a[a.length - 1];
            (e[r] = [{ type: 'word', value: u }]),
              c.type === 'div' && c.value === ',' && (s = e[r].push(c)),
              t.push(s);
          }
          return t;
        }
        old(e) {
          if (e === '-webkit-') {
            let t = this.name === 'linear-gradient' ? 'linear' : 'radial',
              r = '-gradient',
              n = fE.regexp(`-webkit-(${t}-gradient|gradient\\(\\s*${t})`, !1);
            return new lE(this.name, e + this.name, r, n);
          } else return super.old(e);
        }
        add(e, t) {
          let r = e.prop;
          if (r.includes('mask')) {
            if (t === '-webkit-' || t === '-webkit- old')
              return super.add(e, t);
          } else if (
            r === 'list-style' ||
            r === 'list-style-image' ||
            r === 'content'
          ) {
            if (t === '-webkit-' || t === '-webkit- old')
              return super.add(e, t);
          } else return super.add(e, t);
        }
      };
    Qe.names = [
      'linear-gradient',
      'repeating-linear-gradient',
      'radial-gradient',
      'repeating-radial-gradient',
    ];
    Qe.directions = {
      top: 'bottom',
      left: 'right',
      bottom: 'top',
      right: 'left',
    };
    Qe.oldDirections = {
      top: 'left bottom, left top',
      left: 'right top, left top',
      bottom: 'left top, left bottom',
      right: 'left top, right top',
      'top right': 'left bottom, right top',
      'top left': 'right bottom, left top',
      'right top': 'left bottom, right top',
      'right bottom': 'left top, right bottom',
      'bottom right': 'left top, right bottom',
      'bottom left': 'right top, left bottom',
      'left top': 'right bottom, left top',
      'left bottom': 'right top, left bottom',
    };
    qw.exports = Qe;
  });
  var Fw = v((Wq, Bw) => {
    l();
    var cE = Wt(),
      pE = ke();
    function Mw(i) {
      return new RegExp(`(^|[\\s,(])(${i}($|[\\s),]))`, 'gi');
    }
    var Hl = class extends pE {
      regexp() {
        return (
          this.regexpCache || (this.regexpCache = Mw(this.name)),
          this.regexpCache
        );
      }
      isStretch() {
        return (
          this.name === 'stretch' ||
          this.name === 'fill' ||
          this.name === 'fill-available'
        );
      }
      replace(e, t) {
        return t === '-moz-' && this.isStretch()
          ? e.replace(this.regexp(), '$1-moz-available$3')
          : t === '-webkit-' && this.isStretch()
          ? e.replace(this.regexp(), '$1-webkit-fill-available$3')
          : super.replace(e, t);
      }
      old(e) {
        let t = e + this.name;
        return (
          this.isStretch() &&
            (e === '-moz-'
              ? (t = '-moz-available')
              : e === '-webkit-' && (t = '-webkit-fill-available')),
          new cE(this.name, t, t, Mw(t))
        );
      }
      add(e, t) {
        if (!(e.prop.includes('grid') && t !== '-webkit-'))
          return super.add(e, t);
      }
    };
    Hl.names = [
      'max-content',
      'min-content',
      'fit-content',
      'fill',
      'fill-available',
      'stretch',
    ];
    Bw.exports = Hl;
  });
  var $w = v((Gq, Lw) => {
    l();
    var Nw = Wt(),
      dE = ke(),
      Yl = class extends dE {
        replace(e, t) {
          return t === '-webkit-'
            ? e.replace(this.regexp(), '$1-webkit-optimize-contrast')
            : t === '-moz-'
            ? e.replace(this.regexp(), '$1-moz-crisp-edges')
            : super.replace(e, t);
        }
        old(e) {
          return e === '-webkit-'
            ? new Nw(this.name, '-webkit-optimize-contrast')
            : e === '-moz-'
            ? new Nw(this.name, '-moz-crisp-edges')
            : super.old(e);
        }
      };
    Yl.names = ['pixelated'];
    Lw.exports = Yl;
  });
  var zw = v((Hq, jw) => {
    l();
    var hE = ke(),
      Ql = class extends hE {
        replace(e, t) {
          let r = super.replace(e, t);
          return (
            t === '-webkit-' &&
              (r = r.replace(/("[^"]+"|'[^']+')(\s+\d+\w)/gi, 'url($1)$2')),
            r
          );
        }
      };
    Ql.names = ['image-set'];
    jw.exports = Ql;
  });
  var Uw = v((Yq, Vw) => {
    l();
    var mE = me().list,
      gE = ke(),
      Jl = class extends gE {
        replace(e, t) {
          return mE
            .space(e)
            .map((r) => {
              if (r.slice(0, +this.name.length + 1) !== this.name + '(')
                return r;
              let n = r.lastIndexOf(')'),
                a = r.slice(n + 1),
                s = r.slice(this.name.length + 1, n);
              if (t === '-webkit-') {
                let o = s.match(/\d*.?\d+%?/);
                o
                  ? ((s = s.slice(o[0].length).trim()), (s += `, ${o[0]}`))
                  : (s += ', 0.5');
              }
              return t + this.name + '(' + s + ')' + a;
            })
            .join(' ');
        }
      };
    Jl.names = ['cross-fade'];
    Vw.exports = Jl;
  });
  var Gw = v((Qq, Ww) => {
    l();
    var yE = de(),
      wE = Wt(),
      bE = ke(),
      Xl = class extends bE {
        constructor(e, t) {
          super(e, t);
          e === 'display-flex' && (this.name = 'flex');
        }
        check(e) {
          return e.prop === 'display' && e.value === this.name;
        }
        prefixed(e) {
          let t, r;
          return (
            ([t, e] = yE(e)),
            t === 2009
              ? this.name === 'flex'
                ? (r = 'box')
                : (r = 'inline-box')
              : t === 2012
              ? this.name === 'flex'
                ? (r = 'flexbox')
                : (r = 'inline-flexbox')
              : t === 'final' && (r = this.name),
            e + r
          );
        }
        replace(e, t) {
          return this.prefixed(t);
        }
        old(e) {
          let t = this.prefixed(e);
          if (!!t) return new wE(this.name, t);
        }
      };
    Xl.names = ['display-flex', 'inline-flex'];
    Ww.exports = Xl;
  });
  var Yw = v((Jq, Hw) => {
    l();
    var vE = ke(),
      Kl = class extends vE {
        constructor(e, t) {
          super(e, t);
          e === 'display-grid' && (this.name = 'grid');
        }
        check(e) {
          return e.prop === 'display' && e.value === this.name;
        }
      };
    Kl.names = ['display-grid', 'inline-grid'];
    Hw.exports = Kl;
  });
  var Jw = v((Xq, Qw) => {
    l();
    var xE = ke(),
      Zl = class extends xE {
        constructor(e, t) {
          super(e, t);
          e === 'filter-function' && (this.name = 'filter');
        }
      };
    Zl.names = ['filter', 'filter-function'];
    Qw.exports = Zl;
  });
  var eb = v((Kq, Zw) => {
    l();
    var Xw = ii(),
      M = R(),
      Kw = qm(),
      kE = Xm(),
      SE = il(),
      CE = gg(),
      eu = ct(),
      tr = Gt(),
      AE = Cg(),
      $e = ke(),
      rr = ue(),
      _E = _g(),
      EE = Og(),
      OE = Pg(),
      TE = Ig(),
      PE = Fg(),
      DE = $g(),
      IE = zg(),
      qE = Ug(),
      RE = Gg(),
      ME = Yg(),
      BE = Jg(),
      FE = Kg(),
      NE = ey(),
      LE = ry(),
      $E = ny(),
      jE = oy(),
      zE = uy(),
      VE = py(),
      UE = hy(),
      WE = gy(),
      GE = by(),
      HE = xy(),
      YE = Cy(),
      QE = _y(),
      JE = Oy(),
      XE = Py(),
      KE = Iy(),
      ZE = My(),
      e5 = Fy(),
      t5 = Ly(),
      r5 = jy(),
      i5 = Vy(),
      n5 = Wy(),
      s5 = Hy(),
      a5 = Jy(),
      o5 = Ky(),
      l5 = ew(),
      u5 = rw(),
      f5 = nw(),
      c5 = ow(),
      p5 = uw(),
      d5 = cw(),
      h5 = hw(),
      m5 = gw(),
      g5 = ww(),
      y5 = xw(),
      w5 = Sw(),
      b5 = Aw(),
      v5 = Rw(),
      x5 = Fw(),
      k5 = $w(),
      S5 = zw(),
      C5 = Uw(),
      A5 = Gw(),
      _5 = Yw(),
      E5 = Jw();
    tr.hack(_E);
    tr.hack(EE);
    tr.hack(OE);
    tr.hack(TE);
    M.hack(PE);
    M.hack(DE);
    M.hack(IE);
    M.hack(qE);
    M.hack(RE);
    M.hack(ME);
    M.hack(BE);
    M.hack(FE);
    M.hack(NE);
    M.hack(LE);
    M.hack($E);
    M.hack(jE);
    M.hack(zE);
    M.hack(VE);
    M.hack(UE);
    M.hack(WE);
    M.hack(GE);
    M.hack(HE);
    M.hack(YE);
    M.hack(QE);
    M.hack(JE);
    M.hack(XE);
    M.hack(KE);
    M.hack(ZE);
    M.hack(e5);
    M.hack(t5);
    M.hack(r5);
    M.hack(i5);
    M.hack(n5);
    M.hack(s5);
    M.hack(a5);
    M.hack(o5);
    M.hack(l5);
    M.hack(u5);
    M.hack(f5);
    M.hack(c5);
    M.hack(p5);
    M.hack(d5);
    M.hack(h5);
    M.hack(m5);
    M.hack(g5);
    M.hack(y5);
    M.hack(w5);
    M.hack(b5);
    $e.hack(v5);
    $e.hack(x5);
    $e.hack(k5);
    $e.hack(S5);
    $e.hack(C5);
    $e.hack(A5);
    $e.hack(_5);
    $e.hack(E5);
    var tu = new Map(),
      si = class {
        constructor(e, t, r = {}) {
          (this.data = e),
            (this.browsers = t),
            (this.options = r),
            ([this.add, this.remove] = this.preprocess(this.select(this.data))),
            (this.transition = new kE(this)),
            (this.processor = new SE(this));
        }
        cleaner() {
          if (this.cleanerCache) return this.cleanerCache;
          if (this.browsers.selected.length) {
            let e = new eu(this.browsers.data, []);
            this.cleanerCache = new si(this.data, e, this.options);
          } else return this;
          return this.cleanerCache;
        }
        select(e) {
          let t = { add: {}, remove: {} };
          for (let r in e) {
            let n = e[r],
              a = n.browsers.map((u) => {
                let c = u.split(' ');
                return { browser: `${c[0]} ${c[1]}`, note: c[2] };
              }),
              s = a
                .filter((u) => u.note)
                .map((u) => `${this.browsers.prefix(u.browser)} ${u.note}`);
            (s = rr.uniq(s)),
              (a = a
                .filter((u) => this.browsers.isSelected(u.browser))
                .map((u) => {
                  let c = this.browsers.prefix(u.browser);
                  return u.note ? `${c} ${u.note}` : c;
                })),
              (a = this.sort(rr.uniq(a))),
              this.options.flexbox === 'no-2009' &&
                (a = a.filter((u) => !u.includes('2009')));
            let o = n.browsers.map((u) => this.browsers.prefix(u));
            n.mistakes && (o = o.concat(n.mistakes)),
              (o = o.concat(s)),
              (o = rr.uniq(o)),
              a.length
                ? ((t.add[r] = a),
                  a.length < o.length &&
                    (t.remove[r] = o.filter((u) => !a.includes(u))))
                : (t.remove[r] = o);
          }
          return t;
        }
        sort(e) {
          return e.sort((t, r) => {
            let n = rr.removeNote(t).length,
              a = rr.removeNote(r).length;
            return n === a ? r.length - t.length : a - n;
          });
        }
        preprocess(e) {
          let t = { selectors: [], '@supports': new CE(si, this) };
          for (let n in e.add) {
            let a = e.add[n];
            if (n === '@keyframes' || n === '@viewport')
              t[n] = new AE(n, a, this);
            else if (n === '@resolution') t[n] = new Kw(n, a, this);
            else if (this.data[n].selector)
              t.selectors.push(tr.load(n, a, this));
            else {
              let s = this.data[n].props;
              if (s) {
                let o = $e.load(n, a, this);
                for (let u of s)
                  t[u] || (t[u] = { values: [] }), t[u].values.push(o);
              } else {
                let o = (t[n] && t[n].values) || [];
                (t[n] = M.load(n, a, this)), (t[n].values = o);
              }
            }
          }
          let r = { selectors: [] };
          for (let n in e.remove) {
            let a = e.remove[n];
            if (this.data[n].selector) {
              let s = tr.load(n, a);
              for (let o of a) r.selectors.push(s.old(o));
            } else if (n === '@keyframes' || n === '@viewport')
              for (let s of a) {
                let o = `@${s}${n.slice(1)}`;
                r[o] = { remove: !0 };
              }
            else if (n === '@resolution') r[n] = new Kw(n, a, this);
            else {
              let s = this.data[n].props;
              if (s) {
                let o = $e.load(n, [], this);
                for (let u of a) {
                  let c = o.old(u);
                  if (c)
                    for (let f of s)
                      r[f] || (r[f] = {}),
                        r[f].values || (r[f].values = []),
                        r[f].values.push(c);
                }
              } else
                for (let o of a) {
                  let u = this.decl(n).old(n, o);
                  if (n === 'align-self') {
                    let c = t[n] && t[n].prefixes;
                    if (c) {
                      if (o === '-webkit- 2009' && c.includes('-webkit-'))
                        continue;
                      if (o === '-webkit-' && c.includes('-webkit- 2009'))
                        continue;
                    }
                  }
                  for (let c of u) r[c] || (r[c] = {}), (r[c].remove = !0);
                }
            }
          }
          return [t, r];
        }
        decl(e) {
          return tu.has(e) || tu.set(e, M.load(e)), tu.get(e);
        }
        unprefixed(e) {
          let t = this.normalize(Xw.unprefixed(e));
          return t === 'flex-direction' && (t = 'flex-flow'), t;
        }
        normalize(e) {
          return this.decl(e).normalize(e);
        }
        prefixed(e, t) {
          return (e = Xw.unprefixed(e)), this.decl(e).prefixed(e, t);
        }
        values(e, t) {
          let r = this[e],
            n = r['*'] && r['*'].values,
            a = r[t] && r[t].values;
          return n && a ? rr.uniq(n.concat(a)) : n || a || [];
        }
        group(e) {
          let t = e.parent,
            r = t.index(e),
            { length: n } = t.nodes,
            a = this.unprefixed(e.prop),
            s = (o, u) => {
              for (r += o; r >= 0 && r < n; ) {
                let c = t.nodes[r];
                if (c.type === 'decl') {
                  if (
                    (o === -1 && c.prop === a && !eu.withPrefix(c.value)) ||
                    this.unprefixed(c.prop) !== a
                  )
                    break;
                  if (u(c) === !0) return !0;
                  if (o === 1 && c.prop === a && !eu.withPrefix(c.value)) break;
                }
                r += o;
              }
              return !1;
            };
          return {
            up(o) {
              return s(-1, o);
            },
            down(o) {
              return s(1, o);
            },
          };
        }
      };
    Zw.exports = si;
  });
  var rb = v((Zq, tb) => {
    l();
    tb.exports = {
      'backdrop-filter': {
        feature: 'css-backdrop-filter',
        browsers: [
          'ios_saf 16.1',
          'ios_saf 16.3',
          'ios_saf 16.4',
          'ios_saf 16.5',
          'safari 16.5',
        ],
      },
      element: {
        props: [
          'background',
          'background-image',
          'border-image',
          'mask',
          'list-style',
          'list-style-image',
          'content',
          'mask-image',
        ],
        feature: 'css-element-function',
        browsers: ['firefox 114'],
      },
      'user-select': {
        mistakes: ['-khtml-'],
        feature: 'user-select-none',
        browsers: [
          'ios_saf 16.1',
          'ios_saf 16.3',
          'ios_saf 16.4',
          'ios_saf 16.5',
          'safari 16.5',
        ],
      },
      'background-clip': {
        feature: 'background-clip-text',
        browsers: [
          'and_chr 114',
          'and_uc 15.5',
          'chrome 109',
          'chrome 113',
          'chrome 114',
          'edge 114',
          'opera 99',
          'samsung 21',
        ],
      },
      hyphens: {
        feature: 'css-hyphens',
        browsers: [
          'ios_saf 16.1',
          'ios_saf 16.3',
          'ios_saf 16.4',
          'ios_saf 16.5',
          'safari 16.5',
        ],
      },
      fill: {
        props: [
          'width',
          'min-width',
          'max-width',
          'height',
          'min-height',
          'max-height',
          'inline-size',
          'min-inline-size',
          'max-inline-size',
          'block-size',
          'min-block-size',
          'max-block-size',
          'grid',
          'grid-template',
          'grid-template-rows',
          'grid-template-columns',
          'grid-auto-columns',
          'grid-auto-rows',
        ],
        feature: 'intrinsic-width',
        browsers: [
          'and_chr 114',
          'and_uc 15.5',
          'chrome 109',
          'chrome 113',
          'chrome 114',
          'edge 114',
          'opera 99',
          'samsung 21',
        ],
      },
      'fill-available': {
        props: [
          'width',
          'min-width',
          'max-width',
          'height',
          'min-height',
          'max-height',
          'inline-size',
          'min-inline-size',
          'max-inline-size',
          'block-size',
          'min-block-size',
          'max-block-size',
          'grid',
          'grid-template',
          'grid-template-rows',
          'grid-template-columns',
          'grid-auto-columns',
          'grid-auto-rows',
        ],
        feature: 'intrinsic-width',
        browsers: [
          'and_chr 114',
          'and_uc 15.5',
          'chrome 109',
          'chrome 113',
          'chrome 114',
          'edge 114',
          'opera 99',
          'samsung 21',
        ],
      },
      stretch: {
        props: [
          'width',
          'min-width',
          'max-width',
          'height',
          'min-height',
          'max-height',
          'inline-size',
          'min-inline-size',
          'max-inline-size',
          'block-size',
          'min-block-size',
          'max-block-size',
          'grid',
          'grid-template',
          'grid-template-rows',
          'grid-template-columns',
          'grid-auto-columns',
          'grid-auto-rows',
        ],
        feature: 'intrinsic-width',
        browsers: ['firefox 114'],
      },
      'fit-content': {
        props: [
          'width',
          'min-width',
          'max-width',
          'height',
          'min-height',
          'max-height',
          'inline-size',
          'min-inline-size',
          'max-inline-size',
          'block-size',
          'min-block-size',
          'max-block-size',
          'grid',
          'grid-template',
          'grid-template-rows',
          'grid-template-columns',
          'grid-auto-columns',
          'grid-auto-rows',
        ],
        feature: 'intrinsic-width',
        browsers: ['firefox 114'],
      },
      'text-decoration-style': {
        feature: 'text-decoration',
        browsers: [
          'ios_saf 16.1',
          'ios_saf 16.3',
          'ios_saf 16.4',
          'ios_saf 16.5',
        ],
      },
      'text-decoration-color': {
        feature: 'text-decoration',
        browsers: [
          'ios_saf 16.1',
          'ios_saf 16.3',
          'ios_saf 16.4',
          'ios_saf 16.5',
        ],
      },
      'text-decoration-line': {
        feature: 'text-decoration',
        browsers: [
          'ios_saf 16.1',
          'ios_saf 16.3',
          'ios_saf 16.4',
          'ios_saf 16.5',
        ],
      },
      'text-decoration': {
        feature: 'text-decoration',
        browsers: [
          'ios_saf 16.1',
          'ios_saf 16.3',
          'ios_saf 16.4',
          'ios_saf 16.5',
        ],
      },
      'text-decoration-skip': {
        feature: 'text-decoration',
        browsers: [
          'ios_saf 16.1',
          'ios_saf 16.3',
          'ios_saf 16.4',
          'ios_saf 16.5',
        ],
      },
      'text-decoration-skip-ink': {
        feature: 'text-decoration',
        browsers: [
          'ios_saf 16.1',
          'ios_saf 16.3',
          'ios_saf 16.4',
          'ios_saf 16.5',
        ],
      },
      'text-size-adjust': {
        feature: 'text-size-adjust',
        browsers: [
          'ios_saf 16.1',
          'ios_saf 16.3',
          'ios_saf 16.4',
          'ios_saf 16.5',
        ],
      },
      'mask-clip': {
        feature: 'css-masks',
        browsers: [
          'and_chr 114',
          'and_uc 15.5',
          'chrome 109',
          'chrome 113',
          'chrome 114',
          'edge 114',
          'opera 99',
          'samsung 21',
        ],
      },
      'mask-composite': {
        feature: 'css-masks',
        browsers: [
          'and_chr 114',
          'and_uc 15.5',
          'chrome 109',
          'chrome 113',
          'chrome 114',
          'edge 114',
          'opera 99',
          'samsung 21',
        ],
      },
      'mask-image': {
        feature: 'css-masks',
        browsers: [
          'and_chr 114',
          'and_uc 15.5',
          'chrome 109',
          'chrome 113',
          'chrome 114',
          'edge 114',
          'opera 99',
          'samsung 21',
        ],
      },
      'mask-origin': {
        feature: 'css-masks',
        browsers: [
          'and_chr 114',
          'and_uc 15.5',
          'chrome 109',
          'chrome 113',
          'chrome 114',
          'edge 114',
          'opera 99',
          'samsung 21',
        ],
      },
      'mask-repeat': {
        feature: 'css-masks',
        browsers: [
          'and_chr 114',
          'and_uc 15.5',
          'chrome 109',
          'chrome 113',
          'chrome 114',
          'edge 114',
          'opera 99',
          'samsung 21',
        ],
      },
      'mask-border-repeat': {
        feature: 'css-masks',
        browsers: [
          'and_chr 114',
          'and_uc 15.5',
          'chrome 109',
          'chrome 113',
          'chrome 114',
          'edge 114',
          'opera 99',
          'samsung 21',
        ],
      },
      'mask-border-source': {
        feature: 'css-masks',
        browsers: [
          'and_chr 114',
          'and_uc 15.5',
          'chrome 109',
          'chrome 113',
          'chrome 114',
          'edge 114',
          'opera 99',
          'samsung 21',
        ],
      },
      mask: {
        feature: 'css-masks',
        browsers: [
          'and_chr 114',
          'and_uc 15.5',
          'chrome 109',
          'chrome 113',
          'chrome 114',
          'edge 114',
          'opera 99',
          'samsung 21',
        ],
      },
      'mask-position': {
        feature: 'css-masks',
        browsers: [
          'and_chr 114',
          'and_uc 15.5',
          'chrome 109',
          'chrome 113',
          'chrome 114',
          'edge 114',
          'opera 99',
          'samsung 21',
        ],
      },
      'mask-size': {
        feature: 'css-masks',
        browsers: [
          'and_chr 114',
          'and_uc 15.5',
          'chrome 109',
          'chrome 113',
          'chrome 114',
          'edge 114',
          'opera 99',
          'samsung 21',
        ],
      },
      'mask-border': {
        feature: 'css-masks',
        browsers: [
          'and_chr 114',
          'and_uc 15.5',
          'chrome 109',
          'chrome 113',
          'chrome 114',
          'edge 114',
          'opera 99',
          'samsung 21',
        ],
      },
      'mask-border-outset': {
        feature: 'css-masks',
        browsers: [
          'and_chr 114',
          'and_uc 15.5',
          'chrome 109',
          'chrome 113',
          'chrome 114',
          'edge 114',
          'opera 99',
          'samsung 21',
        ],
      },
      'mask-border-width': {
        feature: 'css-masks',
        browsers: [
          'and_chr 114',
          'and_uc 15.5',
          'chrome 109',
          'chrome 113',
          'chrome 114',
          'edge 114',
          'opera 99',
          'samsung 21',
        ],
      },
      'mask-border-slice': {
        feature: 'css-masks',
        browsers: [
          'and_chr 114',
          'and_uc 15.5',
          'chrome 109',
          'chrome 113',
          'chrome 114',
          'edge 114',
          'opera 99',
          'samsung 21',
        ],
      },
      'clip-path': { feature: 'css-clip-path', browsers: ['samsung 21'] },
      'box-decoration-break': {
        feature: 'css-boxdecorationbreak',
        browsers: [
          'and_chr 114',
          'and_uc 15.5',
          'chrome 109',
          'chrome 113',
          'chrome 114',
          'edge 114',
          'ios_saf 16.1',
          'ios_saf 16.3',
          'ios_saf 16.4',
          'ios_saf 16.5',
          'opera 99',
          'safari 16.5',
          'samsung 21',
        ],
      },
      appearance: { feature: 'css-appearance', browsers: ['samsung 21'] },
      'image-set': {
        props: [
          'background',
          'background-image',
          'border-image',
          'cursor',
          'mask',
          'mask-image',
          'list-style',
          'list-style-image',
          'content',
        ],
        feature: 'css-image-set',
        browsers: ['and_uc 15.5', 'chrome 109', 'samsung 21'],
      },
      'cross-fade': {
        props: [
          'background',
          'background-image',
          'border-image',
          'mask',
          'list-style',
          'list-style-image',
          'content',
          'mask-image',
        ],
        feature: 'css-cross-fade',
        browsers: [
          'and_chr 114',
          'and_uc 15.5',
          'chrome 109',
          'chrome 113',
          'chrome 114',
          'edge 114',
          'opera 99',
          'samsung 21',
        ],
      },
      isolate: {
        props: ['unicode-bidi'],
        feature: 'css-unicode-bidi',
        browsers: [
          'ios_saf 16.1',
          'ios_saf 16.3',
          'ios_saf 16.4',
          'ios_saf 16.5',
          'safari 16.5',
        ],
      },
      'color-adjust': {
        feature: 'css-color-adjust',
        browsers: [
          'chrome 109',
          'chrome 113',
          'chrome 114',
          'edge 114',
          'opera 99',
        ],
      },
    };
  });
  var nb = v((e6, ib) => {
    l();
    ib.exports = {};
  });
  var lb = v((t6, ob) => {
    l();
    var O5 = Wo(),
      { agents: T5 } = (zn(), jn),
      ru = bm(),
      P5 = ct(),
      D5 = eb(),
      I5 = rb(),
      q5 = nb(),
      sb = { browsers: T5, prefixes: I5 },
      ab = `
  Replace Autoprefixer \`browsers\` option to Browserslist config.
  Use \`browserslist\` key in \`package.json\` or \`.browserslistrc\` file.

  Using \`browsers\` option can cause errors. Browserslist config can
  be used for Babel, Autoprefixer, postcss-normalize and other tools.

  If you really need to use option, rename it to \`overrideBrowserslist\`.

  Learn more at:
  https://github.com/browserslist/browserslist#readme
  https://twitter.com/browserslist

`;
    function R5(i) {
      return Object.prototype.toString.apply(i) === '[object Object]';
    }
    var iu = new Map();
    function M5(i, e) {
      e.browsers.selected.length !== 0 &&
        (e.add.selectors.length > 0 ||
          Object.keys(e.add).length > 2 ||
          i.warn(`Autoprefixer target browsers do not need any prefixes.You do not need Autoprefixer anymore.
Check your Browserslist config to be sure that your targets are set up correctly.

  Learn more at:
  https://github.com/postcss/autoprefixer#readme
  https://github.com/browserslist/browserslist#readme

`));
    }
    ob.exports = ir;
    function ir(...i) {
      let e;
      if (
        (i.length === 1 && R5(i[0])
          ? ((e = i[0]), (i = void 0))
          : i.length === 0 || (i.length === 1 && !i[0])
          ? (i = void 0)
          : i.length <= 2 && (Array.isArray(i[0]) || !i[0])
          ? ((e = i[1]), (i = i[0]))
          : typeof i[i.length - 1] == 'object' && (e = i.pop()),
        e || (e = {}),
        e.browser)
      )
        throw new Error(
          'Change `browser` option to `overrideBrowserslist` in Autoprefixer',
        );
      if (e.browserslist)
        throw new Error(
          'Change `browserslist` option to `overrideBrowserslist` in Autoprefixer',
        );
      e.overrideBrowserslist
        ? (i = e.overrideBrowserslist)
        : e.browsers &&
          (typeof console != 'undefined' &&
            console.warn &&
            (ru.red
              ? console.warn(
                  ru.red(
                    ab.replace(/`[^`]+`/g, (n) => ru.yellow(n.slice(1, -1))),
                  ),
                )
              : console.warn(ab)),
          (i = e.browsers));
      let t = {
        ignoreUnknownVersions: e.ignoreUnknownVersions,
        stats: e.stats,
        env: e.env,
      };
      function r(n) {
        let a = sb,
          s = new P5(a.browsers, i, n, t),
          o = s.selected.join(', ') + JSON.stringify(e);
        return iu.has(o) || iu.set(o, new D5(a.prefixes, s, e)), iu.get(o);
      }
      return {
        postcssPlugin: 'autoprefixer',
        prepare(n) {
          let a = r({ from: n.opts.from, env: e.env });
          return {
            OnceExit(s) {
              M5(n, a),
                e.remove !== !1 && a.processor.remove(s, n),
                e.add !== !1 && a.processor.add(s, n);
            },
          };
        },
        info(n) {
          return (n = n || {}), (n.from = n.from || m.cwd()), q5(r(n));
        },
        options: e,
        browsers: i,
      };
    }
    ir.postcss = !0;
    ir.data = sb;
    ir.defaults = O5.defaults;
    ir.info = () => ir().info();
  });
  var ub = {};
  Ae(ub, { default: () => B5 });
  var B5,
    fb = C(() => {
      l();
      B5 = [];
    });
  var pb = {};
  Ae(pb, { default: () => F5 });
  var cb,
    F5,
    db = C(() => {
      l();
      hi();
      (cb = K(bi())), (F5 = Ze(cb.default.theme));
    });
  var mb = {};
  Ae(mb, { default: () => N5 });
  var hb,
    N5,
    gb = C(() => {
      l();
      hi();
      (hb = K(bi())), (N5 = Ze(hb.default));
    });
  l();
  ('use strict');
  var L5 = Je(ym()),
    $5 = Je(me()),
    j5 = Je(lb()),
    z5 = Je((fb(), ub)),
    V5 = Je((db(), pb)),
    U5 = Je((gb(), mb)),
    W5 = Je((ts(), ku)),
    G5 = Je((bo(), wo)),
    H5 = Je((gs(), rf));
  function Je(i) {
    return i && i.__esModule ? i : { default: i };
  }
  console.warn(
    'cdn.tailwindcss.com should not be used in production. To use Tailwind CSS in production, install it as a PostCSS plugin or use the Tailwind CLI: https://tailwindcss.com/docs/installation',
  );
  var Qn = 'tailwind',
    nu = 'text/tailwindcss',
    yb = '/template.html',
    vt,
    wb = !0,
    bb = 0,
    su = new Set(),
    au,
    vb = '',
    xb = (i = !1) => ({
      get(e, t) {
        return (!i || t === 'config') &&
          typeof e[t] == 'object' &&
          e[t] !== null
          ? new Proxy(e[t], xb())
          : e[t];
      },
      set(e, t, r) {
        return (e[t] = r), (!i || t === 'config') && ou(!0), !0;
      },
    });
  window[Qn] = new Proxy(
    {
      config: {},
      defaultTheme: V5.default,
      defaultConfig: U5.default,
      colors: W5.default,
      plugin: G5.default,
      resolveConfig: H5.default,
    },
    xb(!0),
  );
  function kb(i) {
    au.observe(i, {
      attributes: !0,
      attributeFilter: ['type'],
      characterData: !0,
      subtree: !0,
      childList: !0,
    });
  }
  new MutationObserver(async (i) => {
    let e = !1;
    if (!au) {
      au = new MutationObserver(async () => await ou(!0));
      for (let t of document.querySelectorAll(`style[type="${nu}"]`)) kb(t);
    }
    for (let t of i)
      for (let r of t.addedNodes)
        r.nodeType === 1 &&
          r.tagName === 'STYLE' &&
          r.getAttribute('type') === nu &&
          (kb(r), (e = !0));
    await ou(e);
  }).observe(document.documentElement, {
    attributes: !0,
    attributeFilter: ['class'],
    childList: !0,
    subtree: !0,
  });
  async function ou(i = !1) {
    i && (bb++, su.clear());
    let e = '';
    for (let r of document.querySelectorAll(`style[type="${nu}"]`))
      e += r.textContent;
    let t = new Set();
    for (let r of document.querySelectorAll('[class]'))
      for (let n of r.classList) su.has(n) || t.add(n);
    if (
      document.body &&
      (wb || t.size > 0 || e !== vb || !vt || !vt.isConnected)
    ) {
      for (let n of t) su.add(n);
      (wb = !1), (vb = e), (self[yb] = Array.from(t).join(' '));
      let { css: r } = await (0, $5.default)([
        (0, L5.default)({
          ...window[Qn].config,
          _hash: bb,
          content: [yb],
          plugins: [
            ...z5.default,
            ...(Array.isArray(window[Qn].config.plugins)
              ? window[Qn].config.plugins
              : []),
          ],
        }),
        (0, j5.default)({ remove: !1 }),
      ]).process(
        `@tailwind base;@tailwind components;@tailwind utilities;${e}`,
      );
      (!vt || !vt.isConnected) &&
        ((vt = document.createElement('style')), document.head.append(vt)),
        (vt.textContent = r);
    }
  }
})();
/*! https://mths.be/cssesc v3.0.0 by @mathias */
