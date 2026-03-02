// src/observers/EventBus.js
// Observer Pattern — Singleton EventBus

class EventBus {
  constructor() {
    if (EventBus._instance) return EventBus._instance;
    this._listeners = {};
    EventBus._instance = this;
  }

  on(event, handler) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(handler);
  }

  off(event, handler) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter(h => h !== handler);
  }

  emit(event, payload) {
    const handlers = this._listeners[event] || [];
    handlers.forEach(handler => {
      try {
        handler(payload);
      } catch (err) {
        console.error(`[EventBus] Error in handler for event "${event}":`, err.message);
      }
    });
  }
}

const eventBus = new EventBus();
module.exports = eventBus;
