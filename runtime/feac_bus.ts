import { EventEmitter } from "events";

// The Central Nervous System of your AI
class NeuralBus extends EventEmitter {}

export const bus = new NeuralBus();

// Wrapper untuk debugging dengan konversi aman
const originalEmit = bus.emit;
bus.emit = function(event, ...args) {
  // FIX: String(event) mencegah crash jika event berupa Symbol
  console.log(`[BUS EVENT] -> ${String(event)}`);
  return originalEmit.apply(bus, [event, ...args]);
};
