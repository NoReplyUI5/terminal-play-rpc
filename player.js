#!/usr/bin/env node
/******/ (() => {
  // webpackBootstrap
  /******/ var __webpack_modules__ = {
    /***/ 600: /***/ (
      module,
      __unused_webpack_exports,
      __nccwpck_require__,
    ) => {
      "use strict";

      const WebSocket = __nccwpck_require__(35);

      WebSocket.createWebSocketStream = __nccwpck_require__(674);
      WebSocket.Server = __nccwpck_require__(95);
      WebSocket.Receiver = __nccwpck_require__(131);
      WebSocket.Sender = __nccwpck_require__(319);

      WebSocket.WebSocket = WebSocket;
      WebSocket.WebSocketServer = WebSocket.Server;

      module.exports = WebSocket;

      /***/
    },

    /***/ 669: /***/ (
      module,
      __unused_webpack_exports,
      __nccwpck_require__,
    ) => {
      "use strict";

      const { EMPTY_BUFFER } = __nccwpck_require__(89);

      const FastBuffer = Buffer[Symbol.species];

      /**
       * Merges an array of buffers into a new buffer.
       *
       * @param {Buffer[]} list The array of buffers to concat
       * @param {Number} totalLength The total length of buffers in the list
       * @return {Buffer} The resulting buffer
       * @public
       */
      function concat(list, totalLength) {
        if (list.length === 0) return EMPTY_BUFFER;
        if (list.length === 1) return list[0];

        const target = Buffer.allocUnsafe(totalLength);
        let offset = 0;

        for (let i = 0; i < list.length; i++) {
          const buf = list[i];
          target.set(buf, offset);
          offset += buf.length;
        }

        if (offset < totalLength) {
          return new FastBuffer(target.buffer, target.byteOffset, offset);
        }

        return target;
      }

      /**
       * Masks a buffer using the given mask.
       *
       * @param {Buffer} source The buffer to mask
       * @param {Buffer} mask The mask to use
       * @param {Buffer} output The buffer where to store the result
       * @param {Number} offset The offset at which to start writing
       * @param {Number} length The number of bytes to mask.
       * @public
       */
      function _mask(source, mask, output, offset, length) {
        for (let i = 0; i < length; i++) {
          output[offset + i] = source[i] ^ mask[i & 3];
        }
      }

      /**
       * Unmasks a buffer using the given mask.
       *
       * @param {Buffer} buffer The buffer to unmask
       * @param {Buffer} mask The mask to use
       * @public
       */
      function _unmask(buffer, mask) {
        for (let i = 0; i < buffer.length; i++) {
          buffer[i] ^= mask[i & 3];
        }
      }

      /**
       * Converts a buffer to an `ArrayBuffer`.
       *
       * @param {Buffer} buf The buffer to convert
       * @return {ArrayBuffer} Converted buffer
       * @public
       */
      function toArrayBuffer(buf) {
        if (buf.length === buf.buffer.byteLength) {
          return buf.buffer;
        }

        return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
      }

      /**
       * Converts `data` to a `Buffer`.
       *
       * @param {*} data The data to convert
       * @return {Buffer} The buffer
       * @throws {TypeError}
       * @public
       */
      function toBuffer(data) {
        toBuffer.readOnly = true;

        if (Buffer.isBuffer(data)) return data;

        let buf;

        if (data instanceof ArrayBuffer) {
          buf = new FastBuffer(data);
        } else if (ArrayBuffer.isView(data)) {
          buf = new FastBuffer(data.buffer, data.byteOffset, data.byteLength);
        } else {
          buf = Buffer.from(data);
          toBuffer.readOnly = false;
        }

        return buf;
      }

      module.exports = {
        concat,
        mask: _mask,
        toArrayBuffer,
        toBuffer,
        unmask: _unmask,
      };

      /* istanbul ignore else  */
      if (!process.env.WS_NO_BUFFER_UTIL) {
        try {
          const bufferUtil = __nccwpck_require__(253);

          module.exports.mask = function (
            source,
            mask,
            output,
            offset,
            length,
          ) {
            if (length < 48) _mask(source, mask, output, offset, length);
            else bufferUtil.mask(source, mask, output, offset, length);
          };

          module.exports.unmask = function (buffer, mask) {
            if (buffer.length < 32) _unmask(buffer, mask);
            else bufferUtil.unmask(buffer, mask);
          };
        } catch (e) {
          // Continue regardless of the error.
        }
      }

      /***/
    },

    /***/ 89: /***/ (module) => {
      "use strict";

      const BINARY_TYPES = ["nodebuffer", "arraybuffer", "fragments"];
      const hasBlob = typeof Blob !== "undefined";

      if (hasBlob) BINARY_TYPES.push("blob");

      module.exports = {
        BINARY_TYPES,
        CLOSE_TIMEOUT: 30000,
        EMPTY_BUFFER: Buffer.alloc(0),
        GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
        hasBlob,
        kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
        kListener: Symbol("kListener"),
        kStatusCode: Symbol("status-code"),
        kWebSocket: Symbol("websocket"),
        NOOP: () => {},
      };

      /***/
    },

    /***/ 936: /***/ (
      module,
      __unused_webpack_exports,
      __nccwpck_require__,
    ) => {
      "use strict";

      const { kForOnEventAttribute, kListener } = __nccwpck_require__(89);

      const kCode = Symbol("kCode");
      const kData = Symbol("kData");
      const kError = Symbol("kError");
      const kMessage = Symbol("kMessage");
      const kReason = Symbol("kReason");
      const kTarget = Symbol("kTarget");
      const kType = Symbol("kType");
      const kWasClean = Symbol("kWasClean");

      /**
       * Class representing an event.
       */
      class Event {
        /**
         * Create a new `Event`.
         *
         * @param {String} type The name of the event
         * @throws {TypeError} If the `type` argument is not specified
         */
        constructor(type) {
          this[kTarget] = null;
          this[kType] = type;
        }

        /**
         * @type {*}
         */
        get target() {
          return this[kTarget];
        }

        /**
         * @type {String}
         */
        get type() {
          return this[kType];
        }
      }

      Object.defineProperty(Event.prototype, "target", { enumerable: true });
      Object.defineProperty(Event.prototype, "type", { enumerable: true });

      /**
       * Class representing a close event.
       *
       * @extends Event
       */
      class CloseEvent extends Event {
        /**
         * Create a new `CloseEvent`.
         *
         * @param {String} type The name of the event
         * @param {Object} [options] A dictionary object that allows for setting
         *     attributes via object members of the same name
         * @param {Number} [options.code=0] The status code explaining why the
         *     connection was closed
         * @param {String} [options.reason=''] A human-readable string explaining why
         *     the connection was closed
         * @param {Boolean} [options.wasClean=false] Indicates whether or not the
         *     connection was cleanly closed
         */
        constructor(type, options = {}) {
          super(type);

          this[kCode] = options.code === undefined ? 0 : options.code;
          this[kReason] = options.reason === undefined ? "" : options.reason;
          this[kWasClean] =
            options.wasClean === undefined ? false : options.wasClean;
        }

        /**
         * @type {Number}
         */
        get code() {
          return this[kCode];
        }

        /**
         * @type {String}
         */
        get reason() {
          return this[kReason];
        }

        /**
         * @type {Boolean}
         */
        get wasClean() {
          return this[kWasClean];
        }
      }

      Object.defineProperty(CloseEvent.prototype, "code", { enumerable: true });
      Object.defineProperty(CloseEvent.prototype, "reason", {
        enumerable: true,
      });
      Object.defineProperty(CloseEvent.prototype, "wasClean", {
        enumerable: true,
      });

      /**
       * Class representing an error event.
       *
       * @extends Event
       */
      class ErrorEvent extends Event {
        /**
         * Create a new `ErrorEvent`.
         *
         * @param {String} type The name of the event
         * @param {Object} [options] A dictionary object that allows for setting
         *     attributes via object members of the same name
         * @param {*} [options.error=null] The error that generated this event
         * @param {String} [options.message=''] The error message
         */
        constructor(type, options = {}) {
          super(type);

          this[kError] = options.error === undefined ? null : options.error;
          this[kMessage] = options.message === undefined ? "" : options.message;
        }

        /**
         * @type {*}
         */
        get error() {
          return this[kError];
        }

        /**
         * @type {String}
         */
        get message() {
          return this[kMessage];
        }
      }

      Object.defineProperty(ErrorEvent.prototype, "error", {
        enumerable: true,
      });
      Object.defineProperty(ErrorEvent.prototype, "message", {
        enumerable: true,
      });

      /**
       * Class representing a message event.
       *
       * @extends Event
       */
      class MessageEvent extends Event {
        /**
         * Create a new `MessageEvent`.
         *
         * @param {String} type The name of the event
         * @param {Object} [options] A dictionary object that allows for setting
         *     attributes via object members of the same name
         * @param {*} [options.data=null] The message content
         */
        constructor(type, options = {}) {
          super(type);

          this[kData] = options.data === undefined ? null : options.data;
        }

        /**
         * @type {*}
         */
        get data() {
          return this[kData];
        }
      }

      Object.defineProperty(MessageEvent.prototype, "data", {
        enumerable: true,
      });

      /**
       * This provides methods for emulating the `EventTarget` interface. It's not
       * meant to be used directly.
       *
       * @mixin
       */
      const EventTarget = {
        /**
         * Register an event listener.
         *
         * @param {String} type A string representing the event type to listen for
         * @param {(Function|Object)} handler The listener to add
         * @param {Object} [options] An options object specifies characteristics about
         *     the event listener
         * @param {Boolean} [options.once=false] A `Boolean` indicating that the
         *     listener should be invoked at most once after being added. If `true`,
         *     the listener would be automatically removed when invoked.
         * @public
         */
        addEventListener(type, handler, options = {}) {
          for (const listener of this.listeners(type)) {
            if (
              !options[kForOnEventAttribute] &&
              listener[kListener] === handler &&
              !listener[kForOnEventAttribute]
            ) {
              return;
            }
          }

          let wrapper;

          if (type === "message") {
            wrapper = function onMessage(data, isBinary) {
              const event = new MessageEvent("message", {
                data: isBinary ? data : data.toString(),
              });

              event[kTarget] = this;
              callListener(handler, this, event);
            };
          } else if (type === "close") {
            wrapper = function onClose(code, message) {
              const event = new CloseEvent("close", {
                code,
                reason: message.toString(),
                wasClean: this._closeFrameReceived && this._closeFrameSent,
              });

              event[kTarget] = this;
              callListener(handler, this, event);
            };
          } else if (type === "error") {
            wrapper = function onError(error) {
              const event = new ErrorEvent("error", {
                error,
                message: error.message,
              });

              event[kTarget] = this;
              callListener(handler, this, event);
            };
          } else if (type === "open") {
            wrapper = function onOpen() {
              const event = new Event("open");

              event[kTarget] = this;
              callListener(handler, this, event);
            };
          } else {
            return;
          }

          wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
          wrapper[kListener] = handler;

          if (options.once) {
            this.once(type, wrapper);
          } else {
            this.on(type, wrapper);
          }
        },

        /**
         * Remove an event listener.
         *
         * @param {String} type A string representing the event type to remove
         * @param {(Function|Object)} handler The listener to remove
         * @public
         */
        removeEventListener(type, handler) {
          for (const listener of this.listeners(type)) {
            if (
              listener[kListener] === handler &&
              !listener[kForOnEventAttribute]
            ) {
              this.removeListener(type, listener);
              break;
            }
          }
        },
      };

      module.exports = {
        CloseEvent,
        ErrorEvent,
        Event,
        EventTarget,
        MessageEvent,
      };

      /**
       * Call an event listener
       *
       * @param {(Function|Object)} listener The listener to call
       * @param {*} thisArg The value to use as `this`` when calling the listener
       * @param {Event} event The event to pass to the listener
       * @private
       */
      function callListener(listener, thisArg, event) {
        if (typeof listener === "object" && listener.handleEvent) {
          listener.handleEvent.call(listener, event);
        } else {
          listener.call(thisArg, event);
        }
      }

      /***/
    },

    /***/ 729: /***/ (
      module,
      __unused_webpack_exports,
      __nccwpck_require__,
    ) => {
      "use strict";

      const { tokenChars } = __nccwpck_require__(697);

      /**
       * Adds an offer to the map of extension offers or a parameter to the map of
       * parameters.
       *
       * @param {Object} dest The map of extension offers or parameters
       * @param {String} name The extension or parameter name
       * @param {(Object|Boolean|String)} elem The extension parameters or the
       *     parameter value
       * @private
       */
      function push(dest, name, elem) {
        if (dest[name] === undefined) dest[name] = [elem];
        else dest[name].push(elem);
      }

      /**
       * Parses the `Sec-WebSocket-Extensions` header into an object.
       *
       * @param {String} header The field value of the header
       * @return {Object} The parsed object
       * @public
       */
      function parse(header) {
        const offers = Object.create(null);
        let params = Object.create(null);
        let mustUnescape = false;
        let isEscaping = false;
        let inQuotes = false;
        let extensionName;
        let paramName;
        let start = -1;
        let code = -1;
        let end = -1;
        let i = 0;

        for (; i < header.length; i++) {
          code = header.charCodeAt(i);

          if (extensionName === undefined) {
            if (end === -1 && tokenChars[code] === 1) {
              if (start === -1) start = i;
            } else if (
              i !== 0 &&
              (code === 0x20 /* ' ' */ || code === 0x09) /* '\t' */
            ) {
              if (end === -1 && start !== -1) end = i;
            } else if (code === 0x3b /* ';' */ || code === 0x2c /* ',' */) {
              if (start === -1) {
                throw new SyntaxError(`Unexpected character at index ${i}`);
              }

              if (end === -1) end = i;
              const name = header.slice(start, end);
              if (code === 0x2c) {
                push(offers, name, params);
                params = Object.create(null);
              } else {
                extensionName = name;
              }

              start = end = -1;
            } else {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
          } else if (paramName === undefined) {
            if (end === -1 && tokenChars[code] === 1) {
              if (start === -1) start = i;
            } else if (code === 0x20 || code === 0x09) {
              if (end === -1 && start !== -1) end = i;
            } else if (code === 0x3b || code === 0x2c) {
              if (start === -1) {
                throw new SyntaxError(`Unexpected character at index ${i}`);
              }

              if (end === -1) end = i;
              push(params, header.slice(start, end), true);
              if (code === 0x2c) {
                push(offers, extensionName, params);
                params = Object.create(null);
                extensionName = undefined;
              }

              start = end = -1;
            } else if (code === 0x3d /* '=' */ && start !== -1 && end === -1) {
              paramName = header.slice(start, i);
              start = end = -1;
            } else {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
          } else {
            //
            // The value of a quoted-string after unescaping must conform to the
            // token ABNF, so only token characters are valid.
            // Ref: https://tools.ietf.org/html/rfc6455#section-9.1
            //
            if (isEscaping) {
              if (tokenChars[code] !== 1) {
                throw new SyntaxError(`Unexpected character at index ${i}`);
              }
              if (start === -1) start = i;
              else if (!mustUnescape) mustUnescape = true;
              isEscaping = false;
            } else if (inQuotes) {
              if (tokenChars[code] === 1) {
                if (start === -1) start = i;
              } else if (code === 0x22 /* '"' */ && start !== -1) {
                inQuotes = false;
                end = i;
              } else if (code === 0x5c /* '\' */) {
                isEscaping = true;
              } else {
                throw new SyntaxError(`Unexpected character at index ${i}`);
              }
            } else if (code === 0x22 && header.charCodeAt(i - 1) === 0x3d) {
              inQuotes = true;
            } else if (end === -1 && tokenChars[code] === 1) {
              if (start === -1) start = i;
            } else if (start !== -1 && (code === 0x20 || code === 0x09)) {
              if (end === -1) end = i;
            } else if (code === 0x3b || code === 0x2c) {
              if (start === -1) {
                throw new SyntaxError(`Unexpected character at index ${i}`);
              }

              if (end === -1) end = i;
              let value = header.slice(start, end);
              if (mustUnescape) {
                value = value.replace(/\\/g, "");
                mustUnescape = false;
              }
              push(params, paramName, value);
              if (code === 0x2c) {
                push(offers, extensionName, params);
                params = Object.create(null);
                extensionName = undefined;
              }

              paramName = undefined;
              start = end = -1;
            } else {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
          }
        }

        if (start === -1 || inQuotes || code === 0x20 || code === 0x09) {
          throw new SyntaxError("Unexpected end of input");
        }

        if (end === -1) end = i;
        const token = header.slice(start, end);
        if (extensionName === undefined) {
          push(offers, token, params);
        } else {
          if (paramName === undefined) {
            push(params, token, true);
          } else if (mustUnescape) {
            push(params, paramName, token.replace(/\\/g, ""));
          } else {
            push(params, paramName, token);
          }
          push(offers, extensionName, params);
        }

        return offers;
      }

      /**
       * Builds the `Sec-WebSocket-Extensions` header field value.
       *
       * @param {Object} extensions The map of extensions and parameters to format
       * @return {String} A string representing the given object
       * @public
       */
      function format(extensions) {
        return Object.keys(extensions)
          .map((extension) => {
            let configurations = extensions[extension];
            if (!Array.isArray(configurations))
              configurations = [configurations];
            return configurations
              .map((params) => {
                return [extension]
                  .concat(
                    Object.keys(params).map((k) => {
                      let values = params[k];
                      if (!Array.isArray(values)) values = [values];
                      return values
                        .map((v) => (v === true ? k : `${k}=${v}`))
                        .join("; ");
                    }),
                  )
                  .join("; ");
              })
              .join(", ");
          })
          .join(", ");
      }

      module.exports = { format, parse };

      /***/
    },

    /***/ 23: /***/ (module) => {
      "use strict";

      const kDone = Symbol("kDone");
      const kRun = Symbol("kRun");

      /**
       * A very simple job queue with adjustable concurrency. Adapted from
       * https://github.com/STRML/async-limiter
       */
      class Limiter {
        /**
         * Creates a new `Limiter`.
         *
         * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
         *     to run concurrently
         */
        constructor(concurrency) {
          this[kDone] = () => {
            this.pending--;
            this[kRun]();
          };
          this.concurrency = concurrency || Infinity;
          this.jobs = [];
          this.pending = 0;
        }

        /**
         * Adds a job to the queue.
         *
         * @param {Function} job The job to run
         * @public
         */
        add(job) {
          this.jobs.push(job);
          this[kRun]();
        }

        /**
         * Removes a job from the queue and runs it if possible.
         *
         * @private
         */
        [kRun]() {
          if (this.pending === this.concurrency) return;

          if (this.jobs.length) {
            const job = this.jobs.shift();

            this.pending++;
            job(this[kDone]);
          }
        }
      }

      module.exports = Limiter;

      /***/
    },

    /***/ 290: /***/ (
      module,
      __unused_webpack_exports,
      __nccwpck_require__,
    ) => {
      "use strict";

      const zlib = __nccwpck_require__(106);

      const bufferUtil = __nccwpck_require__(669);
      const Limiter = __nccwpck_require__(23);
      const { kStatusCode } = __nccwpck_require__(89);

      const FastBuffer = Buffer[Symbol.species];
      const TRAILER = Buffer.from([0x00, 0x00, 0xff, 0xff]);
      const kPerMessageDeflate = Symbol("permessage-deflate");
      const kTotalLength = Symbol("total-length");
      const kCallback = Symbol("callback");
      const kBuffers = Symbol("buffers");
      const kError = Symbol("error");

      //
      // We limit zlib concurrency, which prevents severe memory fragmentation
      // as documented in https://github.com/nodejs/node/issues/8871#issuecomment-250915913
      // and https://github.com/websockets/ws/issues/1202
      //
      // Intentionally global; it's the global thread pool that's an issue.
      //
      let zlibLimiter;

      /**
       * permessage-deflate implementation.
       */
      class PerMessageDeflate {
        /**
         * Creates a PerMessageDeflate instance.
         *
         * @param {Object} [options] Configuration options
         * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
         *     for, or request, a custom client window size
         * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
         *     acknowledge disabling of client context takeover
         * @param {Number} [options.concurrencyLimit=10] The number of concurrent
         *     calls to zlib
         * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
         *     use of a custom server window size
         * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
         *     disabling of server context takeover
         * @param {Number} [options.threshold=1024] Size (in bytes) below which
         *     messages should not be compressed if context takeover is disabled
         * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
         *     deflate
         * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
         *     inflate
         * @param {Boolean} [isServer=false] Create the instance in either server or
         *     client mode
         * @param {Number} [maxPayload=0] The maximum allowed message length
         */
        constructor(options, isServer, maxPayload) {
          this._maxPayload = maxPayload | 0;
          this._options = options || {};
          this._threshold =
            this._options.threshold !== undefined
              ? this._options.threshold
              : 1024;
          this._isServer = !!isServer;
          this._deflate = null;
          this._inflate = null;

          this.params = null;

          if (!zlibLimiter) {
            const concurrency =
              this._options.concurrencyLimit !== undefined
                ? this._options.concurrencyLimit
                : 10;
            zlibLimiter = new Limiter(concurrency);
          }
        }

        /**
         * @type {String}
         */
        static get extensionName() {
          return "permessage-deflate";
        }

        /**
         * Create an extension negotiation offer.
         *
         * @return {Object} Extension parameters
         * @public
         */
        offer() {
          const params = {};

          if (this._options.serverNoContextTakeover) {
            params.server_no_context_takeover = true;
          }
          if (this._options.clientNoContextTakeover) {
            params.client_no_context_takeover = true;
          }
          if (this._options.serverMaxWindowBits) {
            params.server_max_window_bits = this._options.serverMaxWindowBits;
          }
          if (this._options.clientMaxWindowBits) {
            params.client_max_window_bits = this._options.clientMaxWindowBits;
          } else if (this._options.clientMaxWindowBits == null) {
            params.client_max_window_bits = true;
          }

          return params;
        }

        /**
         * Accept an extension negotiation offer/response.
         *
         * @param {Array} configurations The extension negotiation offers/reponse
         * @return {Object} Accepted configuration
         * @public
         */
        accept(configurations) {
          configurations = this.normalizeParams(configurations);

          this.params = this._isServer
            ? this.acceptAsServer(configurations)
            : this.acceptAsClient(configurations);

          return this.params;
        }

        /**
         * Releases all resources used by the extension.
         *
         * @public
         */
        cleanup() {
          if (this._inflate) {
            this._inflate.close();
            this._inflate = null;
          }

          if (this._deflate) {
            const callback = this._deflate[kCallback];

            this._deflate.close();
            this._deflate = null;

            if (callback) {
              callback(
                new Error(
                  "The deflate stream was closed while data was being processed",
                ),
              );
            }
          }
        }

        /**
         *  Accept an extension negotiation offer.
         *
         * @param {Array} offers The extension negotiation offers
         * @return {Object} Accepted configuration
         * @private
         */
        acceptAsServer(offers) {
          const opts = this._options;
          const accepted = offers.find((params) => {
            if (
              (opts.serverNoContextTakeover === false &&
                params.server_no_context_takeover) ||
              (params.server_max_window_bits &&
                (opts.serverMaxWindowBits === false ||
                  (typeof opts.serverMaxWindowBits === "number" &&
                    opts.serverMaxWindowBits >
                      params.server_max_window_bits))) ||
              (typeof opts.clientMaxWindowBits === "number" &&
                !params.client_max_window_bits)
            ) {
              return false;
            }

            return true;
          });

          if (!accepted) {
            throw new Error("None of the extension offers can be accepted");
          }

          if (opts.serverNoContextTakeover) {
            accepted.server_no_context_takeover = true;
          }
          if (opts.clientNoContextTakeover) {
            accepted.client_no_context_takeover = true;
          }
          if (typeof opts.serverMaxWindowBits === "number") {
            accepted.server_max_window_bits = opts.serverMaxWindowBits;
          }
          if (typeof opts.clientMaxWindowBits === "number") {
            accepted.client_max_window_bits = opts.clientMaxWindowBits;
          } else if (
            accepted.client_max_window_bits === true ||
            opts.clientMaxWindowBits === false
          ) {
            delete accepted.client_max_window_bits;
          }

          return accepted;
        }

        /**
         * Accept the extension negotiation response.
         *
         * @param {Array} response The extension negotiation response
         * @return {Object} Accepted configuration
         * @private
         */
        acceptAsClient(response) {
          const params = response[0];

          if (
            this._options.clientNoContextTakeover === false &&
            params.client_no_context_takeover
          ) {
            throw new Error(
              'Unexpected parameter "client_no_context_takeover"',
            );
          }

          if (!params.client_max_window_bits) {
            if (typeof this._options.clientMaxWindowBits === "number") {
              params.client_max_window_bits = this._options.clientMaxWindowBits;
            }
          } else if (
            this._options.clientMaxWindowBits === false ||
            (typeof this._options.clientMaxWindowBits === "number" &&
              params.client_max_window_bits > this._options.clientMaxWindowBits)
          ) {
            throw new Error(
              'Unexpected or invalid parameter "client_max_window_bits"',
            );
          }

          return params;
        }

        /**
         * Normalize parameters.
         *
         * @param {Array} configurations The extension negotiation offers/reponse
         * @return {Array} The offers/response with normalized parameters
         * @private
         */
        normalizeParams(configurations) {
          configurations.forEach((params) => {
            Object.keys(params).forEach((key) => {
              let value = params[key];

              if (value.length > 1) {
                throw new Error(
                  `Parameter "${key}" must have only a single value`,
                );
              }

              value = value[0];

              if (key === "client_max_window_bits") {
                if (value !== true) {
                  const num = +value;
                  if (!Number.isInteger(num) || num < 8 || num > 15) {
                    throw new TypeError(
                      `Invalid value for parameter "${key}": ${value}`,
                    );
                  }
                  value = num;
                } else if (!this._isServer) {
                  throw new TypeError(
                    `Invalid value for parameter "${key}": ${value}`,
                  );
                }
              } else if (key === "server_max_window_bits") {
                const num = +value;
                if (!Number.isInteger(num) || num < 8 || num > 15) {
                  throw new TypeError(
                    `Invalid value for parameter "${key}": ${value}`,
                  );
                }
                value = num;
              } else if (
                key === "client_no_context_takeover" ||
                key === "server_no_context_takeover"
              ) {
                if (value !== true) {
                  throw new TypeError(
                    `Invalid value for parameter "${key}": ${value}`,
                  );
                }
              } else {
                throw new Error(`Unknown parameter "${key}"`);
              }

              params[key] = value;
            });
          });

          return configurations;
        }

        /**
         * Decompress data. Concurrency limited.
         *
         * @param {Buffer} data Compressed data
         * @param {Boolean} fin Specifies whether or not this is the last fragment
         * @param {Function} callback Callback
         * @public
         */
        decompress(data, fin, callback) {
          zlibLimiter.add((done) => {
            this._decompress(data, fin, (err, result) => {
              done();
              callback(err, result);
            });
          });
        }

        /**
         * Compress data. Concurrency limited.
         *
         * @param {(Buffer|String)} data Data to compress
         * @param {Boolean} fin Specifies whether or not this is the last fragment
         * @param {Function} callback Callback
         * @public
         */
        compress(data, fin, callback) {
          zlibLimiter.add((done) => {
            this._compress(data, fin, (err, result) => {
              done();
              callback(err, result);
            });
          });
        }

        /**
         * Decompress data.
         *
         * @param {Buffer} data Compressed data
         * @param {Boolean} fin Specifies whether or not this is the last fragment
         * @param {Function} callback Callback
         * @private
         */
        _decompress(data, fin, callback) {
          const endpoint = this._isServer ? "client" : "server";

          if (!this._inflate) {
            const key = `${endpoint}_max_window_bits`;
            const windowBits =
              typeof this.params[key] !== "number"
                ? zlib.Z_DEFAULT_WINDOWBITS
                : this.params[key];

            this._inflate = zlib.createInflateRaw({
              ...this._options.zlibInflateOptions,
              windowBits,
            });
            this._inflate[kPerMessageDeflate] = this;
            this._inflate[kTotalLength] = 0;
            this._inflate[kBuffers] = [];
            this._inflate.on("error", inflateOnError);
            this._inflate.on("data", inflateOnData);
          }

          this._inflate[kCallback] = callback;

          this._inflate.write(data);
          if (fin) this._inflate.write(TRAILER);

          this._inflate.flush(() => {
            const err = this._inflate[kError];

            if (err) {
              this._inflate.close();
              this._inflate = null;
              callback(err);
              return;
            }

            const data = bufferUtil.concat(
              this._inflate[kBuffers],
              this._inflate[kTotalLength],
            );

            if (this._inflate._readableState.endEmitted) {
              this._inflate.close();
              this._inflate = null;
            } else {
              this._inflate[kTotalLength] = 0;
              this._inflate[kBuffers] = [];

              if (fin && this.params[`${endpoint}_no_context_takeover`]) {
                this._inflate.reset();
              }
            }

            callback(null, data);
          });
        }

        /**
         * Compress data.
         *
         * @param {(Buffer|String)} data Data to compress
         * @param {Boolean} fin Specifies whether or not this is the last fragment
         * @param {Function} callback Callback
         * @private
         */
        _compress(data, fin, callback) {
          const endpoint = this._isServer ? "server" : "client";

          if (!this._deflate) {
            const key = `${endpoint}_max_window_bits`;
            const windowBits =
              typeof this.params[key] !== "number"
                ? zlib.Z_DEFAULT_WINDOWBITS
                : this.params[key];

            this._deflate = zlib.createDeflateRaw({
              ...this._options.zlibDeflateOptions,
              windowBits,
            });

            this._deflate[kTotalLength] = 0;
            this._deflate[kBuffers] = [];

            this._deflate.on("data", deflateOnData);
          }

          this._deflate[kCallback] = callback;

          this._deflate.write(data);
          this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
            if (!this._deflate) {
              //
              // The deflate stream was closed while data was being processed.
              //
              return;
            }

            let data = bufferUtil.concat(
              this._deflate[kBuffers],
              this._deflate[kTotalLength],
            );

            if (fin) {
              data = new FastBuffer(
                data.buffer,
                data.byteOffset,
                data.length - 4,
              );
            }

            //
            // Ensure that the callback will not be called again in
            // `PerMessageDeflate#cleanup()`.
            //
            this._deflate[kCallback] = null;

            this._deflate[kTotalLength] = 0;
            this._deflate[kBuffers] = [];

            if (fin && this.params[`${endpoint}_no_context_takeover`]) {
              this._deflate.reset();
            }

            callback(null, data);
          });
        }
      }

      module.exports = PerMessageDeflate;

      /**
       * The listener of the `zlib.DeflateRaw` stream `'data'` event.
       *
       * @param {Buffer} chunk A chunk of data
       * @private
       */
      function deflateOnData(chunk) {
        this[kBuffers].push(chunk);
        this[kTotalLength] += chunk.length;
      }

      /**
       * The listener of the `zlib.InflateRaw` stream `'data'` event.
       *
       * @param {Buffer} chunk A chunk of data
       * @private
       */
      function inflateOnData(chunk) {
        this[kTotalLength] += chunk.length;

        if (
          this[kPerMessageDeflate]._maxPayload < 1 ||
          this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload
        ) {
          this[kBuffers].push(chunk);
          return;
        }

        this[kError] = new RangeError("Max payload size exceeded");
        this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
        this[kError][kStatusCode] = 1009;
        this.removeListener("data", inflateOnData);

        //
        // The choice to employ `zlib.reset()` over `zlib.close()` is dictated by the
        // fact that in Node.js versions prior to 13.10.0, the callback for
        // `zlib.flush()` is not called if `zlib.close()` is used. Utilizing
        // `zlib.reset()` ensures that either the callback is invoked or an error is
        // emitted.
        //
        this.reset();
      }

      /**
       * The listener of the `zlib.InflateRaw` stream `'error'` event.
       *
       * @param {Error} err The emitted error
       * @private
       */
      function inflateOnError(err) {
        //
        // There is no need to call `Zlib#close()` as the handle is automatically
        // closed when an error is emitted.
        //
        this[kPerMessageDeflate]._inflate = null;

        if (this[kError]) {
          this[kCallback](this[kError]);
          return;
        }

        err[kStatusCode] = 1007;
        this[kCallback](err);
      }

      /***/
    },

    /***/ 131: /***/ (
      module,
      __unused_webpack_exports,
      __nccwpck_require__,
    ) => {
      "use strict";

      const { Writable } = __nccwpck_require__(203);

      const PerMessageDeflate = __nccwpck_require__(290);
      const { BINARY_TYPES, EMPTY_BUFFER, kStatusCode, kWebSocket } =
        __nccwpck_require__(89);
      const { concat, toArrayBuffer, unmask } = __nccwpck_require__(669);
      const { isValidStatusCode, isValidUTF8 } = __nccwpck_require__(697);

      const FastBuffer = Buffer[Symbol.species];

      const GET_INFO = 0;
      const GET_PAYLOAD_LENGTH_16 = 1;
      const GET_PAYLOAD_LENGTH_64 = 2;
      const GET_MASK = 3;
      const GET_DATA = 4;
      const INFLATING = 5;
      const DEFER_EVENT = 6;

      /**
       * HyBi Receiver implementation.
       *
       * @extends Writable
       */
      class Receiver extends Writable {
        /**
         * Creates a Receiver instance.
         *
         * @param {Object} [options] Options object
         * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
         *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
         *     multiple times in the same tick
         * @param {String} [options.binaryType=nodebuffer] The type for binary data
         * @param {Object} [options.extensions] An object containing the negotiated
         *     extensions
         * @param {Boolean} [options.isServer=false] Specifies whether to operate in
         *     client or server mode
         * @param {Number} [options.maxPayload=0] The maximum allowed message length
         * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
         *     not to skip UTF-8 validation for text and close messages
         */
        constructor(options = {}) {
          super();

          this._allowSynchronousEvents =
            options.allowSynchronousEvents !== undefined
              ? options.allowSynchronousEvents
              : true;
          this._binaryType = options.binaryType || BINARY_TYPES[0];
          this._extensions = options.extensions || {};
          this._isServer = !!options.isServer;
          this._maxPayload = options.maxPayload | 0;
          this._skipUTF8Validation = !!options.skipUTF8Validation;
          this[kWebSocket] = undefined;

          this._bufferedBytes = 0;
          this._buffers = [];

          this._compressed = false;
          this._payloadLength = 0;
          this._mask = undefined;
          this._fragmented = 0;
          this._masked = false;
          this._fin = false;
          this._opcode = 0;

          this._totalPayloadLength = 0;
          this._messageLength = 0;
          this._fragments = [];

          this._errored = false;
          this._loop = false;
          this._state = GET_INFO;
        }

        /**
         * Implements `Writable.prototype._write()`.
         *
         * @param {Buffer} chunk The chunk of data to write
         * @param {String} encoding The character encoding of `chunk`
         * @param {Function} cb Callback
         * @private
         */
        _write(chunk, encoding, cb) {
          if (this._opcode === 0x08 && this._state == GET_INFO) return cb();

          this._bufferedBytes += chunk.length;
          this._buffers.push(chunk);
          this.startLoop(cb);
        }

        /**
         * Consumes `n` bytes from the buffered data.
         *
         * @param {Number} n The number of bytes to consume
         * @return {Buffer} The consumed bytes
         * @private
         */
        consume(n) {
          this._bufferedBytes -= n;

          if (n === this._buffers[0].length) return this._buffers.shift();

          if (n < this._buffers[0].length) {
            const buf = this._buffers[0];
            this._buffers[0] = new FastBuffer(
              buf.buffer,
              buf.byteOffset + n,
              buf.length - n,
            );

            return new FastBuffer(buf.buffer, buf.byteOffset, n);
          }

          const dst = Buffer.allocUnsafe(n);

          do {
            const buf = this._buffers[0];
            const offset = dst.length - n;

            if (n >= buf.length) {
              dst.set(this._buffers.shift(), offset);
            } else {
              dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
              this._buffers[0] = new FastBuffer(
                buf.buffer,
                buf.byteOffset + n,
                buf.length - n,
              );
            }

            n -= buf.length;
          } while (n > 0);

          return dst;
        }

        /**
         * Starts the parsing loop.
         *
         * @param {Function} cb Callback
         * @private
         */
        startLoop(cb) {
          this._loop = true;

          do {
            switch (this._state) {
              case GET_INFO:
                this.getInfo(cb);
                break;
              case GET_PAYLOAD_LENGTH_16:
                this.getPayloadLength16(cb);
                break;
              case GET_PAYLOAD_LENGTH_64:
                this.getPayloadLength64(cb);
                break;
              case GET_MASK:
                this.getMask();
                break;
              case GET_DATA:
                this.getData(cb);
                break;
              case INFLATING:
              case DEFER_EVENT:
                this._loop = false;
                return;
            }
          } while (this._loop);

          if (!this._errored) cb();
        }

        /**
         * Reads the first two bytes of a frame.
         *
         * @param {Function} cb Callback
         * @private
         */
        getInfo(cb) {
          if (this._bufferedBytes < 2) {
            this._loop = false;
            return;
          }

          const buf = this.consume(2);

          if ((buf[0] & 0x30) !== 0x00) {
            const error = this.createError(
              RangeError,
              "RSV2 and RSV3 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_2_3",
            );

            cb(error);
            return;
          }

          const compressed = (buf[0] & 0x40) === 0x40;

          if (
            compressed &&
            !this._extensions[PerMessageDeflate.extensionName]
          ) {
            const error = this.createError(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1",
            );

            cb(error);
            return;
          }

          this._fin = (buf[0] & 0x80) === 0x80;
          this._opcode = buf[0] & 0x0f;
          this._payloadLength = buf[1] & 0x7f;

          if (this._opcode === 0x00) {
            if (compressed) {
              const error = this.createError(
                RangeError,
                "RSV1 must be clear",
                true,
                1002,
                "WS_ERR_UNEXPECTED_RSV_1",
              );

              cb(error);
              return;
            }

            if (!this._fragmented) {
              const error = this.createError(
                RangeError,
                "invalid opcode 0",
                true,
                1002,
                "WS_ERR_INVALID_OPCODE",
              );

              cb(error);
              return;
            }

            this._opcode = this._fragmented;
          } else if (this._opcode === 0x01 || this._opcode === 0x02) {
            if (this._fragmented) {
              const error = this.createError(
                RangeError,
                `invalid opcode ${this._opcode}`,
                true,
                1002,
                "WS_ERR_INVALID_OPCODE",
              );

              cb(error);
              return;
            }

            this._compressed = compressed;
          } else if (this._opcode > 0x07 && this._opcode < 0x0b) {
            if (!this._fin) {
              const error = this.createError(
                RangeError,
                "FIN must be set",
                true,
                1002,
                "WS_ERR_EXPECTED_FIN",
              );

              cb(error);
              return;
            }

            if (compressed) {
              const error = this.createError(
                RangeError,
                "RSV1 must be clear",
                true,
                1002,
                "WS_ERR_UNEXPECTED_RSV_1",
              );

              cb(error);
              return;
            }

            if (
              this._payloadLength > 0x7d ||
              (this._opcode === 0x08 && this._payloadLength === 1)
            ) {
              const error = this.createError(
                RangeError,
                `invalid payload length ${this._payloadLength}`,
                true,
                1002,
                "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH",
              );

              cb(error);
              return;
            }
          } else {
            const error = this.createError(
              RangeError,
              `invalid opcode ${this._opcode}`,
              true,
              1002,
              "WS_ERR_INVALID_OPCODE",
            );

            cb(error);
            return;
          }

          if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
          this._masked = (buf[1] & 0x80) === 0x80;

          if (this._isServer) {
            if (!this._masked) {
              const error = this.createError(
                RangeError,
                "MASK must be set",
                true,
                1002,
                "WS_ERR_EXPECTED_MASK",
              );

              cb(error);
              return;
            }
          } else if (this._masked) {
            const error = this.createError(
              RangeError,
              "MASK must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_MASK",
            );

            cb(error);
            return;
          }

          if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
          else if (this._payloadLength === 127)
            this._state = GET_PAYLOAD_LENGTH_64;
          else this.haveLength(cb);
        }

        /**
         * Gets extended payload length (7+16).
         *
         * @param {Function} cb Callback
         * @private
         */
        getPayloadLength16(cb) {
          if (this._bufferedBytes < 2) {
            this._loop = false;
            return;
          }

          this._payloadLength = this.consume(2).readUInt16BE(0);
          this.haveLength(cb);
        }

        /**
         * Gets extended payload length (7+64).
         *
         * @param {Function} cb Callback
         * @private
         */
        getPayloadLength64(cb) {
          if (this._bufferedBytes < 8) {
            this._loop = false;
            return;
          }

          const buf = this.consume(8);
          const num = buf.readUInt32BE(0);

          //
          // The maximum safe integer in JavaScript is 2^53 - 1. An error is returned
          // if payload length is greater than this number.
          //
          if (num > Math.pow(2, 53 - 32) - 1) {
            const error = this.createError(
              RangeError,
              "Unsupported WebSocket frame: payload length > 2^53 - 1",
              false,
              1009,
              "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH",
            );

            cb(error);
            return;
          }

          this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
          this.haveLength(cb);
        }

        /**
         * Payload length has been read.
         *
         * @param {Function} cb Callback
         * @private
         */
        haveLength(cb) {
          if (this._payloadLength && this._opcode < 0x08) {
            this._totalPayloadLength += this._payloadLength;
            if (
              this._totalPayloadLength > this._maxPayload &&
              this._maxPayload > 0
            ) {
              const error = this.createError(
                RangeError,
                "Max payload size exceeded",
                false,
                1009,
                "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH",
              );

              cb(error);
              return;
            }
          }

          if (this._masked) this._state = GET_MASK;
          else this._state = GET_DATA;
        }

        /**
         * Reads mask bytes.
         *
         * @private
         */
        getMask() {
          if (this._bufferedBytes < 4) {
            this._loop = false;
            return;
          }

          this._mask = this.consume(4);
          this._state = GET_DATA;
        }

        /**
         * Reads data bytes.
         *
         * @param {Function} cb Callback
         * @private
         */
        getData(cb) {
          let data = EMPTY_BUFFER;

          if (this._payloadLength) {
            if (this._bufferedBytes < this._payloadLength) {
              this._loop = false;
              return;
            }

            data = this.consume(this._payloadLength);

            if (
              this._masked &&
              (this._mask[0] |
                this._mask[1] |
                this._mask[2] |
                this._mask[3]) !==
                0
            ) {
              unmask(data, this._mask);
            }
          }

          if (this._opcode > 0x07) {
            this.controlMessage(data, cb);
            return;
          }

          if (this._compressed) {
            this._state = INFLATING;
            this.decompress(data, cb);
            return;
          }

          if (data.length) {
            //
            // This message is not compressed so its length is the sum of the payload
            // length of all fragments.
            //
            this._messageLength = this._totalPayloadLength;
            this._fragments.push(data);
          }

          this.dataMessage(cb);
        }

        /**
         * Decompresses data.
         *
         * @param {Buffer} data Compressed data
         * @param {Function} cb Callback
         * @private
         */
        decompress(data, cb) {
          const perMessageDeflate =
            this._extensions[PerMessageDeflate.extensionName];

          perMessageDeflate.decompress(data, this._fin, (err, buf) => {
            if (err) return cb(err);

            if (buf.length) {
              this._messageLength += buf.length;
              if (
                this._messageLength > this._maxPayload &&
                this._maxPayload > 0
              ) {
                const error = this.createError(
                  RangeError,
                  "Max payload size exceeded",
                  false,
                  1009,
                  "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH",
                );

                cb(error);
                return;
              }

              this._fragments.push(buf);
            }

            this.dataMessage(cb);
            if (this._state === GET_INFO) this.startLoop(cb);
          });
        }

        /**
         * Handles a data message.
         *
         * @param {Function} cb Callback
         * @private
         */
        dataMessage(cb) {
          if (!this._fin) {
            this._state = GET_INFO;
            return;
          }

          const messageLength = this._messageLength;
          const fragments = this._fragments;

          this._totalPayloadLength = 0;
          this._messageLength = 0;
          this._fragmented = 0;
          this._fragments = [];

          if (this._opcode === 2) {
            let data;

            if (this._binaryType === "nodebuffer") {
              data = concat(fragments, messageLength);
            } else if (this._binaryType === "arraybuffer") {
              data = toArrayBuffer(concat(fragments, messageLength));
            } else if (this._binaryType === "blob") {
              data = new Blob(fragments);
            } else {
              data = fragments;
            }

            if (this._allowSynchronousEvents) {
              this.emit("message", data, true);
              this._state = GET_INFO;
            } else {
              this._state = DEFER_EVENT;
              setImmediate(() => {
                this.emit("message", data, true);
                this._state = GET_INFO;
                this.startLoop(cb);
              });
            }
          } else {
            const buf = concat(fragments, messageLength);

            if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
              const error = this.createError(
                Error,
                "invalid UTF-8 sequence",
                true,
                1007,
                "WS_ERR_INVALID_UTF8",
              );

              cb(error);
              return;
            }

            if (this._state === INFLATING || this._allowSynchronousEvents) {
              this.emit("message", buf, false);
              this._state = GET_INFO;
            } else {
              this._state = DEFER_EVENT;
              setImmediate(() => {
                this.emit("message", buf, false);
                this._state = GET_INFO;
                this.startLoop(cb);
              });
            }
          }
        }

        /**
         * Handles a control message.
         *
         * @param {Buffer} data Data to handle
         * @return {(Error|RangeError|undefined)} A possible error
         * @private
         */
        controlMessage(data, cb) {
          if (this._opcode === 0x08) {
            if (data.length === 0) {
              this._loop = false;
              this.emit("conclude", 1005, EMPTY_BUFFER);
              this.end();
            } else {
              const code = data.readUInt16BE(0);

              if (!isValidStatusCode(code)) {
                const error = this.createError(
                  RangeError,
                  `invalid status code ${code}`,
                  true,
                  1002,
                  "WS_ERR_INVALID_CLOSE_CODE",
                );

                cb(error);
                return;
              }

              const buf = new FastBuffer(
                data.buffer,
                data.byteOffset + 2,
                data.length - 2,
              );

              if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
                const error = this.createError(
                  Error,
                  "invalid UTF-8 sequence",
                  true,
                  1007,
                  "WS_ERR_INVALID_UTF8",
                );

                cb(error);
                return;
              }

              this._loop = false;
              this.emit("conclude", code, buf);
              this.end();
            }

            this._state = GET_INFO;
            return;
          }

          if (this._allowSynchronousEvents) {
            this.emit(this._opcode === 0x09 ? "ping" : "pong", data);
            this._state = GET_INFO;
          } else {
            this._state = DEFER_EVENT;
            setImmediate(() => {
              this.emit(this._opcode === 0x09 ? "ping" : "pong", data);
              this._state = GET_INFO;
              this.startLoop(cb);
            });
          }
        }

        /**
         * Builds an error object.
         *
         * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
         * @param {String} message The error message
         * @param {Boolean} prefix Specifies whether or not to add a default prefix to
         *     `message`
         * @param {Number} statusCode The status code
         * @param {String} errorCode The exposed error code
         * @return {(Error|RangeError)} The error
         * @private
         */
        createError(ErrorCtor, message, prefix, statusCode, errorCode) {
          this._loop = false;
          this._errored = true;

          const err = new ErrorCtor(
            prefix ? `Invalid WebSocket frame: ${message}` : message,
          );

          Error.captureStackTrace(err, this.createError);
          err.code = errorCode;
          err[kStatusCode] = statusCode;
          return err;
        }
      }

      module.exports = Receiver;

      /***/
    },

    /***/ 319: /***/ (
      module,
      __unused_webpack_exports,
      __nccwpck_require__,
    ) => {
      "use strict";
      /* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^Duplex" }] */

      const { Duplex } = __nccwpck_require__(203);
      const { randomFillSync } = __nccwpck_require__(982);

      const PerMessageDeflate = __nccwpck_require__(290);
      const { EMPTY_BUFFER, kWebSocket, NOOP } = __nccwpck_require__(89);
      const { isBlob, isValidStatusCode } = __nccwpck_require__(697);
      const { mask: applyMask, toBuffer } = __nccwpck_require__(669);

      const kByteLength = Symbol("kByteLength");
      const maskBuffer = Buffer.alloc(4);
      const RANDOM_POOL_SIZE = 8 * 1024;
      let randomPool;
      let randomPoolPointer = RANDOM_POOL_SIZE;

      const DEFAULT = 0;
      const DEFLATING = 1;
      const GET_BLOB_DATA = 2;

      /**
       * HyBi Sender implementation.
       */
      class Sender {
        /**
         * Creates a Sender instance.
         *
         * @param {Duplex} socket The connection socket
         * @param {Object} [extensions] An object containing the negotiated extensions
         * @param {Function} [generateMask] The function used to generate the masking
         *     key
         */
        constructor(socket, extensions, generateMask) {
          this._extensions = extensions || {};

          if (generateMask) {
            this._generateMask = generateMask;
            this._maskBuffer = Buffer.alloc(4);
          }

          this._socket = socket;

          this._firstFragment = true;
          this._compress = false;

          this._bufferedBytes = 0;
          this._queue = [];
          this._state = DEFAULT;
          this.onerror = NOOP;
          this[kWebSocket] = undefined;
        }

        /**
         * Frames a piece of data according to the HyBi WebSocket protocol.
         *
         * @param {(Buffer|String)} data The data to frame
         * @param {Object} options Options object
         * @param {Boolean} [options.fin=false] Specifies whether or not to set the
         *     FIN bit
         * @param {Function} [options.generateMask] The function used to generate the
         *     masking key
         * @param {Boolean} [options.mask=false] Specifies whether or not to mask
         *     `data`
         * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
         *     key
         * @param {Number} options.opcode The opcode
         * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
         *     modified
         * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
         *     RSV1 bit
         * @return {(Buffer|String)[]} The framed data
         * @public
         */
        static frame(data, options) {
          let mask;
          let merge = false;
          let offset = 2;
          let skipMasking = false;

          if (options.mask) {
            mask = options.maskBuffer || maskBuffer;

            if (options.generateMask) {
              options.generateMask(mask);
            } else {
              if (randomPoolPointer === RANDOM_POOL_SIZE) {
                /* istanbul ignore else  */
                if (randomPool === undefined) {
                  //
                  // This is lazily initialized because server-sent frames must not
                  // be masked so it may never be used.
                  //
                  randomPool = Buffer.alloc(RANDOM_POOL_SIZE);
                }

                randomFillSync(randomPool, 0, RANDOM_POOL_SIZE);
                randomPoolPointer = 0;
              }

              mask[0] = randomPool[randomPoolPointer++];
              mask[1] = randomPool[randomPoolPointer++];
              mask[2] = randomPool[randomPoolPointer++];
              mask[3] = randomPool[randomPoolPointer++];
            }

            skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
            offset = 6;
          }

          let dataLength;

          if (typeof data === "string") {
            if (
              (!options.mask || skipMasking) &&
              options[kByteLength] !== undefined
            ) {
              dataLength = options[kByteLength];
            } else {
              data = Buffer.from(data);
              dataLength = data.length;
            }
          } else {
            dataLength = data.length;
            merge = options.mask && options.readOnly && !skipMasking;
          }

          let payloadLength = dataLength;

          if (dataLength >= 65536) {
            offset += 8;
            payloadLength = 127;
          } else if (dataLength > 125) {
            offset += 2;
            payloadLength = 126;
          }

          const target = Buffer.allocUnsafe(
            merge ? dataLength + offset : offset,
          );

          target[0] = options.fin ? options.opcode | 0x80 : options.opcode;
          if (options.rsv1) target[0] |= 0x40;

          target[1] = payloadLength;

          if (payloadLength === 126) {
            target.writeUInt16BE(dataLength, 2);
          } else if (payloadLength === 127) {
            target[2] = target[3] = 0;
            target.writeUIntBE(dataLength, 4, 6);
          }

          if (!options.mask) return [target, data];

          target[1] |= 0x80;
          target[offset - 4] = mask[0];
          target[offset - 3] = mask[1];
          target[offset - 2] = mask[2];
          target[offset - 1] = mask[3];

          if (skipMasking) return [target, data];

          if (merge) {
            applyMask(data, mask, target, offset, dataLength);
            return [target];
          }

          applyMask(data, mask, data, 0, dataLength);
          return [target, data];
        }

        /**
         * Sends a close message to the other peer.
         *
         * @param {Number} [code] The status code component of the body
         * @param {(String|Buffer)} [data] The message component of the body
         * @param {Boolean} [mask=false] Specifies whether or not to mask the message
         * @param {Function} [cb] Callback
         * @public
         */
        close(code, data, mask, cb) {
          let buf;

          if (code === undefined) {
            buf = EMPTY_BUFFER;
          } else if (typeof code !== "number" || !isValidStatusCode(code)) {
            throw new TypeError(
              "First argument must be a valid error code number",
            );
          } else if (data === undefined || !data.length) {
            buf = Buffer.allocUnsafe(2);
            buf.writeUInt16BE(code, 0);
          } else {
            const length = Buffer.byteLength(data);

            if (length > 123) {
              throw new RangeError(
                "The message must not be greater than 123 bytes",
              );
            }

            buf = Buffer.allocUnsafe(2 + length);
            buf.writeUInt16BE(code, 0);

            if (typeof data === "string") {
              buf.write(data, 2);
            } else {
              buf.set(data, 2);
            }
          }

          const options = {
            [kByteLength]: buf.length,
            fin: true,
            generateMask: this._generateMask,
            mask,
            maskBuffer: this._maskBuffer,
            opcode: 0x08,
            readOnly: false,
            rsv1: false,
          };

          if (this._state !== DEFAULT) {
            this.enqueue([this.dispatch, buf, false, options, cb]);
          } else {
            this.sendFrame(Sender.frame(buf, options), cb);
          }
        }

        /**
         * Sends a ping message to the other peer.
         *
         * @param {*} data The message to send
         * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
         * @param {Function} [cb] Callback
         * @public
         */
        ping(data, mask, cb) {
          let byteLength;
          let readOnly;

          if (typeof data === "string") {
            byteLength = Buffer.byteLength(data);
            readOnly = false;
          } else if (isBlob(data)) {
            byteLength = data.size;
            readOnly = false;
          } else {
            data = toBuffer(data);
            byteLength = data.length;
            readOnly = toBuffer.readOnly;
          }

          if (byteLength > 125) {
            throw new RangeError(
              "The data size must not be greater than 125 bytes",
            );
          }

          const options = {
            [kByteLength]: byteLength,
            fin: true,
            generateMask: this._generateMask,
            mask,
            maskBuffer: this._maskBuffer,
            opcode: 0x09,
            readOnly,
            rsv1: false,
          };

          if (isBlob(data)) {
            if (this._state !== DEFAULT) {
              this.enqueue([this.getBlobData, data, false, options, cb]);
            } else {
              this.getBlobData(data, false, options, cb);
            }
          } else if (this._state !== DEFAULT) {
            this.enqueue([this.dispatch, data, false, options, cb]);
          } else {
            this.sendFrame(Sender.frame(data, options), cb);
          }
        }

        /**
         * Sends a pong message to the other peer.
         *
         * @param {*} data The message to send
         * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
         * @param {Function} [cb] Callback
         * @public
         */
        pong(data, mask, cb) {
          let byteLength;
          let readOnly;

          if (typeof data === "string") {
            byteLength = Buffer.byteLength(data);
            readOnly = false;
          } else if (isBlob(data)) {
            byteLength = data.size;
            readOnly = false;
          } else {
            data = toBuffer(data);
            byteLength = data.length;
            readOnly = toBuffer.readOnly;
          }

          if (byteLength > 125) {
            throw new RangeError(
              "The data size must not be greater than 125 bytes",
            );
          }

          const options = {
            [kByteLength]: byteLength,
            fin: true,
            generateMask: this._generateMask,
            mask,
            maskBuffer: this._maskBuffer,
            opcode: 0x0a,
            readOnly,
            rsv1: false,
          };

          if (isBlob(data)) {
            if (this._state !== DEFAULT) {
              this.enqueue([this.getBlobData, data, false, options, cb]);
            } else {
              this.getBlobData(data, false, options, cb);
            }
          } else if (this._state !== DEFAULT) {
            this.enqueue([this.dispatch, data, false, options, cb]);
          } else {
            this.sendFrame(Sender.frame(data, options), cb);
          }
        }

        /**
         * Sends a data message to the other peer.
         *
         * @param {*} data The message to send
         * @param {Object} options Options object
         * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
         *     or text
         * @param {Boolean} [options.compress=false] Specifies whether or not to
         *     compress `data`
         * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
         *     last one
         * @param {Boolean} [options.mask=false] Specifies whether or not to mask
         *     `data`
         * @param {Function} [cb] Callback
         * @public
         */
        send(data, options, cb) {
          const perMessageDeflate =
            this._extensions[PerMessageDeflate.extensionName];
          let opcode = options.binary ? 2 : 1;
          let rsv1 = options.compress;

          let byteLength;
          let readOnly;

          if (typeof data === "string") {
            byteLength = Buffer.byteLength(data);
            readOnly = false;
          } else if (isBlob(data)) {
            byteLength = data.size;
            readOnly = false;
          } else {
            data = toBuffer(data);
            byteLength = data.length;
            readOnly = toBuffer.readOnly;
          }

          if (this._firstFragment) {
            this._firstFragment = false;
            if (
              rsv1 &&
              perMessageDeflate &&
              perMessageDeflate.params[
                perMessageDeflate._isServer
                  ? "server_no_context_takeover"
                  : "client_no_context_takeover"
              ]
            ) {
              rsv1 = byteLength >= perMessageDeflate._threshold;
            }
            this._compress = rsv1;
          } else {
            rsv1 = false;
            opcode = 0;
          }

          if (options.fin) this._firstFragment = true;

          const opts = {
            [kByteLength]: byteLength,
            fin: options.fin,
            generateMask: this._generateMask,
            mask: options.mask,
            maskBuffer: this._maskBuffer,
            opcode,
            readOnly,
            rsv1,
          };

          if (isBlob(data)) {
            if (this._state !== DEFAULT) {
              this.enqueue([this.getBlobData, data, this._compress, opts, cb]);
            } else {
              this.getBlobData(data, this._compress, opts, cb);
            }
          } else if (this._state !== DEFAULT) {
            this.enqueue([this.dispatch, data, this._compress, opts, cb]);
          } else {
            this.dispatch(data, this._compress, opts, cb);
          }
        }

        /**
         * Gets the contents of a blob as binary data.
         *
         * @param {Blob} blob The blob
         * @param {Boolean} [compress=false] Specifies whether or not to compress
         *     the data
         * @param {Object} options Options object
         * @param {Boolean} [options.fin=false] Specifies whether or not to set the
         *     FIN bit
         * @param {Function} [options.generateMask] The function used to generate the
         *     masking key
         * @param {Boolean} [options.mask=false] Specifies whether or not to mask
         *     `data`
         * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
         *     key
         * @param {Number} options.opcode The opcode
         * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
         *     modified
         * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
         *     RSV1 bit
         * @param {Function} [cb] Callback
         * @private
         */
        getBlobData(blob, compress, options, cb) {
          this._bufferedBytes += options[kByteLength];
          this._state = GET_BLOB_DATA;

          blob
            .arrayBuffer()
            .then((arrayBuffer) => {
              if (this._socket.destroyed) {
                const err = new Error(
                  "The socket was closed while the blob was being read",
                );

                //
                // `callCallbacks` is called in the next tick to ensure that errors
                // that might be thrown in the callbacks behave like errors thrown
                // outside the promise chain.
                //
                process.nextTick(callCallbacks, this, err, cb);
                return;
              }

              this._bufferedBytes -= options[kByteLength];
              const data = toBuffer(arrayBuffer);

              if (!compress) {
                this._state = DEFAULT;
                this.sendFrame(Sender.frame(data, options), cb);
                this.dequeue();
              } else {
                this.dispatch(data, compress, options, cb);
              }
            })
            .catch((err) => {
              //
              // `onError` is called in the next tick for the same reason that
              // `callCallbacks` above is.
              //
              process.nextTick(onError, this, err, cb);
            });
        }

        /**
         * Dispatches a message.
         *
         * @param {(Buffer|String)} data The message to send
         * @param {Boolean} [compress=false] Specifies whether or not to compress
         *     `data`
         * @param {Object} options Options object
         * @param {Boolean} [options.fin=false] Specifies whether or not to set the
         *     FIN bit
         * @param {Function} [options.generateMask] The function used to generate the
         *     masking key
         * @param {Boolean} [options.mask=false] Specifies whether or not to mask
         *     `data`
         * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
         *     key
         * @param {Number} options.opcode The opcode
         * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
         *     modified
         * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
         *     RSV1 bit
         * @param {Function} [cb] Callback
         * @private
         */
        dispatch(data, compress, options, cb) {
          if (!compress) {
            this.sendFrame(Sender.frame(data, options), cb);
            return;
          }

          const perMessageDeflate =
            this._extensions[PerMessageDeflate.extensionName];

          this._bufferedBytes += options[kByteLength];
          this._state = DEFLATING;
          perMessageDeflate.compress(data, options.fin, (_, buf) => {
            if (this._socket.destroyed) {
              const err = new Error(
                "The socket was closed while data was being compressed",
              );

              callCallbacks(this, err, cb);
              return;
            }

            this._bufferedBytes -= options[kByteLength];
            this._state = DEFAULT;
            options.readOnly = false;
            this.sendFrame(Sender.frame(buf, options), cb);
            this.dequeue();
          });
        }

        /**
         * Executes queued send operations.
         *
         * @private
         */
        dequeue() {
          while (this._state === DEFAULT && this._queue.length) {
            const params = this._queue.shift();

            this._bufferedBytes -= params[3][kByteLength];
            Reflect.apply(params[0], this, params.slice(1));
          }
        }

        /**
         * Enqueues a send operation.
         *
         * @param {Array} params Send operation parameters.
         * @private
         */
        enqueue(params) {
          this._bufferedBytes += params[3][kByteLength];
          this._queue.push(params);
        }

        /**
         * Sends a frame.
         *
         * @param {(Buffer | String)[]} list The frame to send
         * @param {Function} [cb] Callback
         * @private
         */
        sendFrame(list, cb) {
          if (list.length === 2) {
            this._socket.cork();
            this._socket.write(list[0]);
            this._socket.write(list[1], cb);
            this._socket.uncork();
          } else {
            this._socket.write(list[0], cb);
          }
        }
      }

      module.exports = Sender;

      /**
       * Calls queued callbacks with an error.
       *
       * @param {Sender} sender The `Sender` instance
       * @param {Error} err The error to call the callbacks with
       * @param {Function} [cb] The first callback
       * @private
       */
      function callCallbacks(sender, err, cb) {
        if (typeof cb === "function") cb(err);

        for (let i = 0; i < sender._queue.length; i++) {
          const params = sender._queue[i];
          const callback = params[params.length - 1];

          if (typeof callback === "function") callback(err);
        }
      }

      /**
       * Handles a `Sender` error.
       *
       * @param {Sender} sender The `Sender` instance
       * @param {Error} err The error
       * @param {Function} [cb] The first pending callback
       * @private
       */
      function onError(sender, err, cb) {
        callCallbacks(sender, err, cb);
        sender.onerror(err);
      }

      /***/
    },

    /***/ 674: /***/ (
      module,
      __unused_webpack_exports,
      __nccwpck_require__,
    ) => {
      "use strict";
      /* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^WebSocket$" }] */

      const WebSocket = __nccwpck_require__(35);
      const { Duplex } = __nccwpck_require__(203);

      /**
       * Emits the `'close'` event on a stream.
       *
       * @param {Duplex} stream The stream.
       * @private
       */
      function emitClose(stream) {
        stream.emit("close");
      }

      /**
       * The listener of the `'end'` event.
       *
       * @private
       */
      function duplexOnEnd() {
        if (!this.destroyed && this._writableState.finished) {
          this.destroy();
        }
      }

      /**
       * The listener of the `'error'` event.
       *
       * @param {Error} err The error
       * @private
       */
      function duplexOnError(err) {
        this.removeListener("error", duplexOnError);
        this.destroy();
        if (this.listenerCount("error") === 0) {
          // Do not suppress the throwing behavior.
          this.emit("error", err);
        }
      }

      /**
       * Wraps a `WebSocket` in a duplex stream.
       *
       * @param {WebSocket} ws The `WebSocket` to wrap
       * @param {Object} [options] The options for the `Duplex` constructor
       * @return {Duplex} The duplex stream
       * @public
       */
      function createWebSocketStream(ws, options) {
        let terminateOnDestroy = true;

        const duplex = new Duplex({
          ...options,
          autoDestroy: false,
          emitClose: false,
          objectMode: false,
          writableObjectMode: false,
        });

        ws.on("message", function message(msg, isBinary) {
          const data =
            !isBinary && duplex._readableState.objectMode
              ? msg.toString()
              : msg;

          if (!duplex.push(data)) ws.pause();
        });

        ws.once("error", function error(err) {
          if (duplex.destroyed) return;

          // Prevent `ws.terminate()` from being called by `duplex._destroy()`.
          //
          // - If the `'error'` event is emitted before the `'open'` event, then
          //   `ws.terminate()` is a noop as no socket is assigned.
          // - Otherwise, the error is re-emitted by the listener of the `'error'`
          //   event of the `Receiver` object. The listener already closes the
          //   connection by calling `ws.close()`. This allows a close frame to be
          //   sent to the other peer. If `ws.terminate()` is called right after this,
          //   then the close frame might not be sent.
          terminateOnDestroy = false;
          duplex.destroy(err);
        });

        ws.once("close", function close() {
          if (duplex.destroyed) return;

          duplex.push(null);
        });

        duplex._destroy = function (err, callback) {
          if (ws.readyState === ws.CLOSED) {
            callback(err);
            process.nextTick(emitClose, duplex);
            return;
          }

          let called = false;

          ws.once("error", function error(err) {
            called = true;
            callback(err);
          });

          ws.once("close", function close() {
            if (!called) callback(err);
            process.nextTick(emitClose, duplex);
          });

          if (terminateOnDestroy) ws.terminate();
        };

        duplex._final = function (callback) {
          if (ws.readyState === ws.CONNECTING) {
            ws.once("open", function open() {
              duplex._final(callback);
            });
            return;
          }

          // If the value of the `_socket` property is `null` it means that `ws` is a
          // client websocket and the handshake failed. In fact, when this happens, a
          // socket is never assigned to the websocket. Wait for the `'error'` event
          // that will be emitted by the websocket.
          if (ws._socket === null) return;

          if (ws._socket._writableState.finished) {
            callback();
            if (duplex._readableState.endEmitted) duplex.destroy();
          } else {
            ws._socket.once("finish", function finish() {
              // `duplex` is not destroyed here because the `'end'` event will be
              // emitted on `duplex` after this `'finish'` event. The EOF signaling
              // `null` chunk is, in fact, pushed when the websocket emits `'close'`.
              callback();
            });
            ws.close();
          }
        };

        duplex._read = function () {
          if (ws.isPaused) ws.resume();
        };

        duplex._write = function (chunk, encoding, callback) {
          if (ws.readyState === ws.CONNECTING) {
            ws.once("open", function open() {
              duplex._write(chunk, encoding, callback);
            });
            return;
          }

          ws.send(chunk, callback);
        };

        duplex.on("end", duplexOnEnd);
        duplex.on("error", duplexOnError);
        return duplex;
      }

      module.exports = createWebSocketStream;

      /***/
    },

    /***/ 242: /***/ (
      module,
      __unused_webpack_exports,
      __nccwpck_require__,
    ) => {
      "use strict";

      const { tokenChars } = __nccwpck_require__(697);

      /**
       * Parses the `Sec-WebSocket-Protocol` header into a set of subprotocol names.
       *
       * @param {String} header The field value of the header
       * @return {Set} The subprotocol names
       * @public
       */
      function parse(header) {
        const protocols = new Set();
        let start = -1;
        let end = -1;
        let i = 0;

        for (i; i < header.length; i++) {
          const code = header.charCodeAt(i);

          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1) start = i;
          } else if (
            i !== 0 &&
            (code === 0x20 /* ' ' */ || code === 0x09) /* '\t' */
          ) {
            if (end === -1 && start !== -1) end = i;
          } else if (code === 0x2c /* ',' */) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }

            if (end === -1) end = i;

            const protocol = header.slice(start, end);

            if (protocols.has(protocol)) {
              throw new SyntaxError(
                `The "${protocol}" subprotocol is duplicated`,
              );
            }

            protocols.add(protocol);
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        }

        if (start === -1 || end !== -1) {
          throw new SyntaxError("Unexpected end of input");
        }

        const protocol = header.slice(start, i);

        if (protocols.has(protocol)) {
          throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
        }

        protocols.add(protocol);
        return protocols;
      }

      module.exports = { parse };

      /***/
    },

    /***/ 697: /***/ (
      module,
      __unused_webpack_exports,
      __nccwpck_require__,
    ) => {
      "use strict";

      const { isUtf8 } = __nccwpck_require__(181);

      const { hasBlob } = __nccwpck_require__(89);

      //
      // Allowed token characters:
      //
      // '!', '#', '$', '%', '&', ''', '*', '+', '-',
      // '.', 0-9, A-Z, '^', '_', '`', a-z, '|', '~'
      //
      // tokenChars[32] === 0 // ' '
      // tokenChars[33] === 1 // '!'
      // tokenChars[34] === 0 // '"'
      // ...
      //
      // prettier-ignore
      const tokenChars = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0 - 15
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 16 - 31
  0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, // 32 - 47
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 48 - 63
  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 64 - 79
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, // 80 - 95
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 96 - 111
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0 // 112 - 127
];

      /**
       * Checks if a status code is allowed in a close frame.
       *
       * @param {Number} code The status code
       * @return {Boolean} `true` if the status code is valid, else `false`
       * @public
       */
      function isValidStatusCode(code) {
        return (
          (code >= 1000 &&
            code <= 1014 &&
            code !== 1004 &&
            code !== 1005 &&
            code !== 1006) ||
          (code >= 3000 && code <= 4999)
        );
      }

      /**
       * Checks if a given buffer contains only correct UTF-8.
       * Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by
       * Markus Kuhn.
       *
       * @param {Buffer} buf The buffer to check
       * @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`
       * @public
       */
      function _isValidUTF8(buf) {
        const len = buf.length;
        let i = 0;

        while (i < len) {
          if ((buf[i] & 0x80) === 0) {
            // 0xxxxxxx
            i++;
          } else if ((buf[i] & 0xe0) === 0xc0) {
            // 110xxxxx 10xxxxxx
            if (
              i + 1 === len ||
              (buf[i + 1] & 0xc0) !== 0x80 ||
              (buf[i] & 0xfe) === 0xc0 // Overlong
            ) {
              return false;
            }

            i += 2;
          } else if ((buf[i] & 0xf0) === 0xe0) {
            // 1110xxxx 10xxxxxx 10xxxxxx
            if (
              i + 2 >= len ||
              (buf[i + 1] & 0xc0) !== 0x80 ||
              (buf[i + 2] & 0xc0) !== 0x80 ||
              (buf[i] === 0xe0 && (buf[i + 1] & 0xe0) === 0x80) || // Overlong
              (buf[i] === 0xed && (buf[i + 1] & 0xe0) === 0xa0) // Surrogate (U+D800 - U+DFFF)
            ) {
              return false;
            }

            i += 3;
          } else if ((buf[i] & 0xf8) === 0xf0) {
            // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
            if (
              i + 3 >= len ||
              (buf[i + 1] & 0xc0) !== 0x80 ||
              (buf[i + 2] & 0xc0) !== 0x80 ||
              (buf[i + 3] & 0xc0) !== 0x80 ||
              (buf[i] === 0xf0 && (buf[i + 1] & 0xf0) === 0x80) || // Overlong
              (buf[i] === 0xf4 && buf[i + 1] > 0x8f) ||
              buf[i] > 0xf4 // > U+10FFFF
            ) {
              return false;
            }

            i += 4;
          } else {
            return false;
          }
        }

        return true;
      }

      /**
       * Determines whether a value is a `Blob`.
       *
       * @param {*} value The value to be tested
       * @return {Boolean} `true` if `value` is a `Blob`, else `false`
       * @private
       */
      function isBlob(value) {
        return (
          hasBlob &&
          typeof value === "object" &&
          typeof value.arrayBuffer === "function" &&
          typeof value.type === "string" &&
          typeof value.stream === "function" &&
          (value[Symbol.toStringTag] === "Blob" ||
            value[Symbol.toStringTag] === "File")
        );
      }

      module.exports = {
        isBlob,
        isValidStatusCode,
        isValidUTF8: _isValidUTF8,
        tokenChars,
      };

      if (isUtf8) {
        module.exports.isValidUTF8 = function (buf) {
          return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
        };
      } /* istanbul ignore else  */ else if (
        !process.env.WS_NO_UTF_8_VALIDATE
      ) {
        try {
          const isValidUTF8 = __nccwpck_require__(348);

          module.exports.isValidUTF8 = function (buf) {
            return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8(buf);
          };
        } catch (e) {
          // Continue regardless of the error.
        }
      }

      /***/
    },

    /***/ 95: /***/ (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      /* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^Duplex$", "caughtErrors": "none" }] */

      const EventEmitter = __nccwpck_require__(434);
      const http = __nccwpck_require__(611);
      const { Duplex } = __nccwpck_require__(203);
      const { createHash } = __nccwpck_require__(982);

      const extension = __nccwpck_require__(729);
      const PerMessageDeflate = __nccwpck_require__(290);
      const subprotocol = __nccwpck_require__(242);
      const WebSocket = __nccwpck_require__(35);
      const { CLOSE_TIMEOUT, GUID, kWebSocket } = __nccwpck_require__(89);

      const keyRegex = /^[+/0-9A-Za-z]{22}==$/;

      const RUNNING = 0;
      const CLOSING = 1;
      const CLOSED = 2;

      /**
       * Class representing a WebSocket server.
       *
       * @extends EventEmitter
       */
      class WebSocketServer extends EventEmitter {
        /**
         * Create a `WebSocketServer` instance.
         *
         * @param {Object} options Configuration options
         * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
         *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
         *     multiple times in the same tick
         * @param {Boolean} [options.autoPong=true] Specifies whether or not to
         *     automatically send a pong in response to a ping
         * @param {Number} [options.backlog=511] The maximum length of the queue of
         *     pending connections
         * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
         *     track clients
         * @param {Number} [options.closeTimeout=30000] Duration in milliseconds to
         *     wait for the closing handshake to finish after `websocket.close()` is
         *     called
         * @param {Function} [options.handleProtocols] A hook to handle protocols
         * @param {String} [options.host] The hostname where to bind the server
         * @param {Number} [options.maxPayload=104857600] The maximum allowed message
         *     size
         * @param {Boolean} [options.noServer=false] Enable no server mode
         * @param {String} [options.path] Accept only connections matching this path
         * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
         *     permessage-deflate
         * @param {Number} [options.port] The port where to bind the server
         * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
         *     server to use
         * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
         *     not to skip UTF-8 validation for text and close messages
         * @param {Function} [options.verifyClient] A hook to reject connections
         * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
         *     class to use. It must be the `WebSocket` class or class that extends it
         * @param {Function} [callback] A listener for the `listening` event
         */
        constructor(options, callback) {
          super();

          options = {
            allowSynchronousEvents: true,
            autoPong: true,
            maxPayload: 100 * 1024 * 1024,
            skipUTF8Validation: false,
            perMessageDeflate: false,
            handleProtocols: null,
            clientTracking: true,
            closeTimeout: CLOSE_TIMEOUT,
            verifyClient: null,
            noServer: false,
            backlog: null, // use default (511 as implemented in net.js)
            server: null,
            host: null,
            path: null,
            port: null,
            WebSocket,
            ...options,
          };

          if (
            (options.port == null && !options.server && !options.noServer) ||
            (options.port != null && (options.server || options.noServer)) ||
            (options.server && options.noServer)
          ) {
            throw new TypeError(
              'One and only one of the "port", "server", or "noServer" options ' +
                "must be specified",
            );
          }

          if (options.port != null) {
            this._server = http.createServer((req, res) => {
              const body = http.STATUS_CODES[426];

              res.writeHead(426, {
                "Content-Length": body.length,
                "Content-Type": "text/plain",
              });
              res.end(body);
            });
            this._server.listen(
              options.port,
              options.host,
              options.backlog,
              callback,
            );
          } else if (options.server) {
            this._server = options.server;
          }

          if (this._server) {
            const emitConnection = this.emit.bind(this, "connection");

            this._removeListeners = addListeners(this._server, {
              listening: this.emit.bind(this, "listening"),
              error: this.emit.bind(this, "error"),
              upgrade: (req, socket, head) => {
                this.handleUpgrade(req, socket, head, emitConnection);
              },
            });
          }

          if (options.perMessageDeflate === true)
            options.perMessageDeflate = {};
          if (options.clientTracking) {
            this.clients = new Set();
            this._shouldEmitClose = false;
          }

          this.options = options;
          this._state = RUNNING;
        }

        /**
         * Returns the bound address, the address family name, and port of the server
         * as reported by the operating system if listening on an IP socket.
         * If the server is listening on a pipe or UNIX domain socket, the name is
         * returned as a string.
         *
         * @return {(Object|String|null)} The address of the server
         * @public
         */
        address() {
          if (this.options.noServer) {
            throw new Error('The server is operating in "noServer" mode');
          }

          if (!this._server) return null;
          return this._server.address();
        }

        /**
         * Stop the server from accepting new connections and emit the `'close'` event
         * when all existing connections are closed.
         *
         * @param {Function} [cb] A one-time listener for the `'close'` event
         * @public
         */
        close(cb) {
          if (this._state === CLOSED) {
            if (cb) {
              this.once("close", () => {
                cb(new Error("The server is not running"));
              });
            }

            process.nextTick(emitClose, this);
            return;
          }

          if (cb) this.once("close", cb);

          if (this._state === CLOSING) return;
          this._state = CLOSING;

          if (this.options.noServer || this.options.server) {
            if (this._server) {
              this._removeListeners();
              this._removeListeners = this._server = null;
            }

            if (this.clients) {
              if (!this.clients.size) {
                process.nextTick(emitClose, this);
              } else {
                this._shouldEmitClose = true;
              }
            } else {
              process.nextTick(emitClose, this);
            }
          } else {
            const server = this._server;

            this._removeListeners();
            this._removeListeners = this._server = null;

            //
            // The HTTP/S server was created internally. Close it, and rely on its
            // `'close'` event.
            //
            server.close(() => {
              emitClose(this);
            });
          }
        }

        /**
         * See if a given request should be handled by this server instance.
         *
         * @param {http.IncomingMessage} req Request object to inspect
         * @return {Boolean} `true` if the request is valid, else `false`
         * @public
         */
        shouldHandle(req) {
          if (this.options.path) {
            const index = req.url.indexOf("?");
            const pathname = index !== -1 ? req.url.slice(0, index) : req.url;

            if (pathname !== this.options.path) return false;
          }

          return true;
        }

        /**
         * Handle a HTTP Upgrade request.
         *
         * @param {http.IncomingMessage} req The request object
         * @param {Duplex} socket The network socket between the server and client
         * @param {Buffer} head The first packet of the upgraded stream
         * @param {Function} cb Callback
         * @public
         */
        handleUpgrade(req, socket, head, cb) {
          socket.on("error", socketOnError);

          const key = req.headers["sec-websocket-key"];
          const upgrade = req.headers.upgrade;
          const version = +req.headers["sec-websocket-version"];

          if (req.method !== "GET") {
            const message = "Invalid HTTP method";
            abortHandshakeOrEmitwsClientError(this, req, socket, 405, message);
            return;
          }

          if (upgrade === undefined || upgrade.toLowerCase() !== "websocket") {
            const message = "Invalid Upgrade header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }

          if (key === undefined || !keyRegex.test(key)) {
            const message = "Missing or invalid Sec-WebSocket-Key header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }

          if (version !== 13 && version !== 8) {
            const message = "Missing or invalid Sec-WebSocket-Version header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message, {
              "Sec-WebSocket-Version": "13, 8",
            });
            return;
          }

          if (!this.shouldHandle(req)) {
            abortHandshake(socket, 400);
            return;
          }

          const secWebSocketProtocol = req.headers["sec-websocket-protocol"];
          let protocols = new Set();

          if (secWebSocketProtocol !== undefined) {
            try {
              protocols = subprotocol.parse(secWebSocketProtocol);
            } catch (err) {
              const message = "Invalid Sec-WebSocket-Protocol header";
              abortHandshakeOrEmitwsClientError(
                this,
                req,
                socket,
                400,
                message,
              );
              return;
            }
          }

          const secWebSocketExtensions =
            req.headers["sec-websocket-extensions"];
          const extensions = {};

          if (
            this.options.perMessageDeflate &&
            secWebSocketExtensions !== undefined
          ) {
            const perMessageDeflate = new PerMessageDeflate(
              this.options.perMessageDeflate,
              true,
              this.options.maxPayload,
            );

            try {
              const offers = extension.parse(secWebSocketExtensions);

              if (offers[PerMessageDeflate.extensionName]) {
                perMessageDeflate.accept(
                  offers[PerMessageDeflate.extensionName],
                );
                extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
              }
            } catch (err) {
              const message =
                "Invalid or unacceptable Sec-WebSocket-Extensions header";
              abortHandshakeOrEmitwsClientError(
                this,
                req,
                socket,
                400,
                message,
              );
              return;
            }
          }

          //
          // Optionally call external client verification handler.
          //
          if (this.options.verifyClient) {
            const info = {
              origin:
                req.headers[
                  `${version === 8 ? "sec-websocket-origin" : "origin"}`
                ],
              secure: !!(req.socket.authorized || req.socket.encrypted),
              req,
            };

            if (this.options.verifyClient.length === 2) {
              this.options.verifyClient(
                info,
                (verified, code, message, headers) => {
                  if (!verified) {
                    return abortHandshake(
                      socket,
                      code || 401,
                      message,
                      headers,
                    );
                  }

                  this.completeUpgrade(
                    extensions,
                    key,
                    protocols,
                    req,
                    socket,
                    head,
                    cb,
                  );
                },
              );
              return;
            }

            if (!this.options.verifyClient(info))
              return abortHandshake(socket, 401);
          }

          this.completeUpgrade(
            extensions,
            key,
            protocols,
            req,
            socket,
            head,
            cb,
          );
        }

        /**
         * Upgrade the connection to WebSocket.
         *
         * @param {Object} extensions The accepted extensions
         * @param {String} key The value of the `Sec-WebSocket-Key` header
         * @param {Set} protocols The subprotocols
         * @param {http.IncomingMessage} req The request object
         * @param {Duplex} socket The network socket between the server and client
         * @param {Buffer} head The first packet of the upgraded stream
         * @param {Function} cb Callback
         * @throws {Error} If called more than once with the same socket
         * @private
         */
        completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
          //
          // Destroy the socket if the client has already sent a FIN packet.
          //
          if (!socket.readable || !socket.writable) return socket.destroy();

          if (socket[kWebSocket]) {
            throw new Error(
              "server.handleUpgrade() was called more than once with the same " +
                "socket, possibly due to a misconfiguration",
            );
          }

          if (this._state > RUNNING) return abortHandshake(socket, 503);

          const digest = createHash("sha1")
            .update(key + GUID)
            .digest("base64");

          const headers = [
            "HTTP/1.1 101 Switching Protocols",
            "Upgrade: websocket",
            "Connection: Upgrade",
            `Sec-WebSocket-Accept: ${digest}`,
          ];

          const ws = new this.options.WebSocket(null, undefined, this.options);

          if (protocols.size) {
            //
            // Optionally call external protocol selection handler.
            //
            const protocol = this.options.handleProtocols
              ? this.options.handleProtocols(protocols, req)
              : protocols.values().next().value;

            if (protocol) {
              headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
              ws._protocol = protocol;
            }
          }

          if (extensions[PerMessageDeflate.extensionName]) {
            const params = extensions[PerMessageDeflate.extensionName].params;
            const value = extension.format({
              [PerMessageDeflate.extensionName]: [params],
            });
            headers.push(`Sec-WebSocket-Extensions: ${value}`);
            ws._extensions = extensions;
          }

          //
          // Allow external modification/inspection of handshake headers.
          //
          this.emit("headers", headers, req);

          socket.write(headers.concat("\r\n").join("\r\n"));
          socket.removeListener("error", socketOnError);

          ws.setSocket(socket, head, {
            allowSynchronousEvents: this.options.allowSynchronousEvents,
            maxPayload: this.options.maxPayload,
            skipUTF8Validation: this.options.skipUTF8Validation,
          });

          if (this.clients) {
            this.clients.add(ws);
            ws.on("close", () => {
              this.clients.delete(ws);

              if (this._shouldEmitClose && !this.clients.size) {
                process.nextTick(emitClose, this);
              }
            });
          }

          cb(ws, req);
        }
      }

      module.exports = WebSocketServer;

      /**
       * Add event listeners on an `EventEmitter` using a map of <event, listener>
       * pairs.
       *
       * @param {EventEmitter} server The event emitter
       * @param {Object.<String, Function>} map The listeners to add
       * @return {Function} A function that will remove the added listeners when
       *     called
       * @private
       */
      function addListeners(server, map) {
        for (const event of Object.keys(map)) server.on(event, map[event]);

        return function removeListeners() {
          for (const event of Object.keys(map)) {
            server.removeListener(event, map[event]);
          }
        };
      }

      /**
       * Emit a `'close'` event on an `EventEmitter`.
       *
       * @param {EventEmitter} server The event emitter
       * @private
       */
      function emitClose(server) {
        server._state = CLOSED;
        server.emit("close");
      }

      /**
       * Handle socket errors.
       *
       * @private
       */
      function socketOnError() {
        this.destroy();
      }

      /**
       * Close the connection when preconditions are not fulfilled.
       *
       * @param {Duplex} socket The socket of the upgrade request
       * @param {Number} code The HTTP response status code
       * @param {String} [message] The HTTP response body
       * @param {Object} [headers] Additional HTTP response headers
       * @private
       */
      function abortHandshake(socket, code, message, headers) {
        //
        // The socket is writable unless the user destroyed or ended it before calling
        // `server.handleUpgrade()` or in the `verifyClient` function, which is a user
        // error. Handling this does not make much sense as the worst that can happen
        // is that some of the data written by the user might be discarded due to the
        // call to `socket.end()` below, which triggers an `'error'` event that in
        // turn causes the socket to be destroyed.
        //
        message = message || http.STATUS_CODES[code];
        headers = {
          Connection: "close",
          "Content-Type": "text/html",
          "Content-Length": Buffer.byteLength(message),
          ...headers,
        };

        socket.once("finish", socket.destroy);

        socket.end(
          `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r\n` +
            Object.keys(headers)
              .map((h) => `${h}: ${headers[h]}`)
              .join("\r\n") +
            "\r\n\r\n" +
            message,
        );
      }

      /**
       * Emit a `'wsClientError'` event on a `WebSocketServer` if there is at least
       * one listener for it, otherwise call `abortHandshake()`.
       *
       * @param {WebSocketServer} server The WebSocket server
       * @param {http.IncomingMessage} req The request object
       * @param {Duplex} socket The socket of the upgrade request
       * @param {Number} code The HTTP response status code
       * @param {String} message The HTTP response body
       * @param {Object} [headers] The HTTP response headers
       * @private
       */
      function abortHandshakeOrEmitwsClientError(
        server,
        req,
        socket,
        code,
        message,
        headers,
      ) {
        if (server.listenerCount("wsClientError")) {
          const err = new Error(message);
          Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);

          server.emit("wsClientError", err, socket, req);
        } else {
          abortHandshake(socket, code, message, headers);
        }
      }

      /***/
    },

    /***/ 35: /***/ (module, __unused_webpack_exports, __nccwpck_require__) => {
      "use strict";
      /* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^Duplex|Readable$", "caughtErrors": "none" }] */

      const EventEmitter = __nccwpck_require__(434);
      const https = __nccwpck_require__(692);
      const http = __nccwpck_require__(611);
      const net = __nccwpck_require__(278);
      const tls = __nccwpck_require__(756);
      const { randomBytes, createHash } = __nccwpck_require__(982);
      const { Duplex, Readable } = __nccwpck_require__(203);
      const { URL } = __nccwpck_require__(16);

      const PerMessageDeflate = __nccwpck_require__(290);
      const Receiver = __nccwpck_require__(131);
      const Sender = __nccwpck_require__(319);
      const { isBlob } = __nccwpck_require__(697);

      const {
        BINARY_TYPES,
        CLOSE_TIMEOUT,
        EMPTY_BUFFER,
        GUID,
        kForOnEventAttribute,
        kListener,
        kStatusCode,
        kWebSocket,
        NOOP,
      } = __nccwpck_require__(89);
      const {
        EventTarget: { addEventListener, removeEventListener },
      } = __nccwpck_require__(936);
      const { format, parse } = __nccwpck_require__(729);
      const { toBuffer } = __nccwpck_require__(669);

      const kAborted = Symbol("kAborted");
      const protocolVersions = [8, 13];
      const readyStates = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
      const subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;

      /**
       * Class representing a WebSocket.
       *
       * @extends EventEmitter
       */
      class WebSocket extends EventEmitter {
        /**
         * Create a new `WebSocket`.
         *
         * @param {(String|URL)} address The URL to which to connect
         * @param {(String|String[])} [protocols] The subprotocols
         * @param {Object} [options] Connection options
         */
        constructor(address, protocols, options) {
          super();

          this._binaryType = BINARY_TYPES[0];
          this._closeCode = 1006;
          this._closeFrameReceived = false;
          this._closeFrameSent = false;
          this._closeMessage = EMPTY_BUFFER;
          this._closeTimer = null;
          this._errorEmitted = false;
          this._extensions = {};
          this._paused = false;
          this._protocol = "";
          this._readyState = WebSocket.CONNECTING;
          this._receiver = null;
          this._sender = null;
          this._socket = null;

          if (address !== null) {
            this._bufferedAmount = 0;
            this._isServer = false;
            this._redirects = 0;

            if (protocols === undefined) {
              protocols = [];
            } else if (!Array.isArray(protocols)) {
              if (typeof protocols === "object" && protocols !== null) {
                options = protocols;
                protocols = [];
              } else {
                protocols = [protocols];
              }
            }

            initAsClient(this, address, protocols, options);
          } else {
            this._autoPong = options.autoPong;
            this._closeTimeout = options.closeTimeout;
            this._isServer = true;
          }
        }

        /**
         * For historical reasons, the custom "nodebuffer" type is used by the default
         * instead of "blob".
         *
         * @type {String}
         */
        get binaryType() {
          return this._binaryType;
        }

        set binaryType(type) {
          if (!BINARY_TYPES.includes(type)) return;

          this._binaryType = type;

          //
          // Allow to change `binaryType` on the fly.
          //
          if (this._receiver) this._receiver._binaryType = type;
        }

        /**
         * @type {Number}
         */
        get bufferedAmount() {
          if (!this._socket) return this._bufferedAmount;

          return (
            this._socket._writableState.length + this._sender._bufferedBytes
          );
        }

        /**
         * @type {String}
         */
        get extensions() {
          return Object.keys(this._extensions).join();
        }

        /**
         * @type {Boolean}
         */
        get isPaused() {
          return this._paused;
        }

        /**
         * @type {Function}
         */
        /* istanbul ignore next */
        get onclose() {
          return null;
        }

        /**
         * @type {Function}
         */
        /* istanbul ignore next */
        get onerror() {
          return null;
        }

        /**
         * @type {Function}
         */
        /* istanbul ignore next */
        get onopen() {
          return null;
        }

        /**
         * @type {Function}
         */
        /* istanbul ignore next */
        get onmessage() {
          return null;
        }

        /**
         * @type {String}
         */
        get protocol() {
          return this._protocol;
        }

        /**
         * @type {Number}
         */
        get readyState() {
          return this._readyState;
        }

        /**
         * @type {String}
         */
        get url() {
          return this._url;
        }

        /**
         * Set up the socket and the internal resources.
         *
         * @param {Duplex} socket The network socket between the server and client
         * @param {Buffer} head The first packet of the upgraded stream
         * @param {Object} options Options object
         * @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
         *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
         *     multiple times in the same tick
         * @param {Function} [options.generateMask] The function used to generate the
         *     masking key
         * @param {Number} [options.maxPayload=0] The maximum allowed message size
         * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
         *     not to skip UTF-8 validation for text and close messages
         * @private
         */
        setSocket(socket, head, options) {
          const receiver = new Receiver({
            allowSynchronousEvents: options.allowSynchronousEvents,
            binaryType: this.binaryType,
            extensions: this._extensions,
            isServer: this._isServer,
            maxPayload: options.maxPayload,
            skipUTF8Validation: options.skipUTF8Validation,
          });

          const sender = new Sender(
            socket,
            this._extensions,
            options.generateMask,
          );

          this._receiver = receiver;
          this._sender = sender;
          this._socket = socket;

          receiver[kWebSocket] = this;
          sender[kWebSocket] = this;
          socket[kWebSocket] = this;

          receiver.on("conclude", receiverOnConclude);
          receiver.on("drain", receiverOnDrain);
          receiver.on("error", receiverOnError);
          receiver.on("message", receiverOnMessage);
          receiver.on("ping", receiverOnPing);
          receiver.on("pong", receiverOnPong);

          sender.onerror = senderOnError;

          //
          // These methods may not be available if `socket` is just a `Duplex`.
          //
          if (socket.setTimeout) socket.setTimeout(0);
          if (socket.setNoDelay) socket.setNoDelay();

          if (head.length > 0) socket.unshift(head);

          socket.on("close", socketOnClose);
          socket.on("data", socketOnData);
          socket.on("end", socketOnEnd);
          socket.on("error", socketOnError);

          this._readyState = WebSocket.OPEN;
          this.emit("open");
        }

        /**
         * Emit the `'close'` event.
         *
         * @private
         */
        emitClose() {
          if (!this._socket) {
            this._readyState = WebSocket.CLOSED;
            this.emit("close", this._closeCode, this._closeMessage);
            return;
          }

          if (this._extensions[PerMessageDeflate.extensionName]) {
            this._extensions[PerMessageDeflate.extensionName].cleanup();
          }

          this._receiver.removeAllListeners();
          this._readyState = WebSocket.CLOSED;
          this.emit("close", this._closeCode, this._closeMessage);
        }

        /**
         * Start a closing handshake.
         *
         *          +----------+   +-----------+   +----------+
         *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
         *    |     +----------+   +-----------+   +----------+     |
         *          +----------+   +-----------+         |
         * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
         *          +----------+   +-----------+   |
         *    |           |                        |   +---+        |
         *                +------------------------+-->|fin| - - - -
         *    |         +---+                      |   +---+
         *     - - - - -|fin|<---------------------+
         *              +---+
         *
         * @param {Number} [code] Status code explaining why the connection is closing
         * @param {(String|Buffer)} [data] The reason why the connection is
         *     closing
         * @public
         */
        close(code, data) {
          if (this.readyState === WebSocket.CLOSED) return;
          if (this.readyState === WebSocket.CONNECTING) {
            const msg =
              "WebSocket was closed before the connection was established";
            abortHandshake(this, this._req, msg);
            return;
          }

          if (this.readyState === WebSocket.CLOSING) {
            if (
              this._closeFrameSent &&
              (this._closeFrameReceived ||
                this._receiver._writableState.errorEmitted)
            ) {
              this._socket.end();
            }

            return;
          }

          this._readyState = WebSocket.CLOSING;
          this._sender.close(code, data, !this._isServer, (err) => {
            //
            // This error is handled by the `'error'` listener on the socket. We only
            // want to know if the close frame has been sent here.
            //
            if (err) return;

            this._closeFrameSent = true;

            if (
              this._closeFrameReceived ||
              this._receiver._writableState.errorEmitted
            ) {
              this._socket.end();
            }
          });

          setCloseTimer(this);
        }

        /**
         * Pause the socket.
         *
         * @public
         */
        pause() {
          if (
            this.readyState === WebSocket.CONNECTING ||
            this.readyState === WebSocket.CLOSED
          ) {
            return;
          }

          this._paused = true;
          this._socket.pause();
        }

        /**
         * Send a ping.
         *
         * @param {*} [data] The data to send
         * @param {Boolean} [mask] Indicates whether or not to mask `data`
         * @param {Function} [cb] Callback which is executed when the ping is sent
         * @public
         */
        ping(data, mask, cb) {
          if (this.readyState === WebSocket.CONNECTING) {
            throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
          }

          if (typeof data === "function") {
            cb = data;
            data = mask = undefined;
          } else if (typeof mask === "function") {
            cb = mask;
            mask = undefined;
          }

          if (typeof data === "number") data = data.toString();

          if (this.readyState !== WebSocket.OPEN) {
            sendAfterClose(this, data, cb);
            return;
          }

          if (mask === undefined) mask = !this._isServer;
          this._sender.ping(data || EMPTY_BUFFER, mask, cb);
        }

        /**
         * Send a pong.
         *
         * @param {*} [data] The data to send
         * @param {Boolean} [mask] Indicates whether or not to mask `data`
         * @param {Function} [cb] Callback which is executed when the pong is sent
         * @public
         */
        pong(data, mask, cb) {
          if (this.readyState === WebSocket.CONNECTING) {
            throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
          }

          if (typeof data === "function") {
            cb = data;
            data = mask = undefined;
          } else if (typeof mask === "function") {
            cb = mask;
            mask = undefined;
          }

          if (typeof data === "number") data = data.toString();

          if (this.readyState !== WebSocket.OPEN) {
            sendAfterClose(this, data, cb);
            return;
          }

          if (mask === undefined) mask = !this._isServer;
          this._sender.pong(data || EMPTY_BUFFER, mask, cb);
        }

        /**
         * Resume the socket.
         *
         * @public
         */
        resume() {
          if (
            this.readyState === WebSocket.CONNECTING ||
            this.readyState === WebSocket.CLOSED
          ) {
            return;
          }

          this._paused = false;
          if (!this._receiver._writableState.needDrain) this._socket.resume();
        }

        /**
         * Send a data message.
         *
         * @param {*} data The message to send
         * @param {Object} [options] Options object
         * @param {Boolean} [options.binary] Specifies whether `data` is binary or
         *     text
         * @param {Boolean} [options.compress] Specifies whether or not to compress
         *     `data`
         * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
         *     last one
         * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
         * @param {Function} [cb] Callback which is executed when data is written out
         * @public
         */
        send(data, options, cb) {
          if (this.readyState === WebSocket.CONNECTING) {
            throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
          }

          if (typeof options === "function") {
            cb = options;
            options = {};
          }

          if (typeof data === "number") data = data.toString();

          if (this.readyState !== WebSocket.OPEN) {
            sendAfterClose(this, data, cb);
            return;
          }

          const opts = {
            binary: typeof data !== "string",
            mask: !this._isServer,
            compress: true,
            fin: true,
            ...options,
          };

          if (!this._extensions[PerMessageDeflate.extensionName]) {
            opts.compress = false;
          }

          this._sender.send(data || EMPTY_BUFFER, opts, cb);
        }

        /**
         * Forcibly close the connection.
         *
         * @public
         */
        terminate() {
          if (this.readyState === WebSocket.CLOSED) return;
          if (this.readyState === WebSocket.CONNECTING) {
            const msg =
              "WebSocket was closed before the connection was established";
            abortHandshake(this, this._req, msg);
            return;
          }

          if (this._socket) {
            this._readyState = WebSocket.CLOSING;
            this._socket.destroy();
          }
        }
      }

      /**
       * @constant {Number} CONNECTING
       * @memberof WebSocket
       */
      Object.defineProperty(WebSocket, "CONNECTING", {
        enumerable: true,
        value: readyStates.indexOf("CONNECTING"),
      });

      /**
       * @constant {Number} CONNECTING
       * @memberof WebSocket.prototype
       */
      Object.defineProperty(WebSocket.prototype, "CONNECTING", {
        enumerable: true,
        value: readyStates.indexOf("CONNECTING"),
      });

      /**
       * @constant {Number} OPEN
       * @memberof WebSocket
       */
      Object.defineProperty(WebSocket, "OPEN", {
        enumerable: true,
        value: readyStates.indexOf("OPEN"),
      });

      /**
       * @constant {Number} OPEN
       * @memberof WebSocket.prototype
       */
      Object.defineProperty(WebSocket.prototype, "OPEN", {
        enumerable: true,
        value: readyStates.indexOf("OPEN"),
      });

      /**
       * @constant {Number} CLOSING
       * @memberof WebSocket
       */
      Object.defineProperty(WebSocket, "CLOSING", {
        enumerable: true,
        value: readyStates.indexOf("CLOSING"),
      });

      /**
       * @constant {Number} CLOSING
       * @memberof WebSocket.prototype
       */
      Object.defineProperty(WebSocket.prototype, "CLOSING", {
        enumerable: true,
        value: readyStates.indexOf("CLOSING"),
      });

      /**
       * @constant {Number} CLOSED
       * @memberof WebSocket
       */
      Object.defineProperty(WebSocket, "CLOSED", {
        enumerable: true,
        value: readyStates.indexOf("CLOSED"),
      });

      /**
       * @constant {Number} CLOSED
       * @memberof WebSocket.prototype
       */
      Object.defineProperty(WebSocket.prototype, "CLOSED", {
        enumerable: true,
        value: readyStates.indexOf("CLOSED"),
      });

      [
        "binaryType",
        "bufferedAmount",
        "extensions",
        "isPaused",
        "protocol",
        "readyState",
        "url",
      ].forEach((property) => {
        Object.defineProperty(WebSocket.prototype, property, {
          enumerable: true,
        });
      });

      //
      // Add the `onopen`, `onerror`, `onclose`, and `onmessage` attributes.
      // See https://html.spec.whatwg.org/multipage/comms.html#the-websocket-interface
      //
      ["open", "error", "close", "message"].forEach((method) => {
        Object.defineProperty(WebSocket.prototype, `on${method}`, {
          enumerable: true,
          get() {
            for (const listener of this.listeners(method)) {
              if (listener[kForOnEventAttribute]) return listener[kListener];
            }

            return null;
          },
          set(handler) {
            for (const listener of this.listeners(method)) {
              if (listener[kForOnEventAttribute]) {
                this.removeListener(method, listener);
                break;
              }
            }

            if (typeof handler !== "function") return;

            this.addEventListener(method, handler, {
              [kForOnEventAttribute]: true,
            });
          },
        });
      });

      WebSocket.prototype.addEventListener = addEventListener;
      WebSocket.prototype.removeEventListener = removeEventListener;

      module.exports = WebSocket;

      /**
       * Initialize a WebSocket client.
       *
       * @param {WebSocket} websocket The client to initialize
       * @param {(String|URL)} address The URL to which to connect
       * @param {Array} protocols The subprotocols
       * @param {Object} [options] Connection options
       * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether any
       *     of the `'message'`, `'ping'`, and `'pong'` events can be emitted multiple
       *     times in the same tick
       * @param {Boolean} [options.autoPong=true] Specifies whether or not to
       *     automatically send a pong in response to a ping
       * @param {Number} [options.closeTimeout=30000] Duration in milliseconds to wait
       *     for the closing handshake to finish after `websocket.close()` is called
       * @param {Function} [options.finishRequest] A function which can be used to
       *     customize the headers of each http request before it is sent
       * @param {Boolean} [options.followRedirects=false] Whether or not to follow
       *     redirects
       * @param {Function} [options.generateMask] The function used to generate the
       *     masking key
       * @param {Number} [options.handshakeTimeout] Timeout in milliseconds for the
       *     handshake request
       * @param {Number} [options.maxPayload=104857600] The maximum allowed message
       *     size
       * @param {Number} [options.maxRedirects=10] The maximum number of redirects
       *     allowed
       * @param {String} [options.origin] Value of the `Origin` or
       *     `Sec-WebSocket-Origin` header
       * @param {(Boolean|Object)} [options.perMessageDeflate=true] Enable/disable
       *     permessage-deflate
       * @param {Number} [options.protocolVersion=13] Value of the
       *     `Sec-WebSocket-Version` header
       * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
       *     not to skip UTF-8 validation for text and close messages
       * @private
       */
      function initAsClient(websocket, address, protocols, options) {
        const opts = {
          allowSynchronousEvents: true,
          autoPong: true,
          closeTimeout: CLOSE_TIMEOUT,
          protocolVersion: protocolVersions[1],
          maxPayload: 100 * 1024 * 1024,
          skipUTF8Validation: false,
          perMessageDeflate: true,
          followRedirects: false,
          maxRedirects: 10,
          ...options,
          socketPath: undefined,
          hostname: undefined,
          protocol: undefined,
          timeout: undefined,
          method: "GET",
          host: undefined,
          path: undefined,
          port: undefined,
        };

        websocket._autoPong = opts.autoPong;
        websocket._closeTimeout = opts.closeTimeout;

        if (!protocolVersions.includes(opts.protocolVersion)) {
          throw new RangeError(
            `Unsupported protocol version: ${opts.protocolVersion} ` +
              `(supported versions: ${protocolVersions.join(", ")})`,
          );
        }

        let parsedUrl;

        if (address instanceof URL) {
          parsedUrl = address;
        } else {
          try {
            parsedUrl = new URL(address);
          } catch (e) {
            throw new SyntaxError(`Invalid URL: ${address}`);
          }
        }

        if (parsedUrl.protocol === "http:") {
          parsedUrl.protocol = "ws:";
        } else if (parsedUrl.protocol === "https:") {
          parsedUrl.protocol = "wss:";
        }

        websocket._url = parsedUrl.href;

        const isSecure = parsedUrl.protocol === "wss:";
        const isIpcUrl = parsedUrl.protocol === "ws+unix:";
        let invalidUrlMessage;

        if (parsedUrl.protocol !== "ws:" && !isSecure && !isIpcUrl) {
          invalidUrlMessage =
            'The URL\'s protocol must be one of "ws:", "wss:", ' +
            '"http:", "https:", or "ws+unix:"';
        } else if (isIpcUrl && !parsedUrl.pathname) {
          invalidUrlMessage = "The URL's pathname is empty";
        } else if (parsedUrl.hash) {
          invalidUrlMessage = "The URL contains a fragment identifier";
        }

        if (invalidUrlMessage) {
          const err = new SyntaxError(invalidUrlMessage);

          if (websocket._redirects === 0) {
            throw err;
          } else {
            emitErrorAndClose(websocket, err);
            return;
          }
        }

        const defaultPort = isSecure ? 443 : 80;
        const key = randomBytes(16).toString("base64");
        const request = isSecure ? https.request : http.request;
        const protocolSet = new Set();
        let perMessageDeflate;

        opts.createConnection =
          opts.createConnection || (isSecure ? tlsConnect : netConnect);
        opts.defaultPort = opts.defaultPort || defaultPort;
        opts.port = parsedUrl.port || defaultPort;
        opts.host = parsedUrl.hostname.startsWith("[")
          ? parsedUrl.hostname.slice(1, -1)
          : parsedUrl.hostname;
        opts.headers = {
          ...opts.headers,
          "Sec-WebSocket-Version": opts.protocolVersion,
          "Sec-WebSocket-Key": key,
          Connection: "Upgrade",
          Upgrade: "websocket",
        };
        opts.path = parsedUrl.pathname + parsedUrl.search;
        opts.timeout = opts.handshakeTimeout;

        if (opts.perMessageDeflate) {
          perMessageDeflate = new PerMessageDeflate(
            opts.perMessageDeflate !== true ? opts.perMessageDeflate : {},
            false,
            opts.maxPayload,
          );
          opts.headers["Sec-WebSocket-Extensions"] = format({
            [PerMessageDeflate.extensionName]: perMessageDeflate.offer(),
          });
        }
        if (protocols.length) {
          for (const protocol of protocols) {
            if (
              typeof protocol !== "string" ||
              !subprotocolRegex.test(protocol) ||
              protocolSet.has(protocol)
            ) {
              throw new SyntaxError(
                "An invalid or duplicated subprotocol was specified",
              );
            }

            protocolSet.add(protocol);
          }

          opts.headers["Sec-WebSocket-Protocol"] = protocols.join(",");
        }
        if (opts.origin) {
          if (opts.protocolVersion < 13) {
            opts.headers["Sec-WebSocket-Origin"] = opts.origin;
          } else {
            opts.headers.Origin = opts.origin;
          }
        }
        if (parsedUrl.username || parsedUrl.password) {
          opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
        }

        if (isIpcUrl) {
          const parts = opts.path.split(":");

          opts.socketPath = parts[0];
          opts.path = parts[1];
        }

        let req;

        if (opts.followRedirects) {
          if (websocket._redirects === 0) {
            websocket._originalIpc = isIpcUrl;
            websocket._originalSecure = isSecure;
            websocket._originalHostOrSocketPath = isIpcUrl
              ? opts.socketPath
              : parsedUrl.host;

            const headers = options && options.headers;

            //
            // Shallow copy the user provided options so that headers can be changed
            // without mutating the original object.
            //
            options = { ...options, headers: {} };

            if (headers) {
              for (const [key, value] of Object.entries(headers)) {
                options.headers[key.toLowerCase()] = value;
              }
            }
          } else if (websocket.listenerCount("redirect") === 0) {
            const isSameHost = isIpcUrl
              ? websocket._originalIpc
                ? opts.socketPath === websocket._originalHostOrSocketPath
                : false
              : websocket._originalIpc
                ? false
                : parsedUrl.host === websocket._originalHostOrSocketPath;

            if (!isSameHost || (websocket._originalSecure && !isSecure)) {
              //
              // Match curl 7.77.0 behavior and drop the following headers. These
              // headers are also dropped when following a redirect to a subdomain.
              //
              delete opts.headers.authorization;
              delete opts.headers.cookie;

              if (!isSameHost) delete opts.headers.host;

              opts.auth = undefined;
            }
          }

          //
          // Match curl 7.77.0 behavior and make the first `Authorization` header win.
          // If the `Authorization` header is set, then there is nothing to do as it
          // will take precedence.
          //
          if (opts.auth && !options.headers.authorization) {
            options.headers.authorization =
              "Basic " + Buffer.from(opts.auth).toString("base64");
          }

          req = websocket._req = request(opts);

          if (websocket._redirects) {
            //
            // Unlike what is done for the `'upgrade'` event, no early exit is
            // triggered here if the user calls `websocket.close()` or
            // `websocket.terminate()` from a listener of the `'redirect'` event. This
            // is because the user can also call `request.destroy()` with an error
            // before calling `websocket.close()` or `websocket.terminate()` and this
            // would result in an error being emitted on the `request` object with no
            // `'error'` event listeners attached.
            //
            websocket.emit("redirect", websocket.url, req);
          }
        } else {
          req = websocket._req = request(opts);
        }

        if (opts.timeout) {
          req.on("timeout", () => {
            abortHandshake(websocket, req, "Opening handshake has timed out");
          });
        }

        req.on("error", (err) => {
          if (req === null || req[kAborted]) return;

          req = websocket._req = null;
          emitErrorAndClose(websocket, err);
        });

        req.on("response", (res) => {
          const location = res.headers.location;
          const statusCode = res.statusCode;

          if (
            location &&
            opts.followRedirects &&
            statusCode >= 300 &&
            statusCode < 400
          ) {
            if (++websocket._redirects > opts.maxRedirects) {
              abortHandshake(websocket, req, "Maximum redirects exceeded");
              return;
            }

            req.abort();

            let addr;

            try {
              addr = new URL(location, address);
            } catch (e) {
              const err = new SyntaxError(`Invalid URL: ${location}`);
              emitErrorAndClose(websocket, err);
              return;
            }

            initAsClient(websocket, addr, protocols, options);
          } else if (!websocket.emit("unexpected-response", req, res)) {
            abortHandshake(
              websocket,
              req,
              `Unexpected server response: ${res.statusCode}`,
            );
          }
        });

        req.on("upgrade", (res, socket, head) => {
          websocket.emit("upgrade", res);

          //
          // The user may have closed the connection from a listener of the
          // `'upgrade'` event.
          //
          if (websocket.readyState !== WebSocket.CONNECTING) return;

          req = websocket._req = null;

          const upgrade = res.headers.upgrade;

          if (upgrade === undefined || upgrade.toLowerCase() !== "websocket") {
            abortHandshake(websocket, socket, "Invalid Upgrade header");
            return;
          }

          const digest = createHash("sha1")
            .update(key + GUID)
            .digest("base64");

          if (res.headers["sec-websocket-accept"] !== digest) {
            abortHandshake(
              websocket,
              socket,
              "Invalid Sec-WebSocket-Accept header",
            );
            return;
          }

          const serverProt = res.headers["sec-websocket-protocol"];
          let protError;

          if (serverProt !== undefined) {
            if (!protocolSet.size) {
              protError = "Server sent a subprotocol but none was requested";
            } else if (!protocolSet.has(serverProt)) {
              protError = "Server sent an invalid subprotocol";
            }
          } else if (protocolSet.size) {
            protError = "Server sent no subprotocol";
          }

          if (protError) {
            abortHandshake(websocket, socket, protError);
            return;
          }

          if (serverProt) websocket._protocol = serverProt;

          const secWebSocketExtensions =
            res.headers["sec-websocket-extensions"];

          if (secWebSocketExtensions !== undefined) {
            if (!perMessageDeflate) {
              const message =
                "Server sent a Sec-WebSocket-Extensions header but no extension " +
                "was requested";
              abortHandshake(websocket, socket, message);
              return;
            }

            let extensions;

            try {
              extensions = parse(secWebSocketExtensions);
            } catch (err) {
              const message = "Invalid Sec-WebSocket-Extensions header";
              abortHandshake(websocket, socket, message);
              return;
            }

            const extensionNames = Object.keys(extensions);

            if (
              extensionNames.length !== 1 ||
              extensionNames[0] !== PerMessageDeflate.extensionName
            ) {
              const message =
                "Server indicated an extension that was not requested";
              abortHandshake(websocket, socket, message);
              return;
            }

            try {
              perMessageDeflate.accept(
                extensions[PerMessageDeflate.extensionName],
              );
            } catch (err) {
              const message = "Invalid Sec-WebSocket-Extensions header";
              abortHandshake(websocket, socket, message);
              return;
            }

            websocket._extensions[PerMessageDeflate.extensionName] =
              perMessageDeflate;
          }

          websocket.setSocket(socket, head, {
            allowSynchronousEvents: opts.allowSynchronousEvents,
            generateMask: opts.generateMask,
            maxPayload: opts.maxPayload,
            skipUTF8Validation: opts.skipUTF8Validation,
          });
        });

        if (opts.finishRequest) {
          opts.finishRequest(req, websocket);
        } else {
          req.end();
        }
      }

      /**
       * Emit the `'error'` and `'close'` events.
       *
       * @param {WebSocket} websocket The WebSocket instance
       * @param {Error} The error to emit
       * @private
       */
      function emitErrorAndClose(websocket, err) {
        websocket._readyState = WebSocket.CLOSING;
        //
        // The following assignment is practically useless and is done only for
        // consistency.
        //
        websocket._errorEmitted = true;
        websocket.emit("error", err);
        websocket.emitClose();
      }

      /**
       * Create a `net.Socket` and initiate a connection.
       *
       * @param {Object} options Connection options
       * @return {net.Socket} The newly created socket used to start the connection
       * @private
       */
      function netConnect(options) {
        options.path = options.socketPath;
        return net.connect(options);
      }

      /**
       * Create a `tls.TLSSocket` and initiate a connection.
       *
       * @param {Object} options Connection options
       * @return {tls.TLSSocket} The newly created socket used to start the connection
       * @private
       */
      function tlsConnect(options) {
        options.path = undefined;

        if (!options.servername && options.servername !== "") {
          options.servername = net.isIP(options.host) ? "" : options.host;
        }

        return tls.connect(options);
      }

      /**
       * Abort the handshake and emit an error.
       *
       * @param {WebSocket} websocket The WebSocket instance
       * @param {(http.ClientRequest|net.Socket|tls.Socket)} stream The request to
       *     abort or the socket to destroy
       * @param {String} message The error message
       * @private
       */
      function abortHandshake(websocket, stream, message) {
        websocket._readyState = WebSocket.CLOSING;

        const err = new Error(message);
        Error.captureStackTrace(err, abortHandshake);

        if (stream.setHeader) {
          stream[kAborted] = true;
          stream.abort();

          if (stream.socket && !stream.socket.destroyed) {
            //
            // On Node.js >= 14.3.0 `request.abort()` does not destroy the socket if
            // called after the request completed. See
            // https://github.com/websockets/ws/issues/1869.
            //
            stream.socket.destroy();
          }

          process.nextTick(emitErrorAndClose, websocket, err);
        } else {
          stream.destroy(err);
          stream.once("error", websocket.emit.bind(websocket, "error"));
          stream.once("close", websocket.emitClose.bind(websocket));
        }
      }

      /**
       * Handle cases where the `ping()`, `pong()`, or `send()` methods are called
       * when the `readyState` attribute is `CLOSING` or `CLOSED`.
       *
       * @param {WebSocket} websocket The WebSocket instance
       * @param {*} [data] The data to send
       * @param {Function} [cb] Callback
       * @private
       */
      function sendAfterClose(websocket, data, cb) {
        if (data) {
          const length = isBlob(data) ? data.size : toBuffer(data).length;

          //
          // The `_bufferedAmount` property is used only when the peer is a client and
          // the opening handshake fails. Under these circumstances, in fact, the
          // `setSocket()` method is not called, so the `_socket` and `_sender`
          // properties are set to `null`.
          //
          if (websocket._socket) websocket._sender._bufferedBytes += length;
          else websocket._bufferedAmount += length;
        }

        if (cb) {
          const err = new Error(
            `WebSocket is not open: readyState ${websocket.readyState} ` +
              `(${readyStates[websocket.readyState]})`,
          );
          process.nextTick(cb, err);
        }
      }

      /**
       * The listener of the `Receiver` `'conclude'` event.
       *
       * @param {Number} code The status code
       * @param {Buffer} reason The reason for closing
       * @private
       */
      function receiverOnConclude(code, reason) {
        const websocket = this[kWebSocket];

        websocket._closeFrameReceived = true;
        websocket._closeMessage = reason;
        websocket._closeCode = code;

        if (websocket._socket[kWebSocket] === undefined) return;

        websocket._socket.removeListener("data", socketOnData);
        process.nextTick(resume, websocket._socket);

        if (code === 1005) websocket.close();
        else websocket.close(code, reason);
      }

      /**
       * The listener of the `Receiver` `'drain'` event.
       *
       * @private
       */
      function receiverOnDrain() {
        const websocket = this[kWebSocket];

        if (!websocket.isPaused) websocket._socket.resume();
      }

      /**
       * The listener of the `Receiver` `'error'` event.
       *
       * @param {(RangeError|Error)} err The emitted error
       * @private
       */
      function receiverOnError(err) {
        const websocket = this[kWebSocket];

        if (websocket._socket[kWebSocket] !== undefined) {
          websocket._socket.removeListener("data", socketOnData);

          //
          // On Node.js < 14.0.0 the `'error'` event is emitted synchronously. See
          // https://github.com/websockets/ws/issues/1940.
          //
          process.nextTick(resume, websocket._socket);

          websocket.close(err[kStatusCode]);
        }

        if (!websocket._errorEmitted) {
          websocket._errorEmitted = true;
          websocket.emit("error", err);
        }
      }

      /**
       * The listener of the `Receiver` `'finish'` event.
       *
       * @private
       */
      function receiverOnFinish() {
        this[kWebSocket].emitClose();
      }

      /**
       * The listener of the `Receiver` `'message'` event.
       *
       * @param {Buffer|ArrayBuffer|Buffer[])} data The message
       * @param {Boolean} isBinary Specifies whether the message is binary or not
       * @private
       */
      function receiverOnMessage(data, isBinary) {
        this[kWebSocket].emit("message", data, isBinary);
      }

      /**
       * The listener of the `Receiver` `'ping'` event.
       *
       * @param {Buffer} data The data included in the ping frame
       * @private
       */
      function receiverOnPing(data) {
        const websocket = this[kWebSocket];

        if (websocket._autoPong) websocket.pong(data, !this._isServer, NOOP);
        websocket.emit("ping", data);
      }

      /**
       * The listener of the `Receiver` `'pong'` event.
       *
       * @param {Buffer} data The data included in the pong frame
       * @private
       */
      function receiverOnPong(data) {
        this[kWebSocket].emit("pong", data);
      }

      /**
       * Resume a readable stream
       *
       * @param {Readable} stream The readable stream
       * @private
       */
      function resume(stream) {
        stream.resume();
      }

      /**
       * The `Sender` error event handler.
       *
       * @param {Error} The error
       * @private
       */
      function senderOnError(err) {
        const websocket = this[kWebSocket];

        if (websocket.readyState === WebSocket.CLOSED) return;
        if (websocket.readyState === WebSocket.OPEN) {
          websocket._readyState = WebSocket.CLOSING;
          setCloseTimer(websocket);
        }

        //
        // `socket.end()` is used instead of `socket.destroy()` to allow the other
        // peer to finish sending queued data. There is no need to set a timer here
        // because `CLOSING` means that it is already set or not needed.
        //
        this._socket.end();

        if (!websocket._errorEmitted) {
          websocket._errorEmitted = true;
          websocket.emit("error", err);
        }
      }

      /**
       * Set a timer to destroy the underlying raw socket of a WebSocket.
       *
       * @param {WebSocket} websocket The WebSocket instance
       * @private
       */
      function setCloseTimer(websocket) {
        websocket._closeTimer = setTimeout(
          websocket._socket.destroy.bind(websocket._socket),
          websocket._closeTimeout,
        );
      }

      /**
       * The listener of the socket `'close'` event.
       *
       * @private
       */
      function socketOnClose() {
        const websocket = this[kWebSocket];

        this.removeListener("close", socketOnClose);
        this.removeListener("data", socketOnData);
        this.removeListener("end", socketOnEnd);

        websocket._readyState = WebSocket.CLOSING;

        //
        // The close frame might not have been received or the `'end'` event emitted,
        // for example, if the socket was destroyed due to an error. Ensure that the
        // `receiver` stream is closed after writing any remaining buffered data to
        // it. If the readable side of the socket is in flowing mode then there is no
        // buffered data as everything has been already written. If instead, the
        // socket is paused, any possible buffered data will be read as a single
        // chunk.
        //
        if (
          !this._readableState.endEmitted &&
          !websocket._closeFrameReceived &&
          !websocket._receiver._writableState.errorEmitted &&
          this._readableState.length !== 0
        ) {
          const chunk = this.read(this._readableState.length);

          websocket._receiver.write(chunk);
        }

        websocket._receiver.end();

        this[kWebSocket] = undefined;

        clearTimeout(websocket._closeTimer);

        if (
          websocket._receiver._writableState.finished ||
          websocket._receiver._writableState.errorEmitted
        ) {
          websocket.emitClose();
        } else {
          websocket._receiver.on("error", receiverOnFinish);
          websocket._receiver.on("finish", receiverOnFinish);
        }
      }

      /**
       * The listener of the socket `'data'` event.
       *
       * @param {Buffer} chunk A chunk of data
       * @private
       */
      function socketOnData(chunk) {
        if (!this[kWebSocket]._receiver.write(chunk)) {
          this.pause();
        }
      }

      /**
       * The listener of the socket `'end'` event.
       *
       * @private
       */
      function socketOnEnd() {
        const websocket = this[kWebSocket];

        websocket._readyState = WebSocket.CLOSING;
        websocket._receiver.end();
        this.end();
      }

      /**
       * The listener of the socket `'error'` event.
       *
       * @private
       */
      function socketOnError() {
        const websocket = this[kWebSocket];

        this.removeListener("error", socketOnError);
        this.on("error", NOOP);

        if (websocket) {
          websocket._readyState = WebSocket.CLOSING;
          this.destroy();
        }
      }

      /***/
    },

    /***/ 825: /***/ (
      module,
      __unused_webpack_exports,
      __nccwpck_require__,
    ) => {
      "use strict";

      const path = __nccwpck_require__(928);
      const fs = __nccwpck_require__(896);

      function loadConfig() {
        const cfgPath = __nccwpck_require__.ab + "config.json";
        const cfg = {
          discord: { token: process.env.DISCORD_TOKEN || null },
          rpc: { enabled: true },
        };
        if (fs.existsSync(__nccwpck_require__.ab + "config.json")) {
          try {
            const loaded = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
            if (loaded.discord)
              cfg.discord = { ...cfg.discord, ...loaded.discord };
            if (loaded.rpc) cfg.rpc = { ...cfg.rpc, ...loaded.rpc };
          } catch {}
        }
        return cfg;
      }

      module.exports = { loadConfig };

      /***/
    },

    /***/ 165: /***/ (
      module,
      __unused_webpack_exports,
      __nccwpck_require__,
    ) => {
      /**
       * Discord RPC Module for tplay
       * - Direct Gateway WebSocket connection (no selfbot packages)
       * - Rate limited presence updates
       * - 5-second debounce for track changes (NOT for pause/seek)
       * - Local HTTP server for track info
       */

      const WebSocket = __nccwpck_require__(600);
      const http = __nccwpck_require__(611);

      const OPCODES = {
        DISPATCH: 0,
        HEARTBEAT: 1,
        IDENTIFY: 2,
        PRESENCE_UPDATE: 3,
        RESUME: 6,
        RECONNECT: 7,
        INVALID_SESSION: 9,
        HELLO: 10,
        HEARTBEAT_ACK: 11,
      };

      // ─── Simple Logger ────────────────────────────────────────────────────────────
      class RPCLogger {
        _write(level, msg) {
          const ts = new Date().toISOString();
          const colors = {
            info: "\x1b[34m",
            success: "\x1b[32m",
            warn: "\x1b[33m",
            error: "\x1b[31m",
            rpc: "\x1b[36m",
            discord: "\x1b[38;5;63m",
          };
          const c = colors[level] || "\x1b[37m";
          console.log(
            `\x1b[90m[${ts}]\x1b[0m ${c}[${level.toUpperCase()}]\x1b[0m ${msg}`,
          );
        }

        info(msg) {
          this._write("info", msg);
        }
        success(msg) {
          this._write("success", msg);
        }
        warn(msg) {
          this._write("warn", msg);
        }
        error(msg) {
          this._write("error", msg);
        }
        rpc(msg) {
          this._write("rpc", msg);
        }
        discord(msg) {
          this._write("discord", msg);
        }
      }

      // ─── Rate Limiter ──────────────────────────────────────────────────────────────
      class PresenceRateLimiter {
        constructor() {
          this.tokens = 5;
          this.maxTokens = 5;
          this.refillInterval = 4000;
          this.lastRefill = Date.now();
          this.pendingTask = null;
          this.isProcessing = false;
        }

        _refill() {
          const now = Date.now();
          const elapsed = now - this.lastRefill;
          if (elapsed >= this.refillInterval) {
            const toAdd = Math.floor(elapsed / this.refillInterval);
            this.tokens = Math.min(this.maxTokens, this.tokens + toAdd);
            this.lastRefill = now - (elapsed % this.refillInterval);
          }
        }

        async execute(fn) {
          this._refill();
          if (this.tokens > 0 && !this.isProcessing) {
            this.tokens--;
            return fn();
          }

          // Only keep the latest update
          return new Promise((resolve) => {
            if (this.pendingTask) {
              this.pendingTask.resolve(false); // Resolve previous with false (skipped)
            }
            this.pendingTask = { fn, resolve };
            this._processQueue();
          });
        }

        _processQueue() {
          if (this.isProcessing) return;
          this.isProcessing = true;

          const check = async () => {
            this._refill();
            if (this.tokens > 0 && this.pendingTask) {
              this.tokens--;
              const { fn, resolve } = this.pendingTask;
              this.pendingTask = null;
              try {
                await fn();
              } finally {
                resolve(true);
              }
            }

            if (this.pendingTask) {
              setTimeout(check, 1000);
            } else {
              this.isProcessing = false;
            }
          };

          setTimeout(check, 100);
        }
      }

      // ─── Local HTTP Server ─────────────────────────────────────────────────────────
      class TrackServer {
        constructor(port = 0) {
          this.port = port;
          this.server = null;
          this.currentTrack = null;
          this.actualPort = null;
        }

        start() {
          return new Promise((resolve, reject) => {
            this.server = http.createServer((req, res) => {
              const urlPath = req.url.split("?")[0];

              // CORS headers
              res.setHeader("Access-Control-Allow-Origin", "*");
              res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
              res.setHeader("Access-Control-Allow-Headers", "Content-Type");

              if (req.method === "OPTIONS") {
                res.writeHead(200);
                res.end();
                return;
              }

              if (urlPath === "/nowplaying/track/info") {
                res.setHeader("Content-Type", "application/json");
                res.writeHead(200);
                res.end(
                  JSON.stringify(this.currentTrack || { playing: false }),
                );
                return;
              }

              // Root endpoint
              if (urlPath === "/" || urlPath === "/nowplaying") {
                res.setHeader("Content-Type", "application/json");
                res.writeHead(200);
                res.end(
                  JSON.stringify({
                    endpoints: {
                      info: "/nowplaying/track/info",
                    },
                    current: this.currentTrack || { playing: false },
                  }),
                );
                return;
              }

              res.writeHead(404);
              res.end(JSON.stringify({ error: "Not found" }));
            });

            this.server.on("error", (err) => {
              if (err.code === "EADDRINUSE" && this.port !== 0) {
                // Port busy, try random port
                this.port = 0;
                this.server.listen(0);
              } else {
                reject(err);
              }
            });

            this.server.listen(this.port, () => {
              this.actualPort = this.server.address().port;
              resolve(this.actualPort);
            });
          });
        }

        updateTrack(track) {
          this.currentTrack = track;
        }

        stop() {
          if (this.server) {
            this.server.close();
            this.server = null;
          }
        }
      }

      // ─── Discord Gateway Client ───────────────────────────────────────────────────
      class DiscordRPC {
        constructor(options = {}) {
          this.token = options.token;
          this.logger = options.logger || new RPCLogger();
          this.port = options.port || 0;

          this.gatewayUrl = "wss://gateway.discord.gg/?v=10&encoding=json";
          this.ws = null;
          this.connected = false;
          this.connecting = false;

          this.sessionId = null;
          this.sequence = null;
          this.heartbeatInterval = null;
          this.heartbeatAckReceived = true;

          this.currentPresence = null;
          this.rateLimiter = new PresenceRateLimiter();
          this.trackServer = new TrackServer(this.port);

          // Debounce for track changes only
          this.pendingTrack = null;
          this.debounceTimer = null;
          this.debounceDelay = 5000; // 5 seconds for track changes

          // Track state
          this.currentTrackId = null;
          this.playbackStartTime = null;

          this.reconnectAttempts = 0;
          this.maxReconnectAttempts = Infinity;
          this.intentionalClose = false;
          this.reconnectTimer = null;

          this._resolve = null;
          this._reject = null;
        }

        async connect(immediate = false) {
          if (this.connected) return true;
          if (this.connecting) return this._waitForReady();

          this.connecting = true;
          this.intentionalClose = false;

          if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
          }

          if (immediate) {
            this.reconnectAttempts = 0;
          }

          // Start local HTTP server
          try {
            if (!this.trackServer.server) {
              await this.trackServer.start();
            }
          } catch (e) {}

          return new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;

            try {
              if (this.ws) {
                this.ws.removeAllListeners();
                try {
                  this.ws.close();
                } catch {}
              }

              this.ws = new WebSocket(this.gatewayUrl, {
                headers: {
                  "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                },
                handshakeTimeout: 10000,
              });

              this.ws.on("open", () => {
                this.logger.discord("Socket opened, waiting for HELLO...");
              });

              this.ws.on("message", (data) => this._handleMessage(data));
              this.ws.on("close", (code) => this._handleClose(code));
              this.ws.on("error", (e) => this._handleError(e));

              // Connection timeout
              const timeout = setTimeout(() => {
                if (this.connecting && !this.connected) {
                  this._handleFail(new Error("Gateway connection timeout"));
                }
              }, 15000);

              // Clear timeout if we connect or fail
              const originalResolve = this._resolve;
              this._resolve = (val) => {
                clearTimeout(timeout);
                if (originalResolve) originalResolve(val);
              };
            } catch (e) {
              this._handleFail(e);
            }
          });
        }

        _waitForReady() {
          return new Promise((resolve, reject) => {
            const start = Date.now();
            const check = () => {
              if (this.connected) resolve(true);
              else if (!this.connecting) reject(new Error("Connection failed"));
              else if (Date.now() - start > 30000)
                reject(new Error("Wait for ready timed out"));
              else setTimeout(check, 100);
            };
            check();
          });
        }

        _handleMessage(data) {
          try {
            const msg = JSON.parse(data.toString());
            if (msg.s !== null) this.sequence = msg.s;

            switch (msg.op) {
              case OPCODES.HELLO:
                this._startHeartbeat(msg.d.heartbeat_interval);
                if (this.sessionId && this.sequence !== null) {
                  this.logger.discord("Attempting to resume session...");
                  this._resume();
                } else {
                  this._identify();
                }
                break;
              case OPCODES.HEARTBEAT_ACK:
                this.heartbeatAckReceived = true;
                break;
              case OPCODES.HEARTBEAT:
                this._sendHeartbeat();
                break;
              case OPCODES.DISPATCH:
                if (msg.t === "READY") this._handleReady(msg.d);
                else if (msg.t === "RESUMED") this._handleReady(null, true);
                break;
              case OPCODES.INVALID_SESSION:
                this.logger.warn("Invalid session, starting fresh...");
                this.sessionId = null;
                this.sequence = null;
                // Small delay before re-identifying
                setTimeout(() => {
                  if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                    this._identify();
                  } else {
                    this._handleFail(
                      new Error("Invalid session during reconnect"),
                    );
                  }
                }, 1000);
                break;
              case OPCODES.RECONNECT:
                this.logger.warn("Gateway requested reconnect");
                this._handleFail(new Error("Gateway RECONNECT opcode"));
                break;
            }
          } catch (e) {
            this.logger.error(`Error handling message: ${e.message}`);
          }
        }

        _startHeartbeat(interval) {
          if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
          this.heartbeatAckReceived = true;
          const jitter = Math.random() * interval * 0.1;
          this.heartbeatInterval = setInterval(
            () => this._sendHeartbeat(),
            interval + jitter,
          );
          // Send first heartbeat quickly
          setTimeout(
            () => this._sendHeartbeat(),
            Math.random() * interval * 0.2,
          );
        }

        _sendHeartbeat() {
          if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
          if (!this.heartbeatAckReceived) {
            this._handleFail(
              new Error("Heartbeat timeout (zombie connection)"),
            );
            return;
          }
          this.heartbeatAckReceived = false;
          this._send({ op: OPCODES.HEARTBEAT, d: this.sequence });
        }

        _identify() {
          this.logger.discord("Identifying...");
          this._send({
            op: OPCODES.IDENTIFY,
            d: {
              token: this.token,
              intents: 0,
              properties: { os: "Windows", browser: "Chrome", device: "" },
              presence: this.currentPresence || {
                status: "online",
                afk: false,
              },
            },
          });
        }

        _resume() {
          this._send({
            op: OPCODES.RESUME,
            d: {
              token: this.token,
              session_id: this.sessionId,
              seq: this.sequence,
            },
          });
        }

        _handleReady(data, resumed = false) {
          if (data) {
            this.sessionId = data.session_id;
            this.logger.success(`Logged in as ${data.user.username}`);
          } else {
            this.logger.success("Session resumed successfully");
          }
          this.connected = true;
          this.connecting = false;
          this.reconnectAttempts = 0;
          if (this._resolve) {
            this._resolve(true);
            this._resolve = null;
            this._reject = null;
          }
        }

        _handleFail(e, fatal = false) {
          const wasConnected = this.connected || this.connecting;
          this.connecting = false;
          this.connected = false;

          if (this.ws) {
            this.ws.removeAllListeners();
            try {
              this.ws.close();
            } catch {}
            this.ws = null;
          }

          if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
          }

          if (!this.intentionalClose && !fatal) {
            this.reconnectAttempts++;
            // Reconnect strategy: retry after 30s auto if no requests,
            // but exponential backoff for initial failures.
            // Max delay 30s as requested.
            const delay = Math.min(
              Math.pow(2, this.reconnectAttempts) * 1000,
              30000,
            );

            this.logger.warn(
              `Connection lost: ${e.message}. Reconnecting in ${delay / 1000}s...`,
            );

            if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
            this.reconnectTimer = setTimeout(() => {
              this.logger.discord(
                `Retrying connection (attempt ${this.reconnectAttempts})...`,
              );
              this.connect().catch(() => {});
            }, delay);
          } else {
            if (this.intentionalClose) {
              this.logger.discord("Connection closed intentionally");
            } else if (fatal) {
              this.logger.error(`Fatal connection error: ${e.message}`);
            }

            if (this._reject) {
              this._reject(e);
              this._resolve = null;
              this._reject = null;
            }
          }
        }

        _handleClose(code) {
          // Fatal Discord codes: 4004 (Auth failure), 4010-4014 (Sharding/Invalid API)
          const fatalCodes = [4004, 4010, 4011, 4012, 4013, 4014];
          const isFatal = fatalCodes.includes(code);
          this._handleFail(
            new Error(`Gateway closed with code ${code}`),
            isFatal,
          );
        }

        _handleError(e) {
          this.logger.error(`WebSocket error: ${e.message}`);
          // Close event will follow, which triggers _handleFail
        }

        _send(payload) {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            try {
              this.ws.send(JSON.stringify(payload));
            } catch (e) {
              this.logger.error(`Failed to send payload: ${e.message}`);
            }
          }
        }

        /**
         * Queue track update with 5-second debounce (for track changes only)
         */
        queueUpdate(track) {
          if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
          }

          if (!track) {
            this.pendingTrack = null;
            this._executeUpdate(null);
            return;
          }

          // Capture the exact time this update was requested
          track.requestedAt = Date.now();
          this.pendingTrack = track;

          const trackId =
            track.filePath || `${track.title}|${track.artist}|${track.album}`;
          const isTrackChange = this.currentTrackId !== trackId;
          const isPauseOrSeek = track.isPauseUpdate || track.isSeekUpdate;

          // Trigger immediate reconnection if important update and not connected
          if (isPauseOrSeek || isTrackChange) {
            if (!this.connected && !this.connecting) {
              this.connect(true).catch(() => {});
            }
          }

          if (isTrackChange && !isPauseOrSeek) {
            this.debounceTimer = setTimeout(() => {
              if (this.pendingTrack) {
                this._executeUpdate(this.pendingTrack);
                this.pendingTrack = null;
              }
            }, this.debounceDelay);

            // First track - update immediately
            if (!this.currentTrackId) {
              clearTimeout(this.debounceTimer);
              this._executeUpdate(track);
              this.pendingTrack = null;
            }
          } else {
            // Pause/seek - immediate update
            this._executeUpdate(track);
          }
        }

        async _executeUpdate(track) {
          if (!this.connected) return;

          return this.rateLimiter.execute(async () => {
            let presence;

            if (!track) {
              presence = {
                status: "online",
                afk: false,
                since: null,
                activities: [],
              };
              this.currentTrackId = null;
              this.playbackStartTime = null;
              this.trackServer.updateTrack(null);
              this.logger.rpc("Clearing presence");
            } else {
              const trackId =
                track.filePath ||
                `${track.title}|${track.artist}|${track.album}`;
              const updateTime = track.requestedAt || Date.now();

              const isTrackChange = this.currentTrackId !== trackId;
              if (isTrackChange) {
                this.currentTrackId = trackId;
                this.playbackStartTime =
                  updateTime - Math.floor((track.position || 0) * 1000);
              }

              // Calculate timestamps IN MILLISECONDS
              let startTime = this.playbackStartTime || updateTime;
              let endTime = null;

              if (track.duration && track.duration > 0) {
                if (track.position !== undefined && track.position >= 0) {
                  startTime = updateTime - Math.floor(track.position * 1000);
                }
                endTime = startTime + Math.floor(track.duration * 1000);
              }

              // Update local server
              this.trackServer.updateTrack({
                playing: true,
                title: track.title,
                artist: track.artist,
                album: track.album,
                duration: track.duration,
                position: track.position,
                paused: track.paused,
                filePath: track.filePath,
                timestamps: {
                  start: startTime,
                  end: endTime,
                },
              });

              // Use conditional URLs for large image based on playback state
              let albumArtUrl = track.paused
                ? "mp:attachments/1155430211161165897/1483576316333789388/output-onlinegiftools.png?ex=69bb179d&is=69b9c61d&hm=97969debdfb930ff57f874317dddaec5979497f69308721eb7929998a37341b6"
                : "mp:attachments/1155430211161165897/1483576290916307064/ncs.gif?ex=69bb1797&is=69b9c617&hm=59871cacf49609011d9d9ac293bd16d510d055f188fd254e4d289d69c5953baf&";

              // Build activity
              const activity = {
                name: track.title || "Unknown",
                type: 2,
                details: track.title || "Unknown",
                timestamps: {},
              };

              // When paused, clear timestamps (start: 0, end: 0)
              // When playing, show proper timestamps
              if (track.paused) {
                activity.timestamps = { start: 1, end: 1 };
              } else {
                activity.timestamps = { start: startTime };
                if (endTime) activity.timestamps.end = endTime;
              }

              if (track.artist) activity.state = `by ${track.artist}`;

              activity.assets = {
                large_image: albumArtUrl,
                large_text: track.album || track.artist || "Music",
                // small_image: "playing",
                // small_text: track.paused ? "Paused" : "Playing",
              };

              presence = {
                status: track.paused ? "idle" : "online",
                afk: track.paused || false,
                since: null,
                activities: [activity],
              };

              const duration = track.duration
                ? `${Math.floor(track.duration / 60)}:${String(Math.floor(track.duration % 60)).padStart(2, "0")}`
                : "?";
              this.logger.rpc(
                `${track.title}${track.artist ? ` - ${track.artist}` : ""} (${duration})${track.paused ? " ⏸️" : ""}`,
              );
            }

            this.currentPresence = presence;
            this._send({ op: OPCODES.PRESENCE_UPDATE, d: presence });
            return true;
          });
        }

        /**
         * Immediate update for pause/resume
         */
        async updatePauseState(track) {
          if (!this.connected || !this.currentTrackId) return;
          track.isPauseUpdate = true;
          this.queueUpdate(track);
        }

        /**
         * Immediate update for seek
         */
        async updateSeekState(track) {
          if (!this.connected || !this.currentTrackId) return;
          track.isSeekUpdate = true;
          this.queueUpdate(track);
        }

        /**
         * Legacy method
         */
        async updatePresence(track) {
          this.queueUpdate(track);
        }

        disconnect() {
          this.intentionalClose = true;
          if (this.debounceTimer) clearTimeout(this.debounceTimer);
          if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
          if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
          if (this.ws) {
            this.ws.removeAllListeners();
            try {
              this.ws.close();
            } catch {}
            this.ws = null;
          }
          if (this.trackServer) this.trackServer.stop();
          this.connected = false;
          this.connecting = false;
          this.logger.discord("Disconnected");
        }
      }

      module.exports = { DiscordRPC, RPCLogger, TrackServer };

      /***/
    },

    /***/ 365: /***/ (
      module,
      __unused_webpack_exports,
      __nccwpck_require__,
    ) => {
      "use strict";

      const path = __nccwpck_require__(928);
      const fs = __nccwpck_require__(896);
      const net = __nccwpck_require__(278);
      const os = __nccwpck_require__(857);
      const { spawn } = __nccwpck_require__(317);
      const { EventEmitter } = __nccwpck_require__(434);
      const { clamp } = __nccwpck_require__(921);

      class MPV extends EventEmitter {
        constructor(bin) {
          super();
          this.bin = bin;
          this.proc = null;
          this.sock = null;
          this.buf = "";
          this.pending = new Map();
          this.reqId = 1;
          this.props = {};
          this.ready = false;
          const tmp =
            process.env.TMPDIR ||
            process.env.TMP ||
            process.env.TEMP ||
            os.tmpdir();
          this.sockPath =
            process.platform === "win32"
              ? `\\\\.\\pipe\\tplay_${process.pid}`
              : path.join(tmp, `tplay_${process.pid}.sock`);
        }

        start(file) {
          return new Promise((resolve, reject) => {
            try {
              fs.unlinkSync(this.sockPath);
            } catch {}
            const tmp =
              process.env.TMPDIR ||
              process.env.TMP ||
              process.env.TEMP ||
              os.tmpdir();
            try {
              fs.writeFileSync(
                path.join(tmp, "tplay_socket_path"),
                this.sockPath,
              );
            } catch {}
            const env = { ...process.env };
            if (process.platform !== "win32" && !env.DISPLAY) env.DISPLAY = "";
            this.proc = spawn(
              this.bin,
              [
                `--input-ipc-server=${this.sockPath}`,
                "--no-video",
                "--no-terminal",
                "--really-quiet",
                "--idle=yes",
                "--keep-open=yes",
                "--keep-open-pause=no",
                "--volume=80",
                "--",
                file,
              ],
              { stdio: "ignore", env },
            );
            this.proc.on("error", (e) =>
              reject(new Error(`mpv: ${e.message}`)),
            );
            this.proc.on("exit", (code) => {
              this.ready = false;
              this.emit("exit", code);
            });
            let tries = 0;
            const poll = setInterval(() => {
              tries++;
              if (fs.existsSync(this.sockPath)) {
                clearInterval(poll);
                this._connect().then(resolve).catch(reject);
                return;
              }
              if (tries >= 100) {
                clearInterval(poll);
                reject(new Error("mpv socket timeout"));
              }
            }, 100);
          });
        }

        _connect() {
          return new Promise((resolve, reject) => {
            const sock = net.createConnection(this.sockPath);
            const onErr = (e) => {
              if (!this.ready) reject(e);
            };
            sock.once("error", onErr);
            sock.once("connect", () => {
              sock.removeListener("error", onErr);
              this.sock = sock;
              this.ready = true;
              sock.on("data", (d) => {
                this.buf += d.toString("utf8");
                const parts = this.buf.split("\n");
                this.buf = parts.pop();
                for (const p of parts) {
                  if (!p.trim()) continue;
                  try {
                    this._handle(JSON.parse(p));
                  } catch {}
                }
              });
              sock.on("error", () => {});
              sock.on("close", () => {
                this.sock = null;
                this.ready = false;
                this.emit("disconnected");
              });
              this._observe();
              resolve();
            });
          });
        }

        _handle(msg) {
          if (msg.event) {
            if (msg.event === "property-change") {
              this.props[msg.name] = msg.data;
              this.emit("prop", msg.name, msg.data);
            }
            this.emit("event", msg.event, msg);
            return;
          }
          if (msg.request_id != null) {
            const p = this.pending.get(msg.request_id);
            if (p) {
              this.pending.delete(msg.request_id);
              msg.error === "success"
                ? p.resolve(msg.data)
                : p.reject(new Error(msg.error));
            }
          }
        }

        _observe() {
          const props = [
            "pause",
            "time-pos",
            "duration",
            "volume",
            "mute",
            "metadata",
            "media-title",
            "filename",
            "eof-reached",
            "playback-abort",
          ];
          let id = 100;
          for (const p of props)
            this._send({ command: ["observe_property", id++, p] });
        }

        _send(obj) {
          if (!this.sock) return;
          try {
            this.sock.write(JSON.stringify(obj) + "\n");
          } catch {}
        }

        cmd(command) {
          return new Promise((resolve, reject) => {
            if (!this.sock) return reject(new Error("not connected"));
            const id = this.reqId++;
            this.pending.set(id, { resolve, reject });
            this._send({ command, request_id: id });
            setTimeout(() => {
              if (this.pending.has(id)) {
                this.pending.delete(id);
                reject(new Error("timeout"));
              }
            }, 3000);
          });
        }

        async setProp(n, v) {
          return this.cmd(["set_property", n, v]).catch(() => {});
        }
        async seek(s, m = "relative+exact") {
          return this.cmd(["seek", s, m]).catch(() => {});
        }
        async togglePause() {
          return this.cmd(["cycle", "pause"]).catch(() => {});
        }
        async setVolume(v) {
          return this.setProp("volume", clamp(v, 0, 130));
        }
        async setMute(v) {
          return this.setProp("mute", v);
        }
        async loadFile(f, m = "replace") {
          return this.cmd(["loadfile", f, m]).catch(() => {});
        }

        async quit() {
          this.ready = false;
          try {
            await this.cmd(["quit"]);
          } catch {}
          if (this.sock) {
            try {
              this.sock.destroy();
            } catch {}
            this.sock = null;
          }
          if (this.proc) {
            try {
              this.proc.kill("SIGTERM");
            } catch {}
            this.proc = null;
          }
          try {
            fs.unlinkSync(this.sockPath);
          } catch {}
        }
      }

      module.exports = { MPV };

      /***/
    },

    /***/ 140: /***/ (
      module,
      __unused_webpack_exports,
      __nccwpck_require__,
    ) => {
      "use strict";

      const fs = __nccwpck_require__(896);
      const path = __nccwpck_require__(928);
      const { EventEmitter } = __nccwpck_require__(434);
      const { MPV } = __nccwpck_require__(365);
      const { Renderer } = __nccwpck_require__(308);
      const { collectFiles } = __nccwpck_require__(269);
      const { loadLyrics, getLyricIdx } = __nccwpck_require__(197);
      const { probeFile } = __nccwpck_require__(952);
      const { tw, wr, hideCursor, showCursor, clamp } =
        __nccwpck_require__(921);

      let DiscordRPC = null;
      try {
        DiscordRPC = __nccwpck_require__(165).DiscordRPC;
      } catch (e) {}

      let TermuxMedia = null;
      try {
        TermuxMedia = __nccwpck_require__(465);
      } catch (e) {}

      class Player extends EventEmitter {
        constructor(mpvBin, config) {
          super();
          this.mpv = new MPV(mpvBin);
          this.ui = new Renderer();
          this.config = config;
          this.playlist = [];
          this.idx = 0;

          this.st = {
            playing: false,
            paused: false,
            pos: 0,
            dur: 0,
            vol: 80,
            muted: false,
            repeat: "none",
            shuffle: false,
            lyrics: null,
            lyricIdx: -1,
            plainOffset: 0,
            title: "",
            artist: "",
            album: "",
            file: "",
            playlist: [],
            index: 0,
            total: 0,
            fileInfo: null,
            rpcConnected: false,
            rpcStatus: "",
            hideLyrics: false,
          };

          this._renderTimer = null;
          this._resizeTimer = null;
          this._loading = false;
          this._dying = false;
          this._shuffleList = [];
          this._shuffleIdx = 0;
          this._probeCache = new Map();
          this._maxCacheSize = 500;
          this._probeId = 0;

          // Discord RPC
          this.rpc = null;

          // Track end detection
          this._lastPos = 0;
          this._endCheckTimer = null;
          this._playbackEnded = false;

          // Plugins
          this.plugins = new Map();
          this._loadPlugins();
        }

        _loadPlugins() {
          const pluginsDir = __nccwpck_require__.ab + "plugins";
          if (!fs.existsSync(__nccwpck_require__.ab + "plugins")) {
            try {
              fs.mkdirSync(__nccwpck_require__.ab + "plugins");
            } catch (e) {}
            return;
          }

          try {
            const files = fs.readdirSync(__nccwpck_require__.ab + "plugins");
            for (const file of files) {
              if (file.endsWith(".js")) {
                try {
                  const pluginPath = __nccwpck_require__.ab + "plugins/" + file;
                  // Delete from cache for fresh load if needed
                  delete require.cache[require.resolve(pluginPath)];
                  const plugin = require(pluginPath);
                  if (plugin && typeof plugin.init === "function") {
                    const name = plugin.name || file;
                    plugin.init(this);
                    this.plugins.set(name, plugin);
                  }
                } catch (e) {
                  process.stderr.write(
                    `Failed to load plugin ${file}: ${e.message}\n`,
                  );
                }
              }
            }
          } catch (e) {}
        }

        async run(inputs) {
          if (TermuxMedia) TermuxMedia.clearMediaNotification();

          for (const inp of inputs) this.playlist.push(...collectFiles(inp));
          if (!this.playlist.length) {
            process.stderr.write("No audio files found.\n");
            process.exit(1);
          }
          this.st.playlist = this.playlist;
          this.st.total = this.playlist.length;

          this.mpv.on("prop", (n, v) => this._onProp(n, v));
          this.mpv.on("event", (e, d) => this._onEvent(e, d));
          this.mpv.on("exit", () => {
            if (!this._dying) this._die("mpv exited unexpectedly.");
          });

          process.stdout.on("resize", () => {
            clearTimeout(this._resizeTimer);
            this._resizeTimer = setTimeout(() => this.ui.onResize(this.st), 80);
          });

          hideCursor();
          this._setupInput();

          const need = this.ui._calcLines(this.st, tw());
          wr("\n".repeat(need));

          // Initialize Discord RPC
          await this._initRPC();

          await this._load(0);
          this._renderTimer = setInterval(() => this._render(), 100);

          // Start end-of-track detection
          this._startEndCheck();
        }

        async _initRPC() {
          if (!DiscordRPC || !this.config.rpc.enabled) {
            this.st.rpcStatus = "RPC disabled";
            return;
          }

          const token = this.config.discord.token;
          if (!token) {
            this.st.rpcStatus = "No Discord token";
            return;
          }

          try {
            this.rpc = new DiscordRPC({
              token,
              logger: {
                info: (m) => {},
                success: (m) => {
                  this.st.rpcStatus = m;
                  this.st.rpcConnected = true;
                  // Show "RPC Connected" after 5 seconds of showing "Logged in as..."
                  setTimeout(() => {
                    if (this.st.rpcConnected) {
                      this.st.rpcStatus = "RPC Connected";
                    }
                  }, 5000);
                },
                warn: (m) => {
                  this.st.rpcStatus = m;
                  this.st.rpcConnected = false;
                },
                error: (m) => {
                  this.st.rpcStatus = m;
                  this.st.rpcConnected = false;
                },
                rpc: (m) => {},
                discord: (m) => {},
              },
            });

            this.st.rpcStatus = "RPC connecting...";
            this.rpc.connect().catch((e) => {
              this.st.rpcStatus = `RPC: ${e.message}`;
              this.st.rpcConnected = false;
            });
          } catch (e) {
            this.st.rpcStatus = `RPC: ${e.message}`;
            this.st.rpcConnected = false;
          }
        }

        // Detect end of track by monitoring position
        _startEndCheck() {
          if (this._endCheckTimer) clearInterval(this._endCheckTimer);

          this._endCheckTimer = setInterval(() => {
            if (this.st.playing && !this.st.paused && this.st.dur > 0) {
              const remaining = this.st.dur - this.st.pos;
              if (
                remaining < 1 &&
                Math.abs(this.st.pos - this._lastPos) < 0.1
              ) {
                if (!this._playbackEnded && !this._loading) {
                  this._playbackEnded = true;
                  this._advance("timer-stuck-pos");
                }
              } else {
                this._playbackEnded = false;
              }
            }
            this._lastPos = this.st.pos;
          }, 500);
        }

        async _load(idx) {
          if (idx < 0 || idx >= this.playlist.length) return;

          this._loading = true;
          this._playbackEnded = false;
          this.idx = idx;
          const file = this.playlist[idx];

          // Reset state BEFORE loading
          this.st.pos = 0;
          this.st.dur = 0;
          this.st.playing = false;
          this.st.paused = false;

          Object.assign(this.st, {
            file,
            index: idx,
            title: path.basename(file, path.extname(file)),
            artist: "",
            album: "",
            lyrics: loadLyrics(file),
            lyricIdx: -1,
            plainOffset: 0,
            fileInfo: null,
          });

          // Background probe
          const myProbeId = ++this._probeId;
          setImmediate(() => {
            if (myProbeId !== this._probeId) return;

            const cached = this._probeCache.get(file);
            const info = cached || probeFile(file);
            if (!cached) {
              if (this._probeCache.size >= this._maxCacheSize) {
                const firstKey = this._probeCache.keys().next().value;
                this._probeCache.delete(firstKey);
              }
              this._probeCache.set(file, info);
            }

            if (myProbeId !== this._probeId) return;

            this.st.fileInfo = info;
            if (!this.st.title && info.title) this.st.title = info.title;
            if (!this.st.artist && info.artist) this.st.artist = info.artist;
            if (!this.st.album && info.album) this.st.album = info.album;
            if (!this.st.dur && info.duration) this.st.dur = info.duration;

            this._updateRPC();
            this._updateTermux();
          });

          try {
            if (!this.mpv.ready) await this.mpv.start(file);
            else await this.mpv.loadFile(file);
            await this.mpv.setVolume(this.st.vol);
          } catch {
            this._loading = false;
            setTimeout(() => this._advance("load-error"), 500);
            return;
          }

          this._loading = false;
        }

        _updateRPC() {
          if (!this.rpc) return;
          this.rpc.queueUpdate({
            filePath: this.st.file,
            title: this.st.title,
            artist: this.st.artist,
            album: this.st.album,
            duration: this.st.dur,
            position: this.st.pos,
            paused: this.st.paused,
          });
        }

        _updateTermux() {
          if (TermuxMedia) TermuxMedia.updateMediaNotification(this.st);
        }

        // Immediate RPC update for pause/resume (no debounce)
        _updateRPCPause() {
          if (!this.rpc) return;
          this.rpc.updatePauseState({
            filePath: this.st.file,
            title: this.st.title,
            artist: this.st.artist,
            album: this.st.album,
            duration: this.st.dur,
            position: this.st.pos,
            paused: this.st.paused,
          });
        }

        // Immediate RPC update for seek (no debounce)
        _updateRPCSeek() {
          if (!this.rpc) return;
          this.rpc.updateSeekState({
            filePath: this.st.file,
            title: this.st.title,
            artist: this.st.artist,
            album: this.st.album,
            duration: this.st.dur,
            position: this.st.pos,
            paused: this.st.paused,
          });
        }

        // Seek with RPC update
        async _seekRPC(amount) {
          await this.mpv.seek(amount);
          // Small delay to let mpv update position
          setTimeout(() => this._updateRPCSeek(), 100);
        }

        // Absolute seek with RPC update
        async _seekAbsoluteRPC(position) {
          await this.mpv.seek(position, "absolute");
          setTimeout(() => this._updateRPCSeek(), 100);
        }

        _render() {
          this.ui.render(this.st);
        }

        _onProp(name, val) {
          if (val === null || val === undefined) return;

          switch (name) {
            case "pause":
              this.st.paused = val === true;
              this.st.playing = val === false;
              // Update RPC on pause/resume (immediate, no debounce)
              this._updateRPCPause();
              this._updateTermux();
              break;
            case "time-pos":
              this.st.pos = val;
              this._syncLyric();
              break;
            case "duration":
              if (val > 0) {
                this.st.dur = val;
                this._updateRPC();
              }
              break;
            case "volume":
              this.st.vol = Math.round(val);
              break;
            case "mute":
              this.st.muted = !!val;
              break;
            case "metadata":
              if (typeof val === "object") {
                const get = (...keys) => {
                  for (const k of keys)
                    for (const [mk, mv] of Object.entries(val))
                      if (mk.toLowerCase() === k.toLowerCase() && mv) return mv;
                  return "";
                };
                this.st.title = get("title") || this.st.title;
                this.st.artist =
                  get("artist", "album_artist") || this.st.artist;
                this.st.album = get("album") || this.st.album;
                this._updateRPC();
                this._updateTermux();
              }
              break;
            case "media-title":
              if (val && !this.st.title) {
                this.st.title = val;
                this._updateTermux();
              }
              break;
            case "eof-reached":
            case "playback-abort":
              if (val === true && !this._loading && !this._playbackEnded) {
                this._playbackEnded = true;
                setImmediate(() => this._advance("prop-" + name));
              }
              break;
          }
        }

        _onEvent(event, data) {
          if (event === "client-message") {
            const [app, cmd] = data.args || [];
            if (app === "tplay") {
              if (cmd === "next") this._nextTrack();
              if (cmd === "prev") this._prevTrack();
            }
          }

          if (event === "end-file") {
            if (this._loading) return;
            const r = data && data.reason;
            if (
              r === "eof" ||
              r === "quit" ||
              r === "error" ||
              r === "stop" ||
              !r
            ) {
              if (!this._playbackEnded) {
                this._playbackEnded = true;
                setTimeout(
                  () => this._advance("event-end-file"),
                  r === "error" ? 300 : 50,
                );
              }
            }
          }

          if (event === "start-file") {
            this.st.playing = true;
            this.st.paused = false;
            this._playbackEnded = false;
            this.st.pos = 0;
          }

          if (event === "file-loaded") {
            this._playbackEnded = false;
            this._updateRPC();
          }
        }

        _advance(reason = "unknown") {
          if (this._loading) return;

          if (this.st.repeat === "one") {
            this._load(this.idx);
          } else if (this.st.shuffle) {
            this._nextShuffle();
          } else if (this.idx + 1 < this.playlist.length) {
            this._load(this.idx + 1);
          } else if (this.st.repeat === "all") {
            this._load(0);
          } else {
            this.st.playing = false;
            this.st.paused = false;
            if (this.rpc) this.rpc.queueUpdate(null);
          }
        }

        _prevTrack() {
          this._playbackEnded = true;
          if (this.st.shuffle) {
            this._prevShuffle();
            return;
          }
          if (this.idx > 0) {
            this._load(this.idx - 1);
          } else if (this.st.repeat === "all") {
            this._load(this.playlist.length - 1);
          } else {
            this._seekAbsoluteRPC(0);
          }
        }

        _nextTrack() {
          this._playbackEnded = true;
          if (this.st.shuffle) {
            this._nextShuffle();
            return;
          }
          if (this.idx + 1 < this.playlist.length) this._load(this.idx + 1);
          else if (this.st.repeat === "all") this._load(0);
        }

        _buildShuffle() {
          const n = this.playlist.length;
          const list = Array.from({ length: n }, (_, i) => i);
          // Fisher-Yates shuffle
          for (let i = n - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];
          }
          this._shuffleList = list;
          this._shuffleIdx = Math.max(0, this._shuffleList.indexOf(this.idx));
        }

        _reshuffle() {
          const n = this.playlist.length;
          if (n <= 1) return;

          // Get current playing file
          const currentFile = this.playlist[this.idx];

          // Remove current file from playlist to shuffle others
          const otherFiles = this.playlist.filter((_, i) => i !== this.idx);

          // Fisher-Yates shuffle the remaining files
          for (let i = otherFiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [otherFiles[i], otherFiles[j]] = [otherFiles[j], otherFiles[i]];
          }

          // Rebuild playlist: current file first, then shuffled others
          this.playlist = [currentFile, ...otherFiles];

          // Update index to 0 since current file is now at the top
          this.idx = 0;
          this.st.index = this.idx;
          this.st.playlist = this.playlist;

          // Rebuild the shuffle traversal list if shuffle mode is on
          if (this.st.shuffle) this._buildShuffle();

          const oldStatus = this.st.rpcStatus;
          this.st.rpcStatus = "Playlist Shuffled (Current at Top)";
          this.ui.onResize(this.st);
          setTimeout(() => {
            if (this.st.rpcStatus === "Playlist Shuffled (Current at Top)") {
              this.st.rpcStatus = oldStatus;
              this.ui.onResize(this.st);
            }
          }, 2000);
        }

        _nextShuffle() {
          this._playbackEnded = true;
          if (!this._shuffleList.length) this._buildShuffle();
          this._shuffleIdx = (this._shuffleIdx + 1) % this._shuffleList.length;
          this._load(this._shuffleList[this._shuffleIdx]);
        }

        _prevShuffle() {
          this._playbackEnded = true;
          if (!this._shuffleList.length) this._buildShuffle();
          this._shuffleIdx =
            (this._shuffleIdx - 1 + this._shuffleList.length) %
            this._shuffleList.length;
          this._load(this._shuffleList[this._shuffleIdx]);
        }

        _syncLyric() {
          const { lyrics, pos } = this.st;
          if (lyrics && lyrics.type === "synced")
            this.st.lyricIdx = getLyricIdx(lyrics, pos);
        }

        _setupInput() {
          const stdin = process.stdin;
          if (!stdin.isTTY) return;
          stdin.setRawMode(true);
          stdin.resume();

          let seq = "",
            seqTimer = null;
          const flush = () => {
            if (!seq) return;
            this._handleSeq(seq);
            seq = "";
          };

          stdin.on("data", (buf) => {
            for (let i = 0; i < buf.length; i++) {
              const b = buf[i],
                ch = String.fromCharCode(b);
              if (b === 3 || b === 4) {
                this._quit();
                return;
              }
              if (b === 0x1b) {
                flush();
                seq = "\x1b";
                clearTimeout(seqTimer);
                seqTimer = setTimeout(flush, 80);
              } else if (seq) {
                seq += ch;
                clearTimeout(seqTimer);
                seqTimer = setTimeout(flush, 80);
              } else {
                this._handleKey(ch, b);
              }
            }
          });
        }

        _handleSeq(seq) {
          this.emit("seq", seq);
          switch (seq) {
            case "\x1b[A":
            case "\x1bOA":
              this._volChange(+5);
              break;
            case "\x1b[B":
            case "\x1bOB":
              this._volChange(-5);
              break;
            case "\x1b[C":
            case "\x1bOC":
              this._seekRPC(+10);
              break;
            case "\x1b[D":
            case "\x1bOD":
              this._seekRPC(-10);
              break;
            case "\x1b[1;5C":
            case "\x1b[5C":
            case "\x1bOc":
            case "\x1b[1;3C":
            case "\x1b\x1b[C":
              this._nextTrack();
              break;
            case "\x1b[1;5D":
            case "\x1b[5D":
            case "\x1bOd":
            case "\x1b[1;3D":
            case "\x1b\x1b[D":
              this._prevTrack();
              break;
            case "\x1b[1;2C":
              this._nextTrack();
              break;
            case "\x1b[1;2D":
              this._prevTrack();
              break;
            case "\x1b[5~":
              this._prevTrack();
              break;
            case "\x1b[6~":
              this._nextTrack();
              break;
            case "\x1b[H":
            case "\x1b[1~":
            case "\x1bOH":
              this._seekAbsoluteRPC(0);
              break;
            case "\x1b[F":
            case "\x1b[4~":
            case "\x1bOF":
              if (this.st.dur > 0) this._seekAbsoluteRPC(this.st.dur - 2);
              break;
            case "\x1b[3~":
              this._nextTrack();
              break;
            case "\x1b[1;5A":
            case "\x1b[5A":
              this._volChange(+10);
              break;
            case "\x1b[1;5B":
            case "\x1b[5B":
              this._volChange(-10);
              break;
            case "\x1b\x13": // Ctrl+Alt+S
            case "\x1bs": // Alt+s
            case "\x1bS": // Alt+S
              this._reshuffle();
              break;
          }
        }

        _handleKey(ch, byte) {
          this.emit("key", ch, byte);
          switch (ch) {
            case " ":
              this.mpv.togglePause();
              break;
            case "q":
            case "Q":
              this._quit();
              break;
            case "m":
            case "M":
              this.st.muted = !this.st.muted;
              this.mpv.setMute(this.st.muted);
              break;
            case "r":
            case "R":
              this._cycleRepeat();
              break;
            case "s":
            case "S":
            case "\x13": // Ctrl+S
              this.st.shuffle = !this.st.shuffle;
              if (this.st.shuffle) this._buildShuffle();
              break;
            case "\x1b\x13": // Ctrl+Alt+S (Some terminals)
              this._reshuffle();
              break;
            case "i":
            case "I":
              this.ui.showInfo = !this.ui.showInfo;
              if (this.ui.showInfo) wr("\n".repeat(4));
              this.ui.onResize(this.st);
              break;
            case "p":
            case "P":
              this.ui.showPlaylist = !this.ui.showPlaylist;
              if (this.ui.showPlaylist)
                wr("\n".repeat(Math.min(6, this.playlist.length) + 2));
              this.ui.onResize(this.st);
              break;
            case "n":
              this._nextTrack();
              break;
            case "b":
              this._prevTrack();
              break;
            case ",":
              this._seekRPC(-5);
              break;
            case ".":
              this._seekRPC(+5);
              break;
            case "[":
              this._seekRPC(-30);
              break;
            case "]":
              this._seekRPC(+30);
              break;
            case "+":
            case "=":
              this._volChange(+5);
              break;
            case "-":
            case "_":
              this._volChange(-5);
              break;
            default:
              if (ch >= "1" && ch <= "9" && this.st.dur > 0)
                this._seekAbsoluteRPC((this.st.dur * parseInt(ch) * 10) / 100);
              else if (ch === "0") this._seekAbsoluteRPC(0);
          }
        }

        _volChange(d) {
          this.st.vol = clamp((this.st.vol || 80) + d, 0, 130);
          this.mpv.setVolume(this.st.vol);
        }

        _cycleRepeat() {
          const m = ["none", "one", "all"];
          this.st.repeat = m[(m.indexOf(this.st.repeat) + 1) % m.length];
        }

        async _quit() {
          if (this._dying) return;
          this._dying = true;

          clearInterval(this._renderTimer);
          clearInterval(this._endCheckTimer);
          clearTimeout(this._resizeTimer);

          showCursor();
          if (process.stdin.isTTY)
            try {
              process.stdin.setRawMode(false);
            } catch {}

          wr("\n");

          if (this.rpc) {
            this.rpc.queueUpdate(null);
            this.rpc.disconnect();
          }
          if (TermuxMedia) TermuxMedia.clearMediaNotification();

          await this.mpv.quit();
          process.exit(0);
        }

        _die(msg) {
          if (TermuxMedia) TermuxMedia.clearMediaNotification();
          clearInterval(this._renderTimer);
          clearInterval(this._endCheckTimer);
          showCursor();
          if (process.stdin.isTTY)
            try {
              process.stdin.setRawMode(false);
            } catch {}
          process.stderr.write("\n" + msg + "\n");
          process.exit(1);
        }
      }

      module.exports = { Player };

      /***/
    },

    /***/ 308: /***/ (
      module,
      __unused_webpack_exports,
      __nccwpck_require__,
    ) => {
      "use strict";

      const path = __nccwpck_require__(928);
      const {
        T,
        cc,
        tw,
        th,
        wr,
        clrLine,
        gotoRow,
        saveCur,
        restCur,
        trunc,
        fmtTime,
        fmtSize,
        fmtCh,
        lpad,
        rpad,
        vlen,
        clamp,
      } = __nccwpck_require__(921);

      class Renderer {
        constructor() {
          this.showPlaylist = false;
          this.showInfo = false;
          this._drawnRows = [];
        }

        _calcLines(st, W) {
          let n = 5;
          if (st.lyrics && !st.hideLyrics) {
            n +=
              st.lyrics.type === "synced"
                ? 5
                : Math.min(5, st.lyrics.lines.length);
            n += 1;
          }
          if (this.showInfo) {
            n += 3 + 1;
          }
          if (this.showPlaylist && st.playlist.length > 0) {
            n += Math.min(6, st.playlist.length) + 1 + 1;
          }
          if (st.rpcStatus) n += 1;
          n += 1;
          return n;
        }

        render(st) {
          const W = tw(),
            H = th();
          const lines = this._buildLines(st, W);
          const need = lines.length;
          const startRow = Math.max(1, H - need + 1);

          saveCur();
          for (const r of this._drawnRows) {
            if (r < startRow) {
              gotoRow(r);
              clrLine();
            }
          }

          this._drawnRows = [];
          for (let i = 0; i < lines.length; i++) {
            const row = startRow + i;
            this._drawnRows.push(row);
            gotoRow(row);
            clrLine();
            wr(lines[i]);
          }
          restCur();
        }

        onResize(st) {
          saveCur();
          for (const r of this._drawnRows) {
            gotoRow(r);
            clrLine();
          }
          this._drawnRows = [];
          restCur();
          this.render(st);
        }

        _buildLines(st, W) {
          const out = [];
          const sep = cc(T.dim, T.cyan, "─".repeat(W));

          out.push(sep);

          // Title
          {
            const icon = st.paused
              ? cc(T.bold, T.yellow, "⏸")
              : st.playing
                ? cc(T.bold, T.bGreen, "▶")
                : cc(T.dim, T.gray, "⏹");
            const idxStr =
              st.total > 0 ? cc(T.dim, `[${st.index + 1}/${st.total}]`) : "";
            const idxLen =
              st.total > 0 ? `[${st.index + 1}/${st.total}]`.length : 0;
            const avail = W - 4 - idxLen;
            const title = trunc(
              st.title || path.basename(st.file || "", ""),
              Math.floor(avail * 0.6),
            );
            const artist = st.artist
              ? trunc(" — " + st.artist, Math.floor(avail * 0.4))
              : "";
            out.push(
              ` ${icon} ${cc(T.bold, T.bCyan, title)}${cc(T.yellow, artist)} ${idxStr}`,
            );
          }

          // Progress
          {
            const pos = st.pos || 0,
              dur = st.dur || 0;
            const tStr = `${fmtTime(pos)}/${fmtTime(dur)}`;
            const barW = Math.max(4, W - tStr.length - 3);
            const fill =
              dur > 0 ? clamp(Math.round((pos / dur) * barW), 0, barW) : 0;
            const bar =
              cc(T.bold, T.cyan, "━".repeat(fill)) +
              cc(T.dim, T.gray, "─".repeat(barW - fill));
            out.push(` ${bar} ${cc(T.bGreen, tStr)}`);
          }

          // Status
          {
            const vbW = 7,
              vFill = Math.round((st.vol / 130) * vbW);
            const volBar =
              cc(T.green, "▮".repeat(clamp(vFill, 0, vbW))) +
              cc(T.dim, "▯".repeat(Math.max(0, vbW - vFill)));
            const volIcon = st.muted ? cc(T.red, "✕") : cc(T.green, "♪");
            const volStr = `${volIcon}${volBar}${cc(T.bGreen, lpad(st.vol + "%", 4))}`;

            const repStr =
              st.repeat === "one"
                ? cc(T.bMagenta, "↺¹")
                : st.repeat === "all"
                  ? cc(T.bMagenta, "↻ ")
                  : cc(T.dim, "→ ");
            const shufStr = st.shuffle ? cc(T.bMagenta, "⇄") : cc(T.dim, "⇄");
            const lyrStr = !st.lyrics
              ? cc(T.dim, "∅lyr")
              : st.hideLyrics
                ? cc(T.dim, "✖lyr")
                : st.lyrics.src === "lrc"
                  ? cc(T.bYellow, "♪lrc")
                  : st.lyrics.src === "embedded"
                    ? cc(T.bYellow, "♪emb")
                    : cc(T.yellow, "♪txt");
            const albumStr = st.album
              ? cc(T.dim, trunc(` 💿 ${st.album}`, Math.floor(W / 3)))
              : "";

            const left = ` ${volStr}  ${repStr} ${shufStr} ${lyrStr}`;
            const right = `${albumStr} `;
            const gap = W - vlen(left) - vlen(right);
            out.push(left + " ".repeat(Math.max(1, gap)) + right);
          }

          out.push(sep);

          // Lyrics
          if (st.lyrics && !st.hideLyrics) {
            out.push(...this._buildLyrics(st, W));
            out.push(sep);
          }

          // File Info
          if (this.showInfo) {
            out.push(...this._buildInfo(st, W));
            out.push(sep);
          }

          // Playlist
          if (this.showPlaylist && st.playlist.length > 0) {
            out.push(...this._buildPlaylist(st, W));
            out.push(sep);
          }

          // RPC Status
          if (st.rpcStatus) {
            const rpcIcon = st.rpcConnected
              ? cc(T.bGreen, "🔗")
              : cc(T.dim, "🔓");
            out.push(` ${rpcIcon} ${cc(T.dim, st.rpcStatus)}`);
          }

          // Help
          out.push(this._buildHelp(W));

          return out;
        }

        _buildLyrics(st, W) {
          const { lyrics, lyricIdx } = st,
            maxW = W - 4,
            out = [];
          if (lyrics.type === "synced") {
            const CTX = 2;
            for (let i = lyricIdx - CTX; i <= lyricIdx + CTX; i++) {
              if (i < 0 || i >= lyrics.lines.length) {
                out.push("");
                continue;
              }
              const text = trunc(lyrics.lines[i].text || "♪", maxW);
              const pad = Math.max(0, Math.floor((W - text.length) / 2));
              const sp = " ".repeat(pad);
              if (i === lyricIdx)
                out.push(sp + cc(T.bold, T.bWhite, "▸ " + text));
              else if (Math.abs(i - lyricIdx) === 1)
                out.push(sp + "  " + cc(T.dim, T.white, text));
              else out.push(sp + "  " + cc(T.dim, T.gray, text));
            }
          } else {
            const lines = lyrics.lines,
              start = st.plainOffset || 0;
            for (let i = start; i < Math.min(start + 5, lines.length); i++) {
              const text = trunc(lines[i], maxW);
              const pad = Math.max(0, Math.floor((W - text.length) / 2));
              out.push(
                " ".repeat(pad) +
                  (i === start
                    ? cc(T.bold, T.bWhite, text)
                    : cc(T.dim, T.gray, text)),
              );
            }
            while (out.length < 5) out.push("");
          }
          return out;
        }

        _buildInfo(st, W) {
          const info = st.fileInfo || {},
            col = Math.floor((W - 2) / 3),
            out = [];
          const fields = [
            ["Codec", (info.codec || "?").toUpperCase()],
            ["Bitrate", info.bitrate ? `${info.bitrate}kbps` : "?"],
            ["Size", fmtSize(info.fileSize)],
            [
              "Sample",
              info.sampleRate
                ? `${(info.sampleRate / 1000).toFixed(1)}kHz`
                : "?",
            ],
            ["Ch", fmtCh(info.channels, info.channelLayout)],
            ["Bits", info.bitsPerSample ? `${info.bitsPerSample}bit` : "?"],
            ["Year", info.year || "?"],
            ["Genre", trunc(info.genre || "?", col - 8)],
            ["Track", info.trackNum || "?"],
          ];
          for (let row = 0; row < 3; row++) {
            let line = " ";
            for (let c2 = 0; c2 < 3; c2++) {
              const [label, val] = fields[row * 3 + c2];
              const cell =
                cc(T.dim, T.cyan, label + ": ") +
                cc(T.bWhite, trunc(val, col - label.length - 4));
              line += rpad(cell, col);
            }
            out.push(line);
          }
          return out;
        }

        _buildPlaylist(st, W) {
          const out = [],
            pl = st.playlist,
            cur = st.index;
          const show = Math.min(6, pl.length);
          const start = clamp(cur - 2, 0, Math.max(0, pl.length - show));
          out.push(
            cc(
              T.dim,
              ` Playlist  ${start + 1}–${Math.min(start + show, pl.length)} of ${pl.length}`,
            ),
          );
          for (let i = start; i < start + show && i < pl.length; i++) {
            const name = trunc(
              path.basename(pl[i], path.extname(pl[i])),
              W - 6,
            );
            out.push(
              i === cur
                ? ` ${cc(T.bCyan, "▶")} ${cc(T.bold, T.bWhite, name)}`
                : `   ${cc(T.dim, name)}`,
            );
          }
          return out;
        }

        _buildHelp(W) {
          const keys =
            W >= 100
              ? [
                  ["Spc", "Pause"],
                  ["←→", "±10s"],
                  ["C-←→", "Prev/Next"],
                  ["↑↓", "Vol"],
                  ["+−", "Vol"],
                  [",.", "±5s"],
                  ["[]", "±30s"],
                  ["0-9", "Jump%"],
                  ["m", "Mute"],
                  ["r", "Repeat"],
                  ["s", "Shuffle"],
                  ["i", "Info"],
                  ["p", "List"],
                  ["q", "Quit"],
                ]
              : W >= 70
                ? [
                    ["Spc", "Pause"],
                    ["←→", "±10s"],
                    ["C-←→", "Skip"],
                    ["↑↓", "Vol"],
                    ["m", "Mute"],
                    ["r", "Rpt"],
                    ["s", "Shuf"],
                    ["i", "Info"],
                    ["p", "List"],
                    ["q", "Quit"],
                  ]
                : [
                    ["Spc", "❙❙"],
                    ["←→", "seek"],
                    ["C-←→", "skip"],
                    ["↑↓", "vol"],
                    ["q", "quit"],
                  ];
          let line = " ";
          for (const [k, v] of keys) {
            const part = cc(T.bold, T.yellow, k) + cc(T.dim, ":" + v + "  ");
            if (vlen(line) + k.length + v.length + 3 > W - 1) break;
            line += part;
          }
          return line;
        }
      }

      module.exports = { Renderer };

      /***/
    },

    /***/ 465: /***/ (
      module,
      __unused_webpack_exports,
      __nccwpck_require__,
    ) => {
      const { exec } = __nccwpck_require__(317);
      const os = __nccwpck_require__(857);
      const fs = __nccwpck_require__(896);
      const path = __nccwpck_require__(928);

      const isAndroid =
        process.platform === "android" ||
        (process.env.PREFIX && process.env.PREFIX.includes("com.termux"));

      let notificationDebounceTimer = null;

      /**
       * Updates the Termux media notification.
       * @param {Object} st The player state
       */
      function updateMediaNotification(st) {
        if (!isAndroid) return;

        if (notificationDebounceTimer) clearTimeout(notificationDebounceTimer);

        notificationDebounceTimer = setTimeout(() => {
          const title = (st.title || "Unknown Title").replace(/"/g, '\\"');
          const artist = (st.artist || "Unknown Artist").replace(/"/g, '\\"');
          const status = st.paused ? "Paused" : "Playing";

          const controlPath = __nccwpck_require__.ab + "control.js";
          const nodeBin = process.execPath;

          const command = [
            `termux-notification`,
            `--title "${title}"`,
            `--content "${artist} (${status})"`,
            `--type media`,
            `--id tplay-player`,
            `--media-pause "${nodeBin} ${controlPath} pause"`,
            `--media-play "${nodeBin} ${controlPath} play"`,
            `--media-next "${nodeBin} ${controlPath} next"`,
            `--media-previous "${nodeBin} ${controlPath} prev"`,
          ].join(" ");

          exec(command, (error) => {
            if (error) {
              // Silently fail if termux-api is not installed or other issues
            }
          });
        }, 100);
      }

      /**
       * Clears the Termux notification.
       */
      function clearMediaNotification() {
        if (!isAndroid) return;
        if (notificationDebounceTimer) {
          clearTimeout(notificationDebounceTimer);
          notificationDebounceTimer = null;
        }
        exec("termux-notification-remove tplay-player");
      }

      module.exports = {
        updateMediaNotification,
        clearMediaNotification,
        isAndroid,
      };

      /***/
    },

    /***/ 404: /***/ (
      module,
      __unused_webpack_exports,
      __nccwpck_require__,
    ) => {
      "use strict";

      const path = __nccwpck_require__(928);
      const fs = __nccwpck_require__(896);
      const { execFileSync } = __nccwpck_require__(317);

      function findMpv() {
        const candidates = [
          "mpv",
          "/usr/bin/mpv",
          "/usr/local/bin/mpv",
          "/data/data/com.termux/files/usr/bin/mpv",
          "C:\\Program Files\\mpv\\mpv.exe",
          "C:\\Program Files (x86)\\mpv\\mpv.exe",
        ];
        for (const bin of candidates) {
          try {
            execFileSync(bin, ["--version"], {
              stdio: "ignore",
              timeout: 2000,
            });
            return bin;
          } catch {}
        }
        const pathDirs = (process.env.PATH || "").split(path.delimiter);
        for (const dir of pathDirs) {
          const full = path.join(
            dir,
            process.platform === "win32" ? "mpv.exe" : "mpv",
          );
          try {
            fs.accessSync(full, fs.constants.X_OK);
            execFileSync(full, ["--version"], {
              stdio: "ignore",
              timeout: 2000,
            });
            return full;
          } catch {}
        }
        return null;
      }

      function findBin(name) {
        const exts = process.platform === "win32" ? [".exe", ""] : [""];
        const dirs = (process.env.PATH || "").split(path.delimiter);
        const extra = [
          "/usr/bin",
          "/usr/local/bin",
          "/data/data/com.termux/files/usr/bin",
        ];
        for (const dir of [...dirs, ...extra]) {
          for (const ext of exts) {
            const full = path.join(dir, name + ext);
            try {
              fs.accessSync(full, fs.constants.X_OK);
              return full;
            } catch {}
          }
        }
        return null;
      }

      module.exports = { findMpv, findBin };

      /***/
    },

    /***/ 269: /***/ (
      module,
      __unused_webpack_exports,
      __nccwpck_require__,
    ) => {
      "use strict";

      const path = __nccwpck_require__(928);
      const fs = __nccwpck_require__(896);
      const { AUDIO_EXTS } = __nccwpck_require__(952);

      function collectFiles(p) {
        const files = [];
        try {
          const st = fs.statSync(p);
          if (st.isFile()) {
            if (AUDIO_EXTS.has(path.extname(p).toLowerCase()))
              files.push(path.resolve(p));
          } else if (st.isDirectory()) {
            const entries = fs
              .readdirSync(p)
              .sort((a, b) =>
                a.localeCompare(b, undefined, {
                  numeric: true,
                  sensitivity: "base",
                }),
              );
            for (const e of entries) {
              const full = path.join(p, e);
              try {
                const s = fs.statSync(full);
                if (s.isFile() && AUDIO_EXTS.has(path.extname(e).toLowerCase()))
                  files.push(path.resolve(full));
                else if (s.isDirectory()) files.push(...collectFiles(full));
              } catch {}
            }
          }
        } catch {}
        return files;
      }

      module.exports = { collectFiles };

      /***/
    },

    /***/ 952: /***/ (
      module,
      __unused_webpack_exports,
      __nccwpck_require__,
    ) => {
      "use strict";

      const fs = __nccwpck_require__(896);
      const { execFileSync } = __nccwpck_require__(317);
      const { findBin } = __nccwpck_require__(404);

      const AUDIO_EXTS = new Set([
        ".mp3",
        ".flac",
        ".ogg",
        ".opus",
        ".m4a",
        ".aac",
        ".wav",
        ".wma",
        ".ape",
        ".wv",
        ".mka",
        ".mp4",
        ".m4b",
        ".aiff",
        ".aif",
        ".webm",
        ".mkv",
        ".tta",
        ".dsf",
        ".dff",
        ".ac3",
        ".dts",
      ]);

      function probeFile(filePath) {
        const info = {
          duration: 0,
          bitrate: 0,
          sampleRate: 0,
          channels: 0,
          channelLayout: "",
          codec: "",
          fileSize: 0,
          format: "",
          bitsPerSample: 0,
          title: "",
          artist: "",
          album: "",
          year: "",
          genre: "",
          trackNum: "",
        };
        try {
          info.fileSize = fs.statSync(filePath).size;
        } catch {}

        const ff = findBin("ffprobe");
        if (!ff) return info;
        try {
          const out = execFileSync(
            ff,
            [
              "-v",
              "quiet",
              "-print_format",
              "json",
              "-show_format",
              "-show_streams",
              filePath,
            ],
            { timeout: 5000, encoding: "utf8" },
          );
          const data = JSON.parse(out);
          const fmt = data.format || {};
          const tags = fmt.tags || {};
          const audio =
            (data.streams || []).find((s) => s.codec_type === "audio") || {};

          info.duration = parseFloat(fmt.duration || audio.duration || 0);
          info.bitrate = Math.round(
            parseInt(fmt.bit_rate || audio.bit_rate || 0) / 1000,
          );
          info.sampleRate = parseInt(audio.sample_rate || 0);
          info.channels = parseInt(audio.channels || 0);
          info.channelLayout = audio.channel_layout || "";
          info.codec = audio.codec_name || "";
          info.bitsPerSample = parseInt(
            audio.bits_per_raw_sample || audio.bits_per_sample || 0,
          );
          info.format = fmt.format_long_name || fmt.format_name || "";

          const t = Object.fromEntries(
            Object.entries(tags).map(([k, v]) => [k.toLowerCase(), v]),
          );
          info.title = t.title || "";
          info.artist = t.artist || t.album_artist || "";
          info.album = t.album || "";
          info.year = t.date || t.year || "";
          info.genre = t.genre || "";
          info.trackNum = t.track || "";
        } catch {}
        return info;
      }

      module.exports = { AUDIO_EXTS, probeFile };

      /***/
    },

    /***/ 197: /***/ (
      module,
      __unused_webpack_exports,
      __nccwpck_require__,
    ) => {
      "use strict";

      const path = __nccwpck_require__(928);
      const fs = __nccwpck_require__(896);

      function parseLRC(content) {
        const lines = content.split("\n"),
          result = [];
        const rx = /\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g;
        let offset = 0;
        for (const raw of lines) {
          const line = raw.trim();
          if (!line) continue;
          const om = line.match(/\[offset:\s*(-?\d+)\]/i);
          if (om) {
            offset = parseInt(om[1]);
            continue;
          }
          if (/^\[(ar|ti|al|by|re|ve):/i.test(line)) continue;
          const times = [];
          let m,
            lastEnd = 0;
          rx.lastIndex = 0;
          while ((m = rx.exec(line)) !== null) {
            times.push(
              parseInt(m[1]) * 60 +
                parseInt(m[2]) +
                (m[3] ? parseInt(m[3].padEnd(3, "0")) : 0) / 1000 +
                offset / 1000,
            );
            lastEnd = m.index + m[0].length;
          }
          if (times.length) {
            const text = line.slice(lastEnd).trim();
            for (const t of times) result.push({ time: t, text });
          }
        }
        return result.sort((a, b) => a.time - b.time);
      }

      function extractID3Lyrics(buf) {
        if (buf[0] !== 0x49 || buf[1] !== 0x44 || buf[2] !== 0x33) return null;
        const ver = buf[3];
        let pos = 10;
        if (buf[5] & 0x40) {
          const sz =
            ((buf[10] & 0x7f) << 21) |
            ((buf[11] & 0x7f) << 14) |
            ((buf[12] & 0x7f) << 7) |
            (buf[13] & 0x7f);
          pos += sz + 4;
        }
        while (pos + 10 < buf.length) {
          const fid = buf.slice(pos, pos + 4).toString("ascii");
          if (/^\x00+$/.test(fid)) break;
          let sz =
            ver >= 4
              ? ((buf[pos + 4] & 0x7f) << 21) |
                ((buf[pos + 5] & 0x7f) << 14) |
                ((buf[pos + 6] & 0x7f) << 7) |
                (buf[pos + 7] & 0x7f)
              : buf.readUInt32BE(pos + 4);
          if (sz <= 0 || sz > 20000000) break;
          if (fid === "USLT") {
            const fd = buf.slice(pos + 10, pos + 10 + sz),
              enc = fd[0];
            let s = 4;
            if (enc === 1 || enc === 2) {
              while (s + 1 < fd.length && !(fd[s] === 0 && fd[s + 1] === 0))
                s += 2;
              s += 2;
              return fd.slice(s).toString("utf16le");
            } else {
              while (s < fd.length && fd[s] !== 0) s++;
              s++;
              return fd.slice(s).toString(enc === 3 ? "utf8" : "latin1");
            }
          }
          pos += 10 + sz;
        }
        return null;
      }

      function extractFlacLyrics(buf) {
        if (buf.slice(0, 4).toString() !== "fLaC") return null;
        let pos = 4;
        while (pos + 4 < buf.length) {
          const h = buf[pos],
            type = h & 0x7f,
            last = (h & 0x80) !== 0,
            sz = (buf[pos + 1] << 16) | (buf[pos + 2] << 8) | buf[pos + 3];
          pos += 4;
          if (type === 4) return parseVorbisComment(buf.slice(pos, pos + sz));
          pos += sz;
          if (last) break;
        }
        return null;
      }

      function parseVorbisComment(data) {
        try {
          let pos = 0;
          const vl = data.readUInt32LE(pos);
          pos += 4 + vl;
          const cc = data.readUInt32LE(pos);
          pos += 4;
          for (let i = 0; i < cc; i++) {
            const len = data.readUInt32LE(pos);
            pos += 4;
            const cmt = data.slice(pos, pos + len).toString("utf8");
            pos += len;
            const eq = cmt.indexOf("=");
            if (eq !== -1) {
              const k = cmt.slice(0, eq).toUpperCase();
              if (k === "LYRICS" || k === "UNSYNCEDLYRICS")
                return cmt.slice(eq + 1);
            }
          }
        } catch {}
        return null;
      }

      function loadLyrics(filePath) {
        const dir = path.dirname(filePath),
          base = path.basename(filePath, path.extname(filePath));
        const lrc = path.join(dir, base + ".lrc");
        if (fs.existsSync(lrc)) {
          try {
            const txt = fs.readFileSync(lrc, "utf8"),
              parsed = parseLRC(txt);
            if (parsed.length)
              return { type: "synced", lines: parsed, src: "lrc" };
            const plain = txt
              .split("\n")
              .map((l) => l.trim())
              .filter(Boolean);
            if (plain.length)
              return { type: "plain", lines: plain, src: "lrc" };
          } catch {}
        }
        try {
          const ext = path.extname(filePath).toLowerCase();
          const fd = fs.openSync(filePath, "r"),
            sz = Math.min(fs.fstatSync(fd).size, 524288);
          const buf = Buffer.alloc(sz);
          fs.readSync(fd, buf, 0, sz, 0);
          fs.closeSync(fd);
          let raw = null;
          if (ext === ".mp3") raw = extractID3Lyrics(buf);
          if (ext === ".flac") raw = extractFlacLyrics(buf);
          if (raw) {
            const parsed = parseLRC(raw);
            if (parsed.length)
              return { type: "synced", lines: parsed, src: "embedded" };
            const plain = raw
              .split("\n")
              .map((l) => l.trim())
              .filter(Boolean);
            if (plain.length)
              return { type: "plain", lines: plain, src: "embedded" };
          }
        } catch {}
        return null;
      }

      function getLyricIdx(lyrics, pos) {
        if (!lyrics || lyrics.type !== "synced") return -1;
        const lines = lyrics.lines;
        let lo = 0,
          hi = lines.length - 1,
          idx = -1;
        while (lo <= hi) {
          const mid = (lo + hi) >> 1;
          if (lines[mid].time <= pos) {
            idx = mid;
            lo = mid + 1;
          } else hi = mid - 1;
        }
        return idx;
      }

      module.exports = { loadLyrics, getLyricIdx };

      /***/
    },

    /***/ 921: /***/ (module) => {
      "use strict";

      const out = process.stdout;
      const ESC = "\x1b[";

      const T = {
        reset: "\x1b[0m",
        bold: "\x1b[1m",
        dim: "\x1b[2m",
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        gray: "\x1b[90m",
        bRed: "\x1b[91m",
        bGreen: "\x1b[92m",
        bYellow: "\x1b[93m",
        bBlue: "\x1b[94m",
        bMagenta: "\x1b[95m",
        bCyan: "\x1b[96m",
        bWhite: "\x1b[97m",
      };

      function wr(s) {
        out.write(s);
      }
      function clrLine() {
        out.write(ESC + "2K\r");
      }
      function gotoRow(r) {
        out.write(ESC + r + ";1H");
      }
      function hideCursor() {
        out.write(ESC + "?25l");
      }
      function showCursor() {
        out.write(ESC + "?25h");
      }
      function saveCur() {
        out.write("\x1b7");
      }
      function restCur() {
        out.write("\x1b8");
      }

      function cc(...p) {
        return p.join("") + T.reset;
      }

      function stripAnsi(s) {
        return String(s).replace(/\x1b\[[^m]*m/g, "");
      }
      function vlen(s) {
        return stripAnsi(s).length;
      }
      function tw() {
        return Math.max(20, out.columns || 80);
      }
      function th() {
        return Math.max(5, out.rows || 24);
      }
      function clamp(v, lo, hi) {
        return Math.max(lo, Math.min(hi, v));
      }

      function trunc(s, n) {
        if (!s) return "";
        s = String(s);
        if (s.length <= n) return s;
        if (n <= 1) return "…";
        return s.slice(0, n - 1) + "…";
      }
      function rpad(s, n) {
        const l = vlen(s);
        return l >= n ? s : s + " ".repeat(n - l);
      }
      function lpad(s, n) {
        const l = vlen(s);
        return l >= n ? s : " ".repeat(n - l) + s;
      }

      function fmtTime(sec) {
        if (!isFinite(sec) || sec < 0) return "0:00";
        sec = Math.floor(sec);
        const h = Math.floor(sec / 3600),
          m = Math.floor((sec % 3600) / 60),
          s = sec % 60;
        if (h > 0)
          return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
        return `${m}:${String(s).padStart(2, "0")}`;
      }

      function fmtSize(b) {
        if (!b) return "?";
        if (b < 1024) return b + "B";
        if (b < 1048576) return (b / 1024).toFixed(1) + "KB";
        if (b < 1073741824) return (b / 1048576).toFixed(1) + "MB";
        return (b / 1073741824).toFixed(2) + "GB";
      }

      function fmtCh(n, layout) {
        const map = {
          mono: "Mono",
          stereo: "Stereo",
          5.1: "5.1",
          "5.1(side)": "5.1",
          7.1: "7.1",
        };
        if (layout && map[layout]) return map[layout];
        if (n === 1) return "Mono";
        if (n === 2) return "Stereo";
        if (n) return n + "ch";
        return "?";
      }

      module.exports = {
        T,
        ESC,
        wr,
        clrLine,
        gotoRow,
        hideCursor,
        showCursor,
        saveCur,
        restCur,
        cc,
        stripAnsi,
        vlen,
        tw,
        th,
        clamp,
        trunc,
        rpad,
        lpad,
        fmtTime,
        fmtSize,
        fmtCh,
      };

      /***/
    },

    /***/ 253: /***/ (module) => {
      module.exports = eval("require")("bufferutil");

      /***/
    },

    /***/ 348: /***/ (module) => {
      module.exports = eval("require")("utf-8-validate");

      /***/
    },

    /***/ 181: /***/ (module) => {
      "use strict";
      module.exports = require("buffer");

      /***/
    },

    /***/ 317: /***/ (module) => {
      "use strict";
      module.exports = require("child_process");

      /***/
    },

    /***/ 982: /***/ (module) => {
      "use strict";
      module.exports = require("crypto");

      /***/
    },

    /***/ 434: /***/ (module) => {
      "use strict";
      module.exports = require("events");

      /***/
    },

    /***/ 896: /***/ (module) => {
      "use strict";
      module.exports = require("fs");

      /***/
    },

    /***/ 611: /***/ (module) => {
      "use strict";
      module.exports = require("http");

      /***/
    },

    /***/ 692: /***/ (module) => {
      "use strict";
      module.exports = require("https");

      /***/
    },

    /***/ 278: /***/ (module) => {
      "use strict";
      module.exports = require("net");

      /***/
    },

    /***/ 857: /***/ (module) => {
      "use strict";
      module.exports = require("os");

      /***/
    },

    /***/ 928: /***/ (module) => {
      "use strict";
      module.exports = require("path");

      /***/
    },

    /***/ 203: /***/ (module) => {
      "use strict";
      module.exports = require("stream");

      /***/
    },

    /***/ 756: /***/ (module) => {
      "use strict";
      module.exports = require("tls");

      /***/
    },

    /***/ 16: /***/ (module) => {
      "use strict";
      module.exports = require("url");

      /***/
    },

    /***/ 106: /***/ (module) => {
      "use strict";
      module.exports = require("zlib");

      /***/
    },

    /******/
  };
  /************************************************************************/
  /******/ // The module cache
  /******/ var __webpack_module_cache__ = {};
  /******/
  /******/ // The require function
  /******/ function __nccwpck_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ var cachedModule = __webpack_module_cache__[moduleId];
    /******/ if (cachedModule !== undefined) {
      /******/ return cachedModule.exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ // no module.id needed
      /******/ // no module.loaded needed
      /******/ exports: {},
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ var threw = true;
    /******/ try {
      /******/ __webpack_modules__[moduleId](
        module,
        module.exports,
        __nccwpck_require__,
      );
      /******/ threw = false;
      /******/
    } finally {
      /******/ if (threw) delete __webpack_module_cache__[moduleId];
      /******/
    }
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /************************************************************************/
  /******/ /* webpack/runtime/compat */
  /******/
  /******/ if (typeof __nccwpck_require__ !== "undefined")
    __nccwpck_require__.ab = __dirname + "/";
  /******/
  /************************************************************************/
  var __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be in strict mode.
  (() => {
    "use strict";

    const { findMpv } = __nccwpck_require__(404);
    const { loadConfig } = __nccwpck_require__(825);
    const { Player } = __nccwpck_require__(140);
    const { showCursor } = __nccwpck_require__(921);

    async function main() {
      const args = process.argv.slice(2).filter((a) => a !== "--");

      if (!args.length || args[0] === "-h" || args[0] === "--help") {
        process.stdout.write(`
tplay — TUI Music Player with Discord RPC

Usage:  node player.js <file|folder> [...]

Keys:
  Space        Pause / Resume
  ← →          Seek ±10 seconds
  Ctrl+← →     Previous / Next track
  ↑ ↓          Volume ±5
  Ctrl+↑ ↓     Volume ±10
  + −          Volume ±5
  , .          Seek ±5 seconds
  [ ]          Seek ±30 seconds
  0            Restart track
  1−9          Jump to 10%−90%
  m            Toggle mute
  r            Cycle repeat: none → one → all
  s            Toggle shuffle
  i            Toggle file info panel
  p            Toggle playlist panel
  n / b        Next / Previous track
  PgUp/PgDn    Prev / Next track
  Home         Restart track
  q / Ctrl+C   Quit

Discord RPC:
  Set DISCORD_TOKEN env var or create config.json with:
  { "discord": { "token": "YOUR_TOKEN" } }

HTTP Server: (dynamic port, reported on startup)
  /nowplaying/track/info  - Track info (JSON)

Requires:  mpv     (audio backend)
Optional:  ffprobe (richer file info)
           ws      (npm, for Discord RPC)
`);
        process.exit(0);
      }

      const mpvBin = findMpv();
      if (!mpvBin) {
        process.stderr.write(
          "Error: mpv not found.\n" +
            "  Termux: pkg install mpv\n" +
            "  Debian: sudo apt install mpv\n" +
            "  Arch:   sudo pacman -S mpv\n" +
            "  macOS:  brew install mpv\n",
        );
        process.exit(1);
      }

      const config = loadConfig();
      const player = new Player(mpvBin, config);

      process.on("SIGINT", () => player._quit());
      process.on("SIGTERM", () => player._quit());

      process.on("uncaughtException", async (e) => {
        if (player._renderTimer) clearInterval(player._renderTimer);
        if (player._endCheckTimer) clearInterval(player._endCheckTimer);
        showCursor();
        if (process.stdin.isTTY)
          try {
            process.stdin.setRawMode(false);
          } catch {}
        process.stderr.write("\nCrash: " + e.stack + "\n");
        await player.mpv.quit().catch(() => {});
        process.exit(1);
      });

      await player.run(args);
    }

    main().catch((e) => {
      showCursor();
      process.stderr.write("Fatal: " + e.message + "\n");
      process.exit(1);
    });
  })();

  module.exports = __webpack_exports__;
  /******/
})();
