// Subject in the observer pattern. Lets views react to what happens in the
// models without the models knowing who is listening or how it is displayed.
export class Observable {
  #listeners = [];

  subscribe(listener) {
    this.#listeners.push(listener);
  }

  notify(eventType, details = {}) {
    for (const listener of this.#listeners) {
      listener(eventType, details);
    }
  }
}
