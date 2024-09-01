// priorityQueue.js
// Contains a priority queue implementation that uses a max heap. 
// Note that this implementation does not allow for repeat elements - if a 
// repeated element is inserted, its priority simply gets added to the 
// preexisting element in the queue.

export default class PriorityQueue {
  // Public methods
  constructor() {
    this.queue = []
    this.set = new Set();
    this.counter = 0;
  }
  isEmpty() {
    return this.length() === 0;
  }
  length() {
    return this.queue.length;
  }
  insert(element, priority) {
    if (this.set.has(element)) {
      for (let i = 0; i < this.length(); i++) {
        if (this.queue[i].element === element) {
          this.queue[i].priority += priority;
          this.bubbleUp(i);
        }
      }
    } else {
      this.set.add(element);
      this.queue.push({ 
        id: this.nextId(),
        element: element, 
        priority: priority
      });
      this.bubbleUp(this.queue.length - 1);
    }
  }
  extract() {
    if (this.isEmpty()) {
      return null;
    } 
    // Remove the element
    const extracted = this.queue[0].element;
    this.set.delete(extracted);
    
    if (this.length() === 1) {
      return this.queue.pop().element;
    }
    
    // Heapify 
    this.queue[0] = this.queue.pop();
    this.bubbleDown(0);
    
    return extracted;
  }
  convertToArray(threshold = null) {
    const array = [];
    while (!this.isEmpty()) {
      if (threshold && this.queue[0].priority < threshold) {
        break;
      }
      array.push(this.extract());
    }
    return array;
  }

  // Private methods
  nextId() {
    return this.counter++;
  }
  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.queue[parent].priority >= this.queue[index].priority) {
        break;
      }
      [this.queue[parent], this.queue[index]] = [this.queue[index], this.queue[parent]];
      index = parent;
    }
  }
  // returns true if first has priority over second
  hasPriority(first, second) {
    if (this.queue[first].priority > this.queue[second].priority) {
      return true;
    } else if (this.queue[first].priority === this.queue[second].priority) {
      return this.queue[first].id < this.queue[second].id;
    }
    return false;
  }
  bubbleDown(index) {
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    let maxIndex = index;

    if (left < this.queue.length && this.hasPriority(left, maxIndex)) {
      maxIndex = left;
    }

    if (right < this.queue.length && this.hasPriority(right, maxIndex)) {
      maxIndex = right;
    }

    if (index !== maxIndex) {
      [this.queue[index], this.queue[maxIndex]] = [this.queue[maxIndex], this.queue[index]];
      this.bubbleDown(maxIndex);
    }
  }
}
