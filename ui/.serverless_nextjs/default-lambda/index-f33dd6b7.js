'use strict';

var defaultHandler = require('./default-handler-364282fb.js');

function _mergeNamespaces(n, m) {
    m.forEach(function (e) {
        e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
            if (k !== 'default' && !(k in n)) {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    });
    return Object.freeze(n);
}

var stringify$1 = function (...args) {

    try {
        return JSON.stringify.apply(null, args);
    }
    catch (err) {
        return '[Cannot display object: ' + err.message + ']';
    }
};

var error = defaultHandler.createCommonjsModule(function (module, exports) {


module.exports = class extends Error {

    constructor(args) {

        const msgs = args
            .filter((arg) => arg !== '')
            .map((arg) => {

                return typeof arg === 'string' ? arg : arg instanceof Error ? arg.message : stringify$1(arg);
            });

        super(msgs.join(' ') || 'Unknown error');

        if (typeof Error.captureStackTrace === 'function') {            // $lab:coverage:ignore$
            Error.captureStackTrace(this, exports.assert);
        }
    }
};
});

var assert$1 = function (condition, ...args) {

    if (condition) {
        return;
    }

    if (args.length === 1 &&
        args[0] instanceof Error) {

        throw args[0];
    }

    throw new error(args);
};

const internals$9 = {};


var reach$1 = function (obj, chain, options) {

    if (chain === false ||
        chain === null ||
        chain === undefined) {

        return obj;
    }

    options = options || {};
    if (typeof options === 'string') {
        options = { separator: options };
    }

    const isChainArray = Array.isArray(chain);

    assert$1(!isChainArray || !options.separator, 'Separator option no valid for array-based chain');

    const path = isChainArray ? chain : chain.split(options.separator || '.');
    let ref = obj;
    for (let i = 0; i < path.length; ++i) {
        let key = path[i];
        const type = options.iterables && internals$9.iterables(ref);

        if (Array.isArray(ref) ||
            type === 'set') {

            const number = Number(key);
            if (Number.isInteger(number)) {
                key = number < 0 ? ref.length + number : number;
            }
        }

        if (!ref ||
            typeof ref === 'function' && options.functions === false ||         // Defaults to true
            !type && ref[key] === undefined) {

            assert$1(!options.strict || i + 1 === path.length, 'Missing segment', key, 'in reach path ', chain);
            assert$1(typeof ref === 'object' || options.functions === true || typeof ref !== 'function', 'Invalid segment', key, 'in reach path ', chain);
            ref = options.default;
            break;
        }

        if (!type) {
            ref = ref[key];
        }
        else if (type === 'set') {
            ref = [...ref][key];
        }
        else {  // type === 'map'
            ref = ref.get(key);
        }
    }

    return ref;
};


internals$9.iterables = function (ref) {

    if (ref instanceof Set) {
        return 'set';
    }

    if (ref instanceof Map) {
        return 'map';
    }
};

var types = defaultHandler.createCommonjsModule(function (module, exports) {

const internals = {};


exports = module.exports = {
    array: Array.prototype,
    buffer: Buffer && Buffer.prototype,             // $lab:coverage:ignore$
    date: Date.prototype,
    error: Error.prototype,
    generic: Object.prototype,
    map: Map.prototype,
    promise: Promise.prototype,
    regex: RegExp.prototype,
    set: Set.prototype,
    weakMap: WeakMap.prototype,
    weakSet: WeakSet.prototype
};


internals.typeMap = new Map([
    ['[object Error]', exports.error],
    ['[object Map]', exports.map],
    ['[object Promise]', exports.promise],
    ['[object Set]', exports.set],
    ['[object WeakMap]', exports.weakMap],
    ['[object WeakSet]', exports.weakSet]
]);


exports.getInternalProto = function (obj) {

    if (Array.isArray(obj)) {
        return exports.array;
    }

    if (Buffer && obj instanceof Buffer) {          // $lab:coverage:ignore$
        return exports.buffer;
    }

    if (obj instanceof Date) {
        return exports.date;
    }

    if (obj instanceof RegExp) {
        return exports.regex;
    }

    if (obj instanceof Error) {
        return exports.error;
    }

    const objName = Object.prototype.toString.call(obj);
    return internals.typeMap.get(objName) || exports.generic;
};
});

var keys = function (obj, options = {}) {

    return options.symbols !== false ? Reflect.ownKeys(obj) : Object.getOwnPropertyNames(obj);  // Defaults to true
};

var utils = {
	keys: keys
};

const internals$8 = {
    needsProtoHack: new Set([types.set, types.map, types.weakSet, types.weakMap])
};


var clone$1 = internals$8.clone = function (obj, options = {}, _seen = null) {

    if (typeof obj !== 'object' ||
        obj === null) {

        return obj;
    }

    let clone = internals$8.clone;
    let seen = _seen;

    if (options.shallow) {
        if (options.shallow !== true) {
            return internals$8.cloneWithShallow(obj, options);
        }

        clone = (value) => value;
    }
    else if (seen) {
        const lookup = seen.get(obj);
        if (lookup) {
            return lookup;
        }
    }
    else {
        seen = new Map();
    }

    // Built-in object types

    const baseProto = types.getInternalProto(obj);
    if (baseProto === types.buffer) {
        return Buffer && Buffer.from(obj);              // $lab:coverage:ignore$
    }

    if (baseProto === types.date) {
        return new Date(obj.getTime());
    }

    if (baseProto === types.regex) {
        return new RegExp(obj);
    }

    // Generic objects

    const newObj = internals$8.base(obj, baseProto, options);
    if (newObj === obj) {
        return obj;
    }

    if (seen) {
        seen.set(obj, newObj);                              // Set seen, since obj could recurse
    }

    if (baseProto === types.set) {
        for (const value of obj) {
            newObj.add(clone(value, options, seen));
        }
    }
    else if (baseProto === types.map) {
        for (const [key, value] of obj) {
            newObj.set(key, clone(value, options, seen));
        }
    }

    const keys = utils.keys(obj, options);
    for (const key of keys) {
        if (key === '__proto__') {
            continue;
        }

        if (baseProto === types.array &&
            key === 'length') {

            newObj.length = obj.length;
            continue;
        }

        const descriptor = Object.getOwnPropertyDescriptor(obj, key);
        if (descriptor) {
            if (descriptor.get ||
                descriptor.set) {

                Object.defineProperty(newObj, key, descriptor);
            }
            else if (descriptor.enumerable) {
                newObj[key] = clone(obj[key], options, seen);
            }
            else {
                Object.defineProperty(newObj, key, { enumerable: false, writable: true, configurable: true, value: clone(obj[key], options, seen) });
            }
        }
        else {
            Object.defineProperty(newObj, key, {
                enumerable: true,
                writable: true,
                configurable: true,
                value: clone(obj[key], options, seen)
            });
        }
    }

    return newObj;
};


internals$8.cloneWithShallow = function (source, options) {

    const keys = options.shallow;
    options = Object.assign({}, options);
    options.shallow = false;

    const seen = new Map();

    for (const key of keys) {
        const ref = reach$1(source, key);
        if (typeof ref === 'object' ||
            typeof ref === 'function') {

            seen.set(ref, ref);
        }
    }

    return internals$8.clone(source, options, seen);
};


internals$8.base = function (obj, baseProto, options) {

    if (options.prototype === false) {                  // Defaults to true
        if (internals$8.needsProtoHack.has(baseProto)) {
            return new baseProto.constructor();
        }

        return baseProto === types.array ? [] : {};
    }

    const proto = Object.getPrototypeOf(obj);
    if (proto &&
        proto.isImmutable) {

        return obj;
    }

    if (baseProto === types.array) {
        const newObj = [];
        if (proto !== baseProto) {
            Object.setPrototypeOf(newObj, proto);
        }

        return newObj;
    }

    if (internals$8.needsProtoHack.has(baseProto)) {
        const newObj = new proto.constructor();
        if (proto !== baseProto) {
            Object.setPrototypeOf(newObj, proto);
        }

        return newObj;
    }

    return Object.create(proto);
};

const internals$7 = {};


var merge$1 = internals$7.merge = function (target, source, options) {

    assert$1(target && typeof target === 'object', 'Invalid target value: must be an object');
    assert$1(source === null || source === undefined || typeof source === 'object', 'Invalid source value: must be null, undefined, or an object');

    if (!source) {
        return target;
    }

    options = Object.assign({ nullOverride: true, mergeArrays: true }, options);

    if (Array.isArray(source)) {
        assert$1(Array.isArray(target), 'Cannot merge array onto an object');
        if (!options.mergeArrays) {
            target.length = 0;                                                          // Must not change target assignment
        }

        for (let i = 0; i < source.length; ++i) {
            target.push(clone$1(source[i], { symbols: options.symbols }));
        }

        return target;
    }

    const keys = utils.keys(source, options);
    for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        if (key === '__proto__' ||
            !Object.prototype.propertyIsEnumerable.call(source, key)) {

            continue;
        }

        const value = source[key];
        if (value &&
            typeof value === 'object') {

            if (target[key] === value) {
                continue;                                           // Can occur for shallow merges
            }

            if (!target[key] ||
                typeof target[key] !== 'object' ||
                (Array.isArray(target[key]) !== Array.isArray(value)) ||
                value instanceof Date ||
                (Buffer && Buffer.isBuffer(value)) ||               // $lab:coverage:ignore$
                value instanceof RegExp) {

                target[key] = clone$1(value, { symbols: options.symbols });
            }
            else {
                internals$7.merge(target[key], value, options);
            }
        }
        else {
            if (value !== null &&
                value !== undefined) {                              // Explicit to preserve empty strings

                target[key] = value;
            }
            else if (options.nullOverride) {
                target[key] = value;
            }
        }
    }

    return target;
};

const internals$6 = {};


var applyToDefaults$1 = function (defaults, source, options = {}) {

    assert$1(defaults && typeof defaults === 'object', 'Invalid defaults value: must be an object');
    assert$1(!source || source === true || typeof source === 'object', 'Invalid source value: must be true, falsy or an object');
    assert$1(typeof options === 'object', 'Invalid options: must be an object');

    if (!source) {                                                  // If no source, return null
        return null;
    }

    if (options.shallow) {
        return internals$6.applyToDefaultsWithShallow(defaults, source, options);
    }

    const copy = clone$1(defaults);

    if (source === true) {                                          // If source is set to true, use defaults
        return copy;
    }

    const nullOverride = options.nullOverride !== undefined ? options.nullOverride : false;
    return merge$1(copy, source, { nullOverride, mergeArrays: false });
};


internals$6.applyToDefaultsWithShallow = function (defaults, source, options) {

    const keys = options.shallow;
    assert$1(Array.isArray(keys), 'Invalid keys');

    const seen = new Map();
    const merge = source === true ? null : new Set();

    for (let key of keys) {
        key = Array.isArray(key) ? key : key.split('.');            // Pre-split optimization

        const ref = reach$1(defaults, key);
        if (ref &&
            typeof ref === 'object') {

            seen.set(ref, merge && reach$1(source, key) || ref);
        }
        else if (merge) {
            merge.add(key);
        }
    }

    const copy = clone$1(defaults, {}, seen);

    if (!merge) {
        return copy;
    }

    for (const key of merge) {
        internals$6.reachCopy(copy, source, key);
    }

    const nullOverride = options.nullOverride !== undefined ? options.nullOverride : false;
    return merge$1(copy, source, { nullOverride, mergeArrays: false });
};


internals$6.reachCopy = function (dst, src, path) {

    for (const segment of path) {
        if (!(segment in src)) {
            return;
        }

        const val = src[segment];

        if (typeof val !== 'object' || val === null) {
            return;
        }

        src = val;
    }

    const value = src;
    let ref = dst;
    for (let i = 0; i < path.length - 1; ++i) {
        const segment = path[i];
        if (typeof ref[segment] !== 'object') {
            ref[segment] = {};
        }

        ref = ref[segment];
    }

    ref[path[path.length - 1]] = value;
};

const internals$5 = {};


var bench = internals$5.Bench = class {

    constructor() {

        this.ts = 0;
        this.reset();
    }

    reset() {

        this.ts = internals$5.Bench.now();
    }

    elapsed() {

        return internals$5.Bench.now() - this.ts;
    }

    static now() {

        const ts = process.hrtime();
        return (ts[0] * 1e3) + (ts[1] / 1e6);
    }
};

var ignore$1 = function () { };

var block$1 = function () {

    return new Promise(ignore$1);
};

const internals$4 = {
    mismatched: null
};


var deepEqual$1 = function (obj, ref, options) {

    options = Object.assign({ prototype: true }, options);

    return !!internals$4.isDeepEqual(obj, ref, options, []);
};


internals$4.isDeepEqual = function (obj, ref, options, seen) {

    if (obj === ref) {                                                      // Copied from Deep-eql, copyright(c) 2013 Jake Luer, jake@alogicalparadox.com, MIT Licensed, https://github.com/chaijs/deep-eql
        return obj !== 0 || 1 / obj === 1 / ref;
    }

    const type = typeof obj;

    if (type !== typeof ref) {
        return false;
    }

    if (obj === null ||
        ref === null) {

        return false;
    }

    if (type === 'function') {
        if (!options.deepFunction ||
            obj.toString() !== ref.toString()) {

            return false;
        }

        // Continue as object
    }
    else if (type !== 'object') {
        return obj !== obj && ref !== ref;                                  // NaN
    }

    const instanceType = internals$4.getSharedType(obj, ref, !!options.prototype);
    switch (instanceType) {
        case types.buffer:
            return Buffer && Buffer.prototype.equals.call(obj, ref);        // $lab:coverage:ignore$
        case types.promise:
            return obj === ref;
        case types.regex:
            return obj.toString() === ref.toString();
        case internals$4.mismatched:
            return false;
    }

    for (let i = seen.length - 1; i >= 0; --i) {
        if (seen[i].isSame(obj, ref)) {
            return true;                                                    // If previous comparison failed, it would have stopped execution
        }
    }

    seen.push(new internals$4.SeenEntry(obj, ref));

    try {
        return !!internals$4.isDeepEqualObj(instanceType, obj, ref, options, seen);
    }
    finally {
        seen.pop();
    }
};


internals$4.getSharedType = function (obj, ref, checkPrototype) {

    if (checkPrototype) {
        if (Object.getPrototypeOf(obj) !== Object.getPrototypeOf(ref)) {
            return internals$4.mismatched;
        }

        return types.getInternalProto(obj);
    }

    const type = types.getInternalProto(obj);
    if (type !== types.getInternalProto(ref)) {
        return internals$4.mismatched;
    }

    return type;
};


internals$4.valueOf = function (obj) {

    const objValueOf = obj.valueOf;
    if (objValueOf === undefined) {
        return obj;
    }

    try {
        return objValueOf.call(obj);
    }
    catch (err) {
        return err;
    }
};


internals$4.hasOwnEnumerableProperty = function (obj, key) {

    return Object.prototype.propertyIsEnumerable.call(obj, key);
};


internals$4.isSetSimpleEqual = function (obj, ref) {

    for (const entry of Set.prototype.values.call(obj)) {
        if (!Set.prototype.has.call(ref, entry)) {
            return false;
        }
    }

    return true;
};


internals$4.isDeepEqualObj = function (instanceType, obj, ref, options, seen) {

    const { isDeepEqual, valueOf, hasOwnEnumerableProperty } = internals$4;
    const { keys, getOwnPropertySymbols } = Object;

    if (instanceType === types.array) {
        if (options.part) {

            // Check if any index match any other index

            for (const objValue of obj) {
                for (const refValue of ref) {
                    if (isDeepEqual(objValue, refValue, options, seen)) {
                        return true;
                    }
                }
            }
        }
        else {
            if (obj.length !== ref.length) {
                return false;
            }

            for (let i = 0; i < obj.length; ++i) {
                if (!isDeepEqual(obj[i], ref[i], options, seen)) {
                    return false;
                }
            }

            return true;
        }
    }
    else if (instanceType === types.set) {
        if (obj.size !== ref.size) {
            return false;
        }

        if (!internals$4.isSetSimpleEqual(obj, ref)) {

            // Check for deep equality

            const ref2 = new Set(Set.prototype.values.call(ref));
            for (const objEntry of Set.prototype.values.call(obj)) {
                if (ref2.delete(objEntry)) {
                    continue;
                }

                let found = false;
                for (const refEntry of ref2) {
                    if (isDeepEqual(objEntry, refEntry, options, seen)) {
                        ref2.delete(refEntry);
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    return false;
                }
            }
        }
    }
    else if (instanceType === types.map) {
        if (obj.size !== ref.size) {
            return false;
        }

        for (const [key, value] of Map.prototype.entries.call(obj)) {
            if (value === undefined && !Map.prototype.has.call(ref, key)) {
                return false;
            }

            if (!isDeepEqual(value, Map.prototype.get.call(ref, key), options, seen)) {
                return false;
            }
        }
    }
    else if (instanceType === types.error) {

        // Always check name and message

        if (obj.name !== ref.name ||
            obj.message !== ref.message) {

            return false;
        }
    }

    // Check .valueOf()

    const valueOfObj = valueOf(obj);
    const valueOfRef = valueOf(ref);
    if ((obj !== valueOfObj || ref !== valueOfRef) &&
        !isDeepEqual(valueOfObj, valueOfRef, options, seen)) {

        return false;
    }

    // Check properties

    const objKeys = keys(obj);
    if (!options.part &&
        objKeys.length !== keys(ref).length &&
        !options.skip) {

        return false;
    }

    let skipped = 0;
    for (const key of objKeys) {
        if (options.skip &&
            options.skip.includes(key)) {

            if (ref[key] === undefined) {
                ++skipped;
            }

            continue;
        }

        if (!hasOwnEnumerableProperty(ref, key)) {
            return false;
        }

        if (!isDeepEqual(obj[key], ref[key], options, seen)) {
            return false;
        }
    }

    if (!options.part &&
        objKeys.length - skipped !== keys(ref).length) {

        return false;
    }

    // Check symbols

    if (options.symbols !== false) {                                // Defaults to true
        const objSymbols = getOwnPropertySymbols(obj);
        const refSymbols = new Set(getOwnPropertySymbols(ref));

        for (const key of objSymbols) {
            if (!options.skip ||
                !options.skip.includes(key)) {

                if (hasOwnEnumerableProperty(obj, key)) {
                    if (!hasOwnEnumerableProperty(ref, key)) {
                        return false;
                    }

                    if (!isDeepEqual(obj[key], ref[key], options, seen)) {
                        return false;
                    }
                }
                else if (hasOwnEnumerableProperty(ref, key)) {
                    return false;
                }
            }

            refSymbols.delete(key);
        }

        for (const key of refSymbols) {
            if (hasOwnEnumerableProperty(ref, key)) {
                return false;
            }
        }
    }

    return true;
};


internals$4.SeenEntry = class {

    constructor(obj, ref) {

        this.obj = obj;
        this.ref = ref;
    }

    isSame(obj, ref) {

        return this.obj === obj && this.ref === ref;
    }
};

var escapeRegex$1 = function (string) {

    // Escape ^$.*+-?=!:|\/()[]{},

    return string.replace(/[\^\$\.\*\+\-\?\=\!\:\|\\\/\(\)\[\]\{\}\,]/g, '\\$&');
};

const internals$3 = {};


var contain$1 = function (ref, values, options = {}) {        // options: { deep, once, only, part, symbols }

    /*
        string -> string(s)
        array -> item(s)
        object -> key(s)
        object -> object (key:value)
    */

    if (typeof values !== 'object') {
        values = [values];
    }

    assert$1(!Array.isArray(values) || values.length, 'Values array cannot be empty');

    // String

    if (typeof ref === 'string') {
        return internals$3.string(ref, values, options);
    }

    // Array

    if (Array.isArray(ref)) {
        return internals$3.array(ref, values, options);
    }

    // Object

    assert$1(typeof ref === 'object', 'Reference must be string or an object');
    return internals$3.object(ref, values, options);
};


internals$3.array = function (ref, values, options) {

    if (!Array.isArray(values)) {
        values = [values];
    }

    if (!ref.length) {
        return false;
    }

    if (options.only &&
        options.once &&
        ref.length !== values.length) {

        return false;
    }

    let compare;

    // Map values

    const map = new Map();
    for (const value of values) {
        if (!options.deep ||
            !value ||
            typeof value !== 'object') {

            const existing = map.get(value);
            if (existing) {
                ++existing.allowed;
            }
            else {
                map.set(value, { allowed: 1, hits: 0 });
            }
        }
        else {
            compare = compare || internals$3.compare(options);

            let found = false;
            for (const [key, existing] of map.entries()) {
                if (compare(key, value)) {
                    ++existing.allowed;
                    found = true;
                    break;
                }
            }

            if (!found) {
                map.set(value, { allowed: 1, hits: 0 });
            }
        }
    }

    // Lookup values

    let hits = 0;
    for (const item of ref) {
        let match;
        if (!options.deep ||
            !item ||
            typeof item !== 'object') {

            match = map.get(item);
        }
        else {
            compare = compare || internals$3.compare(options);

            for (const [key, existing] of map.entries()) {
                if (compare(key, item)) {
                    match = existing;
                    break;
                }
            }
        }

        if (match) {
            ++match.hits;
            ++hits;

            if (options.once &&
                match.hits > match.allowed) {

                return false;
            }
        }
    }

    // Validate results

    if (options.only &&
        hits !== ref.length) {

        return false;
    }

    for (const match of map.values()) {
        if (match.hits === match.allowed) {
            continue;
        }

        if (match.hits < match.allowed &&
            !options.part) {

            return false;
        }
    }

    return !!hits;
};


internals$3.object = function (ref, values, options) {

    assert$1(options.once === undefined, 'Cannot use option once with object');

    const keys = utils.keys(ref, options);
    if (!keys.length) {
        return false;
    }

    // Keys list

    if (Array.isArray(values)) {
        return internals$3.array(keys, values, options);
    }

    // Key value pairs

    const symbols = Object.getOwnPropertySymbols(values).filter((sym) => values.propertyIsEnumerable(sym));
    const targets = [...Object.keys(values), ...symbols];

    const compare = internals$3.compare(options);
    const set = new Set(targets);

    for (const key of keys) {
        if (!set.has(key)) {
            if (options.only) {
                return false;
            }

            continue;
        }

        if (!compare(values[key], ref[key])) {
            return false;
        }

        set.delete(key);
    }

    if (set.size) {
        return options.part ? set.size < targets.length : false;
    }

    return true;
};


internals$3.string = function (ref, values, options) {

    // Empty string

    if (ref === '') {
        return values.length === 1 && values[0] === '' ||               // '' contains ''
            !options.once && !values.some((v) => v !== '');             // '' contains multiple '' if !once
    }

    // Map values

    const map = new Map();
    const patterns = [];

    for (const value of values) {
        assert$1(typeof value === 'string', 'Cannot compare string reference to non-string value');

        if (value) {
            const existing = map.get(value);
            if (existing) {
                ++existing.allowed;
            }
            else {
                map.set(value, { allowed: 1, hits: 0 });
                patterns.push(escapeRegex$1(value));
            }
        }
        else if (options.once ||
            options.only) {

            return false;
        }
    }

    if (!patterns.length) {                     // Non-empty string contains unlimited empty string
        return true;
    }

    // Match patterns

    const regex = new RegExp(`(${patterns.join('|')})`, 'g');
    const leftovers = ref.replace(regex, ($0, $1) => {

        ++map.get($1).hits;
        return '';                              // Remove from string
    });

    // Validate results

    if (options.only &&
        leftovers) {

        return false;
    }

    let any = false;
    for (const match of map.values()) {
        if (match.hits) {
            any = true;
        }

        if (match.hits === match.allowed) {
            continue;
        }

        if (match.hits < match.allowed &&
            !options.part) {

            return false;
        }

        // match.hits > match.allowed

        if (options.once) {
            return false;
        }
    }

    return !!any;
};


internals$3.compare = function (options) {

    if (!options.deep) {
        return internals$3.shallow;
    }

    const hasOnly = options.only !== undefined;
    const hasPart = options.part !== undefined;

    const flags = {
        prototype: hasOnly ? options.only : hasPart ? !options.part : false,
        part: hasOnly ? !options.only : hasPart ? options.part : false
    };

    return (a, b) => deepEqual$1(a, b, flags);
};


internals$3.shallow = function (a, b) {

    return a === b;
};

var escapeHeaderAttribute$1 = function (attribute) {

    // Allowed value characters: !#$%&'()*+,-./:;<=>?@[]^_`{|}~ and space, a-z, A-Z, 0-9, \, "

    assert$1(/^[ \w\!#\$%&'\(\)\*\+,\-\.\/\:;<\=>\?@\[\]\^`\{\|\}~\"\\]*$/.test(attribute), 'Bad attribute value (' + attribute + ')');

    return attribute.replace(/\\/g, '\\\\').replace(/\"/g, '\\"');                             // Escape quotes and slash
};

const internals$2 = {};


var escapeHtml$1 = function (input) {

    if (!input) {
        return '';
    }

    let escaped = '';

    for (let i = 0; i < input.length; ++i) {

        const charCode = input.charCodeAt(i);

        if (internals$2.isSafe(charCode)) {
            escaped += input[i];
        }
        else {
            escaped += internals$2.escapeHtmlChar(charCode);
        }
    }

    return escaped;
};


internals$2.escapeHtmlChar = function (charCode) {

    const namedEscape = internals$2.namedHtml[charCode];
    if (typeof namedEscape !== 'undefined') {
        return namedEscape;
    }

    if (charCode >= 256) {
        return '&#' + charCode + ';';
    }

    const hexValue = charCode.toString(16).padStart(2, '0');
    return `&#x${hexValue};`;
};


internals$2.isSafe = function (charCode) {

    return (typeof internals$2.safeCharCodes[charCode] !== 'undefined');
};


internals$2.namedHtml = {
    '38': '&amp;',
    '60': '&lt;',
    '62': '&gt;',
    '34': '&quot;',
    '160': '&nbsp;',
    '162': '&cent;',
    '163': '&pound;',
    '164': '&curren;',
    '169': '&copy;',
    '174': '&reg;'
};


internals$2.safeCharCodes = (function () {

    const safe = {};

    for (let i = 32; i < 123; ++i) {

        if ((i >= 97) ||                    // a-z
            (i >= 65 && i <= 90) ||         // A-Z
            (i >= 48 && i <= 57) ||         // 0-9
            i === 32 ||                     // space
            i === 46 ||                     // .
            i === 44 ||                     // ,
            i === 45 ||                     // -
            i === 58 ||                     // :
            i === 95) {                     // _

            safe[i] = null;
        }
    }

    return safe;
}());

var escapeJson$1 = function (input) {

    if (!input) {
        return '';
    }

    const lessThan = 0x3C;
    const greaterThan = 0x3E;
    const andSymbol = 0x26;
    const lineSeperator = 0x2028;

    // replace method
    let charCode;
    return input.replace(/[<>&\u2028\u2029]/g, (match) => {

        charCode = match.charCodeAt(0);

        if (charCode === lessThan) {
            return '\\u003c';
        }

        if (charCode === greaterThan) {
            return '\\u003e';
        }

        if (charCode === andSymbol) {
            return '\\u0026';
        }

        if (charCode === lineSeperator) {
            return '\\u2028';
        }

        return '\\u2029';
    });
};

const internals$1 = {};


var flatten$1 = internals$1.flatten = function (array, target) {

    const result = target || [];

    for (let i = 0; i < array.length; ++i) {
        if (Array.isArray(array[i])) {
            internals$1.flatten(array[i], result);
        }
        else {
            result.push(array[i]);
        }
    }

    return result;
};

const internals = {};


var intersect$1 = function (array1, array2, options = {}) {

    if (!array1 ||
        !array2) {

        return (options.first ? null : []);
    }

    const common = [];
    const hash = (Array.isArray(array1) ? new Set(array1) : array1);
    const found = new Set();
    for (const value of array2) {
        if (internals.has(hash, value) &&
            !found.has(value)) {

            if (options.first) {
                return value;
            }

            common.push(value);
            found.add(value);
        }
    }

    return (options.first ? null : common);
};


internals.has = function (ref, key) {

    if (typeof ref.has === 'function') {
        return ref.has(key);
    }

    return ref[key] !== undefined;
};

var isPromise$1 = function (promise) {

    return !!promise && typeof promise.then === 'function';
};

var once$1 = function (method) {

    if (method._hoekOnce) {
        return method;
    }

    let once = false;
    const wrapped = function (...args) {

        if (!once) {
            once = true;
            method(...args);
        }
    };

    wrapped._hoekOnce = true;
    return wrapped;
};

var reachTemplate$1 = function (obj, template, options) {

    return template.replace(/{([^{}]+)}/g, ($0, chain) => {

        const value = reach$1(obj, chain, options);
        return (value === undefined || value === null ? '' : value);
    });
};

var wait$1 = function (timeout, returnValue) {

    if (typeof timeout !== 'number' && timeout !== undefined) {
        throw new TypeError('Timeout must be a number');
    }

    return new Promise((resolve) => setTimeout(resolve, timeout, returnValue));
};

var applyToDefaults = applyToDefaults$1;

var assert = assert$1;

var Bench = bench;

var block = block$1;

var clone = clone$1;

var contain = contain$1;

var deepEqual = deepEqual$1;

var _Error = error;

var escapeHeaderAttribute = escapeHeaderAttribute$1;

var escapeHtml = escapeHtml$1;

var escapeJson = escapeJson$1;

var escapeRegex = escapeRegex$1;

var flatten = flatten$1;

var ignore = ignore$1;

var intersect = intersect$1;

var isPromise = isPromise$1;

var merge = merge$1;

var once = once$1;

var reach = reach$1;

var reachTemplate = reachTemplate$1;

var stringify = stringify$1;

var wait = wait$1;

var lib$2 = {
	applyToDefaults: applyToDefaults,
	assert: assert,
	Bench: Bench,
	block: block,
	clone: clone,
	contain: contain,
	deepEqual: deepEqual,
	Error: _Error,
	escapeHeaderAttribute: escapeHeaderAttribute,
	escapeHtml: escapeHtml,
	escapeJson: escapeJson,
	escapeRegex: escapeRegex,
	flatten: flatten,
	ignore: ignore,
	intersect: intersect,
	isPromise: isPromise,
	merge: merge,
	once: once,
	reach: reach,
	reachTemplate: reachTemplate,
	stringify: stringify,
	wait: wait
};

var lib$1 = defaultHandler.createCommonjsModule(function (module, exports) {




const internals = {
    codes: new Map([
        [100, 'Continue'],
        [101, 'Switching Protocols'],
        [102, 'Processing'],
        [200, 'OK'],
        [201, 'Created'],
        [202, 'Accepted'],
        [203, 'Non-Authoritative Information'],
        [204, 'No Content'],
        [205, 'Reset Content'],
        [206, 'Partial Content'],
        [207, 'Multi-Status'],
        [300, 'Multiple Choices'],
        [301, 'Moved Permanently'],
        [302, 'Moved Temporarily'],
        [303, 'See Other'],
        [304, 'Not Modified'],
        [305, 'Use Proxy'],
        [307, 'Temporary Redirect'],
        [400, 'Bad Request'],
        [401, 'Unauthorized'],
        [402, 'Payment Required'],
        [403, 'Forbidden'],
        [404, 'Not Found'],
        [405, 'Method Not Allowed'],
        [406, 'Not Acceptable'],
        [407, 'Proxy Authentication Required'],
        [408, 'Request Time-out'],
        [409, 'Conflict'],
        [410, 'Gone'],
        [411, 'Length Required'],
        [412, 'Precondition Failed'],
        [413, 'Request Entity Too Large'],
        [414, 'Request-URI Too Large'],
        [415, 'Unsupported Media Type'],
        [416, 'Requested Range Not Satisfiable'],
        [417, 'Expectation Failed'],
        [418, 'I\'m a teapot'],
        [422, 'Unprocessable Entity'],
        [423, 'Locked'],
        [424, 'Failed Dependency'],
        [425, 'Too Early'],
        [426, 'Upgrade Required'],
        [428, 'Precondition Required'],
        [429, 'Too Many Requests'],
        [431, 'Request Header Fields Too Large'],
        [451, 'Unavailable For Legal Reasons'],
        [500, 'Internal Server Error'],
        [501, 'Not Implemented'],
        [502, 'Bad Gateway'],
        [503, 'Service Unavailable'],
        [504, 'Gateway Time-out'],
        [505, 'HTTP Version Not Supported'],
        [506, 'Variant Also Negotiates'],
        [507, 'Insufficient Storage'],
        [509, 'Bandwidth Limit Exceeded'],
        [510, 'Not Extended'],
        [511, 'Network Authentication Required']
    ])
};


exports.Boom = class extends Error {

    constructor(message, options = {}) {

        if (message instanceof Error) {
            return exports.boomify(lib$2.clone(message), options);
        }

        const { statusCode = 500, data = null, ctor = exports.Boom } = options;
        const error = new Error(message ? message : undefined);         // Avoids settings null message
        Error.captureStackTrace(error, ctor);                           // Filter the stack to our external API
        error.data = data;
        const boom = internals.initialize(error, statusCode);

        Object.defineProperty(boom, 'typeof', { value: ctor });

        if (options.decorate) {
            Object.assign(boom, options.decorate);
        }

        return boom;
    }

    static [Symbol.hasInstance](instance) {

        if (this === exports.Boom) {
            return exports.isBoom(instance);
        }

        // Cannot use 'instanceof' as it creates infinite recursion

        return this.prototype.isPrototypeOf(instance);
    }
};


exports.isBoom = function (err, statusCode) {

    return err instanceof Error && !!err.isBoom && (!statusCode || err.output.statusCode === statusCode);
};


exports.boomify = function (err, options) {

    lib$2.assert(err instanceof Error, 'Cannot wrap non-Error object');

    options = options || {};

    if (options.data !== undefined) {
        err.data = options.data;
    }

    if (options.decorate) {
        Object.assign(err, options.decorate);
    }

    if (!err.isBoom) {
        return internals.initialize(err, options.statusCode || 500, options.message);
    }

    if (options.override === false ||                           // Defaults to true
        !options.statusCode && !options.message) {

        return err;
    }

    return internals.initialize(err, options.statusCode || err.output.statusCode, options.message);
};


// 4xx Client Errors

exports.badRequest = function (message, data) {

    return new exports.Boom(message, { statusCode: 400, data, ctor: exports.badRequest });
};


exports.unauthorized = function (message, scheme, attributes) {          // Or (message, wwwAuthenticate[])

    const err = new exports.Boom(message, { statusCode: 401, ctor: exports.unauthorized });

    // function (message)

    if (!scheme) {
        return err;
    }

    // function (message, wwwAuthenticate[])

    if (typeof scheme !== 'string') {
        err.output.headers['WWW-Authenticate'] = scheme.join(', ');
        return err;
    }

    // function (message, scheme, attributes)

    let wwwAuthenticate = `${scheme}`;

    if (attributes ||
        message) {

        err.output.payload.attributes = {};
    }

    if (attributes) {
        if (typeof attributes === 'string') {
            wwwAuthenticate += ' ' + lib$2.escapeHeaderAttribute(attributes);
            err.output.payload.attributes = attributes;
        }
        else {
            wwwAuthenticate += ' ' + Object.keys(attributes).map((name) => {

                let value = attributes[name];
                if (value === null ||
                    value === undefined) {

                    value = '';
                }

                err.output.payload.attributes[name] = value;
                return `${name}="${lib$2.escapeHeaderAttribute(value.toString())}"`;
            })
                .join(', ');
        }
    }

    if (message) {
        if (attributes) {
            wwwAuthenticate += ',';
        }

        wwwAuthenticate += ` error="${lib$2.escapeHeaderAttribute(message)}"`;
        err.output.payload.attributes.error = message;
    }
    else {
        err.isMissing = true;
    }

    err.output.headers['WWW-Authenticate'] = wwwAuthenticate;
    return err;
};


exports.paymentRequired = function (message, data) {

    return new exports.Boom(message, { statusCode: 402, data, ctor: exports.paymentRequired });
};


exports.forbidden = function (message, data) {

    return new exports.Boom(message, { statusCode: 403, data, ctor: exports.forbidden });
};


exports.notFound = function (message, data) {

    return new exports.Boom(message, { statusCode: 404, data, ctor: exports.notFound });
};


exports.methodNotAllowed = function (message, data, allow) {

    const err = new exports.Boom(message, { statusCode: 405, data, ctor: exports.methodNotAllowed });

    if (typeof allow === 'string') {
        allow = [allow];
    }

    if (Array.isArray(allow)) {
        err.output.headers.Allow = allow.join(', ');
    }

    return err;
};


exports.notAcceptable = function (message, data) {

    return new exports.Boom(message, { statusCode: 406, data, ctor: exports.notAcceptable });
};


exports.proxyAuthRequired = function (message, data) {

    return new exports.Boom(message, { statusCode: 407, data, ctor: exports.proxyAuthRequired });
};


exports.clientTimeout = function (message, data) {

    return new exports.Boom(message, { statusCode: 408, data, ctor: exports.clientTimeout });
};


exports.conflict = function (message, data) {

    return new exports.Boom(message, { statusCode: 409, data, ctor: exports.conflict });
};


exports.resourceGone = function (message, data) {

    return new exports.Boom(message, { statusCode: 410, data, ctor: exports.resourceGone });
};


exports.lengthRequired = function (message, data) {

    return new exports.Boom(message, { statusCode: 411, data, ctor: exports.lengthRequired });
};


exports.preconditionFailed = function (message, data) {

    return new exports.Boom(message, { statusCode: 412, data, ctor: exports.preconditionFailed });
};


exports.entityTooLarge = function (message, data) {

    return new exports.Boom(message, { statusCode: 413, data, ctor: exports.entityTooLarge });
};


exports.uriTooLong = function (message, data) {

    return new exports.Boom(message, { statusCode: 414, data, ctor: exports.uriTooLong });
};


exports.unsupportedMediaType = function (message, data) {

    return new exports.Boom(message, { statusCode: 415, data, ctor: exports.unsupportedMediaType });
};


exports.rangeNotSatisfiable = function (message, data) {

    return new exports.Boom(message, { statusCode: 416, data, ctor: exports.rangeNotSatisfiable });
};


exports.expectationFailed = function (message, data) {

    return new exports.Boom(message, { statusCode: 417, data, ctor: exports.expectationFailed });
};


exports.teapot = function (message, data) {

    return new exports.Boom(message, { statusCode: 418, data, ctor: exports.teapot });
};


exports.badData = function (message, data) {

    return new exports.Boom(message, { statusCode: 422, data, ctor: exports.badData });
};


exports.locked = function (message, data) {

    return new exports.Boom(message, { statusCode: 423, data, ctor: exports.locked });
};


exports.failedDependency = function (message, data) {

    return new exports.Boom(message, { statusCode: 424, data, ctor: exports.failedDependency });
};

exports.tooEarly = function (message, data) {

    return new exports.Boom(message, { statusCode: 425, data, ctor: exports.tooEarly });
};


exports.preconditionRequired = function (message, data) {

    return new exports.Boom(message, { statusCode: 428, data, ctor: exports.preconditionRequired });
};


exports.tooManyRequests = function (message, data) {

    return new exports.Boom(message, { statusCode: 429, data, ctor: exports.tooManyRequests });
};


exports.illegal = function (message, data) {

    return new exports.Boom(message, { statusCode: 451, data, ctor: exports.illegal });
};


// 5xx Server Errors

exports.internal = function (message, data, statusCode = 500) {

    return internals.serverError(message, data, statusCode, exports.internal);
};


exports.notImplemented = function (message, data) {

    return internals.serverError(message, data, 501, exports.notImplemented);
};


exports.badGateway = function (message, data) {

    return internals.serverError(message, data, 502, exports.badGateway);
};


exports.serverUnavailable = function (message, data) {

    return internals.serverError(message, data, 503, exports.serverUnavailable);
};


exports.gatewayTimeout = function (message, data) {

    return internals.serverError(message, data, 504, exports.gatewayTimeout);
};


exports.badImplementation = function (message, data) {

    const err = internals.serverError(message, data, 500, exports.badImplementation);
    err.isDeveloperError = true;
    return err;
};


internals.initialize = function (err, statusCode, message) {

    const numberCode = parseInt(statusCode, 10);
    lib$2.assert(!isNaN(numberCode) && numberCode >= 400, 'First argument must be a number (400+):', statusCode);

    err.isBoom = true;
    err.isServer = numberCode >= 500;

    if (!err.hasOwnProperty('data')) {
        err.data = null;
    }

    err.output = {
        statusCode: numberCode,
        payload: {},
        headers: {}
    };

    Object.defineProperty(err, 'reformat', { value: internals.reformat, configurable: true });

    if (!message &&
        !err.message) {

        err.reformat();
        message = err.output.payload.error;
    }

    if (message) {
        const props = Object.getOwnPropertyDescriptor(err, 'message') || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(err), 'message');
        lib$2.assert(!props || props.configurable && !props.get, 'The error is not compatible with boom');

        err.message = message + (err.message ? ': ' + err.message : '');
        err.output.payload.message = err.message;
    }

    err.reformat();
    return err;
};


internals.reformat = function (debug = false) {

    this.output.payload.statusCode = this.output.statusCode;
    this.output.payload.error = internals.codes.get(this.output.statusCode) || 'Unknown';

    if (this.output.statusCode === 500 && debug !== true) {
        this.output.payload.message = 'An internal server error occurred';              // Hide actual error from user
    }
    else if (this.message) {
        this.output.payload.message = this.message;
    }
};


internals.serverError = function (message, data, statusCode, ctor) {

    if (data instanceof Error &&
        !data.isBoom) {

        return exports.boomify(data, { statusCode, message });
    }

    return new exports.Boom(message, { statusCode, data, ctor });
};
});

var header = defaultHandler.createCommonjsModule(function (module, exports) {





const internals = {};


exports.selection = function (header, preferences, options) {

    const selections = exports.selections(header, preferences, options);
    return selections.length ? selections[0] : '';
};


exports.selections = function (header, preferences, options) {

    lib$2.assert(!preferences || Array.isArray(preferences), 'Preferences must be an array');

    return internals.parse(header || '', preferences, options);
};


//      RFC 7231 Section 5.3.3 (https://tools.ietf.org/html/rfc7231#section-5.3.3)
//
//      Accept-Charset  = *( "," OWS ) ( ( charset / "*" ) [ weight ] ) *( OWS "," [ OWS ( ( charset / "*" ) [ weight ] ) ] )
//      charset         = token
//
//      Accept-Charset: iso-8859-5, unicode-1-1;q=0.8


//      RFC 7231 Section 5.3.4 (https://tools.ietf.org/html/rfc7231#section-5.3.4)
//
//      Accept-Encoding = [ ( "," / ( codings [ weight ] ) ) *( OWS "," [ OWS ( codings [ weight ] ) ] ) ]
//      codings         = content-coding / "identity" / "*"
//      content-coding  = token
//
//      Accept-Encoding: compress, gzip
//      Accept-Encoding:
//      Accept-Encoding: *
//      Accept-Encoding: compress;q=0.5, gzip;q=1.0
//      Accept-Encoding: gzip;q=1.0, identity; q=0.5, *;q=0


//      RFC 7231 Section 5.3.5 (https://tools.ietf.org/html/rfc7231#section-5.3.5)
//
//      Accept-Language = *( "," OWS ) ( language-range [ weight ] ) *( OWS "," [ OWS ( language-range [ weight ] ) ] )
//      language-range  = ( 1*8ALPHA *( "-" 1*8alphanum ) ) / "*"   ; [RFC4647], Section 2.1
//      alphanum        = ALPHA / DIGIT
//
//       Accept-Language: da, en-gb;q=0.8, en;q=0.7


//      token           = 1*tchar
//      tchar           = "!" / "#" / "$" / "%" / "&" / "'" / "*"
//                        / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
//                        / DIGIT / ALPHA
//                        ; any VCHAR, except delimiters
//      OWS             = *( SP / HTAB )


//      RFC 7231 Section 5.3.1 (https://tools.ietf.org/html/rfc7231#section-5.3.1)
//
//      The weight is normalized to a real number in the range 0 through 1,
//      where 0.001 is the least preferred and 1 is the most preferred; a
//      value of 0 means "not acceptable".  If no "q" parameter is present,
//      the default weight is 1.
//
//       weight = OWS ";" OWS "q=" qvalue
//       qvalue = ( "0" [ "." 0*3DIGIT ] ) / ( "1" [ "." 0*3("0") ] )


internals.parse = function (raw, preferences, options) {

    // Normalize header (remove spaces and tabs)

    const header = raw.replace(/[ \t]/g, '');

    // Normalize preferences

    const lowers = new Map();
    if (preferences) {
        let pos = 0;
        for (const preference of preferences) {
            const lower = preference.toLowerCase();
            lowers.set(lower, { orig: preference, pos: pos++ });

            if (options.prefixMatch) {
                const parts = lower.split('-');
                while (parts.pop(), parts.length > 0) {
                    const joined = parts.join('-');
                    if (!lowers.has(joined)) {
                        lowers.set(joined, { orig: preference, pos: pos++ });
                    }
                }
            }
        }
    }

    // Parse selections

    const parts = header.split(',');
    const selections = [];
    const map = new Set();

    for (let i = 0; i < parts.length; ++i) {
        const part = parts[i];
        if (!part) {                            // Ignore empty parts or leading commas
            continue;
        }

        // Parse parameters

        const params = part.split(';');
        if (params.length > 2) {
            throw lib$1.badRequest(`Invalid ${options.type} header`);
        }

        let token = params[0].toLowerCase();
        if (!token) {
            throw lib$1.badRequest(`Invalid ${options.type} header`);
        }

        if (options.equivalents &&
            options.equivalents.has(token)) {

            token = options.equivalents.get(token);
        }

        const selection = {
            token,
            pos: i,
            q: 1
        };

        if (preferences &&
            lowers.has(token)) {

            selection.pref = lowers.get(token).pos;
        }

        map.add(selection.token);

        // Parse q=value

        if (params.length === 2) {
            const q = params[1];
            const [key, value] = q.split('=');

            if (!value ||
                key !== 'q' && key !== 'Q') {

                throw lib$1.badRequest(`Invalid ${options.type} header`);
            }

            const score = parseFloat(value);
            if (score === 0) {
                continue;
            }

            if (Number.isFinite(score) &&
                score <= 1 &&
                score >= 0.001) {

                selection.q = score;
            }
        }

        selections.push(selection);             // Only add allowed selections (q !== 0)
    }

    // Sort selection based on q and then position in header

    selections.sort(internals.sort);

    // Extract tokens

    const values = selections.map((selection) => selection.token);

    if (options.default &&
        !map.has(options.default)) {

        values.push(options.default);
    }

    if (!preferences ||
        !preferences.length) {

        return values;
    }

    const preferred = [];
    for (const selection of values) {
        if (selection === '*') {
            for (const [preference, value] of lowers) {
                if (!map.has(preference)) {
                    preferred.push(value.orig);
                }
            }
        }
        else {
            const lower = selection.toLowerCase();
            if (lowers.has(lower)) {
                preferred.push(lowers.get(lower).orig);
            }
        }
    }

    return preferred;
};


internals.sort = function (a, b) {

    const aFirst = -1;
    const bFirst = 1;

    if (b.q !== a.q) {
        return b.q - a.q;
    }

    if (b.pref !== a.pref) {
        if (a.pref === undefined) {
            return bFirst;
        }

        if (b.pref === undefined) {
            return aFirst;
        }

        return a.pref - b.pref;
    }

    return a.pos - b.pos;
};
});

var media = defaultHandler.createCommonjsModule(function (module, exports) {





const internals = {};


exports.selection = function (header, preferences) {

    const selections = exports.selections(header, preferences);
    return selections.length ? selections[0] : '';
};


exports.selections = function (header, preferences) {

    lib$2.assert(!preferences || Array.isArray(preferences), 'Preferences must be an array');

    return internals.parse(header, preferences);
};


//      RFC 7231 Section 5.3.2 (https://tools.ietf.org/html/rfc7231#section-5.3.2)
//
//      Accept          = [ ( "," / ( media-range [ accept-params ] ) ) *( OWS "," [ OWS ( media-range [ accept-params ] ) ] ) ]
//      media-range     = ( "*/*" / ( type "/*" ) / ( type "/" subtype ) ) *( OWS ";" OWS parameter )
//      accept-params   = weight *accept-ext
//      accept-ext      = OWS ";" OWS token [ "=" ( token / quoted-string ) ]
//      type            = token
//      subtype         = token
//      parameter       = token "=" ( token / quoted-string )
//
//      quoted-string   = DQUOTE *( qdtext / quoted-pair ) DQUOTE
//      qdtext          = HTAB / SP /%x21 / %x23-5B / %x5D-7E / obs-text
//      obs-text        = %x80-FF
//      quoted-pair     = "\" ( HTAB / SP / VCHAR / obs-text )
//      VCHAR           = %x21-7E                                ; visible (printing) characters
//      token           = 1*tchar
//      tchar           = "!" / "#" / "$" / "%" / "&" / "'" / "*" / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~" / DIGIT / ALPHA
//      OWS             = *( SP / HTAB )
//
//      Accept: audio/*; q=0.2, audio/basic
//      Accept: text/plain; q=0.5, text/html, text/x-dvi; q=0.8, text/x-c
//      Accept: text/plain, application/json;q=0.5, text/html, */*; q = 0.1
//      Accept: text/plain, application/json;q=0.5, text/html, text/drop;q=0
//      Accept: text/*, text/plain, text/plain;format=flowed, */*
//      Accept: text/*;q=0.3, text/html;q=0.7, text/html;level=1, text/html;level=2;q=0.4, */*;q=0.5


//      RFC 7231 Section 5.3.1 (https://tools.ietf.org/html/rfc7231#section-5.3.1)
//
//      The weight is normalized to a real number in the range 0 through 1,
//      where 0.001 is the least preferred and 1 is the most preferred; a
//      value of 0 means "not acceptable".  If no "q" parameter is present,
//      the default weight is 1.
//
//       weight = OWS ";" OWS "q=" qvalue
//       qvalue = ( "0" [ "." 0*3DIGIT ] ) / ( "1" [ "." 0*3("0") ] )


//                         */*        type/*                              type/subtype
internals.validMediaRx = /^(?:\*\/\*)|(?:[\w\!#\$%&'\*\+\-\.\^`\|~]+\/\*)|(?:[\w\!#\$%&'\*\+\-\.\^`\|~]+\/[\w\!#\$%&'\*\+\-\.\^`\|~]+)$/;


internals.parse = function (raw, preferences) {

    // Normalize header (remove spaces and temporary remove quoted strings)

    const { header, quoted } = internals.normalize(raw);

    // Parse selections

    const parts = header.split(',');
    const selections = [];
    const map = {};

    for (let i = 0; i < parts.length; ++i) {
        const part = parts[i];
        if (!part) {                                    // Ignore empty parts or leading commas
            continue;
        }

        // Parse parameters

        const pairs = part.split(';');
        const token = pairs.shift().toLowerCase();

        if (!internals.validMediaRx.test(token)) {       // Ignore invalid types
            continue;
        }

        const selection = {
            token,
            params: {},
            exts: {},
            pos: i
        };

        // Parse key=value

        let target = 'params';
        for (const pair of pairs) {
            const kv = pair.split('=');
            if (kv.length !== 2 ||
                !kv[1]) {

                throw lib$1.badRequest(`Invalid accept header`);
            }

            const key = kv[0];
            let value = kv[1];

            if (key === 'q' ||
                key === 'Q') {

                target = 'exts';

                value = parseFloat(value);
                if (!Number.isFinite(value) ||
                    value > 1 ||
                    (value < 0.001 && value !== 0)) {

                    value = 1;
                }

                selection.q = value;
            }
            else {
                if (value[0] === '"') {
                    value = `"${quoted[value]}"`;
                }

                selection[target][kv[0]] = value;
            }
        }

        const params = Object.keys(selection.params);
        selection.original = [''].concat(params.map((key) => `${key}=${selection.params[key]}`)).join(';');
        selection.specificity = params.length;

        if (selection.q === undefined) {     // Default no preference to q=1 (top preference)
            selection.q = 1;
        }

        const tparts = selection.token.split('/');
        selection.type = tparts[0];
        selection.subtype = tparts[1];

        map[selection.token] = selection;

        if (selection.q) {                   // Skip denied selections (q=0)
            selections.push(selection);
        }
    }

    // Sort selection based on q and then position in header

    selections.sort(internals.sort);

    return internals.preferences(map, selections, preferences);
};


internals.normalize = function (raw) {

    raw = raw || '*/*';

    const normalized = {
        header: raw,
        quoted: {}
    };

    if (raw.includes('"')) {
        let i = 0;
        normalized.header = raw.replace(/="([^"]*)"/g, ($0, $1) => {

            const key = '"' + ++i;
            normalized.quoted[key] = $1;
            return '=' + key;
        });
    }

    normalized.header = normalized.header.replace(/[ \t]/g, '');
    return normalized;
};


internals.sort = function (a, b) {

    // Sort by quality score

    if (b.q !== a.q) {
        return b.q - a.q;
    }

    // Sort by type

    if (a.type !== b.type) {
        return internals.innerSort(a, b, 'type');
    }

    // Sort by subtype

    if (a.subtype !== b.subtype) {
        return internals.innerSort(a, b, 'subtype');
    }

    // Sort by specificity

    if (a.specificity !== b.specificity) {
        return b.specificity - a.specificity;
    }

    return a.pos - b.pos;
};


internals.innerSort = function (a, b, key) {

    const aFirst = -1;
    const bFirst = 1;

    if (a[key] === '*') {
        return bFirst;
    }

    if (b[key] === '*') {
        return aFirst;
    }

    return a[key] < b[key] ? aFirst : bFirst;       // Group alphabetically
};


internals.preferences = function (map, selections, preferences) {

    // Return selections if no preferences

    if (!preferences ||
        !preferences.length) {

        return selections.map((selection) => selection.token + selection.original);
    }

    // Map wildcards and filter selections to preferences

    const lowers = Object.create(null);
    const flat = Object.create(null);
    let any = false;

    for (const preference of preferences) {
        const lower = preference.toLowerCase();
        flat[lower] = preference;
        const parts = lower.split('/');
        const type = parts[0];
        const subtype = parts[1];

        if (type === '*') {
            lib$2.assert(subtype === '*', 'Invalid media type preference contains wildcard type with a subtype');
            any = true;
            continue;
        }

        lowers[type] = lowers[type] || Object.create(null);
        lowers[type][subtype] = preference;
    }

    const preferred = [];
    for (const selection of selections) {
        const token = selection.token;
        const { type, subtype } = map[token];
        const subtypes = lowers[type];

        // */*

        if (type === '*') {
            for (const preference of Object.keys(flat)) {
                if (!map[preference]) {
                    preferred.push(flat[preference]);
                }
            }

            if (any) {
                preferred.push('*/*');
            }

            continue;
        }

        // any

        if (any) {
            preferred.push((flat[token] || token) + selection.original);
            continue;
        }

        // type/subtype

        if (subtype !== '*') {
            const pref = flat[token];
            if (pref ||
                (subtypes && subtypes['*'])) {

                preferred.push((pref || token) + selection.original);
            }

            continue;
        }

        // type/*

        if (subtypes) {
            for (const psub of Object.keys(subtypes)) {
                if (!map[`${type}/${psub}`]) {
                    preferred.push(subtypes[psub]);
                }
            }
        }
    }

    return preferred;
};
});

var lib = defaultHandler.createCommonjsModule(function (module, exports) {





const internals = {
    options: {
        charset: {
            type: 'accept-charset'
        },
        encoding: {
            type: 'accept-encoding',
            default: 'identity',
            equivalents: new Map([
                ['x-compress', 'compress'],
                ['x-gzip', 'gzip']
            ])
        },
        language: {
            type: 'accept-language',
            prefixMatch: true
        }
    }
};


for (const type in internals.options) {
    exports[type] = (header$1, preferences) => header.selection(header$1, preferences, internals.options[type]);

    exports[`${type}s`] = (header$1, preferences) => header.selections(header$1, preferences, internals.options[type]);
}


exports.mediaType = (header, preferences) => media.selection(header, preferences);

exports.mediaTypes = (header, preferences) => media.selections(header, preferences);


exports.parseAll = function (requestHeaders) {

    return {
        charsets: exports.charsets(requestHeaders['accept-charset']),
        encodings: exports.encodings(requestHeaders['accept-encoding']),
        languages: exports.languages(requestHeaders['accept-language']),
        mediaTypes: exports.mediaTypes(requestHeaders.accept)
    };
};
});

var index = /*#__PURE__*/Object.freeze(/*#__PURE__*/_mergeNamespaces({
    __proto__: null,
    'default': lib
}, [lib]));

exports.index = index;
