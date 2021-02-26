(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@rails/actioncable'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('angular2-actioncable', ['exports', '@angular/core', '@rails/actioncable', 'rxjs', 'rxjs/operators'], factory) :
    (global = global || self, factory(global['angular2-actioncable'] = {}, global.ng.core, global.ActionCableNs, global.rxjs, global.rxjs.operators));
}(this, (function (exports, core, ActionCableNs, rxjs, operators) { 'use strict';

    var ActionCable = ActionCableNs;
    var Cable = /** @class */ (function () {
        function Cable(url, params) {
            var _this = this;
            this.url = url;
            this.params = params;
            this.disconnectedSource = new rxjs.Subject();
            this.baseCable = ActionCable.createConsumer(this.buildUrl(url, params));
            // If a function is passed as params, re-evaluate it before attempting to reconnect
            if (params instanceof Function) {
                this.disconnected().subscribe(function () {
                    _this.baseCable.url = ActionCable.createWebSocketURL(_this.buildUrl(url, params));
                });
            }
        }
        /**
         * Create a new subscription to a channel, optionally with topic parameters.
         */
        Cable.prototype.channel = function (name, params) {
            var _this = this;
            if (params === void 0) { params = {}; }
            var channel = new Channel(this, name, params);
            channel.disconnected().subscribe(function (data) { return _this.disconnectedSource.next(data); });
            return channel;
        };
        /**
         * Emits when the WebSocket connection is closed.
         */
        Cable.prototype.disconnected = function () {
            return this.disconnectedSource.asObservable().pipe(operators.debounceTime(100));
        };
        /**
         * Close the connection.
         */
        Cable.prototype.disconnect = function () {
            this.baseCable.disconnect();
        };
        Cable.prototype.buildUrl = function (url, params) {
            if (params instanceof Function) {
                params = params();
            }
            if (!params) {
                return url;
            }
            var paramString = Object.keys(params)
                .map(function (key) { return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]); })
                .join('&');
            return [url, paramString].join('?');
        };
        return Cable;
    }());
    var Channel = /** @class */ (function () {
        function Channel(cable, name, params) {
            var _this = this;
            if (params === void 0) { params = {}; }
            this.cable = cable;
            this.name = name;
            this.params = params;
            this.initializedSource = new rxjs.Subject();
            this.connectedSource = new rxjs.Subject();
            this.disconnectedSource = new rxjs.Subject();
            this.rejectedSource = new rxjs.Subject();
            this.eventTypes = ['initialized', 'connected', 'disconnected', 'rejected'];
            var channelParams = Object.assign({}, params, { channel: name });
            this.messages = new rxjs.Observable(function (observer) {
                var mixin = {
                    received: function (data) { return observer.next(data); },
                };
                _this.eventTypes.forEach(function (type) {
                    mixin[type] = function (data) { return _this[type + "Source"].next(data); };
                });
                _this.baseChannel = _this.cable.baseCable.subscriptions.create(channelParams, mixin);
                return function () { return _this.unsubscribe(); };
            });
        }
        /**
         * Emits messages that have been broadcast to the channel.
         * For easy clean-up, when this Observable is completed the ActionCable channel will also be closed.
         */
        Channel.prototype.received = function () {
            return this.messages;
        };
        /**
         * Emits when the subscription is initialized.
         */
        Channel.prototype.initialized = function () {
            return this.initializedSource.asObservable();
        };
        /**
         * Emits when the subscription is ready for use on the server.
         */
        Channel.prototype.connected = function () {
            return this.connectedSource.asObservable();
        };
        /**
         * Emits when the WebSocket connection is closed.
         */
        Channel.prototype.disconnected = function () {
            return this.disconnectedSource.asObservable();
        };
        /**
         * Emits when the subscription is rejected by the server.
         */
        Channel.prototype.rejected = function () {
            return this.rejectedSource.asObservable();
        };
        /**
         * Broadcast message to other clients subscribed to this channel.
         */
        Channel.prototype.send = function (data) {
            this.baseChannel.send(data);
        };
        /**
         * Perform a channel action with the optional data passed as an attribute.
         */
        Channel.prototype.perform = function (action, data) {
            this.baseChannel.perform(action, data);
        };
        /**
         * Unsubscribe from the channel.
         */
        Channel.prototype.unsubscribe = function () {
            var _this = this;
            this.baseChannel.unsubscribe();
            this.eventTypes.forEach(function (type) { return _this[type + "Source"].complete(); });
        };
        return Channel;
    }());

    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var ActionCableService = /** @class */ (function () {
        function ActionCableService() {
            this.cables = {};
        }
        /**
         * Open a new ActionCable connection to the url. Any number of connections can be created.
         */
        ActionCableService.prototype.cable = function (url, params) {
            if (!this.cables.hasOwnProperty(url)) {
                this.cables[url] = new Cable(url, params);
            }
            return this.cables[url];
        };
        /**
         * Close an open connection for the url.
         */
        ActionCableService.prototype.disconnect = function (url) {
            if (this.cables.hasOwnProperty(url)) {
                this.cables[url].disconnect();
                delete this.cables[url];
            }
        };
        ActionCableService = __decorate([
            core.Injectable()
        ], ActionCableService);
        return ActionCableService;
    }());

    exports.ActionCableService = ActionCableService;
    exports.Cable = Cable;
    exports.Channel = Channel;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=angular2-actioncable.umd.js.map
